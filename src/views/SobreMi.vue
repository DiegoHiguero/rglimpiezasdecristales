<template>
  <div class="sm-page">

    <div class="sm-breadcrumb">
      <router-link to="/">Inicio</router-link>
      <span class="sep">/</span>
      <span>Sobre mí</span>
    </div>

    <section class="sm-hero">
      <img class="sm-img" src="../assets/img/yomismo.webp" alt="Roys Abreu, limpiacristales en Madrid" />
      <div class="sm-hero-text">
        <span class="sm-badge"><font-awesome-icon :icon="['fas', 'calendar-days']" class="me-1" />Desde 2013</span>
        <h1 class="sm-title">Soy Roys Abreu, <span class="sm-accent">limpiacristales en Madrid</span></h1>
        <p class="sm-lead">
          Limpio cristales en Madrid desde 2013 y me he especializado en los <strong>trabajos difíciles</strong>:
          los que otros no quieren hacer. Para mí lo más importante es que el cliente quede contento,
          aunque eso me lleve un poco más de tiempo.
        </p>
        <div class="sm-ctas">
          <a href="tel:+34625950506" class="sm-btn sm-btn--primary">
            <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />Llámame: 625 950 506
          </a>
          <a href="https://wa.me/34625950506?text=Hola%20Roys%2C%20quiero%20un%20presupuesto" target="_blank" rel="noopener noreferrer" class="sm-btn sm-btn--wa">
            <font-awesome-icon :icon="['fab', 'whatsapp']" class="me-2" />WhatsApp
          </a>
        </div>
      </div>
    </section>

    <section class="sm-card">
      <h2 class="sm-h2">Especialista en lo que otros no quieren hacer</h2>
      <p class="sm-text">
        Con los años he visto de todo: fachadas a las que nadie quería subir, cristales con restos de obra,
        pintura o adhesivos, lucernarios con años de suciedad o accesos en los que hay que pensar antes de empezar.
        Ese tipo de trabajos son los que más me gustan, porque es donde se nota la experiencia.
      </p>
      <div class="sm-grid">
        <div class="sm-item" v-for="d in dificiles" :key="d.titulo">
          <span class="sm-item-icon"><font-awesome-icon :icon="d.icono" /></span>
          <div>
            <h3 class="sm-h3">{{ d.titulo }}</h3>
            <p class="sm-small">{{ d.texto }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sm-card">
      <h2 class="sm-h2">Cómo trabajo</h2>
      <ul class="sm-list">
        <li v-for="c in comoTrabajo" :key="c.titulo">
          <font-awesome-icon :icon="['fas', 'check']" class="sm-check" />
          <span><strong>{{ c.titulo }}.</strong> {{ c.texto }}</span>
        </li>
      </ul>
    </section>

    <section class="sm-card">
      <h2 class="sm-h2">Lo que dicen mis clientes</h2>
      <div class="sm-reviews">
        <blockquote class="sm-review" v-for="r in opiniones" :key="r.autor">
          <div class="sm-stars">★★★★★</div>
          <p>“{{ r.texto }}”</p>
          <cite>{{ r.autor }} · Google</cite>
        </blockquote>
      </div>
      <router-link to="/#testimonios" class="sm-more">
        Ver todas las opiniones <font-awesome-icon :icon="['fas', 'arrow-right']" class="ms-1" />
      </router-link>
    </section>

    <section class="sm-card">
      <h2 class="sm-h2">Dónde trabajo</h2>
      <p class="sm-text">
        En Madrid capital y en toda la Comunidad de Madrid. Algunas de las zonas donde más trabajo:
      </p>
      <div class="sm-zonas">
        <router-link v-for="z in zonas" :key="z.to" :to="z.to" class="sm-zona">
          <font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />{{ z.nombre }}
        </router-link>
      </div>
    </section>

    <section class="sm-cta">
      <h2 class="sm-cta-title">¿Tienes un trabajo complicado?</h2>
      <p class="sm-cta-sub">Cuéntamelo y te doy presupuesto en menos de 24 horas, gratis y sin compromiso.</p>
      <router-link to="/contacto" class="sm-btn sm-btn--primary">
        <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Pedir presupuesto
      </router-link>
    </section>

  </div>
</template>

<script setup>
const dificiles = [
  { icono: ['fas', 'droplet'], titulo: 'Fachadas y ventanales en altura', texto: 'Con pértiga hasta 4 plantas y con agua pura Unger HydroPower hasta 10 metros, sin andamios.' },
  { icono: ['fas', 'broom'], titulo: 'Restos de obra y adhesivos', texto: 'Pintura, adhesivos o vinilos, quitados sin rayar el cristal.' },
  { icono: ['fas', 'sun'], titulo: 'Lucernarios y techos de cristal', texto: 'Claraboyas, pérgolas y cerramientos con suciedad acumulada.' },
  { icono: ['fas', 'screwdriver-wrench'], titulo: 'Accesos complicados', texto: 'Patios interiores, cristales sobre tejados o zonas a las que cuesta llegar.' },
];

const comoTrabajo = [
  { titulo: 'Trato directo conmigo', texto: 'Trabajo como autónomo: quien te da el presupuesto es quien hace el trabajo.' },
  { titulo: 'Sin prisas', texto: 'Prefiero tardar un poco más y que el resultado sea el que esperas.' },
  { titulo: 'Equipo profesional', texto: 'Pértigas telescópicas y sistema de agua pura Unger HydroPower.' },
  { titulo: 'Productos ecológicos', texto: 'Seguros para niños, mascotas y plantas.' },
  { titulo: 'Con seguro y factura', texto: 'Seguro de responsabilidad civil y factura para particulares, empresas y comunidades.' },
];

// Opiniones reales de Google (las mismas que muestra el widget de la portada)
const opiniones = [
  { texto: 'Roys es un gran profesional. Lleva muchos años limpiando los cristales de casa y no puedo estar más contenta. Lo recomiendo 100%', autor: 'Nuria L.' },
  { texto: 'Chico encantador que deja de 10 los cristales. Atento discreto y buen servicio. Muy recomendado.', autor: 'Lucas F.' },
];

const zonas = [
  { to: '/limpieza-cristales-madrid-centro', nombre: 'Madrid Centro' },
  { to: '/limpieza-cristales-getafe', nombre: 'Getafe' },
  { to: '/limpieza-cristales-pozuelo-de-alarcon', nombre: 'Pozuelo de Alarcón' },
  { to: '/limpieza-cristales-las-rozas', nombre: 'Las Rozas' },
  { to: '/limpieza-cristales-grinon', nombre: 'Griñón' },
];
</script>

<style scoped>
.sm-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 12px;
  font-family: 'Raleway', sans-serif;
}

.sm-breadcrumb {
  font-size: 0.8rem;
  color: var(--text-muted);
  padding: 18px 24px 0;
}
.sm-breadcrumb a { color: var(--blue); text-decoration: none; }
.sm-breadcrumb a:hover { text-decoration: underline; }
.sm-breadcrumb .sep { margin: 0 8px; opacity: 0.6; }

.sm-hero, .sm-card {
  background: var(--white);
  border-radius: var(--r-lg);
  margin: 12px 20px;
  padding: 32px;
}
.sm-hero {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 40px;
  align-items: center;
}
.sm-img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  object-position: center 18%;
  border-radius: var(--r-md);
  box-shadow: var(--shadow-lg);
}
.sm-badge {
  display: inline-flex;
  align-items: center;
  background: var(--blue-pale);
  color: var(--blue-hover);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 14px;
}
.sm-title {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: 2.5rem;
  line-height: 1.15;
  color: var(--text);
  margin: 0 0 16px;
}
.sm-accent { color: var(--blue); }
.sm-lead {
  font-size: 1.02rem;
  line-height: 1.75;
  color: var(--text-muted);
  margin: 0 0 22px;
}
.sm-lead strong { color: var(--text); }

.sm-h2 {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: 1.7rem;
  color: var(--text);
  margin: 0 0 14px;
}
.sm-h3 { font-size: 0.98rem; font-weight: 700; color: var(--text); margin: 0 0 4px; }
.sm-text { font-size: 0.95rem; line-height: 1.75; color: var(--text-muted); margin: 0 0 18px; max-width: 860px; }
.sm-small { font-size: 0.85rem; line-height: 1.6; color: var(--text-muted); margin: 0; }

.sm-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.sm-item {
  display: flex;
  gap: 14px;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 16px;
}
.sm-item-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: var(--blue-pale);
  color: var(--blue);
  flex-shrink: 0;
}

.sm-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.sm-list li { display: flex; gap: 10px; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); }
.sm-list strong { color: var(--text); }
.sm-check { color: #10b981; margin-top: 5px; flex-shrink: 0; }

.sm-reviews { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 16px; }
.sm-review {
  margin: 0;
  background: var(--slate);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 20px;
}
.sm-stars { color: #f59e0b; letter-spacing: 2px; margin-bottom: 8px; }
.sm-review p { font-size: 0.95rem; line-height: 1.65; color: var(--text); margin: 0 0 10px; }
.sm-review cite { font-style: normal; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }
.sm-more { font-size: 0.88rem; font-weight: 700; color: var(--blue); text-decoration: none; }
.sm-more:hover { text-decoration: underline; }

.sm-zonas { display: flex; flex-wrap: wrap; gap: 10px; }
.sm-zona {
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--blue);
  text-decoration: none;
}
.sm-zona:hover { border-color: var(--blue); background: var(--blue-pale); }

.sm-ctas { display: flex; flex-wrap: wrap; gap: 10px; }
.sm-btn {
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  font-size: 0.92rem;
  padding: 12px 22px;
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.sm-btn:hover { transform: translateY(-2px); }
.sm-btn--primary { background: var(--blue); color: #fff; }
.sm-btn--primary:hover { color: #fff; box-shadow: 0 6px 20px rgba(37,99,235,0.35); }
.sm-btn--wa { background: #25d366; color: #fff; }
.sm-btn--wa:hover { color: #fff; box-shadow: 0 6px 20px rgba(37,211,102,0.35); }

.sm-cta {
  background: var(--blue-pale);
  border-radius: var(--r-lg);
  margin: 12px 20px;
  padding: 32px;
  text-align: center;
}
.sm-cta-title {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: 1.7rem;
  color: var(--text);
  margin: 0 0 8px;
}
.sm-cta-sub { color: var(--text-muted); font-size: 0.92rem; margin: 0 0 20px; }

/* En oscuro los fondos pastel deslumbran */
:root[data-theme="dark"] .sm-cta { background: rgba(37,99,235,0.12); }
:root[data-theme="dark"] .sm-item-icon,
:root[data-theme="dark"] .sm-badge { background: rgba(37,99,235,0.18); }
:root[data-theme="dark"] .sm-zona:hover { background: rgba(37,99,235,0.18); }

@media (max-width: 900px) {
  .sm-hero { grid-template-columns: 1fr; gap: 24px; }
  .sm-img { height: 320px; }
  .sm-grid, .sm-reviews { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .sm-hero, .sm-card, .sm-cta { margin: 10px; padding: 24px 18px; border-radius: var(--r-md); }
  .sm-title { font-size: 1.9rem; }
  .sm-h2, .sm-cta-title { font-size: 1.45rem; }
  .sm-btn { flex: 1 1 100%; justify-content: center; }
}
</style>
