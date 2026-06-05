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
          <span class="db-stat-value">
            <span v-if="databaseStore.isLoadingLimpiezas && !databaseStore._allLimpiezas.length" class="db-stat-loading">—</span>
            <span v-else>{{ formatCurrency(totalPendiente) }}</span>
          </span>
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

        <!-- Cargando -->
        <div v-if="databaseStore.isLoadingLimpiezas && !databaseStore._allLimpiezas.length" class="db-empty">
          <div class="db-mini-spinner"></div>
          Cargando...
        </div>

        <!-- Error -->
        <div v-else-if="databaseStore.errorLimpiezas && !databaseStore._allLimpiezas.length" class="db-empty db-empty--error">
          <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="me-2" />
          Error al cargar
          <button class="db-retry-btn" @click="databaseStore.fetchLimpiezas()">Reintentar</button>
        </div>

        <!-- Sin pendientes -->
        <div v-else-if="databaseStore.pendingLimpiezas.length === 0" class="db-empty">
          <font-awesome-icon :icon="['fas', 'check']" class="me-2" />No hay pagos pendientes
        </div>

        <!-- Lista -->
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
        <button class="db-sync-btn db-sync-btn--full" @click="syncStore.refreshAll()" :disabled="syncStore.isSyncing || migrating">
          <font-awesome-icon :icon="['fas', 'arrows-rotate']" :spin="syncStore.isSyncing" />
          Actualizar datos
        </button>
        <button class="db-sync-btn db-sync-btn--migrate" @click="showMigrateModal = true" :disabled="syncStore.isSyncing || migrating">
          <font-awesome-icon :icon="['fas', 'database']" />
          Migrar desde Firestore
        </button>
        <a
          href="https://docs.google.com/spreadsheets/d/1Fo2Tu0Y3buEFB9Elvo_SrjjkvwTISYO4cahvkaUmwO8/edit"
          target="_blank" rel="noopener"
          class="db-sync-btn db-sync-btn--sheet"
        >
          <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" />
          Abrir hoja
        </a>
      </div>
    </div>

    <!-- Modal de migración -->
    <Teleport to="body">
      <div v-if="showMigrateModal" class="mg-overlay" @click.self="!migrating && (showMigrateModal = false)">
        <div class="mg-modal">

          <!-- Header -->
          <div class="mg-header">
            <div class="mg-header-icon">
              <font-awesome-icon :icon="['fas', migrating ? 'rotate' : 'database']" :spin="migrating" />
            </div>
            <div>
              <div class="mg-header-title">Migrar datos a Google Sheets</div>
              <div class="mg-header-sub">Copia todos tus datos de Firestore a la hoja de cálculo</div>
            </div>
          </div>

          <!-- Info -->
          <div v-if="!migrating && migrateResult === null" class="mg-info">
            <p>Esta operación copiará <strong>todos los datos actuales de Firestore</strong> a las pestañas de tu Google Sheet:</p>
            <ul>
              <li><font-awesome-icon :icon="['fas', 'check']" class="mg-li-icon" /> Limpiezas (colección <code>limpiezasMensuales</code>)</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="mg-li-icon" /> Clientes (colección <code>clientes</code>)</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="mg-li-icon" /> Gastos (colecciones <code>gastos</code> y <code>gastosMensuales</code>)</li>
            </ul>
            <div class="mg-warning">
              <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
              Si la hoja ya tiene datos, serán <strong>sobreescritos</strong>. Haz una copia de seguridad si es necesario.
            </div>
          </div>

          <!-- Progreso -->
          <div v-if="migrating" class="mg-progress-wrap">
            <div class="mg-progress-bar">
              <div class="mg-progress-fill" :style="{ width: migrateProgress + '%' }"></div>
            </div>
            <div class="mg-progress-msg">{{ migrateMsg }}</div>
          </div>

          <!-- Resultado -->
          <div v-if="migrateResult !== null && !migrating" class="mg-result">
            <div class="mg-result-icon">✓</div>
            <div class="mg-result-title">¡Migración completada!</div>
            <div class="mg-result-stats">
              <div class="mg-stat"><span>{{ migrateResult.limpiezas }}</span> limpiezas</div>
              <div class="mg-stat"><span>{{ migrateResult.clientes }}</span> clientes</div>
              <div class="mg-stat"><span>{{ migrateResult.gastos }}</span> gastos</div>
            </div>
            <p class="mg-result-note">Todos tus datos están ahora en Google Sheets. A partir de ahora, el dashboard lee y escribe directamente en la hoja.</p>
          </div>

          <!-- Acciones -->
          <div class="mg-footer">
            <button v-if="!migrating" class="mg-btn mg-btn--ghost" @click="showMigrateModal = false; migrateResult = null">
              {{ migrateResult !== null ? 'Cerrar' : 'Cancelar' }}
            </button>
            <button
              v-if="migrateResult === null && !migrating"
              class="mg-btn mg-btn--primary"
              @click="runMigration"
            >
              <font-awesome-icon :icon="['fas', 'play']" />
              Iniciar migración
            </button>
            <button v-if="migrateResult !== null && !migrating" class="mg-btn mg-btn--primary" @click="afterMigration">
              <font-awesome-icon :icon="['fas', 'check']" />
              Cargar datos migrados
            </button>
          </div>

        </div>
      </div>
    </Teleport>

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
import { useDatabaseStore } from '../stores/database';
import { useUserStore } from '../stores/user';
import { useSyncStore } from '../stores/syncStore';
import { migrateFromFirestore } from '../services/migrateFB';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const databaseStore = useDatabaseStore();
const userStore     = useUserStore();
const syncStore     = useSyncStore();

// Migración
const showMigrateModal = ref(false);
const migrating        = ref(false);
const migrateProgress  = ref(0);
const migrateMsg       = ref('');
const migrateResult    = ref(null);

async function runMigration() {
  migrating.value  = true;
  migrateResult.value = null;
  try {
    const result = await migrateFromFirestore((msg, pct) => {
      migrateMsg.value      = msg;
      migrateProgress.value = pct;
    });
    migrateResult.value = result;
  } catch (e) {
    migrateMsg.value = `Error: ${e.message}`;
  } finally {
    migrating.value = false;
  }
}

async function afterMigration() {
  showMigrateModal.value = false;
  migrateResult.value    = null;
  await syncStore.refreshAll();
}

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
  theme: { mode: 'dark' },
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.db-empty--error { color: #f87171; }
.db-mini-spinner {
  width: 20px; height: 20px;
  border: 2px solid rgba(96,165,250,0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: db-spin 0.8s linear infinite;
}
@keyframes db-spin { to { transform: rotate(360deg); } }
.db-retry-btn {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(248,113,113,0.1);
  border: 1px solid rgba(248,113,113,0.25);
  color: #f87171;
  border-radius: 6px;
  padding: 4px 12px;
  cursor: pointer;
  transition: background 0.15s;
}
.db-retry-btn:hover { background: rgba(248,113,113,0.18); }
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

/* ── Botón migrar ── */
.db-sync-btn--migrate {
  background: rgba(251,191,36,0.1);
  border-color: rgba(251,191,36,0.3);
  color: #fbbf24;
}
.db-sync-btn--migrate:hover:not(:disabled) {
  background: rgba(251,191,36,0.18);
}

/* ── Modal de migración ── */
.mg-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.mg-modal {
  background: #0f1729;
  border: 1px solid rgba(100,116,139,0.3);
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
.mg-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.mg-header-icon {
  width: 48px; height: 48px;
  background: rgba(251,191,36,0.1);
  color: #fbbf24;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}
.mg-header-title {
  font-family: 'Raleway', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #e2e8f0;
}
.mg-header-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
}
.mg-info {
  font-family: 'Raleway', sans-serif;
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 20px;
}
.mg-info ul {
  padding-left: 0;
  list-style: none;
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mg-info li {
  display: flex;
  align-items: center;
  gap: 8px;
}
.mg-info code {
  background: rgba(100,116,139,0.2);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.78rem;
  color: #38bdf8;
}
.mg-li-icon { color: #34d399; font-size: 0.75rem; }
.mg-warning {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.2);
  border-radius: 8px;
  padding: 12px 14px;
  color: #fbbf24;
  font-size: 0.8rem;
  margin-top: 12px;
}
.mg-progress-wrap { margin-bottom: 20px; }
.mg-progress-bar {
  height: 6px;
  background: rgba(100,116,139,0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
}
.mg-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #34d399);
  border-radius: 3px;
  transition: width 0.4s ease;
}
.mg-progress-msg {
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  color: #94a3b8;
  text-align: center;
}
.mg-result { text-align: center; padding: 8px 0 16px; }
.mg-result-icon {
  font-size: 2.5rem;
  color: #34d399;
  margin-bottom: 8px;
}
.mg-result-title {
  font-family: 'Raleway', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #34d399;
  margin-bottom: 16px;
}
.mg-result-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}
.mg-stat {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  color: #64748b;
  text-align: center;
}
.mg-stat span {
  display: block;
  font-family: 'Anton', sans-serif;
  font-size: 1.6rem;
  color: #e2e8f0;
  line-height: 1;
}
.mg-result-note {
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}
.mg-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  border-top: 1px solid rgba(100,116,139,0.15);
  padding-top: 20px;
}
.mg-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 9px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}
.mg-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.mg-btn--ghost {
  background: rgba(100,116,139,0.12);
  color: #94a3b8;
}
.mg-btn--ghost:hover { background: rgba(100,116,139,0.2); }
.mg-btn--primary {
  background: #2563eb;
  color: #fff;
}
.mg-btn--primary:hover { background: #1d4ed8; }

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
