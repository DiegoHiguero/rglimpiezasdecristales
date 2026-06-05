<template>
  <div class="mf-wrap">

    <!-- Cabecera -->
    <div class="mf-header">
      <div>
        <span class="mf-label">Panel Admin</span>
        <h1 class="mf-title">Mis <span class="mf-accent">Facturas</span></h1>
      </div>
      <div class="mf-filters">
        <select class="mf-select" v-model="selectedMonth">
          <option value="">Todos los meses</option>
          <option v-for="(name, idx) in months" :key="idx" :value="idx">{{ name }}</option>
        </select>
        <select class="mf-select" v-model="selectedYear">
          <option value="">Todos los años</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
        <button class="mf-btn-filter" @click="loadData">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="me-2" />Filtrar
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="mf-stats">
      <div class="mf-stat mf-stat--blue">
        <div class="mf-stat-icon"><font-awesome-icon :icon="['fas', 'file-invoice']" /></div>
        <div>
          <span class="mf-stat-value">{{ filteredLimpiezas.length }}</span>
          <span class="mf-stat-label">Facturas</span>
        </div>
      </div>
      <div class="mf-stat mf-stat--green">
        <div class="mf-stat-icon"><font-awesome-icon :icon="['fas', 'hand-holding-dollar']" /></div>
        <div>
          <span class="mf-stat-value">{{ formatCurrency(totalFacturado) }}</span>
          <span class="mf-stat-label">Total facturado</span>
        </div>
      </div>
      <div class="mf-stat mf-stat--teal">
        <div class="mf-stat-icon"><font-awesome-icon :icon="['fas', 'check']" /></div>
        <div>
          <span class="mf-stat-value">{{ formatCurrency(totalCobrado) }}</span>
          <span class="mf-stat-label">Cobrado</span>
        </div>
      </div>
      <div class="mf-stat mf-stat--red">
        <div class="mf-stat-icon"><font-awesome-icon :icon="['fas', 'clock']" /></div>
        <div>
          <span class="mf-stat-value">{{ formatCurrency(totalPendiente) }}</span>
          <span class="mf-stat-label">Pendiente</span>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="mf-card">
      <div class="mf-card-head">
        <span class="mf-card-title">Listado de facturas</span>
        <span class="mf-count">{{ filteredLimpiezas.length }} registros</span>
      </div>

      <div v-if="databaseStore.isLoadingLimpiezas" class="mf-loading">
        <div class="mf-spinner"></div>
        <p>Cargando facturas...</p>
      </div>

      <div v-else-if="filteredLimpiezas.length === 0" class="mf-empty">
        <font-awesome-icon :icon="['fas', 'file-invoice']" class="mf-empty-icon" />
        <p>No hay facturas para el período seleccionado</p>
      </div>

      <div v-else class="mf-table-wrap">
        <table class="mf-table">
          <thead>
            <tr>
              <th>Factura</th>
              <th>Cliente</th>
              <th>Fecha servicio</th>
              <th>Fecha pago</th>
              <th>Forma pago</th>
              <th class="text-right">Importe</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in filteredLimpiezas" :key="l.id" class="mf-row">
              <td><span class="mf-factura-num">{{ l.factura }}</span></td>
              <td>{{ getClientName(l.clienteId) }}</td>
              <td>{{ formatDate(l.fechaPrincipalLimpieza) }}</td>
              <td>{{ l.fechaPago ? formatDate(l.fechaPago) : '—' }}</td>
              <td>{{ l.formaPago || '—' }}</td>
              <td class="text-right"><strong>{{ formatCurrency(l.precioBruto) }}</strong></td>
              <td>
                <span class="mf-badge" :class="l.fechaPago ? 'mf-badge--paid' : 'mf-badge--pending'">
                  {{ l.fechaPago ? 'Cobrada' : 'Pendiente' }}
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="mf-total-row">
              <td colspan="5"><strong>Total</strong></td>
              <td class="text-right"><strong>{{ formatCurrency(totalFacturado) }}</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDatabaseStore } from '../stores/database';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const databaseStore = useDatabaseStore();

const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const currentYear = dayjs().year();
const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

const selectedMonth = ref(dayjs().month());
const selectedYear = ref(currentYear);

const loadData = async () => {
  await Promise.all([
    databaseStore.fetchLimpiezas(String(selectedMonth.value), String(selectedYear.value)),
    databaseStore.fetchClientes(),
  ]);
};

onMounted(loadData);

const filteredLimpiezas = computed(() => [...databaseStore.limpiezas].sort((a, b) => {
  if (a.factura < b.factura) return 1;
  if (a.factura > b.factura) return -1;
  return 0;
}));

const totalFacturado = computed(() =>
  filteredLimpiezas.value.reduce((s, l) => s + (Number(l.precioBruto) || 0), 0)
);
const totalCobrado = computed(() =>
  filteredLimpiezas.value.filter(l => l.fechaPago).reduce((s, l) => s + (Number(l.precioBruto) || 0), 0)
);
const totalPendiente = computed(() => totalFacturado.value - totalCobrado.value);

const getClientName = (id) => {
  const c = databaseStore.getClientById(id);
  return c ? `${c.nombre} ${c.apellido || ''}`.trim() : '—';
};

const formatCurrency = (v) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(Number(v) || 0);

const formatDate = (d) => d ? dayjs(d).format('DD/MM/YYYY') : '—';
</script>

<style scoped>
.mf-wrap {
  min-height: 100vh;
  background: var(--slate, #0d1526);
  padding: 36px 24px 60px;
  max-width: 1200px;
  margin: 0 auto;
}

/* ── Header ── */
.mf-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}
.mf-label {
  display: inline-block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #60a5fa;
  background: rgba(96,165,250,0.1);
  border: 1px solid rgba(96,165,250,0.2);
  border-radius: 20px;
  padding: 3px 14px;
  margin-bottom: 10px;
}
.mf-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.2rem;
  color: #f1f5f9;
  margin: 0;
  line-height: 1.1;
}
.mf-accent { color: #60a5fa; }

/* ── Filters ── */
.mf-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.mf-select {
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem;
  color: #94a3b8;
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 8px 12px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.mf-select:focus { border-color: rgba(96,165,250,0.4); }
.mf-btn-filter {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.84rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.mf-btn-filter:hover { background: #1d4ed8; }

/* ── Stats ── */
.mf-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
.mf-stat {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.mf-stat-icon {
  width: 42px; height: 42px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}
.mf-stat--blue  .mf-stat-icon { background: rgba(96,165,250,0.12); color: #60a5fa; }
.mf-stat--green .mf-stat-icon { background: rgba(52,211,153,0.12); color: #34d399; }
.mf-stat--teal  .mf-stat-icon { background: rgba(34,211,238,0.12); color: #22d3ee; }
.mf-stat--red   .mf-stat-icon { background: rgba(239,68,68,0.12);  color: #f87171; }
.mf-stat-value {
  display: block;
  font-family: 'Anton', sans-serif;
  font-size: 1.25rem;
  color: #f1f5f9;
  line-height: 1.2;
}
.mf-stat-label {
  display: block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  margin-top: 2px;
}

/* ── Card ── */
.mf-card {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  overflow: hidden;
}
.mf-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.mf-card-title {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #f1f5f9;
}
.mf-count {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: #60a5fa;
  background: rgba(96,165,250,0.1);
  border: 1px solid rgba(96,165,250,0.2);
  border-radius: 12px;
  padding: 2px 10px;
}

/* ── Loading / Empty ── */
.mf-loading, .mf-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  color: #64748b;
  font-family: 'Raleway', sans-serif;
  font-size: 0.9rem;
  gap: 12px;
}
.mf-empty-icon { font-size: 2.5rem; opacity: 0.3; }
.mf-spinner {
  width: 32px; height: 32px;
  border: 3px solid rgba(96,165,250,0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Table ── */
.mf-table-wrap { overflow-x: auto; }
.mf-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem;
}
.mf-table thead th {
  padding: 12px 16px;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #475569;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  white-space: nowrap;
}
.mf-table thead th.text-right { text-align: right; }
.mf-table tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
.mf-table tbody tr:hover { background: rgba(255,255,255,0.025); }
.mf-table tbody td {
  padding: 13px 16px;
  color: #94a3b8;
  vertical-align: middle;
}
.mf-table tbody td.text-right { text-align: right; color: #f1f5f9; }
.mf-table tfoot td {
  padding: 14px 16px;
  color: #f1f5f9;
  border-top: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
}
.mf-table tfoot td.text-right { text-align: right; }

.mf-factura-num {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  color: #60a5fa;
  background: rgba(96,165,250,0.08);
  border: 1px solid rgba(96,165,250,0.2);
  border-radius: 6px;
  padding: 2px 8px;
  white-space: nowrap;
}
.mf-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 12px;
  white-space: nowrap;
}
.mf-badge--paid    { background: rgba(34,197,94,0.12); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
.mf-badge--pending { background: rgba(239,68,68,0.12);  color: #f87171; border: 1px solid rgba(239,68,68,0.2); }

/* ── Responsive ── */
@media (max-width: 900px) {
  .mf-stats { grid-template-columns: repeat(2, 1fr); }
  .mf-header { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 540px) {
  .mf-wrap { padding: 24px 12px 48px; }
  .mf-stats { grid-template-columns: 1fr 1fr; }
  .mf-title { font-size: 1.7rem; }
}
</style>
