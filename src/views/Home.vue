<template>
  <div class="padre">

    <!-- â”€â”€ HERO â”€â”€ -->
    <div class="row d-flex justify-content-center ms-3 mx-3 bg-image principal mt-3 bg-body-tertiary rounded-4 align-items-md-stretch">

      <div class="col-md-6 p-3 d-flex flex-column justify-content-center">
        <h1 class="display-4 p-3 fs-1">
          <span class="prof">Profesional en limpieza de Cristales</span>
          <span class="textAnimation d-block mt-2">¡Con más de 10 años de experiencia!</span>
        </h1>
        <h1 class="p-3" style="color: #fff;">
          EN ROYALL CLEAN HACEMOS LA DIFERENCIA.
        </h1>
        <div class="p-3 d-flex flex-wrap gap-2">
          <a href="tel:+34696169435" class="btn btn-light fw-bold px-4">
            <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />Llamar ahora
          </a>
          <router-link to="/contacto" class="btn btn-outline-light fw-bold px-4">
            Presupuesto gratis
          </router-link>
        </div>
        <div class="px-3 pb-3">
          <span class="trust-badge">
            <font-awesome-icon :icon="['fas', 'check']" class="me-1" />
            Servicio profesional · Madrid y alrededores
          </span>
        </div>
      </div>

      <div class="col-md-6 d-flex align-items-center justify-content-center py-4" style="z-index:2;">
        <div class="formulario w-100">

          <div class="fh">
            <h2 class="fh-title">¿Cuánto cuesta limpiar<br><span class="fh-accent">tu espacio?</span></h2>
            <p class="fh-sub">Cuéntanos y te respondemos en menos de 24 h</p>
          </div>

          <form @submit.prevent="enviarMensaje" novalidate>

            <div class="ff" :class="{ 'ff--ok': prenom.length > 0 && !prenomError, 'ff--err': prenomError }">
              <div class="ff-icon"><font-awesome-icon :icon="['fas', 'user']" /></div>
              <div class="ff-body">
                <label for="prenomInput">Nombre completo</label>
                <input type="text" id="prenomInput" placeholder="¿Cómo te llamas?"
                  v-model="prenom" @blur="validatePrenom" @input="validatePrenom" autocomplete="name" />
                <span class="ff-msg" v-if="prenomError">{{ prenomError }}</span>
                <span class="ff-msg ff-msg--ok" v-else-if="prenom.length > 0 && !prenomError">¡Perfecto!</span>
              </div>
            </div>

            <div class="ff-row">
              <div class="ff" :class="{ 'ff--ok': email.length > 0 && !emailError, 'ff--err': emailError }">
                <div class="ff-icon"><font-awesome-icon :icon="['fas', 'envelope']" /></div>
                <div class="ff-body">
                  <label for="emailInput">Correo</label>
                  <input type="email" id="emailInput" placeholder="tu@email.com"
                    v-model.trim="email" @blur="validateEmail" @input="validateEmail" autocomplete="email" />
                  <span class="ff-msg" v-if="emailError">{{ emailError }}</span>
                  <span class="ff-msg ff-msg--ok" v-else-if="email.length > 0 && !emailError">¡Perfecto!</span>
                </div>
              </div>
              <div class="ff" :class="{ 'ff--ok': phone.length > 0 && !phoneError, 'ff--err': phoneError }">
                <div class="ff-icon"><font-awesome-icon :icon="['fas', 'phone']" /></div>
                <div class="ff-body">
                  <label for="phoneInput">Teléfono</label>
                  <input type="tel" id="phoneInput" placeholder="6XX XXX XXX"
                    v-model.trim="phone" @blur="validatePhone" @input="validatePhone" autocomplete="tel" />
                  <span class="ff-msg" v-if="phoneError">{{ phoneError }}</span>
                  <span class="ff-msg ff-msg--ok" v-else-if="phone.length > 0 && !phoneError">¡Perfecto!</span>
                </div>
              </div>
            </div>

            <div class="ff" :class="{ 'ff--ok': message.length > 0 && !messageError, 'ff--err': messageError }">
              <div class="ff-icon ff-icon--top"><font-awesome-icon :icon="['fas', 'comments']" /></div>
              <div class="ff-body">
                <label for="messageInput">¿Qué necesitas limpiar?</label>
                <textarea id="messageInput" rows="3"
                  placeholder="Ej: Cristales de una tienda en Madrid, 6 ventanas grandes..."
                  v-model="message" @blur="validateMessage" @input="validateMessage"></textarea>
                <span class="ff-msg" v-if="messageError">{{ messageError }}</span>
                <span class="ff-msg ff-msg--ok" v-else-if="message.length > 0 && !messageError">¡Perfecto!</span>
              </div>
            </div>

            <div class="f-success" v-if="userStore.timeOut !== false">
              <font-awesome-icon :icon="['fas', 'check']" class="me-2" />{{ userStore.mensaje }}
            </div>

            <button type="submit" class="f-submit" :disabled="isSubmitting || !isFormValid">
              <span v-if="!isSubmitting">
                <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Pedir presupuesto gratis
              </span>
              <span v-else class="f-submit-loading">
                <span class="f-spinner"></span>Enviando...
              </span>
            </button>

            <div class="f-trust">
              <span><font-awesome-icon :icon="['fas', 'lock']" class="me-1" />Sin compromiso</span>
              <span><font-awesome-icon :icon="['fas', 'clock']" class="me-1" />Respuesta en 24 h</span>
              <span><font-awesome-icon :icon="['fas', 'check']" class="me-1" />Gratis</span>
            </div>

          </form>
        </div>
      </div>
    </div>

    <!-- â”€â”€ SECCIONES â”€â”€ -->
    <HomeStats />
    <HomeServicios />
    <HomePrecios />
    <HomeGaleria />
    <HomeTestimonios />
    <HomeSobreMi />
    <HomeVentajas />
    <HomeZonas />
    <HomeBlog />
    <HomeFaq />

    <!-- WhatsApp flotante -->
    <a href="https://wa.me/34696169435" target="_blank" rel="noopener noreferrer" class="whatsapp-float" aria-label="Contactar por WhatsApp">
      <font-awesome-icon :icon="['fab', 'whatsapp']" />
    </a>

  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/user";
import { onMounted, ref, computed } from "vue";
import emailjs from "@emailjs/browser";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
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

const prenom  = ref("");
const email   = ref("");
const message = ref("");
const phone   = ref("");

const prenomError  = ref("");
const emailError   = ref("");
const phoneError   = ref("");
const messageError = ref("");

const userStore    = useUserStore();
const isSubmitting = ref(false);

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

const validatePrenom = () => {
  prenomError.value = "";
  if (!prenom.value.trim()) { prenomError.value = "El nombre es obligatorio."; return false; }
  return true;
};

const validateEmail = () => {
  emailError.value = "";
  if (!email.value.trim()) { emailError.value = "Se requiere dirección de correo electrónico."; return false; }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) { emailError.value = "Por favor, introduce una dirección de correo electrónico válida."; return false; }
  return true;
};

const validatePhone = () => {
  phoneError.value = "";
  if (!phone.value.trim()) { phoneError.value = "Se requiere el número de teléfono."; return false; }
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  if (!phoneRegex.test(phone.value)) { phoneError.value = "Ingrese un número de teléfono válido."; return false; }
  if (phone.value.trim().replace(/[\s\-\(\)]/g, '').length < 9) { phoneError.value = "El número de teléfono debe contener al menos 9 dígitos."; return false; }
  return true;
};

const validateMessage = () => {
  messageError.value = "";
  if (!message.value.trim()) { messageError.value = "El mensaje es obligatorio."; return false; }
  if (message.value.trim().length < 10) { messageError.value = "El mensaje debe contener al menos 10 caracteres."; return false; }
  return true;
};

const validateForm = () => {
  userStore.mensaje = '';
  userStore.timeOut = false;
  return validatePrenom() && validateEmail() && validatePhone() && validateMessage();
};

const isFormValid = computed(() =>
  prenom.value.trim() !== '' && !prenomError.value &&
  email.value.trim()  !== '' && !emailError.value  &&
  phone.value.trim()  !== '' && !phoneError.value  &&
  message.value.trim() !== '' && !messageError.value
);

const enviarMensaje = async () => {
  if (isSubmitting.value) return;
  if (!validateForm()) { userStore.mensajeAlerta("Corrija cualquier error en el formulario antes de enviarlo."); return; }

  isSubmitting.value = true;
  try {
    const contactParams = { prenom: prenom.value, email: email.value, message: message.value, phone: phone.value };
    await emailjs.send("service_iytm8yl", "template_7yngfsa", contactParams, "IF1Sn503DHVPja4II");
    await addDoc(collection(db, "mensajes"), {
      prenom: prenom.value, email: email.value, message: message.value, phone: phone.value,
      timestamp: serverTimestamp(), read: false,
    });
    prenom.value = ""; email.value = ""; message.value = ""; phone.value = "";
    prenomError.value = ""; emailError.value = ""; phoneError.value = ""; messageError.value = "";
    userStore.mensajeAlerta("¡Mensaje enviado! Te respondemos en menos de 24 h.");
  } catch (error: any) {
    console.error("Error al enviar:", error);
    userStore.mensajeAlerta("Hubo un problema al enviar. Inténtalo de nuevo.");
  } finally {
    isSubmitting.value = false;
  }
};

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
/* â”€â”€ HERO â”€â”€ */
.principal {
  background: url('../assets/img/office-buildings.jpg') center/cover no-repeat;
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
  background: linear-gradient(135deg, rgba(15,23,41,0.75) 0%, rgba(37,99,235,0.35) 100%);
  border-radius: inherit;
  z-index: 1;
  pointer-events: none;
}
.principal > * { position: relative; z-index: 2; }
.prof { color: var(--white); text-shadow: 0 2px 12px rgba(0,0,0,0.5); }
.textAnimation {
  background: linear-gradient(90deg, #60a5fa 0%, #93c5fd 50%, #60a5fa 100%);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textclip 4s linear infinite;
  display: inline-block;
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

.trust-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.28);
  color: var(--white); padding: 5px 16px; border-radius: 20px;
  font-size: 0.82rem; font-family: 'Raleway', sans-serif; backdrop-filter: blur(4px);
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
.whatsapp-float {
  position: fixed; bottom: 28px; right: 28px;
  width: 56px; height: 56px; background: #25D366; color: var(--white);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 1.75rem; box-shadow: 0 4px 16px rgba(37,211,102,0.45);
  z-index: 999; transition: transform var(--t), box-shadow var(--t); text-decoration: none;
}
.whatsapp-float:hover { transform: scale(1.12); box-shadow: 0 6px 24px rgba(37,211,102,0.6); color: var(--white); }

/* â”€â”€ KEYFRAMES â”€â”€ */
@keyframes textclip { to { background-position: 200% center; } }
@keyframes spin { to { transform: rotate(360deg); } }

/* â”€â”€ RESPONSIVE â”€â”€ */
@media (max-width: 768px) {
  .principal { min-height: 360px; border-radius: var(--r-md); }
}
@media (max-width: 480px) {
  .ff-row { grid-template-columns: 1fr; }
  .formulario { padding: 22px 16px 16px; }
}
</style>
