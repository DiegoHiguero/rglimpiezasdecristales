<template>
  <div class="db-wrap">

    <!-- Cabecera -->
    <div class="db-header">
      <div class="db-header-left">
        <span class="db-label">Panel de Control</span>
        <h1 class="db-title">Bienvenido, <span class="db-accent">{{ firstName }}</span></h1>
        <p class="db-sub">{{ todayFormatted }}</p>
      </div>
      <div class="db-header-right">
        <router-link to="/registro" class="db-new-invoice-btn">
          <font-awesome-icon :icon="['fas', 'plus']" />
          Nueva factura
        </router-link>
      </div>
    </div>

    <!-- Stats -->
    <div class="db-stats">
      <router-link to="/misClientes" class="db-stat db-stat--blue">
        <div class="db-stat-icon"><font-awesome-icon :icon="['fas', 'address-card']" /></div>
        <div class="db-stat-body">
          <span class="db-stat-value">
            <span v-if="databaseStore.isLoadingClientes && !databaseStore.clientes.length" class="db-stat-loading">—</span>
            <span v-else>{{ databaseStore.clientes.length }}</span>
          </span>
          <span class="db-stat-label">Clientes</span>
        </div>
      </router-link>
      <router-link to="/pagos-pendientes" class="db-stat db-stat--red">
        <div class="db-stat-icon"><font-awesome-icon :icon="['fas', 'hand-holding-dollar']" /></div>
        <div class="db-stat-body">
          <span class="db-stat-value">
            <span v-if="registroLoading && !registroRecords.length" class="db-stat-loading">—</span>
            <span v-else>{{ formatCurrency(totalPendiente) }}</span>
          </span>
          <span class="db-stat-label">Pendiente de cobro</span>
        </div>
      </router-link>
      <div class="db-stat db-stat--green">
        <div class="db-stat-icon"><font-awesome-icon :icon="['fas', 'hand-holding-dollar']" /></div>
        <div class="db-stat-body">
          <span class="db-stat-value">
            <span v-if="registroLoading && !registroRecords.length" class="db-stat-loading">—</span>
            <span v-else>{{ formatCurrency(totalCobradoAnio) }}</span>
          </span>
          <span class="db-stat-label">Cobrado {{ dayjs().year() }}</span>
        </div>
      </div>
      <router-link to="/admin/mensajes" class="db-stat db-stat--yellow">
        <div class="db-stat-icon"><font-awesome-icon :icon="['fas', 'file-invoice']" /></div>
        <div class="db-stat-body">
          <span class="db-stat-value">{{ userStore.unreadMessagesCount }}</span>
          <span class="db-stat-label">Mensajes sin leer</span>
        </div>
      </router-link>
    </div>

    <!-- Contenido principal -->
    <div class="db-main db-main--single">

      <!-- Gráfico de ingresos -->
      <div class="db-card db-card--chart">
        <div class="db-card-head">
          <span class="db-card-title">Ingresos vs. gastos</span>
          <span class="db-card-sub">
            Últimos 6 meses
            <span v-if="monthOverMonthChange !== null" :class="monthOverMonthChange >= 0 ? 'db-trend--up' : 'db-trend--down'">
              · {{ monthOverMonthChange >= 0 ? '+' : '' }}{{ monthOverMonthChange }}% vs. mes anterior
            </span>
          </span>
        </div>
        <VueApexCharts
          type="bar"
          height="220"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>

    </div>

    <!-- Top clientes / Clientes inactivos -->
    <div class="db-main">
      <div class="db-card">
        <div class="db-card-head">
          <span class="db-card-title">Top clientes</span>
          <span class="db-card-sub">Por facturación total</span>
        </div>
        <div v-if="topClientes.length === 0" class="db-empty">Sin datos todavía</div>
        <div v-else class="db-pending-list">
          <div v-for="(c, i) in topClientes" :key="c.nombre" class="db-pending-item">
            <div class="db-pending-info">
              <span class="db-pending-name">{{ i + 1 }}. {{ c.nombre }}</span>
            </div>
            <span class="db-pending-amount db-pending-amount--positive">{{ formatCurrency(c.total) }}</span>
          </div>
        </div>
      </div>

      <div class="db-card">
        <div class="db-card-head">
          <span class="db-card-title">Clientes inactivos</span>
          <span class="db-card-sub">Sin factura hace +60 días</span>
        </div>
        <div v-if="clientesInactivos.length === 0" class="db-empty">
          <font-awesome-icon :icon="['fas', 'check']" class="me-2" />Todos con actividad reciente
        </div>
        <div v-else class="db-pending-list">
          <div v-for="c in clientesInactivos" :key="c.nombre" class="db-pending-item">
            <div class="db-pending-info">
              <span class="db-pending-name">{{ c.nombre }}</span>
            </div>
            <span class="db-pending-amount">{{ c.dias !== null ? `${c.dias} días` : 'Sin facturas' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen fiscal del trimestre -->
    <div class="db-fiscal">
      <div class="db-card-head">
        <span class="db-card-title">Resumen fiscal · {{ currentTrimestre }} {{ currentYear }}</span>
        <span class="db-card-sub">Calculado desde Registro y Gastos</span>
      </div>
      <div class="db-fiscal-grid">
        <div class="db-fiscal-item">
          <span class="db-fiscal-label">Base facturada</span>
          <span class="db-fiscal-value">{{ formatCurrency(baseFacturadaTrimestre) }}</span>
        </div>
        <div class="db-fiscal-item">
          <span class="db-fiscal-label">IVA repercutido</span>
          <span class="db-fiscal-value">{{ formatCurrency(ivaRepercutido) }}</span>
        </div>
        <div class="db-fiscal-item">
          <span class="db-fiscal-label">IVA soportado</span>
          <span class="db-fiscal-value">{{ formatCurrency(ivaSoportado) }}</span>
        </div>
        <div class="db-fiscal-item db-fiscal-item--highlight">
          <span class="db-fiscal-label">A ingresar</span>
          <span class="db-fiscal-value">{{ formatCurrency(resultadoTrimestre) }}</span>
        </div>
      </div>
    </div>

    <!-- Google Sheets — Base de datos -->
    <div class="db-sync-card">
      <div class="db-sync-left">
        <div class="db-sync-icon">
          <font-awesome-icon :icon="['fas', syncStore.isSyncing ? 'rotate' : 'table-cells']" :spin="syncStore.isSyncing" />
        </div>
        <div class="db-sync-info">
          <div class="db-sync-title">Base de datos · Google Sheets</div>
          <div class="db-sync-msg" :class="syncStore.status">{{ syncStore.message || 'Conectado a Google Sheets' }}</div>
          <div class="db-sync-last" v-if="syncStore.lastSync">Última actualización: {{ syncStore.lastSync }}</div>
        </div>
        <div class="db-sync-badge" :class="syncStore.status">
          <span v-if="syncStore.status === 'loading'">Cargando...</span>
          <span v-else-if="syncStore.status === 'success'">✓ Activo</span>
          <span v-else-if="syncStore.status === 'error'">⚠ Error</span>
          <span v-else>—</span>
        </div>
      </div>
      <div class="db-sync-actions">
        <button class="db-sync-btn db-sync-btn--full" @click="handleRefresh" :disabled="syncStore.isSyncing">
          <font-awesome-icon :icon="['fas', 'arrows-rotate']" :spin="syncStore.isSyncing" />
          Actualizar datos
        </button>
        <a
          href="https://docs.google.com/spreadsheets/d/1agb2ZG15SDYtrGD7fyi3hzRuHnj7uTwZP716_h5Qpro/edit"
          target="_blank" rel="noopener"
          class="db-sync-btn db-sync-btn--sheet"
        >
          <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" />
          Abrir hoja
        </a>
      </div>
    </div>

    <!-- Accesos rápidos -->
    <div class="db-shortcuts">
      <div class="db-shortcuts-title">Accesos rápidos</div>
      <div class="db-shortcuts-grid">
        <router-link to="/misClientes" class="db-shortcut">
          <div class="db-shortcut-icon" style="background:rgba(96,165,250,0.12);color:#60a5fa">
            <font-awesome-icon :icon="['fas', 'address-card']" />
          </div>
          <span>Mis clientes</span>
        </router-link>
        <router-link to="/admin/mensajes" class="db-shortcut">
          <div class="db-shortcut-icon" style="background:rgba(251,191,36,0.12);color:#fbbf24">
            <font-awesome-icon :icon="['fas', 'envelope-open-text']" />
          </div>
          <span>Mensajes</span>
          <span v-if="userStore.unreadMessagesCount > 0" class="db-shortcut-badge">
            {{ userStore.unreadMessagesCount }}
          </span>
        </router-link>
        <router-link to="/registro" class="db-shortcut">
          <div class="db-shortcut-icon" style="background:rgba(52,211,153,0.12);color:#34d399">
            <font-awesome-icon :icon="['fas', 'rectangle-list']" />
          </div>
          <span>Registro</span>
        </router-link>
        <router-link to="/Register" class="db-shortcut">
          <div class="db-shortcut-icon" style="background:rgba(167,139,250,0.12);color:#a78bfa">
            <font-awesome-icon :icon="['fas', 'user']" />
          </div>
          <span>Nuevo cliente</span>
        </router-link>
        <router-link to="/misFacturas" class="db-shortcut">
          <div class="db-shortcut-icon" style="background:rgba(34,211,238,0.12);color:#22d3ee">
            <font-awesome-icon :icon="['fas', 'file-invoice']" />
          </div>
          <span>Facturas</span>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useDatabaseStore } from '../stores/database';
import { useUserStore } from '../stores/user';
import { useSyncStore } from '../stores/syncStore';
import { useSheetsStore } from '../stores/sheetsStore';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const databaseStore = useDatabaseStore();
const userStore     = useUserStore();
const syncStore     = useSyncStore();
const sheetsStore   = useSheetsStore();

const firstName = computed(() => {
  const displayName = userStore.userData?.displayName;
  if (displayName) return displayName.split(' ')[0];
  const local = (userStore.userData?.email || '').split('@')[0];
  const clean = local.replace(/[._-]+/g, ' ').trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'Admin';
});

const todayFormatted = computed(() =>
  dayjs().format('dddd, D [de] MMMM [de] YYYY')
);

const formatCurrency = (v) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(Number(v) || 0);

// ── Helpers para pestaña "Registro" ──────────────────────────────────────────

function parseCurrency(str) {
  if (!str) return 0;
  // Formato español: "1.020,03 €" → quitar puntos de miles antes de convertir la coma decimal
  return parseFloat(String(str).replace(/[€\s]/g, '').replace(/\./g, '').replace(',', '.')) || 0;
}

function parseDate(str) {
  if (!str) return null;
  const p = String(str).split('/');
  if (p.length !== 3) return null;
  return dayjs(`${p[2]}-${p[1]}-${p[0]}`);
}

const registroRecords = computed(() =>
  (sheetsStore.tabData['REGISTRO']?.records || []).filter(r => r['Nº Factura'])
);
const registroLoading = computed(() => sheetsStore.tabData['REGISTRO']?.loading ?? true);
const registroError   = computed(() => sheetsStore.tabData['REGISTRO']?.error ?? null);

const pendingLimpiezas = computed(() =>
  registroRecords.value
    .filter(r => r['Estado'] !== 'Pagada')
    .sort((a, b) => {
      const da = parseDate(a['Fecha']), db = parseDate(b['Fecha']);
      return (da?.valueOf() ?? 0) - (db?.valueOf() ?? 0);
    })
);

const totalPendiente = computed(() =>
  pendingLimpiezas.value.reduce((s, r) => s + parseCurrency(r['Total']), 0)
);

const totalCobradoAnio = computed(() => {
  const anio = dayjs().year();
  return registroRecords.value
    .filter(r => {
      if (r['Estado'] !== 'Pagada') return false;
      const d = parseDate(r['Fecha']);
      return d && d.year() === anio;
    })
    .reduce((s, r) => s + parseCurrency(r['Total']), 0);
});

// ── Resumen fiscal del trimestre actual (Base/IVA de REGISTRO y GASTOS) ──────
const gastosRecords = computed(() => sheetsStore.tabData['GASTOS']?.records || []);
const currentTrimestre = computed(() => `T${Math.floor(dayjs().month() / 3) + 1}`);
const currentYear = computed(() => dayjs().year());

function isCurrentQuarter(r) {
  if (r['Trim.'] !== currentTrimestre.value) return false;
  const d = parseDate(r['Fecha']);
  return d ? d.year() === currentYear.value : true;
}

const baseFacturadaTrimestre = computed(() =>
  registroRecords.value.filter(isCurrentQuarter).reduce((s, r) => s + parseCurrency(r['Base']), 0)
);
const ivaRepercutido = computed(() =>
  registroRecords.value.filter(isCurrentQuarter).reduce((s, r) => s + parseCurrency(r['IVA']), 0)
);
const ivaSoportado = computed(() =>
  gastosRecords.value.filter(isCurrentQuarter).reduce((s, r) => s + parseCurrency(r['IVA sop.']), 0)
);
const resultadoTrimestre = computed(() => ivaRepercutido.value - ivaSoportado.value);

// Chart — últimos 6 meses (por fecha de servicio/gasto): ingresos vs. gastos
const chartSeries = computed(() => {
  const ingresos = [];
  const gastos = [];
  for (let i = 5; i >= 0; i--) {
    const d = dayjs().subtract(i, 'month');
    const totalIngresos = registroRecords.value
      .filter(r => {
        const rd = parseDate(r['Fecha']);
        return rd && rd.month() === d.month() && rd.year() === d.year();
      })
      .reduce((s, r) => s + parseCurrency(r['Total']), 0);
    const totalGastos = gastosRecords.value
      .filter(r => {
        const rd = parseDate(r['Fecha']);
        return rd && rd.month() === d.month() && rd.year() === d.year();
      })
      .reduce((s, r) => s + parseCurrency(r['Total']), 0);
    ingresos.push(parseFloat(totalIngresos.toFixed(2)));
    gastos.push(parseFloat(totalGastos.toFixed(2)));
  }
  return [
    { name: 'Ingresos (€)', data: ingresos },
    { name: 'Gastos (€)', data: gastos },
  ];
});

// % de variación del mes actual vs. el mes anterior (ingresos)
const monthOverMonthChange = computed(() => {
  const data = chartSeries.value[0]?.data || [];
  const actual = data[data.length - 1] ?? 0;
  const anterior = data[data.length - 2] ?? 0;
  if (!anterior) return null;
  return Math.round(((actual - anterior) / anterior) * 100);
});

const chartCategories = computed(() => {
  const labels = [];
  for (let i = 5; i >= 0; i--) {
    labels.push(dayjs().subtract(i, 'month').format('MMM YY'));
  }
  return labels;
});

const chartOptions = computed(() => ({
  chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'Raleway, sans-serif' },
  theme: { mode: 'dark' },
  colors: ['#2563eb', '#f87171'],
  plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
  legend: { show: true, fontFamily: 'Raleway, sans-serif', fontSize: '0.75rem', labels: { colors: '#94a3b8' } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: chartCategories.value,
    labels: { style: { fontSize: '0.75rem', fontFamily: 'Raleway, sans-serif' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      formatter: v => `${v}€`,
      style: { fontSize: '0.72rem', fontFamily: 'Raleway, sans-serif' },
    },
  },
  grid: { borderColor: 'rgba(100,116,139,0.15)', strokeDashArray: 4 },
  tooltip: { y: { formatter: v => formatCurrency(v) } },
}));

// ── Top clientes / clientes inactivos ────────────────────────────────────────
const topClientes = computed(() => {
  const totals = {};
  registroRecords.value.forEach(r => {
    const nombre = r['Cliente'];
    if (!nombre) return;
    totals[nombre] = (totals[nombre] || 0) + parseCurrency(r['Total']);
  });
  return Object.entries(totals)
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
});

const clientesInactivos = computed(() => {
  const lastByClient = {};
  registroRecords.value.forEach(r => {
    const nombre = r['Cliente'];
    const d = parseDate(r['Fecha']);
    if (!nombre || !d) return;
    if (!lastByClient[nombre] || d.isAfter(lastByClient[nombre])) lastByClient[nombre] = d;
  });
  return databaseStore.clientes
    .map(c => {
      const last = lastByClient[c.nombre];
      return { nombre: c.nombre, dias: last ? dayjs().diff(last, 'day') : null };
    })
    .filter(c => c.dias === null || c.dias > 60)
    .sort((a, b) => (b.dias ?? 99999) - (a.dias ?? 99999))
    .slice(0, 5);
});

// ── Actualizar datos con notificación ────────────────────────────────────────
async function handleRefresh() {
  await syncStore.refreshAll();
  if (syncStore.status === 'success') {
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Datos actualizados', showConfirmButton: false, timer: 2500, timerProgressBar: true });
  } else if (syncStore.status === 'error') {
    Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: syncStore.message || 'Error al actualizar', showConfirmButton: false, timer: 3500, timerProgressBar: true });
  }
}

onMounted(async () => {
  await Promise.all([
    sheetsStore.loadTab('REGISTRO'),
    sheetsStore.loadTab('GASTOS'),
    databaseStore.fetchClientes(),
  ]);
  userStore.startUnreadMessagesListener();
});
</script>

<style scoped>
.db-wrap {
  min-height: 100vh;
  background: #080d1a;
  padding: 36px 24px 60px;
  max-width: 1200px;
  margin: 0 auto;
}

/* ── Cabecera ── */
.db-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 16px;
}
.db-label {
  display: inline-block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--blue);
  background: var(--blue-pale);
  border: 1px solid rgba(37,99,235,0.2);
  border-radius: 20px;
  padding: 3px 14px;
  margin-bottom: 10px;
}
.db-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.4rem;
  color: var(--text);
  margin: 0 0 6px;
  line-height: 1.1;
}
.db-accent { color: var(--blue); }
.db-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: var(--text-muted);
  margin: 0;
  text-transform: capitalize;
}
.db-header-right {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-shrink: 0;
}
.db-new-invoice-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 10px;
  padding: 10px 18px;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
}
.db-new-invoice-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); color: #fff; }

/* ── Stats ── */
.db-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
.db-stat {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 20px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
}
.db-stat:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); color: inherit; }
.db-stat-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.db-stat--blue  .db-stat-icon { background: rgba(37,99,235,0.1);  color: var(--blue); }
.db-stat--red   .db-stat-icon { background: rgba(239,68,68,0.1);  color: #ef4444; }
.db-stat--green .db-stat-icon { background: rgba(22,163,74,0.1);  color: #16a34a; }
.db-stat--yellow .db-stat-icon{ background: rgba(251,191,36,0.1); color: #d97706; }

.db-stat-body { display: flex; flex-direction: column; min-width: 0; }
.db-stat-value {
  font-family: 'Anton', sans-serif;
  font-size: 1.35rem;
  color: var(--text);
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.db-stat-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 2px;
}

/* ── Main grid ── */
.db-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;
}
.db-main--single { grid-template-columns: 1fr; }
.db-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 22px 24px;
  box-shadow: var(--shadow-sm);
}
.db-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.db-card-title {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text);
}
.db-card-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
}
.db-trend--up   { color: #16a34a; font-weight: 700; }
.db-trend--down { color: #ef4444; font-weight: 700; }

.db-empty {
  font-family: 'Raleway', sans-serif;
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.db-stat-loading { color: var(--text-muted); font-size: 1rem; }

.db-pending-list { display: flex; flex-direction: column; gap: 8px; }
.db-pending-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--slate);
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
}
.db-pending-info { display: flex; flex-direction: column; gap: 2px; }
.db-pending-name {
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text);
}
.db-pending-amount {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: #ef4444;
}
.db-pending-amount--positive { color: #16a34a; }

/* ── Resumen fiscal ── */
.db-fiscal {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 22px 24px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 24px;
}
.db-fiscal-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.db-fiscal-item {
  background: var(--slate);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.db-fiscal-item--highlight {
  background: var(--blue-pale);
  border-color: rgba(37,99,235,0.25);
}
.db-fiscal-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.db-fiscal-value {
  font-family: 'Anton', sans-serif;
  font-size: 1.15rem;
  color: var(--text);
}

/* ── Google Sheets Sync ── */
.db-sync-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 18px 22px;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.db-sync-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}
.db-sync-icon {
  width: 40px; height: 40px;
  background: rgba(52,211,153,0.1);
  color: #34d399;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}
.db-sync-info { min-width: 0; }
.db-sync-title {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--text);
}
.db-sync-msg {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}
.db-sync-msg.error   { color: #f87171; }
.db-sync-msg.success { color: #34d399; }
.db-sync-last {
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 2px;
}
.db-sync-badge {
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  flex-shrink: 0;
  background: rgba(100,116,139,0.1);
  color: var(--text-muted);
}
.db-sync-badge.syncing { background: rgba(251,191,36,0.12); color: #fbbf24; }
.db-sync-badge.success { background: rgba(52,211,153,0.12); color: #34d399; }
.db-sync-badge.error   { background: rgba(248,113,113,0.12); color: #f87171; }

.db-sync-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.db-sync-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--slate);
  color: var(--text);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  text-decoration: none;
  white-space: nowrap;
}
.db-sync-btn:hover:not(:disabled) {
  background: rgba(37,99,235,0.08);
  border-color: var(--blue);
  color: var(--blue);
}
.db-sync-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.db-sync-btn--full { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.3); color: #34d399; }
.db-sync-btn--full:hover:not(:disabled) { background: rgba(52,211,153,0.18); }
.db-sync-btn--sheet { background: rgba(37,99,235,0.08); border-color: rgba(37,99,235,0.25); color: var(--blue); }
.db-sync-btn--sheet:hover:not(:disabled) { background: rgba(37,99,235,0.15); }

/* ── Accesos rápidos ── */
.db-shortcuts-title {
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 12px;
}
.db-shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
.db-shortcut {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 18px 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  position: relative;
  box-shadow: var(--shadow-sm);
}
.db-shortcut:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--blue);
  color: var(--text);
}
.db-shortcut-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.15rem;
}
.db-shortcut-badge {
  position: absolute;
  top: 10px; right: 10px;
  background: #ef4444;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  min-width: 16px; height: 16px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px;
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .db-shortcuts-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 800px) {
  .db-stats { grid-template-columns: repeat(2, 1fr); }
  .db-main { grid-template-columns: 1fr; }
  .db-fiscal-grid { grid-template-columns: repeat(2, 1fr); }
  .db-shortcuts-grid { grid-template-columns: repeat(2, 1fr); }
  .db-title { font-size: 1.8rem; }
}
@media (max-width: 480px) {
  .db-wrap { padding: 24px 12px 48px; }
  .db-stats { grid-template-columns: 1fr 1fr; }
  .db-fiscal-grid { grid-template-columns: 1fr 1fr; }
  .db-shortcuts-grid { grid-template-columns: repeat(2, 1fr); }
  .db-header { flex-wrap: wrap; }
  .db-header-right { width: 100%; justify-content: space-between; }
}
</style>
