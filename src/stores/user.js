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
        modalActive: true,
        cookie: false,
        loadingUser: false,
        loadingSesion: false,
        mensaje: null,
        timeOut: false,
        selectedDate: dayjs(),
        currentDate: 0,
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
        crearPDF( cliente) {
            const clienteNombre = cliente.nombre
            const clienteDireccion = cliente.direccion
            const clienteCiudad = cliente.ciudad
            const clienteCodigoPostal = cliente.codigoPostal
            const descripcion1 = "limpieza interior y exterior de cristales"
            const fecha1 = "22/11/2024"
            const qte1 = "1"
            const prixun1 = cliente.precio
            const totalht1 = cliente.precio
            
            
            var doc = new jsPDF();
            //rect cabecera
            doc.setFillColor(195, 228, 156)
            doc.rect(10, 10, 190, 20, "F")

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
            doc.text("Direccion", 20, 102);
            doc.text("Ciudad y codigo postal", 20, 107);
            doc.text("Pais", 20, 112);

            //DETALLES CLIENTE
            doc.setFillColor(219, 219, 219)
            doc.rect(140, 42, 60, 7.5, "F")
            doc.rect(140, 42, 60, 15);
            doc.rect(140, 42, 60, 7.5);
            doc.rect(140, 42, 35, 15);
            doc.setFontSize(12);
            doc.text("FACTURE #", 146, 47);
            doc.text("DATE", 182, 47);
            doc.setFontSize(10);
            doc.text("F2024-11-197", 147, 55);
            doc.text("22/11/2024", 180, 55);

            doc.setFillColor(195, 228, 156)
            doc.rect(140, 69, 60, 28, "F")
            doc.setFillColor(219, 219, 219)
            doc.rect(140, 62, 60, 7.5, "F")
            doc.rect(140, 62, 60, 35);
            doc.rect(140, 62, 60, 7.5);
            doc.setFontSize(10);
            doc.text("FACTURE A", 147, 67);
            doc.setFontSize(8);
            doc.text(clienteNombre, 147, 75);
            doc.text(clienteDireccion, 147, 80);
            doc.text(clienteCodigoPostal +" " + clienteCiudad, 147, 85);
            doc.text("Pais", 147, 90);
            doc.text("correo@electronico", 147, 95);

            //DECRIPTION
            doc.setFillColor(219, 219, 219)
            doc.rect(10, 120, 190, 7.5, "F")
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
            doc.text(descripcion1 , 15, 135);
            doc.text(fecha1, 116, 135);
            doc.text(qte1, 142, 135);
            doc.text(prixun1 +"€", 159, 135);
            doc.text(totalht1 +"€", 185, 135);

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
            doc.text("En cas de retard de paiement, application d'une indemnité forfaite pour frais de", 15, 265);
         
          
           
            //DECRIPTION
            doc.setFillColor(219, 219, 219)
            doc.setFillColor(219, 219, 219)
            doc.rect(10, 120, 190, 7.5, "F")
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
       
            //TOTLA A PAYER
            doc.rect(135, 225, 65, 15,)
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

            doc.save(clienteNombre + '.pdf');
        }
    },

})

