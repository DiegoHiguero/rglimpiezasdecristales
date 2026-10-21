<template>
  <div class="pr-page">

    <div class="pr-breadcrumb">
      <router-link to="/">Inicio</router-link>
      <span class="sep">/</span>
      <span class="pr-breadcrumb-current">Precios</span>
    </div>

    <header class="pr-header">
      <h1 class="pr-title">Precios de limpieza de cristales <span class="pr-accent">en Madrid</span></h1>
      <p class="pr-intro">
        Tarifas orientativas para que sepas desde cuánto parte cada tipo de servicio.
        Cada presupuesto es personalizado, gratuito y sin compromiso: te respondemos en menos de 24 horas.
      </p>
    </header>

    <!-- Las mismas tarjetas que en la portada, para que los precios no se desincronicen -->
    <HomePrecios :detail-link="false" :header="false" />

    <section class="pr-card">
      <h2 class="pr-h2">Qué hace variar el precio</h2>
      <div class="pr-factors">
        <div class="pr-factor" v-for="f in factores" :key="f.titulo">
          <span class="pr-factor-icon"><font-awesome-icon :icon="f.icono" /></span>
          <h3 class="pr-h3">{{ f.titulo }}</h3>
          <p class="pr-text">{{ f.texto }}</p>
        </div>
      </div>
    </section>

    <section class="pr-card">
      <h2 class="pr-h2">Qué incluye siempre</h2>
      <ul class="pr-includes">
        <li v-for="item in incluye" :key="item">
          <font-awesome-icon :icon="['fas', 'check']" class="pr-check" />{{ item }}
        </li>
      </ul>
    </section>

    <section class="pr-card">
      <h2 class="pr-h2">Cómo pedir tu presupuesto</h2>
      <ol class="pr-steps">
        <li v-for="(paso, i) in pasos" :key="paso.titulo">
          <span class="pr-step-num">{{ i + 1 }}</span>
          <div>
            <h3 class="pr-h3">{{ paso.titulo }}</h3>
            <p class="pr-text">{{ paso.texto }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="pr-card">
      <h2 class="pr-h2">Preguntas frecuentes sobre precios</h2>
      <div class="pr-faq" v-for="(item, i) in preciosFaqs" :key="i">
        <button type="button" class="pr-faq-q" :aria-expanded="abierta === i" @click="abierta = abierta === i ? null : i">
          <span>{{ item.q }}</span>
          <font-awesome-icon :icon="['fas', abierta === i ? 'chevron-up' : 'chevron-down']" />
        </button>
        <p class="pr-faq-a" v-show="abierta === i">{{ item.a }}</p>
      </div>
    </section>

    <section class="pr-cta">
      <h2 class="pr-cta-title">¿Quieres el precio exacto para tu caso?</h2>
      <p class="pr-cta-sub">Cuéntanos qué necesitas y te enviamos el presupuesto en menos de 24 horas.</p>
      <div class="pr-cta-btns">
        <a href="tel:+34625950506" class="pr-btn pr-btn--primary">
          <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />625 950 506
        </a>
        <a href="https://wa.me/34625950506?text=Hola%2C%20quiero%20un%20presupuesto%20para%20limpieza%20de%20cristales" target="_blank" rel="noopener noreferrer" class="pr-btn pr-btn--wa">
          <font-awesome-icon :icon="['fab', 'whatsapp']" class="me-2" />WhatsApp
        </a>
        <router-link to="/contacto" class="pr-btn pr-btn--outline">Pedir presupuesto</router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HomePrecios from '../components/home/HomePrecios.vue';
import { preciosFaqs } from '../data/precios.js';

const abierta = ref(0);

const factores = [
  {
    icono: ['fas', 'table-cells'],
    titulo: 'Número y tamaño de cristales',
    texto: 'No es lo mismo un escaparate que una vivienda con terraza acristalada: contamos ventanas, puertas, mamparas y superficies a limpiar.',
  },
  {
    icono: ['fas', 'arrow-up-from-water-pump'],
    titulo: 'Altura del inmueble',
    texto: 'Con pértiga llegamos hasta 4 plantas y con agua pura Unger HydroPower hasta 10 metros, siempre sin andamios.',
  },
  {
    icono: ['fas', 'screwdriver-wrench'],
    titulo: 'Dificultad del trabajo',
    texto: 'Accesos complicados, cristales muy sucios o con restos de obra, pintura o adhesivos requieren más tiempo y se presupuestan aparte.',
  },
  {
    icono: ['fas', 'calendar-days'],
    titulo: 'Frecuencia del servicio',
    texto: 'Puedes pedir una limpieza puntual o un mantenimiento periódico (quincenal, mensual o trimestral) con calendario fijo.',
  },
];

const incluye = [
  'Limpieza por dentro y por fuera en viviendas',
  'Marcos, juntas y barandillas',
  'Agua pura: sin rayas, cal ni residuos',
  'Productos ecológicos, seguros para niños y mascotas',
  'Seguro de responsabilidad civil',
  'Factura para particulares, empresas y comunidades',
];

const pasos = [
  { titulo: 'Cuéntanos qué necesitas', texto: 'Por el formulario, por teléfono o por WhatsApp. Si nos mandas unas fotos de los cristales, el presupuesto es más preciso.' },
  { titulo: 'Te enviamos el presupuesto', texto: 'En menos de 24 horas, gratis y sin compromiso.' },
  { titulo: 'Fijamos el día', texto: 'Acordamos la fecha y el horario que mejor te venga, también fuera del horario de apertura si es un negocio.' },
];

// Las tarjetas de precios usan .animate-on-scroll, que en la portada activa
// Home.vue; aquí hay que activarlas también o se quedarían invisibles.
onMounted(() => {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.pr-page .animate-on-scroll').forEach((el) => observer.observe(el));
});
</script>

<style scoped>
.pr-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 12px;
  font-family: 'Raleway', sans-serif;
}

/* ── Breadcrumb ── */
.pr-breadcrumb {
  font-size: 0.8rem;
  color: var(--text-muted);
  padding: 18px 24px 0;
}
.pr-breadcrumb a { color: var(--blue); text-decoration: none; }
.pr-breadcrumb a:hover { text-decoration: underline; }
.pr-breadcrumb .sep { margin: 0 8px; opacity: 0.6; }

/* ── Header ── */
.pr-header {
  background: var(--white);
  border-radius: var(--r-lg);
  margin: 12px 20px;
  padding: 36px 32px;
}
.pr-title {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: 2.6rem;
  line-height: 1.15;
  color: var(--text);
  margin: 0 0 14px;
}
.pr-accent { color: var(--blue); }
.pr-intro {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-muted);
  margin: 0;
  max-width: 760px;
}

/* ── Bloques de contenido ── */
.pr-card {
  background: var(--white);
  border-radius: var(--r-lg);
  margin: 12px 20px;
  padding: 32px;
}
.pr-h2 {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: 1.7rem;
  color: var(--text);
  margin: 0 0 20px;
}
.pr-h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 6px;
}
.pr-text {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-muted);
  margin: 0;
}

.pr-factors {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.pr-factor {
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 20px;
}
.pr-factor-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: var(--blue-pale);
  color: var(--blue);
  margin-bottom: 12px;
}

.pr-includes {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 24px;
}
.pr-includes li { font-size: 0.92rem; color: var(--text); display: flex; align-items: center; }
.pr-check { color: #10b981; margin-right: 10px; flex-shrink: 0; }

.pr-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.pr-steps li { display: flex; gap: 14px; align-items: flex-start; }
.pr-step-num {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: var(--blue);
  color: #fff;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* ── FAQ ── */
.pr-faq { border-bottom: 1px solid var(--border); }
.pr-faq:last-child { border-bottom: none; }
.pr-faq-q {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  padding: 16px 0;
  text-align: left;
  font-family: 'Raleway', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
  cursor: pointer;
}
.pr-faq-q svg { color: var(--text-muted); flex-shrink: 0; }
.pr-faq-a {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-muted);
  margin: 0 0 16px;
}

/* ── CTA ── */
.pr-cta {
  background: var(--blue-pale);
  border-radius: var(--r-lg);
  margin: 12px 20px;
  padding: 32px;
  text-align: center;
}
.pr-cta-title {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: 1.7rem;
  color: var(--text);
  margin: 0 0 8px;
}
.pr-cta-sub { color: var(--text-muted); font-size: 0.92rem; margin: 0 0 20px; }
.pr-cta-btns { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; }
.pr-btn {
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 12px 22px;
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.pr-btn:hover { transform: translateY(-2px); }
.pr-btn--primary { background: var(--blue); color: #fff; }
.pr-btn--primary:hover { color: #fff; box-shadow: 0 6px 20px rgba(37,99,235,0.35); }
.pr-btn--wa { background: #25d366; color: #fff; }
.pr-btn--wa:hover { color: #fff; box-shadow: 0 6px 20px rgba(37,211,102,0.35); }
.pr-btn--outline { border: 1.5px solid var(--blue); color: var(--blue); background: var(--white); }

/* En oscuro el fondo pastel del CTA y de los iconos deslumbra */
:root[data-theme="dark"] .pr-cta { background: rgba(37,99,235,0.12); }
:root[data-theme="dark"] .pr-factor-icon { background: rgba(37,99,235,0.18); }

/* ── Responsive ── */
@media (max-width: 1100px) {
  .pr-factors { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 900px) {
  .pr-factors, .pr-steps { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .pr-header, .pr-card, .pr-cta { margin: 10px; padding: 24px 18px; border-radius: var(--r-md); }
  .pr-title { font-size: 2rem; }
  .pr-h2, .pr-cta-title { font-size: 1.45rem; }
  .pr-includes { grid-template-columns: 1fr; }
  .pr-btn { flex: 1 1 100%; justify-content: center; }
}
</style>
