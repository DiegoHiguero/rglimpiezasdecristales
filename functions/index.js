// functions/index.js

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { google } = require('googleapis');

admin.initializeApp();

exports.getTodayCalendarEvents = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Se requiere autenticación.');
  }

  const allowedEmails = ['higuerodiego@gmail.com', 'roys.abreu@gmail.com'];
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
