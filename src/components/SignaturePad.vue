<template>
  <div class="sp-wrap">
    <canvas ref="canvasEl" class="sp-canvas"></canvas>
    <div class="sp-actions">
      <button type="button" class="sp-btn sp-btn--ghost" @click="clear">Borrar</button>
      <button type="button" class="sp-btn sp-btn--primary" @click="save" :disabled="isEmpty">Guardar firma</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SignaturePad from 'signature_pad'

const emit = defineEmits(['saved'])

const canvasEl = ref(null)
const isEmpty = ref(true)
let pad = null

function resizeCanvas() {
  if (!canvasEl.value || !pad) return
  const canvas = canvasEl.value
  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.getContext('2d').scale(ratio, ratio)
  pad.clear()
  isEmpty.value = true
}

onMounted(() => {
  pad = new SignaturePad(canvasEl.value, { backgroundColor: 'rgb(255,255,255)' })
  pad.addEventListener('endStroke', () => { isEmpty.value = pad.isEmpty() })
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  pad?.off()
})

function clear() {
  pad?.clear()
  isEmpty.value = true
}

function save() {
  if (!pad || pad.isEmpty()) return
  const dataUrl = pad.toDataURL('image/png')
  emit('saved', dataUrl)
  clear()
}
</script>

<style scoped>
.sp-wrap { display: flex; flex-direction: column; gap: 10px; }
.sp-canvas {
  width: 100%;
  height: 180px;
  background: #fff;
  border: 2px dashed rgba(100,116,139,0.35);
  border-radius: 10px;
  touch-action: none;
}
.sp-actions { display: flex; gap: 10px; justify-content: flex-end; }
.sp-btn {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.84rem;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.sp-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.sp-btn--primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; }
.sp-btn--ghost { background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); }
</style>
