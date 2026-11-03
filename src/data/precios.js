// Datos de la página /precios compartidos entre la vista (Precios.vue) y el
// build (vite.config.js), para que el FAQPage del HTML estático coincida
// siempre con las preguntas visibles. Sin imports de imágenes: vite.config.js
// lo carga directamente con Node.

export const preciosMeta = {
  title: 'Precios de Limpieza de Cristales en Madrid | Royall Clean',
  description: 'Tarifas de limpieza de cristales en Madrid: locales desde 20 €, pisos desde 55 €, chalets desde 95 €. Qué incluye y cómo se calcula. Presupuesto gratis en 24 h.',
  keywords: 'precio limpieza cristales madrid, cuanto cuesta limpiar cristales, tarifas limpiacristales madrid, precio limpieza ventanas, presupuesto limpieza cristales',
};

export const preciosFaqs = [
  {
    q: '¿Por qué los precios son "desde"?',
    a: 'Porque cada espacio es distinto: el precio final depende del número y tamaño de los cristales, de la altura del inmueble, de la dificultad del trabajo y de la frecuencia del servicio. Las tarifas te dan una referencia y el presupuesto personalizado te da la cifra exacta.',
  },
  {
    q: '¿El presupuesto tiene algún coste?',
    a: 'No. El presupuesto es gratuito y sin compromiso, y te respondemos en menos de 24 horas.',
  },
  {
    q: '¿Limpiáis los cristales por dentro y por fuera?',
    a: 'Sí. En viviendas la limpieza incluye interior y exterior, además de marcos, juntas y barandillas.',
  },
  {
    q: '¿Cobráis desplazamiento?',
    a: 'Depende de la distancia. Si el trabajo está lejos, el presupuesto puede incluir un suplemento por desplazamiento, que siempre te indicamos de antemano para que no haya sorpresas.',
  },
  {
    q: '¿Emitís factura?',
    a: 'Sí, emitimos factura para particulares, autónomos, empresas y comunidades de propietarios.',
  },
  {
    q: '¿Cuánto cuesta limpiar cristales en altura?',
    a: 'Depende de la altura y del acceso. Con pértiga telescópica llegamos hasta 4 plantas y con nuestro sistema de agua pura Unger HydroPower hasta 10 metros, siempre sin andamios, lo que abarata mucho el servicio. Te damos precio tras ver el edificio o unas fotos.',
  },
];
