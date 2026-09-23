import { ref, computed } from 'vue';
import emailjs from '@emailjs/browser';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const EMAILJS_SERVICE_ID = 'service_iytm8yl';
const EMAILJS_TEMPLATE_ID = 'template_7yngfsa';
const EMAILJS_PUBLIC_KEY = 'IF1Sn503DHVPja4II';

const MESSAGES = {
  es: {
    prenomRequired: 'El nombre es obligatorio.',
    emailRequired: 'Se requiere una dirección de correo electrónico.',
    emailInvalid: 'Introduce una dirección de correo electrónico válida.',
    phoneRequired: 'Se requiere el número de teléfono.',
    phoneInvalid: 'Introduce un número de teléfono válido.',
    phoneTooShort: 'El teléfono debe tener al menos 9 dígitos.',
    messageRequired: 'El mensaje es obligatorio.',
    messageTooShort: 'Cuéntanos un poco más (mínimo 10 caracteres).',
    fixErrors: 'Corrige los campos marcados antes de enviar.',
    success: '¡Mensaje enviado! Te respondemos en menos de 24 h.',
    error: 'Hubo un problema al enviar. Inténtalo de nuevo.',
  },
  en: {
    prenomRequired: 'Your name is required.',
    emailRequired: 'An email address is required.',
    emailInvalid: 'Enter a valid email address.',
    phoneRequired: 'A phone number is required.',
    phoneInvalid: 'Enter a valid phone number.',
    phoneTooShort: 'The phone number must have at least 9 digits.',
    messageRequired: 'The message is required.',
    messageTooShort: 'Tell us a bit more (at least 10 characters).',
    fixErrors: 'Please fix the highlighted fields before sending.',
    success: 'Message sent! We\'ll reply within 24 hours.',
    error: 'Something went wrong sending your message. Please try again.',
  },
};

// Lógica compartida por el formulario de contacto del Home y el de /contacto
// (y sus versiones en inglés), para que todos envíen y validen exactamente
// igual y no se desincronicen (el bug de "hubo un problema al enviar" del
// Home venía justo de eso: la escritura en Firestore de un formulario había
// quedado desalineada con las reglas de seguridad sin que el otro formulario
// se viera afectado).
export function useContactForm(locale = 'es') {
  const t = MESSAGES[locale] || MESSAGES.es;

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
    errors.value.prenom = prenom.value.trim() ? '' : t.prenomRequired;
    return !errors.value.prenom;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) errors.value.email = t.emailRequired;
    else if (!emailRegex.test(email.value)) errors.value.email = t.emailInvalid;
    else errors.value.email = '';
    return !errors.value.email;
  };

  const validatePhone = () => {
    const phoneRegex = /^[\d\s\-()]+$/;
    if (!phone.value.trim()) errors.value.phone = t.phoneRequired;
    else if (!phoneRegex.test(phone.value)) errors.value.phone = t.phoneInvalid;
    else if (phone.value.trim().replace(/[\s\-()]/g, '').length < 9) errors.value.phone = t.phoneTooShort;
    else errors.value.phone = '';
    return !errors.value.phone;
  };

  const validateMessage = () => {
    if (!message.value.trim()) errors.value.message = t.messageRequired;
    else if (message.value.trim().length < 10) errors.value.message = t.messageTooShort;
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
      feedback.value = { msg: t.fixErrors, ok: false };
      return;
    }

    sending.value = true;
    try {
      const payload = { prenom: prenom.value, email: email.value, phone: phone.value, message: message.value };
      if (tipoServicio.value) payload.tipoServicio = tipoServicio.value;
      if (zona.value) payload.zona = zona.value;

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload, EMAILJS_PUBLIC_KEY);
      await addDoc(collection(db, 'mensajes'), { ...payload, timestamp: serverTimestamp(), read: false });

      feedback.value = { msg: t.success, ok: true };
      resetForm();
    } catch (error) {
      console.error('Error al enviar el formulario de contacto:', error);
      feedback.value = { msg: t.error, ok: false };
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
