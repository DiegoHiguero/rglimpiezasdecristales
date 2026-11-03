<template>
  <div class="ct-wrap">

    <!-- Header -->
    <div class="ct-header">
      <div class="ct-header-text">
        <span class="ct-label">Contact</span>
        <h1 class="ct-title">Window <span class="ct-accent">cleaning quote</span> in Madrid</h1>
        <p class="ct-sub">Tell us which windows or glass you need cleaned and we'll prepare a free, no-obligation quote within 24 hours.</p>
      </div>
      <img src="../assets/img/ilustraciones/limpiacristales.webp" class="ct-header-ilus" alt="Illustration of a window cleaner with a pole" />
    </div>

    <!-- Contact cards -->
    <div class="ct-cards">
      <a href="tel:+34625950506" class="ct-card">
        <div class="ct-card-icon"><font-awesome-icon :icon="['fas', 'phone']" /></div>
        <span class="ct-card-label">Phone</span>
        <span class="ct-card-value">+34 625 950 506</span>
      </a>
      <a href="mailto:info@royallclean.es" class="ct-card">
        <div class="ct-card-icon"><font-awesome-icon :icon="['fas', 'envelope']" /></div>
        <span class="ct-card-label">Email</span>
        <span class="ct-card-value">info@royallclean.es</span>
      </a>
      <a href="https://wa.me/34625950506" target="_blank" rel="noopener noreferrer" class="ct-card ct-card--wa">
        <div class="ct-card-icon ct-card-icon--wa"><font-awesome-icon :icon="['fab', 'whatsapp']" /></div>
        <span class="ct-card-label">WhatsApp</span>
        <span class="ct-card-value">Message us now</span>
      </a>
      <div class="ct-card">
        <div class="ct-card-icon"><font-awesome-icon :icon="['fas', 'location-dot']" /></div>
        <span class="ct-card-label">Area</span>
        <span class="ct-card-value">Madrid and surrounding areas</span>
      </div>
    </div>

    <!-- Form -->
    <div class="ct-form-wrap">

      <div class="fh">
        <span class="fh-badge"><font-awesome-icon :icon="['fas', 'paper-plane']" class="me-1" />Free quote</span>
        <h2 class="fh-title">Tell us about your <span class="fh-accent">project</span></h2>
        <p class="fh-sub">We reply within 24 hours, no obligation</p>
      </div>

      <div class="f-success" v-if="feedback.msg && feedback.ok">
        <font-awesome-icon :icon="['fas', 'check']" class="me-2" />{{ feedback.msg }}
      </div>
      <div class="ff-error" v-if="feedback.msg && !feedback.ok">
        <font-awesome-icon :icon="['fas', 'xmark']" class="me-2" />{{ feedback.msg }}
      </div>

      <form @submit.prevent="enviarMensaje" novalidate>

        <div class="ff-row">
          <div class="ff" :class="{ 'ff--ok': prenom.length > 0 && !errors.prenom, 'ff--err': errors.prenom }">
            <div class="ff-icon"><font-awesome-icon :icon="['fas', 'user']" /></div>
            <div class="ff-body">
              <label>Full name</label>
              <input type="text" placeholder="What's your name?" v-model.trim="prenom" @blur="validatePrenom" @input="validatePrenom" autocomplete="name" />
              <span class="ff-msg" v-if="errors.prenom">{{ errors.prenom }}</span>
              <span class="ff-msg ff-msg--ok" v-else-if="prenom.length > 0">Great!</span>
            </div>
          </div>
          <div class="ff" :class="{ 'ff--ok': email.length > 0 && !errors.email, 'ff--err': errors.email }">
            <div class="ff-icon"><font-awesome-icon :icon="['fas', 'envelope']" /></div>
            <div class="ff-body">
              <label>Email</label>
              <input type="email" placeholder="you@email.com" v-model.trim="email" @blur="validateEmail" @input="validateEmail" autocomplete="email" />
              <span class="ff-msg" v-if="errors.email">{{ errors.email }}</span>
              <span class="ff-msg ff-msg--ok" v-else-if="email.length > 0">Great!</span>
            </div>
          </div>
        </div>

        <div class="ff-row">
          <div class="ff" :class="{ 'ff--ok': phone.length > 0 && !errors.phone, 'ff--err': errors.phone }">
            <div class="ff-icon"><font-awesome-icon :icon="['fas', 'phone']" /></div>
            <div class="ff-body">
              <label>Phone</label>
              <input type="tel" placeholder="6XX XXX XXX" v-model.trim="phone" @blur="validatePhone" @input="validatePhone" autocomplete="tel" />
              <span class="ff-msg" v-if="errors.phone">{{ errors.phone }}</span>
              <span class="ff-msg ff-msg--ok" v-else-if="phone.length > 0">Great!</span>
            </div>
          </div>
          <div class="ff">
            <div class="ff-icon"><font-awesome-icon :icon="['fas', 'location-dot']" /></div>
            <div class="ff-body">
              <label>Area or approximate address</label>
              <input type="text" placeholder="E.g. Getafe, Madrid centre..." v-model.trim="zona" />
            </div>
          </div>
        </div>

        <div class="ct-tipos">
          <span class="ct-tipos-label">What do you need?</span>
          <div class="ct-tipos-grid">
            <button type="button" class="ct-tipo" :class="{ 'ct-tipo--on': tipoServicio === 'Vivienda' }"
                    :aria-pressed="tipoServicio === 'Vivienda'" @click="elegirTipo('Vivienda')">
              <img :src="imgVivienda" alt="" class="ct-tipo-img" />
              <span>Home</span>
            </button>
            <button type="button" class="ct-tipo" :class="{ 'ct-tipo--on': tipoServicio === 'Negocio o comunidad' }"
                    :aria-pressed="tipoServicio === 'Negocio o comunidad'" @click="elegirTipo('Negocio o comunidad')">
              <img :src="imgEdificio" alt="" class="ct-tipo-img" />
              <span>Business or building</span>
            </button>
            <button type="button" class="ct-tipo" :class="{ 'ct-tipo--on': tipoServicio === 'Agua a presión' }"
                    :aria-pressed="tipoServicio === 'Agua a presión'" @click="elegirTipo('Agua a presión')">
              <img :src="imgAguaPresion" alt="" class="ct-tipo-img" />
              <span>Pressure washing</span>
            </button>
            <button type="button" class="ct-tipo" :class="{ 'ct-tipo--on': tipoServicio === 'Limpieza en altura' }"
                    :aria-pressed="tipoServicio === 'Limpieza en altura'" @click="elegirTipo('Limpieza en altura')">
              <img :src="imgAguaPura" alt="" class="ct-tipo-img" />
              <span>Cleaning at height</span>
            </button>
            <button type="button" class="ct-tipo" :class="{ 'ct-tipo--on': tipoServicio === 'Otro' }"
                    :aria-pressed="tipoServicio === 'Otro'" @click="elegirTipo('Otro')">
              <span class="ct-tipo-icon"><font-awesome-icon :icon="['fas', 'ellipsis']" /></span>
              <span>Other</span>
            </button>
          </div>
        </div>

        <div class="ff" :class="{ 'ff--ok': message.length > 0 && !errors.message, 'ff--err': errors.message }">
          <div class="ff-icon ff-icon--top"><font-awesome-icon :icon="['fas', 'comments']" /></div>
          <div class="ff-body">
            <label>What do you need cleaned?</label>
            <textarea rows="4" placeholder="Tell us the details: number of windows, height, desired frequency..." v-model="message" @blur="validateMessage" @input="validateMessage"></textarea>
            <span class="ff-msg" v-if="errors.message">{{ errors.message }}</span>
            <span class="ff-msg ff-msg--ok" v-else-if="message.length > 0">Great!</span>
          </div>
        </div>

        <button type="submit" class="f-submit" :disabled="sending">
          <span v-if="!sending"><font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Send enquiry</span>
          <span v-else class="f-submit-loading"><span class="f-spinner"></span>Sending...</span>
        </button>

        <div class="f-trust">
          <span><font-awesome-icon :icon="['fas', 'lock']" class="me-1" />No obligation</span>
          <span><font-awesome-icon :icon="['fas', 'clock']" class="me-1" />Reply within 24 h</span>
          <span><font-awesome-icon :icon="['fas', 'shield-halved']" class="me-1" />Data protected</span>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup>
import { useContactForm } from '../composables/useContactForm';
import imgVivienda    from '../assets/img/ilustraciones/vivienda.webp';
import imgEdificio    from '../assets/img/ilustraciones/edificio.webp';
import imgAguaPresion from '../assets/img/ilustraciones/agua-presion.webp';
import imgAguaPura    from '../assets/img/ilustraciones/agua-pura.webp';

const {
  prenom, email, phone, message, tipoServicio, zona,
  errors, sending, feedback,
  validatePrenom, validateEmail, validatePhone, validateMessage,
  enviarMensaje,
} = useContactForm('en');

// Selector "¿Qué necesitas?": el valor llega en español en el aviso por correo;
// pulsar otra vez la opción elegida la desmarca
const elegirTipo = (valor) => { tipoServicio.value = tipoServicio.value === valor ? '' : valor; };
</script>

<style scoped>
.ct-wrap { min-height: calc(100vh - 72px); padding: 52px 16px 72px; background: var(--slate); display: flex; flex-direction: column; align-items: center; }
.ct-header { margin-bottom: 40px; }
.ct-label { display: inline-block; font-family: 'Raleway', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--blue); background: var(--blue-pale); border: 1px solid rgba(37,99,235,0.2); border-radius: 20px; padding: 4px 14px; margin-bottom: 16px; }
.ct-title { font-family: 'Anton', sans-serif; font-size: 2.8rem; color: var(--text); line-height: 1.1; margin: 0 0 14px; }
.ct-accent { color: var(--blue); }
.ct-sub { font-family: 'Raleway', sans-serif; font-size: 0.95rem; color: var(--text-muted); line-height: 1.75; margin: 0; }
.ct-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%; max-width: 860px; margin-bottom: 40px; }
.ct-card { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; background: var(--white); border: 1px solid var(--border); border-radius: 16px; padding: 22px 14px; text-decoration: none; transition: border-color 0.2s, transform 0.2s, background 0.2s; }
a.ct-card:hover { background: var(--blue-pale); border-color: rgba(37,99,235,0.3); transform: translateY(-3px); }
.ct-card-icon { width: 42px; height: 42px; border-radius: 12px; background: var(--blue-pale); border: 1px solid rgba(37,99,235,0.2); display: flex; align-items: center; justify-content: center; color: var(--blue); font-size: 1rem; }
.ct-card-icon--wa { background: rgba(37,211,102,0.12); border-color: rgba(37,211,102,0.25); color: #25d366; }
.ct-card--wa:hover { border-color: rgba(37,211,102,0.3) !important; background: rgba(37,211,102,0.06) !important; }
.ct-card-label { font-family: 'Raleway', sans-serif; font-size: 0.67rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); }
.ct-card-value { font-family: 'Raleway', sans-serif; font-size: 0.85rem; font-weight: 600; color: var(--text); }

/* ── Formulario (estilo home) ── */
.ct-form-wrap {
  width: 100%; max-width: 860px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px 36px 28px;
  box-shadow: var(--shadow-lg);
}
.fh { text-align: center; margin-bottom: 26px; }
.fh-badge { display: inline-flex; align-items: center; background: var(--blue-pale); border: 1px solid rgba(37,99,235,0.25); color: var(--blue); font-family: 'Raleway', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 14px; }
.fh-title { font-family: 'Anton', sans-serif; color: var(--text); font-size: 1.8rem; line-height: 1.2; margin: 0 0 8px; }
.fh-accent { color: var(--blue); }
.fh-sub { color: var(--text-muted); font-family: 'Raleway', sans-serif; font-size: 0.85rem; margin: 0; }

.ff { display: flex; gap: 12px; margin-bottom: 16px; }
.ff-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
.ff-row .ff { margin-bottom: 0; }
.ff-icon {
  width: 36px; min-width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  background: var(--blue-pale); border: 1px solid rgba(37,99,235,0.18);
  border-radius: 9px; color: var(--blue); font-size: 0.85rem;
  margin-top: 20px; flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.ff-icon--top { align-self: flex-start; margin-top: 20px; }
.ff:focus-within .ff-icon { background: rgba(37,99,235,0.22); border-color: rgba(37,99,235,0.5); color: var(--blue-hover); }
.ff--ok .ff-icon { border-color: rgba(52,211,153,0.4); color: #10b981; background: rgba(16,185,129,0.1); }
.ff--err .ff-icon { border-color: rgba(239,68,68,0.4); color: #ef4444; background: rgba(239,68,68,0.08); }

.ff-body { flex: 1; min-width: 0; }
.ff-body label { display: block; font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px; }
.ff-body input, .ff-body textarea, .ff-body select {
  width: 100%; background: var(--slate);
  border: 1px solid var(--border); border-radius: 9px;
  padding: 10px 12px; color: var(--text);
  font-family: 'Raleway', sans-serif; font-size: 0.9rem;
  outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; resize: none;
}
.ff-body select { appearance: none; cursor: pointer; }
.ff-body select option { background: var(--white); color: var(--text); }
.ff-body input::placeholder, .ff-body textarea::placeholder { color: var(--text-muted); opacity: 0.6; }
.ff-body input:focus, .ff-body textarea:focus, .ff-body select:focus {
  border-color: rgba(37,99,235,0.5); background: var(--white);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
}
.ff--ok .ff-body input, .ff--ok .ff-body textarea { border-color: rgba(16,185,129,0.5); }
.ff--err .ff-body input, .ff--err .ff-body textarea { border-color: rgba(239,68,68,0.5); box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }

.ff-msg { display: block; font-family: 'Raleway', sans-serif; font-size: 0.72rem; font-weight: 600; margin-top: 5px; color: #ef4444; }
.ff-msg--ok { color: #10b981; }

.f-success {
  background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);
  border-radius: 9px; color: #059669; font-family: 'Raleway', sans-serif;
  font-size: 0.85rem; font-weight: 600; padding: 12px 16px; margin-bottom: 18px; text-align: center;
}
.ff-error {
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
  border-radius: 9px; color: #dc2626; font-family: 'Raleway', sans-serif;
  font-size: 0.85rem; font-weight: 600; padding: 12px 16px; margin-bottom: 18px; text-align: center;
}

.f-submit {
  width: 100%; background: linear-gradient(135deg, var(--blue) 0%, var(--blue-hover) 100%);
  color: #fff; font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.95rem;
  padding: 15px 20px; border: none; border-radius: 12px; cursor: pointer;
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-bottom: 16px; transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}
.f-submit:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(37,99,235,0.45); }
.f-submit:disabled { opacity: 0.45; cursor: not-allowed; }
.f-submit-loading { display: flex; align-items: center; gap: 8px; }
.f-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: ct-spin 0.7s linear infinite; display: inline-block; }
@keyframes ct-spin { to { transform: rotate(360deg); } }
.f-trust { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; color: var(--text-muted); font-family: 'Raleway', sans-serif; font-size: 0.7rem; font-weight: 600; }

/* ── Cabecera con ilustración ── */
.ct-header { display: flex; align-items: center; gap: 36px; max-width: 860px; text-align: left; }
.ct-header-ilus { height: 230px; width: auto; flex-shrink: 0; }

/* ── Selector "¿Qué necesitas?" con ilustraciones ── */
.ct-tipos { margin-bottom: 16px; }
.ct-tipos-label { display: block; font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px; }
.ct-tipos-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.ct-tipo {
  display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 8px;
  background: var(--white);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  padding: 14px 8px 12px;
  font-family: 'Raleway', sans-serif; font-size: 0.78rem; font-weight: 700; color: var(--text);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.2s;
}
.ct-tipo:hover { border-color: rgba(37,99,235,0.45); transform: translateY(-2px); }
.ct-tipo--on { border-color: var(--blue); background: var(--blue-pale); box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
.ct-tipo-img { height: 54px; width: 60px; object-fit: contain; }
.ct-tipo-icon { height: 54px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: var(--blue); }
:root[data-theme="dark"] .ct-tipo--on { background: rgba(37,99,235,0.15); }

@media (max-width: 860px) { .ct-cards { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) {
  .ct-header { flex-direction: column-reverse; text-align: center; gap: 12px; }
  .ct-header-ilus { height: 120px; }
  .ct-tipos-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .ct-title { font-size: 2.1rem; }
  .ct-cards { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .ct-card { padding: 16px 10px; }
  .ct-form-wrap { padding: 26px 20px 22px; border-radius: 16px; }
  .ff-row { grid-template-columns: 1fr; gap: 0; }
  .ff-row .ff { margin-bottom: 16px; }
  .ct-wrap { padding: 32px 12px 56px; }
}
</style>
