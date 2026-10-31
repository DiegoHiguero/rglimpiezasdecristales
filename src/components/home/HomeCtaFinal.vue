<template>
  <!-- Cierre de la portada: un último empujón a pedir presupuesto antes del pie -->
  <section class="cta-section">
    <img class="cta-img" src="../../assets/img/yomismo.webp" alt="" aria-hidden="true" width="96" height="96" loading="lazy">
    <div class="cta-text">
      <h2 class="cta-title">{{ t.title }}</h2>
      <p class="cta-sub">{{ t.sub }}</p>
    </div>
    <div class="cta-actions">
      <router-link :to="t.to" class="cta-btn cta-btn--main">
        <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />{{ t.main }}
      </router-link>
      <a href="tel:+34625950506" class="cta-btn cta-btn--ghost">
        <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />625 950 506
      </a>
      <a :href="t.wa" target="_blank" rel="noopener noreferrer" class="cta-btn cta-btn--wa">
        <font-awesome-icon :icon="['fab', 'whatsapp']" class="me-2" />WhatsApp
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ lang: { type: String, default: 'es' } });

const TEXTOS = {
  es: {
    title: '¿Hablamos de tus cristales?',
    sub: 'Cuéntame qué necesitas y te paso presupuesto gratis en menos de 24 h.',
    main: 'Pedir presupuesto',
    to: '/contacto',
    wa: 'https://wa.me/34625950506?text=Hola%2C%20quiero%20un%20presupuesto%20para%20limpieza%20de%20cristales',
  },
  en: {
    title: 'Shall we talk about your windows?',
    sub: 'Tell me what you need and I’ll send you a free quote within 24 h.',
    main: 'Get a quote',
    to: '/en/contact',
    wa: 'https://wa.me/34625950506?text=Hi%2C%20I%20would%20like%20a%20quote%20for%20window%20cleaning',
  },
};
const t = computed(() => TEXTOS[props.lang] || TEXTOS.es);
</script>

<style scoped>
.cta-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin: 12px 20px;
  padding: 34px 40px;
  border-radius: var(--r-lg);
  background:
    radial-gradient(circle at 0% 100%, rgba(96,165,250,0.35), transparent 50%),
    linear-gradient(120deg, #1d4ed8 0%, #2563eb 55%, #3b82f6 100%);
  color: #fff;
}
.cta-img {
  width: 84px; height: 84px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 20%;
  border: 3px solid rgba(255,255,255,0.5);
  flex-shrink: 0;
}
.cta-text { flex: 1; min-width: 0; }
.cta-title {
  font-family: 'Anton', sans-serif;
  font-size: 2rem;
  line-height: 1.1;
  color: #fff;
  margin: 0 0 6px;
}
.cta-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.85);
  margin: 0;
}
.cta-actions { display: flex; gap: 10px; flex-shrink: 0; }
.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 12px 20px;
  border-radius: 10px;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
}
.cta-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(15,23,41,0.25); }
.cta-btn--main { background: #fff; color: var(--blue-hover); }
.cta-btn--main:hover { color: var(--blue-hover); }
.cta-btn--ghost { color: #fff; border: 1.5px solid rgba(255,255,255,0.5); }
.cta-btn--ghost:hover { color: #fff; background: rgba(255,255,255,0.12); }
.cta-btn--wa { background: #22c55e; color: #fff; }
.cta-btn--wa:hover { color: #fff; }

@media (max-width: 1199.98px) {
  .cta-section { flex-wrap: wrap; }
  .cta-actions { width: 100%; padding-left: 108px; }
}

@media (max-width: 768px) {
  .cta-section {
    margin: 10px 10px;
    padding: 30px 18px;
    border-radius: var(--r-md);
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  .cta-img { width: 72px; height: 72px; }
  .cta-title { font-size: 1.7rem; }
  .cta-actions { flex-direction: column; padding-left: 0; }
  .cta-btn { width: 100%; }
}
</style>
