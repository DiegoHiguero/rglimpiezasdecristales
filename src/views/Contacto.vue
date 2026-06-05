<template>
  <div class="ct-wrap">

    <!-- Cabecera -->
    <div class="ct-header">
      <span class="ct-label">Contacto</span>
      <h1 class="ct-title">Hablemos de <span class="ct-accent">tu proyecto</span></h1>
      <p class="ct-sub">Cuéntanos qué necesitas y te preparamos un presupuesto gratuito y sin compromiso en menos de 24 h.</p>
    </div>

    <!-- Tarjetas de contacto -->
    <div class="ct-cards">
      <a href="tel:+34696169435" class="ct-card">
        <div class="ct-card-icon"><font-awesome-icon :icon="['fas', 'phone']" /></div>
        <span class="ct-card-label">Teléfono</span>
        <span class="ct-card-value">+34 696 169 435</span>
      </a>
      <a href="mailto:info@royallclean.es" class="ct-card">
        <div class="ct-card-icon"><font-awesome-icon :icon="['fas', 'envelope']" /></div>
        <span class="ct-card-label">Email</span>
        <span class="ct-card-value">info@royallclean.es</span>
      </a>
      <a href="https://wa.me/34696169435" target="_blank" rel="noopener noreferrer" class="ct-card ct-card--wa">
        <div class="ct-card-icon ct-card-icon--wa"><font-awesome-icon :icon="['fab', 'whatsapp']" /></div>
        <span class="ct-card-label">WhatsApp</span>
        <span class="ct-card-value">Escríbenos ahora</span>
      </a>
      <div class="ct-card">
        <div class="ct-card-icon"><font-awesome-icon :icon="['fas', 'location-dot']" /></div>
        <span class="ct-card-label">Zona</span>
        <span class="ct-card-value">Madrid y alrededores</span>
      </div>
    </div>

    <!-- Formulario -->
    <div class="ct-form-wrap">
      <div v-if="feedback.msg" class="ct-feedback" :class="feedback.ok ? 'ct-feedback--ok' : 'ct-feedback--err'">
        <font-awesome-icon :icon="['fas', feedback.ok ? 'check' : 'xmark']" class="me-2" />
        {{ feedback.msg }}
      </div>
      <form @submit.prevent="enviarMensaje" novalidate>
        <div class="ct-row">
          <div class="cf" :class="{ 'cf--ok': prenom.length > 1, 'cf--err': errors.prenom }">
            <div class="cf-icon"><font-awesome-icon :icon="['fas', 'user']" /></div>
            <div class="cf-body">
              <label>Nombre</label>
              <input type="text" placeholder="¿Cómo te llamas?" v-model.trim="prenom" />
            </div>
          </div>
          <div class="cf" :class="{ 'cf--ok': emailOk, 'cf--err': errors.email }">
            <div class="cf-icon"><font-awesome-icon :icon="['fas', 'envelope']" /></div>
            <div class="cf-body">
              <label>Email</label>
              <input type="email" placeholder="tu@email.com" v-model.trim="email" />
            </div>
          </div>
        </div>
        <div class="ct-row">
          <div class="cf" :class="{ 'cf--ok': phone.length > 8, 'cf--err': errors.phone }">
            <div class="cf-icon"><font-awesome-icon :icon="['fas', 'phone']" /></div>
            <div class="cf-body">
              <label>Teléfono</label>
              <input type="tel" placeholder="+34 600 000 000" v-model.trim="phone" />
            </div>
          </div>
          <div class="cf" :class="{ 'cf--ok': subjet.length > 2 }">
            <div class="cf-icon"><font-awesome-icon :icon="['fas', 'tag']" /></div>
            <div class="cf-body">
              <label>Asunto</label>
              <input type="text" placeholder="¿En qué podemos ayudarte?" v-model.trim="subjet" />
            </div>
          </div>
        </div>
        <div class="cf cf--textarea" :class="{ 'cf--ok': message.length > 9, 'cf--err': errors.message }">
          <div class="cf-icon cf-icon--top"><font-awesome-icon :icon="['fas', 'comments']" /></div>
          <div class="cf-body">
            <label>Mensaje</label>
            <textarea placeholder="Cuéntanos los detalles de tu proyecto..." v-model="message" rows="5"></textarea>
          </div>
        </div>
        <button type="submit" class="ct-submit" :disabled="sending">
          <span v-if="!sending"><font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Enviar mensaje</span>
          <span v-else class="ct-spinner"></span>
        </button>
        <p class="ct-trust"><font-awesome-icon :icon="['fas', 'lock']" class="me-1" />Tu información está segura. Nunca compartimos tus datos.</p>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import emailjs from '@emailjs/browser';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

const prenom  = ref('');
const email   = ref('');
const phone   = ref('');
const subjet  = ref('');
const message = ref('');
const sending = ref(false);
const feedback = ref({ msg: '', ok: false });
const errors = ref({ prenom: false, email: false, phone: false, message: false });

const emailOk = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));

const enviarMensaje = async () => {
  errors.value = { prenom: !prenom.value, email: !emailOk.value, phone: phone.value.length < 9, message: !message.value };
  if (Object.values(errors.value).some(Boolean)) { feedback.value = { msg: 'Rellena todos los campos correctamente.', ok: false }; return; }
  sending.value = true;
  feedback.value = { msg: '', ok: false };
  try {
    await emailjs.send('service_iytm8yl','template_7yngfsa',{ prenom: prenom.value, email: email.value, message: message.value, phone: phone.value },'IF1Sn503DHVPja4II');
    feedback.value = { msg: '¡Mensaje enviado! Te respondemos en menos de 24 h.', ok: true };
    prenom.value = email.value = phone.value = subjet.value = message.value = '';
    errors.value = { prenom: false, email: false, phone: false, message: false };
  } catch { feedback.value = { msg: 'Hubo un problema al enviar. Inténtalo de nuevo.', ok: false }; }
  finally { sending.value = false; }
};
</script>

<style scoped>
.ct-wrap { min-height: calc(100vh - 54px); padding: 52px 16px 72px; background: #151515; display: flex; flex-direction: column; align-items: center; }
.ct-header { text-align: center; max-width: 600px; margin-bottom: 40px; }
.ct-label { display: inline-block; font-family: 'Raleway', sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #60a5fa; background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.2); border-radius: 20px; padding: 4px 14px; margin-bottom: 16px; }
.ct-title { font-family: 'Anton', sans-serif; font-size: 2.8rem; color: #fff; line-height: 1.1; margin: 0 0 14px; }
.ct-accent { color: #60a5fa; }
.ct-sub { font-family: 'Raleway', sans-serif; font-size: 0.95rem; color: #64748b; line-height: 1.75; margin: 0; }
.ct-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%; max-width: 860px; margin-bottom: 40px; }
.ct-card { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; background: #0f1729; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 22px 14px; text-decoration: none; transition: border-color 0.2s, transform 0.2s, background 0.2s; }
a.ct-card:hover { background: rgba(96,165,250,0.05); border-color: rgba(96,165,250,0.25); transform: translateY(-3px); }
.ct-card-icon { width: 42px; height: 42px; border-radius: 12px; background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.2); display: flex; align-items: center; justify-content: center; color: #60a5fa; font-size: 1rem; }
.ct-card-icon--wa { background: rgba(37,211,102,0.1); border-color: rgba(37,211,102,0.2); color: #25d366; }
.ct-card--wa:hover { border-color: rgba(37,211,102,0.3) !important; background: rgba(37,211,102,0.04) !important; }
.ct-card-label { font-family: 'Raleway', sans-serif; font-size: 0.67rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #475569; }
.ct-card-value { font-family: 'Raleway', sans-serif; font-size: 0.85rem; font-weight: 600; color: #cbd5e1; }
.ct-form-wrap { width: 100%; max-width: 860px; background: #0f1729; border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 36px 40px 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
.ct-feedback { font-family: 'Raleway', sans-serif; font-size: 0.84rem; border-radius: 10px; padding: 10px 14px; margin-bottom: 20px; display: flex; align-items: center; }
.ct-feedback--ok  { background: rgba(52,211,153,0.1);  border: 1px solid rgba(52,211,153,0.3);  color: #6ee7b7; }
.ct-feedback--err { background: rgba(239,68,68,0.1);   border: 1px solid rgba(239,68,68,0.3);   color: #fca5a5; }
.ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.cf { display: flex; align-items: center; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 0 14px; transition: border-color 0.2s, background 0.2s; }
.ct-row + .cf { margin-bottom: 12px; }
.cf:focus-within { border-color: rgba(96,165,250,0.5); background: rgba(96,165,250,0.04); }
.cf--ok  { border-color: rgba(52,211,153,0.35); }
.cf--err { border-color: rgba(239,68,68,0.4); background: rgba(239,68,68,0.04); }
.cf--textarea { align-items: flex-start; margin-bottom: 16px; }
.cf-icon { color: #475569; font-size: 0.85rem; width: 18px; flex-shrink: 0; margin-right: 12px; transition: color 0.2s; }
.cf-icon--top { margin-top: 14px; }
.cf:focus-within .cf-icon { color: #60a5fa; }
.cf-body { flex: 1; padding: 10px 0; }
.cf-body label { display: block; font-family: 'Raleway', sans-serif; font-size: 0.67rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; margin-bottom: 2px; }
.cf-body input, .cf-body textarea { width: 100%; background: transparent; border: none; outline: none; color: #f1f5f9; font-family: 'Raleway', sans-serif; font-size: 0.9rem; padding: 0; resize: none; }
.cf-body input::placeholder, .cf-body textarea::placeholder { color: #334155; }
.ct-submit { width: 100%; padding: 14px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.95rem; border: none; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; min-height: 50px; transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s; }
.ct-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.45); }
.ct-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.ct-spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.ct-trust { font-family: 'Raleway', sans-serif; font-size: 0.75rem; color: #334155; text-align: center; margin: 14px 0 0; }
@media (max-width: 860px) { .ct-cards { grid-template-columns: repeat(2, 1fr); } .ct-form-wrap { padding: 28px 24px 24px; } }
@media (max-width: 540px) { .ct-title { font-size: 2.1rem; } .ct-cards { grid-template-columns: repeat(2, 1fr); gap: 8px; } .ct-card { padding: 16px 10px; } .ct-row { grid-template-columns: 1fr; gap: 0; margin-bottom: 0; } .ct-row .cf { margin-bottom: 12px; } .ct-form-wrap { padding: 22px 16px 20px; border-radius: 16px; } .ct-wrap { padding: 32px 12px 56px; } }
</style>