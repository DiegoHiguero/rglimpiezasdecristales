import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    getCount,
    query,
    where,
} from 'firebase/firestore/lite';
import { defineStore } from 'pinia'
import { db } from '../firebaseConfig';
import { auth } from "../firebaseConfig";
import {
    getAuth,
    deleteUser
} from "firebase/auth";
import { toRaw } from "vue";
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export const useDatabaseStore = defineStore('database', {
    state: () => ({
        //traemos todo de la base de datos almacenadolos en documents
        documents: [],
        filtroMes:[],
        facturasUrl: [],
        loadingDoc: false,
        totalGanancias : 0,
        cotizacion: 0,
        numeroClientes : 0,
        totalNeto : 0,
        interior:false,
        exterior:false,
    }),
    //acciones modifican los state
    actions: {
        async getClientes() {
            if (this.documents.length !== 0) {
                return;
            }
            this.loadingDoc = true
            try {
                const q = query(collection(db, 'clientes'))
                const querySnapshot = await getDocs(q)
                
                querySnapshot.forEach(doc => {
                    //accedemos ala ifo del id y a ladata de ese id
                    this.totalGanancias = this.totalGanancias + doc.data().precio;
                    
                    this.documents.push({
                        id: doc.id,
                        //destructuracion del objeto
                        ...doc.data()
                    })
                   
                })
                const querySnapshot2 = await getCount(q)

                this.numeroClientes = querySnapshot2.data().count;
               
                    this.cotizacion = ((this.totalGanancias * 23.2)/100).toFixed(2);
                    this.totalNeto = (this.totalGanancias - this.cotizacion).toFixed(2);
               

            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDoc = false
                
            }
        },
        async getInfoCliente() {
            this.loadingDoc = true
            try {
                const q = query(
                    collection(db, "clientes"),
                    where("user", "==", auth.currentUser.uid))
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach(doc => {
                    //accedemos a la ifo del id y a la data de ese id
                   
                    this.documents.push({
                        id: doc.id,
                        //destructuracion del objeto
                        ...doc.data()

                    })
                    // for (let index = 0; index < doc.data().factura.length; index++) {
                    //     const element = doc.data().factura[index];
                    //     this.facturasUrl.push({ refFactura: element.referencia, nombreFactura: element.nombre })

                    // }
                })
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDoc = false
            }
        },
        async addCliente(apellido, ciudad, codigoPostal, diasLimpieza, direccion, telephone, email, nombre, nombreUsuario, precio, provincia,creacion) {

            try {
                const objetoDoc = {
                    apellido: apellido,
                    ciudad: ciudad,
                    codigoPostal: codigoPostal,
                    diasLimpieza: diasLimpieza,
                    direccion: direccion,
                    telephone: telephone,
                    email: email,
                    nombre: nombre,
                    nombreUsuario: nombreUsuario,
                    precio: precio,
                    provincia: provincia,
                    creacion:creacion,
                    user: auth.currentUser.uid
                };
                const docRef = await addDoc(collection(db, "clientes"), objetoDoc)

            } catch (error) {
                console.log(error);
            } finally {

            }
        },
        async deleteUser(id) {
            const auth = getAuth();
            const user = auth.currentUser;

            try {
                const docRef = doc(db, "clientes", id)
                console.log(docRef);
                await deleteDoc(docRef)
                deleteUser(user)
                //elimina un item de un array, devuelva todo cuando el itm.id coincida con el id que le pasamos
                this.documents = this.documents.filter(item => item.id !== id)
            } catch (error) {
                console.log(error.message);
            } finally {

            }
        },
        async deleteFactura(id){
            try {
                const docRef = doc(db,'clientes',id)
                console.log(docRef);
                await deleteDoc(docRef) 
                console.log(docRef);
            } catch (error) {
                console.log(error);
            }finally{

            }
        }
        }
}
)