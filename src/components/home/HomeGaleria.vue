<template>
  <div id="trabajos-realizados" class="galeria-wrap">

    <span class="gl-label">
      <font-awesome-icon :icon="['fas', 'images']" class="me-1" />Portfolio
    </span>
    <div class="gl-header">
      <h2 class="gl-title">Trabajos <span class="gl-accent">realizados</span></h2>
      <p class="gl-sub">Cada foto es un cliente satisfecho en Madrid y alrededores</p>
    </div>

    <div class="gl-tabs">
      <button :class="['gl-tab', { active: tab === 'fotos' }]" @click="tab = 'fotos'">
        <font-awesome-icon :icon="['fas', 'image']" />
        Fotos <span class="gl-tab-count">{{ photos.length }}</span>
      </button>
      <button :class="['gl-tab', { active: tab === 'videos' }]" @click="tab = 'videos'">
        <font-awesome-icon :icon="['fas', 'video']" />
        Vídeos <span class="gl-tab-count">2</span>
      </button>
      <button :class="['gl-tab', { active: tab === 'ba' }]" @click="tab = 'ba'">
        <font-awesome-icon :icon="['fas', 'chevron-left']" /><font-awesome-icon :icon="['fas', 'chevron-right']" />
        Antes / Después <span class="gl-tab-count">{{ baPairs.length }}</span>
      </button>
    </div>

    <!-- ── Fotos ── -->
    <div v-if="tab === 'fotos'">
      <div class="gallery-grid">
        <div
          v-for="(item, i) in photos" :key="i"
          v-show="showAllPhotos || i < PHOTOS_PREVIEW_COUNT"
          :class="['gallery-item', 'animate-on-scroll', { 'gallery-item--featured': i === 0 }]"
          @click="openLightbox(i)"
        >
          <img :src="item.src" :alt="item.label" loading="lazy" />
          <div class="gallery-overlay">
            <font-awesome-icon :icon="['fas', 'magnifying-glass-plus']" class="gl-zoom" />
            <span class="gallery-tag">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <div v-if="photos.length > PHOTOS_PREVIEW_COUNT" class="gl-toggle-row">
        <button type="button" class="gl-toggle-btn" @click="showAllPhotos = !showAllPhotos">
          <font-awesome-icon :icon="['fas', showAllPhotos ? 'chevron-up' : 'chevron-down']" class="me-2" />
          {{ showAllPhotos ? 'Ver menos fotos' : `Ver todas las fotos (${photos.length})` }}
        </button>
      </div>
    </div>

    <!-- ── Vídeos ── -->
    <div v-if="tab === 'videos'" class="video-grid">
      <div class="video-item">
        <video ref="videoA" src="../../assets/img/videoplayback.mp4" muted loop playsinline></video>
        <div class="video-overlay">
          <span class="gl-play-badge"><font-awesome-icon :icon="['fas', 'play']" /></span>
          <span class="gallery-tag">En acción</span>
        </div>
      </div>
      <div class="video-item">
        <video ref="videoB" src="../../assets/img/VID-20251022-WA0013.mp4" muted loop playsinline></video>
        <div class="video-overlay">
          <span class="gl-play-badge"><font-awesome-icon :icon="['fas', 'play']" /></span>
          <span class="gallery-tag">Octubre 2025</span>
        </div>
      </div>
    </div>

    <!-- ── Antes / Después ── -->
    <div v-if="tab === 'ba'" class="ba-section">
      <p class="ba-hint">
        <font-awesome-icon :icon="['fas', 'chevron-left']" /><font-awesome-icon :icon="['fas', 'chevron-right']" class="me-1" />
        Arrastra el separador para ver la diferencia
      </p>
      <div class="ba-grid">
        <div v-for="(pair, i) in baPairs" :key="i" class="ba-pair">
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
          <p class="ba-caption">{{ pair.label }}</p>
        </div>
      </div>
    </div>

    <!-- ── Lightbox ── -->
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
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
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
import imgPadelVacio   from '../../assets/img/padel-cristales-vacio.webp';
import imgPadelNoche   from '../../assets/img/padel-cristales-noche.webp';
import imgPlacasSolares from '../../assets/img/placas-solares-collage.webp';
import imgCristalera   from '../../assets/img/cristalera-terraza.webp';

const tab = ref('fotos');
const PHOTOS_PREVIEW_COUNT = 9;
const showAllPhotos = ref(false);
const videoA = ref(null);
const videoB = ref(null);

const playVideos = () => {
  [videoA.value, videoB.value].forEach(v => {
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  });
};

watch(tab, async (val) => {
  if (val === 'videos') {
    await nextTick();
    playVideos();
  }
});

const photos = [
  { src: imgLimpiando,   label: 'Pértiga telescópica en acción' },
  { src: img2024Feb,     label: 'Local comercial · Feb 2024' },
  { src: img2023Ene,     label: 'Cristales exteriores · Ene 2023' },
  { src: img20240529a,   label: 'Trabajo completado · May 2024' },
  { src: img20240529b,   label: 'Detalle final · May 2024' },
  { src: imgCollage2024, label: 'Portfolio · May 2024' },
  { src: img2024Jul,     label: 'Trabajo en altura · Jul 2024' },
  { src: imgSingle3,     label: 'Trabajo · Sep 2023' },
  { src: imgSingle4,     label: 'Trabajo · Jun 2023' },
  { src: img20250917,    label: 'Cristales impecables · Sep 2025' },
  { src: img2025Ago,     label: 'Resultado · Ago 2025' },
  { src: img2025Oct,     label: 'Resultado · Oct 2025' },
  { src: img20260311,    label: 'Trabajo reciente · Mar 2026' },
  { src: img20260319,    label: 'Fachada limpia · Mar 2026' },
  { src: img20260324,    label: 'Resultado final · Mar 2026' },
  { src: imgSingle5,     label: 'Trabajo · May 2026' },
  { src: imgSingle6,     label: 'Trabajo · May 2026' },
  { src: img20260528a,   label: 'Trabajo · May 2026' },
  { src: img20260528b,   label: 'Trabajo · May 2026' },
  { src: img20260528c,   label: 'Trabajo · May 2026' },
  { src: img20260528d,   label: 'Trabajo · May 2026' },
  { src: imgCristalera,    label: 'Cristalera de terraza · Instalación' },
  { src: imgPlacasSolares, label: 'Limpieza de placas solares' },
  { src: imgPadelNoche,    label: 'Pistas de pádel acristaladas' },
  { src: imgPadelVacio,    label: 'Cristales de pista de pádel' },
];

const baPairs = [
  { before: imgBefore1, after: imgAfter1, label: 'Escaparate comercial · Jun 2024' },
  { before: imgBefore2, after: imgAfter2, label: 'Comunidad de vecinos · May 2025' },
];

const sliderPos = ref(baPairs.map(() => 50));
let activeSlider = null;

const startDrag = (e, index) => { activeSlider = index; };
const onMove = (e) => {
  if (activeSlider === null) return;
  const touch = e.touches ? e.touches[0] : e;
  const sliders = document.querySelectorAll('.ba-slider');
  const rect = sliders[activeSlider]?.getBoundingClientRect();
  if (!rect) return;
  sliderPos.value[activeSlider] = Math.min(100, Math.max(0, ((touch.clientX - rect.left) / rect.width) * 100));
};
const stopDrag = () => { activeSlider = null; };

const lightbox = ref({ open: false, index: 0 });
const openLightbox = (index) => { lightbox.value = { open: true, index }; document.body.style.overflow = 'hidden'; };
const closeLightbox = () => { lightbox.value.open = false; document.body.style.overflow = ''; };
const nav = (dir) => {
  const next = lightbox.value.index + dir;
  if (next >= 0 && next < photos.length) lightbox.value.index = next;
};
const onKey = (e) => {
  if (!lightbox.value.open) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  nav(-1);
  if (e.key === 'ArrowRight') nav(1);
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
  background: var(--white);
  margin: 12px 20px;
  padding: 40px 28px 28px;
  border-radius: var(--r-lg);
  overflow: hidden;
}

/* ── Header ── */
.gl-header { text-align: center; margin-bottom: 28px; }
.gl-label {
  display: flex; width: fit-content; align-items: center;
  background: var(--blue-pale); color: var(--blue-hover);
  font-family: 'Raleway', sans-serif; font-size: 0.72rem;
  font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
  padding: 5px 14px; border-radius: 20px; margin-bottom: 14px;
}
.gl-title { font-family: 'Anton', sans-serif; color: var(--text); font-size: 2.2rem; line-height: 1.1; margin: 0 0 10px; }
.gl-accent { color: var(--blue); }
.gl-sub { font-family: 'Raleway', sans-serif; color: var(--text-muted); font-size: 0.92rem; margin: 0; }

/* ── Tabs ── */
.gl-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.gl-tab {
  display: inline-flex; align-items: center; gap: 7px;
  font-family: 'Raleway', sans-serif; font-size: 0.85rem; font-weight: 700;
  padding: 9px 20px; border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--slate); color: var(--text-muted);
  cursor: pointer; transition: all 0.2s;
}
.gl-tab:hover { border-color: var(--blue); color: var(--blue); }
.gl-tab.active { background: var(--blue); border-color: var(--blue); color: #fff; }
.gl-tab-count {
  font-size: 0.7rem; font-weight: 700;
  padding: 1px 8px; border-radius: 20px;
  background: rgba(0,0,0,0.12);
}
.gl-tab.active .gl-tab-count { background: rgba(0,0,0,0.2); }

/* ── Photo grid ── */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 210px;
  gap: 10px;
}
.gallery-item {
  position: relative;
  border-radius: var(--r-sm);
  cursor: pointer;
  overflow: hidden;
  background: var(--slate);
}
.gallery-item--featured {
  grid-column: span 2;
  grid-row: span 2;
}
.gallery-item img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform 0.45s ease;
}
.gallery-item:hover img { transform: scale(1.07); }

.gallery-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(10,16,30,0.82) 0%, transparent 55%);
  opacity: 0; transition: opacity 0.3s;
  display: flex; flex-direction: column;
  align-items: flex-start; justify-content: flex-end;
  padding: 14px 16px; gap: 6px;
}
.gallery-item:hover .gallery-overlay { opacity: 1; }

.gl-zoom {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255,255,255,0.9); font-size: 1.6rem;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
  transition: transform 0.2s;
}
.gallery-item:hover .gl-zoom { transform: translate(-50%, -50%) scale(1.15); }
.gallery-tag {
  font-family: 'Raleway', sans-serif; font-weight: 700;
  font-size: 0.78rem; color: #fff; letter-spacing: 0.04em;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
}

.gl-toggle-row { display: flex; justify-content: center; margin-top: 18px; }
.gl-toggle-btn {
  display: inline-flex; align-items: center;
  font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.85rem;
  color: var(--blue); background: var(--blue-pale);
  border: 1.5px solid transparent;
  padding: 10px 22px; border-radius: 20px; cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.gl-toggle-btn:hover { border-color: var(--blue); transform: translateY(-1px); }

/* ── Video grid ── */
.video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.video-item {
  position: relative;
  border-radius: var(--r-md);
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: var(--slate);
}
.video-item video {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.video-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(10,16,30,0.7) 0%, transparent 50%);
  display: flex; flex-direction: column;
  align-items: flex-start; justify-content: flex-end;
  padding: 18px 20px; gap: 8px;
}
.gl-play-badge {
  position: absolute; top: 14px; right: 14px;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(37,99,235,0.85); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; padding-left: 3px;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
}

/* ── Antes / Después ── */
.ba-section { }
.ba-hint {
  text-align: center;
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem; color: var(--text-muted);
  margin: 0 0 20px; letter-spacing: 0.03em;
}
.ba-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.ba-pair { display: flex; flex-direction: column; gap: 12px; }
.ba-slider {
  position: relative;
  border-radius: var(--r-md);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  cursor: ew-resize;
  user-select: none;
  background: var(--slate);
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
}
.ba-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; display: block; pointer-events: none;
}
.ba-clip {
  position: absolute; inset: 0; overflow: hidden; width: 50%;
}
.ba-img--before {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: cover;
}
.ba-divider-line {
  position: absolute; top: 0; bottom: 0; width: 2px;
  background: #fff; left: 50%;
  transform: translateX(-50%);
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
.ba-handle {
  width: 42px; height: 42px; border-radius: 50%;
  background: #fff; box-shadow: 0 2px 16px rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center;
  gap: 2px; font-size: 0.65rem; color: #1e293b; flex-shrink: 0;
}
.ba-badge {
  position: absolute; top: 14px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 4px 12px; border-radius: 20px; pointer-events: none;
}
.ba-badge--before { left: 14px; background: rgba(0,0,0,0.55); color: rgba(255,255,255,0.9); }
.ba-badge--after  { right: 14px; background: rgba(37,99,235,0.8); color: #fff; }
.ba-caption {
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem; font-weight: 600;
  color: var(--text-muted); text-align: center; margin: 0;
}

/* ── Lightbox ── */
.lb-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.92);
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 16px;
  animation: lb-in 0.2s ease; cursor: zoom-out;
}
@keyframes lb-in { from { opacity: 0; } to { opacity: 1; } }
.lb-img {
  max-width: min(90vw, 1100px); max-height: 78vh;
  object-fit: contain; border-radius: var(--r-md);
  box-shadow: 0 24px 80px rgba(0,0,0,0.7); cursor: default;
}
.lb-close {
  position: fixed; top: 18px; right: 22px;
  width: 40px; height: 40px; border-radius: 50%;
  border: none; background: rgba(255,255,255,0.1); color: #fff;
  font-size: 1.1rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s; z-index: 1;
}
.lb-close:hover { background: rgba(255,255,255,0.22); }
.lb-nav {
  position: fixed; top: 50%; transform: translateY(-50%);
  width: 46px; height: 46px; border-radius: 50%;
  border: none; background: rgba(255,255,255,0.1); color: #fff;
  font-size: 1rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, transform 0.2s; z-index: 1;
}
.lb-nav:hover { background: rgba(255,255,255,0.22); }
.lb-nav--prev { left: 18px; }
.lb-nav--prev:hover { transform: translateY(-50%) translateX(-2px); }
.lb-nav--next { right: 18px; }
.lb-nav--next:hover { transform: translateY(-50%) translateX(2px); }
.lb-footer { display: flex; align-items: center; gap: 16px; }
.lb-label {
  font-family: 'Raleway', sans-serif; font-size: 0.85rem; font-weight: 600;
  color: rgba(255,255,255,0.65); letter-spacing: 0.05em;
}
.lb-counter {
  font-family: 'Raleway', sans-serif; font-size: 0.75rem;
  color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.08);
  padding: 3px 10px; border-radius: 20px;
}

/* ── Footer CTA ── */
.gl-footer {
  margin-top: 28px;
  background: var(--slate);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 20px 24px;
  display: flex; align-items: center;
  justify-content: space-between; gap: 16px; flex-wrap: wrap;
}
.gl-footer-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 200px; }
.gl-footer-icon { font-size: 1.3rem; color: var(--blue); flex-shrink: 0; }
.gl-footer-text { font-family: 'Raleway', sans-serif; font-size: 0.88rem; color: var(--text-muted); margin: 0; }
.gl-footer-btn {
  display: inline-flex; align-items: center;
  background: var(--blue); color: #fff;
  font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.86rem;
  padding: 11px 20px; border-radius: 10px; text-decoration: none; white-space: nowrap;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.gl-footer-btn:hover { background: var(--blue-hover); color: #fff; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,0.35); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .galeria-wrap { margin: 10px 10px; padding: 32px 12px 24px; }
  .gl-title { font-size: 1.7rem; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 160px; }
  .gallery-item--featured { grid-column: span 2; grid-row: span 1; }
  .video-grid { grid-template-columns: 1fr; }
  .ba-grid { grid-template-columns: 1fr; }
  .gl-footer { flex-direction: column; align-items: flex-start; }
  .gl-footer-btn { width: 100%; justify-content: center; }
  .lb-nav--prev { left: 8px; }
  .lb-nav--next { right: 8px; }
}
</style>
