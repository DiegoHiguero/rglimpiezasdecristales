import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { defineStore } from "pinia";
// Importaciones de Firestore para el contador de mensajes
import { collection, query, where, onSnapshot } from 'firebase/firestore'; 

import { auth, db, storage } from "../firebaseConfig"; // Asegúrate de que 'db' se exporte desde firebaseConfig
import dayjs from "dayjs";
import router from "../router";
import { useDatabaseStore } from "./database";
import { getFunctions, httpsCallable } from "firebase/functions";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        userData: { email: null, uid: null, displayName: null },
        googleAccessToken: null,
        loadingUser: false,
        loadingAuth: true,
        mensaje: null,
        timeOut: false,
        selectedDate: dayjs(),
        today: dayjs().format("YYYY-MM-DD"),
        cookie: false, // Asegúrate de que esta propiedad también esté aquí si la usas
        unreadMessagesCount: 0, // NUEVO: Estado para el contador de mensajes no leídos
        _messagesUnsubscribe: null, // NUEVO: Para almacenar la función de desuscripción de Firestore
    }),
    actions: {
        // --- Auth y Registro ---
        async registerUser(email, password) {
            this.loadingUser = true;
            this.timeOut = false;
            this.mensaje = null;
            try {
                await createUserWithEmailAndPassword(auth, email, password);
            } catch (error) {
                console.error("Error en registerUser:", error);
                this.timeOut = true;
                switch (error.code) {
                    case "auth/email-already-in-use":
                        this.mensaje = "Cet email est déjà enregistré.";
                        break;
                    case "auth/invalid-email":
                        this.mensaje = "Email invalide.";
                        break;
                    case "auth/weak-password":
                        this.mensaje = "Le mot de passe doit contenir au moins 6 caractères.";
                        break;
                    default:
                        this.mensaje = "Une erreur est survenue lors de l'enregistrement.";
                }
            } finally {
                this.loadingUser = false;
            }
        },

        async loginUser(email, password) {
            this.loadingUser = true;
            this.timeOut = false;
            this.mensaje = null;
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                this.userData = { email: userCredential.user.email, uid: userCredential.user.uid, displayName: userCredential.user.displayName };
                
                // NUEVO: Inicia la escucha de mensajes si es un administrador
                if (this.isAdminUser(userCredential.user)) {
                    this.startUnreadMessagesListener();
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error("Error en loginUser:", error);
                this.timeOut = true;
                switch (error.code) {
                    case "auth/wrong-password":
                        this.mensaje = "Contraseña incorrecta.";
                        break;
                    case "auth/user-not-found":
                        this.mensaje = "Lo sentimos, el usuario no está registrado.";
                        break;
                    case "auth/invalid-email":
                        this.mensaje = "Correo electrónico no válido.";
                        break;
                    default:
                        this.mensaje = "Se produjo un error durante la conexión.";
                }
            } finally {
                this.loadingUser = false;
            }
        },

        async signInWithGoogle() {
      this.loadingUser = true;
      this.timeOut = false;
      this.mensaje = null;

      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/drive.file');
      provider.addScope('https://www.googleapis.com/auth/gmail.send');
      provider.addScope('https://www.googleapis.com/auth/spreadsheets');

      try {
        const result = await signInWithPopup(auth, provider);

        // 1️⃣ Guardar datos del usuario Firebase
        this.userData = { email: result.user.email, uid: result.user.uid, displayName: result.user.displayName };

        // 2️⃣ Guardar token de Google Drive
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential?.accessToken) {
          throw new Error("No se pudo obtener el token de Google Drive.");
        }
        this.googleAccessToken = credential.accessToken;


        router.push('/dashboard'); // redirige al dashboard de administrador

      } catch (error) {
        this.timeOut = true;
        this.googleAccessToken = null;
        this.mensaje = "Error al iniciar sesión con Google.";
      } finally {
        this.loadingUser = false;
      }
    },

        async logOutUser() {
            const databaseStore = useDatabaseStore();
            databaseStore.$reset();
            try {
                await signOut(auth);
                this.userData = { email: null, uid: null, displayName: null };
                this.googleAccessToken = null;
                // NUEVO: Detiene la escucha de mensajes al cerrar sesión
                this.stopUnreadMessagesListener(); 
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
                this.mensajeAlerta("Se produjo un error al cerrar sesión.");
            }
        },

        // --- Listener Auth ---
        // Este método se asegura de que el estado de autenticación se resuelva
        // y también inicia el listener de mensajes si es necesario.
        async currentUser() {
            // Si ya hay un usuario y se ha procesado, retornamos la promesa resuelta
            if (auth.currentUser && this.userData.uid) return Promise.resolve(auth.currentUser);

            return new Promise((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(auth, user => {
                    unsubscribe(); // Importante: desuscribirse después de la primera llamada
                    if (user) {
                        this.userData = { email: user.email, uid: user.uid, displayName: user.displayName };
                        // NUEVO: Si el usuario es admin, inicia el listener de mensajes si no está activo
                        if (this.isAdminUser(user) && !this._messagesUnsubscribe) {
                            this.startUnreadMessagesListener();
                        }
                        resolve(user);
                    } else {
                        this.userData = { email: null, uid: null, displayName: null };
                        // NUEVO: Si no hay usuario, asegura que el listener de mensajes esté detenido
                        this.stopUnreadMessagesListener(); 
                        resolve(null);
                    }
                }, reject);
            });
        },

        // Este listener se ejecuta constantemente para mantener el estado de autenticación actualizado.
        // También maneja el inicio/detención del listener de mensajes.
        initAuthListener() {
            onAuthStateChanged(auth, user => {
                if (user) {
                    this.userData = { email: user.email, uid: user.uid };
                    // NUEVO: Si el usuario es admin, inicia el listener de mensajes si no está activo
                    if (this.isAdminUser(user) && !this._messagesUnsubscribe) {
                        this.startUnreadMessagesListener();
                    }
                } else {
                    this.userData = { email: null, uid: null, displayName: null };
                    this.googleAccessToken = null;
                    const databaseStore = useDatabaseStore();
                    databaseStore.$reset();
                    // NUEVO: Si no hay usuario, detiene el listener de mensajes
                    this.stopUnreadMessagesListener(); 
                    if (router.currentRoute.value.path !== '/') router.push("/");
                }
                this.loadingAuth = false;
                this.loadingUser = false;
            });
        },

        mensajeAlerta(msg) {
            this.mensaje = msg;
            this.timeOut = true;
            setTimeout(() => this.timeOut = false, 5000);
        },

        // NUEVO: Método para verificar si el usuario es un administrador
        isAdminUser(user) {
            if (!user || !user.email) return false;
            // Asegúrate de que los emails coincidan con tus admins
            return user.email === 'roys.abreu@gmail.com';
        },

        // NUEVO: Acción para iniciar la escucha de mensajes no leídos
        startUnreadMessagesListener() {
            // Si ya hay un listener activo, no hacemos nada para evitar duplicados
            if (this._messagesUnsubscribe) {
                return;
            }
            // Solo iniciar si el usuario actual es un administrador
            if (!this.isAdminUser(auth.currentUser)) { // Usar auth.currentUser para la verificación en tiempo real
                return;
            }

            const messagesCollection = collection(db, 'mensajes');
            const q = query(messagesCollection, where('read', '==', false));

            this._messagesUnsubscribe = onSnapshot(q, (snapshot) => {
                this.unreadMessagesCount = snapshot.size; // El tamaño del snapshot es el número de documentos no leídos
            }, (error) => {
                this.unreadMessagesCount = 0; // Reinicia el contador en caso de error
            });
        },

        // NUEVO: Acción para detener la escucha de mensajes no leídos
        stopUnreadMessagesListener() {
            if (this._messagesUnsubscribe) {
                this._messagesUnsubscribe(); // Llama a la función de desuscripción
                this._messagesUnsubscribe = null;
                this.unreadMessagesCount = 0; // Reinicia el contador al detener la escucha
            }
        },
        
        // --- FUNCION REFINADA: fetchTodayCalendarEvents ---
        async fetchTodayCalendarEvents() {
            this.loadingUser = true;

            const user = await this.currentUser();
            if (!user) {
                console.error("No Firebase user logged in. Cannot call Cloud Function.");
                this.mensajeAlerta("No hay usuario autenticado. Por favor, inicie sesión para ver el calendario.");
                this.googleAccessToken = null;
                this.loadingUser = false;
                return [];
            }

            // Re-adquirir Google Access Token si es necesario
            if (!this.googleAccessToken) {
                const isGoogleAuth = user.providerData.some(p => p.providerId === GoogleAuthProvider.PROVIDER_ID);
                if (isGoogleAuth) {
                    try {
                        const provider = new GoogleAuthProvider();
                        provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');
                        const result = await signInWithPopup(auth, provider);
                        const credential = GoogleAuthProvider.credentialFromResult(result);
                        this.googleAccessToken = credential.accessToken;
                    } catch (error) {
                        console.error("Error al re-adquirir accessToken:", error);
                        this.mensajeAlerta("No se pudo obtener el token de acceso de Google.");
                        this.googleAccessToken = null;
                        this.loadingUser = false;
                        return [];
                    }
                } else {
                    this.mensajeAlerta("Para ver el calendario, por favor, inicia sesión con Google.");
                    this.loadingUser = false;
                    return [];
                }
            }

            if (!this.googleAccessToken) {
                this.mensajeAlerta("No se pudo obtener el token de acceso de Google. Re-inicie sesión.");
                this.loadingUser = false;
                return [];
            }

            // Refrescar token de Firebase
            try {
                await user.getIdToken(true);
            } catch (error) {
                console.error("Error al refrescar Firebase ID Token:", error);
                this.mensajeAlerta("Error al validar la sesión de Firebase.");
                this.googleAccessToken = null;
                this.loadingUser = false;
                return [];
            }

            // Llamada a Cloud Function
            try {
                const functions = getFunctions();
                const getEvents = httpsCallable(functions, 'getTodayCalendarEvents');
                const result = await getEvents({ accessToken: this.googleAccessToken });
                return Array.isArray(result.data) ? result.data : [];
            } catch (error) {
                console.error("Error al obtener eventos:", error);
                this.mensajeAlerta(`Error al cargar eventos: ${error.message || 'Desconocido'}`);
                return [];
            } finally {
                this.loadingUser = false;
            }
        },
        async enviarFactura(file, c) {
            this.loadingUser = true;
            try {
                const cliente = c
                const factura = file[0]
                const facturaNombre = factura.name
                const storageRef = ref(storage, `${cliente}/${facturaNombre}`)
                await uploadBytes(storageRef, factura)
                this.mensajeAlerta("Facture envoyée avec succès!");
            } catch (error) {
                console.error("Error al enviar factura:", error);
                this.mensajeAlerta("Erreur lors de l'envoi de la facture.");
            } finally {
                this.loadingUser = false;
            }
        },
    },
});

