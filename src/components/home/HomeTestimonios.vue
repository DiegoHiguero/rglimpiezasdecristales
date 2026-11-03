<template>
  <section class="ti-section" id="testimonios">

    <div class="ti-head">
      <div>
        <span class="ti-label">
          <svg class="g-icon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {{ t.label }}
        </span>
        <h2 class="ti-title">{{ t.title }}</h2>
        <p class="ti-sub">{{ t.sub }}</p>
      </div>

      <!-- Nota media con enlace a la ficha de Google -->
      <a class="ti-score" :href="GOOGLE_RESENAS.url" target="_blank" rel="noopener">
        <span class="ti-score-num">{{ notaTexto }}</span>
        <span class="ti-score-info">
          <span class="ti-stars" aria-hidden="true">★★★★★</span>
          <span class="ti-score-count">{{ t.count }}</span>
          <span class="ti-score-link">{{ t.link }} <font-awesome-icon :icon="['fas', 'arrow-right']" /></span>
        </span>
      </a>
    </div>

    <div class="ti-track" ref="trackRef" @scroll.passive="onScroll">
      <article v-for="(r, i) in resenas" :key="r.nombre" class="ti-card" :class="{ 'ti-card--open': abiertas[i] }">
        <div class="ti-card-top">
          <span class="ti-stars" :aria-label="t.stars">★★★★★</span>
          <svg class="g-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
        <p class="ti-text">{{ r.texto }}</p>
        <button v-if="r.texto.length > LARGO" type="button" class="ti-more" @click="abiertas[i] = !abiertas[i]">
          {{ abiertas[i] ? t.less : t.more }}
        </button>
        <footer class="ti-author">
          <span class="ti-avatar" aria-hidden="true">{{ r.nombre.charAt(0) }}</span>
          <span>
            <strong class="ti-name">{{ r.nombre === 'Reseña anónima' ? t.anon : r.nombre }}</strong>
            <span class="ti-date">{{ mesAnio(r.fecha) }}</span>
          </span>
        </footer>
      </article>
    </div>

    <div class="ti-nav">
      <button type="button" class="ti-arrow" :aria-label="t.prev" :disabled="activo === 0" @click="mover(-1)">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <div class="ti-dots" aria-hidden="true">
        <span v-for="(r, i) in resenas" :key="r.nombre" class="ti-dot" :class="{ 'ti-dot--on': activo === i }"></span>
      </div>
      <button type="button" class="ti-arrow" :aria-label="t.next" :disabled="activo >= resenas.length - 1" @click="mover(1)">
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
    </div>

  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { resenas, GOOGLE_RESENAS } from '../../data/resenas.js';

const props = defineProps({ lang: { type: String, default: 'es' } });

const TEXTOS = {
  es: {
    label: 'Reseñas verificadas de Google',
    title: 'Lo que dicen nuestros clientes',
    sub: 'Opiniones reales, copiadas tal cual de Google.',
    count: `${GOOGLE_RESENAS.total} opiniones en Google`,
    link: 'Ver todas',
    stars: '5 de 5 estrellas',
    more: 'Leer más',
    less: 'Leer menos',
    anon: 'Cliente de Google',
    prev: 'Reseña anterior',
    next: 'Reseña siguiente',
  },
  en: {
    label: 'Verified Google reviews',
    title: 'What our clients say',
    sub: 'Real reviews, copied straight from Google (in Spanish).',
    count: `${GOOGLE_RESENAS.total} reviews on Google`,
    link: 'See all',
    stars: '5 out of 5 stars',
    more: 'Read more',
    less: 'Read less',
    anon: 'Google user',
    prev: 'Previous review',
    next: 'Next review',
  },
};
const t = computed(() => TEXTOS[props.lang] || TEXTOS.es);
const locale = computed(() => (props.lang === 'en' ? 'en-GB' : 'es-ES'));
const notaTexto = computed(() => GOOGLE_RESENAS.nota.toLocaleString(locale.value, { minimumFractionDigits: 1 }));

// Fecha fija (mes y año) en lugar de "hace X meses", que se quedaría desfasado
const mesAnio = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString(locale.value, { month: 'long', year: 'numeric' });

// Las reseñas largas se recortan y se abren con "Leer más"
const LARGO = 240;
const abiertas = reactive({});

const trackRef = ref(null);
const activo = ref(0);

const paso = () => {
  const cards = trackRef.value?.children;
  return cards && cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
};
const onScroll = () => {
  activo.value = Math.round(trackRef.value.scrollLeft / paso());
};
const mover = (dir) => {
  trackRef.value.scrollBy({ left: dir * paso(), behavior: 'smooth' });
};
</script>

<style scoped>
/* Franja oscura en ambos modos: rompe la sucesión de secciones blancas */
.ti-section {
  scroll-margin-top: 88px;
  margin: 12px 20px;
  padding: 48px 40px 36px;
  border-radius: var(--r-lg);
  background:
    radial-gradient(circle at 85% 0%, rgba(37,99,235,0.28), transparent 55%),
    linear-gradient(160deg, #0f1729 0%, #16213a 100%);
  color: #fff;
  overflow: hidden;
}

/* ── Cabecera: título a la izquierda, nota a la derecha ── */
.ti-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;
}
.ti-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,0.08);
  color: #bfdbfe;
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
}
.g-icon { flex-shrink: 0; }
.ti-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.4rem;
  line-height: 1.12;
  color: #fff;
  margin: 0 0 10px;
}
.ti-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.6);
  margin: 0;
}

.ti-score {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
  padding: 14px 20px;
  border-radius: var(--r-md);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  text-decoration: none;
  transition: background var(--t), border-color var(--t);
}
.ti-score:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: #fff; }
.ti-score-num { font-family: 'Anton', sans-serif; font-size: 2.6rem; line-height: 1; }
.ti-score-info { display: flex; flex-direction: column; gap: 2px; font-family: 'Raleway', sans-serif; }
.ti-score-count { font-size: 0.8rem; color: rgba(255,255,255,0.7); }
.ti-score-link { font-size: 0.8rem; font-weight: 700; color: #93c5fd; }
.ti-score-link svg { font-size: 0.7rem; margin-left: 3px; }
.ti-stars { color: #fbbf24; letter-spacing: 2px; font-size: 0.95rem; line-height: 1; }

/* ── Carrusel ── */
.ti-track {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 2px 0 4px;
}
.ti-track::-webkit-scrollbar { display: none; }

.ti-card {
  flex: 0 0 calc((100% - 32px) / 3);
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  padding: 22px 22px 20px;
  border-radius: var(--r-md);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.09);
}
.ti-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.ti-text {
  font-family: 'Raleway', sans-serif;
  font-size: 0.92rem;
  line-height: 1.65;
  color: rgba(255,255,255,0.85);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ti-card--open .ti-text { -webkit-line-clamp: unset; display: block; }
.ti-more {
  align-self: flex-start;
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: none;
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: #93c5fd;
  cursor: pointer;
}
.ti-author {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: auto;
  padding-top: 18px;
}
.ti-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  color: #fff;
}
.ti-name { display: block; font-family: 'Raleway', sans-serif; font-size: 0.88rem; color: #fff; }
.ti-date { display: block; font-family: 'Raleway', sans-serif; font-size: 0.75rem; color: rgba(255,255,255,0.5); }
.ti-date::first-letter { text-transform: uppercase; }

/* ── Flechas y puntos ── */
.ti-nav { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 22px; }
.ti-arrow {
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.18);
  background: transparent;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background var(--t), opacity var(--t);
}
.ti-arrow:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
.ti-arrow:disabled { opacity: 0.3; cursor: default; }
.ti-dots { display: flex; gap: 6px; }
.ti-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.22); transition: width 0.25s, background 0.25s; }
.ti-dot--on { width: 20px; border-radius: 4px; background: #60a5fa; }

@media (max-width: 991.98px) {
  .ti-card { flex-basis: calc((100% - 16px) / 2); }
}

@media (max-width: 768px) {
  .ti-section { margin: 10px 10px; border-radius: var(--r-md); padding: 36px 16px 26px; }
  .ti-head { flex-direction: column; align-items: stretch; gap: 18px; margin-bottom: 22px; }
  .ti-title { font-size: 1.85rem; }
  .ti-score { padding: 12px 16px; }
  .ti-score-num { font-size: 2.2rem; }
  /* Asoma la siguiente tarjeta para que se note que hay más */
  .ti-track { margin: 0 -16px; padding: 2px 16px 4px; scroll-padding-left: 16px; gap: 12px; }
  .ti-card { flex-basis: 84%; padding: 20px 18px 18px; }
  .ti-arrow { display: none; }
}
</style>
