// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref } from "firebase/storage";
//paquete mas comprimido (lite)
import { getFirestore } from 'firebase/firestore/lite'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyCyqLZfXWsS-AG_pgJ0TQ68BCpBtPMozws",

  authDomain: "royal-clean-services.firebaseapp.com",

  databaseURL: "https://royal-clean-services-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "royal-clean-services",

  storageBucket: "royal-clean-services.firebasestorage.app",

  messagingSenderId: "504065320806",

  appId: "1:504065320806:web:20ab2ffdb277c6bc5fcaa7",

  measurementId: "G-PXB9NMPZQ0"

};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();

const db = getFirestore()
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(firebaseApp);

export {auth,storage,db};