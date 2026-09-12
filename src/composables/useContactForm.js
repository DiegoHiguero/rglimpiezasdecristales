import { ref, computed } from 'vue';
import emailjs from '@emailjs/browser';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const EMAILJS_SERVICE_ID = 'service_iytm8yl';
const EMAILJS_TEMPLATE_ID = 'template_7yngfsa';
const EMAILJS_PUBLIC_KEY = 'IF1Sn503DHVPja4II';

// Lógica compartida por el formulario de contacto del Home y el de /contacto,
// para que ambos envíen y validen exactamente igual y no se desincronicen
// (el bug de "hubo un problema al enviar" del Home venía justo de eso: la
// escritura en Firestore de un formulario había quedado desalineada con las
// reglas de seguridad sin que el otro formulario se viera afectado).
export function useContactForm() {
  const prenom = ref('');
  const email = ref('');
  const phone = ref('');
  const message = ref('');
  const tipoServicio = ref('');
  const zona = ref('');

  const errors = ref({ prenom: '', email: '', phone: '', message: '' });
  const sending = ref(false);
  const feedback = ref({ msg: '', ok: false });

  const validatePrenom = () => {
    errors.value.prenom = prenom.value.trim() ? '' : 'El nombre es obligatorio.';
    return !errors.value.prenom;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) errors.value.email = 'Se requiere una dirección de correo electrónico.';
    else if (!emailRegex.test(email.value)) errors.value.email = 'Introduce una dirección de correo electrónico válida.';
    else errors.value.email = '';
    return !errors.value.email;
  };

  const validatePhone = () => {
    const phoneRegex = /^[\d\s\-()]+$/;
    if (!phone.value.trim()) errors.value.phone = 'Se requiere el número de teléfono.';
    else if (!phoneRegex.test(phone.value)) errors.value.phone = 'Introduce un número de teléfono válido.';
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

  const validateForm = () => validatePrenom() && validateEmail() && validatePhone() && validateMessage();

  const isFormValid = computed(() =>
    prenom.value.trim() !== '' && !errors.value.prenom &&
    email.value.trim() !== '' && !errors.value.email &&
    phone.value.trim() !== '' && !errors.value.phone &&
    message.value.trim() !== '' && !errors.value.message
  );

  const resetForm = () => {
    prenom.value = '';
    email.value = '';
    phone.value = '';
    message.value = '';
    tipoServicio.value = '';
    zona.value = '';
    errors.value = { prenom: '', email: '', phone: '', message: '' };
  };

  const enviarMensaje = async () => {
    if (sending.value) return;
    feedback.value = { msg: '', ok: false };
    if (!validateForm()) {
      feedback.value = { msg: 'Corrige los campos marcados antes de enviar.', ok: false };
      return;
    }

    sending.value = true;
    try {
      const payload = { prenom: prenom.value, email: email.value, phone: phone.value, message: message.value };
      if (tipoServicio.value) payload.tipoServicio = tipoServicio.value;
      if (zona.value) payload.zona = zona.value;

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload, EMAILJS_PUBLIC_KEY);
      await addDoc(collection(db, 'mensajes'), { ...payload, timestamp: serverTimestamp(), read: false });

      feedback.value = { msg: '¡Mensaje enviado! Te respondemos en menos de 24 h.', ok: true };
      resetForm();
    } catch (error) {
      console.error('Error al enviar el formulario de contacto:', error);
      feedback.value = { msg: 'Hubo un problema al enviar. Inténtalo de nuevo.', ok: false };
    } finally {
      sending.value = false;
    }
  };

  return {
    prenom, email, phone, message, tipoServicio, zona,
    errors, sending, feedback, isFormValid,
    validatePrenom, validateEmail, validatePhone, validateMessage,
    enviarMensaje,
  };
}
