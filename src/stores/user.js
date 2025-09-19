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
import jsPDF from 'jspdf';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        userData: { email: null, uid: null },
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
                this.userData = { email: userCredential.user.email, uid: userCredential.user.uid };
                
                // NUEVO: Inicia la escucha de mensajes si es un administrador
                if (this.isAdminUser(userCredential.user)) {
                    this.startUnreadMessagesListener();
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
            provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');

            try {
                const result = await signInWithPopup(auth, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                this.googleAccessToken = credential.accessToken;
                this.userData = { email: result.user.email, uid: result.user.uid }; // Actualiza userData con el usuario de Google
                
                // NUEVO: Inicia la escucha de mensajes si es un administrador (para Google Sign-In también)
                if (this.isAdminUser(result.user)) {
                    this.startUnreadMessagesListener();
                }

                console.log("DEBUG: googleAccessToken guardado en store después de signIn.");
                router.push('/registro');
            } catch (error) {
                console.error("Error al iniciar sesión con Google:", error);
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
                this.userData = { email: null, uid: null };
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
                        this.userData = { email: user.email, uid: user.uid };
                        // NUEVO: Si el usuario es admin, inicia el listener de mensajes si no está activo
                        if (this.isAdminUser(user) && !this._messagesUnsubscribe) {
                            this.startUnreadMessagesListener();
                        }
                        resolve(user);
                    } else {
                        this.userData = { email: null, uid: null };
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
                    this.userData = { email: null, uid: null };
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
            return user.email === 'higuerodiego@gmail.com' || user.email === 'familiahiguero@gmail.com';
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
                        console.log("DEBUG: Google Calendar accessToken re-adquirido.");
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
                console.log("DEBUG: Llamando a Cloud Function...");
                const result = await getEvents({ accessToken: this.googleAccessToken });
                console.log("DEBUG: Eventos recibidos:", result.data);
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
        crearPDF() {
            var doc = new jsPDF();
            //rect cabecera
            doc.setFillColor(195,228,156)
            doc.rect(10,10,190,20,"F")
            
            // contorno
            doc.setDrawColor(0, 0, 0);
            doc.rect(10, 10, 190, 270);
            
            //text empresa
            doc.setFont("helvetica", "bold");
            doc.text("T O U C A N E T", 40, 20);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Nettoyage des vitres", 41, 25);
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");
            doc.text("FACTURE", 130, 22);
            
            //detalles empresa
            doc.setFontSize(8);
            doc.setFont("helvetica");
            doc.text("Micro - entrepreneur", 15, 42);
            doc.text("Diego Higuero ( EI )", 15, 47);
            doc.text("12 , rue d'Harcet", 15, 52);
            doc.text("64200 Biarritz", 15, 57);
            doc.text("06 58 80 24 03", 15, 62);
            doc.text("toucanet64@gmail.com", 15, 70);
            doc.text("www.toucanet.fr", 15, 77);
            doc.text("N° SIREN : 977686641", 15, 82);
             doc.setFont("helvetica", "normal");
            doc.text("A payer avant le : date de facturation + 6 jour ouvrables ( ou selon accord )", 15, 92);
            doc.text("Adresse de'intervention (si différente de l'adresse de facturation) :", 15, 97);
            // lugar intervencion
             doc.text("Direccion",20,   102);
             doc.text("Ciudad y codigo postal", 20, 107);
             doc.text("Pais", 20, 112);
            
            //DETALLES CLIENTE
            doc.setFillColor(219,219,219)
            doc.rect(140,42,60,7.5,"F")
            doc.rect(140, 42, 60, 15);
            doc.rect(140, 42, 60, 7.5);
            doc.rect(140, 42, 35, 15);
            doc.setFontSize(12);
            doc.text("FACTURE #", 146, 47);
            doc.text("DATE", 182, 47);
            doc.setFontSize(10);
            doc.text("F2024-11-197", 147, 55);
            doc.text("22/11/2024", 180, 55);
            
             doc.setFillColor(195,228,156)
            doc.rect(140,69,60,28,"F")
             doc.setFillColor(219,219,219)
             doc.rect(140,62,60,7.5,"F")
             doc.rect(140, 62, 60, 35);
             doc.rect(140, 62, 60, 7.5);
             doc.setFontSize(10);
             doc.text("FACTURE A", 147, 67);
              doc.setFontSize(8);
             doc.text("Nombre cliente", 147, 75);
             doc.text("Direccion", 147, 80);
             doc.text("Ciudad y codigo postal", 147, 85);
             doc.text("Pais", 147, 90);
             doc.text("correo@electronico", 147, 95);
             
             //DECRIPTION
             doc.setFillColor(219,219,219)
             doc.rect(10,120,190,7.5,"F")
             doc.rect(10, 120, 190, 7.5);
             doc.rect(10, 120, 100, 90);
             doc.rect(10, 120, 125, 90);
             doc.rect(10, 120, 140, 90);
             doc.rect(10, 120, 170, 90);
             doc.rect(10, 120, 170, 90);
             doc.rect(10, 120, 190, 90);
             doc.rect(10, 210, 125, 10);
             doc.rect(10, 210, 170, 10);
             doc.rect(10, 120, 190, 100);
              doc.setFontSize(8);
             doc.text("DESCRIPTION", 15, 125);
             doc.text("DATE", 117, 125);
             doc.text("QTY", 140, 125);
             doc.text("PRIX UNITAIRE HT", 153, 125);
             doc.text("TOTAL HT", 183, 125);
             
             //linea 1
             doc.setFont("helvetica", "normal");
             doc.text("Descripcion 1", 15, 135);
             doc.text("Fecha 1", 116, 135);
             doc.text("qte 1", 142, 135);
             doc.text("prixun 1", 159, 135);
             doc.text("totalht 1", 185, 135);
            
             //linea 2
             doc.text("Descripcion 2", 15, 140);
             doc.text("Fecha 2", 116, 140);
             doc.text("qte 2", 142, 140);
             doc.text("prixun 2", 159, 140);
             doc.text("totalht 2", 185, 140);
             //linea 3
             doc.text("Descripcion 3", 15, 145);
             doc.text("Fecha 3", 116, 145);
             doc.text("qte 3", 142, 145);
             doc.text("prixun 3", 159, 145);
             doc.text("totalht 3", 185, 145);
             //linea 4
             doc.text("Descripcion 4", 15, 150);
             doc.text("Fecha 4", 116, 150);
             doc.text("qte 4", 142, 150);
             doc.text("prixun 4", 159, 150);
             doc.text("totalht 4", 185, 150);
             //linea 5
             doc.text("Descripcion 5", 15, 155);
             doc.text("Fecha 5", 116, 155);
             doc.text("qte 5", 142, 155);
             doc.text("prixun 5", 159, 155);
             doc.text("totalht 5", 185, 155);
             //linea 6
             doc.text("Descripcion 6", 15, 160);
             doc.text("Fecha 6", 116, 160);
             doc.text("qte 6", 142, 160);
             doc.text("prixun 6", 159, 160);
             doc.text("totalht 6", 185, 160);
             //linea 7
             doc.text("Descripcion 7", 15, 165);
             doc.text("Fecha 7", 116, 165);
             doc.text("qte 7", 142, 165);
             doc.text("prixun 7", 159, 165);
             doc.text("totalht 7", 185, 165);
             //linea 8
             doc.text("Descripcion 8", 15, 170);
             doc.text("Fecha 8", 116, 170);
             doc.text("qte 8", 142, 170);
             doc.text("prixun 8", 159, 170);
             doc.text("totalht 8", 185, 170);
             //linea 9
             doc.text("Descripcion 9", 15, 175);
             doc.text("Fecha 9", 116, 175);
             doc.text("qte 9", 142, 175);
             doc.text("prixun 9", 159, 175);
             doc.text("totalht 9", 185, 175);
             //linea 10
             doc.text("Descripcion 10", 15, 180);
             doc.text("Fecha 10", 116, 180);
             doc.text("qte 10", 142, 180);
             doc.text("prixun 10", 159, 180);
             doc.text("totalht 10", 185, 180);
             //linea 11
             doc.text("Descripcion 11", 15, 185);
             doc.text("Fecha 11", 116, 185);
             doc.text("qte 11", 142, 185);
             doc.text("prixun 11", 159, 185);
             doc.text("totalht 11", 185, 185);
             //linea12
             doc.text("Descripcion 12", 15, 190);
             doc.text("Fecha 12", 116, 190);
             doc.text("qte 12", 142, 190);
             doc.text("prixun 12", 159, 190);
             doc.text("totalht 12", 185, 190);
             //linea13
             doc.text("Descripcion 13", 15, 195);
             doc.text("Fecha 13", 116, 195);
             doc.text("qte 13", 142, 195);
             doc.text("prixun 13", 159, 195);
             doc.text("totalht 13", 185, 195);
             //linea14
             doc.text("Descripcion 14", 15, 200);
             doc.text("Fecha 14", 116, 200);
             doc.text("qte 14", 142, 200);
             doc.text("prixun 14", 159, 200);
             doc.text("totalht 14", 185, 200);
             //linea15
             doc.text("Descripcion 15", 15, 205);
             doc.text("Fecha 15", 116, 205);
             doc.text("qte 15", 142, 205);
             doc.text("prixun 15", 159, 205);
             doc.text("totalht 15", 185, 205);
             
             //TOTAL
             doc.setFontSize(10);
             doc.text("Merci beaucoup!", 55, 216);
              doc.setFont("helvetica", "bold");
             doc.text("TOTAL HT", 160, 216);
             doc.text("TOTAL", 185, 216);
             
             //INFO LEGAL
              doc.setFontSize(8);
               doc.setFont("helvetica", "normal");
             doc.text("Tucanet souscrit à une assurance de responsabilité civile professionelle.", 15, 226);
             doc.setFont("helvetica", "bold");
             doc.text("Modalités de règlement :", 15, 231);
              doc.setFont("helvetica", "normal");
             doc.text("Virement bancaire,chèque,espèces.Paiment en une", 48, 231);
             doc.text("seule fois sous 6 jours ouvrables après émission de la facture.", 15, 236);
             doc.text("Titulaire du compte:", 25, 241);
             doc.setFont("helvetica", "italic");
              doc.text("DIEGO HIGUERO RUIZ", 53, 241);
            doc.setFont("helvetica", "normal");
            doc.text("Nom de la banque:", 25, 246);
            doc.setFont("helvetica", "italic");
             doc.text("Caisse d'Epargne", 53, 246);
            doc.setFont("helvetica", "normal");
            doc.text("Code IBAN:", 25, 251);
            doc.setFont("helvetica", "italic");
             doc.text("FR76 1333 5000 4008 0026 8561 397", 53, 251);
            doc.setFont("helvetica", "normal");
            doc.text("RIB:", 25, 256);
            doc.setFont("helvetica", "italic");
             doc.text("13335 00040 08002685613 97", 53, 256);
             doc.setFont("helvetica", "normal");
             doc.text("En cas de retard de paiement, application d'une indemnité forfaite pour frais de" ,15, 265);
             doc.text("recouvrement de 40€ selon", 15, 270);
             doc.setFont("helvetica", "italic");
              doc.text("l'article .441-5 du code du commerce",50, 270);
              
              //TOTLA A PAYER
              doc.rect(135,225,65,15,)
              doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
              doc.text("TOTAL A PAYER TTC :", 140, 232);
                doc.setFontSize(12);
              doc.text("Total", 185, 233);
              doc.setFont("helvetica", "italic");
              doc.setFontSize(7);
              doc.text("TVA non applicable - article 293 B du CGI", 140, 238);
              doc.text("Mediateur de la consommation :", 140, 255);
              doc.text("CM2C cm2c.net", 145, 258);
              doc.text("14 rue Saint-Jean", 145, 261);
              doc.text("75017 Paris", 145, 264);
              doc.text("06 09 20 48 86", 145, 267);
             
            doc.save("pdfName" + '.pdf');
        }
    },
});

