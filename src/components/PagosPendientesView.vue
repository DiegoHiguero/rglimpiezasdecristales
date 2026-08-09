<template>
  <div class="container-flex ">
    <h2 class="mb-4 bg-white p-4 text-center">Pagos Pendientes</h2>

    <!-- Mensajes de estado -->
    <div v-if="databaseStore.isLoadingLimpiezas" class="alert alert-info">
      Cargando pagos pendientes...
    </div>
    <div v-else-if="databaseStore.errorLimpiezas" class="alert alert-danger">
      Error al cargar los pagos: {{ databaseStore.errorLimpiezas.message }}
    </div>
    <div v-else-if="databaseStore.pendingLimpiezas.length === 0" class="alert alert-warning">
      ¡Felicidades! No hay pagos pendientes en este momento.
    </div>

    <!-- Tabla de pagos pendientes -->
    <div v-else class="card mt-4">
      <div class="card-header">
        <h3>Lista de Pagos Pendientes ({{ databaseStore.pendingLimpiezas.length }})</h3>
      </div>
      <div class="card-body">
        <!-- Mensajes de estado de actualización -->
        <div class="alert alert-info" v-if="databaseStore.isUpdatingLimpieza">Guardando cambios...</div>
        <div class="alert alert-danger" v-if="databaseStore.updateLimpiezaError">
            Error al guardar: {{ databaseStore.updateLimpiezaError.message }}
        </div>

        <div class="table-responsive">
          <table class="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Factura #</th>
                <th>Cliente</th>
                <th>Fecha Inicio Limpieza</th>
                <th>Días Pendiente</th>
                <th>Monto Bruto (€)</th>
                <th>Monto Neto (€)</th> <!-- Nueva columna -->
                <th>IVA (€)</th> <!-- Nueva columna -->
                <th>Fecha de Pago (Registro)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="limpieza in databaseStore.pendingLimpiezas" :key="limpieza.id">
                <td>{{ limpieza.factura }}</td>
                <td>{{ getClientName(limpieza.clienteId) }}</td>
                <td>{{ formatEuropeanDate(limpieza.fechaPrincipalLimpieza) }}</td>
                <td>
                  <span :class="{'text-danger fw-bold': calculateDaysPending(limpieza.fechaPrincipalLimpieza) > 30}">
                    {{ calculateDaysPending(limpieza.fechaPrincipalLimpieza) }} días
                  </span>
                </td>
                <td>{{ formatCurrency(limpieza.precioBruto) }}</td>
                <!-- Valores para las nuevas columnas -->
                <td>{{ formatCurrency(calculatePrecioNeto(limpieza.precioBruto)) }}</td>
                <td>{{ formatCurrency(calculateCotizacion(limpieza.precioBruto)) }}</td>
                <!-- Fin valores para las nuevas columnas -->
                <td>
                  <input type="date" v-model="editingStates[limpieza.id].fechaPago" class="form-control form-control-sm" />
                </td>
                <td>
                  <button
                    @click="handleUpdatePayment(limpieza.id, editingStates[limpieza.id].fechaPago)"
                    class="btn btn-success btn-sm d-flex align-items-center justify-content-center"
                    :disabled="editingStates[limpieza.id].isSaving || databaseStore.isUpdatingLimpieza || !editingStates[limpieza.id].fechaPago"
                  >
                    <span v-if="editingStates[limpieza.id].isSaving" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span v-else>Guardar</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Footer para mostrar el total de pagos pendientes -->
        <div class="card-footer text-end">
        <h3 class="mb-0">
          Neto Pendiente:
          <strong><span class="text-danger"> {{ formatCurrency(totalPendienteNeto) }}</span></strong>
        </h3>
      </div>
      <div class="card-footer text-end">
        <h4 class="mb-0">
          Bruto Pendiente: {{ formatCurrency(totalPendiente) }}
        </h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watchEffect, computed } from 'vue';
import { useDatabaseStore } from "../stores/database";
import dayjs from "dayjs";

const databaseStore = useDatabaseStore();

// Objeto reactivo para almacenar el estado de edición de cada fila de la tabla.
const editingStates = reactive({});

// --- FUNCIONES UTILITARIAS DE CÁLCULO ---
// Estas funciones se han movido aquí para que estén disponibles en este componente
const calculateCotizacion = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) return 0;
  return parseFloat((brute * 0.21).toFixed(2));
};

const calculatePrecioNeto = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) return 0;
  const cotizacion = calculateCotizacion(brute);
  return parseFloat((brute - cotizacion).toFixed(2));
};

// Función para formatear valores monetarios a euros
const formatCurrency = (value) => {
  const numberValue = Number(value);
  if (isNaN(numberValue)) return '';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};
// --- FIN FUNCIONES UTILITARIAS DE CÁLCULO ---


// NUEVO/CORREGIDO: Propiedades computadas para los totales PENDIENTES
const totalPendiente = computed(() => { // Total Bruto Pendiente
  let sum = 0;
  for (const limpieza of databaseStore.pendingLimpiezas) {
    sum += (limpieza.precioBruto || 0);
  }
  return sum;
});

const totalPendienteNeto = computed(() => { // Total Neto Pendiente
  let sum = 0;
  for (const limpieza of databaseStore.pendingLimpiezas) { // Iterar sobre pendingLimpiezas
    sum += calculatePrecioNeto(limpieza.precioBruto || 0);
  }
  return sum;
});

const totalPendienteCotizacion = computed(() => { // Total Cotización Pendiente
  let sum = 0;
  for (const limpieza of databaseStore.pendingLimpiezas) { // Iterar sobre pendingLimpiezas
    sum += calculateCotizacion(limpieza.precioBruto || 0);
  }
  return sum;
});


// watchEffect para inicializar o limpiar los estados de edición
watchEffect(() => {
    databaseStore.pendingLimpiezas.forEach(limpieza => {
        if (!editingStates[limpieza.id]) {
            editingStates[limpieza.id] = {
                fechaPago: dayjs().format('YYYY-MM-DD'),
                isSaving: false,
            };
        }
    });

    for (const id in editingStates) {
        if (!databaseStore.pendingLimpiezas.some(l => l.id === id)) {
            delete editingStates[id];
        }
    }
});


// Función para obtener el nombre completo del cliente
const getClientName = (clientId) => {
    const client = databaseStore.getClientById(clientId);
    return client ? client.nombre : (clientId || 'Cliente Desconocido');
};

// Función para calcular los días que lleva pendiente un pago
const calculateDaysPending = (startDateString) => {
    if (!startDateString) return 'N/A';
    const startDate = dayjs(startDateString);
    const today = dayjs();
    return today.diff(startDate, 'days');
};

// Función para formatear fechas a formato europeo (DD/MM/AAAA)
const formatEuropeanDate = (dateValue) => {
    if (!dateValue) return '';
    let date;
    if (typeof dateValue.toDate === 'function') {
        date = dateValue.toDate();
    } else if (dateValue instanceof Date) {
        date = dateValue;
    } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
        date = new Date(dateValue);
        if (isNaN(date.getTime())) { console.warn('Fecha inválida detectada:', dateValue); return ''; }
    } else {
        console.warn('Formato de fecha desconocido:', dateValue); return '';
    }
    return date.toLocaleDateString('fr-FR');
};


// Maneja la acción de guardar el pago actualizado
const handleUpdatePayment = async (limpiezaId, newFechaPago) => {
    if (!newFechaPago) {
        alert('Por favor, selecciona una fecha de pago para guardar.');
        return;
    }
    editingStates[limpiezaId].isSaving = true;
    try {
        await databaseStore.updatePaymentStatus(limpiezaId, newFechaPago);
        console.log(`Pago para la limpieza ${limpiezaId} registrado con éxito.`);
    } catch (error) {
        alert('Error al actualizar el pago: ' + error.message);
        console.error('Error en handleUpdatePayment:', error);
    } finally {
        editingStates[limpiezaId].isSaving = false;
    }
};

// Hook de ciclo de vida: al montar el componente, asegura que se carguen los datos necesarios
onMounted(() => {
    databaseStore.fetchLimpiezas();
    databaseStore.fetchClientes();
});
</script>

<style scoped>
.table-responsive {
  max-height: 70vh;
  overflow-y: auto;
}
.table th, .table td {
  white-space: nowrap;
  vertical-align: middle;
}
.table td .form-select,
.table td .form-control {
  font-size: 0.85rem;
  padding: 0.2rem 0.5rem;
}
.fw-bold { font-weight: bold !important; }

/* ── Armonización con el tema del sitio ── */
h2.bg-white {
  background: var(--white) !important;
  color: var(--text) !important;
  font-family: 'Anton', sans-serif;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}
h3, h4 {
  font-family: 'Raleway', sans-serif;
  color: var(--text);
}
.card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-sm);
}
.card-header {
  background: var(--navy);
  color: #fff;
  border-bottom: 1px solid var(--border);
  border-radius: var(--r-md) var(--r-md) 0 0 !important;
  padding: 14px 20px;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
}
.card-header h3 { color: #fff; font-size: 1rem; margin: 0; }
.card-body { background: var(--white); color: var(--text); }
.card-footer {
  background: var(--slate);
  border-top: 1px solid var(--border);
  color: var(--text);
}
.form-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
}
.form-control, .form-select {
  background: var(--slate);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
}
.form-control:focus, .form-select:focus {
  background: var(--slate);
  border-color: var(--blue);
  color: var(--text);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
}
.form-select option { background: var(--white); color: var(--text); }
.table {
  color: var(--text);
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem;
  border-color: var(--border);
}
.table thead th {
  background: var(--navy-2);
  color: rgba(255,255,255,0.85);
  border-color: rgba(255,255,255,0.08);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.table tbody td {
  border-color: var(--border);
  background: var(--white);
}
.table-striped tbody tr:nth-of-type(odd) td { background: var(--slate) !important; }
.table-hover tbody tr:hover td { background: var(--blue-pale) !important; }
.btn-success {
  background: #16a34a;
  border-color: #16a34a;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  border-radius: var(--r-sm);
}
.btn-success:hover { background: #15803d; border-color: #15803d; }
.alert-info {
  background: var(--blue-pale);
  border-color: rgba(37,99,235,0.2);
  color: var(--blue);
  font-family: 'Raleway', sans-serif;
  border-radius: var(--r-sm);
}
.alert-warning {
  background: rgba(251,191,36,0.1);
  border-color: rgba(251,191,36,0.3);
  color: #92400e;
  font-family: 'Raleway', sans-serif;
  border-radius: var(--r-sm);
}
.alert-danger {
  background: rgba(239,68,68,0.1);
  border-color: rgba(239,68,68,0.3);
  color: #dc2626;
  font-family: 'Raleway', sans-serif;
  border-radius: var(--r-sm);
}
.text-danger { color: #dc2626 !important; }
.text-muted { color: var(--text-muted) !important; }
</style>
