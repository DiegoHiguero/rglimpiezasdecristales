import { defineStore } from 'pinia';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    limit,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    getDoc,
    updateDoc,
    // No utilizados en esta versión: runTransaction, Timestamp, onAuthStateChanged (auth handling is in user store)
} from 'firebase/firestore';

// Si usas Storage, asegúrate de importarlo correctamente
// import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';

import { db, auth } from '../firebaseConfig'; // Asegúrate de que auth se importe si es necesario para permisos
import { useUserStore } from './user'; // Importa el user store para permisos


// Extender dayjs para usar from() para fechas relativas
dayjs.extend(relativeTime);

export const useDatabaseStore = defineStore('database', {
    state: () => ({
        // --- ESTADO PARA GESTIÓN DE LIMPIEZAS MENSUALES ---
        limpiezas: [], // Lista principal de registros de limpieza
        nextFacturaFormatted: 'Calculando...', // Próximo número de factura
        
        // Estados de carga y error para operaciones de limpieza
        isLoadingLimpiezas: false, // Carga al obtener limpiezas
        errorLimpiezas: null,     // Errores al obtener limpiezas
        isAddingLimpieza: false,  // Carga al añadir limpieza
        addLimpiezaError: null,   // Errores al añadir limpieza
        isUpdatingLimpieza: false,// Carga al actualizar limpieza
        updateLimpiezaError: null,// Errores al actualizar limpieza
        isDeletingLimpieza: false,// Carga al eliminar limpieza
        deleteLimpiezaError: null,// Errores al eliminar limpieza

        // Filtros actuales para la vista de limpiezas
        selectedMonth: '',
        selectedYear: '',

        // --- ESTADO PARA GESTIÓN DE CLIENTES ---
        clientes: [], // Lista de clientes
        
        // Estados de carga y error para operaciones de clientes
        isLoadingClientes: false, // Carga al obtener clientes
        errorClientes: null,     // Errores al obtener clientes
        isAddingClient: false,   // Carga al añadir cliente
        addClientError: null,    // Errores al añadir cliente
        isUpdatingClient: false, // Carga al actualizar cliente
        updateClientError: null, // Errores al actualizar cliente
        isDeletingClient: false, // Carga al eliminar cliente
        deleteClientError: null, // Errores al eliminar cliente
    }),

    actions: {
        // --- ACCIONES DE LIMPIEZAS MENSUALES ---

        /**
         * Añade un nuevo registro de limpieza a Firestore.
         * Calcula el próximo número de factura y lo asigna.
         * @param {Object} limpiezaData - Datos del registro de limpieza a añadir.
         */
        async addLimpieza(limpiezaData) {
        this.isAddingLimpieza = true;
        this.addLimpiezaError = null;
        try {
            let finalFacturaNumber;

            // 1. Verificar si limpiezaData ya contiene un número de factura (el manual)
            // y si no está vacío o solo con espacios.
            if (limpiezaData.factura && String(limpiezaData.factura).trim() !== '') {
                finalFacturaNumber = String(limpiezaData.factura).trim(); // Usar el número manual
            } else {
                // 2. Si no hay número manual, entonces SÍ, calculamos el siguiente automático.
                await this.fetchNextFacturaFormattedNumber(); // Asegura el número de factura automático
                finalFacturaNumber = this.nextFacturaFormatted; // Usar el número automático
            }

            const dataToSave = {
                ...limpiezaData,
                factura: finalFacturaNumber, // <-- ¡Ahora asigna el número de factura final, ya sea manual o automático!
                createdAt: serverTimestamp(), // Fecha de creación en el servidor
            };

            const docRef = await addDoc(collection(db, 'limpiezasMensuales'), dataToSave);
            console.log("Documento de limpieza añadido con ID: ", docRef.id, "y factura #", finalFacturaNumber);

            // Importante: Después de añadir el documento (con factura manual o automática),
            // necesitamos recalcular el siguiente número automático para futuras adiciones.
            await this.fetchNextFacturaFormattedNumber(); // Re-calcula para la próxima vez

            // Recarga los datos para que la tabla se actualice y el número de factura se recalcule
            // Se pasan los filtros actuales para mantener el contexto
            await this.fetchLimpiezas(this.selectedMonth, this.selectedYear);

        } catch (e) {
            console.error("Error añadiendo el documento de limpieza: ", e);
            this.addLimpiezaError = e;
            throw e; // Re-lanza el error para que el componente lo capture
        } finally {
            this.isAddingLimpieza = false;
        }
    },
      async updatePaymentStatus(limpiezaId, newFechaPago, newFormaPago) {
            this.isUpdatingLimpieza = true; // Usa el estado de carga que ya tienes
            this.updateLimpiezaError = null; // Limpia errores previos

            // --- Chequeo de permisos (para esta operación sensible) ---
            const userStore = useUserStore();
            if (!userStore.userData || (userStore.userData.email !== "higuerodiego@gmail.com" && userStore.userData.email !== "familiahiguero@gmail.com")) {
                console.warn("Firebase Permissions: Attempted to update payment status without admin privileges or valid user.");
                this.updateLimpiezaError = new Error("No tienes permisos suficientes para actualizar el estado de pago.");
                this.isUpdatingLimpieza = false;
                throw this.updateLimpiezaError;
            }
            // --- FIN Chequeo de permisos ---

            try {
                const docRef = doc(db, 'limpiezasMensuales', limpiezaId);
                await updateDoc(docRef, {
                    fechaPago: newFechaPago, // Firestore aceptará null para quitar el campo si newFechaPago es null
                    formaPago: newFormaPago,
                });

                console.log(`Pago para limpieza ${limpiezaId} actualizado en Firestore.`);

                // Refetch todas las limpiezas para asegurar que la lista de pendientes se actualice
                // y el item desaparezca de la vista si se marcó como pagado.
                await this.fetchLimpiezas(this.selectedMonth, this.selectedYear);

            } catch (error) {
                console.error("Error al actualizar el estado de pago en Firestore:", error);
                this.updateLimpiezaError = error;
                throw error; // Re-lanza el error para que el componente pueda manejarlo
            } finally {
                this.isUpdatingLimpieza = false;
            }
        },
        /**
         * Obtiene los registros de limpiezas mensuales de Firestore, aplicando filtros de mes/año.
         * @param {string} month - Mes (0-11) como string, o '' para todos.
         * @param {string} year - Año como string, o '' para todos.
         */
               async fetchLimpiezas(month = '', year = '') {
            this.isLoadingLimpiezas = true;
            this.errorLimpiezas = null;

            const userStore = useUserStore();
            if (!userStore.userData || (userStore.userData.email !== "higuerodiego@gmail.com" && userStore.userData.email !== "roys.abreu@gmail.com")) {
                this.errorLimpiezas = new Error("No tienes permisos suficientes para acceder a la información de limpiezas.");
                this.isLoadingLimpiezas = false;
                return;
            }
            this.selectedMonth = month;
            this.selectedYear = year;

            try {
                let limpiezasRef = collection(db, 'limpiezasMensuales');
                let combinedDocs = new Map(); // Usamos un Map para almacenar documentos únicos por ID

                if (year !== '') {
                    const yearNum = parseInt(year);
                    const monthNum = month !== '' ? parseInt(month) : null;

                    let queryStartDate, queryEndDate;
                    if (monthNum !== null) {
                        queryStartDate = dayjs().year(yearNum).month(monthNum).startOf('month').format('YYYY-MM-DD');
                        queryEndDate = dayjs().year(yearNum).month(monthNum).endOf('month').format('YYYY-MM-DD');
                    } else {
                        // Si solo hay año (mes es '')
                        queryStartDate = dayjs().year(yearNum).startOf('year').format('YYYY-MM-DD');
                        queryEndDate = dayjs().year(yearNum).endOf('year').format('YYYY-MM-DD');
                    }

                    // Consulta 1: Basada en 'fechaPrincipalLimpieza'
                    // Necesitarás un índice compuesto en Firestore para (fechaPrincipalLimpieza ASC, factura DESC)
                    let q1 = query(
                        limpiezasRef,
                        where('fechaPrincipalLimpieza', '>=', queryStartDate),
                        where('fechaPrincipalLimpieza', '<=', queryEndDate),
                        orderBy('fechaPrincipalLimpieza', 'asc'), // Necesario para la consulta de rango
                        orderBy('factura', 'desc') // Orden secundario para la consulta
                    );
                    const snapshot1 = await getDocs(q1);
                    snapshot1.forEach(doc => combinedDocs.set(doc.id, { id: doc.id, ...doc.data() }));

                    // Consulta 2: Basada en 'fechaPago' (solo si hay fecha de pago)
                    // Necesitarás un índice compuesto en Firestore para (fechaPago ASC, factura DESC)
                    let q2 = query(
                        limpiezasRef,
                        where('fechaPago', '>=', queryStartDate),
                        where('fechaPago', '<=', queryEndDate),
                        orderBy('fechaPago', 'asc'), // Necesario para la consulta de rango
                        orderBy('factura', 'desc') // Orden secundario para la consulta
                    );
                    const snapshot2 = await getDocs(q2);
                    snapshot2.forEach(doc => combinedDocs.set(doc.id, { id: doc.id, ...doc.data() }));

                    // Convertir los documentos únicos del Map a un array
                    this.limpiezas = Array.from(combinedDocs.values());

                } else {
                    // Si no hay filtro de mes/año (ambos vacíos), carga todos los registros (comportamiento actual para esta situación)
                    // Si la colección es muy grande, considera limitar esto o forzar un filtro.
                    const qAll = query(limpiezasRef, orderBy('factura', 'desc'));
                    const querySnapshotAll = await getDocs(qAll);
                    this.limpiezas = querySnapshotAll.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                }
                

            } catch (e) {
                this.errorLimpiezas = e;
                console.error("Error fetching limpiezas:", e);
            } finally {
                this.isLoadingLimpiezas = false;
            }
        },
        /**
         * Calcula el próximo número de factura secuencial basado en el mes y año actuales.
         */
        async fetchNextFacturaFormattedNumber() {
            try {
                const now = new Date();
                const year = now.getFullYear();
                const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Mes 1-indexado, con 2 dígitos

                const prefix = `F${year}-${month}-`;

                const q = query(
                    collection(db, 'limpiezasMensuales'),
                    where('factura', '>=', prefix),
                    where('factura', '<', prefix + '\uf8ff'), // Rango para buscar facturas con el prefijo
                    orderBy('factura', 'desc'),
                    limit(1) // Solo necesitamos la última
                );

                const querySnapshot = await getDocs(q);
                let nextSequentialNumber = 1;

                if (!querySnapshot.empty) {
                    const lastFacturaDoc = querySnapshot.docs[0];
                    const lastFactura = lastFacturaDoc.data().factura;

                    // Extrae el número secuencial de la última factura (ej. 'F2023-11-005' -> 5)
                    const parts = lastFactura.split('-');
                    const currentSequential = parseInt(parts[parts.length - 1], 10);

                    nextSequentialNumber = currentSequential + 1;
                }

                // Formatea el número secuencial a 3 dígitos (ej. 1 -> '001')
                const formattedSequential = nextSequentialNumber.toString().padStart(3, '0');
                this.nextFacturaFormatted = `${prefix}${formattedSequential}`;

            } catch (err) {
                console.error("Error al calcular el próximo número de factura:", err);
                this.nextFacturaFormatted = 'Error al calcular factura';
                throw err; // Re-lanza el error
            }
        },

        /**
         * Actualiza un registro de limpieza existente en Firestore.
         * @param {string} id - ID del documento de limpieza a actualizar.
         * @param {Object} updatedData - Datos a actualizar.
         */
        async updateLimpieza(id, updatedData) {
            this.isUpdatingLimpieza = true;
            this.updateLimpiezaError = null;

            try {
                const docRef = doc(db, 'limpiezasMensuales', id);
                await updateDoc(docRef, updatedData);

                console.log("Documento de limpieza actualizado con ID:", id);

                // Re-fetch para asegurar la consistencia de los datos en la tabla
                await this.fetchLimpiezas(this.selectedMonth, this.selectedYear);

            } catch (err) {
                this.updateLimpiezaError = err;
                console.error("Error actualizando limpieza:", err);
                throw err; // Re-lanza el error para que el componente lo maneje
            } finally {
                this.isUpdatingLimpieza = false;
            }
        },

        /**
         * Elimina un registro de limpieza de Firestore.
         * @param {string} id - ID del documento de limpieza a eliminar.
         */
        async deleteLimpieza(id) {
            this.isDeletingLimpieza = true;
            this.deleteLimpiezaError = null;

            try {
                const docRef = doc(db, 'limpiezasMensuales', id);
                await deleteDoc(docRef);

                console.log("Documento de limpieza eliminado con ID:", id);

                // Actualizar estado local: filtrar el array para remover el documento
                this.limpiezas = this.limpiezas.filter(limpieza => limpieza.id !== id);

            } catch (err) {
                this.deleteLimpiezaError = err;
                console.error("Error eliminando limpieza:", err);
                throw err; // Re-lanza el error
            } finally {
                this.isDeletingLimpieza = false;
            }
        },

        // --- ACCIONES DE GESTIÓN DE CLIENTES ---

        /**
         * Añade un nuevo cliente a Firestore.
         * @param {Object} clientData - Datos del cliente a añadir.
         */
        async addClient(clientData) {
            this.isAddingClient = true;
            this.addClientError = null;
            try {
                const dataToSave = {
                    ...clientData,
                    createdAt: serverTimestamp(),
                };
                const docRef = await addDoc(collection(db, 'clientes'), dataToSave);
                console.log("Nuevo cliente añadido con ID:", docRef.id);
            } catch (err) {
                this.addClientError = err;
                console.error("Error al añadir el cliente:", err);
                throw err;
            } finally {
                this.isAddingClient = false;
            }
        },

        /**
         * Obtiene todos los clientes de Firestore.
         */
        async fetchClientes() {
            this.isLoadingClientes = true;
            this.errorClientes = null;
            try {
                const clientesQuery = query(collection(db, 'clientes'), orderBy('nombre', 'asc'));
                const querySnapshot = await getDocs(clientesQuery);

                this.clientes = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
            } catch (err) {
                this.errorClientes = err;
                console.error("Error fetching clientes:", err);
                this.clientes = []; // Limpia la lista en caso de error
            } finally {
                this.isLoadingClientes = false;
            }
        },

        /**
         * Obtiene un cliente específico por su ID.
         * Intenta buscarlo en el estado local primero (caché), luego en Firestore.
         * @param {string} clientId - ID del cliente a buscar.
         * @returns {Object|null} El objeto cliente o null si no se encuentra.
         */
        async fetchClientById(clientId) {
            if (!clientId) {
                console.warn("fetchClientById llamado sin clientId.");
                return null;
            }
            // Intenta encontrarlo en la lista de clientes ya cargados (caché)
            const cachedClient = this.clientes.find(c => c.id === clientId);
            if (cachedClient) {
                return cachedClient;
            }

            // Si no está en caché, ve a Firestore
            try {
                const clientRef = doc(db, 'clientes', clientId);
                const clientSnap = await getDoc(clientRef);
                if (clientSnap.exists()) {
                    console.log(`Cliente ${clientId} encontrado en Firestore.`);
                    const fetchedClient = { id: clientSnap.id, ...clientSnap.data() };
                    // Añade el cliente a la caché local si no estaba
                    this.clientes.push(fetchedClient);
                    return fetchedClient;
                } else {
                    console.log(`No se encontró el cliente con ID: ${clientId}`);
                    return null;
                }
            } catch (error) {
                console.error(`Error al obtener cliente con ID ${clientId}:`, error);
                throw error;
            }
        },

        /**
         * Actualiza un cliente existente en Firestore.
         * @param {string} clientId - ID del cliente a actualizar.
         * @param {Object} clientData - Datos a actualizar.
         */
        async updateClient(clientId, clientData) {
            this.isUpdatingClient = true;
            this.updateClientError = null;
            try {
                const clientRef = doc(db, 'clientes', clientId);
                await updateDoc(clientRef, clientData);

                console.log("Cliente actualizado con ID:", clientId);

                // Actualizar el estado local de clientes después de la actualización exitosa
                const index = this.clientes.findIndex(c => c.id === clientId);
                if (index !== -1) {
                    // Actualiza el objeto en el array, manteniendo la reactividad.
                    this.clientes[index] = { ...this.clientes[index], ...clientData };
                }
            } catch (error) {
                console.error("Error al actualizar cliente:", error);
                this.updateClientError = error;
                throw error;
            } finally {
                this.isUpdatingClient = false;
            }
        },

        /**
         * Elimina un cliente de Firestore.
         * @param {string} clientId - ID del cliente a eliminar.
         */
        async deleteClient(clientId) {
            this.isDeletingClient = true;
            this.deleteClientError = null;
            try {
                const clientRef = doc(db, 'clientes', clientId);
                await deleteDoc(clientRef);

                console.log("Cliente eliminado con ID:", clientId);

                // Eliminar el cliente del estado local
                this.clientes = this.clientes.filter(c => c.id !== clientId);
            } catch (error) {
                console.error("Error al eliminar cliente:", error);
                this.deleteClientError = error;
                throw error;
            } finally {
                this.isDeletingClient = false;
            }
        },

        // --- ACCIONES DE UTILIDAD ---

        /**
         * Calcula los días restantes desde la última fecha de limpieza.
         * @param {Array} dias - Array de objetos con fechas de limpieza.
         * @returns {string} - Cadena de texto indicando el tiempo relativo o "aun no hay datos".
         */
        ultimoDia(dias) {
            if (dias && dias.length > 0) {
                const lastday = dias[dias.length - 1].fechaLimp;
                const date = dayjs(lastday);
                const lastDayFormat = date.format('DD-MM-YYYY');
                return dayjs(lastDayFormat).fromNow(); // Usa fromNow() para tiempo relativo
            } else {
                return "aun no hay datos";
            }
        },
    },

    getters: {
        /**
         * Calcula el total bruto de todas las limpiezas cargadas.
         * @returns {number}
         */
        totalBrutoLimpiezas: (state) => {
            return state.limpiezas.reduce((acc, limpieza) => {
                const bruto = Number(limpieza.precioBruto);
                return acc + (isNaN(bruto) ? 0 : bruto);
            }, 0);
        },
       pendingLimpiezas: (state) => {
            // Filtra las limpiezas que no tienen fechaPago (es decir, null o una cadena vacía)
            return state.limpiezas.filter(limpieza => !limpieza.fechaPago)
                                  .sort((a, b) => {
                                      // Ordena por fechaPrincipalLimpieza, las más antiguas primero
                                      const dateA = a.fechaPrincipalLimpieza ? new Date(a.fechaPrincipalLimpieza) : new Date(0); // Usa new Date(0) para limpiezas sin fecha, poniéndolas al principio
                                      const dateB = b.fechaPrincipalLimpieza ? new Date(b.fechaPrincipalLimpieza) : new Date(0);
                                      return dateA.getTime() - dateB.getTime();
                                  });
        },
          getClientById: (state) => (clientId) => {
            return state.clientes.find(cliente => cliente.id === clientId);
        },
        /**
         * Calcula el total neto de todas las limpiezas cargadas.
         * Aplica un cálculo del 23.2% de cotización.
         * @returns {number}
         */
        totalNetoLimpiezas: (state) => {
            return state.limpiezas.reduce((acc, limpieza) => {
                const bruto = Number(limpieza.precioBruto);
                if (isNaN(bruto)) return acc;
                const cotizacion = bruto * 0.232;
                return acc + (bruto - cotizacion);
            }, 0);
        },

        /**
         * Calcula la cotización total de todas las limpiezas cargadas.
         * @returns {number}
         */
        totalCotizacionLimpiezas: (state) => {
            return state.limpiezas.reduce((acc, limpieza) => {
                const bruto = Number(limpieza.precioBruto);
                return acc + (isNaN(bruto) ? 0 : bruto * 0.232);
            }, 0);
        },

        /**
         * Determina si alguna operación (añadir, actualizar, eliminar) está en curso.
         * @returns {boolean}
         */
        isProcessing: (state) => {
            return state.isLoadingLimpiezas || state.isAddingLimpieza || state.isUpdatingLimpieza || state.isDeletingLimpieza ||
                   state.isLoadingClientes || state.isAddingClient || state.isUpdatingClient || state.isDeletingClient;
        },
        
        /**
         * Combina todos los errores activos en un solo objeto o null.
         * Útil para mostrar un mensaje de error general.
         */
        hasError: (state) => {
            return state.errorLimpiezas || state.addLimpiezaError || state.updateLimpiezaError || state.deleteLimpiezaError ||
                   state.errorClientes || state.addClientError || state.updateClientError || state.deleteClientError || null;
        }
    },
});
