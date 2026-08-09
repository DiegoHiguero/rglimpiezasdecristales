<template>
  <Teleport to="body">
    <Transition name="cb-slide">
      <div v-if="visible" class="cb-wrap" role="dialog" aria-label="Aviso de cookies">
        <div class="cb-inner">
          <img src="../assets/img/cookies.webp" alt="Cookie" class="cb-cookie-img" />
          <div class="cb-text">
            <div class="cb-title">
              Usamos cookies
            </div>
            <p class="cb-desc">
              Utilizamos cookies propias y de terceros para mejorar tu experiencia y analizar el tráfico.
              Puedes aceptarlas todas o quedarte solo con las imprescindibles.
              <router-link to="/politica-privacidad" class="cb-link" @click="dismiss">Política de privacidad</router-link>
            </p>
          </div>
          <div class="cb-actions">
            <button class="cb-btn cb-btn--ghost" @click="accept('necessary')">Solo necesarias</button>
            <button class="cb-btn cb-btn--primary" @click="accept('all')">Aceptar todo</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'rc_cookie_consent'
const visible = ref(false)

onMounted(() => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    // Small delay so it doesn't flash on first paint
    setTimeout(() => { visible.value = true }, 800)
  }
})

const accept = (level) => {
  localStorage.setItem(STORAGE_KEY, level)
  visible.value = false
}

const dismiss = () => {
  // If user navigates to privacy page without choosing, just hide temporarily
  visible.value = false
}
</script>

<style scoped>
.cb-wrap {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: calc(100% - 32px);
  max-width: 820px;
}

.cb-inner {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  box-shadow: 0 16px 56px rgba(0,0,0,0.6);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.cb-text { flex: 1; min-width: 200px; }

.cb-title {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.cb-cookie-img {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.cb-desc {
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}
.cb-link {
  color: #60a5fa;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  transition: opacity 0.15s;
}
.cb-link:hover { opacity: 0.75; }

.cb-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.cb-btn {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.84rem;
  border-radius: 10px;
  padding: 9px 20px;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: opacity 0.2s, transform 0.2s;
}
.cb-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.cb-btn--primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; border-color: transparent; }
.cb-btn--ghost   { background: rgba(255,255,255,0.06); color: #94a3b8; border-color: rgba(255,255,255,0.1); }

/* Transition */
.cb-slide-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.cb-slide-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.cb-slide-enter-from  { opacity: 0; transform: translateX(-50%) translateY(20px); }
.cb-slide-leave-to    { opacity: 0; transform: translateX(-50%) translateY(20px); }

@media (max-width: 540px) {
  .cb-inner { flex-direction: column; padding: 18px 16px; gap: 16px; }
  .cb-actions { width: 100%; }
  .cb-btn { flex: 1; text-align: center; justify-content: center; }
}
</style>
