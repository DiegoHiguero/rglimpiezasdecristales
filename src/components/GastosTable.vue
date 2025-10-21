<template>
  <div class="card mt-5 shadow-sm">
    <div class="card-header bg-primary text-white text-center">
      <h4 class="mb-0">Gestión de Gastos</h4>
    </div>

    <div class="card-body">
      <!-- FILTROS -->
      <div class="row mb-4">
        <div class="col-md-3">
          <label class="form-label">Mes</label>
          <select v-model="selectedMonth" class="form-select" @change="filterGastos">
            <option value="">Todos</option>
            <option v-for="(m, index) in meses" :key="index" :value="index">{{ m }}</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Año</label>
          <select v-model="selectedYear" class="form-select" @change="filterGastos">
            <option value="">Todos</option>
            <option v-for="y in years" :key="y">{{ y }}</option>
          </select>
        </div>
        <div class="col-md-6 d-flex align-items-end justify-content-end">
          <button class="btn btn-success" @click="openModal()">
            <i class="bi bi-plus-circle me-2"></i>Nuevo Gasto
          </button>
        </div>
      </div>

      <!-- TABLA DE GASTOS -->
      <div class="table-responsive">
        <table class="table table-bordered table-striped align-middle text-center">
          <thead class="table-primary">
            <tr>
              <th>Tipo de Gasto</th>
              <th>Fecha Factura</th>
              <th>N° Factura</th>
              <th>Precio sin IVA (€)</th>
              <th>IVA (21%)</th>
              <th>Precio con IVA (€)</th>
              <th>Notas</th>
              <th>Verificado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(gasto, index) in gastosFiltrados" :key="gasto.id">
              <td>{{ gasto.tipo }}</td>
              <td>{{ gasto.fechaFactura }}</td>
              <td>{{ gasto.numeroFactura }}</td>
              <td>{{ gasto.precioSinIVA.toFixed(2) }}</td>
              <td>{{ gasto.iva.toFixed(2) }}</td>
              <td>{{ gasto.precioConIVA.toFixed(2) }}</td>
              <td>{{ gasto.notas }}</td>
              <td>
               <button class="btn btn-outline-success" :class="{ active: gasto.verificado }" @click="toggleVerificado(gasto)">
                 <i :class="gasto.verificado ? 'fas fa-check-circle fa-xs' : 'far fa-circle fa-xs'"></i>
                </button>
              </td>
              <td>
                <button class="btn btn-primary btn-sm me-1" @click="openModal(gasto)">Editar</button>
                <button class="btn btn-danger btn-sm" @click="deleteGasto(gasto.id)">Borrar</button>
              </td>
            </tr>
          </tbody>
          <tfoot class="table-light fw-bold">
            <tr>
              <td colspan="3" class="text-end">Totales:</td>
              <td>{{ totalSinIVA.toFixed(2) }}</td>
              <td>{{ totalIVA.toFixed(2) }}</td>
              <td>{{ totalConIVA.toFixed(2) }}</td>
              <td colspan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- GRÁFICA DE COMPARACIÓN -->
      <div class="mt-5">
        <h5 class="text-center mb-4">Comparativa: Ingresos vs Gastos</h5>
        <apexchart
          width="100%"
          height="350"
          type="bar"
          :options="chartOptions"
          :series="chartSeries"
        ></apexchart>
      </div>
    </div>

    <!-- MODAL PARA AÑADIR/EDITAR GASTO -->
    <div class="modal fade" id="gastoModal" tabindex="-1" aria-labelledby="gastoModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="gastoModalLabel">{{ editingGasto.id ? 'Editar Gasto' : 'Nuevo Gasto' }}</h5>
            <button type="button" class="btn-close" @click="closeModal()"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tipo de Gasto</label>
              <select v-model="editingGasto.tipo" class="form-select">
                <option v-for="tipo in tiposGasto" :key="tipo" :value="tipo">{{ tipo }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Fecha Factura</label>
              <input type="date" v-model="editingGasto.fechaFactura" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Número Factura</label>
              <input type="text" v-model="editingGasto.numeroFactura" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Precio con IVA (€)</label>
              <input type="number" v-model.number="editingGasto.precioConIVA" class="form-control" @input="calcularPrecios(editingGasto)" />
            </div>
            <div class="mb-3">
              <label class="form-label">Notas</label>
              <textarea v-model="editingGasto.notas" class="form-control"></textarea>
            </div>
            <div class="form-check mb-3">
              <input type="checkbox" v-model="editingGasto.verificado" class="form-check-input" id="verificadoCheck">
              <label class="form-check-label" for="verificadoCheck">Verificado</label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal()">Cancelar</button>
            <button type="button" class="btn btn-success" @click="saveGasto()">Guardar</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useDatabaseStore } from '../stores/database'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'; 

const dbStore = useDatabaseStore()

const gastos = ref([])
const selectedMonth = ref('')
const selectedYear = ref(new Date().getFullYear())
const tiposGasto = ref(['Gasolina', 'Coche', 'Teléfono', 'Material', 'Otros'])
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i)

// Modal
const editingGasto = ref({
  id: null,
  tipo: 'Gasolina',
  fechaFactura: '',
  numeroFactura: '',
  precioSinIVA: 0,
  iva: 0,
  precioConIVA: 0,
  notas: '',
  verificado: false
})

const openModal = (gasto = null) => {
  if (gasto) {
    editingGasto.value = { ...gasto }
  } else {
    editingGasto.value = {
      id: null,
      tipo: 'Gasolina',
      fechaFactura: '',
      numeroFactura: '',
      precioSinIVA: 0,
      iva: 0,
      precioConIVA: 0,
      notas: '',
      verificado: false
    }
  }
  const modalEl = document.getElementById('gastoModal')
  new bootstrap.Modal(modalEl).show()
}

const closeModal = () => {
  const modalEl = document.getElementById('gastoModal')
  bootstrap.Modal.getInstance(modalEl).hide()
}

// Calcular IVA y precio sin IVA a partir del precio con IVA
const calcularPrecios = (gasto) => {
  gasto.precioSinIVA = gasto.precioConIVA * 0.21
  gasto.iva = gasto.precioConIVA - gasto.precioSinIVA
}

// Guardar gasto (nuevo o editar)
const saveGasto = async () => {
  try {
    if (editingGasto.value.id) {
      const docRef = doc(db, 'gastos', editingGasto.value.id)
      await updateDoc(docRef, editingGasto.value)
    } else {
      await addDoc(collection(db, 'gastos'), editingGasto.value)
    }
    await fetchGastos()
    closeModal()
  } catch (error) {
    console.error("Error guardando gasto:", error)
  }
}

// Borrar gasto
const deleteGasto = async (id) => {
  if (!confirm("¿Seguro que quieres borrar este gasto?")) return
  await deleteDoc(doc(db, 'gastos', id))
  await fetchGastos()
}

// Verificado toggle
const toggleVerificado = async (gasto) => {
  gasto.verificado = !gasto.verificado
  await updateDoc(doc(db, 'gastos', gasto.id), { verificado: gasto.verificado })
}

// Cargar gastos desde Firestore
const fetchGastos = async () => {
  const snapshot = await getDocs(collection(db, 'gastos'))
  gastos.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  filterGastos()
}

// Filtrar gastos por mes y año
const gastosFiltrados = ref([])
const filterGastos = () => {
  gastosFiltrados.value = gastos.value.filter(g => {
    if (!g.fechaFactura) return true
    const fecha = new Date(g.fechaFactura)
    const mesOk = selectedMonth.value === "" || fecha.getMonth() === Number(selectedMonth.value)
    const anioOk = selectedYear.value === "" || fecha.getFullYear() === Number(selectedYear.value)
    return mesOk && anioOk
  })
}

// Totales
const totalSinIVA = computed(() => gastosFiltrados.value.reduce((acc, g) => acc + (g.precioSinIVA || 0), 0))
const totalIVA = computed(() => gastosFiltrados.value.reduce((acc, g) => acc + (g.iva || 0), 0))
const totalConIVA = computed(() => gastosFiltrados.value.reduce((acc, g) => acc + (g.precioConIVA || 0), 0))

// GRÁFICA
const ingresosMensuales = computed(() => {
  const arr = Array(12).fill(0)
  dbStore.limpiezas.forEach(l => {
    const mes = new Date(l.fechaPrincipalLimpieza).getMonth()
    arr[mes] += Number(l.precioBruto || 0)
  })
  return arr
})

const gastosMensuales = computed(() => {
  const arr = Array(12).fill(0)
  gastosFiltrados.value.forEach(g => {
    if (g.fechaFactura) {
      const mes = new Date(g.fechaFactura).getMonth()
      arr[mes] += Number(g.precioConIVA || 0)
    }
  })
  return arr
})

const chartSeries = computed(() => [
  { name: 'Ingresos', data: ingresosMensuales.value },
  { name: 'Gastos', data: gastosMensuales.value }
])

const chartOptions = {
  chart: { type: 'bar', height: 350, toolbar: { show: false } },
  plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 4 } },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: { categories: meses },
  yaxis: { title: { text: '€ Euros' } },
  fill: { opacity: 1 },
  colors: ['#28a745', '#dc3545'],
  tooltip: { y: { formatter: val => `€ ${val.toFixed(2)}` } }
}

onMounted(async () => {
  await dbStore.fetchLimpiezas()
  await fetchGastos()
})
</script>

<style scoped>
.table td,
.table th {
  vertical-align: middle;
}
button.active {
  background-color: #198754 !important;
  color: white !important;
}
</style>
