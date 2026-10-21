// Páginas por municipio. Mismo formato que servicios.js para reutilizar
// ServicioDetalle.vue. Cada página tiene contenido propio de la zona (tipo de
// edificios y trabajos habituales): páginas iguales cambiando solo el nombre
// del municipio las penaliza Google. Sin imports de imágenes: vite.config.js
// lo carga directamente con Node para generar el HTML estático.

export const zonas = [
  {
    slug: 'limpieza-cristales-getafe',
    areaServed: 'Getafe',
    breadcrumbLabel: 'Getafe',
    title: 'Limpieza de cristales en Getafe',
    excerpt: 'Pisos, chalets, comunidades y naves de los polígonos de Getafe: limpieza de cristales profesional, sin andamios y con presupuesto en 24 h.',
    metaTitle: 'Limpieza de Cristales en Getafe',
    metaDescription: 'Limpiacristales en Getafe para pisos, comunidades, locales y naves de los polígonos. Pértiga y agua pura sin andamios. Presupuesto gratis en 24 h.',
    keywords: 'limpieza cristales getafe, limpiacristales getafe, limpieza ventanas getafe, limpieza cristales naves getafe, limpieza cristales comunidades getafe',
    icon: ['fas', 'location-dot'],
    color: '#16a34a',
    colorPale: '#f0fdf4',
    tag: 'Zona sur',
    content: `
      <h2>Limpiacristales en Getafe</h2>
      <p>Getafe combina barrios residenciales como el Sector III, El Bercial, Getafe Norte o Los Molinos con uno de los mayores tejidos industriales del sur de Madrid, en polígonos como Los Olivos, San Marcos o El Lomo. En <strong>Royall Clean</strong> trabajamos en los dos mundos: viviendas y comunidades de vecinos por un lado, y naves, oficinas y locales por otro.</p>

      <h2>Pisos, chalets y comunidades de vecinos</h2>
      <p>En los bloques de viviendas de Getafe lo más habitual son las ventanas, los balcones y las terrazas acristaladas, además de los portales y cristaleras de zonas comunes. Con pértiga telescópica llegamos hasta 4 plantas desde el suelo, sin andamios, y emitimos factura a nombre de la comunidad para el administrador de fincas.</p>

      <h2>Naves, oficinas y locales en los polígonos</h2>
      <p>En las naves industriales y logísticas limpiamos ventanales, lucernarios y las oficinas acristaladas de la entrada. Nos adaptamos a los turnos de trabajo para no interferir en la actividad y ofrecemos contrato de mantenimiento con calendario fijo y factura para la empresa.</p>

      <h2>Servicios más pedidos en Getafe</h2>
      <ul>
        <li><a href="/limpieza-cristales-hogares">Limpieza de cristales para hogares</a>: pisos y chalets, por dentro y por fuera.</li>
        <li><a href="/limpieza-cristales-comunidades">Comunidades de vecinos</a>: portales, escaleras y cristaleras comunes.</li>
        <li><a href="/limpieza-cristales-oficinas">Oficinas y naves</a>: cristaleras, mamparas y lucernarios.</li>
        <li><a href="/limpieza-cristales-locales-comerciales">Locales comerciales</a>: escaparates sin cerrar el negocio.</li>
      </ul>

      <h2>Preguntas frecuentes sobre limpieza de cristales en Getafe</h2>
      <h3>¿Trabajáis en todos los barrios de Getafe?</h3>
      <p>Sí, damos servicio en todo el municipio, tanto en los barrios residenciales como en los polígonos industriales.</p>
      <h3>¿Limpiáis naves industriales?</h3>
      <p>Sí: ventanales, lucernarios y oficinas acristaladas de naves, con horarios adaptados a los turnos de la empresa y factura.</p>
      <h3>¿Cuánto cuesta limpiar los cristales de un piso en Getafe?</h3>
      <p>Como referencia, la limpieza de un piso parte de 55 €. El precio final depende del número de ventanas, la altura y la dificultad; puedes ver todas las tarifas en nuestra <a href="/precios">página de precios</a>.</p>
    `,
    faqs: [
      { q: '¿Trabajáis en todos los barrios de Getafe?', a: 'Sí, damos servicio en todo el municipio, tanto en los barrios residenciales como en los polígonos industriales.' },
      { q: '¿Limpiáis naves industriales?', a: 'Sí: ventanales, lucernarios y oficinas acristaladas de naves, con horarios adaptados a los turnos de la empresa y factura.' },
      { q: '¿Cuánto cuesta limpiar los cristales de un piso en Getafe?', a: 'Como referencia, la limpieza de un piso parte de 55 €. El precio final depende del número de ventanas, la altura y la dificultad.' },
    ],
  },
  {
    slug: 'limpieza-cristales-pozuelo-de-alarcon',
    areaServed: 'Pozuelo de Alarcón',
    breadcrumbLabel: 'Pozuelo de Alarcón',
    title: 'Limpieza de cristales en Pozuelo de Alarcón',
    excerpt: 'Chalets con grandes ventanales, cerramientos de terraza y oficinas en Pozuelo de Alarcón: limpieza profesional con agua pura hasta 10 metros.',
    metaTitle: 'Limpieza de Cristales en Pozuelo de Alarcón',
    metaDescription: 'Limpieza de cristales en Pozuelo de Alarcón: chalets, ventanales de doble altura, cerramientos y oficinas. Agua pura hasta 10 m sin andamios. Presupuesto en 24 h.',
    keywords: 'limpieza cristales pozuelo de alarcon, limpiacristales pozuelo, limpieza ventanas chalet pozuelo, limpieza cristales somosaguas, limpieza ventanales doble altura',
    icon: ['fas', 'location-dot'],
    color: '#ea580c',
    colorPale: '#fff7ed',
    tag: 'Zona oeste',
    content: `
      <h2>Limpiacristales en Pozuelo de Alarcón</h2>
      <p>Pozuelo de Alarcón es uno de los municipios con más viviendas unifamiliares del oeste de Madrid, con urbanizaciones como Somosaguas, Montealina o La Cabaña, y también con zonas de oficinas como la Avenida de Europa o la Ciudad de la Imagen. Son edificios con mucha superficie de cristal, que es justo donde más se nota una limpieza profesional.</p>

      <h2>Chalets con grandes ventanales</h2>
      <p>En los chalets de Pozuelo son habituales los ventanales de suelo a techo, las fachadas de doble altura, los porches y los cerramientos de terraza. Con nuestro sistema de <a href="/agua-pura-altura">agua pura Unger HydroPower</a> llegamos hasta 10 metros de altura desde el suelo, sin andamios, y el cristal se seca sin dejar marcas. Limpiamos por dentro y por fuera, con marcos, juntas y barandillas.</p>

      <h2>Cerramientos, pérgolas y claraboyas</h2>
      <p>Los techos de cristal de pérgolas, porches y claraboyas acumulan hojas, polvo y manchas de lluvia que con el tiempo se incrustan. Los limpiamos con cuidado de no dañar perfiles ni juntas, y dejamos el cristal transparente de nuevo.</p>

      <h2>Oficinas y empresas</h2>
      <p>Para las oficinas de Pozuelo ofrecemos <a href="/limpieza-cristales-oficinas">limpieza de cristales para empresas</a> con contrato de mantenimiento, horarios adaptados a tu jornada y factura.</p>

      <h2>Preguntas frecuentes sobre limpieza de cristales en Pozuelo</h2>
      <h3>¿Podéis limpiar ventanales de doble altura sin andamio?</h3>
      <p>Sí. Con agua pura Unger HydroPower llegamos hasta 10 metros trabajando desde el suelo, sin andamios ni escaleras apoyadas en la fachada.</p>
      <h3>¿Cuánto cuesta limpiar los cristales de un chalet en Pozuelo?</h3>
      <p>Como referencia, la limpieza de un chalet parte de 95 €. El precio final depende del número de ventanales, la altura y la dificultad; tienes todas las tarifas en nuestra <a href="/precios">página de precios</a>.</p>
      <h3>¿Limpiáis cerramientos y techos de cristal de terraza?</h3>
      <p>Sí, limpiamos cerramientos, pérgolas de cristal y claraboyas, por dentro y por fuera.</p>
    `,
    faqs: [
      { q: '¿Podéis limpiar ventanales de doble altura sin andamio?', a: 'Sí. Con agua pura Unger HydroPower llegamos hasta 10 metros trabajando desde el suelo, sin andamios ni escaleras apoyadas en la fachada.' },
      { q: '¿Cuánto cuesta limpiar los cristales de un chalet en Pozuelo?', a: 'Como referencia, la limpieza de un chalet parte de 95 €. El precio final depende del número de ventanales, la altura y la dificultad.' },
      { q: '¿Limpiáis cerramientos y techos de cristal de terraza?', a: 'Sí, limpiamos cerramientos, pérgolas de cristal y claraboyas, por dentro y por fuera.' },
    ],
  },
  {
    slug: 'limpieza-cristales-grinon',
    areaServed: 'Griñón',
    breadcrumbLabel: 'Griñón',
    title: 'Limpieza de cristales en Griñón',
    excerpt: 'Chalets, adosados y viviendas con jardín en Griñón: limpieza de ventanas, porches, claraboyas y placas solares con presupuesto en 24 h.',
    metaTitle: 'Limpieza de Cristales en Griñón',
    metaDescription: 'Limpieza de cristales en Griñón para chalets, adosados y viviendas con jardín: ventanas, porches, claraboyas y placas solares. Presupuesto gratis en 24 h.',
    keywords: 'limpieza cristales griñon, limpiacristales griñon, limpieza ventanas griñon, limpieza placas solares griñon, limpieza cristales chalet griñon',
    icon: ['fas', 'location-dot'],
    color: '#0891b2',
    colorPale: '#ecfeff',
    tag: 'Zona sur',
    content: `
      <h2>Limpiacristales en Griñón</h2>
      <p>Griñón, en el suroeste de la Comunidad de Madrid, es un municipio sobre todo de viviendas unifamiliares: chalets, adosados y casas con jardín. Es un tipo de vivienda con muchas ventanas, puertas correderas a la terraza y, cada vez más, placas solares en el tejado. En <strong>Royall Clean</strong> nos desplazamos a Griñón para dejar todo eso impecable.</p>

      <h2>Chalets y adosados</h2>
      <p>Limpiamos ventanas, balconeras y puertas correderas por dentro y por fuera, junto con marcos, juntas y barandillas. Para las ventanas de planta alta usamos pértiga telescópica desde el suelo, sin escaleras apoyadas en la fachada, y productos ecológicos seguros para niños, mascotas y plantas del jardín.</p>

      <h2>Porches, claraboyas y placas solares</h2>
      <p>Los porches acristalados y las claraboyas acumulan polvo, hojas y manchas de lluvia. Y si tienes paneles en el tejado, la suciedad acumulada puede reducir su rendimiento: hacemos <a href="/limpieza-placas-solares">limpieza de placas solares</a> con agua desmineralizada, sin productos agresivos, para que vuelvan a producir al máximo.</p>

      <h2>Desplazamiento a Griñón</h2>
      <p>Damos servicio en Griñón de forma habitual. Según la distancia, el presupuesto puede incluir un suplemento por desplazamiento, que siempre te indicamos de antemano para que no haya sorpresas.</p>

      <h2>Preguntas frecuentes sobre limpieza de cristales en Griñón</h2>
      <h3>¿Llegáis hasta Griñón?</h3>
      <p>Sí, damos servicio en Griñón. Si hay suplemento por desplazamiento, aparece indicado en el presupuesto antes de confirmar nada.</p>
      <h3>¿Limpiáis también placas solares?</h3>
      <p>Sí, limpiamos placas solares con agua desmineralizada, sin químicos agresivos, para recuperar su eficiencia.</p>
      <h3>¿Cuánto cuesta limpiar los cristales de un chalet en Griñón?</h3>
      <p>Como referencia, la limpieza de un chalet parte de 95 €. El precio final depende del número de ventanas, la altura, la dificultad y el desplazamiento; tienes todas las tarifas en nuestra <a href="/precios">página de precios</a>.</p>
    `,
    faqs: [
      { q: '¿Llegáis hasta Griñón?', a: 'Sí, damos servicio en Griñón. Si hay suplemento por desplazamiento, aparece indicado en el presupuesto antes de confirmar nada.' },
      { q: '¿Limpiáis también placas solares?', a: 'Sí, limpiamos placas solares con agua desmineralizada, sin químicos agresivos, para recuperar su eficiencia.' },
      { q: '¿Cuánto cuesta limpiar los cristales de un chalet en Griñón?', a: 'Como referencia, la limpieza de un chalet parte de 95 €. El precio final depende del número de ventanas, la altura, la dificultad y el desplazamiento.' },
    ],
  },
  {
    slug: 'limpieza-cristales-madrid-centro',
    areaServed: 'Madrid',
    breadcrumbLabel: 'Madrid Centro',
    title: 'Limpieza de cristales en Madrid Centro',
    excerpt: 'Escaparates, comercios, comunidades y edificios clásicos del centro de Madrid: limpieza de cristales antes de la apertura y sin andamios.',
    metaTitle: 'Limpieza de Cristales en Madrid Centro',
    metaDescription: 'Limpieza de cristales en el centro de Madrid: escaparates, comercios, comunidades y edificios clásicos con balcones. Antes de la apertura y sin andamios. Presupuesto en 24 h.',
    keywords: 'limpieza cristales madrid centro, limpieza escaparates madrid centro, limpiacristales centro madrid, limpieza cristales sol, limpieza ventanas edificios antiguos madrid',
    icon: ['fas', 'location-dot'],
    color: '#2563eb',
    colorPale: '#eff6ff',
    tag: 'Madrid capital',
    content: `
      <h2>Limpiacristales en el centro de Madrid</h2>
      <p>El distrito Centro, con barrios como Sol, Palacio, Embajadores, Cortes, Justicia o Universidad, reúne la mayor concentración de comercios de Madrid junto a edificios de viviendas con siglos de historia. En <strong>Royall Clean</strong> limpiamos los cristales de ambos: escaparates que tienen que brillar cada día y ventanas y balcones de fincas clásicas.</p>

      <h2>Escaparates y comercios</h2>
      <p>En las calles comerciales del centro, con tanto tráfico peatonal, el polvo y las huellas se acumulan rápido. Limpiamos escaparates, lunas y puertas de cristal antes de la apertura o después del cierre, para no interferir con tus clientes, y recomendamos una frecuencia quincenal. Más información en nuestro servicio de <a href="/limpieza-cristales-locales-comerciales">limpieza de locales comerciales</a>.</p>

      <h2>Edificios clásicos y comunidades</h2>
      <p>Las fincas del centro tienen ventanas altas, balcones con barandilla y patios interiores. Con pértiga telescópica llegamos hasta 4 plantas desde la calle o el patio, sin andamios, y limpiamos portales y cristaleras de zonas comunes con factura a nombre de la <a href="/limpieza-cristales-comunidades">comunidad de propietarios</a>.</p>

      <h2>Retirada de vinilos y grafitis</h2>
      <p>Cuando un local cambia de campaña o de negocio, retiramos <a href="/retirada-de-vinilos">vinilos y restos de adhesivo</a> sin rayar el cristal. Y si aparecen pintadas en persianas, fachadas o portales, también nos encargamos de la <a href="/limpieza-grafitis">limpieza de grafitis</a>.</p>

      <h2>Preguntas frecuentes sobre limpieza de cristales en Madrid Centro</h2>
      <h3>¿Podéis limpiar el escaparate antes de abrir?</h3>
      <p>Sí, es lo habitual en el centro: trabajamos antes de la apertura o después del cierre para no afectar a tu negocio.</p>
      <h3>¿Limpiáis ventanas y balcones de edificios antiguos?</h3>
      <p>Sí, con pértiga telescópica desde la calle o el patio llegamos hasta 4 plantas sin andamios, cuidando carpinterías y barandillas.</p>
      <h3>¿Cuánto cuesta limpiar un escaparate en el centro?</h3>
      <p>Como referencia, un local pequeño de 1–2 escaparates parte de 20 € por limpieza. Tienes todas las tarifas en nuestra <a href="/precios">página de precios</a>.</p>
    `,
    faqs: [
      { q: '¿Podéis limpiar el escaparate antes de abrir?', a: 'Sí, es lo habitual en el centro: trabajamos antes de la apertura o después del cierre para no afectar a tu negocio.' },
      { q: '¿Limpiáis ventanas y balcones de edificios antiguos?', a: 'Sí, con pértiga telescópica desde la calle o el patio llegamos hasta 4 plantas sin andamios, cuidando carpinterías y barandillas.' },
      { q: '¿Cuánto cuesta limpiar un escaparate en el centro?', a: 'Como referencia, un local pequeño de 1–2 escaparates parte de 20 € por limpieza.' },
    ],
  },
];

export function getZonaBySlug(slug) {
  return zonas.find((z) => z.slug === slug);
}
