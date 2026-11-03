// Tras `vite build`, las páginas públicas (home, servicios, blog, legales)
// se sirven como una SPA: el HTML inicial trae el <head> correcto pero el
// <body> está vacío hasta que Vue lo renderiza en el navegador. Eso es
// invisible para crawlers que no ejecutan JS (Bing, GPTBot, ClaudeBot...).
//
// Este script abre cada URL del sitemap en un Chrome real (headless),
// espera a que Vue termine de montar el contenido, y sobrescribe el
// index.html estático de esa ruta con el HTML ya renderizado. Los usuarios
// reales siguen viendo la SPA normal: en cuanto carga el bundle de Vue,
// monta sobre el mismo contenido y la página sigue siendo interactiva.

const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');

const distDir = path.resolve(__dirname, '..', 'dist');
const PORT = 4399;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json',
};

function findChrome() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('No se encontró Chrome/Edge instalado. Define PUPPETEER_EXECUTABLE_PATH.');
}

function getRoutesFromSitemap() {
  const xml = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf-8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return urls.map((u) => u.replace(/^https?:\/\/[^/]+/, '') || '/');
}

function startServer() {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath;
    if (urlPath === '/' || urlPath === '') {
      filePath = path.join(distDir, 'index.html');
    } else if (path.extname(urlPath)) {
      filePath = path.join(distDir, urlPath);
    } else {
      // Misma resolución que Firebase Hosting en producción: /ruta -> ruta.html
      filePath = path.join(distDir, `${urlPath}.html`);
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

function targetFileForRoute(route) {
  if (route === '/' || route === '') return path.join(distDir, 'index.html');
  return path.join(distDir, `${route.replace(/^\//, '')}.html`);
}

async function main() {
  const routes = getRoutesFromSitemap();
  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log(`[prerender] Renderizando ${routes.length} rutas...`);
  let ok = 0;
  let failed = [];

  for (const route of routes) {
    const page = await browser.newPage();
    try {
      const target = targetFileForRoute(route);
      // El <head> que ya escribió el build (injectBlogHtmlPlugin) es correcto
      // tal cual: title/canonical/OG/schema por ruta, y trucos de carga como
      // el preload+swap de la fuente. Si en vez de eso usáramos page.content()
      // (documento completo tras ejecutar JS), capturaríamos el <head> ya
      // "mutado" por ese mismo JS — por ejemplo, el link de la fuente con
      // rel="preload" ya intercambiado a rel="stylesheet" porque su evento
      // onload ya disparó — y horneamos ese estado para siempre en el HTML
      // estático, anulando la optimización para cualquier visita real futura.
      // Por eso solo tomamos el <body> ya renderizado y lo insertamos en el
      // <head> original sin tocar.
      const originalHtml = fs.readFileSync(target, 'utf-8');
      const htmlOpenTag = originalHtml.match(/<html[^>]*>/)[0];
      const headBlock = originalHtml.match(/<head>[\s\S]*?<\/head>/)[0];

      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForFunction(
        () => document.querySelector('#app') && document.querySelector('#app').children.length > 0,
        { timeout: 15000 }
      );
      // pequeño margen para animaciones/transiciones de montaje
      await new Promise((r) => setTimeout(r, 250));
      const bodyOuterHtml = await page.evaluate(() => document.body.outerHTML);

      const html = `<!DOCTYPE html>\n${htmlOpenTag}\n${headBlock}\n${bodyOuterHtml}\n</html>`;
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, html);
      ok++;
    } catch (err) {
      failed.push({ route, error: err.message });
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();

  console.log(`[prerender] OK: ${ok}/${routes.length}`);
  if (failed.length) {
    console.error('[prerender] Rutas con error:');
    failed.forEach((f) => console.error(`  ${f.route} -> ${f.error}`));
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('[prerender] Error fatal:', err);
  process.exitCode = 1;
});
