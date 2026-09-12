<template>
  <div class="vs-wrap">
    <span class="vs-label">
      <font-awesome-icon :icon="['fas', 'video']" class="me-1" />En acción
    </span>
    <div class="vs-header">
      <h2 class="vs-title">Así trabajamos, <span class="vs-accent">de verdad</span></h2>
      <p class="vs-sub">Nada de fotos de stock — grabado en clientes reales de Madrid</p>
    </div>

    <div class="vs-phones">
      <div v-for="(v, i) in videosVisibles" :key="i" class="phone-mockup animate-on-scroll">
        <div class="phone-notch"></div>
        <video
          :src="v.src"
          muted
          loop
          playsinline
          autoplay
          @timeupdate="onTimeUpdate($event, v)"
          @loadedmetadata="onLoaded($event, v)"
        ></video>
      </div>
    </div>

    <router-link to="/#trabajos-realizados" class="vs-cta">
      Ver más fotos y vídeos <font-awesome-icon :icon="['fas', 'arrow-right']" class="ms-1" />
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import videoA from '../../assets/img/videoplayback.mp4';
import videoB from '../../assets/img/VID-20251022-WA0013.mp4';

// Solo se enseña un fragmento corto en bucle, no el vídeo entero.
const videosVisibles = ref([
  { src: videoA, start: 1.5, end: 7 },
  { src: videoB, start: 1,   end: 6.5 },
]);

function onLoaded(e, v) {
  e.target.currentTime = v.start;
  e.target.play().catch(() => {});
}

function onTimeUpdate(e, v) {
  if (e.target.currentTime >= v.end || e.target.currentTime < v.start) {
    e.target.currentTime = v.start;
  }
}
</script>

<style scoped>
.vs-wrap {
  background: var(--white);
  margin: 12px 20px;
  padding: 40px 28px;
  border-radius: var(--r-lg);
  text-align: center;
  overflow: hidden;
}

.vs-label {
  display: inline-flex; width: fit-content; align-items: center;
  background: var(--blue-pale); color: var(--blue-hover);
  font-family: 'Raleway', sans-serif; font-size: 0.72rem;
  font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
  padding: 5px 14px; border-radius: 20px; margin-bottom: 14px;
}
.vs-header { margin-bottom: 32px; }
.vs-title { font-family: 'Anton', sans-serif; color: var(--text); font-size: 2.2rem; line-height: 1.1; margin: 0 0 10px; }
.vs-accent { color: var(--blue); }
.vs-sub { font-family: 'Raleway', sans-serif; color: var(--text-muted); font-size: 0.92rem; margin: 0; }

.vs-phones {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.phone-mockup {
  position: relative;
  width: 200px;
  aspect-ratio: 9 / 19.5;
  background: #0b0f1a;
  border-radius: 34px;
  padding: 9px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.28), inset 0 0 0 2px rgba(255,255,255,0.08);
  flex-shrink: 0;
}
.phone-mockup video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 26px;
  display: block;
  background: #000;
}
.phone-notch {
  position: absolute;
  top: 9px;
  left: 50%;
  transform: translateX(-50%);
  width: 64px;
  height: 16px;
  background: #0b0f1a;
  border-radius: 0 0 12px 12px;
  z-index: 2;
}

.vs-cta {
  display: inline-flex; align-items: center;
  color: var(--blue); font-family: 'Raleway', sans-serif;
  font-weight: 700; font-size: 0.9rem; text-decoration: none;
  transition: gap 0.2s, color 0.2s;
}
.vs-cta:hover { color: var(--blue-hover); }

@media (max-width: 768px) {
  .vs-wrap { margin: 10px 10px; padding: 32px 16px; }
  .vs-title { font-size: 1.7rem; }
  .phone-mockup { width: 160px; }
}
</style>
