<template>
  <div class="gt-wrap">

    <!-- Cabecera -->
    <div class="mc-card-header">
      <h2 class="mc-card-title">Gestión de Gastos</h2>
      <button class="mc-btn mc-btn--primary" @click="openModal()">
        <font-awesome-icon :icon="['fas', 'plus']" class="me-2" />Nuevo Gasto
      </button>
    </div>

    <div class="mc-card-body">

      <!-- Filtros -->
      <div class="gt-filters">
        <div class="gt-filter-group">
          <label>Mes</label>
          <select v-model="selectedMonth" @change="filterGastos">
            <option value="">Todos</option>
            <option v-for="(m, i) in meses" :key="i" :value="i">{{ m }}</option>
          </select>
        </div>
        <div class="gt-filter-group">
          <label>Año</label>
          <select v-model="selectedYear" @change="filterGastos">
            <option value="">Todos</option>
            <option v-for="y in years" :key="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <!-- Tabla -->
      <div class="mc-table-wrap">
        <table class="mc-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Nº Factura</th>
              <th>Sin IVA (€)</th>
              <th>IVA (€)</th>
              <th>Con IVA (€)</th>
              <th>Notas</th>
              <th>Verificado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="gasto in gastosFiltrados" :key="gasto.id">
              <td>{{ gasto.tipo }}</td>
              <td>{{ gasto.fechaFactura }}</td>
              <td>{{ gasto.numeroFactura }}</td>
              <td>{{ gasto.precioSinIVA?.toFixed(2) }}</td>
              <td>{{ gasto.iva?.toFixed(2) }}</td>
              <td><strong>{{ gasto.precioConIVA?.toFixed(2) }}</strong></td>
              <td>{{ gasto.notas }}</td>
              <td>
                <button class="mc-icon-btn" :class="gasto.verificado ? 'mc-icon-btn--green' : 'mc-icon-btn--grey'" @click="toggleVerificado(gasto)" :title="gasto.verificado ? 'Verificado' : 'Sin verificar'">
                  <font-awesome-icon :icon="['fas', 'check']" />
                </button>
              </td>
              <td>
                <div class="mc-actions">
                  <button class="mc-icon-btn mc-icon-btn--teal" @click="openModal(gasto)" title="Editar"><font-awesome-icon :icon="['fas', 'file-pen']" /></button>
                  <button class="mc-icon-btn mc-icon-btn--red" @click="deleteGasto(gasto.id)" title="Borrar"><font-awesome-icon :icon="['fas', 'trash-can']" /></button>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="gt-totals">
              <td colspan="3">Totales</td>
              <td>{{ totalSinIVA.toFixed(2) }}</td>
              <td>{{ totalIVA.toFixed(2) }}</td>
              <td><strong>{{ totalConIVA.toFixed(2) }}</strong></td>
              <td colspan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Gráfica -->
      <div class="gt-chart">
        <p class="mc-chart-title">Comparativa: Ingresos vs Gastos</p>
        <apexchart width="100%" height="320" type="bar" :options="chartOptions" :series="chartSeries"></apexchart>
      </div>

    </div>
  </div>

  <!-- Modal -->
  <Teleport to="body">
    <div v-if="modalOpen" class="mc-modal-backdrop" @click.self="closeModal">
      <div class="mc-modal">
        <div class="mc-modal-header">
          <h5>{{ editingGasto.id ? 'Editar Gasto' : 'Nuevo Gasto' }}</h5>
          <button class="mc-modal-close" @click="closeModal"><font-awesome-icon :icon="['fas', 'xmark']" /></button>
        </div>
        <div class="mc-modal-body">
          <div class="gt-field">
            <label>Tipo de Gasto</label>
            <select v-model="editingGasto.tipo">
              <option v-for="tipo in tiposGasto" :key="tipo" :value="tipo">{{ tipo }}</option>
            </select>
          </div>
          <div class="gt-row">
            <div class="gt-field">
              <label>Fecha Factura</label>
              <input type="date" v-model="editingGasto.fechaFactura" />
            </div>
            <div class="gt-field">
              <label>Número Factura</label>
              <input type="text" v-model="editingGasto.numeroFactura" placeholder="FAC-001" />
            </div>
          </div>
          <div class="gt-field">
            <label>Precio con IVA (€)</label>
            <input type="number" v-model.number="editingGasto.precioConIVA" @input="calcularPrecios(editingGasto)" placeholder="0.00" />
          </div>
          <div class="gt-field">
            <label>Notas</label>
            <textarea v-model="editingGasto.notas" rows="3" placeholder="Observaciones..."></textarea>
          </div>
          <label class="gt-check-label">
            <input type="checkbox" v-model="editingGasto.verificado" />
            <span class="gt-check-box">
              <font-awesome-icon :icon="['fas', 'check']" class="gt-check-tick" />
            </span>
            <span>Verificado</span>
          </label>
        </div>
        <div class="mc-modal-footer">
          <button class="mc-btn mc-btn--ghost" @click="closeModal">Cancelar</button>
          <button class="mc-btn mc-btn--primary" @click="saveGasto">Guardar</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDatabaseStore } from '../stores/database'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'

const dbStore = useDatabaseStore()
const gastos = ref([])
const gastosFiltrados = ref([])
const selectedMonth = ref('')
const selectedYear = ref(new Date().getFullYear())
const tiposGasto = ref(['Gasolina', 'Coche', 'Teléfono', 'Material', 'Otros'])
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i)
const modalOpen = ref(false)

const editingGasto = ref({ id: null, tipo: 'Gasolina', fechaFactura: '', numeroFactura: '', precioSinIVA: 0, iva: 0, precioConIVA: 0, notas: '', verificado: false })

const openModal = (gasto = null) => {
  editingGasto.value = gasto ? { ...gasto } : { id: null, tipo: 'Gasolina', fechaFactura: '', numeroFactura: '', precioSinIVA: 0, iva: 0, precioConIVA: 0, notas: '', verificado: false }
  modalOpen.value = true
}
const closeModal = () => { modalOpen.value = false }

const calcularPrecios = (gasto) => {
  gasto.precioSinIVA = gasto.precioConIVA / 1.21
  gasto.iva = gasto.precioConIVA - gasto.precioSinIVA
}

const saveGasto = async () => {
  try {
    if (editingGasto.value.id) {
      await updateDoc(doc(db, 'gastos', editingGasto.value.id), editingGasto.value)
    } else {
      await addDoc(collection(db, 'gastos'), editingGasto.value)
    }
    await fetchGastos()
    closeModal()
  } catch (e) { console.error(e) }
}

const deleteGasto = async (id) => {
  if (!confirm('¿Seguro que quieres borrar este gasto?')) return
  await deleteDoc(doc(db, 'gastos', id))
  await fetchGastos()
}

const toggleVerificado = async (gasto) => {
  gasto.verificado = !gasto.verificado
  await updateDoc(doc(db, 'gastos', gasto.id), { verificado: gasto.verificado })
}

const fetchGastos = async () => {
  const snapshot = await getDocs(collection(db, 'gastos'))
  gastos.value = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
  filterGastos()
}

const filterGastos = () => {
  gastosFiltrados.value = gastos.value.filter(g => {
    if (!g.fechaFactura) return true
    const f = new Date(g.fechaFactura)
    const mesOk = selectedMonth.value === '' || f.getMonth() === Number(selectedMonth.value)
    const anioOk = selectedYear.value === '' || f.getFullYear() === Number(selectedYear.value)
    return mesOk && anioOk
  })
}

const totalSinIVA = computed(() => gastosFiltrados.value.reduce((a, g) => a + (g.precioSinIVA || 0), 0))
const totalIVA    = computed(() => gastosFiltrados.value.reduce((a, g) => a + (g.iva || 0), 0))
const totalConIVA = computed(() => gastosFiltrados.value.reduce((a, g) => a + (g.precioConIVA || 0), 0))

const ingresosMensuales = computed(() => {
  const arr = Array(12).fill(0)
  dbStore.limpiezas.forEach(l => { arr[new Date(l.fechaPrincipalLimpieza).getMonth()] += Number(l.precioBruto || 0) })
  return arr
})
const gastosMensuales = computed(() => {
  const arr = Array(12).fill(0)
  gastosFiltrados.value.forEach(g => { if (g.fechaFactura) arr[new Date(g.fechaFactura).getMonth()] += Number(g.precioConIVA || 0) })
  return arr
})
const chartSeries = computed(() => [
  { name: 'Ingresos', data: ingresosMensuales.value },
  { name: 'Gastos', data: gastosMensuales.value }
])
const chartOptions = {
  chart: { type: 'bar', height: 320, toolbar: { show: false }, background: 'transparent' },
  theme: { mode: 'dark' },
  plotOptions: { bar: { horizontal: false, columnWidth: '45%', borderRadius: 4 } },
  dataLabels: { enabled: false },
  xaxis: { categories: meses },
  yaxis: { title: { text: '€' } },
  colors: ['#34d399', '#f87171'],
  tooltip: { y: { formatter: v => `€ ${v.toFixed(2)}` } },
  grid: { borderColor: 'rgba(255,255,255,0.06)' }
}

onMounted(async () => {
  await dbStore.fetchLimpiezas()
  await fetchGastos()
})
</script>

<style scoped>
.gt-wrap { display: block; }

/* ── mc-* classes duplicated here because Vue scoped CSS doesn't cascade to child components ── */
.mc-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-wrap: wrap;
  gap: 10px;
}
.mc-card-title {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: #f1f5f9;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.mc-card-body { padding: 20px 24px; }

.mc-btn {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.84rem;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.2s, transform 0.2s;
}
.mc-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.mc-btn--primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; }
.mc-btn--ghost   { background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); }

.mc-table-wrap { overflow-x: auto; }
.mc-table { width: 100%; border-collapse: collapse; font-family: 'Raleway', sans-serif; font-size: 0.84rem; }
.mc-table th { color: #475569; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.07); text-align: left; white-space: nowrap; }
.mc-table td { padding: 11px 12px; color: #94a3b8; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
.mc-table tbody tr:hover td { background: rgba(255,255,255,0.02); }
.mc-table strong { color: #e2e8f0; }

.mc-actions { display: flex; gap: 6px; }
.mc-icon-btn { width: 30px; height: 30px; border-radius: 7px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; transition: opacity 0.2s; }
.mc-icon-btn:hover { opacity: 0.8; }
.mc-icon-btn--teal { background: rgba(20,184,166,0.2);  color: #2dd4bf; }
.mc-icon-btn--red  { background: rgba(239,68,68,0.2);   color: #f87171; }

.mc-chart-title { font-family: 'Raleway', sans-serif; font-size: 0.88rem; font-weight: 700; color: #94a3b8; margin-bottom: 12px; }

.mc-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; }
.mc-modal { background: #0f1729; border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; width: 100%; max-width: 540px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,0.6); }
.mc-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); }
.mc-modal-header h5 { font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 1rem; color: #f1f5f9; margin: 0; }
.mc-modal-close { background: none; border: none; color: #64748b; font-size: 1rem; cursor: pointer; padding: 4px; transition: color 0.2s; }
.mc-modal-close:hover { color: #fff; }
.mc-modal-body { padding: 24px; overflow-y: auto; flex: 1; }
.mc-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07); }

.gt-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.gt-filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
}
.gt-filter-group label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}
.gt-filter-group select {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #f1f5f9;
  font-family: 'Raleway', sans-serif;
  font-size: 0.85rem;
  padding: 7px 10px;
  outline: none;
  transition: border-color 0.2s;
}
.gt-filter-group select:focus { border-color: rgba(96,165,250,0.4); }
.gt-filter-group select option { background: #0f1729; }

.gt-totals td {
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: #60a5fa !important;
  border-top: 1px solid rgba(255,255,255,0.1) !important;
  padding: 10px 12px;
}

.gt-chart { margin-top: 28px; }

/* Modal fields */
.gt-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.gt-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 14px;
}
.gt-field label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}
.gt-field input,
.gt-field select,
.gt-field textarea {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #f1f5f9;
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  padding: 9px 12px;
  outline: none;
  transition: border-color 0.2s;
  resize: none;
}
.gt-field input:focus,
.gt-field select:focus,
.gt-field textarea:focus { border-color: rgba(96,165,250,0.4); background: rgba(96,165,250,0.04); }
.gt-field input::placeholder,
.gt-field textarea::placeholder { color: #334155; }
.gt-field select option { background: #0f1729; }

.gt-check-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: #94a3b8;
  user-select: none;
}
.gt-check-label input { display: none; }
.gt-check-box {
  width: 20px; height: 20px;
  border-radius: 6px;
  border: 2px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.04);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s;
}
.gt-check-tick { color: #fff; font-size: 0.65rem; opacity: 0; transition: opacity 0.15s; }
.gt-check-label input:checked ~ .gt-check-box { background: #2563eb; border-color: #2563eb; }
.gt-check-label input:checked ~ .gt-check-box .gt-check-tick { opacity: 1; }

.mc-icon-btn--green { background: rgba(34,197,94,0.15); color: #4ade80; }
.mc-icon-btn--grey  { background: rgba(100,116,139,0.15); color: #64748b; }
</style>
