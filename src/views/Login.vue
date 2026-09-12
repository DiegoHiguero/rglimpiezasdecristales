<template>
  <div class="lp-wrap">
    <div class="lp-card">

      <!-- Cabecera -->
      <div class="lp-header">
        <img src="../assets/img/ROYAL_CLEAN_2025_BLANCO.png" alt="Royall Clean" class="lp-logo" />
        <h1 class="lp-title">Bienvenido</h1>
        <p class="lp-sub">Accede a tu panel de Royall Clean</p>
      </div>

      <!-- Aviso: iniciar sesión con Google no funciona bien dentro de la app instalada (PWA) -->
      <div v-if="isStandalone" class="lp-warning">
        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="me-2" />
        Estás abriendo esto como app instalada. El inicio de sesión con Google puede fallar aquí —
        si te da error, abre este enlace en el navegador normal (Chrome/Safari), no desde el icono
        de la pantalla de inicio.
      </div>

      <!-- Error -->
      <div v-if="userStore.timeOut !== false" class="lp-error">
        <font-awesome-icon :icon="['fas', 'xmark']" class="me-2" />
        {{ userStore.mensaje }}
      </div>

      <form @submit.prevent="handleSubmit" novalidate>

        <!-- Email -->
        <div class="lf" :class="{ 'lf--ok': email.length > 0 }">
          <div class="lf-icon"><font-awesome-icon :icon="['fas', 'envelope']" /></div>
          <div class="lf-body">
            <label for="loginEmail">Email</label>
            <input type="email" id="loginEmail" placeholder="nombre@ejemplo.com" v-model.trim="email" autocomplete="email" />
          </div>
        </div>

        <!-- Password -->
        <div class="lf" :class="{ 'lf--ok': password.length > 0 }">
          <div class="lf-icon"><font-awesome-icon :icon="['fas', 'lock']" /></div>
          <div class="lf-body">
            <label for="loginPassword">Contraseña</label>
            <input :type="showPass ? 'text' : 'password'" id="loginPassword" placeholder="••••••••" v-model.trim="password" autocomplete="current-password" />
          </div>
          <button type="button" class="lf-toggle" @click="showPass = !showPass" :title="showPass ? 'Ocultar' : 'Mostrar'">
            <font-awesome-icon :icon="['fas', showPass ? 'eye' : 'eye']" />
          </button>
        </div>

        <!-- Submit -->
        <button type="submit" class="lp-btn" :disabled="userStore.loadingUser">
          <span v-if="!userStore.loadingUser">Entrar</span>
          <span v-else class="lp-spinner"></span>
        </button>

        <!-- Divisor -->
        <div class="lp-divider"><span>o continúa con</span></div>

        <!-- Google -->
        <button type="button" class="lp-google-btn" @click="handleGoogleSignIn" :disabled="userStore.loadingUser">
          <svg class="lp-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Iniciar sesión con Google
        </button>

      </form>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const email = ref('');
const password = ref('');
const showPass = ref(false);

// La web es instalable como app (manifest con display:standalone). El popup
// de Google Sign-In de Firebase no funciona de forma fiable ahí porque el
// navegador aísla el almacenamiento distinto que en una pestaña normal —
// error típico: "missing initial state" / sessionStorage inaccesible.
const isStandalone = window.matchMedia?.('(display-mode: standalone)').matches
  || window.navigator.standalone === true;

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    userStore.mensajeAlerta('Rellena todos los campos');
    return;
  }
  if (password.value.length < 6) {
    userStore.mensajeAlerta('La contraseña debe tener al menos 6 caracteres');
    return;
  }
  await userStore.loginUser(email.value, password.value);
};

const handleGoogleSignIn = async () => {
  await userStore.signInWithGoogle();
};
</script>

<style scoped>
.lp-wrap {
  min-height: calc(100vh - 54px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  background: #151515;
}

.lp-card {
  width: 100%;
  max-width: 420px;
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 40px 36px 36px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5);
}

/* ── Header ── */
.lp-header {
  text-align: center;
  margin-bottom: 28px;
}
.lp-logo {
  height: 42px;
  width: auto;
  margin-bottom: 20px;
}
.lp-title {
  font-family: 'Anton', sans-serif;
  font-size: 2rem;
  color: #fff;
  margin: 0 0 6px;
  letter-spacing: 0.01em;
}
.lp-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #64748b;
  margin: 0;
}

/* ── Aviso PWA standalone ── */
.lp-warning {
  background: rgba(251,191,36,0.1);
  border: 1px solid rgba(251,191,36,0.3);
  color: #fbbf24;
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  line-height: 1.4;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 20px;
}

/* ── Error ── */
.lp-error {
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.3);
  color: #fca5a5;
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 20px;
}

/* ── Fields ── */
.lf {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  padding: 0 14px;
  margin-bottom: 14px;
  transition: border-color 0.2s, background 0.2s;
}
.lf:focus-within {
  border-color: rgba(96,165,250,0.5);
  background: rgba(96,165,250,0.04);
}
.lf--ok { border-color: rgba(52,211,153,0.35); }

.lf-icon {
  color: #475569;
  font-size: 0.85rem;
  width: 18px;
  flex-shrink: 0;
  margin-right: 12px;
  transition: color 0.2s;
}
.lf:focus-within .lf-icon { color: #60a5fa; }

.lf-body {
  flex: 1;
  padding: 10px 0;
}
.lf-body label {
  display: block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 2px;
}
.lf-body input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #f1f5f9;
  font-family: 'Raleway', sans-serif;
  font-size: 0.9rem;
  padding: 0;
}
.lf-body input::placeholder { color: #334155; }

.lf-toggle {
  background: none;
  border: none;
  color: #475569;
  cursor: pointer;
  padding: 0 0 0 10px;
  font-size: 0.82rem;
  transition: color 0.2s;
}
.lf-toggle:hover { color: #94a3b8; }

/* ── Submit ── */
.lp-btn {
  width: 100%;
  padding: 13px;
  margin-top: 6px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}
.lp-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37,99,235,0.45);
}
.lp-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.lp-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Divider ── */
.lp-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  color: #334155;
}
.lp-divider::before,
.lp-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.07);
}

/* ── Google ── */
.lp-google-btn {
  width: 100%;
  padding: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  color: #cbd5e1;
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.2s, border-color 0.2s;
}
.lp-google-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.15);
}
.lp-google-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.lp-google-icon { width: 18px; height: 18px; flex-shrink: 0; }

@media (max-width: 480px) {
  .lp-card { padding: 28px 20px 24px; }
  .lp-title { font-size: 1.7rem; }
}
</style>
