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
  apiKey: "AIzaSyAGWMYwPw3tqi0c8sgxTSNqr5pe6FlYCm4",
  authDomain: "roys-web-page.firebaseapp.com",
  projectId: "roys-web-page",
  storageBucket: "roys-web-page.appspot.com",
  messagingSenderId: "863410009560",
  appId: "1:863410009560:web:bfffe0142b0288690deead",
  measurementId: "G-MG20MB12K0"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();

const db = getFirestore()
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(firebaseApp);

export {auth,storage,db};