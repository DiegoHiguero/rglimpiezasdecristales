/**
 * roadmap.js — Hoja de ruta de trabajo pendiente en la web/app.
 * Contenido curado manualmente; no se persiste ni se edita desde la UI.
 */

export const roadmap = [
  {
    categoria: 'Migración de datos',
    icon: 'table-cells',
    items: [
      'Migrar la app a la hoja real de facturación (royallclean_facturacion_2026_v9): Clientes, Registro de Facturas y Gastos Deducibles.',
    ],
  },
  {
    categoria: 'Errores conocidos',
    icon: 'triangle-exclamation',
    items: [
      'El registro público de clientes (Register.vue) falla al guardar — llama a un método que no existe en el store.',
      'El marcado de "factura enviada" / "email enviado" en Registro de Limpiezas está roto (referencia a Firestore no importada).',
    ],
  },
  {
    categoria: 'Diseño y contenido pendientes de publicar',
    icon: 'paintbrush',
    items: [
      'Commitear y desplegar el rediseño visual pendiente (logo y favicon nuevos).',
      'Revisar los enlaces internos de las páginas de detalle de servicios (ServicioDetalle.vue).',
      'Revisar el prerenderizado SEO (scripts/prerender.cjs) y el archivo llms.txt.',
    ],
  },
  {
    categoria: 'SEO y contenido',
    icon: 'newspaper',
    items: [
      'Continuar el calendario editorial del blog según la estrategia SEO definida.',
      'Confirmar que el sitemap.xml actualizado está desplegado en producción.',
    ],
  },
]
