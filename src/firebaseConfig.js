// firebaseConfig.js

import { initializeApp, getApps, getApp } from "firebase/app"; // Importamos getApps y getApp
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyCyqLZfXWsS-AG_pgJ0TQ68BCpBtPMozws",

  authDomain: "royallclean.es",

  databaseURL: "https://royal-clean-services-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "royal-clean-services",

  storageBucket: "royal-clean-services.firebasestorage.app",

  messagingSenderId: "504065320806",

  appId: "1:504065320806:web:20ab2ffdb277c6bc5fcaa7",

  measurementId: "G-PXB9NMPZQ0"

};

let firebaseAppInstance;

// Comprobamos si ya hay alguna aplicación Firebase inicializada.
// Esto es común en entornos de desarrollo con Hot Module Reloading (HMR)
// para evitar el error "Firebase App named '[DEFAULT]' already exists".
if (!getApps().length) {
  try {
    firebaseAppInstance = initializeApp(firebaseConfig);
    // console.log("DEBUG FirebaseConfig: Firebase App inicializada por primera vez.");
  } catch (error) {
    console.error("ERROR FirebaseConfig: Fallo al inicializar Firebase App:", error);
    // Si falla aquí, significa que hay un problema fundamental con la configuración
    throw error; // Re-lanza el error para que sea visible
  }
} else {
  // Si ya hay una aplicación, la recuperamos.
  firebaseAppInstance = getApp();
  console.log("DEBUG FirebaseConfig: Firebase App ya estaba inicializada, recuperando la instancia existente.");
}

// *** ¡Añadamos un console.log justo antes de la línea problematica! ***
// console.log("DEBUG FirebaseConfig: firebaseAppInstance antes de inicializar servicios:", firebaseAppInstance);


// Pasa la instancia de la app a TODOS los servicios de Firebase
export const auth = getAuth(firebaseAppInstance);
export const db = getFirestore(firebaseAppInstance);
export const storage = getStorage(firebaseAppInstance);
export const functions = getFunctions(firebaseAppInstance); // <-- Esta es probablemente la línea 29
// export const analytics = getAnalytics(firebaseAppInstance); // Si lo usas, también inicialízalo aquí

export { firebaseAppInstance as firebaseApp }; // Exportamos la instancia de la app
