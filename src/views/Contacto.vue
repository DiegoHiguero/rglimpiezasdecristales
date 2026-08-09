<template>
  <div class="ct-wrap">

    <!-- Cabecera -->
    <div class="ct-header">
      <span class="ct-label">Contacto</span>
      <h1 class="ct-title">Presupuesto de <span class="ct-accent">limpieza de cristales</span> en Madrid</h1>
      <p class="ct-sub">Cuéntanos qué ventanas o cristales necesitas limpiar y te preparamos un presupuesto gratuito y sin compromiso en menos de 24 h.</p>
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

      <div class="fh">
        <span class="fh-badge"><font-awesome-icon :icon="['fas', 'paper-plane']" class="me-1" />Presupuesto gratuito</span>
        <h2 class="fh-title">Cuéntanos tu <span class="fh-accent">proyecto</span></h2>
        <p class="fh-sub">Respondemos en menos de 24 h, sin compromiso</p>
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
              <label>Nombre completo</label>
              <input type="text" placeholder="¿Cómo te llamas?" v-model.trim="prenom" @blur="validatePrenom" @input="validatePrenom" autocomplete="name" />
              <span class="ff-msg" v-if="errors.prenom">{{ errors.prenom }}</span>
              <span class="ff-msg ff-msg--ok" v-else-if="prenom.length > 0">¡Perfecto!</span>
            </div>
          </div>
          <div class="ff" :class="{ 'ff--ok': email.length > 0 && !errors.email, 'ff--err': errors.email }">
            <div class="ff-icon"><font-awesome-icon :icon="['fas', 'envelope']" /></div>
            <div class="ff-body">
              <label>Correo</label>
              <input type="email" placeholder="tu@email.com" v-model.trim="email" @blur="validateEmail" @input="validateEmail" autocomplete="email" />
              <span class="ff-msg" v-if="errors.email">{{ errors.email }}</span>
              <span class="ff-msg ff-msg--ok" v-else-if="email.length > 0">¡Perfecto!</span>
            </div>
          </div>
        </div>

        <div class="ff-row">
          <div class="ff" :class="{ 'ff--ok': phone.length > 0 && !errors.phone, 'ff--err': errors.phone }">
            <div class="ff-icon"><font-awesome-icon :icon="['fas', 'phone']" /></div>
            <div class="ff-body">
              <label>Teléfono</label>
              <input type="tel" placeholder="6XX XXX XXX" v-model.trim="phone" @blur="validatePhone" @input="validatePhone" autocomplete="tel" />
              <span class="ff-msg" v-if="errors.phone">{{ errors.phone }}</span>
              <span class="ff-msg ff-msg--ok" v-else-if="phone.length > 0">¡Perfecto!</span>
            </div>
          </div>
          <div class="ff">
            <div class="ff-icon"><font-awesome-icon :icon="['fas', 'house']" /></div>
            <div class="ff-body">
              <label>Tipo de espacio</label>
              <select v-model="tipoServicio">
                <option value="">Selecciona una opción</option>
                <option value="Vivienda">Vivienda</option>
                <option value="Negocio o local">Negocio o local</option>
                <option value="Comunidad de vecinos">Comunidad de vecinos</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>
        </div>

        <div class="ff">
          <div class="ff-icon"><font-awesome-icon :icon="['fas', 'location-dot']" /></div>
          <div class="ff-body">
            <label>Zona o dirección aproximada</label>
            <input type="text" placeholder="Ej: Getafe, Madrid centro..." v-model.trim="zona" />
          </div>
        </div>

        <div class="ff" :class="{ 'ff--ok': message.length > 0 && !errors.message, 'ff--err': errors.message }">
          <div class="ff-icon ff-icon--top"><font-awesome-icon :icon="['fas', 'comments']" /></div>
          <div class="ff-body">
            <label>¿Qué necesitas limpiar?</label>
            <textarea rows="4" placeholder="Cuéntanos los detalles: número de ventanas, altura, frecuencia deseada..." v-model="message" @blur="validateMessage" @input="validateMessage"></textarea>
            <span class="ff-msg" v-if="errors.message">{{ errors.message }}</span>
            <span class="ff-msg ff-msg--ok" v-else-if="message.length > 0">¡Perfecto!</span>
          </div>
        </div>

        <button type="submit" class="f-submit" :disabled="sending || !isFormValid">
          <span v-if="!sending"><font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Enviar consulta</span>
          <span v-else class="f-submit-loading"><span class="f-spinner"></span>Enviando...</span>
        </button>

        <div class="f-trust">
          <span><font-awesome-icon :icon="['fas', 'lock']" class="me-1" />Sin compromiso</span>
          <span><font-awesome-icon :icon="['fas', 'clock']" class="me-1" />Respuesta en 24 h</span>
          <span><font-awesome-icon :icon="['fas', 'shield-halved']" class="me-1" />Datos protegidos</span>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import emailjs from '@emailjs/browser';

const prenom        = ref('');
const email         = ref('');
const phone         = ref('');
const tipoServicio  = ref('');
const zona          = ref('');
const message       = ref('');
const sending       = ref(false);
const feedback      = ref({ msg: '', ok: false });
const errors        = ref({ prenom: '', email: '', phone: '', message: '' });

const validatePrenom = () => {
  errors.value.prenom = prenom.value.trim() ? '' : 'El nombre es obligatorio.';
  return !errors.value.prenom;
};
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) errors.value.email = 'Se requiere un correo electrónico.';
  else if (!emailRegex.test(email.value)) errors.value.email = 'Introduce un correo válido.';
  else errors.value.email = '';
  return !errors.value.email;
};
const validatePhone = () => {
  if (!phone.value.trim()) errors.value.phone = 'Se requiere un teléfono.';
  else if (phone.value.trim().replace(/[\s\-()]/g, '').length < 9) errors.value.phone = 'El teléfono debe tener al menos 9 dígitos.';
  else errors.value.phone = '';
  return !errors.value.phone;
};
const validateMessage = () => {
  if (!message.value.trim()) errors.value.message = 'El mensaje es obligatorio.';
  else if (message.value.trim().length < 10) errors.value.message = 'Cuéntanos un poco más (mínimo 10 caracteres).';
  else errors.value.message = '';
  return !errors.value.message;
};

const isFormValid = computed(() =>
  prenom.value.trim() !== '' && !errors.value.prenom &&
  email.value.trim()  !== '' && !errors.value.email &&
  phone.value.trim()  !== '' && !errors.value.phone &&
  message.value.trim() !== '' && !errors.value.message
);

const enviarMensaje = async () => {
  const ok = validatePrenom() && validateEmail() && validatePhone() && validateMessage();
  if (!ok) { feedback.value = { msg: 'Corrige los campos marcados antes de enviar.', ok: false }; return; }

  sending.value = true;
  feedback.value = { msg: '', ok: false };
  try {
    await emailjs.send('service_iytm8yl', 'template_7yngfsa', {
      prenom: prenom.value,
      email: email.value,
      phone: phone.value,
      message: message.value,
      tipoServicio: tipoServicio.value,
      zona: zona.value,
    }, 'IF1Sn503DHVPja4II');
    feedback.value = { msg: '¡Mensaje enviado! Te respondemos en menos de 24 h.', ok: true };
    prenom.value = email.value = phone.value = zona.value = message.value = tipoServicio.value = '';
    errors.value = { prenom: '', email: '', phone: '', message: '' };
  } catch {
    feedback.value = { msg: 'Hubo un problema al enviar. Inténtalo de nuevo.', ok: false };
  } finally {
    sending.value = false;
  }
};
</script>

<style scoped>
.ct-wrap { min-height: calc(100vh - 54px); padding: 52px 16px 72px; background: var(--slate); display: flex; flex-direction: column; align-items: center; }
.ct-header { text-align: center; max-width: 600px; margin-bottom: 40px; }
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

@media (max-width: 860px) { .ct-cards { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) {
  .ct-title { font-size: 2.1rem; }
  .ct-cards { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .ct-card { padding: 16px 10px; }
  .ct-form-wrap { padding: 26px 20px 22px; border-radius: 16px; }
  .ff-row { grid-template-columns: 1fr; gap: 0; }
  .ff-row .ff { margin-bottom: 16px; }
  .ct-wrap { padding: 32px 12px 56px; }
}
</style>
