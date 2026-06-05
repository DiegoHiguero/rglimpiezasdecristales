<template>
  <div class="galeria-wrap">

    <div class="gl-header">
      <span class="gl-label">
        <font-awesome-icon :icon="['fas', 'images']" class="me-1" />Portfolio
      </span>
      <h2 class="gl-title">Trabajos <span class="gl-accent">realizados</span></h2>
      <p class="gl-sub">Cada foto es un cliente satisfecho en Madrid y alrededores</p>
      <div class="gl-counters">
        <span class="gl-counter"><font-awesome-icon :icon="['fas', 'image']" class="me-1" />{{ photos.length }} fotos</span>
        <span class="gl-counter"><font-awesome-icon :icon="['fas', 'video']" class="me-1" />2 vídeos</span>
        <span class="gl-counter"><font-awesome-icon :icon="['fas', 'image']" class="me-1" />{{ baPairs.length }} antes/después</span>
        <span class="gl-counter"><font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />Madrid capital y área metropolitana</span>
      </div>
    </div>

    <div class="gallery-grid">
      <div
        v-for="(item, i) in photos" :key="i"
        class="gallery-item animate-on-scroll"
        @click="openLightbox(i)"
      >
        <img :src="item.src" :alt="item.label" loading="lazy" />
        <div class="gallery-overlay">
          <font-awesome-icon :icon="['fas', 'magnifying-glass-plus']" class="gl-zoom" />
          <span class="gallery-tag">{{ item.label }}</span>
        </div>
      </div>

      <div class="gallery-item gallery-item--video animate-on-scroll">
        <video src="../../assets/img/videoplayback.mp4" autoplay muted loop playsinline></video>
        <div class="gallery-overlay gallery-overlay--always">
          <span class="gl-play-badge"><font-awesome-icon :icon="['fas', 'play']" /></span>
          <span class="gallery-tag">En acción</span>
        </div>
      </div>
      <div class="gallery-item gallery-item--video animate-on-scroll">
        <video src="../../assets/img/VID-20251022-WA0013.mp4" autoplay muted loop playsinline></video>
        <div class="gallery-overlay gallery-overlay--always">
          <span class="gl-play-badge"><font-awesome-icon :icon="['fas', 'play']" /></span>
          <span class="gallery-tag">Octubre 2025</span>
        </div>
      </div>
    </div>

    <!-- Antes y Después -->
    <div class="ba-section">
      <div class="ba-header">
        <span class="ba-label-tag">
          <font-awesome-icon :icon="['fas', 'images']" class="me-1" />Transformaciones
        </span>
        <h2 class="ba-title">Antes y <span class="ba-accent">Después</span></h2>
        <p class="ba-sub">Arrastra el separador para ver la diferencia</p>
      </div>

      <div class="ba-grid">
        <div v-for="(pair, i) in baPairs" :key="i" class="ba-pair">

          <!-- Slider interactivo -->
          <template v-if="pair.type === 'slider'">
            <div
              class="ba-slider"
              @mousedown="startDrag($event, i)"
              @touchstart.prevent="startDrag($event, i)"
            >
              <img :src="pair.after"  :alt="'Después · ' + pair.label" class="ba-img ba-img--after" />
              <div class="ba-clip" :style="{ width: sliderPos[i] + '%' }">
                <img :src="pair.before" :alt="'Antes · ' + pair.label" class="ba-img ba-img--before" />
              </div>
              <div class="ba-divider-line" :style="{ left: sliderPos[i] + '%' }">
                <div class="ba-handle">
                  <font-awesome-icon :icon="['fas', 'chevron-left']" />
                  <font-awesome-icon :icon="['fas', 'chevron-right']" />
                </div>
              </div>
              <span class="ba-badge ba-badge--before">Antes</span>
              <span class="ba-badge ba-badge--after">Después</span>
            </div>
          </template>

          <!-- Imagen combinada -->
          <template v-else>
            <div class="ba-single">
              <img :src="pair.src" :alt="pair.label" class="ba-single-img" />
              <span class="ba-badge ba-badge--combined">Antes · Después</span>
            </div>
          </template>

          <p class="ba-caption">{{ pair.label }}</p>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightbox.open" class="lb-backdrop" @click="closeLightbox">
        <button class="lb-close" @click="closeLightbox" aria-label="Cerrar">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
        <button v-if="lightbox.index > 0" class="lb-nav lb-nav--prev" @click.stop="nav(-1)" aria-label="Anterior">
          <font-awesome-icon :icon="['fas', 'chevron-left']" />
        </button>
        <img :src="photos[lightbox.index].src" :alt="photos[lightbox.index].label" class="lb-img" @click.stop />
        <button v-if="lightbox.index < photos.length - 1" class="lb-nav lb-nav--next" @click.stop="nav(1)" aria-label="Siguiente">
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
        <div class="lb-footer">
          <span class="lb-label">{{ photos[lightbox.index].label }}</span>
          <span class="lb-counter">{{ lightbox.index + 1 }} / {{ photos.length }}</span>
        </div>
      </div>
    </Teleport>

    <div class="gl-footer">
      <div class="gl-footer-left">
        <font-awesome-icon :icon="['fas', 'camera']" class="gl-footer-icon" />
        <p class="gl-footer-text">¿Quieres ver tu espacio aquí? Pide tu presupuesto gratis hoy.</p>
      </div>
      <router-link to="/contacto" class="gl-footer-btn">
        <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Solicitar presupuesto
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import img2024Feb    from '../../assets/img/2024-02-19.webp';
import img2024Jul    from '../../assets/img/2024-07-08.webp';
import img2023Ene    from '../../assets/img/20230119_110356.webp';
import img2025Ago    from '../../assets/img/2025-08-30.webp';
import img2025Oct    from '../../assets/img/2025-10-22.webp';
import imgLimpiando  from '../../assets/img/limpiando.webp';
import img20240529a  from '../../assets/img/20240529_100505.webp';
import img20240529b  from '../../assets/img/20240529_100458.webp';
import imgCollage2024 from '../../assets/img/Collage_2024-05-08_17_16_13.webp';
import img20260319   from '../../assets/img/20260319_124222.webp';
import img20260324   from '../../assets/img/20260324_122426.webp';
import img20250917   from '../../assets/img/20250917_131013.webp';
import img20260311   from '../../assets/img/20260311_121255.webp';
import imgBefore1    from '../../assets/img/Screenshot_20240620_180140_Maps.webp';
import imgAfter1     from '../../assets/img/Screenshot_20240620_180159_Maps.webp';
import imgBefore2    from '../../assets/img/IMG-20250520-WA0000.webp';
import imgAfter2     from '../../assets/img/IMG-20250520-WA0001.webp';
import imgSingle5    from '../../assets/img/20260518_113941.webp';
import imgSingle6    from '../../assets/img/20260518_122343.webp';
import imgSingle3    from '../../assets/img/IMG-20230901-WA0000.webp';
import imgSingle4    from '../../assets/img/20230606_132202.webp';
import img20260528a  from '../../assets/img/20260528_140011.webp';
import img20260528b  from '../../assets/img/20260528_140444.webp';
import img20260528c  from '../../assets/img/20260528_140712.webp';
import img20260528d  from '../../assets/img/20260528_141113.webp';

const baPairs = [
  { type: 'slider', before: imgBefore1, after: imgAfter1, label: 'Jun 2024' },
  { type: 'slider', before: imgBefore2, after: imgAfter2, label: 'May 2025' },

  { type: 'single', src: imgCollage2024, label: 'Portfolio · May 2024' },
  { type: 'single', src: img2024Jul,     label: 'Trabajo en altura · Jul 2024' },
  { type: 'single', src: img2025Ago,     label: 'Resultado · Ago 2025' },
  { type: 'single', src: img2025Oct,     label: 'Resultado · Oct 2025' },

];
const sliderPos = ref(baPairs.map(() => 50));
let activeSlider = null;

const startDrag = (e, index) => {
  activeSlider = index;
  e.preventDefault();
};
const onMove = (e) => {
  if (activeSlider === null) return;
  const touch = e.touches ? e.touches[0] : e;
  const sliders = document.querySelectorAll('.ba-slider');
  const rect = sliders[activeSlider]?.getBoundingClientRect();
  if (!rect) return;
  const pct = Math.min(100, Math.max(0, ((touch.clientX - rect.left) / rect.width) * 100));
  sliderPos.value[activeSlider] = pct;
};
const stopDrag = () => { activeSlider = null; };

const photos = [
  { src: img2024Feb,    label: 'Local comercial · Feb 2024' },
  { src: img2023Ene,    label: 'Cristales exteriores · Ene 2023' },
  { src: imgLimpiando,  label: 'Pértiga telescópica en acción' },
  { src: img20240529a,  label: 'Trabajo completado · May 2024' },
  { src: img20240529b,  label: 'Detalle final · May 2024' },
  { src: img20250917,   label: 'Cristales impecables · Sep 2025' },
  { src: img20260311,   label: 'Trabajo reciente · Mar 2026' },
  { src: img20260319,   label: 'Fachada limpia · Mar 2026' },
  { src: img20260324,   label: 'Resultado final · Mar 2026' },
  { src: imgSingle3,    label: 'Trabajo · Sep 2023' },
  { src: imgSingle4,    label: 'Trabajo · Jun 2023' },
  { src: imgSingle5,    label: 'Trabajo · May 2026' },
  { src: imgSingle6,    label: 'Trabajo · May 2026' },
  { src: img20260528a,  label: 'Trabajo · May 2026' },
  { src: img20260528b,  label: 'Trabajo · May 2026' },
  { src: img20260528c,  label: 'Trabajo · May 2026' },
  { src: img20260528d,  label: 'Trabajo · May 2026' },
];

const lightbox = ref({ open: false, index: 0 });

const openLightbox = (index) => {
  lightbox.value = { open: true, index };
  document.body.style.overflow = 'hidden';
};
const closeLightbox = () => {
  lightbox.value.open = false;
  document.body.style.overflow = '';
};
const nav = (dir) => {
  const next = lightbox.value.index + dir;
  if (next >= 0 && next < photos.length) lightbox.value.index = next;
};
const onKey = (e) => {
  if (!lightbox.value.open) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   nav(-1);
  if (e.key === 'ArrowRight')  nav(1);
};

onMounted(() => {
  document.addEventListener('keydown', onKey);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', stopDrag);
});
onUnmounted(() => {
  document.removeEventListener('keydown', onKey);
  document.removeEventListener('mousemove', onMove);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchmove', onMove);
  document.removeEventListener('touchend', stopDrag);
});
</script>

<style scoped>
.galeria-wrap {
  background: var(--slate);
  margin: 12px 15px;
  padding: 40px 28px 28px;
  border-radius: var(--r-lg);
  overflow: hidden;
}

/* ── Header ── */
.gl-header { text-align: center; margin-bottom: 22px; }
.gl-label {
  display: inline-flex;
  align-items: center;
  background: var(--blue-pale);
  color: var(--blue);
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 14px;
}
.gl-title {
  font-family: 'Anton', sans-serif;
  color: var(--text);
  font-size: 2.2rem;
  line-height: 1.1;
  margin: 0 0 10px;
}
.gl-accent { color: var(--blue); }
.gl-sub {
  font-family: 'Raleway', sans-serif;
  color: var(--text-muted);
  font-size: 0.92rem;
  margin: 0 0 20px;
}
.gl-counters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}
.gl-counter {
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--white);
  border: 1px solid var(--border);
  padding: 5px 14px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
}

/* ── Grid ── */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.gallery-item {
  position: relative;
  border-radius: var(--r-sm);
  cursor: pointer;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--navy-2);
}
.gallery-item img, .gallery-item--video video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s ease;
}
.gallery-item:hover img,
.gallery-item--video:hover video { transform: scale(1.07); }

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10,16,30,0.82) 0%, transparent 55%);
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 14px 16px;
  gap: 6px;
}
.gallery-item:hover .gallery-overlay { opacity: 1; }
.gallery-overlay--always { opacity: 1; }

.gl-zoom {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255,255,255,0.9);
  font-size: 1.6rem;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
  transition: transform 0.2s;
}
.gallery-item:hover .gl-zoom { transform: translate(-50%, -50%) scale(1.15); }

.gallery-tag {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  color: #fff;
  letter-spacing: 0.04em;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
}
.gl-play-badge {
  position: absolute;
  top: 12px; right: 12px;
  width: 32px; height: 32px;
  border-radius: 50%;
  background: rgba(37,99,235,0.85);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem;
  backdrop-filter: blur(4px);
  padding-left: 2px;
}

/* ── Antes y Después ── */
.ba-section {
  margin-top: 48px;
}
.ba-header {
  text-align: center;
  margin-bottom: 28px;
}
.ba-label-tag {
  display: inline-flex;
  align-items: center;
  background: var(--blue-pale);
  color: var(--blue);
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
}
.ba-title {
  font-family: 'Anton', sans-serif;
  color: var(--text);
  font-size: 2rem;
  line-height: 1.1;
  margin: 0 0 8px;
}
.ba-accent { color: var(--blue); }
.ba-sub {
  font-family: 'Raleway', sans-serif;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0;
}

.ba-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 1100px;
  margin: 0 auto;
}

.ba-pair { display: flex; flex-direction: column; gap: 10px; }

.ba-slider {
  position: relative;
  border-radius: var(--r-md);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  cursor: ew-resize;
  user-select: none;
  background: var(--navy-2);
}
.ba-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}
.ba-clip {
  position: absolute;
  inset: 0;
  overflow: hidden;
  width: 50%;
}
.ba-img--before {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ba-divider-line {
  position: absolute;
  top: 0; bottom: 0;
  width: 2px;
  background: #fff;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.ba-handle {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 0.65rem;
  color: #1e293b;
  flex-shrink: 0;
}

.ba-badge {
  position: absolute;
  top: 12px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 20px;
  pointer-events: none;
}
.ba-badge--before {
  left: 12px;
  background: rgba(0,0,0,0.55);
  color: rgba(255,255,255,0.85);
}
.ba-badge--after {
  right: 12px;
  background: rgba(37,99,235,0.75);
  color: #fff;
}

.ba-single {
  position: relative;
  border-radius: var(--r-md);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--navy-2);
}
.ba-single-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s ease;
}
.ba-single:hover .ba-single-img { transform: scale(1.04); }

.ba-badge--combined {
  left: 50%;
  transform: translateX(-50%);
  background: rgba(37,99,235,0.75);
  color: #fff;
  white-space: nowrap;
}

.ba-caption {
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  color: var(--text-muted);
  text-align: center;
  margin: 0;
}

/* ── Lightbox ── */
.lb-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  animation: lb-in 0.2s ease;
  cursor: zoom-out;
}
@keyframes lb-in { from { opacity: 0; } to { opacity: 1; } }
.lb-img {
  max-width: min(90vw, 1100px);
  max-height: 78vh;
  object-fit: contain;
  border-radius: var(--r-md);
  box-shadow: 0 24px 80px rgba(0,0,0,0.7);
  cursor: default;
}
.lb-close {
  position: fixed;
  top: 18px; right: 22px;
  width: 40px; height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
  z-index: 1;
}
.lb-close:hover { background: rgba(255,255,255,0.22); }

.lb-nav {
  position: fixed;
  top: 50%; transform: translateY(-50%);
  width: 46px; height: 46px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, transform 0.2s;
  z-index: 1;
}
.lb-nav:hover { background: rgba(255,255,255,0.22); }
.lb-nav--prev { left: 18px; }
.lb-nav--prev:hover { transform: translateY(-50%) translateX(-2px); }
.lb-nav--next { right: 18px; }
.lb-nav--next:hover { transform: translateY(-50%) translateX(2px); }

.lb-footer {
  display: flex;
  align-items: center;
  gap: 16px;
}
.lb-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255,255,255,0.65);
  letter-spacing: 0.05em;
}
.lb-counter {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.08);
  padding: 3px 10px;
  border-radius: 20px;
}

/* ── Footer CTA ── */
.gl-footer {
  margin-top: 28px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.gl-footer-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 200px;
}
.gl-footer-icon {
  font-size: 1.3rem;
  color: var(--blue);
  flex-shrink: 0;
}
.gl-footer-text {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: var(--text-muted);
  margin: 0;
}
.gl-footer-btn {
  display: inline-flex;
  align-items: center;
  background: var(--blue);
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.86rem;
  padding: 11px 20px;
  border-radius: 10px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.gl-footer-btn:hover {
  background: var(--blue-hover);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37,99,235,0.35);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .galeria-wrap { margin: 10px 10px; padding: 32px 12px 24px; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 7px; }
  .gl-title { font-size: 1.7rem; }
  .gl-footer { flex-direction: column; align-items: flex-start; }
  .gl-footer-btn { width: 100%; justify-content: center; }
  .lb-nav--prev { left: 8px; }
  .lb-nav--next { right: 8px; }
  .ba-grid { grid-template-columns: 1fr; }
  .ba-title { font-size: 1.6rem; }
  .ba-badge--combined { left: 12px; transform: none; }
}
</style>
