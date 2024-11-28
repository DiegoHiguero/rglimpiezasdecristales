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
        loadingSesion: false,
        mensaje: null,
        timeOut: false,
        selectedDate: dayjs(),
        currentDate: 0,
        contador: 0,
        ano: "",
        mes: "",
        dia: "",
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
        crearPDF(cliente, descripcion, cant, preciou, importe, fecha, numfactura) {
            const date = dayjs(fecha.value);
            const fechaEs = date.format('DD-MM-YYYY');
            const clienteNombre = cliente.nombre
            const clienteDireccion = cliente.direccion
            const clienteCiudad = cliente.ciudad
            const clienteCodigoPostal = cliente.codigoPostal
            const prixun1 = cliente.precio
            const totalht1 = cliente.precio
            var parrafoDescripcion = 116
            var parrafoCant = 116
            var parrafoPreciou = 116
            var parrafoImporte = 116
            var subTotal=0
            var iva = 0
            var total = 0

            var doc = new jsPDF();
            doc.addImage("https://roysabreulimpiezas.web.app/assets/logorglimpiezas-a2c3e8a5.png","PNG", 20, 30, 65, 17);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.text("FACTURA", 150, 37);
            doc.setFontSize(15);
            doc.setTextColor("green");
            doc.setFont("helvetica", "bold");
            doc.text("EXPEDIDA A: ", 20, 70);
            doc.text("FACT#: ", 130, 70);
            doc.text("FECHA:", 130, 77);
            doc.setTextColor("black");
            doc.setFontSize(15);
            doc.text(numfactura, 165, 70);
            doc.text(fechaEs, 160, 77);
            doc.setFont("helvetica", "normal");
            doc.setTextColor("black");
            doc.setFontSize(10);
            doc.text(clienteNombre, 20, 80);
            doc.text("Nombrecliente ", 20, 86);
            doc.text(clienteDireccion, 20, 92);

            //DESCRIPCION
            doc.setDrawColor(93, 204, 71);
            doc.rect(20, 100, 170, 18,)
            doc.rect(20, 125, 170, 9,)
            doc.rect(20, 140, 170, 9,)
            doc.rect(20, 155, 170, 9,)
            doc.rect(20, 170, 170, 9,)
            doc.setFillColor(55, 120, 42)
            doc.rect(20, 100, 170, 9, "F")
            doc.setTextColor("white");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text("Descripción de servicio  ", 35, 106);
            doc.text("Cant.", 110, 106);
            doc.text("Precio u.", 140, 106);
            doc.text("Importe", 170, 106);
            doc.setTextColor("black");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            descripcion.forEach(desc => {

                doc.text(desc, 25, parrafoDescripcion);
                parrafoDescripcion = parrafoDescripcion + 15

            });
            cant.forEach(cantidad => {

                doc.text(cantidad.toString(), 115, parrafoCant);
                parrafoCant = parrafoCant + 15

            });
            preciou.forEach(precioUni => {

                doc.text(precioUni.toString() + " €", 145, parrafoPreciou);
                parrafoPreciou = parrafoPreciou + 15

            });
            importe.forEach(impor => {

                doc.text(impor.toString() + " €", 175, parrafoImporte);
                parrafoImporte = parrafoImporte + 15
                subTotal = subTotal + impor
                iva = (subTotal*21)/100
                total = subTotal+iva
            });

            //DATOS DE PAGO
            doc.setTextColor("green");
            doc.setFont("helvetica", "bold");
            doc.text("DATOS DE PAGO", 20, 190);
            doc.setFontSize(10);
            doc.setTextColor("black");
            doc.setFont("helvetica", "normal");
            doc.text("DNI: 50349726-N", 25, 195);
            doc.text("N/C: ROYS GREGORY ABREU REINOSO", 25, 200);
            doc.text("DNI: 50349726-N", 25, 205);
            //TOTAL

            doc.text("IVA", 130, 195);
            doc.text(subTotal.toString()+ " €", 177, 185);
            doc.text(iva.toString()+ " €", 177, 195);
            doc.setFont("helvetica", "bold");
            doc.text(total.toString()+ " €", 177, 205);
            doc.setDrawColor(93, 204, 71);
            doc.setFillColor(55, 120, 42)
            doc.rect(140, 179, 25, 9, "F")
            doc.rect(140, 189, 50, 9, "D")
            doc.rect(140, 189, 25, 9, "F")
            doc.rect(140, 199, 50, 9, "D")
            doc.rect(140, 199, 25, 9, "F")
            doc.setFontSize(12);
            doc.setTextColor("white");
            doc.text("Subtotal", 145, 185);
            doc.text("21,00%", 146, 195);
            doc.text("TOTAL", 145, 205);

            //CONTACTO
            doc.setFontSize(10);
            doc.setTextColor("black");
            doc.setFont("helvetica", "normal");
            doc.text("696 16 94 35", 25, 230);
            doc.text("roys.abreu@hotmail.com", 25, 235);
            doc.text("www.rglimpiezaprofesional.com", 25, 240);
            doc.text("Av. segunda republica,17 1d 28905 (Madrid)", 25, 245);
            doc.setFontSize(7);
            doc.setTextColor("gray");
            doc.setFont("helvetica", "italic");
            doc.text("Nota: todas las facturas se emiten con fecha 28 de cada mes,independientemente del dia de pago.", 80, 255);
            doc.text("Agradecemos su confianza. Atentamente,Un servidor. ", 130, 260);

            doc.save(clienteNombre + fechaEs + '.pdf');
        }
    },

})

