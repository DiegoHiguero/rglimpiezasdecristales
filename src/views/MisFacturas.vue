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
          <option v-for="(name, idx) in months" :key="idx" :value="idx + 1">{{ name }}</option>
        </select>
        <select class="mf-select" v-model="selectedYear">
          <option value="">Todos los años</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <!-- Stats -->
    <div class="mf-stats">
      <div class="mf-stat mf-stat--blue">
        <div class="mf-stat-icon"><font-awesome-icon :icon="['fas', 'file-invoice']" /></div>
        <div>
          <span class="mf-stat-value">{{ filteredRecords.length }}</span>
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
        <span class="mf-count">{{ filteredRecords.length }} registros</span>
      </div>

      <div v-if="tabState.loading" class="mf-loading">
        <div class="mf-spinner"></div>
        <p>Cargando facturas...</p>
      </div>

      <div v-else-if="tabState.error" class="mf-empty mf-empty--error">
        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="mf-empty-icon" />
        <p>Error al cargar los datos</p>
        <button class="mf-retry-btn" @click="sheetsStore.loadTab('Registro')">Reintentar</button>
      </div>

      <div v-else-if="filteredRecords.length === 0" class="mf-empty">
        <font-awesome-icon :icon="['fas', 'file-invoice']" class="mf-empty-icon" />
        <p>No hay facturas para el período seleccionado</p>
      </div>

      <div v-else class="mf-table-wrap">
        <table class="mf-table">
          <thead>
            <tr>
              <th>Factura</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th class="text-right">Subtotal</th>
              <th class="text-right">Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filteredRecords" :key="r._row" class="mf-row">
              <td><span class="mf-factura-num">{{ r['NºFactura'] }}</span></td>
              <td>{{ r['Fecha'] }}</td>
              <td>{{ r['Cliente'] }}</td>
              <td class="text-right">{{ r['Subtotal'] }}</td>
              <td class="text-right"><strong>{{ r['Total'] }}</strong></td>
              <td>
                <span class="mf-badge" :class="r['Estado'] === 'Pagada' ? 'mf-badge--paid' : 'mf-badge--pending'">
                  {{ r['Estado'] || 'Pendiente' }}
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="mf-total-row">
              <td colspan="4"><strong>Total</strong></td>
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
import { useSheetsStore } from '../stores/sheetsStore';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const sheetsStore = useSheetsStore();

const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const currentYear = dayjs().year();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const selectedMonth = ref('');
const selectedYear  = ref('');

onMounted(() => sheetsStore.loadTab('Registro'));

const tabState = computed(() => sheetsStore.tabData['Registro'] || { loading: true, error: null, records: [] });

function parseCurrency(str) {
  if (!str) return 0;
  return parseFloat(String(str).replace(/[€\s]/g, '').replace(',', '.')) || 0;
}

function parseDate(str) {
  if (!str) return null;
  const p = String(str).split('/');
  if (p.length !== 3) return null;
  return dayjs(`${p[2]}-${p[1]}-${p[0]}`);
}

const allRecords = computed(() =>
  (tabState.value.records || [])
    .filter(r => r['NºFactura'])
    .sort((a, b) => (b['NºFactura'] || '').localeCompare(a['NºFactura'] || ''))
);

const filteredRecords = computed(() => {
  if (!selectedMonth.value && !selectedYear.value) return allRecords.value;
  return allRecords.value.filter(r => {
    const d = parseDate(r['Fecha']);
    if (!d || !d.isValid()) return false;
    if (selectedYear.value && d.year() !== Number(selectedYear.value)) return false;
    if (selectedMonth.value && d.month() + 1 !== Number(selectedMonth.value)) return false;
    return true;
  });
});

const totalFacturado = computed(() =>
  filteredRecords.value.reduce((s, r) => s + parseCurrency(r['Total']), 0)
);
const totalCobrado = computed(() =>
  filteredRecords.value.filter(r => r['Estado'] === 'Pagada').reduce((s, r) => s + parseCurrency(r['Total']), 0)
);
const totalPendiente = computed(() => totalFacturado.value - totalCobrado.value);

const formatCurrency = (v) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(v || 0);
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
.mf-empty--error { color: #f87171; }
.mf-retry-btn {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.82rem;
  background: rgba(239,68,68,0.15);
  color: #f87171;
  border: 1px solid rgba(239,68,68,0.3);
  border-radius: 8px;
  padding: 6px 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.mf-retry-btn:hover { background: rgba(239,68,68,0.25); }
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
