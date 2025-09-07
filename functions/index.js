// functions/index.js

// 1. CAMBIO AQUÍ: Importamos directamente 'onCall' de 'firebase-functions/v2/https'
// Y el resto de librerías que usas
const { onCall, HttpsError } = require('firebase-functions/v2/https'); 
const admin = require('firebase-admin');
const { google } = require('googleapis');

admin.initializeApp();
// 2. CAMBIO AQUÍ: La definición de la función 'onCall' es un poco diferente
// Ahora pasas un objeto de configuración (opcional) y luego el handler (async (data, context) => {...})
exports.getTodayCalendarEvents = onCall(async (data, context) => { // Mantengo el nombre para evitar romper el cliente
    console.log("Cloud Function 'getTodayCalendarEvents' received call.");
    console.log("context.auth:", context.auth);
    console.log("context.auth.uid:", context.auth ? context.auth.uid : 'N/A');
    console.log("context.auth.token.email:", context.auth && context.auth.token ? context.auth.token.email : 'N/A');
  
    if (!context.auth) {
        throw new HttpsError('unauthenticated', 'The function must be called while authenticated.'); // <-- Corrected line 23
    }
const uid = context.auth.uid; // Aquí tienes el UID del usuario que llama
  const email = context.auth.token.email; // Y su email si está disponible en el token

  console.log(`Función 'getTodayCalendarEvents' llamada por UID: ${uid}, Email: ${email}`);

   
    const accessToken = data.accessToken;
    if (!accessToken) {
        throw new HttpsError('invalid-argument', 'Access token is required.'); // Corrected
    }
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    try {
        const response = await calendar.events.list({
            calendarId: 'primary', // El calendario principal del usuario
            timeMin: todayStart.toISOString(),
            timeMax: todayEnd.toISOString(),
            singleEvents: true, // Para expandir eventos recurrentes
            orderBy: 'startTime',
        });

        const events = response.data.items;

        if (!events || events.length === 0) {
            console.log(`No hay eventos planificados para hoy.`);
            return []; // Devolvemos un array vacío si no hay eventos
        }

        console.log(`Eventos encontrados para hoy:`, events.length);

        return events.map(event => ({
            id: event.id,
            summary: event.summary,
            start: event.start ? event.start.dateTime || event.start.date : null,
            end: event.end ? event.end.dateTime || event.end.date : null,
            location: event.location,
            description: event.description,
        }));

    } catch (error) {
        console.error('Error al obtener eventos del calendario:', error);
        // Si quieres usar HttpsError de v2, haz la importación de HttpsError
        // throw new HttpsError('internal', 'An error occurred while fetching calendar events.', error.message);
        // Si no, un error estándar de JS:
        throw new HttpsError('internal', 'An error occurred while fetching calendar events.', error.message);
    }
});


