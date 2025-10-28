// functions/index.js

// 1. CAMBIO AQUÍ: Importamos directamente 'onCall' de 'firebase-functions/v2/https'
// Y el resto de librerías que usas
const { onCall, HttpsError } = require('firebase-functions/v2/https'); 
const admin = require('firebase-admin');
const { google } = require('googleapis');

admin.initializeApp();
// 2. CAMBIO AQUÍ: La definición de la función 'onCall' es un poco diferente



