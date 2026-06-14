import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

const SITE = 'https://royallclean.es'

const blogRoutes = [
  {
    slug: 'como-quitar-pegamento-cristal',
    title: 'Cómo quitar pegamento de un cristal: guía paso a paso',
    description: 'Aprende a quitar pegamento de un cristal como lo hacen los profesionales: con un rascador de vitrocerámica. Rápido, económico y sin rayar el vidrio.',
    keywords: 'quitar pegamento cristal, eliminar adhesivo vidrio, rascador vitroceramica cristal, cinta adhesiva escaparate, pegamento en cristal madrid, quitar etiquetas cristal, limpiar restos adhesivo cristal',
    date: '2026-06-07',
  },
  {
    slug: 'limpieza-cristales-primavera-polen-pajaros-insectos',
    title: 'Limpieza de cristales en primavera: polen, pájaros e insectos',
    description: 'Limpieza de cristales en primavera: cómo eliminar el polen, heces de pájaros e insectos de escaparates y ventanas. Guía profesional para negocios en Madrid.',
    keywords: 'limpieza cristales primavera, eliminar polen cristales, limpiar heces pajaros cristal, escaparates primavera madrid',
    date: '2026-06-05',
  },
  {
    slug: 'como-limpiar-cristales-en-invierno',
    title: 'Cómo limpiar cristales en invierno sin dejar marcas',
    description: 'Cómo limpiar cristales en invierno sin dejar marcas. Consejos contra la humedad, condensación y bajas temperaturas. Empresa de limpieza de cristales en Madrid.',
    keywords: 'limpiar cristales invierno, condensacion cristales, limpieza cristales frio madrid, cristales sin marcas invierno',
    date: '2025-12-10',
  },
  {
    slug: 'como-mantener-cristales-limpios-verano',
    title: 'Cómo mantener los cristales limpios durante el verano',
    description: 'Cómo mantener los cristales limpios en verano. Elimina polvo, insectos y marcas de los escaparates. Limpieza profesional de cristales para comercios y empresas en Madrid.',
    keywords: 'cristales limpios verano, limpiar escaparates verano, polvo cristales verano madrid, limpieza cristales calor',
    date: '2025-06-15',
  },
  {
    slug: 'como-limpiar-cristales-despues-del-invierno',
    title: 'Cómo limpiar cristales después del invierno: guía para negocios y comercios',
    description: 'Cómo limpiar cristales después del invierno y eliminar el polen de escaparates. Guía de limpieza profesional de cristales en primavera para negocios y comercios en Madrid.',
    keywords: 'limpiar cristales despues invierno, limpieza escaparates primavera, cristales negocios madrid, eliminar suciedad invierno cristal',
    date: '2026-03-20',
  },
  {
    slug: 'como-preparar-cristales-para-el-otono',
    title: 'Cómo preparar los cristales y escaparates para el otoño',
    description: 'Limpieza de cristales en otoño: elimina manchas de lluvia, hojas y humedad de escaparates y fachadas. Prepara tu negocio para Black Friday e invierno. Empresa en Madrid.',
    keywords: 'limpieza cristales otono, escaparates otono madrid, limpiar cristales lluvia, preparar negocio otono cristales',
    date: '2025-09-10',
  },
]

function injectBlogHtmlPlugin() {
  return {
    name: 'inject-blog-html',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist')
      const baseHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

      const patchHtml = (html, { title, description, keywords, url }) => {
        const fullTitle = `${title} | Royall Clean`
        return html
          .replace(/(<title>)[^<]*(<\/title>)/, `$1${fullTitle}$2`)
          .replace(/(<meta name="title"[^>]*content=")[^"]*(")/,        `$1${fullTitle}$2`)
          .replace(/(<meta name="description"[^>]*content=")[^"]*(")/,  `$1${description}$2`)
          .replace(/(<meta property="og:title"[^>]*content=")[^"]*(")/,       `$1${fullTitle}$2`)
          .replace(/(<meta property="og:description"[^>]*content=")[^"]*(")/,`$1${description}$2`)
          .replace(/(<meta property="og:url"[^>]*content=")[^"]*(")/,         `$1${url}$2`)
          .replace(/(<meta name="twitter:title"[^>]*content=")[^"]*(")/,      `$1${fullTitle}$2`)
          .replace(/(<meta name="twitter:description"[^>]*content=")[^"]*(")/,`$1${description}$2`)
          .replace(/(<link rel="canonical"[^>]*href=")[^"]*(")/,              `$1${url}$2`)
          .replace('</head>', `<meta name="keywords" content="${keywords}">\n</head>`)
      }

      // /blog listing
      const blogDir = path.join(distDir, 'blog')
      fs.mkdirSync(blogDir, { recursive: true })
      const blogHtml = baseHtml
        .replace(/(<title>)[^<]*(<\/title>)/,                                     '$1Blog de limpieza de cristales | Royall Clean Madrid$2')
        .replace(/(<meta name="description"[^>]*content=")[^"]*(")/,              '$1Consejos y guías profesionales para mantener tus cristales limpios. Blog de Royall Clean, limpiacristales en Madrid.$2')
        .replace(/(<link rel="canonical"[^>]*href=")[^"]*(")/,                    `$1${SITE}/blog$2`)
      fs.writeFileSync(path.join(blogDir, 'index.html'), blogHtml)

      // Each article
      for (const article of blogRoutes) {
        const dir = path.join(blogDir, article.slug)
        fs.mkdirSync(dir, { recursive: true })
        const articleUrl = `${SITE}/blog/${article.slug}`
        const fullTitle = `${article.title} | Royall Clean`

        const blogPostingLd = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': article.title,
          'description': article.description,
          'keywords': article.keywords,
          'datePublished': article.date,
          'dateModified': article.date,
          'url': articleUrl,
          'mainEntityOfPage': { '@type': 'WebPage', '@id': articleUrl },
          'inLanguage': 'es-ES',
          'image': {
            '@type': 'ImageObject',
            'url': `${SITE}/og-image.webp`,
            'width': 1200,
            'height': 630,
          },
          'author': {
            '@type': 'Organization',
            'name': 'Royall Clean',
            'url': SITE,
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Royall Clean',
            'logo': {
              '@type': 'ImageObject',
              'url': `${SITE}/ROYAL_CLEAN_2025_BLANCO.png`,
              'width': 400,
              'height': 200,
            },
          },
          'isPartOf': {
            '@type': 'Blog',
            'name': 'Blog de limpieza de cristales | Royall Clean',
            'url': `${SITE}/blog`,
          },
        })

        const breadcrumbLd = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': `${SITE}/` },
            { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${SITE}/blog` },
            { '@type': 'ListItem', 'position': 3, 'name': article.title, 'item': articleUrl },
          ],
        })

        const extraSchemas = `<script type="application/ld+json">${blogPostingLd}</script>\n<script type="application/ld+json">${breadcrumbLd}</script>\n`

        let html = patchHtml(baseHtml, {
          title: article.title,
          description: article.description,
          keywords: article.keywords,
          url: articleUrl,
        })
        html = html.replace('</head>', `${extraSchemas}</head>`)
        fs.writeFileSync(path.join(dir, 'index.html'), html)
      }

      console.log('[inject-blog-html] Generated static HTML for blog + 6 articles')
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    injectBlogHtmlPlugin(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('mapbox')) return 'mapbox';
          if (id.includes('jspdf') || id.includes('html2canvas')) return 'pdf';
          if (id.includes('sweetalert') || id.includes('ant-design-vue') || id.includes('@syncfusion')) return 'ui-extra';
          if (id.includes('@fortawesome') || id.includes('bootstrap-icons')) return 'icons';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
})
