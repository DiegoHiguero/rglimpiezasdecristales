<template>
  <div class="rf-wrap">
    <div class="rf-header">
      <span class="rf-label">Panel Admin</span>
      <h1 class="rf-title">Registro de <span class="rf-accent">Firmas</span></h1>
      <p class="rf-sub">Captura la firma de cada visita, sin necesidad de tener la factura todavía.</p>
    </div>

    <!-- Captura -->
    <div class="rf-card">
      <div class="rf-card-head">Nueva firma</div>
      <div class="rf-card-body">
        <div class="rf-field rf-autocomplete">
          <label class="rf-field-label">Cliente</label>
          <input
            type="text"
            class="rf-select"
            v-model="clienteQuery"
            @focus="showDropdown = true"
            @blur="onBlurBusqueda"
            placeholder="Buscar cliente por nombre..."
            autocomplete="off"
          />
          <div v-if="showDropdown && clientesFiltrados.length" class="rf-dropdown">
            <div
              v-for="c in clientesFiltrados"
              :key="c.id"
              class="rf-dropdown-item"
              @mousedown.prevent="seleccionarCliente(c)"
            >
              {{ c.nombre }}
            </div>
          </div>
          <div v-else-if="showDropdown && clienteQuery.trim()" class="rf-dropdown">
            <div class="rf-dropdown-item rf-dropdown-item--empty">Sin resultados</div>
          </div>
        </div>

        <div v-if="clienteSeleccionado">
          <SignaturePad @saved="onFirmaCapturada" />
        </div>
        <p v-else class="rf-hint">Elige un cliente para poder firmar.</p>

        <p v-if="guardando" class="rf-hint">Guardando firma...</p>
      </div>
    </div>

    <!-- Firmas del cliente seleccionado -->
    <div v-if="clienteSeleccionado" class="rf-card">
      <div class="rf-card-head">
        Firmas de {{ clienteSeleccionado }}
        <span class="rf-count">{{ firmas.length }}</span>
      </div>
      <div class="rf-card-body">
        <div v-if="cargandoFirmas" class="rf-hint">Cargando...</div>
        <div v-else-if="firmas.length === 0" class="rf-hint">Todavía no hay firmas registradas para este cliente.</div>
        <div v-else class="rf-firmas-grid">
          <div v-for="f in firmas" :key="f.id" class="rf-firma-item">
            <img :src="f.url" alt="Firma" class="rf-firma-img" />
            <span class="rf-firma-date">{{ formatDate(f.fecha) }}</span>
            <span class="rf-badge" :class="f.facturaId ? 'rf-badge--linked' : 'rf-badge--pending'">
              {{ f.facturaId ? `Factura ${f.facturaId}` : 'Sin facturar' }}
            </span>
            <button v-if="!f.facturaId" class="rf-delete-btn" title="Borrar" @click="onDeleteFirma(f)">
              <font-awesome-icon :icon="['fas', 'trash-can']" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useDatabaseStore } from '../stores/database';
import SignaturePad from '../components/SignaturePad.vue';
import { ensurePortalToken, captureFirma, getFirmasCliente, deleteFirma } from '../services/portal';
import dayjs from 'dayjs';

const databaseStore = useDatabaseStore();

const clienteSeleccionado = ref('');
const clienteQuery = ref('');
const showDropdown = ref(false);
const firmas = ref([]);
const cargandoFirmas = ref(false);
const guardando = ref(false);
let tokenActual = null;

const clientesFiltrados = computed(() => {
  const q = clienteQuery.value.trim().toLowerCase();
  const lista = q
    ? databaseStore.clientes.filter((c) => c.nombre.toLowerCase().includes(q))
    : databaseStore.clientes;
  return lista.slice(0, 8);
});

function seleccionarCliente(cliente) {
  clienteSeleccionado.value = cliente.nombre;
  clienteQuery.value = cliente.nombre;
  showDropdown.value = false;
}

function onBlurBusqueda() {
  // Pequeño margen para que el click en un resultado (mousedown) se registre
  // antes de cerrar el desplegable.
  setTimeout(() => { showDropdown.value = false; }, 150);
}

const formatDate = (iso) => {
  const d = dayjs(iso);
  return d.isValid() ? d.format('DD/MM/YYYY HH:mm') : '';
};

async function cargarFirmas() {
  const cliente = databaseStore.clientes.find((c) => c.nombre === clienteSeleccionado.value);
  if (!cliente) { firmas.value = []; tokenActual = null; return; }
  cargandoFirmas.value = true;
  try {
    tokenActual = await ensurePortalToken(cliente.nombre, cliente.email, cliente.direccion);
    firmas.value = await getFirmasCliente(tokenActual);
  } catch (error) {
    console.error('Error al cargar las firmas del cliente:', error);
    firmas.value = [];
  } finally {
    cargandoFirmas.value = false;
  }
}

watch(clienteSeleccionado, cargarFirmas);

onMounted(() => {
  if (!databaseStore.clientes.length) databaseStore.fetchClientes();
});

async function onFirmaCapturada(dataUrl) {
  if (!tokenActual) return;
  guardando.value = true;
  try {
    await captureFirma(tokenActual, dataUrl);
    await cargarFirmas();
  } catch (error) {
    console.error('Error al guardar la firma:', error);
    alert('No se pudo guardar la firma.');
  } finally {
    guardando.value = false;
  }
}

async function onDeleteFirma(firma) {
  if (!confirm('¿Borrar esta firma?')) return;
  try {
    await deleteFirma(tokenActual, firma.id, `firmas/${tokenActual}/${firma.id}.png`);
    firmas.value = firmas.value.filter((f) => f.id !== firma.id);
  } catch (error) {
    console.error('Error al borrar la firma:', error);
    alert('No se pudo borrar la firma.');
  }
}
</script>

<style scoped>
.rf-wrap {
  min-height: 100vh;
  background: #080d1a;
  padding: 36px 24px 60px;
  max-width: 900px;
  margin: 0 auto;
}
.rf-header { margin-bottom: 24px; }
.rf-label {
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
.rf-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: #f1f5f9; margin: 0 0 6px; }
.rf-accent { color: #60a5fa; }
.rf-sub { font-family: 'Raleway', sans-serif; font-size: 0.88rem; color: #64748b; margin: 0; }

.rf-card {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  margin-bottom: 20px;
}
.rf-card-head {
  padding: 16px 22px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 10px;
}
.rf-count {
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(96,165,250,0.15);
  color: #60a5fa;
  border: 1px solid rgba(96,165,250,0.25);
  border-radius: 12px;
  padding: 1px 9px;
}
.rf-card-body { padding: 20px 22px; }

.rf-field { margin-bottom: 16px; }
.rf-field-label {
  display: block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 6px;
}
.rf-select {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #f1f5f9;
  font-family: 'Raleway', sans-serif;
  font-size: 0.9rem;
  padding: 10px 12px;
  outline: none;
}
.rf-select option { background: #0f1729; }

.rf-autocomplete { position: relative; }
.rf-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.5);
  max-height: 240px;
  overflow-y: auto;
  z-index: 20;
}
.rf-dropdown-item {
  padding: 9px 12px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.86rem;
  color: #e2e8f0;
  cursor: pointer;
}
.rf-dropdown-item:hover { background: rgba(96,165,250,0.12); }
.rf-dropdown-item--empty { color: #64748b; cursor: default; }
.rf-dropdown-item--empty:hover { background: none; }

.rf-hint { font-family: 'Raleway', sans-serif; font-size: 0.84rem; color: #64748b; }

.rf-firmas-grid { display: flex; flex-wrap: wrap; gap: 14px; }
.rf-firma-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  padding: 10px;
  width: 130px;
  position: relative;
}
.rf-firma-img { height: 60px; background: #fff; border-radius: 6px; }
.rf-firma-date { font-family: 'Raleway', sans-serif; font-size: 0.68rem; color: #64748b; }
.rf-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
}
.rf-badge--pending { background: rgba(251,191,36,0.15); color: #fbbf24; }
.rf-badge--linked  { background: rgba(52,211,153,0.15); color: #34d399; }
.rf-delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239,68,68,0.15);
  color: #f87171;
  border: none;
  border-radius: 6px;
  width: 22px;
  height: 22px;
  font-size: 0.7rem;
  cursor: pointer;
}

@media (max-width: 480px) {
  .rf-wrap { padding: 24px 12px 48px; }
}
</style>
