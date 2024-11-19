import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { defineStore } from "pinia";
import { auth, db, storage } from "../firebaseConfig";
import dayjs from "dayjs";
import router from "../router";
import { useDatabaseStore } from "./database";
import { computed } from "@vue/reactivity"
import jsPDF from 'jspdf'

//importamos la tienda, definimos la tienda poninedole un nombre, 
//ponemos export (nombrado) para poder usarlo




export const useUserStore = defineStore('userStore', {
    state: () => ({

        userData: {
            email: null,
            uid: null,
        },
        facturas: [],
        isActive: false,
        modalActive:true,
        cookie: false,
        loadingUser: false,
        loadingSesion: false,
        mensaje: null,
        timeOut: false,
        selectedDate: dayjs(),
        currentDate: 0,
        ano:"",
        mes:"",
        dia:"",
        day: 0,
        today: dayjs().format("YYYY-MM-DD"),
        weekdays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        day: {
            type: Object,
            required: true
        },
        isCurrentMonth: {
            type: Boolean,
            default: false
        },
        isToday: {
            type: Boolean,
            default: false
        }
    }),
    actions: {
        label() {
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
        mensajeAlerta(mensajeAlerta) {
            this.mensaje = mensajeAlerta
            this.timeOut = true
            setTimeout(() => this.timeOut = false, 5000)
        },
        async registerUser(email, password) {
            this.loadingUser = true
            try {
                const { user } = await createUserWithEmailAndPassword(auth, email, password)
                //   this.userData = {email:user.email,uid:user.uid}
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingUser = false
            }
        },
        async loginUser(email, password) {
            this.loadingUser = true
            try {
                const { user } = await signInWithEmailAndPassword(auth, email, password)
                this.userData = { email: user.email, uid: user.uid }
            } catch (error) {
                console.log(error.message);
                if (error.message === "Firebase: Error (auth/wrong-password).") {
                }
                if (error.message === "Firebase: Error (auth/user-not-found).") {
                    this.mensajeAlerta("Désolé, l'utilisateur n'est pas régistré")
                }
                if (error.message === "Firebase: Error (auth/network-request-failed)." || error.message === "Firebase: Error (auth/internal-error).") {
                    this.mensajeAlerta("Por favor compruebe su conexion a internet")

                }
            } finally {
                this.loadingUser = false
            }
        },
        async logOutUser() {
            const databaseStore = useDatabaseStore()
            databaseStore.$reset()
            try {
                await signOut(auth)
                this.userData = { email: null, uid: null, facturas: null }
                this.facturas = []
                router.push("/")
            } catch (error) {
                console.log(error);
            }
        },
        currentUser() {
            return new Promise((resolve, reject) => {
                const unsuscribe = onAuthStateChanged(auth, user => {
                    if (user) {
                        this.userData = { email: user.email, uid: user.uid }
                    } else {
                        this.userData = { email: null, uid: null }
                        const databaseStore = useDatabaseStore()
                        databaseStore.$reset()
                    }
                    resolve(user)
                }, e => reject(e))
                unsuscribe()
            })
        },
        async enviarFactura(file, c) {
            const cliente = c
            const factura = file[0]
            const facturaNombre = factura.name
            const storageRef = ref(storage, `${cliente}/${facturaNombre}`)
            await uploadBytes(storageRef, factura)

        },
        crearPDF(firmas,cliente) {
            const clienteNombre = cliente.nombre
            var doc = new jsPDF();
            doc.setFontSize(20);
            doc.text("Limpiezas mes de noviembre 2024 " + clienteNombre, 20, 25);
            firmas.forEach((firma) => doc.addImage(firma, "JPEG", 15, 40, 80, 55));
          doc.addImage("https://firebasestorage.googleapis.com/v0/b/roys-web-page.appspot.com/o/QUATRO-2024-11-20?alt=media&token=e30c404f-138b-4fc8-860c-3cd7ddffe0e7", "JPEG", 15, 40, 80, 55);
           
            doc.save(clienteNombre + '.pdf');
        }
    },

})

