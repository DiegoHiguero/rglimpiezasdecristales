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

const serviceRoutes = [
  {
    slug: 'limpieza-cristales-hogares',
    name: 'Limpieza de cristales para hogares en Madrid',
    title: 'Limpieza de Cristales para Hogares en Madrid',
    description: 'Limpieza profesional de cristales para casas y pisos en Madrid. Interior y exterior, marcos y balcones. Presupuesto gratis en 24 h. ☎ 696 169 435',
    keywords: 'limpieza cristales hogar madrid, limpieza ventanas piso, limpiacristales domicilio madrid, limpieza cristales casa particular',
    breadcrumbLabel: 'Hogares',
    faqs: [
      { q: '¿Tengo que estar en casa durante la limpieza?', a: 'Lo recomendable es que sí, al menos para abrir la puerta y mostrarnos las ventanas, pero si no puedes estar presente podemos coordinar el acceso con un familiar, vecino o portero.' },
      { q: '¿Limpiáis también el cristal de la mampara de la ducha?', a: 'Sí, es un servicio adicional habitual dentro de la limpieza de hogares, sobre todo para eliminar la cal acumulada.' },
      { q: '¿Cuánto cuesta limpiar los cristales de un piso?', a: 'El precio depende del número de ventanas, si tienen mosquitera o persiana, y la altura del inmueble. Te damos un presupuesto cerrado y gratuito en menos de 24 horas, sin compromiso.' },
    ],
  },
  {
    slug: 'limpieza-cristales-comunidades',
    name: 'Limpieza de cristales para comunidades de vecinos en Madrid',
    title: 'Limpieza de Cristales para Comunidades de Vecinos en Madrid',
    description: 'Mantenimiento de cristales en portales y zonas comunes de comunidades de vecinos en Madrid. Presupuesto para administradores de fincas en 24 h.',
    keywords: 'limpieza cristales comunidad de vecinos, limpieza cristaleras portal madrid, mantenimiento cristales comunidad, limpieza zonas comunes edificio',
    breadcrumbLabel: 'Comunidades',
    faqs: [
      { q: '¿Podéis facturar directamente a la comunidad?', a: 'Sí, emitimos factura a nombre de la comunidad de propietarios para que el administrador pueda incluirla en la contabilidad habitual.' },
      { q: '¿Hace falta convocar una junta para contratar el servicio?', a: 'No es necesario para empezar: podemos dar un presupuesto orientativo que el administrador o el presidente puede presentar en la siguiente junta antes de firmar el contrato definitivo.' },
      { q: '¿Limpiáis también las plantas altas sin andamio?', a: 'Sí, con pértiga telescópica llegamos hasta 5 plantas de altura sin necesidad de andamios ni permisos especiales, lo que reduce considerablemente el coste frente a otros métodos.' },
    ],
  },
  {
    slug: 'limpieza-cristales-locales-comerciales',
    name: 'Limpieza de cristales para locales comerciales y escaparates en Madrid',
    title: 'Limpieza de Cristales para Locales Comerciales en Madrid',
    description: 'Limpieza de escaparates y cristales para negocios en Madrid. Horarios fuera de apertura, factura para empresas. Presupuesto gratis en 24 h.',
    keywords: 'limpieza cristales locales comerciales madrid, limpieza escaparates madrid, limpiacristales negocios madrid, limpieza cristales oficinas',
    breadcrumbLabel: 'Locales comerciales',
    faqs: [
      { q: '¿Podéis limpiar fuera del horario de apertura?', a: 'Sí, es lo habitual: trabajamos antes de que abras o después del cierre para no afectar a tu actividad ni a tus clientes.' },
      { q: '¿Hacéis contratos de mantenimiento para varios locales?', a: 'Sí, si gestionas varias tiendas u oficinas en Madrid podemos coordinar un calendario único con condiciones especiales por volumen.' },
      { q: '¿Retiráis vinilos antiguos del escaparate?', a: 'Sí, retiramos vinilos y restos de adhesivo sin rayar el cristal, dejando la superficie lista para una nueva decoración o totalmente limpia.' },
    ],
  },
  {
    slug: 'limpieza-cristales-altura',
    name: 'Limpieza de cristales en altura y fachadas en Madrid',
    title: 'Limpieza de Cristales en Altura y Fachadas en Madrid',
    description: 'Limpieza de fachadas y cristales en altura en Madrid con pértiga telescópica, sin andamios. Hasta 5 plantas. Presupuesto gratis en 24 h.',
    keywords: 'limpieza cristales en altura madrid, limpieza fachadas acristaladas, limpieza ventanas altura sin andamios, pertiga telescopica limpieza cristales',
    breadcrumbLabel: 'Limpieza en altura',
    faqs: [
      { q: '¿Hasta qué altura podéis limpiar sin andamio?', a: 'Con pértiga telescópica llegamos sin problema hasta 5 plantas de altura. Para edificios más altos, estudiamos cada caso de forma individual.' },
      { q: '¿Necesito pedir algún permiso para este tipo de limpieza?', a: 'Con pértiga telescópica, al no ocupar la vía pública ni requerir instalación de andamios, normalmente no se necesita ningún permiso municipal.' },
      { q: '¿El agua que usáis deja marcas en el cristal?', a: 'No, trabajamos con agua desionizada, que se seca sin dejar restos de cal ni marcas, a diferencia del agua del grifo convencional.' },
    ],
  },
  {
    slug: 'limpieza-placas-solares',
    name: 'Limpieza de placas solares en Madrid',
    title: 'Limpieza de Placas Solares en Madrid',
    description: 'Limpieza profesional de placas solares en Madrid con agua desmineralizada. Recupera hasta un 25% de rendimiento. Presupuesto gratis en 24 h.',
    keywords: 'limpieza placas solares madrid, limpieza paneles fotovoltaicos, mantenimiento placas solares, limpieza paneles solares precio',
    breadcrumbLabel: 'Placas solares',
    faqs: [
      { q: '¿La limpieza puede dañar la garantía de los paneles?', a: 'No, usamos métodos no abrasivos (agua desmineralizada y cepillos suaves) que no afectan a la garantía del fabricante. Evitamos cualquier producto o herramienta que pueda rayar el cristal del panel.' },
      { q: '¿Cuánto se recupera de rendimiento con la limpieza?', a: 'Depende del nivel de suciedad acumulada, pero en instalaciones muy sucias hemos visto recuperaciones de rendimiento de hasta un 20-25%, especialmente tras meses sin lluvia.' },
      { q: '¿Trabajáis en cubiertas de difícil acceso?', a: 'Sí, contamos con equipo y formación para trabajar en cubiertas inclinadas y de difícil acceso con las medidas de seguridad necesarias.' },
    ],
  },
  {
    slug: 'limpieza-fin-de-obra',
    name: 'Limpieza de obras y fin de obra en Madrid',
    title: 'Limpieza de Obras y Fin de Obra en Madrid',
    description: 'Limpieza profesional de obras y fin de obra en Madrid. Cristales, suelos y azulejos listos para estrenar. Presupuesto gratis en 24 h.',
    keywords: 'limpieza fin de obra madrid, limpieza tras reforma, limpieza de obras precio, limpieza post obra cristales',
    breadcrumbLabel: 'Fin de obra',
    faqs: [
      { q: '¿Cuánto tiempo después de la obra se puede hacer la limpieza?', a: 'Lo ideal es justo al terminar los trabajos de pintura y antes de meter mobiliario, pero podemos adaptarnos a cualquier fase posterior de la obra.' },
      { q: '¿Quitáis los restos de pintura y silicona de los cristales?', a: 'Sí, eliminamos salpicaduras de pintura, restos de silicona y cinta de carrocero de los cristales sin rayar el vidrio.' },
      { q: '¿Trabajáis en locales comerciales antes de la apertura?', a: 'Sí, es uno de los servicios más solicitados: dejamos el local listo para abrir, con cristales, suelos y mobiliario limpios de polvo de obra.' },
    ],
  },
  {
    slug: 'limpieza-grafitis',
    name: 'Limpieza y eliminación de grafitis en Madrid',
    title: 'Limpieza de Grafitis en Madrid',
    description: 'Eliminación profesional de grafitis en fachadas, muros y portales en Madrid. Sin dañar la superficie. Presupuesto gratis en 24 h.',
    keywords: 'limpieza de grafitis madrid, eliminar grafitis fachada, quitar grafiti pared, limpieza antigrafiti madrid',
    breadcrumbLabel: 'Grafitis',
    faqs: [
      { q: '¿Podéis eliminar cualquier tipo de grafiti?', a: 'La gran mayoría se elimina sin problema. En pinturas muy antiguas o superficies muy porosas, el resultado puede no ser al 100%, pero siempre conseguimos una mejora muy notable.' },
      { q: '¿Cuánto tarda en eliminarse un grafiti?', a: 'Depende del tamaño y la superficie, pero la mayoría de los trabajos se resuelven en una sola visita de unas pocas horas.' },
      { q: '¿Recomendáis algo para evitar que vuelva a pasar?', a: 'Sí, en fachadas con grafitis recurrentes recomendamos un recubrimiento antigrafiti que facilita mucho la limpieza futura.' },
    ],
  },
  {
    slug: 'retirada-de-vinilos',
    name: 'Retirada de vinilos en escaparates y cristales en Madrid',
    title: 'Retirada de Vinilos en Escaparates y Cristales en Madrid',
    description: 'Retirada profesional de vinilos en escaparates y cristales en Madrid, sin rayar ni dejar adhesivo. Presupuesto gratis en 24 h.',
    keywords: 'retirada de vinilos madrid, quitar vinilo escaparate, eliminar rotulacion cristal, quitar adhesivo escaparate madrid',
    breadcrumbLabel: 'Vinilos',
    faqs: [
      { q: '¿Puede quedar el cristal rayado al retirar el vinilo?', a: 'No, con la técnica de calor y rascador de vitrocerámica que usamos, el vinilo se desprende sin rayar el cristal.' },
      { q: '¿También retiráis vinilos muy antiguos o resecos?', a: 'Sí, aunque los vinilos muy antiguos y resecos pueden requerir algo más de tiempo, los retiramos igualmente sin dañar la superficie.' },
      { q: '¿Podéis colocar también el vinilo nuevo?', a: 'Nuestro servicio se centra en la retirada y limpieza del cristal; dejamos la superficie perfectamente lista para que tu rotulista coloque la nueva decoración.' },
    ],
  },
]

const staticPages = [
  {
    route: 'contacto',
    title: 'Presupuesto Limpieza de Cristales en Madrid | Royall Clean',
    description: 'Pide tu presupuesto gratuito de limpieza de cristales y ventanas en Madrid. Sin compromiso, respuesta en menos de 24 horas. ☎ 696 169 435',
  },
  {
    route: 'politica-privacidad',
    title: 'Política de Privacidad | Royall Clean',
    description: 'Consulta la política de privacidad de Royall Clean. Información sobre el tratamiento de tus datos personales conforme al RGPD.',
  },
  {
    route: 'aviso-legal',
    title: 'Aviso Legal | Royall Clean',
    description: 'Aviso legal de Royall Clean. Información sobre el titular del sitio web, condiciones de uso y propiedad intelectual.',
  },
]

// El JSON-LD de la home incluye un FAQPage con preguntas específicas de la
// home (precios, zonas, etc.) que no corresponden al contenido visible de
// las demás páginas. Lo quitamos del HTML base que usan páginas secundarias
// para que cada una solo declare el FAQPage (si tiene) que coincide con su
// propio contenido.
function stripHomeFaqPage(html) {
  return html.replace(
    /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,
    (match, open, jsonStr, close) => {
      try {
        const data = JSON.parse(jsonStr)
        if (Array.isArray(data['@graph'])) {
          data['@graph'] = data['@graph'].filter((item) => item['@type'] !== 'FAQPage')
        }
        return open + JSON.stringify(data) + close
      } catch {
        return match
      }
    }
  )
}

function injectBlogHtmlPlugin() {
  return {
    name: 'inject-blog-html',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist')
      const baseHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')
      const baseHtmlNoFaq = stripHomeFaqPage(baseHtml)

      const patchHtml = (html, { fullTitle, description, keywords, url }) => {
        let patched = html
          .replace(/(<title>)[^<]*(<\/title>)/, `$1${fullTitle}$2`)
          .replace(/(<meta name="title"[^>]*content=")[^"]*(")/,        `$1${fullTitle}$2`)
          .replace(/(<meta name="description"[^>]*content=")[^"]*(")/,  `$1${description}$2`)
          .replace(/(<meta property="og:title"[^>]*content=")[^"]*(")/,       `$1${fullTitle}$2`)
          .replace(/(<meta property="og:description"[^>]*content=")[^"]*(")/,`$1${description}$2`)
          .replace(/(<meta property="og:url"[^>]*content=")[^"]*(")/,         `$1${url}$2`)
          .replace(/(<meta name="twitter:title"[^>]*content=")[^"]*(")/,      `$1${fullTitle}$2`)
          .replace(/(<meta name="twitter:description"[^>]*content=")[^"]*(")/,`$1${description}$2`)
          .replace(/(<link rel="canonical"[^>]*href=")[^"]*(")/,              `$1${url}$2`)
        if (keywords) {
          patched = patched.replace('</head>', `<meta name="keywords" content="${keywords}">\n</head>`)
        }
        return patched
      }

      // Static pages (contacto, política de privacidad, aviso legal)
      // Se escriben como archivos planos (contacto.html), NO como contacto/index.html:
      // Firebase Hosting trata cualquier carpeta con index.html como un directorio y
      // redirige con 301 la URL sin barra final a la URL con barra, lo que rompe el
      // sitemap/canonical (que usan la URL sin barra) y hace que Google nunca llegue
      // al contenido real — exactamente el aviso "Página con redirección".
      for (const page of staticPages) {
        const html = patchHtml(baseHtmlNoFaq, {
          fullTitle: page.title,
          description: page.description,
          url: `${SITE}/${page.route}`,
        })
        fs.writeFileSync(path.join(distDir, `${page.route}.html`), html)
      }

      // Service pages
      for (const service of serviceRoutes) {
        const serviceUrl = `${SITE}/${service.slug}`
        const fullTitle = `${service.title} | Royall Clean`

        const serviceLd = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: service.name,
          name: service.name,
          description: service.description,
          provider: { '@id': `${SITE}/#business` },
          areaServed: { '@type': 'State', name: 'Comunidad de Madrid' },
          url: serviceUrl,
        })

        const breadcrumbLd = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': `${SITE}/` },
            { '@type': 'ListItem', 'position': 2, 'name': service.breadcrumbLabel, 'item': serviceUrl },
          ],
        })

        const faqLd = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': service.faqs.map((f) => ({
            '@type': 'Question',
            'name': f.q,
            'acceptedAnswer': { '@type': 'Answer', 'text': f.a },
          })),
        })

        const extraSchemas = `<script type="application/ld+json" data-dynamic-schema="true">${serviceLd}</script>\n<script type="application/ld+json" data-dynamic-schema="true">${breadcrumbLd}</script>\n<script type="application/ld+json" data-dynamic-schema="true">${faqLd}</script>\n`

        let html = patchHtml(baseHtmlNoFaq, {
          fullTitle,
          description: service.description,
          keywords: service.keywords,
          url: serviceUrl,
        })
        html = html.replace('</head>', `${extraSchemas}</head>`)
        fs.writeFileSync(path.join(distDir, `${service.slug}.html`), html)
      }

      // /blog listing
      const blogHtml = patchHtml(baseHtmlNoFaq, {
        fullTitle: 'Blog de limpieza de cristales | Royall Clean Madrid',
        description: 'Consejos y guías profesionales para mantener tus cristales limpios. Blog de Royall Clean, limpiacristales en Madrid.',
        url: `${SITE}/blog`,
      })
      const blogDir = path.join(distDir, 'blog')
      fs.mkdirSync(blogDir, { recursive: true })
      fs.writeFileSync(path.join(distDir, 'blog.html'), blogHtml)

      // Each article
      for (const article of blogRoutes) {
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

        const extraSchemas = `<script type="application/ld+json" data-dynamic-schema="true">${blogPostingLd}</script>\n<script type="application/ld+json" data-dynamic-schema="true">${breadcrumbLd}</script>\n`

        let html = patchHtml(baseHtmlNoFaq, {
          fullTitle,
          description: article.description,
          keywords: article.keywords,
          url: articleUrl,
        })
        html = html.replace('</head>', `${extraSchemas}</head>`)
        fs.writeFileSync(path.join(blogDir, `${article.slug}.html`), html)
      }

      console.log('[inject-blog-html] Generated static HTML for static pages + 8 service pages + blog + 6 articles')
    },
  }
}

function debugImporterChainPlugin() {
  return {
    name: 'debug-importer-chain',
    buildEnd() {
      const targets = ['/jspdf/dist/jspdf.es.min.js', '/mapbox-gl/dist/mapbox-gl.js', '/mapbox-gl-geocoder', '/mapbox-sdk'];
      const moduleIds = this.getModuleIds ? [...this.getModuleIds()] : [];
      for (const id of moduleIds) {
        if (targets.some((t) => id.includes(t))) {
          const info = this.getModuleInfo(id);
          console.log('\n[DEBUG] target module:', id);
          console.log('[DEBUG] importers:', info.importers);
          console.log('[DEBUG] dynamicImporters:', info.dynamicImporters);
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [
    vue(),
    injectBlogHtmlPlugin(),
  ],
  build: {
    modulePreload: {
      // Aunque "mapbox" y "pdf" solo se llegan a importar de forma dinámica
      // desde vistas de administración (MisClientes, Register, LimpiezasMensuales),
      // Vite los incluye por defecto en el <link rel="modulepreload"> de TODAS
      // las páginas. Eso fuerza ~1.6 MB de JS de admin en cada visita pública.
      // Los filtramos aquí para que solo se precarguen donde realmente hacen falta.
      resolveDependencies: (filename, deps) =>
        deps.filter((dep) => !dep.includes('/mapbox-') && !dep.includes('/pdf-')),
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('sweetalert') || id.includes('ant-design-vue') || id.includes('@syncfusion')) return 'ui-extra';
          if (id.includes('@fortawesome') || id.includes('bootstrap-icons')) return 'icons';
          // Deliberadamente NO forzamos un chunk con nombre para "mapbox" ni
          // "jspdf/html2canvas": ambos solo se usan dentro de vistas de admin
          // cargadas con import() dinámico (Mapa/Register, LimpiezasMensuales).
          // Forzar un nombre propio para ellas hacía que Rollup generase un
          // import estático de esas dependencias en el chunk de entrada (se
          // acababan descargando en cada visita pública). Sin esta regla,
          // Rollup las deja aisladas de forma automática dentro del chunk
          // async que realmente las usa.
          // Sin catch-all genérico de "vendor": así Rollup decide por sí mismo
          // qué dependencias de node_modules van en el chunk de entrada (las
          // que se usan de forma eager en páginas públicas) y cuáles quedan
          // aisladas dentro del chunk de la ruta que las usa de forma lazy.
        },
      },
    },
  },
})
