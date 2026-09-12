<template>
  <div class="nf-wrap" ref="wrapRef">

    <!-- Contenido real, debajo de la "suciedad" -->
    <div class="nf-inner">

      <div class="nf-code">404</div>

      <div class="nf-icon">
        <font-awesome-icon :icon="['fas', 'spray-can-sparkles']" />
      </div>

      <h1 class="nf-title">¡Vaya, esta página no existe!</h1>
      <p class="nf-sub">Pero mira qué cristal más sucio te ha tocado.<br>Límpialo con el ratón o el dedo — es lo nuestro.</p>

      <div class="nf-btns">
        <router-link to="/" class="nf-btn nf-btn--primary">Volver al inicio</router-link>
        <router-link to="/contacto" class="nf-btn nf-btn--outline">Pedir presupuesto</router-link>
      </div>

      <div class="nf-links">
        <router-link to="/#servicios">Servicios</router-link>
        <span>·</span>
        <router-link to="/blog">Blog</router-link>
        <span>·</span>
        <router-link to="/contacto">Contacto</router-link>
      </div>

    </div>

    <!-- Capa de "suciedad": se limpia arrastrando -->
    <canvas
      v-if="!fullyClean"
      ref="canvasRef"
      class="nf-grime"
      :style="{ opacity: grimeOpacity }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    ></canvas>

    <!-- UI flotante encima de la suciedad -->
    <div v-if="!fullyClean" class="nf-grime-ui">
      <transition name="nf-fade">
        <p v-if="showHint" class="nf-hint">🧽 Pasa el dedo o el ratón por el cristal para limpiarlo</p>
      </transition>
      <div class="nf-progress-row">
        <span class="nf-progress-badge">Limpieza: {{ progress }}%</span>
        <button type="button" class="nf-skip-btn" @click="revealAll">Ver la página sin limpiar</button>
      </div>
    </div>

    <transition name="nf-fade">
      <div v-if="showCongrats" class="nf-congrats">¡Cristal impecable! Así los dejamos siempre 😉</div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

const wrapRef = ref(null);
const canvasRef = ref(null);

const progress = ref(0);
const grimeOpacity = ref(1);
const fullyClean = ref(false);
const showHint = ref(true);
const showCongrats = ref(false);

let ctx = null;
let width = 0;
let height = 0;
let wipedArea = 0;
let totalArea = 1;
let lastPoint = null;
let isPointerDown = false;
const BRUSH_SIZE = 90;
const CLEAN_THRESHOLD = 88; // % a partir del cual se revela todo automáticamente

function paintGrime() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);

  // Base: tinte sucio semitransparente
  ctx.fillStyle = 'rgba(32, 30, 26, 0.88)';
  ctx.fillRect(0, 0, width, height);

  // Manchurrones difusos (huellas, grasa)
  for (let i = 0; i < 16; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 50 + Math.random() * 110;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(110, 95, 70, 0.4)');
    grad.addColorStop(1, 'rgba(110, 95, 70, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Polvo (motitas)
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const s = Math.random() * 1.8;
    ctx.fillRect(x, y, s, s);
  }

  // Churretes verticales (goterones secos)
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width;
    const len = 50 + Math.random() * (height * 0.45);
    const y0 = Math.random() * Math.max(1, height - len);
    const grad = ctx.createLinearGradient(x, y0, x, y0 + len);
    grad.addColorStop(0, 'rgba(70,62,48,0)');
    grad.addColorStop(0.5, 'rgba(70,62,48,0.22)');
    grad.addColorStop(1, 'rgba(70,62,48,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1 + Math.random() * 2.2;
    ctx.beginPath();
    ctx.moveTo(x, y0);
    ctx.lineTo(x + (Math.random() * 8 - 4), y0 + len);
    ctx.stroke();
  }
}

function resizeCanvas() {
  const canvas = canvasRef.value;
  const wrap = wrapRef.value;
  if (!canvas || !wrap) return;
  const rect = wrap.getBoundingClientRect();
  width = canvas.width = rect.width;
  height = canvas.height = rect.height;
  totalArea = Math.max(width * height, 1);
  ctx = canvas.getContext('2d');
  wipedArea = 0;
  progress.value = 0;
  paintGrime();
}

function updateProgress() {
  const pct = Math.min(100, Math.round((wipedArea / totalArea) * 100));
  progress.value = pct;
  if (pct >= CLEAN_THRESHOLD) revealAll();
}

function wipeAt(x, y) {
  if (!ctx) return;
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = BRUSH_SIZE;

  if (lastPoint) {
    const dx = x - lastPoint.x;
    const dy = y - lastPoint.y;
    const dist = Math.hypot(dx, dy);
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    wipedArea += dist * BRUSH_SIZE;
  } else {
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    wipedArea += (Math.PI * (BRUSH_SIZE / 2) ** 2) * 0.6;
  }
  ctx.restore();
  lastPoint = { x, y };
  updateProgress();
}

function pointerPos(e) {
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function onPointerDown(e) {
  isPointerDown = true;
  showHint.value = false;
  lastPoint = null;
  const p = pointerPos(e);
  wipeAt(p.x, p.y);
}

function onPointerMove(e) {
  // En escritorio limpia solo con el ratón en movimiento (más divertido, sin
  // necesidad de mantener pulsado); en táctil pointermove ya implica que el
  // dedo está apoyado.
  showHint.value = false;
  const p = pointerPos(e);
  wipeAt(p.x, p.y);
}

function onPointerUp() {
  isPointerDown = false;
  lastPoint = null;
}

function revealAll() {
  if (fullyClean.value) return;
  grimeOpacity.value = 0;
  showCongrats.value = true;
  setTimeout(() => { fullyClean.value = true; }, 500);
  setTimeout(() => { showCongrats.value = false; }, 2600);
}

let resizeHandler;

onMounted(async () => {
  await nextTick();
  resizeCanvas();
  resizeHandler = () => resizeCanvas();
  window.addEventListener('resize', resizeHandler);
});

onBeforeUnmount(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler);
});
</script>

<style scoped>
.nf-wrap {
  position: relative;
  min-height: calc(100vh - 54px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: var(--slate);
  overflow: hidden;
}

.nf-inner {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 520px;
}

.nf-code {
  font-family: 'Anton', sans-serif;
  font-size: clamp(6rem, 20vw, 9rem);
  color: var(--blue);
  line-height: 1;
  margin-bottom: 8px;
  opacity: 0.15;
  letter-spacing: -4px;
  user-select: none;
}

.nf-icon {
  font-size: 2.8rem;
  color: var(--blue);
  margin-bottom: 24px;
  margin-top: -24px;
}

.nf-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  color: var(--text);
  margin: 0 0 14px;
}

.nf-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.97rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0 0 36px;
}

.nf-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.nf-btn {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 12px 28px;
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}

.nf-btn--primary {
  background: var(--blue);
  color: #fff;
}
.nf-btn--primary:hover {
  background: var(--blue-hover);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
}

.nf-btn--outline {
  background: transparent;
  color: var(--blue);
  border: 1.5px solid var(--blue);
}
.nf-btn--outline:hover {
  background: var(--blue);
  color: #fff;
  transform: translateY(-2px);
}

.nf-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
}
.nf-links a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
.nf-links a:hover { color: var(--blue); }
.nf-links span { color: var(--border); }

/* ── Capa de suciedad ── */
.nf-grime {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: none;
  transition: opacity 0.5s ease;
}

.nf-grime-ui {
  position: absolute;
  top: 18px;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
  padding: 0 16px;
}

.nf-hint {
  margin: 0;
  font-family: 'Raleway', sans-serif;
  font-size: 0.86rem;
  font-weight: 600;
  color: #fff;
  background: rgba(15, 23, 41, 0.75);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 8px 18px;
  text-align: center;
}

.nf-progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.nf-progress-badge {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  color: #60a5fa;
  background: rgba(15, 23, 41, 0.8);
  border: 1px solid rgba(96,165,250,0.3);
  border-radius: 20px;
  padding: 6px 14px;
  pointer-events: none;
}

.nf-skip-btn {
  font-family: 'Raleway', sans-serif;
  font-size: 0.74rem;
  font-weight: 600;
  color: #94a3b8;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 6px 14px;
  cursor: pointer;
  pointer-events: auto;
  transition: color 0.2s, background 0.2s;
}
.nf-skip-btn:hover { color: #fff; background: rgba(255,255,255,0.12); }

.nf-congrats {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f1729;
  background: #34d399;
  border-radius: 20px;
  padding: 10px 20px;
  box-shadow: 0 8px 24px rgba(52,211,153,0.4);
  white-space: nowrap;
}

.nf-fade-enter-active, .nf-fade-leave-active { transition: opacity 0.35s ease; }
.nf-fade-enter-from, .nf-fade-leave-to { opacity: 0; }

@media (max-width: 480px) {
  .nf-hint { font-size: 0.78rem; padding: 7px 14px; }
  .nf-congrats { font-size: 0.82rem; padding: 9px 16px; }
}
</style>
