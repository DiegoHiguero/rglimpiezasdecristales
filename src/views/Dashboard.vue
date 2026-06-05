<template>
  <div class="db-wrap">

    <!-- Cabecera -->
    <div class="db-header">
      <div class="db-header-left">
        <span class="db-label">Panel de Control</span>
        <h1 class="db-title">Bienvenido, <span class="db-accent">{{ firstName }}</span></h1>
        <p class="db-sub">{{ todayFormatted }}</p>
      </div>
      <img src="../assets/img/ROYAL_CLEAN_2025_BLANCO.png" class="db-logo" alt="Royall Clean" />
    </div>

    <!-- Stats -->
    <div class="db-stats">
      <div class="db-stat db-stat--blue">
        <div class="db-stat-icon"><font-awesome-icon :icon="['fas', 'address-card']" /></div>
        <div class="db-stat-body">
          <span class="db-stat-value">{{ databaseStore.clientes.length }}</span>
          <span class="db-stat-label">Clientes</span>
        </div>
      </div>
      <div class="db-stat db-stat--red">
        <div class="db-stat-icon"><font-awesome-icon :icon="['fas', 'hand-holding-dollar']" /></div>
        <div class="db-stat-body">
          <span class="db-stat-value">{{ formatCurrency(totalPendiente) }}</span>
          <span class="db-stat-label">Pendiente de cobro</span>
        </div>
      </div>
      <div class="db-stat db-stat--green">
        <div class="db-stat-icon"><font-awesome-icon :icon="['fas', 'hand-holding-dollar']" /></div>
        <div class="db-stat-body">
          <span class="db-stat-value">{{ formatCurrency(totalCobradoMes) }}</span>
          <span class="db-stat-label">Cobrado este mes</span>
        </div>
      </div>
      <div class="db-stat db-stat--yellow">
        <div class="db-stat-icon"><font-awesome-icon :icon="['fas', 'file-invoice']" /></div>
        <div class="db-stat-body">
          <span class="db-stat-value">{{ userStore.unreadMessagesCount }}</span>
          <span class="db-stat-label">Mensajes sin leer</span>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="db-main">

      <!-- Gráfico de ingresos -->
      <div class="db-card db-card--chart">
        <div class="db-card-head">
          <span class="db-card-title">Ingresos mensuales</span>
          <span class="db-card-sub">Últimos 6 meses · Bruto (€)</span>
        </div>
        <apexchart
          type="bar"
          height="220"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>

      <!-- Pagos pendientes recientes -->
      <div class="db-card db-card--pending">
        <div class="db-card-head">
          <span class="db-card-title">Pagos pendientes</span>
          <router-link to="/registro" class="db-card-link">Ver todos</router-link>
        </div>
        <div v-if="databaseStore.pendingLimpiezas.length === 0" class="db-empty">
          <font-awesome-icon :icon="['fas', 'check']" class="me-2" />No hay pagos pendientes
        </div>
        <div v-else class="db-pending-list">
          <div v-for="l in pendingTop" :key="l.id" class="db-pending-item">
            <div class="db-pending-info">
              <span class="db-pending-name">{{ getClientName(l.clienteId) }}</span>
              <span class="db-pending-date">Fac. #{{ l.factura }}</span>
            </div>
            <span class="db-pending-amount">{{ formatCurrency(l.precioBruto) }}</span>
          </div>
        </div>
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
import { computed, onMounted } from 'vue';
import { useDatabaseStore } from '../stores/database';
import { useUserStore } from '../stores/user';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const databaseStore = useDatabaseStore();
const userStore = useUserStore();

const firstName = computed(() => {
  const email = userStore.userData?.email || '';
  if (email.includes('roys')) return 'Roys';
  if (email.includes('diego') || email.includes('higuero')) return 'Diego';
  return 'Admin';
});

const todayFormatted = computed(() =>
  dayjs().format('dddd, D [de] MMMM [de] YYYY')
);

const formatCurrency = (v) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(Number(v) || 0);

const getClientName = (clientId) => {
  const c = databaseStore.getClientById?.(clientId) || databaseStore.clientes?.find(x => x.id === clientId);
  return c ? `${c.nombre} ${c.apellido || ''}`.trim() : '—';
};

const totalPendiente = computed(() =>
  databaseStore.pendingLimpiezas.reduce((s, l) => s + (l.precioBruto || 0), 0)
);

const totalCobradoMes = computed(() => {
  const mes = dayjs().month();
  const anio = dayjs().year();
  return databaseStore.limpiezas
    .filter(l => l.fechaPago && dayjs(l.fechaPago).month() === mes && dayjs(l.fechaPago).year() === anio)
    .reduce((s, l) => s + (l.precioBruto || 0), 0);
});

const pendingTop = computed(() =>
  [...databaseStore.pendingLimpiezas].slice(0, 6)
);

// Chart — últimos 6 meses
const chartSeries = computed(() => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = dayjs().subtract(i, 'month');
    const total = databaseStore.limpiezas
      .filter(l => l.fechaPago && dayjs(l.fechaPago).month() === d.month() && dayjs(l.fechaPago).year() === d.year())
      .reduce((s, l) => s + (l.precioBruto || 0), 0);
    months.push(parseFloat(total.toFixed(2)));
  }
  return [{ name: 'Ingresos (€)', data: months }];
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
  theme: { mode: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light' },
  colors: ['#2563eb'],
  plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } },
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

onMounted(async () => {
  await Promise.all([
    databaseStore.fetchLimpiezas(),
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
.db-logo {
  height: 40px;
  width: auto;
  opacity: 0.85;
  flex-shrink: 0;
}

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
}
.db-stat:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
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
.db-card-link {
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--blue);
  text-decoration: none;
  transition: opacity 0.2s;
}
.db-card-link:hover { opacity: 0.75; }

.db-empty {
  font-family: 'Raleway', sans-serif;
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
  padding: 24px 0;
}

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
.db-pending-date {
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  color: var(--text-muted);
}
.db-pending-amount {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: #ef4444;
}

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
  .db-shortcuts-grid { grid-template-columns: repeat(2, 1fr); }
  .db-title { font-size: 1.8rem; }
}
@media (max-width: 480px) {
  .db-wrap { padding: 24px 12px 48px; }
  .db-stats { grid-template-columns: 1fr 1fr; }
  .db-shortcuts-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
