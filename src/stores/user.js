import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider, // Importamos el proveedor de Google
    signInWithPopup     // Importamos el método para el pop-up de inicio de sesión
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { defineStore } from "pinia";
import { auth, db, storage,functions } from "../firebaseConfig";
import dayjs from "dayjs";
import router from "../router"; // El router ya está importado, ¡excelente!
import { useDatabaseStore } from "./database";
import { computed } from "@vue/reactivity"
import jsPDF from 'jspdf';
import { getFunctions, httpsCallable } from 'firebase/functions';


export const useUserStore = defineStore('userStore', {
    state: () => ({
        userData: {
            email: null,
            uid: null,
        },
         googleAccessToken: null, 
        facturas: [],
        descripciones: [
            {
                descripcion: "",
                cant: "",
                preciou: "",
                importe: "",
            },
        ],
        isActive: false,
        modalActive: true,
        cookie: false,
        loadingUser: false,
        loadingAuth: true, 
        // loadingSesion: false, // Este estado es probablemente redundante con loadingUser
        mensaje: null,
        mensajeColorAlerta: null,
        timeOut: false,
        selectedDate: dayjs(),
        currentDate: 0,
        ano: "",
        mes: "",
        dia: "",
        day: 0, // Nota: Este 'day' podría entrar en conflicto si intentas usarlo como un objeto 'day' para calendario.
        today: dayjs().format("YYYY-MM-DD"),
        weekdays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        // Estos son típicamente 'props' de un componente, no estados de Pinia. Los he comentado
        // para evitar posibles conflictos o malinterpretaciones en el store global.
        // day: { type: Object, required: true },
        // isCurrentMonth: { type: Boolean, default: false },
        // isToday: { type: Boolean, default: false }
    }),
    actions: {
        // Métodos relacionados con el calendario. Si tienes un componente de calendario
        // o un store dedicado a ello, estos métodos encajarían mejor allí.
        label() {
            // Asegúrate de que `this.day` sea un objeto con una propiedad `date` aquí
            // para que esto funcione correctamente.
            return dayjs(this.day.date).format("D");
        },
        days() {
            return [
                { date: "2020-06-29", isCurrentMonth: false },
                { date: "2020-06-30", isCurrentMonth: false },
                { date: "2020-07-01", isCurrentMonth: true },
                { date: "2020-07-02", isCurrentMonth: true },
                { date: "2020-07-31", isCurrentMonth: true },
                { date: "2020-08-01", isCurrentMonth: false },
                { date: "2020-08-02", isCurrentMonth: false }
            ];
        },
        selectedMonth() {
            return this.selectedDate.format("MMMM YYYY");
        },
        selectPrevious() {
            this.selectedDate = dayjs(this.selectedDate).subtract(1, "month");
        },
        selectCurrent() {
            this.selectedDate = dayjs();
        },
        selectNext() {
            this.selectedDate = dayjs(this.selectedDate).add(1, "month");
        },
        // Fin de métodos relacionados con el calendario.

        mensajeAlerta(mensajeAlerta) {
            this.mensaje = mensajeAlerta
            this.timeOut = true
            setTimeout(() => this.timeOut = false, 5000)
        },
        async registerUser(email, password) {
            this.loadingUser = true
            this.timeOut = false; // Resetear mensajes anteriores
            this.mensaje = null;
            try {
                // `onAuthStateChanged` (en `initAuthListener`) se encargará de establecer `userData` y la redirección
                await createUserWithEmailAndPassword(auth, email, password)
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
                        break;
                }
            } finally {
                this.loadingUser = false
            }
        },
        async loginUser(email, password) {
            this.loadingUser = true
            this.timeOut = false; // Resetear mensajes anteriores
            this.mensaje = null;
            try {
                // `onAuthStateChanged` (en `initAuthListener`) se encargará de establecer `userData` y la redirección
                await signInWithEmailAndPassword(auth, email, password)
            } catch (error) {
                console.error("Error en loginUser:", error); // Usar console.error para errores
                this.timeOut = true;
                switch (error.code) {
                    case "auth/wrong-password":
                        this.mensaje = "Mot de passe incorrect.";
                        break;
                    case "auth/user-not-found":
                        this.mensaje = "Désolé, l'utilisateur n'est pas enregistré.";
                        break;
                    case "auth/invalid-email":
                        this.mensaje = "Email invalide.";
                        break;
                    case "auth/network-request-failed":
                    case "auth/internal-error":
                        this.mensaje = "Veuillez vérifier votre connexion Internet.";
                        break;
                    case "auth/too-many-requests":
                        this.mensaje = "Trop de tentatives de connexion échouées. Veuillez réessayer plus tard.";
                        break;
                    default:
                        this.mensaje = "Une erreur est survenue lors de la connexion.";
                        break;
                }
            } finally {
                this.loadingUser = false
            }
        },

        // ¡NUEVA ACCIÓN: Iniciar sesión con Google!
          async signInWithGoogle() {
            this.loadingUser = true;
            this.timeOut = false;
            this.mensaje = null;

            const provider = new GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');

            try {
                const result = await signInWithPopup(auth, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                // ¡IMPORTANTE! Guardar el accessToken aquí, inmediatamente después del inicio de sesión
                this.googleAccessToken = credential.accessToken;
                console.log("DEBUG: googleAccessToken guardado en store después de signIn.");

            } catch (error) {
                console.error("Error al iniciar sesión con Google:", error);
                this.timeOut = true;
                this.googleAccessToken = null; // Asegúrate de limpiarlo si falla
                switch (error.code) {
                    case "auth/popup-closed-by-user":
                        this.mensaje = "La ventana de conexión Google a été fermée.";
                        break;
                    case "auth/cancelled-popup-request":
                        this.mensaje = "La demande de connexion Google a été annulée.";
                        break;
                    case "auth/operation-not-allowed":
                        this.mensaje = "L'authentification Google n'est pas activée pour ce projet.";
                        break;
                    default:
                        this.mensaje = "Une erreur est survenue lors de la connexion avec Google.";
                        break;
                }
            } finally {
                this.loadingUser = false;
            }
        },

        async logOutUser() {
            const databaseStore = useDatabaseStore()
            databaseStore.$reset() // Limpia los datos de la base de datos al cerrar sesión
            try {
                await signOut(auth)
                // `onAuthStateChanged` (en `initAuthListener`) se encargará de establecer `userData` a null y la redirección.
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
                this.mensajeAlerta("Une erreur est survenue lors de la déconnexion.");
            }
        },

        // **REFRACTORIZADO:** Este es ahora el listener principal de Firebase Authentication.
        // Debe llamarse una vez al inicio de tu aplicación (ej. en main.js o App.vue).
           // **ESTA ACCIÓN ES LA QUE FALTA O ESTÁ MAL ESCRITA**
        async currentUser() {
            // Si ya hay un usuario autenticado en Firebase Auth Y tenemos sus datos básicos en el store,
            // podemos resolver inmediatamente con el objeto de usuario REAL de Firebase.
            if (auth.currentUser && this.userData.uid) {
                return Promise.resolve(auth.currentUser); // ¡Esto es clave! Devuelve el objeto User real.
            }

            // Si no hay usuario autenticado o si this.userData aún no está cargado,
            // esperamos a que Firebase determine el estado de autenticación.
            return new Promise((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(auth, user => {
                    unsubscribe(); // Desuscribirse después de obtener el estado inicial
                    if (user) {
                        // Si hay un usuario, actualizamos los datos básicos en el store
                        this.userData = { email: user.email, uid: user.uid };
                        resolve(user); // Y resolvemos con el objeto User real.
                    } else {
                        // Si no hay usuario, limpiamos los datos del store
                        this.userData = { email: null, uid: null };
                        resolve(null); // Y resolvemos con null.
                    }
                }, reject); // Añade reject para capturar errores de Firebase Auth
            });
        },

        // **Asegúrate de que initAuthListener sea como la última versión que te di**
            initAuthListener() {
            onAuthStateChanged(auth, user => {
                if (user) {
                    // Si hay un usuario logueado
                    if (user.email === "higuerodiego@gmail.com") {
                        // Es el usuario permitido, actualizamos los datos y redirigimos
                        this.userData = { email: user.email, uid: user.uid };
                        if (router.currentRoute.value.path !== '/registro') {
                            router.push('/registro');
                        }
                    } else {
                        // Si es CUALQUIER OTRO USUARIO, lo desconectamos inmediatamente
                        this.mensajeAlerta("Accès non autorisé pour cet utilisateur.");
                        this.logOutUser(); // Llama a tu acción de logout
                        // Redirigir a la página de inicio/login
                        if (router.currentRoute.value.path !== '/') {
                             router.push('/');
                        }
                    }
                } else {
                    // Si NO hay usuario logueado
                    this.userData = { email: null, uid: null };
                    // Limpiar datos de la base de datos si el usuario no está logueado
                    const databaseStore = useDatabaseStore();
                    databaseStore.$reset();
                    // Redirigir a la página de inicio/login si no estamos ya allí
                    if (router.currentRoute.value.path !== '/') {
                        router.push("/");
                    }
                }
                this.loadingAuth = false; // Indica que el estado de autenticación inicial se ha cargado
                this.loadingUser = false;
            });
        },
             async fetchTodayCalendarEvents() {
        this.loadingUser = true;

        const user = await this.currentUser();

        if (!user) { // No hay usuario Firebase logueado
            console.error("Client-side: No Firebase user logged in after waiting for auth state. Cannot call Cloud Function.");
            this.mensajeAlerta("No hay usuario autenticado. Por favor, inicie sesión para ver el calendario.");
            this.googleAccessToken = null;
            this.loadingUser = false;
            return [];
        }

        // --- Lógica para el googleAccessToken ---
        if (!this.googleAccessToken) { // Si el accessToken de Google Calendar no está en el store
            const isGoogleAuth = user.providerData.some(p => p.providerId === GoogleAuthProvider.PROVIDER_ID);

            if (isGoogleAuth) { // Si el usuario de Firebase SÍ inició sesión con Google
                console.warn("DEBUG: Usuario de Firebase autenticado (con Google), pero Google Calendar accessToken no presente. Intentando re-adquirirlo silenciosamente...");
                try {
                    // Intenta re-autenticar con Google para obtener un nuevo access token.
                    // Esto suele funcionar si el usuario ya tiene una sesión de Google activa en el navegador.
                    const provider = new GoogleAuthProvider();
                    provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');
                    // Opcional: provider.setCustomParameters({ prompt: 'none' }); - A veces necesario, a veces causa problemas. Prueba sin él primero.

                    const result = await signInWithPopup(auth, provider); // Vuelve a llamar a signInWithPopup
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    this.googleAccessToken = credential.accessToken; // ¡Guarda el nuevo token!
                    console.log("DEBUG: Google Calendar accessToken re-adquirido exitosamente.");

                } catch (error) {
                    console.error("DEBUG: Fallo al re-adquirir Google Calendar accessToken silenciosamente:", error);
                    // Manejo de errores específicos (pop-up bloqueado, usuario canceló, etc.)
                    if (error.code === 'auth/popup-blocked') {
                        this.mensajeAlerta("Tu navegador ha bloqueado una ventana emergente necesaria para conectar el calendario. Por favor, habilita las ventanas emergentes para este sitio e intenta de nuevo.");
                    } else if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
                        this.mensajeAlerta("La ventana de autenticación de Google fue cerrada. No se pudo obtener acceso al calendario.");
                    } else {
                        this.mensajeAlerta("Error al obtener el token de acceso de Google. Por favor, re-inicie sesión con Google.");
                    }
                    this.googleAccessToken = null; // Asegúrate de que el token sea nulo si falla la adquisición
                    this.loadingUser = false;
                    return []; // Sale si no se pudo re-adquirir
                }
            } else { // Si el usuario de Firebase NO inició sesión con Google
                console.warn("DEBUG: Usuario de Firebase autenticado (no con Google), Google Calendar accessToken no presente. Requiere inicio de sesión con Google.");
                this.mensajeAlerta("Para ver el calendario, por favor, inicia sesión con Google.");
                this.loadingUser = false;
                return []; // Sale si no se requiere Google auth para este usuario
            }
        }

        // Si llegamos aquí, this.googleAccessToken debería estar presente (o se acaba de adquirir)
        if (!this.googleAccessToken) { // Doble verificación por si acaso
            this.mensajeAlerta("No se pudo obtener el token de acceso de Google. Por favor, re-inicie sesión.");
            this.loadingUser = false;
            return [];
        }

        // --- Refrescar el token de Firebase ID (tu código actual) ---
        try {
            await user.getIdToken(true);
            console.log("DEBUG: Firebase ID Token refrescado/validado para la llamada a Cloud Function.");
        } catch (error) {
            console.error("DEBUG: Error al refrescar el token de Firebase ID:", error);
            this.mensajeAlerta("Error al validar la sesión de Firebase. Por favor, reinicie la sesión.");
            this.googleAccessToken = null;
            this.loadingUser = false;
            return [];
        }

        // --- Llamar a la Cloud Function (tu código actual) ---
        try {
            const functions = getFunctions();
            const getEvents = httpsCallable(functions, 'getTodayCalendarEvents');

            console.log("DEBUG: Llamando a la Cloud Function 'getTodayCalendarEvents' con el token de acceso de Google...");
            const result = await getEvents({ accessToken: this.googleAccessToken });

            console.log("DEBUG: Eventos de calendario recibidos:", result.data);

            return Array.isArray(result.data) ? result.data : [];

        } catch (error) {
            console.error("DEBUG: Error al obtener eventos del calendario en userStore:", error);

            const errorCode = error.code || 'unknown-error';
            const errorMessage = error.message || 'Error desconocido al cargar eventos del calendario.';

            this.mensajeAlerta(`Error al cargar eventos del calendario: ${errorMessage} (${errorCode})`);

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
})
