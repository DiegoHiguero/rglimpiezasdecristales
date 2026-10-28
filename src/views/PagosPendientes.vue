<template>
  <div class="pp-wrap">
    <div class="pp-header">
      <span class="pp-label">Panel Admin</span>
      <h1 class="pp-title">Pagos <span class="pp-accent">Pendientes</span></h1>
      <p class="pp-sub">{{ pendingLimpiezas.length }} factura(s) sin cobrar · {{ formatCurrency(totalPendiente) }}</p>
    </div>

    <div class="pp-card">
      <!-- Cargando -->
      <div v-if="registroLoading && !registroRecords.length" class="pp-state">
        <div class="pp-spinner"></div>
        Cargando...
      </div>

      <!-- Error -->
      <div v-else-if="registroError && !registroRecords.length" class="pp-state pp-state--error">
        <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="me-2" />
        Error al cargar
        <button class="pp-retry-btn" @click="sheetsStore.loadTab('REGISTRO')">Reintentar</button>
      </div>

      <!-- Sin pendientes -->
      <div v-else-if="pendingLimpiezas.length === 0" class="pp-state">
        <font-awesome-icon :icon="['fas', 'check']" class="me-2" />No hay pagos pendientes
      </div>

      <!-- Lista completa -->
      <div v-else class="pp-list">
        <div v-for="r in pendingLimpiezas" :key="r._row" class="pp-item">
          <div class="pp-item-info">
            <span class="pp-item-name">{{ r['Cliente'] }}</span>
            <span class="pp-item-meta">
              Fac. {{ r['Nº Factura'] }} · {{ r['Fecha'] }}
              <span v-if="daysOverdue(r) !== null" class="pp-days" :class="{ 'pp-days--overdue': daysOverdue(r) > 30 }">
                · {{ daysOverdue(r) }} días
              </span>
            </span>
          </div>
          <span class="pp-amount">{{ r['Total'] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useSheetsStore } from '../stores/sheetsStore';
import dayjs from 'dayjs';

const sheetsStore = useSheetsStore();

function parseCurrency(str) {
  if (!str) return 0;
  return parseFloat(String(str).replace(/[€\s]/g, '').replace(/\./g, '').replace(',', '.')) || 0;
}

function parseDate(str) {
  if (!str) return null;
  const p = String(str).split('/');
  if (p.length !== 3) return null;
  return dayjs(`${p[2]}-${p[1]}-${p[0]}`);
}

const formatCurrency = (v) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(Number(v) || 0);

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

function daysOverdue(r) {
  const d = parseDate(r['Fecha']);
  if (!d || !d.isValid()) return null;
  return Math.max(0, dayjs().diff(d, 'day'));
}

onMounted(() => {
  sheetsStore.loadTab('REGISTRO');
});
</script>

<style scoped>
.pp-wrap {
  min-height: 100vh;
  background: #080d1a;
  padding: 36px 24px 60px;
  max-width: 800px;
  margin: 0 auto;
}
.pp-header { margin-bottom: 24px; }
.pp-label {
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
.pp-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: #f1f5f9; margin: 0 0 6px; }
.pp-accent { color: #f87171; }
.pp-sub { font-family: 'Raleway', sans-serif; font-size: 0.88rem; color: #64748b; margin: 0; }

.pp-card {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  overflow: hidden;
}

.pp-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 60px 20px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #64748b;
}
.pp-state--error { color: #f87171; }
.pp-spinner {
  width: 28px; height: 28px;
  border: 3px solid rgba(96,165,250,0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: pp-spin 0.8s linear infinite;
}
@keyframes pp-spin { to { transform: rotate(360deg); } }
.pp-retry-btn {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(248,113,113,0.1);
  border: 1px solid rgba(248,113,113,0.25);
  color: #f87171;
  border-radius: 6px;
  padding: 4px 12px;
  cursor: pointer;
}

.pp-list { display: flex; flex-direction: column; }
.pp-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 22px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.pp-item:last-child { border-bottom: none; }
.pp-item-info { display: flex; flex-direction: column; gap: 3px; }
.pp-item-name { font-family: 'Raleway', sans-serif; font-size: 0.9rem; font-weight: 700; color: #f1f5f9; }
.pp-item-meta { font-family: 'Raleway', sans-serif; font-size: 0.76rem; color: #64748b; }
.pp-days { font-weight: 700; }
.pp-days--overdue { color: #ef4444; }
.pp-amount { font-family: 'Anton', sans-serif; font-size: 1.05rem; color: #ef4444; white-space: nowrap; }

@media (max-width: 480px) {
  .pp-wrap { padding: 24px 12px 48px; }
}
</style>
