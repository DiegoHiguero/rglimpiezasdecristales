<template>
  <div class="tr-page">

    <div class="tr-breadcrumb">
      <router-link to="/">Inicio</router-link>
      <span class="sep">/</span>
      <span>Trabajos realizados</span>
    </div>

    <header class="tr-header">
      <h1 class="tr-title">Trabajos realizados de limpieza de cristales <span class="tr-accent">en Madrid</span></h1>
      <p class="tr-intro">
        Fotos reales de nuestros trabajos en viviendas, comunidades, locales, oficinas y fachadas de la
        Comunidad de Madrid: sin retoques ni imágenes de catálogo. Pasa a la pestaña Antes / Después para
        comparar el resultado arrastrando el separador.
      </p>
    </header>

    <!-- Misma galería que la portada, en modo completo (todas las fotos) -->
    <HomeGaleria completa />

    <section class="tr-card">
      <h2 class="tr-h2">Qué tipo de trabajos hacemos</h2>
      <div class="tr-tipos">
        <router-link v-for="t in tipos" :key="t.to" :to="t.to" class="tr-tipo">
          <span class="tr-tipo-icon"><font-awesome-icon :icon="t.icono" /></span>
          <span>
            <span class="tr-tipo-title">{{ t.titulo }}</span>
            <span class="tr-tipo-text">{{ t.texto }}</span>
          </span>
        </router-link>
      </div>
    </section>

    <section class="tr-cta">
      <h2 class="tr-cta-title">¿Quieres que tus cristales queden así?</h2>
      <p class="tr-cta-sub">Pide tu presupuesto gratis y te respondemos en menos de 24 horas.</p>
      <div class="tr-cta-btns">
        <a href="tel:+34625950506" class="tr-btn tr-btn--primary">
          <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />625 950 506
        </a>
        <a href="https://wa.me/34625950506?text=Hola%2C%20quiero%20un%20presupuesto%20para%20limpieza%20de%20cristales" target="_blank" rel="noopener noreferrer" class="tr-btn tr-btn--wa">
          <font-awesome-icon :icon="['fab', 'whatsapp']" class="me-2" />WhatsApp
        </a>
        <router-link to="/precios" class="tr-btn tr-btn--outline">Ver precios</router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import HomeGaleria from '../components/home/HomeGaleria.vue';

const tipos = [
  { to: '/limpieza-cristales-hogares', icono: ['fas', 'house'], titulo: 'Viviendas', texto: 'Pisos y chalets, por dentro y por fuera' },
  { to: '/limpieza-cristales-comunidades', icono: ['fas', 'building-columns'], titulo: 'Comunidades', texto: 'Portales y cristaleras de zonas comunes' },
  { to: '/limpieza-cristales-locales-comerciales', icono: ['fas', 'store'], titulo: 'Locales comerciales', texto: 'Escaparates sin cerrar el negocio' },
  { to: '/limpieza-cristales-oficinas', icono: ['fas', 'building'], titulo: 'Oficinas y naves', texto: 'Cristaleras, mamparas y lucernarios' },
  { to: '/agua-pura-altura', icono: ['fas', 'droplet'], titulo: 'Fachadas en altura', texto: 'Agua pura hasta 10 metros sin andamios' },
  { to: '/limpieza-placas-solares', icono: ['fas', 'solar-panel'], titulo: 'Placas solares', texto: 'Agua desmineralizada, sin químicos' },
];
</script>

<style scoped>
.tr-page {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 12px;
  font-family: 'Raleway', sans-serif;
}

.tr-breadcrumb {
  font-size: 0.8rem;
  color: var(--text-muted);
  padding: 18px 24px 0;
}
.tr-breadcrumb a { color: var(--blue); text-decoration: none; }
.tr-breadcrumb a:hover { text-decoration: underline; }
.tr-breadcrumb .sep { margin: 0 8px; opacity: 0.6; }

.tr-header {
  /* Foto del cepillo de agua pura con velo oscuro para que el texto se lea */
  background: linear-gradient(135deg, rgba(15,23,41,0.88) 0%, rgba(15,23,41,0.5) 100%),
              url('../assets/img/cabecera-agua-pura.webp') center/cover no-repeat;
}
.tr-card { background: var(--white); }
.tr-header, .tr-card {
  border-radius: var(--r-lg);
  margin: 12px 20px;
  padding: 32px;
}
.tr-title {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: 2.4rem;
  line-height: 1.15;
  color: #fff;
  margin: 0 0 14px;
}
.tr-accent { color: #93c5fd; }
.tr-intro {
  font-size: 1rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.85);
  margin: 0;
  max-width: 780px;
}

.tr-h2 {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: 1.7rem;
  color: var(--text);
  margin: 0 0 20px;
}
.tr-tipos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.tr-tipo {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 16px;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s;
}
.tr-tipo:hover { border-color: var(--blue); transform: translateY(-2px); }
.tr-tipo-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: var(--blue-pale);
  color: var(--blue);
  flex-shrink: 0;
}
.tr-tipo-title { display: block; font-weight: 700; font-size: 0.95rem; color: var(--text); }
.tr-tipo-text { display: block; font-size: 0.8rem; color: var(--text-muted); margin-top: 2px; }

.tr-cta {
  background: var(--blue-pale);
  border-radius: var(--r-lg);
  margin: 12px 20px;
  padding: 32px;
  text-align: center;
}
.tr-cta-title {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: 1.7rem;
  color: var(--text);
  margin: 0 0 8px;
}
.tr-cta-sub { color: var(--text-muted); font-size: 0.92rem; margin: 0 0 20px; }
.tr-cta-btns { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; }
.tr-btn {
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 12px 22px;
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.tr-btn:hover { transform: translateY(-2px); }
.tr-btn--primary { background: var(--blue); color: #fff; }
.tr-btn--primary:hover { color: #fff; box-shadow: 0 6px 20px rgba(37,99,235,0.35); }
.tr-btn--wa { background: #25d366; color: #fff; }
.tr-btn--wa:hover { color: #fff; box-shadow: 0 6px 20px rgba(37,211,102,0.35); }
.tr-btn--outline { border: 1.5px solid var(--blue); color: var(--blue); background: var(--white); }

/* En oscuro el fondo pastel del CTA y de los iconos deslumbra */
:root[data-theme="dark"] .tr-cta { background: rgba(37,99,235,0.12); }
:root[data-theme="dark"] .tr-tipo-icon { background: rgba(37,99,235,0.18); }

@media (max-width: 900px) {
  .tr-tipos { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .tr-header, .tr-card, .tr-cta { margin: 10px; padding: 24px 18px; border-radius: var(--r-md); }
  .tr-title { font-size: 1.9rem; }
  .tr-h2, .tr-cta-title { font-size: 1.45rem; }
  .tr-tipos { grid-template-columns: 1fr; }
  .tr-btn { flex: 1 1 100%; justify-content: center; }
}
</style>
