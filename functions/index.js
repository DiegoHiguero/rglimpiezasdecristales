// functions/index.js

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

admin.initializeApp();

// ── Formulario de contacto ──
// La web solo guarda el mensaje en Firestore (colección "mensajes"); esta
// función lo detecta y envía el aviso desde el buzón de IONOS. La contraseña
// se guarda como secreto: firebase functions:secrets:set SMTP_PASSWORD
const SMTP_PASSWORD = defineSecret('SMTP_PASSWORD');
const BUZON = 'info@royallclean.es';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.notificarMensajeContacto = onDocumentCreated(
  { document: 'mensajes/{id}', secrets: [SMTP_PASSWORD] },
  async (event) => {
    const m = event.data?.data();
    if (!m) return;

    const transporter = nodemailer.createTransport({
      host: 'smtp.ionos.es',
      port: 465,
      secure: true,
      auth: { user: BUZON, pass: SMTP_PASSWORD.value() },
    });

    // "No indicado" / "Not provided" cuando el cliente no deja email
    const emailCliente = EMAIL_REGEX.test(m.email || '') ? m.email : null;

    // Texto plano: el contenido lo escribe el visitante, así no se interpreta como HTML
    const aviso = [
      'Nuevo mensaje desde la web royallclean.es',
      '',
      `Nombre: ${m.prenom}`,
      `Teléfono: ${m.phone}`,
      `Email: ${m.email || 'No indicado'}`,
      m.tipoServicio ? `Tipo de servicio: ${m.tipoServicio}` : null,
      m.zona ? `Zona: ${m.zona}` : null,
      '',
      'Mensaje:',
      m.message,
    ].filter((linea) => linea !== null).join('\n');

    await transporter.sendMail({
      from: `"Web Royall Clean" <${BUZON}>`,
      to: BUZON,
      replyTo: emailCliente || undefined,
      subject: `Nueva consulta de ${m.prenom} – ${m.phone}`,
      text: aviso,
    });

    if (!emailCliente) return;

    // Respuesta automática; si falla no debe ocultar que el aviso sí se envió
    try {
      await transporter.sendMail({
        from: `"Royall Clean" <${BUZON}>`,
        to: emailCliente,
        replyTo: BUZON,
        subject: 'Hemos recibido tu consulta – Royall Clean',
        text: [
          `Hola ${m.prenom},`,
          '',
          'Gracias por escribirnos. Hemos recibido tu consulta y te responderemos en menos de 24 horas con tu presupuesto.',
          '',
          'Tu mensaje:',
          `"${m.message}"`,
          '',
          'Si es urgente, puedes llamarnos o escribirnos por WhatsApp al 625 950 506.',
          '',
          'Un saludo,',
          'Roys Abreu',
          'Royall Clean · Limpieza de cristales en Madrid',
          'https://royallclean.es',
          '',
          '—',
          `Hi ${m.prenom}, thanks for your message. We've received it and will get back to you within 24 hours.`,
        ].join('\n'),
      });
    } catch (error) {
      console.error('Error al enviar la respuesta automática:', error);
    }
  }
);

exports.getTodayCalendarEvents = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Se requiere autenticación.');
  }

  const allowedEmails = ['roys.abreu@gmail.com'];
  const email = request.auth.token.email;
  if (!allowedEmails.includes(email)) {
    throw new HttpsError('permission-denied', 'Acceso no autorizado.');
  }

  const accessToken = request.data?.accessToken;
  if (!accessToken) {
    throw new HttpsError('invalid-argument', 'Se requiere accessToken.');
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay,
      timeMax: endOfDay,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error al obtener eventos de Google Calendar:', error);
    throw new HttpsError('internal', 'Error al obtener eventos del calendario.');
  }
});
