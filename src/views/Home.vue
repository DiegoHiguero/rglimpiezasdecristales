<template>
  <div class="padre">

    <!-- â”€â”€ HERO â”€â”€ -->
    <div class="row d-flex justify-content-center ms-3 mx-3 bg-image principal mt-3 bg-body-tertiary rounded-4 align-items-md-stretch">

      <div class="col-md-6 p-3 d-flex flex-column justify-content-center">

        <div class="hero-badge">
          <font-awesome-icon :icon="['fas', 'shield-halved']" class="me-1" />
          Empresa de confianza en Madrid
        </div>

        <h1 class="display-4 p-3 fs-1">
          <span class="prof">Limpieza de cristales y ventanas en Madrid</span>
          <span class="textAnimation d-block mt-2">Escaparates · ventanas · fachadas · comunidades</span>
        </h1>

        <p class="hero-desc px-3">
          Dejamos tus cristales impecables en hogares, locales y comunidades de vecinos.<br>
          Cubrimos toda la Comunidad de Madrid. Presupuesto gratis en menos de 24 h.
        </p>

        <div class="p-3 d-flex flex-wrap gap-2">
          <a href="tel:+34696169435" class="btn btn-light fw-bold px-4">
            <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />696 169 435
          </a>
          <router-link to="/contacto" class="btn btn-outline-light fw-bold px-4">
            Presupuesto gratis
          </router-link>
        </div>

        <div class="hero-phone-card">
          <div class="phone-mockup phone-mockup--hero">
            <video
              class="phone-mockup-video"
              src="../assets/img/videoplayback.mp4"
              muted loop playsinline autoplay
              @loadedmetadata="onHeroVideoLoaded"
              @timeupdate="onHeroVideoTimeUpdate"
            ></video>
            <img src="../assets/img/phone-mockup.webp" alt="" class="phone-mockup-frame" />
          </div>
          <div class="hero-phone-info">
            <span class="hero-phone-tag"><font-awesome-icon :icon="['fas', 'circle-play']" class="me-1" />Así trabajamos</span>
            <span class="hero-phone-sub">Vídeo real, sin edición</span>
          </div>
        </div>

      </div>

      <div class="col-md-6 d-flex align-items-center justify-content-center py-4" style="z-index:2;">
        <div class="formulario w-100">

          <div class="fh">
            <h2 class="fh-title">¿Cuánto cuesta limpiar<br><span class="fh-accent">tu espacio?</span></h2>
            <p class="fh-sub">Cuéntanos y te respondemos en menos de 24 h</p>
          </div>

          <form @submit.prevent="enviarMensaje" novalidate>

            <div class="ff" :class="{ 'ff--ok': prenom.length > 0 && !errors.prenom, 'ff--err': errors.prenom }">
              <div class="ff-icon"><font-awesome-icon :icon="['fas', 'user']" /></div>
              <div class="ff-body">
                <label for="prenomInput">Nombre completo</label>
                <input type="text" id="prenomInput" placeholder="¿Cómo te llamas?"
                  v-model="prenom" @blur="validatePrenom" @input="validatePrenom" autocomplete="name" />
                <span class="ff-msg" v-if="errors.prenom">{{ errors.prenom }}</span>
                <span class="ff-msg ff-msg--ok" v-else-if="prenom.length > 0 && !errors.prenom">¡Perfecto!</span>
              </div>
            </div>

            <div class="ff-row">
              <div class="ff" :class="{ 'ff--ok': email.length > 0 && !errors.email, 'ff--err': errors.email }">
                <div class="ff-icon"><font-awesome-icon :icon="['fas', 'envelope']" /></div>
                <div class="ff-body">
                  <label for="emailInput">Correo</label>
                  <input type="email" id="emailInput" placeholder="tu@email.com"
                    v-model.trim="email" @blur="validateEmail" @input="validateEmail" autocomplete="email" />
                  <span class="ff-msg" v-if="errors.email">{{ errors.email }}</span>
                  <span class="ff-msg ff-msg--ok" v-else-if="email.length > 0 && !errors.email">¡Perfecto!</span>
                </div>
              </div>
              <div class="ff" :class="{ 'ff--ok': phone.length > 0 && !errors.phone, 'ff--err': errors.phone }">
                <div class="ff-icon"><font-awesome-icon :icon="['fas', 'phone']" /></div>
                <div class="ff-body">
                  <label for="phoneInput">Teléfono</label>
                  <input type="tel" id="phoneInput" placeholder="6XX XXX XXX"
                    v-model.trim="phone" @blur="validatePhone" @input="validatePhone" autocomplete="tel" />
                  <span class="ff-msg" v-if="errors.phone">{{ errors.phone }}</span>
                  <span class="ff-msg ff-msg--ok" v-else-if="phone.length > 0 && !errors.phone">¡Perfecto!</span>
                </div>
              </div>
            </div>

            <div class="ff" :class="{ 'ff--ok': message.length > 0 && !errors.message, 'ff--err': errors.message }">
              <div class="ff-icon ff-icon--top"><font-awesome-icon :icon="['fas', 'comments']" /></div>
              <div class="ff-body">
                <label for="messageInput">¿Qué necesitas limpiar?</label>
                <textarea id="messageInput" rows="3"
                  placeholder="Ej: Cristales de una tienda en Madrid, 6 ventanas grandes..."
                  v-model="message" @blur="validateMessage" @input="validateMessage"></textarea>
                <span class="ff-msg" v-if="errors.message">{{ errors.message }}</span>
                <span class="ff-msg ff-msg--ok" v-else-if="message.length > 0 && !errors.message">¡Perfecto!</span>
              </div>
            </div>

            <div class="f-success" v-if="feedback.msg && feedback.ok">
              <font-awesome-icon :icon="['fas', 'check']" class="me-2" />{{ feedback.msg }}
            </div>
            <div class="ff-error" v-if="feedback.msg && !feedback.ok">
              <font-awesome-icon :icon="['fas', 'xmark']" class="me-2" />{{ feedback.msg }}
            </div>

            <button type="submit" class="f-submit" :disabled="sending || !isFormValid">
              <span v-if="!sending">
                <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Enviar consulta
              </span>
              <span v-else class="f-submit-loading">
                <span class="f-spinner"></span>Enviando...
              </span>
            </button>

            <div class="f-trust">
              <span><font-awesome-icon :icon="['fas', 'lock']" class="me-1" />Sin compromiso</span>
              <span><font-awesome-icon :icon="['fas', 'clock']" class="me-1" />Respuesta en 24 h</span>
              <span><font-awesome-icon :icon="['fas', 'shield-halved']" class="me-1" />Datos protegidos</span>
            </div>

          </form>
        </div>
      </div>
    </div>

    <!-- ── SECCIONES ── -->
    <HomeStats />
    <HomeServicios />
    <HomeGaleria />
    <HomeTestimonios />
    <HomeSobreMi />
    <HomePrecios />
    <HomeVentajas />
    <HomeZonas />
    <HomeBlog />
    <HomeFaq />

    <!-- WhatsApp flotante -->
    <div class="wa-widget" ref="waWidgetRef">
      <transition name="wa-pop">
        <div class="wa-menu" v-if="isWaOpen">
          <span class="wa-menu-title">¿En qué podemos ayudarte?</span>
          <a href="https://wa.me/34696169435?text=Hola%2C%20quiero%20un%20presupuesto%20para%20limpieza%20de%20cristales%20en%20mi%20vivienda" target="_blank" rel="noopener noreferrer" class="wa-menu-item">
            <font-awesome-icon :icon="['fas', 'house']" />Presupuesto vivienda
          </a>
          <a href="https://wa.me/34696169435?text=Hola%2C%20quiero%20un%20presupuesto%20para%20limpieza%20de%20cristales%20en%20mi%20negocio%20o%20local" target="_blank" rel="noopener noreferrer" class="wa-menu-item">
            <font-awesome-icon :icon="['fas', 'shop']" />Presupuesto negocio o local
          </a>
          <a href="https://wa.me/34696169435?text=Hola%2C%20quiero%20un%20presupuesto%20para%20limpieza%20de%20cristales%20en%20mi%20comunidad%20de%20vecinos" target="_blank" rel="noopener noreferrer" class="wa-menu-item">
            <font-awesome-icon :icon="['fas', 'building']" />Presupuesto comunidad
          </a>
          <a href="https://wa.me/34696169435" target="_blank" rel="noopener noreferrer" class="wa-menu-item">
            <font-awesome-icon :icon="['fas', 'comment']" />Otra consulta
          </a>
        </div>
      </transition>
      <transition name="wa-hint-pop">
        <div class="wa-hint" v-if="showWaHint && !isWaOpen" @click="toggleWaMenu">
          ¿Te ayudamos con un presupuesto?
        </div>
      </transition>
      <button class="whatsapp-float" :class="{ 'wa-pulse': waPulse && !isWaOpen }" aria-label="Contactar por WhatsApp" @click="toggleWaMenu">
        <font-awesome-icon :icon="['fab', 'whatsapp']" v-if="!isWaOpen" />
        <font-awesome-icon :icon="['fas', 'xmark']" v-else />
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/user";
import { onMounted, onUnmounted, ref } from "vue";
import { useContactForm } from '../composables/useContactForm';
import HomeStats      from '../components/home/HomeStats.vue';
import HomeServicios  from '../components/home/HomeServicios.vue';
import HomePrecios    from '../components/home/HomePrecios.vue';
import HomeGaleria    from '../components/home/HomeGaleria.vue';
import HomeTestimonios from '../components/home/HomeTestimonios.vue';
import HomeSobreMi    from '../components/home/HomeSobreMi.vue';
import HomeVentajas   from '../components/home/HomeVentajas.vue';
import HomeZonas      from '../components/home/HomeZonas.vue';
import HomeBlog       from '../components/home/HomeBlog.vue';
import HomeFaq        from '../components/home/HomeFaq.vue';

// Vídeo del hero: solo enseña un fragmento corto en bucle, no el vídeo entero
const HERO_CLIP_START = 1.5;
const HERO_CLIP_END = 7;
const onHeroVideoLoaded = (e) => { e.target.currentTime = HERO_CLIP_START; e.target.play().catch(() => {}); };
const onHeroVideoTimeUpdate = (e) => {
  if (e.target.currentTime >= HERO_CLIP_END || e.target.currentTime < HERO_CLIP_START) {
    e.target.currentTime = HERO_CLIP_START;
  }
};

const {
  prenom, email, phone, message,
  errors, sending, feedback, isFormValid,
  validatePrenom, validateEmail, validatePhone, validateMessage,
  enviarMensaje,
} = useContactForm();

const userStore = useUserStore();

const isWaOpen    = ref(false);
const waWidgetRef = ref(null);
const showWaHint  = ref(false);
const waPulse     = ref(false);
let waHintShowTimeout, waHintHideTimeout, waPulseTimeout;

const dismissWaHint = () => {
  showWaHint.value = false;
  waPulse.value = false;
  sessionStorage.setItem('rc-wa-hint-shown', '1');
  clearTimeout(waHintShowTimeout);
  clearTimeout(waHintHideTimeout);
  clearTimeout(waPulseTimeout);
};

const toggleWaMenu = () => {
  isWaOpen.value = !isWaOpen.value;
  dismissWaHint();
};

const handleWaOutsideClick = (e) => {
  if (waWidgetRef.value && !waWidgetRef.value.contains(e.target)) {
    isWaOpen.value = false;
    dismissWaHint();
  }
};

onMounted(() => {
  document.addEventListener('click', handleWaOutsideClick);

  if (!sessionStorage.getItem('rc-wa-hint-shown')) {
    waPulse.value = true;
    waHintShowTimeout = setTimeout(() => {
      showWaHint.value = true;
      waHintHideTimeout = setTimeout(() => { showWaHint.value = false; }, 7000);
    }, 3000);
    waPulseTimeout = setTimeout(() => { waPulse.value = false; }, 12000);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleWaOutsideClick);
  clearTimeout(waHintShowTimeout);
  clearTimeout(waHintHideTimeout);
  clearTimeout(waPulseTimeout);
});

onMounted(() => {
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  const scrollObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  animatedEls.forEach(el => scrollObserver.observe(el));
  checkCookie();
});

function checkCookie() {
  const check = getCookie("cookieConsent-ANALYTICS");
  if (check !== "") { userStore.cookie = true; }
  else if (check === "false") { document.cookie = "cookieConsent-ANALYTICS=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"; }
  else { userStore.cookie = false; }
}

function getCookie(cname: string): string {
  const name = cname + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
}
</script>

<style scoped>
/* ── WRAPPER ── */
.padre {
  max-width: 1200px;
  margin: 0 auto;
}

/* ── HERO ── */
.principal {
  background: url('/fondo_jabon.webp') center/cover no-repeat;
  background-color: #0f1729;
  position: relative;
  overflow: hidden;
  min-height: 500px;
  border-radius: var(--r-lg);
  margin-top: 12px;
}
.principal::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(15,23,41,0.72) 0%, rgba(15,23,41,0.38) 100%);
  border-radius: inherit;
  z-index: 1;
  pointer-events: none;
}
.principal > * { position: relative; z-index: 2; }
.prof { color: #fff; text-shadow: 0 2px 18px rgba(0,0,0,0.8); }
.hero-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(37,99,235,0.18);
  border: 1px solid rgba(96,165,250,0.3);
  color: #93c5fd;
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin: 0 0 4px 12px;
  width: fit-content;
}
.hero-desc {
  color: rgba(255,255,255,0.9);
  font-family: 'Raleway', sans-serif;
  font-size: 0.97rem;
  line-height: 1.7;
  margin: 0 0 14px;
  text-shadow: 0 1px 8px rgba(0,0,0,0.6);
}
.textAnimation {
  background: linear-gradient(90deg, #60a5fa 0%, #93c5fd 50%, #60a5fa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

/* â”€â”€ VÃDEO DEL HERO (mockup de mÃ³vil) â”€â”€ */
.hero-phone-card {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0 0 12px;
  padding: 14px;
  width: fit-content;
  max-width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 18px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
}
.phone-mockup {
  position: relative;
  width: 85px;
  aspect-ratio: 394 / 783;
  flex-shrink: 0;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.4));
}
.phone-mockup-video {
  position: absolute;
  left: 7.1%;
  top: 3.1%;
  width: 86.3%;
  height: 94%;
  object-fit: cover;
  border-radius: 10%;
  display: block;
  background: #000;
  z-index: 1;
}
.phone-mockup-frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  display: block;
}
.hero-phone-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hero-phone-tag {
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
}
.hero-phone-tag svg { color: #60a5fa; }
.hero-phone-sub {
  color: rgba(255,255,255,0.62);
  font-family: 'Raleway', sans-serif;
  font-weight: 500;
  font-size: 0.76rem;
}

/* â”€â”€ FORMULARIO â”€â”€ */
.formulario {
  background: rgba(10, 16, 30, 0.62);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--r-md);
  padding: 28px 24px 20px;
}
.fh { text-align: center; margin-bottom: 22px; }
.fh-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(37,99,235,0.18);
  border: 1px solid rgba(96,165,250,0.3);
  color: #93c5fd;
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 12px;
}
.fh-title { font-family: 'Anton', sans-serif; color: #fff; font-size: 1.5rem; line-height: 1.2; margin: 0 0 6px; }
.fh-accent { background: linear-gradient(90deg, #60a5fa, #93c5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.fh-sub { color: rgba(255,255,255,0.45); font-family: 'Raleway', sans-serif; font-size: 0.8rem; margin: 0; }

.ff { display: flex; gap: 10px; margin-bottom: 13px; }
.ff-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ff-icon {
  width: 34px; min-width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(37,99,235,0.12);
  border: 1px solid rgba(96,165,250,0.18);
  border-radius: 8px;
  color: #60a5fa;
  font-size: 0.8rem;
  margin-top: 20px;
  flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.ff-icon--top { align-self: flex-start; margin-top: 20px; }
.ff:focus-within .ff-icon { background: rgba(37,99,235,0.28); border-color: rgba(96,165,250,0.5); color: #93c5fd; }
.ff--ok .ff-icon { border-color: rgba(52,211,153,0.4); color: #34d399; background: rgba(52,211,153,0.08); }
.ff--err .ff-icon { border-color: rgba(239,68,68,0.4); color: #f87171; background: rgba(239,68,68,0.08); }

.ff-body { flex: 1; min-width: 0; }
.ff-body label {
  display: block; font-family: 'Raleway', sans-serif; font-weight: 700;
  font-size: 0.68rem; color: rgba(255,255,255,0.45);
  text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 5px;
}
.ff-body input, .ff-body textarea {
  width: 100%; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
  padding: 8px 11px; color: #fff;
  font-family: 'Raleway', sans-serif; font-size: 0.86rem;
  outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; resize: none;
}
.ff-body input::placeholder, .ff-body textarea::placeholder { color: rgba(255,255,255,0.22); }
.ff-body input:focus, .ff-body textarea:focus {
  border-color: rgba(96,165,250,0.55); background: rgba(255,255,255,0.08);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
}
.ff--ok .ff-body input, .ff--ok .ff-body textarea { border-color: rgba(52,211,153,0.45); }
.ff--err .ff-body input, .ff--err .ff-body textarea { border-color: rgba(239,68,68,0.5); box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }

.ff-msg { display: block; font-family: 'Raleway', sans-serif; font-size: 0.7rem; font-weight: 600; margin-top: 3px; color: #f87171; }
.ff-msg--ok { color: #34d399; }

.f-success {
  background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.3);
  border-radius: 9px; color: #6ee7b7; font-family: 'Raleway', sans-serif;
  font-size: 0.82rem; font-weight: 600; padding: 10px 14px; margin-bottom: 12px; text-align: center;
}
.ff-error {
  background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.35);
  border-radius: 9px; color: #f87171; font-family: 'Raleway', sans-serif;
  font-size: 0.82rem; font-weight: 600; padding: 10px 14px; margin-bottom: 12px; text-align: center;
}
.f-submit {
  width: 100%; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff; font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.93rem;
  padding: 13px 20px; border: none; border-radius: 11px; cursor: pointer;
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-bottom: 14px; transition: transform 0.2s, box-shadow 0.2s;
}
.f-submit:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(37,99,235,0.45); }
.f-submit:disabled { opacity: 0.45; cursor: not-allowed; }
.f-submit::after {
  content: ''; position: absolute; top: -50%; left: -70%;
  width: 45%; height: 200%;
  background: rgba(255,255,255,0.15); transform: skewX(-20deg); transition: left 0.55s ease;
}
.f-submit:not(:disabled):hover::after { left: 130%; }
.f-submit-loading { display: flex; align-items: center; gap: 8px; }
.f-spinner {
  width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
}
.f-trust {
  display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;
  color: rgba(255,255,255,0.28); font-family: 'Raleway', sans-serif;
  font-size: 0.68rem; font-weight: 600;
}


/* â”€â”€ FORMULARIO MODO CLARO â”€â”€ */
:root:not([data-theme="dark"]) .formulario {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(0,0,0,0.07);
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
}
:root:not([data-theme="dark"]) .fh-title { color: #1e293b; }
:root:not([data-theme="dark"]) .fh-sub { color: rgba(0,0,0,0.45); }
:root:not([data-theme="dark"]) .ff-icon {
  background: rgba(37,99,235,0.08);
  border-color: rgba(37,99,235,0.2);
  color: #2563eb;
}
:root:not([data-theme="dark"]) .ff:focus-within .ff-icon {
  background: rgba(37,99,235,0.15);
  border-color: rgba(37,99,235,0.45);
  color: #1d4ed8;
}
:root:not([data-theme="dark"]) .ff-body label { color: rgba(0,0,0,0.45); }
:root:not([data-theme="dark"]) .ff-body input,
:root:not([data-theme="dark"]) .ff-body textarea {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #1e293b;
}
:root:not([data-theme="dark"]) .ff-body input::placeholder,
:root:not([data-theme="dark"]) .ff-body textarea::placeholder { color: #94a3b8; }
:root:not([data-theme="dark"]) .ff-body input:focus,
:root:not([data-theme="dark"]) .ff-body textarea:focus {
  border-color: rgba(37,99,235,0.5);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
}
:root:not([data-theme="dark"]) .ff--ok .ff-body input,
:root:not([data-theme="dark"]) .ff--ok .ff-body textarea { border-color: rgba(16,185,129,0.5); }
:root:not([data-theme="dark"]) .ff--err .ff-body input,
:root:not([data-theme="dark"]) .ff--err .ff-body textarea { border-color: rgba(239,68,68,0.5); }
:root:not([data-theme="dark"]) .f-trust { color: rgba(0,0,0,0.35); }

/* â”€â”€ WHATSAPP FLOAT â”€â”€ */
.wa-widget {
  position: fixed; bottom: 28px; right: 28px;
  z-index: 999;
  display: flex; flex-direction: column; align-items: flex-end; gap: 14px;
}
.whatsapp-float {
  position: relative;
  width: 56px; height: 56px; background: #25D366; color: var(--white);
  border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 1.75rem; box-shadow: 0 4px 16px rgba(37,211,102,0.45);
  transition: transform var(--t), box-shadow var(--t); text-decoration: none; cursor: pointer;
  flex-shrink: 0;
}
.whatsapp-float:hover { transform: scale(1.12); box-shadow: 0 6px 24px rgba(37,211,102,0.6); color: var(--white); }
.whatsapp-float svg { pointer-events: none; }

.whatsapp-float.wa-pulse::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid #25D366;
  animation: wa-pulse-ring 2s ease-out infinite;
}
@keyframes wa-pulse-ring {
  0%   { transform: scale(0.9); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0; }
}

.wa-hint {
  position: relative;
  background: var(--white);
  color: var(--text);
  font-family: 'Raleway', sans-serif;
  font-size: 0.83rem;
  font-weight: 600;
  line-height: 1.4;
  padding: 12px 16px;
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(0,0,0,0.18);
  max-width: 200px;
  cursor: pointer;
}
.wa-hint::after {
  content: '';
  position: absolute;
  bottom: -6px; right: 22px;
  width: 12px; height: 12px;
  background: var(--white);
  transform: rotate(45deg);
}
.wa-hint-pop-enter-active, .wa-hint-pop-leave-active { transition: opacity 0.25s, transform 0.25s; }
.wa-hint-pop-enter-from, .wa-hint-pop-leave-to { opacity: 0; transform: translateY(10px); }

.wa-menu {
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 10px 36px rgba(0,0,0,0.18);
  padding: 14px;
  width: 250px;
  display: flex; flex-direction: column; gap: 6px;
}
.wa-menu-title {
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem; font-weight: 700; color: var(--text-muted);
  padding: 0 6px 8px; border-bottom: 1px solid var(--border); margin-bottom: 4px;
}
.wa-menu-item {
  display: flex; align-items: center; gap: 10px;
  font-family: 'Raleway', sans-serif; font-size: 0.85rem; font-weight: 600;
  color: var(--text); text-decoration: none;
  padding: 9px 8px; border-radius: 9px;
  transition: background 0.2s, color 0.2s;
}
.wa-menu-item svg { color: #25D366; font-size: 0.95rem; flex-shrink: 0; }
.wa-menu-item:hover { background: #f0fdf4; color: #166534; }

.wa-pop-enter-active, .wa-pop-leave-active { transition: opacity 0.18s, transform 0.18s; }
.wa-pop-enter-from, .wa-pop-leave-to { opacity: 0; transform: translateY(8px) scale(0.96); }

/* â”€â”€ KEYFRAMES â”€â”€ */
@keyframes spin { to { transform: rotate(360deg); } }

/* â”€â”€ RESPONSIVE â”€â”€ */
@media (max-width: 768px) {
  .principal { min-height: 360px; border-radius: var(--r-md); }
}
@media (max-width: 480px) {
  .ff-row { grid-template-columns: 1fr; }
  .formulario { padding: 22px 16px 16px; }
  .phone-mockup { width: 118px; }
  .hero-phone-tag { font-size: 0.95rem; }
  .hero-phone-sub { font-size: 0.8rem; }
  /* Mismo margen que ya tenía el formulario, para que el texto y la
     tarjeta del vídeo de arriba queden alineados con él */
  .col-md-6.p-3 { padding-left: 12px !important; padding-right: 12px !important; }
  .hero-badge, .hero-phone-card { margin-left: 0; }
}
</style>
