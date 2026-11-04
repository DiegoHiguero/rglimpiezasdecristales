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
    metaDescription: 'Limpieza de cristales en Pozuelo de Alarcón: chalets, ventanales de doble altura, cerramientos y oficinas. Agua pura hasta 10 m, sin andamios.',
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
    slug: 'limpieza-cristales-las-rozas',
    areaServed: 'Las Rozas de Madrid',
    breadcrumbLabel: 'Las Rozas',
    title: 'Limpieza de cristales en Las Rozas',
    excerpt: 'Chalets de urbanización, comunidades, oficinas y comercios en Las Rozas: limpieza de cristales profesional, con agua pura hasta 10 metros y sin andamios.',
    metaTitle: 'Limpieza de Cristales en Las Rozas',
    metaDescription: 'Limpieza de cristales en Las Rozas para chalets, comunidades, oficinas y comercios. Ventanales en altura con agua pura, sin andamios. Presupuesto en 24 h.',
    keywords: 'limpieza cristales las rozas, limpiacristales las rozas, limpieza ventanas las rozas, limpieza cristales las matas, limpieza cristales oficinas las rozas',
    icon: ['fas', 'location-dot'],
    color: '#7c3aed',
    colorPale: '#f5f3ff',
    tag: 'Zona oeste',
    content: `
      <h2>Limpiacristales en Las Rozas</h2>
      <p>Las Rozas combina urbanizaciones de chalets y viviendas unifamiliares, como Las Matas, El Burgo o Molino de la Hoz, con comunidades de pisos con zonas comunes y una importante zona de oficinas y comercios en sus parques empresariales. En <strong>Royall Clean</strong> limpiamos los cristales de todos ellos, adaptando el equipo a cada tipo de edificio.</p>

      <h2>Chalets y viviendas de urbanización</h2>
      <p>Los chalets de Las Rozas suelen tener grandes ventanales, puertas correderas al jardín, porches y, en muchos casos, fachadas de doble altura. Limpiamos por dentro y por fuera, con marcos, juntas y barandillas, y para las zonas altas usamos nuestro sistema de <a href="/agua-pura-altura">agua pura Unger HydroPower</a>, que llega hasta 10 metros desde el suelo sin andamios y deja el cristal sin marcas.</p>

      <h2>Comunidades con zonas comunes</h2>
      <p>En las comunidades de vecinos limpiamos portales, cristaleras de escaleras y cerramientos de zonas comunes, con un calendario de mantenimiento y factura a nombre de la <a href="/limpieza-cristales-comunidades">comunidad de propietarios</a> para el administrador.</p>

      <h2>Oficinas y comercios</h2>
      <p>Para las oficinas de los parques empresariales y los comercios de Las Rozas ofrecemos <a href="/limpieza-cristales-oficinas">limpieza de cristales para empresas</a> y para <a href="/limpieza-cristales-locales-comerciales">locales comerciales</a>, con horarios que no interrumpen la actividad, contrato de mantenimiento y factura.</p>

      <h2>Preguntas frecuentes sobre limpieza de cristales en Las Rozas</h2>
      <h3>¿Trabajáis en Las Matas y en las urbanizaciones?</h3>
      <p>Sí, damos servicio en todo el municipio de Las Rozas, incluidas Las Matas y las urbanizaciones.</p>
      <h3>¿Podéis limpiar ventanales de doble altura sin andamio?</h3>
      <p>Sí. Con agua pura Unger HydroPower llegamos hasta 10 metros trabajando desde el suelo, sin andamios ni escaleras apoyadas en la fachada.</p>
      <h3>¿Cuánto cuesta limpiar los cristales de un chalet en Las Rozas?</h3>
      <p>Como referencia, la limpieza de un chalet parte de 95 €. El precio final depende del número de ventanales, la altura y la dificultad; tienes todas las tarifas en nuestra <a href="/precios">página de precios</a>.</p>
    `,
    faqs: [
      { q: '¿Trabajáis en Las Matas y en las urbanizaciones?', a: 'Sí, damos servicio en todo el municipio de Las Rozas, incluidas Las Matas y las urbanizaciones.' },
      { q: '¿Podéis limpiar ventanales de doble altura sin andamio?', a: 'Sí. Con agua pura Unger HydroPower llegamos hasta 10 metros trabajando desde el suelo, sin andamios ni escaleras apoyadas en la fachada.' },
      { q: '¿Cuánto cuesta limpiar los cristales de un chalet en Las Rozas?', a: 'Como referencia, la limpieza de un chalet parte de 95 €. El precio final depende del número de ventanales, la altura y la dificultad.' },
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
    excerpt: 'Escaparates, comercios, comunidades y edificios clásicos del centro de Madrid: limpieza de cristales sin andamios, el día y la hora que acordemos.',
    metaTitle: 'Limpieza de Cristales en Madrid Centro',
    metaDescription: 'Limpieza de cristales en el centro de Madrid: escaparates, comercios, comunidades y edificios clásicos con balcones, sin andamios. Presupuesto en 24 h.',
    keywords: 'limpieza cristales madrid centro, limpieza escaparates madrid centro, limpiacristales centro madrid, limpieza cristales sol, limpieza ventanas edificios antiguos madrid',
    icon: ['fas', 'location-dot'],
    color: '#2563eb',
    colorPale: '#eff6ff',
    tag: 'Madrid capital',
    content: `
      <h2>Limpiacristales en el centro de Madrid</h2>
      <p>El distrito Centro, con barrios como Sol, Palacio, Embajadores, Cortes, Justicia o Universidad, reúne la mayor concentración de comercios de Madrid junto a edificios de viviendas con siglos de historia. En <strong>Royall Clean</strong> limpiamos los cristales de ambos: escaparates que tienen que brillar cada día y ventanas y balcones de fincas clásicas.</p>

      <h2>Escaparates y comercios</h2>
      <p>En las calles comerciales del centro, con tanto tráfico peatonal, el polvo y las huellas se acumulan rápido. Limpiamos escaparates, lunas y puertas de cristal el día y a la hora que acordemos contigo, para no interferir con tus clientes, y recomendamos una frecuencia quincenal. Más información en nuestro servicio de <a href="/limpieza-cristales-locales-comerciales">limpieza de locales comerciales</a>.</p>

      <h2>Edificios clásicos y comunidades</h2>
      <p>Las fincas del centro tienen ventanas altas, balcones con barandilla y patios interiores. Con pértiga telescópica llegamos hasta 4 plantas desde la calle o el patio, sin andamios, y limpiamos portales y cristaleras de zonas comunes con factura a nombre de la <a href="/limpieza-cristales-comunidades">comunidad de propietarios</a>.</p>

      <h2>Retirada de vinilos y grafitis</h2>
      <p>Cuando un local cambia de campaña o de negocio, retiramos <a href="/retirada-de-vinilos">vinilos y restos de adhesivo</a> sin rayar el cristal. Y si aparecen pintadas en persianas, fachadas o portales, también nos encargamos de la <a href="/limpieza-grafitis">limpieza de grafitis</a>.</p>

      <h2>Preguntas frecuentes sobre limpieza de cristales en Madrid Centro</h2>
      <h3>¿Podéis venir a una hora que no moleste a mis clientes?</h3>
      <p>Sí, acordamos contigo el día y la hora de cada visita para que la limpieza no afecte a tu negocio.</p>
      <h3>¿Limpiáis ventanas y balcones de edificios antiguos?</h3>
      <p>Sí, con pértiga telescópica desde la calle o el patio llegamos hasta 4 plantas sin andamios, cuidando carpinterías y barandillas.</p>
      <h3>¿Cuánto cuesta limpiar un escaparate en el centro?</h3>
      <p>Como referencia, un local pequeño de 1–2 escaparates parte de 20 € por limpieza. Tienes todas las tarifas en nuestra <a href="/precios">página de precios</a>.</p>
    `,
    faqs: [
      { q: '¿Podéis venir a una hora que no moleste a mis clientes?', a: 'Sí, acordamos contigo el día y la hora de cada visita para que la limpieza no afecte a tu negocio.' },
      { q: '¿Limpiáis ventanas y balcones de edificios antiguos?', a: 'Sí, con pértiga telescópica desde la calle o el patio llegamos hasta 4 plantas sin andamios, cuidando carpinterías y barandillas.' },
      { q: '¿Cuánto cuesta limpiar un escaparate en el centro?', a: 'Como referencia, un local pequeño de 1–2 escaparates parte de 20 € por limpieza.' },
    ],
  },
  {
    slug: 'limpieza-cristales-leganes',
    areaServed: 'Leganés',
    breadcrumbLabel: 'Leganés',
    title: 'Limpieza de cristales en Leganés',
    excerpt: 'Pisos de Zarzaquemada y La Fortuna, chalets de Arroyo Culebro, comunidades, locales y empresas de los polígonos de Leganés: limpieza profesional sin andamios.',
    metaTitle: 'Limpieza de Cristales en Leganés',
    metaDescription: 'Limpiacristales en Leganés para pisos, comunidades de vecinos, locales y oficinas de los polígonos. Pértiga y agua pura, sin andamios. Presupuesto en 24 h.',
    keywords: 'limpieza cristales leganes, limpiacristales leganes, limpieza ventanas leganes, limpieza cristales comunidades leganes, limpieza cristales oficinas leganes',
    icon: ['fas', 'location-dot'],
    color: '#16a34a',
    colorPale: '#f0fdf4',
    tag: 'Zona sur',
    content: `
      <h2>Limpiacristales en Leganés</h2>
      <p>Leganés es, sobre todo, una ciudad de bloques de viviendas: barrios como Zarzaquemada, El Carrascal, La Fortuna o San Nicasio concentran edificios de varias plantas con muchas ventanas, balcones y terrazas cerradas. A eso se suman las zonas más nuevas, como Arroyo Culebro o Leganés Norte, con urbanizaciones y adosados, y un tejido empresarial importante en Leganés Tecnológico, Polvoranca o Butarque. En <strong>Royall Clean</strong> trabajamos en todo el municipio.</p>

      <h2>Comunidades de vecinos y bloques de pisos</h2>
      <p>En las comunidades de Leganés lo más habitual es limpiar los cristales del portal, las puertas de acceso, las cristaleras de las escaleras y los patios interiores. Para los administradores de fincas preparamos un calendario fijo (mensual, bimestral o trimestral) con factura a nombre de la comunidad. Con pértiga telescópica llegamos hasta 4 plantas desde el suelo, sin andamios ni plataformas.</p>

      <h2>Pisos, cerramientos de terraza y adosados</h2>
      <p>Muchos pisos de Leganés tienen la terraza acristalada con cerramientos de aluminio, que acumulan mucho polvo por fuera y son difíciles de limpiar desde dentro. Los limpiamos por las dos caras, junto con ventanas, guías y marcos. En los adosados y chalets de las zonas nuevas limpiamos también ventanales grandes, claraboyas y barandillas de cristal.</p>

      <h2>Oficinas y naves en los polígonos</h2>
      <p>En Leganés Tecnológico y en los polígonos del municipio limpiamos fachadas acristaladas, oficinas, mamparas y ventanales de naves. Nos adaptamos al horario de la empresa y ofrecemos contrato de mantenimiento con factura.</p>

      <h2>Servicios más pedidos en Leganés</h2>
      <ul>
        <li><a href="/limpieza-cristales-comunidades">Comunidades de vecinos</a>: portales, escaleras y patios.</li>
        <li><a href="/limpieza-cristales-hogares">Pisos y adosados</a>: ventanas y terrazas acristaladas, por dentro y por fuera.</li>
        <li><a href="/limpieza-cristales-oficinas">Oficinas y naves</a>: fachadas acristaladas y mamparas.</li>
        <li><a href="/limpieza-cristales-locales-comerciales">Locales comerciales</a>: escaparates sin cerrar el negocio.</li>
      </ul>

      <h2>Preguntas frecuentes sobre limpieza de cristales en Leganés</h2>
      <h3>¿Limpiáis los cerramientos de terraza por fuera?</h3>
      <p>Sí. Desde la calle con pértiga, o desde el propio cerramiento si es accesible, limpiamos la cara exterior sin riesgos, hasta 4 plantas.</p>
      <h3>¿Trabajáis con administradores de fincas en Leganés?</h3>
      <p>Sí, preparamos presupuesto para la comunidad, un calendario fijo de limpiezas y factura a nombre de la comunidad.</p>
      <h3>¿Cuánto cuesta limpiar los cristales de un piso en Leganés?</h3>
      <p>Como referencia, la limpieza de un piso parte de 55 €. El precio final depende del número de ventanas, de si hay cerramiento y de la altura; puedes ver todas las tarifas en nuestra <a href="/precios">página de precios</a>.</p>
    `,
    faqs: [
      { q: '¿Limpiáis los cerramientos de terraza por fuera?', a: 'Sí. Desde la calle con pértiga, o desde el propio cerramiento si es accesible, limpiamos la cara exterior sin riesgos, hasta 4 plantas.' },
      { q: '¿Trabajáis con administradores de fincas en Leganés?', a: 'Sí, preparamos presupuesto para la comunidad, un calendario fijo de limpiezas y factura a nombre de la comunidad.' },
      { q: '¿Cuánto cuesta limpiar los cristales de un piso en Leganés?', a: 'Como referencia, la limpieza de un piso parte de 55 €. El precio final depende del número de ventanas, de si hay cerramiento y de la altura.' },
    ],
  },
  {
    slug: 'limpieza-cristales-alcorcon',
    areaServed: 'Alcorcón',
    breadcrumbLabel: 'Alcorcón',
    title: 'Limpieza de cristales en Alcorcón',
    excerpt: 'Pisos, comunidades y locales en Alcorcón, desde Parque Lisboa hasta el Ensanche Sur, y empresas de los polígonos: limpieza de cristales sin andamios.',
    metaTitle: 'Limpieza de Cristales en Alcorcón',
    metaDescription: 'Limpieza de cristales en Alcorcón para pisos, comunidades, locales y empresas de los polígonos. Pértiga y agua pura, sin andamios. Presupuesto en 24 h.',
    keywords: 'limpieza cristales alcorcon, limpiacristales alcorcon, limpieza ventanas alcorcon, limpieza cristales comunidades alcorcon, limpieza escaparates alcorcon',
    icon: ['fas', 'location-dot'],
    color: '#0891b2',
    colorPale: '#ecfeff',
    tag: 'Zona sur',
    content: `
      <h2>Limpiacristales en Alcorcón</h2>
      <p>En Alcorcón conviven barrios consolidados de bloques altos, como Parque Lisboa, Parque Oeste, San José de Valderas o Los Castillos, con zonas más recientes como el Ensanche Sur, de edificios con grandes ventanales y terrazas. Además, el municipio tiene mucha actividad comercial en sus calles y en polígonos como Urtinsa. En <strong>Royall Clean</strong> limpiamos cristales en todos estos entornos.</p>

      <h2>Comunidades de vecinos en bloques altos</h2>
      <p>Los edificios de Alcorcón suelen tener portales amplios con cristaleras, puertas de vidrio y huecos de escalera acristalados, que se ensucian rápido con el tránsito diario. Ofrecemos limpiezas periódicas para la comunidad, coordinadas con el administrador de fincas y con factura a nombre de la comunidad.</p>

      <h2>Pisos con ventanales y terrazas</h2>
      <p>En las viviendas limpiamos ventanas, balcones, cerramientos de terraza y barandillas de cristal, por dentro y por fuera. En los edificios del Ensanche Sur, con ventanales más grandes, trabajamos con pértiga y agua pura para que el cristal quede sin marcas ni restos de cal.</p>

      <h2>Locales, comercios y empresas</h2>
      <p>Para los comercios de las calles principales limpiamos escaparates y rótulos en el horario que acordemos, sin cortar la actividad. En las empresas de los polígonos limpiamos fachadas acristaladas, oficinas y naves, con contrato de mantenimiento si se necesita.</p>

      <h2>Servicios más pedidos en Alcorcón</h2>
      <ul>
        <li><a href="/limpieza-cristales-comunidades">Comunidades de vecinos</a>: portales, escaleras y cristaleras comunes.</li>
        <li><a href="/limpieza-cristales-hogares">Pisos</a>: ventanas, balcones y cerramientos.</li>
        <li><a href="/limpieza-cristales-locales-comerciales">Locales comerciales</a>: escaparates y rótulos.</li>
        <li><a href="/limpieza-cristales-oficinas">Oficinas y naves</a>: fachadas acristaladas y mamparas.</li>
      </ul>

      <h2>Preguntas frecuentes sobre limpieza de cristales en Alcorcón</h2>
      <h3>¿Podéis limpiar el escaparate de mi tienda sin molestar a los clientes?</h3>
      <p>Sí, acordamos contigo el día y la hora de la visita para que la limpieza no moleste a tus clientes.</p>
      <h3>¿Limpiáis ventanas de pisos altos sin andamios?</h3>
      <p>Sí, con pértiga telescópica llegamos hasta 4 plantas desde el suelo, y con agua pura hasta unos 10 metros, sin andamios ni plataformas.</p>
      <h3>¿Cuánto cuesta limpiar un escaparate en Alcorcón?</h3>
      <p>Como referencia, un local pequeño con 1 o 2 escaparates parte de 20 € por limpieza. Puedes ver todas las tarifas en nuestra <a href="/precios">página de precios</a>.</p>
    `,
    faqs: [
      { q: '¿Podéis limpiar el escaparate de mi tienda sin molestar a los clientes?', a: 'Sí, acordamos contigo el día y la hora de la visita para que la limpieza no moleste a tus clientes.' },
      { q: '¿Limpiáis ventanas de pisos altos sin andamios?', a: 'Sí, con pértiga telescópica llegamos hasta 4 plantas desde el suelo, y con agua pura hasta unos 10 metros, sin andamios ni plataformas.' },
      { q: '¿Cuánto cuesta limpiar un escaparate en Alcorcón?', a: 'Como referencia, un local pequeño con 1 o 2 escaparates parte de 20 € por limpieza.' },
    ],
  },
  {
    slug: 'limpieza-cristales-mostoles',
    areaServed: 'Móstoles',
    breadcrumbLabel: 'Móstoles',
    title: 'Limpieza de cristales en Móstoles',
    excerpt: 'Pisos, comunidades, chalets de Parque Coimbra y empresas de los polígonos de Móstoles: limpieza de cristales profesional, sin andamios y con factura.',
    metaTitle: 'Limpieza de Cristales en Móstoles',
    metaDescription: 'Limpiacristales en Móstoles para pisos, comunidades, chalets y empresas de los polígonos. Pértiga y agua pura sin andamios. Presupuesto gratis en 24 h.',
    keywords: 'limpieza cristales mostoles, limpiacristales mostoles, limpieza ventanas mostoles, limpieza cristales comunidades mostoles, limpieza cristales chalets mostoles',
    icon: ['fas', 'location-dot'],
    color: '#16a34a',
    colorPale: '#f0fdf4',
    tag: 'Zona sur',
    content: `
      <h2>Limpiacristales en Móstoles</h2>
      <p>Móstoles es uno de los municipios más grandes de la Comunidad de Madrid y tiene de todo: bloques de pisos en el centro y en barrios como Estoril o Villafontana, desarrollos más nuevos como Móstoles Sur, urbanizaciones de chalets como Parque Coimbra y zonas empresariales como Móstoles Tecnológico o los polígonos Las Nieves y Regordoño. En <strong>Royall Clean</strong> adaptamos el trabajo a cada tipo de edificio.</p>

      <h2>Comunidades de vecinos</h2>
      <p>En las comunidades limpiamos portales, puertas de cristal, cristaleras de escalera y patios interiores. Proponemos una frecuencia fija según el uso del edificio y emitimos factura a nombre de la comunidad para el administrador de fincas.</p>

      <h2>Chalets y viviendas unifamiliares</h2>
      <p>En urbanizaciones como Parque Coimbra son habituales los ventanales grandes, los porches acristalados, las claraboyas y las barandillas de cristal en terrazas y piscinas. Con pértiga y agua pura limpiamos las zonas altas desde el suelo, sin escaleras ni andamios, y sin dejar marcas de cal.</p>

      <h2>Empresas y naves</h2>
      <p>En los polígonos y en Móstoles Tecnológico limpiamos fachadas acristaladas, oficinas, mamparas y ventanales de naves. Trabajamos en el horario que mejor le venga a la empresa y ofrecemos mantenimiento periódico con factura.</p>

      <h2>Servicios más pedidos en Móstoles</h2>
      <ul>
        <li><a href="/limpieza-cristales-hogares">Pisos y chalets</a>: ventanas, ventanales y claraboyas.</li>
        <li><a href="/limpieza-cristales-comunidades">Comunidades de vecinos</a>: portales y zonas comunes.</li>
        <li><a href="/agua-pura-altura">Cristales en altura</a>: agua pura hasta 10 m sin andamios.</li>
        <li><a href="/limpieza-cristales-oficinas">Oficinas y naves</a>: fachadas acristaladas.</li>
      </ul>

      <h2>Preguntas frecuentes sobre limpieza de cristales en Móstoles</h2>
      <h3>¿Limpiáis chalets con ventanales de doble altura?</h3>
      <p>Sí, con el sistema de agua pura y pértiga limpiamos ventanales y claraboyas de hasta unos 10 metros desde el suelo.</p>
      <h3>¿Dais servicio en todo Móstoles?</h3>
      <p>Sí, en todos los barrios, urbanizaciones y polígonos del municipio.</p>
      <h3>¿Cuánto cuesta limpiar los cristales de un chalet en Móstoles?</h3>
      <p>Como referencia, un chalet parte de 95 €. Depende del tamaño, la altura y el número de ventanales; puedes ver todas las tarifas en nuestra <a href="/precios">página de precios</a>.</p>
    `,
    faqs: [
      { q: '¿Limpiáis chalets con ventanales de doble altura?', a: 'Sí, con el sistema de agua pura y pértiga limpiamos ventanales y claraboyas de hasta unos 10 metros desde el suelo.' },
      { q: '¿Dais servicio en todo Móstoles?', a: 'Sí, en todos los barrios, urbanizaciones y polígonos del municipio.' },
      { q: '¿Cuánto cuesta limpiar los cristales de un chalet en Móstoles?', a: 'Como referencia, un chalet parte de 95 €. Depende del tamaño, la altura y el número de ventanales.' },
    ],
  },
  {
    slug: 'limpieza-cristales-fuenlabrada',
    areaServed: 'Fuenlabrada',
    breadcrumbLabel: 'Fuenlabrada',
    title: 'Limpieza de cristales en Fuenlabrada',
    excerpt: 'Comunidades, pisos de Loranca y El Naranjo, y naves y oficinas de Cobo Calleja y Los Gallegos: limpieza de cristales en Fuenlabrada sin andamios.',
    metaTitle: 'Limpieza de Cristales en Fuenlabrada',
    metaDescription: 'Limpieza de cristales en Fuenlabrada: comunidades, pisos, locales y naves de Cobo Calleja y Los Gallegos. Pértiga y agua pura. Presupuesto en 24 h.',
    keywords: 'limpieza cristales fuenlabrada, limpiacristales fuenlabrada, limpieza ventanas fuenlabrada, limpieza cristales naves fuenlabrada, limpieza cristales cobo calleja',
    icon: ['fas', 'location-dot'],
    color: '#0891b2',
    colorPale: '#ecfeff',
    tag: 'Zona sur',
    content: `
      <h2>Limpiacristales en Fuenlabrada</h2>
      <p>Fuenlabrada tiene dos caras: una ciudad residencial de bloques de pisos, con barrios como Loranca, El Naranjo o el centro, y una de las mayores zonas industriales y logísticas del sur de Madrid, con polígonos como Cobo Calleja o Los Gallegos. En <strong>Royall Clean</strong> trabajamos para vecinos, comunidades, comercios y empresas del municipio.</p>

      <h2>Naves, almacenes y oficinas</h2>
      <p>En los polígonos de Fuenlabrada limpiamos los escaparates de las naves de venta, las oficinas de la entrada, los ventanales altos y los lucernarios. Muchos de estos almacenes reciben clientes a diario, así que un cristal limpio en la fachada es parte de su imagen. Nos adaptamos a los horarios de carga y descarga y ofrecemos mantenimiento periódico con factura.</p>

      <h2>Comunidades de vecinos y pisos</h2>
      <p>En las comunidades limpiamos portales, puertas de cristal y cristaleras de escalera con un calendario fijo. En los pisos limpiamos ventanas, balcones y cerramientos de terraza por las dos caras. Con pértiga llegamos hasta 4 plantas desde el suelo, sin andamios.</p>

      <h2>Comercios del centro</h2>
      <p>Para los locales de las calles comerciales de Fuenlabrada limpiamos escaparates, puertas y rótulos en el horario que acordemos, sin interrumpir el negocio.</p>

      <h2>Servicios más pedidos en Fuenlabrada</h2>
      <ul>
        <li><a href="/limpieza-cristales-oficinas">Oficinas y naves</a>: fachadas, escaparates de nave y lucernarios.</li>
        <li><a href="/limpieza-cristales-comunidades">Comunidades de vecinos</a>: portales y escaleras.</li>
        <li><a href="/limpieza-cristales-locales-comerciales">Locales comerciales</a>: escaparates sin cerrar.</li>
        <li><a href="/retirada-de-vinilos">Retirada de vinilos</a>: cambio de rotulación en escaparates.</li>
      </ul>

      <h2>Preguntas frecuentes sobre limpieza de cristales en Fuenlabrada</h2>
      <h3>¿Limpiáis naves en Cobo Calleja y Los Gallegos?</h3>
      <p>Sí, limpiamos escaparates de naves, oficinas y ventanales en los polígonos de Fuenlabrada, con horarios adaptados a la actividad del almacén.</p>
      <h3>¿Hacéis contrato de mantenimiento para empresas?</h3>
      <p>Sí, con una frecuencia fija (cada 15 días, cada mes o más espaciada) y factura para la empresa.</p>
      <h3>¿Cuánto cuesta limpiar los cristales de una nave?</h3>
      <p>Depende de los metros de cristal y de la altura, por lo que hacemos presupuesto a medida, gratis y en menos de 24 h. Puedes ver tarifas orientativas en nuestra <a href="/precios">página de precios</a>.</p>
    `,
    faqs: [
      { q: '¿Limpiáis naves en Cobo Calleja y Los Gallegos?', a: 'Sí, limpiamos escaparates de naves, oficinas y ventanales en los polígonos de Fuenlabrada, con horarios adaptados a la actividad del almacén.' },
      { q: '¿Hacéis contrato de mantenimiento para empresas?', a: 'Sí, con una frecuencia fija (cada 15 días, cada mes o más espaciada) y factura para la empresa.' },
      { q: '¿Cuánto cuesta limpiar los cristales de una nave?', a: 'Depende de los metros de cristal y de la altura, por lo que hacemos presupuesto a medida, gratis y en menos de 24 h.' },
    ],
  },
  {
    slug: 'limpieza-cristales-majadahonda',
    areaServed: 'Majadahonda',
    breadcrumbLabel: 'Majadahonda',
    title: 'Limpieza de cristales en Majadahonda',
    excerpt: 'Chalets, urbanizaciones con piscina, pisos y oficinas en Majadahonda: limpieza de ventanales, claraboyas y barandillas de cristal con agua pura.',
    metaTitle: 'Limpieza de Cristales en Majadahonda',
    metaDescription: 'Limpieza de cristales en Majadahonda para chalets, urbanizaciones, pisos y oficinas. Ventanales y claraboyas con agua pura, sin andamios.',
    keywords: 'limpieza cristales majadahonda, limpiacristales majadahonda, limpieza ventanas majadahonda, limpieza cristales chalets majadahonda, limpieza ventanales majadahonda',
    icon: ['fas', 'location-dot'],
    color: '#ea580c',
    colorPale: '#fff7ed',
    tag: 'Zona oeste',
    content: `
      <h2>Limpiacristales en Majadahonda</h2>
      <p>Majadahonda es un municipio residencial con muchas viviendas unifamiliares y urbanizaciones con zonas comunes, junto a bloques de pisos en el casco y en los barrios más nuevos, y una zona de oficinas y servicios en crecimiento. En <strong>Royall Clean</strong> limpiamos cristales en chalets, comunidades y empresas de toda la localidad.</p>

      <h2>Chalets y viviendas unifamiliares</h2>
      <p>En los chalets de Majadahonda son habituales los ventanales de suelo a techo, los salones de doble altura, las claraboyas y las barandillas de cristal en terrazas y piscinas. Con pértiga y agua pura limpiamos las zonas altas desde el suelo, sin escaleras ni andamios, y el cristal se seca sin dejar marcas de cal. También limpiamos marcos, guías y mosquiteras.</p>

      <h2>Urbanizaciones y comunidades</h2>
      <p>En las urbanizaciones limpiamos los cristales de portales, porterías, gimnasios y zonas comunes, así como las vallas de vidrio de las piscinas antes de la temporada de verano. Coordinamos el calendario con el administrador y facturamos a nombre de la comunidad.</p>

      <h2>Oficinas y locales</h2>
      <p>Para oficinas, clínicas y locales de Majadahonda ofrecemos limpieza de fachadas acristaladas, mamparas y escaparates, con mantenimiento periódico y horario adaptado.</p>

      <h2>Servicios más pedidos en Majadahonda</h2>
      <ul>
        <li><a href="/limpieza-cristales-hogares">Chalets</a>: ventanales, claraboyas y barandillas de cristal.</li>
        <li><a href="/agua-pura-altura">Cristales en altura</a>: salones de doble altura sin andamios.</li>
        <li><a href="/limpieza-cristales-comunidades">Urbanizaciones</a>: zonas comunes y piscinas.</li>
        <li><a href="/limpieza-placas-solares">Placas solares</a>: paneles en tejados de chalets.</li>
      </ul>

      <h2>Preguntas frecuentes sobre limpieza de cristales en Majadahonda</h2>
      <h3>¿Limpiáis las barandillas de cristal de la piscina?</h3>
      <p>Sí, limpiamos barandillas y vallas de vidrio por las dos caras, quitando cal y restos de cloro, sin productos que dañen el cristal.</p>
      <h3>¿Podéis limpiar las placas solares del chalet en la misma visita?</h3>
      <p>Sí, con el mismo sistema de agua pura limpiamos los paneles solares del tejado sin subir a él.</p>
      <h3>¿Cuánto cuesta limpiar los cristales de un chalet en Majadahonda?</h3>
      <p>Como referencia, un chalet parte de 95 €. El precio depende del tamaño, la altura y el número de ventanales; puedes ver todas las tarifas en nuestra <a href="/precios">página de precios</a>.</p>
    `,
    faqs: [
      { q: '¿Limpiáis las barandillas de cristal de la piscina?', a: 'Sí, limpiamos barandillas y vallas de vidrio por las dos caras, quitando cal y restos de cloro, sin productos que dañen el cristal.' },
      { q: '¿Podéis limpiar las placas solares del chalet en la misma visita?', a: 'Sí, con el mismo sistema de agua pura limpiamos los paneles solares del tejado sin subir a él.' },
      { q: '¿Cuánto cuesta limpiar los cristales de un chalet en Majadahonda?', a: 'Como referencia, un chalet parte de 95 €. El precio depende del tamaño, la altura y el número de ventanales.' },
    ],
  },
  {
    slug: 'limpieza-cristales-barrio-salamanca',
    areaServed: 'Barrio de Salamanca, Madrid',
    breadcrumbLabel: 'Barrio de Salamanca',
    title: 'Limpieza de cristales en el barrio de Salamanca',
    excerpt: 'Escaparates de Serrano, Goya y Velázquez, oficinas y portales de edificios clásicos del barrio de Salamanca: limpieza de cristales cada 15 días o cada mes.',
    metaTitle: 'Limpieza de Cristales en el Barrio de Salamanca',
    metaDescription: 'Limpieza de cristales en el barrio de Salamanca: escaparates de Serrano y Goya, oficinas, portales y ventanas de edificios clásicos. Presupuesto en 24 h.',
    keywords: 'limpieza cristales barrio salamanca, limpiacristales salamanca madrid, limpieza escaparates serrano, limpieza cristales goya madrid, limpieza cristales oficinas salamanca',
    icon: ['fas', 'location-dot'],
    color: '#2563eb',
    colorPale: '#eff6ff',
    tag: 'Madrid capital',
    content: `
      <h2>Limpiacristales en el barrio de Salamanca</h2>
      <p>El barrio de Salamanca reúne algunas de las calles comerciales más exigentes de Madrid, como Serrano, Goya, Velázquez, Ortega y Gasset o Claudio Coello, junto con oficinas, despachos, clínicas y edificios residenciales de fachada clásica. Aquí un escaparate con marcas se nota, y en <strong>Royall Clean</strong> trabajamos para que eso no pase.</p>

      <h2>Escaparates y tiendas</h2>
      <p>Limpiamos escaparates, puertas de vidrio, vitrinas y rótulos de tiendas, boutiques, joyerías y restaurantes. Acordamos contigo el día y la hora de cada visita, con una frecuencia fija (cada 15 días o cada mes) para que el escaparate esté siempre impecable. Usamos agua pura, que deja el cristal sin marcas ni restos de producto.</p>

      <h2>Oficinas, despachos y clínicas</h2>
      <p>En los pisos reconvertidos en oficinas y en los edificios de servicios del barrio limpiamos ventanas, balcones, mamparas y puertas de cristal, en el horario que menos moleste a la actividad. Emitimos factura y ofrecemos contrato de mantenimiento.</p>

      <h2>Portales y ventanas de edificios clásicos</h2>
      <p>Los edificios del barrio tienen portales con puertas de forja y cristal, vestíbulos con espejos y balcones con carpintería antigua. Los limpiamos con cuidado, protegiendo marcos y barandillas. Con pértiga llegamos hasta 4 plantas desde la calle o el patio, sin andamios.</p>

      <h2>Servicios más pedidos en el barrio de Salamanca</h2>
      <ul>
        <li><a href="/limpieza-cristales-locales-comerciales">Locales comerciales</a>: escaparates sin cerrar el negocio.</li>
        <li><a href="/limpieza-cristales-oficinas">Oficinas y despachos</a>: ventanas y mamparas.</li>
        <li><a href="/limpieza-cristales-comunidades">Comunidades de vecinos</a>: portales y patios.</li>
        <li><a href="/retirada-de-vinilos">Retirada de vinilos</a>: cambio de escaparate en rebajas o temporada.</li>
      </ul>

      <h2>Preguntas frecuentes sobre limpieza de cristales en el barrio de Salamanca</h2>
      <h3>¿Podéis limpiar el escaparate de forma periódica?</h3>
      <p>Sí, es el servicio más habitual en el barrio: fijamos una frecuencia (cada 15 días o cada mes) y el día y la hora de la visita, y no tienes que estar pendiente.</p>
      <h3>¿Quitáis los vinilos de rebajas del escaparate?</h3>
      <p>Sí, retiramos vinilos y restos de adhesivo sin rayar el cristal y lo dejamos limpio para la nueva decoración.</p>
      <h3>¿Cuánto cuesta limpiar un escaparate en el barrio de Salamanca?</h3>
      <p>Como referencia, un local pequeño con 1 o 2 escaparates parte de 20 € por limpieza. Puedes ver todas las tarifas en nuestra <a href="/precios">página de precios</a>.</p>
    `,
    faqs: [
      { q: '¿Podéis limpiar el escaparate de forma periódica?', a: 'Sí, es el servicio más habitual en el barrio: fijamos una frecuencia (cada 15 días o cada mes) y el día y la hora de la visita, y no tienes que estar pendiente.' },
      { q: '¿Quitáis los vinilos de rebajas del escaparate?', a: 'Sí, retiramos vinilos y restos de adhesivo sin rayar el cristal y lo dejamos limpio para la nueva decoración.' },
      { q: '¿Cuánto cuesta limpiar un escaparate en el barrio de Salamanca?', a: 'Como referencia, un local pequeño con 1 o 2 escaparates parte de 20 € por limpieza.' },
    ],
  },
];

export function getZonaBySlug(slug) {
  return zonas.find((z) => z.slug === slug);
}
