import { defineStore } from 'pinia'
import { reactive } from 'vue'
import dayjs from "dayjs"; // Asegúrate de que dayjs y sus plugins se usan si es necesario
import relativeTime from "dayjs/plugin/relativeTime";

// Importar SOLO del paquete COMPLETO 'firebase/firestore'
import {
    addDoc,
    collection, // <-- Importa collection desde aquí
    deleteDoc,
    doc,
    limit , 
    getDocs,
    query,
    where,
    runTransaction, // <-- Importa runTransaction desde aquí
    serverTimestamp, // <-- Importa serverTimestamp desde aquí
    getDoc, // Para leer el cliente por su referencia
    updateDoc,
    orderBy,
    Timestamp, // Necesario para convertir fechas
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // Para manejar el estado de autenticación
// Si usas Storage, asegúrate de importarlo correctamente
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage'; // Usa alias para ref si usas ref de Vue

import { db, auth } from '../firebaseConfig'; // <-- Verifica que estos son instancias válidas

export const useDatabaseStore = defineStore('database', {
    state: () => ({
        //traemos todo de la base de datos almacenadolos en documents
        documents: [],
        layersEventos: reactive([]),
        filtroMes:[],
        facturasUrl: [],
        loadingDoc: false,
        totalGanancias : 0,
        cotizacion: 0,
        numeroClientes : 0,
        totalNeto : 0,
        interior:false,
        exterior:false,
        lastDay:null,
         // NUEVO Estado para cargar clientes
         limpiezas: [], // Aquí guardaremos los registros de limpieza
        isLoading: false, // Para manejar estados de carga
        error: null, // Para manejar errores
        isDeleting: false, // Estado de carga específico para la eliminación
        deleteError: null, // Estado de error específico para la eliminación
        clientes: [], // Aquí guardaremos la lista de clientes
        isLoadingClientes: false, // Estado de carga para clientes
        errorClientes: null,      // Estado de error para clientes
        isAddingClient: false, // NUEVO: Para manejar el estado de carga al añadir cliente
        addClientError: null,  // NUEVO: Para manejar errores al añadir cliente
        nextFacturaFormatted: 'Calculando...',
    }),
    //acciones modifican los state
    actions: {
    async addLimpieza(limpiezaData) {
      this.isLoading = true;
      this.error = null;
      try {
        // *** CAMBIO CRÍTICO AQUÍ: Llamar a la acción que calcula la factura ***
        // Esto asegura que siempre obtengamos el número de factura más actual.
        await this.fetchNextFacturaFormattedNumber(); 
        const facturaAsignada = this.nextFacturaFormatted;

        // Crea el objeto final que se guardará en Firestore
        const dataToSave = {
          ...limpiezaData,
          factura: facturaAsignada, // Aquí se añade el número de factura
          createdAt: serverTimestamp(), // Usa serverTimestamp() para una fecha de servidor precisa
        };

        const docRef = await addDoc(collection(db, 'limpiezasMensuales'), dataToSave);
        console.log("Documento de limpieza añadido con ID: ", docRef.id, "y factura #", facturaAsignada);

        // Recarga los datos para que la tabla y `nextFacturaFormatted` se actualicen
        // (ya que fetchLimpiezas actualiza `this.limpiezas`, que usa `nextFacturaFormatted` para el cálculo)
        // Puedes pasarle los filtros actuales si los mantienes en el estado del store,
        // o dejarlo sin argumentos para recargar todos los registros si esa es tu preferencia inicial.
        await this.fetchLimpiezas(this.selectedMonth, this.selectedYear); 
        // También puedes limpiar `nuevaLimpieza` en el componente después de esta llamada.

      } catch (e) {
        console.error("Error añadiendo el documento de limpieza: ", e);
        this.error = e;
        throw e; 
      } finally {
        this.isLoading = false;
      }
    },   
    async fetchLimpiezas(month = '', year = '') {
        this.isLoading = true;
        this.error = null;
        try {
            let q = collection(db, 'limpiezasMensuales');

            // Actualiza los filtros en el estado del store para que addLimpieza los use
            this.selectedMonth = month;
            this.selectedYear = year;

            // Lógica de filtrado (si ya la tienes implementada en tu app)
            if (month !== '' && year !== '') {
                // Aquí necesitarías campos en Firestore que representen el mes y el año
                // Por ejemplo, si guardas 'fechaPagoMes' y 'fechaPagoAnio'
                // q = query(q, where('fechaPagoMes', '==', parseInt(month)), where('fechaPagoAnio', '==', parseInt(year)));
                // O si parseas la fecha completa:
                // const startDate = new Date(parseInt(year), parseInt(month), 1);
                // const endDate = new Date(parseInt(year), parseInt(month) + 1, 0, 23, 59, 59, 999);
                // q = query(q, where('fechaPago', '>=', startDate), where('fechaPago', '<=', endDate));
                // Asegúrate de tener los índices necesarios en Firestore para estas consultas.
            } else if (year !== '') {
                // Filtro solo por año
                // const startOfYear = new Date(parseInt(year), 0, 1);
                // const endOfYear = new Date(parseInt(year), 11, 31, 23, 59, 59, 999);
                // q = query(q, where('fechaPago', '>=', startOfYear), where('fechaPago', '<=', endOfYear));
            } else {
                // Por defecto, se trae todo si no hay filtros, o podrías traer solo el año actual.
                // Consulta original:
                // Si el formato de 'factura' siempre garantiza orden cronológico (FYYYY-MM-DD-###),
                // entonces `orderBy('factura', 'desc')` para el más reciente tiene sentido.
                // Aunque para el cálculo del max, es mejor obtener todos y ordenar localmente.
            }
            
            // Para asegurar que nextFacturaFormatted funcione, siempre obtenemos todos los datos
            // o al menos todos los del año/mes para el cálculo preciso.
            const querySnapshot = await getDocs(q);
            this.limpiezas = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => {
                // Ordena por el número secuencial de la factura para un cálculo correcto
                const getFacturaNumber = (facturaString) => {
                    if (!facturaString) return 0;
                    const parts = facturaString.split('-');
                    return parseInt(parts[parts.length - 1], 10) || 0;
                };
                return getFacturaNumber(a.factura) - getFacturaNumber(b.factura);
            });

        } catch (e) {
            this.error = e;
            console.error("Error fetching limpiezas:", e);
        } finally {
            this.isLoading = false;
        }
    },

    // **3. Acción para calcular y guardar el próximo número de factura (sin cambios)**
    async fetchNextFacturaFormattedNumber() {
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');

            const prefix = `F${year}-${month}-`;

            const q = query(
                collection(db, 'limpiezasMensuales'),
                where('factura', '>=', prefix),
                where('factura', '<', prefix + '\uf8ff'),
                orderBy('factura', 'desc'),
                limit(1)
            );

            const querySnapshot = await getDocs(q);
            let nextSequentialNumber = 1;

            if (!querySnapshot.empty) {
                const lastFacturaDoc = querySnapshot.docs[0];
                const lastFactura = lastFacturaDoc.data().factura;
                
                const parts = lastFactura.split('-');
                const currentSequential = parseInt(parts[parts.length - 1], 10);
                
                nextSequentialNumber = currentSequential + 1;
            }

            const formattedSequential = nextSequentialNumber.toString().padStart(3, '0');
            this.nextFacturaFormatted = `${prefix}${formattedSequential}`;
            console.log("Próximo número de factura calculado:", this.nextFacturaFormatted);

        } catch (err) {
            console.error("Error al calcular el próximo número de factura:", err);
            this.nextFacturaFormatted = 'Error al calcular factura';
        }
    },
         async addClient(clientData) {
            this.isAddingClient = true;
            this.addClientError = null;
            try {
                // Prepara los datos para guardar, puedes añadir un timestamp si lo deseas
                const dataToSave = {
                    ...clientData,
                    createdAt: serverTimestamp(), // Opcional: Para registrar cuándo se creó
                };

                // Añade el documento a la colección 'clientes'
                const docRef = await addDoc(collection(db, 'clientes'), dataToSave);
                console.log("Nuevo cliente añadido con ID:", docRef.id);

                // Si quieres, puedes añadir el nuevo cliente a la lista local inmediatamente
                // aunque fetchClientes() se encargará de refrescar la lista al cerrar el modal.
                // this.clientes.push({ id: docRef.id, ...dataToSave, createdAt: new Date() });

            } catch (err) {
                this.addClientError = err;
                console.error("Error al añadir el cliente:", err);
                throw err; // Re-lanza el error para que el componente pueda reaccionar
            } finally {
                this.isAddingClient = false;
            }
        },
        async fetchClientes() {
            this.isLoadingClientes = true;
            this.errorClientes = null;
            try {
                // Aquí asumimos que tienes una colección llamada 'clientes'
                // y que cada documento tiene un campo 'nombre' para el nombre del cliente.
                const clientesQuery = query(collection(db, 'clientes'), orderBy('nombre', 'asc')); // Ordena por nombre
                const querySnapshot = await getDocs(clientesQuery);

                this.clientes = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    nombre: doc.data().nombre || 'Cliente sin nombre' // Asume que el campo se llama 'nombre'
                }));


            } catch (err) {
                this.errorClientes = err;
                console.error("Error fetching clientes:", err);
                this.clientes = [];
            } finally {
                this.isLoadingClientes = false;
            }
        },
        async updateLimpieza(id, updatedData) {
      this.isUpdating = true;
      this.updateError = null;

      try {
        const docRef = doc(db, 'limpiezasMensuales', id);

        // --- IMPORTANTE: MANEJO DE FECHAS Y NÚMEROS AL GUARDAR ---
        // updatedData viene del v-model del modal (strings 'YYYY-MM-DD', null, números, booleanos).
        // Firestore generalmente guarda strings ISO como Timestamps y nulls como nulls.
        // Los números se guardan como números.
        // Asegúrate de que no estás enviando strings vacíos ('') para campos que deberían ser null.
        // Tu componente ya usa `|| null` al preparar `dataToUpdate`, lo cual está bien.

        // No necesitamos convertir manualmente si el componente ya envía null para campos vacíos
        // Si tuvieras problemas de conversión automática, podrías hacer esto:
        // const dataToSave = { ...updatedData };
        // Object.keys(dataToSave).forEach(key => {
        //    if (key.startsWith('semana') || key === 'fechaPago') {
        //        if (dataToSave[key] === '') dataToSave[key] = null; // Convierte cadena vacía a null
        //    }
        //    if (key === 'precioBruto') {
        //       if (dataToSave[key] === null || dataToSave[key] === undefined || dataToSave[key] < 0) dataToSave[key] = null; // Guarda null si es inválido
        //    }
        // });


        await updateDoc(docRef, updatedData); // Usa updatedData si no hiciste conversiones manuales

        console.log("Documento actualizado con ID:", id);

        // En lugar de actualizar localmente, refetch los datos
        // Esto asegura la consistencia con Firestore.
         await this.fetchLimpiezas();

      } catch (err) {
        this.updateError = err;
        console.error("Error updating limpieza:", err);
        throw err;
      } finally {
        this.isUpdating = false;
      }
        },
        async deleteLimpieza(id) {
      this.isDeleting = true; // Inicia el estado de eliminación
      this.deleteError = null; // Limpia errores previos de eliminación

      try {
        // Obtiene una referencia al documento específico por su ID
        const docRef = doc(db, 'limpiezasMensuales', id);

        // Llama a deleteDoc para eliminar el documento en Firestore
        await deleteDoc(docRef);

        console.log("Documento eliminado con ID:", id);

        // --- Actualizar el estado local de Pinia ---
        // Filtra el array para eliminar el documento con el ID dado
        this.limpiezas = this.limpiezas.filter(limpieza => limpieza.id !== id);

      } catch (err) {
        this.deleteError = err; // Registra el error de eliminación
        console.error("Error deleting limpieza:", err);
        throw err; // Re-lanza el error para que el componente que llama lo maneje
      } finally {
        this.isDeleting = false; // Finaliza el estado de eliminación
      }
        },
        getClienteMapa() {
            if (this.eventos.length !== 0) {
                return
            }
            this.loadingDoc = true
            try {
                const q = query(collection(db, 'clientes'))

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            this.layersEventos.push({
                                type: "Feature",
                                properties: {
                                    icon: "marker",
                                },
                                geometry: {
                                    type: "Point",
                                    coordinates: [change.doc.data().ubicacion.lng, change.doc.data().ubicacion.lat],
                                },

                            })
                        }
                        if (change.type === "modified") {
                            const indiceElemento = this.eventos.findIndex(el => el.id == change.doc.id)
                            this.eventos[indiceElemento] = {
                                id: change.doc.id,
                                ...change.doc.data()
                            }
                            this.evento.numAsistentes = change.doc.data().asistentes.length
                            const indiceLayer = this.layersEventos.findIndex(el => el.id == change.doc.id)
                            this.layersEventos[indiceLayer] = {

                                type: "Feature",
                                properties: {
                                    id: change.doc.id,
                                    categoria: change.doc.data().categoria,
                                    codigoPostal: change.doc.data().codigoPostal,
                                    descripcion: change.doc.data().descripcion,
                                    fechaFin: change.doc.data().fechaFin,
                                    fechaInicio: change.doc.data().fechaInicio,
                                    asistentes: change.doc.data().asistentes,
                                    numAsistentes: change.doc.data().asistentes.length,
                                    imagen: change.doc.data().imagen,
                                    titulo: change.doc.data().titulo,
                                    icon: "marker",
                                },
                                geometry: {
                                    type: "Point",
                                    coordinates: [change.doc.data().ubicacion.lng, change.doc.data().ubicacion.lat],
                                },

                            }
                        }
                        if (change.type === "removed") {
                            this.eventos = this.eventos.filter(item => item.id !== change.doc.id)
                        }
                    });
                });
            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDoc = false
            }
        },
        async getClientes() {
            if (this.documents.length !== 0) {
                return;
            }
            this.loadingDoc = true
            try {
                const q = query(collection(db, 'clientes'))
                const querySnapshot = await getDocs(q)
                
                querySnapshot.forEach(doc => {
                    this.totalGanancias = this.totalGanancias + doc.data().precio;
                    //accedemos ala ifo del id y a ladata de ese id
                    
                    const cliente = {
                        id: doc.id,
                        //destructuracion del objeto
                        ...doc.data()
                    };
                   
                    this.documents=[...new Set(cliente)]
                    // this.documents.push({
                    //     id: doc.id,
                    //     //destructuracion del objeto
                    //     ...doc.data()
                    // })
                    
                })
               
                const querySnapshot2 = await getCount(q)

               
               
                    this.cotizacion = ((this.totalGanancias * 23.2)/100).toFixed(2);
                    this.totalNeto = (this.totalGanancias - this.cotizacion).toFixed(2);
               

            } catch (error) {
                console.log(error);
            } finally {
                this.loadingDoc = false
                
            }
        },
        async getRegistro() {
            if (this.registro.length !== 0) {
                return;
            }
            this.loadingDoc = true
            try {
                const q = query(collection(db,'registro'))
                
                
                const querySnapshot = await getDocs(q)
                 querySnapshot.forEach(doc => {
                   
                    // const clienteRegistro = {
                    //     id: doc.id,
                    //     //destructuracion del objeto
                    //     ...doc.data()
                    // };
                   
                    // this.registro=[...new Set(clienteRegistro)]
                    this.registro.push({
                        id: doc.id,
                        //destructuracion del objeto
                        ...doc.data()
                    })
                    
                })
                
                    
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
        async addCliente(apellido, ciudad, codigoPostal, diasLimpieza, direccion, telephone, email, nombre, nombreUsuario, precio,casa, provincia,creacion,coordenadas) {

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
                    casa:casa,
                    provincia: provincia,
                    creacion:creacion,
                    coordenadas:coordenadas,
                    user: auth.currentUser.uid
                };
                const docRef = await addDoc(collection(db, "clientes"), objetoDoc)

            } catch (error) {
                console.log(error);
            } finally {

            }
        },
        async addRegistro(year, mes, clientes) {
            
            try {
                const objetoDoc = {
                    year: year,
                    mes: mes,
                    clientes: [clientes],               
                };
                const docRef = await addDoc(collection(db,"registro"), objetoDoc)

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
        },
        ultimoDia(dia){
            if (dia !== undefined) {
                const lastday = dia.slice(-1)[0].fechaLimp;
                dayjs.extend(relativeTime)
                const date = dayjs(lastday);
                const lastDayFormat = date.format('DD-MM-YYYY')
               const diasFaltan = dayjs(lastDayFormat).from();
               
              return diasFaltan;
            }else{
                return "aun no hay datos"
            }  
             }
    // Puedes añadir más acciones aquí (ej: updateLimpieza, deleteLimpieza)
  },

  getters: {
    // Podrías tener getters si necesitas datos calculados
    // Por ejemplo, para encontrar el próximo número de factura
    
    // Puedes añadir un getter para mostrar los registros ordenados si no los ordenas al cargar/añadir
    // sortedLimpiezas: (state) => { /* lógica de ordenación */ }
  },
       
        }

)