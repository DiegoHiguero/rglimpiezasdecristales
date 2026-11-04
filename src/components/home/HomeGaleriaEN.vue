<template>
  <div id="work" class="galeria-wrap">

    <span class="sec-label">
      <font-awesome-icon :icon="['fas', 'images']" class="me-1" />Portfolio
    </span>
    <div class="sec-head">
      <h2 class="sec-title">Completed <span class="sec-accent">work</span></h2>
      <p class="sec-sub">Every photo is a happy client in Madrid and the surrounding area</p>
    </div>

    <div class="gl-tabs">
      <button :class="['gl-tab', { active: tab === 'ba' }]" @click="tab = 'ba'">
        <font-awesome-icon :icon="['fas', 'chevron-left']" /><font-awesome-icon :icon="['fas', 'chevron-right']" />
        Before / After <span class="gl-tab-count">{{ baPairs.length }}</span>
      </button>
      <button :class="['gl-tab', { active: tab === 'fotos' }]" @click="tab = 'fotos'">
        <font-awesome-icon :icon="['fas', 'image']" />
        Photos <span class="gl-tab-count">{{ photos.length }}</span>
      </button>
      <button :class="['gl-tab', { active: tab === 'videos' }]" @click="tab = 'videos'">
        <font-awesome-icon :icon="['fas', 'video']" />
        Videos <span class="gl-tab-count">{{ videos.length }}</span>
      </button>
    </div>

    <!-- ── Photos ── -->
    <div v-if="tab === 'fotos'">
      <div class="gallery-grid">
        <div
          v-for="(item, i) in photos" :key="i"
          v-show="showAllPhotos || i < PHOTOS_PREVIEW_COUNT"
          :class="['gallery-item', { 'gallery-item--featured': i === 0 }]"
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
          {{ showAllPhotos ? 'Show fewer photos' : `Show all photos (${photos.length})` }}
        </button>
      </div>
    </div>

    <!-- ── Videos ── -->
    <div v-if="tab === 'videos'" class="video-grid">
      <div v-for="(v, i) in videos" :key="v.src" class="video-item">
        <video :ref="(el) => (videoEls[i] = el)" :src="v.src" muted loop playsinline preload="metadata"></video>
        <div class="video-overlay">
          <span class="gl-play-badge"><font-awesome-icon :icon="['fas', 'play']" /></span>
          <span class="gallery-tag">{{ v.label }}</span>
        </div>
      </div>
    </div>

    <!-- ── Before / After ── -->
    <div v-if="tab === 'ba'" class="ba-section">
      <p class="ba-hint">
        <font-awesome-icon :icon="['fas', 'chevron-left']" /><font-awesome-icon :icon="['fas', 'chevron-right']" class="me-1" />
        Drag the slider to see the difference
      </p>
      <div class="ba-grid">
        <div v-for="(pair, i) in baPairs" :key="i" class="ba-pair">
          <div
            class="ba-slider"
            @mousedown="startDrag($event, i)"
            @touchstart.prevent="startDrag($event, i)"
          >
            <img :src="pair.after"  :alt="'After · ' + pair.label" class="ba-img ba-img--after" />
            <div class="ba-clip" :style="{ width: sliderPos[i] + '%' }">
              <img :src="pair.before" :alt="'Before · ' + pair.label" class="ba-img ba-img--before" />
            </div>
            <div class="ba-divider-line" :style="{ left: sliderPos[i] + '%' }">
              <div class="ba-handle">
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </div>
            </div>
            <span class="ba-badge ba-badge--before">Before</span>
            <span class="ba-badge ba-badge--after">After</span>
          </div>
          <p class="ba-caption">{{ pair.label }}</p>
        </div>
      </div>
    </div>

    <!-- ── Lightbox ── -->
    <Teleport to="body">
      <div v-if="lightbox.open" class="lb-backdrop" @click="closeLightbox">
        <button class="lb-close" @click="closeLightbox" aria-label="Close">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
        <button v-if="lightbox.index > 0" class="lb-nav lb-nav--prev" @click.stop="nav(-1)" aria-label="Previous">
          <font-awesome-icon :icon="['fas', 'chevron-left']" />
        </button>
        <img :src="photos[lightbox.index].src" :alt="photos[lightbox.index].label" class="lb-img" @click.stop />
        <button v-if="lightbox.index < photos.length - 1" class="lb-nav lb-nav--next" @click.stop="nav(1)" aria-label="Next">
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
        <div class="lb-footer">
          <span class="lb-label">{{ photos[lightbox.index].label }}</span>
          <span class="lb-counter">{{ lightbox.index + 1 }} / {{ photos.length }}</span>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import imgLimpiando  from '../../assets/img/limpiando.webp';
import img20240529a  from '../../assets/img/20240529_100505.webp';
import img20240529b  from '../../assets/img/20240529_100458.webp';
import imgBefore1    from '../../assets/img/Screenshot_20240620_180140_Maps.webp';
import imgAfter1     from '../../assets/img/Screenshot_20240620_180159_Maps.webp';
import imgBefore2    from '../../assets/img/IMG-20250520-WA0000.webp';
import imgAfter2     from '../../assets/img/IMG-20250520-WA0001.webp';
import imgBefore3    from '../../assets/img/ba-pergola-antes.webp';
import imgAfter3     from '../../assets/img/ba-pergola-despues.webp';
import imgBefore4    from '../../assets/img/ba-carteles-antes.webp';
import imgAfter4     from '../../assets/img/ba-carteles-despues.webp';
import imgSingle6    from '../../assets/img/20260518_122343.webp';
import img20260528a  from '../../assets/img/20260528_140011.webp';
import img20260528c  from '../../assets/img/20260528_140712.webp';
import img20260528d  from '../../assets/img/20260528_141113.webp';
import imgPadelNoche   from '../../assets/img/padel-cristales-noche.webp';
import imgPlacasSolares from '../../assets/img/placas-solares-collage.webp';
import imgCristalera   from '../../assets/img/cristalera-terraza.webp';
import imgPertiga2026  from '../../assets/img/20261006-pertiga-fachada.webp';
import imgFachada2026  from '../../assets/img/20261006-fachada-acristalada.webp';
import vidCristalera from '../../assets/img/video-cristalera-web.mp4';
import vidVentana    from '../../assets/img/video-ventana-web.mp4';
import vidFinObra    from '../../assets/img/video-fin-de-obra-web.mp4';
import vidPadel      from '../../assets/img/video-padel-web.mp4';
import vidAccion     from '../../assets/img/videoplayback.mp4';
import vidOct2025    from '../../assets/img/VID-20251022-WA0013.mp4';

// Opens on Before/After: it's the most convincing view at a glance
const tab = ref('ba');
const PHOTOS_PREVIEW_COUNT = 12;
const showAllPhotos = ref(false);
// Real job videos (vertical, shot on a phone), newest first
const videos = [
  { src: vidCristalera, label: 'Glass wall with water-fed pole · Nov 2026' },
  { src: vidVentana, label: 'Windows from inside · Nov 2026' },
  { src: vidFinObra, label: 'Post-construction clean, shop · Oct 2026' },
  { src: vidPadel, label: 'Padel court' },
  { src: vidAccion, label: 'In action' },
  { src: vidOct2025, label: 'October 2025' },
];
const videoEls = [];

const playVideos = () => {
  videoEls.forEach(v => {
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

// Best photos, in display order (the first one is shown large)
const photos = [
  { src: imgFachada2026,   label: 'Glass façade in Getafe · Oct 2026' },
  { src: imgPertiga2026,   label: 'Pure-water pole cleaning · Oct 2026' },
  { src: img20260528d,     label: 'Glass building in Griñón · May 2026' },
  { src: imgLimpiando,     label: 'Terrace window cleaning' },
  { src: img20260528c,     label: 'Glass-walled office · May 2026' },
  { src: imgCristalera,    label: 'Terrace glass enclosure' },
  { src: imgSingle6,       label: 'Rooftop skylight · May 2026' },
  { src: imgPadelNoche,    label: 'Glass-walled padel courts' },
  { src: img20260528a,     label: 'Office glass partitions · May 2026' },
  { src: img20240529b,     label: 'Skylight · May 2024' },
  { src: imgPlacasSolares, label: 'Solar panel cleaning' },
  { src: img20240529a,     label: 'Classroom windows · May 2024' },
];

const baPairs = [
  { before: imgBefore1, after: imgAfter1, label: 'Shop window · Jun 2024' },
  { before: imgBefore2, after: imgAfter2, label: 'Solar panels · May 2025' },
  { before: imgBefore3, after: imgAfter3, label: 'Glass pergola · Oct 2025' },
  { before: imgBefore4, after: imgAfter4, label: 'Poster removal from shop front · Jul 2024' },
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
  scroll-margin-top: 88px;
  background: var(--white);
  margin: 12px 20px;
  padding: 40px 28px 28px;
  border-radius: var(--r-lg);
  overflow: hidden;
}

/* ── Header ── */

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
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.video-item {
  position: relative;
  border-radius: var(--r-md);
  overflow: hidden;
  aspect-ratio: 3 / 4;
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
  .gallery-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 160px; }
  .gallery-item--featured { grid-column: span 2; grid-row: span 1; }
  .video-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .video-overlay { padding: 12px; }
  .gl-play-badge { top: 10px; right: 10px; width: 32px; height: 32px; }
  .ba-grid { grid-template-columns: 1fr; }
  .gl-footer { flex-direction: column; align-items: flex-start; }
  .gl-footer-btn { width: 100%; justify-content: center; }
  .lb-nav--prev { left: 8px; }
  .lb-nav--next { right: 8px; }
}
</style>
