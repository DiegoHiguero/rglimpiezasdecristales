<template>
  <div class="rf-wrap">
    <div class="rf-header">
      <span class="rf-label">Panel Admin</span>
      <h1 class="rf-title">Registro de <span class="rf-accent">Firmas</span></h1>
      <p class="rf-sub">
        Captura la firma de cada visita, sin necesidad de tener la factura todavía.
        <span v-if="pendientesGlobal.length" class="rf-count rf-count--warn">{{ pendientesGlobal.length }} sin facturar</span>
      </p>
    </div>

    <!-- Migración única (temporal): consolida datos antiguos de las
         subcolecciones facturas/firmas en los nuevos campos array del
         portal público, tras el fix de seguridad. Bórrame cuando ya se
         haya ejecutado una vez. -->
    <div class="rf-card">
      <div class="rf-card-head">Migración del portal (una sola vez)</div>
      <div class="rf-card-body">
        <p class="rf-hint">
          Consolida las facturas/firmas antiguas del portal de clientes en el nuevo formato seguro.
          Es seguro pulsarlo varias veces.
        </p>
        <button class="rf-migrate-btn" @click="onMigrar" :disabled="migrando">
          {{ migrando ? 'Migrando...' : 'Migrar datos antiguos del portal' }}
        </button>
        <p v-if="migracionResultado" class="rf-hint">{{ migracionResultado }}</p>
      </div>
    </div>

    <!-- Vista global: firmas pendientes de facturar de TODOS los clientes -->
    <div class="rf-card">
      <div class="rf-card-head">
        Firmas pendientes de facturar
        <span class="rf-count">{{ pendientesGlobal.length }}</span>
      </div>
      <div class="rf-card-body">
        <div v-if="cargandoPendientesGlobal" class="rf-hint">Cargando...</div>
        <div v-else-if="pendientesGlobal.length === 0" class="rf-hint">No hay firmas sin facturar. Todo al día.</div>
        <div v-else class="rf-pending-list">
          <button
            v-for="p in pendientesGlobal"
            :key="p.token + p.id"
            type="button"
            class="rf-pending-item"
            @click="seleccionarClienteDesdeGlobal(p.clienteNombre)"
          >
            <img :src="p.url" alt="Firma" class="rf-pending-thumb" />
            <span class="rf-pending-info">
              <span class="rf-pending-name">{{ p.clienteNombre }}</span>
              <span class="rf-pending-date">{{ formatDate(p.fecha) }} · {{ formatRelative(p.fecha) }}</span>
            </span>
          </button>
        </div>
      </div>
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
              <span v-if="pendientesPorCliente.get(c.nombre)" class="rf-dropdown-badge">{{ pendientesPorCliente.get(c.nombre) }} pend.</span>
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
    <div v-if="clienteSeleccionado" class="rf-card" ref="clienteCardRef">
      <div class="rf-card-head">
        Firmas de {{ clienteSeleccionado }}
        <span class="rf-count">{{ firmas.length }}</span>
        <a v-if="tokenActual" :href="'/portal/' + tokenActual" target="_blank" rel="noopener" class="rf-portal-link">
          Ver portal <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" />
        </a>
      </div>
      <div class="rf-card-body">
        <div v-if="firmas.length" class="rf-filtros">
          <button type="button" class="rf-filtro" :class="{ 'rf-filtro--activo': filtroEstado === 'todas' }" @click="filtroEstado = 'todas'">Todas</button>
          <button type="button" class="rf-filtro" :class="{ 'rf-filtro--activo': filtroEstado === 'pendiente' }" @click="filtroEstado = 'pendiente'">Sin facturar</button>
          <button type="button" class="rf-filtro" :class="{ 'rf-filtro--activo': filtroEstado === 'vinculada' }" @click="filtroEstado = 'vinculada'">Vinculadas</button>
        </div>

        <div v-if="cargandoFirmas" class="rf-hint">Cargando...</div>
        <div v-else-if="firmas.length === 0" class="rf-hint">Todavía no hay firmas registradas para este cliente.</div>
        <div v-else-if="firmasFiltradas.length === 0" class="rf-hint">Nada que mostrar con este filtro.</div>
        <div v-else class="rf-firmas-grid">
          <div v-for="f in firmasFiltradas" :key="f.id" class="rf-firma-item">
            <img :src="f.url" alt="Firma" class="rf-firma-img" @click="lightboxFirma = f" />

            <template v-if="editingFechaId === f.id">
              <input type="datetime-local" class="rf-fecha-input" v-model="editFechaValue" />
              <div class="rf-fecha-actions">
                <button class="rf-fecha-btn rf-fecha-btn--ok" @click="saveEditFecha(f)" title="Guardar"><font-awesome-icon :icon="['fas', 'check']" /></button>
                <button class="rf-fecha-btn" @click="editingFechaId = null" title="Cancelar"><font-awesome-icon :icon="['fas', 'xmark']" /></button>
              </div>
            </template>
            <span v-else class="rf-firma-date" @click="startEditFecha(f)" title="Editar fecha">
              {{ formatDate(f.fecha) }}
              <font-awesome-icon :icon="['fas', 'file-pen']" class="rf-edit-icon" />
            </span>

            <span class="rf-badge" :class="f.facturaId ? 'rf-badge--linked' : 'rf-badge--pending'">
              {{ f.facturaId ? `Factura ${f.facturaId}` : 'Sin facturar' }}
            </span>

            <div class="rf-firma-actions">
              <button v-if="!f.facturaId" class="rf-action-btn" title="Vincular a factura" @click="vinculandoId = vinculandoId === f.id ? null : f.id">
                <font-awesome-icon :icon="['fas', 'link']" />
              </button>
              <button v-if="!f.facturaId" class="rf-action-btn rf-action-btn--danger" title="Borrar" @click="onDeleteFirma(f)">
                <font-awesome-icon :icon="['fas', 'trash-can']" />
              </button>
            </div>

            <div v-if="vinculandoId === f.id" class="rf-vincular-box">
              <select v-model="vincularSeleccion" class="rf-vincular-select">
                <option value="" disabled>Elige factura...</option>
                <option v-for="fac in facturasCliente" :key="fac.id" :value="fac.id">
                  #{{ fac.id }} · {{ formatDate(fac.fecha) }}
                </option>
              </select>
              <button class="rf-fecha-btn rf-fecha-btn--ok" :disabled="!vincularSeleccion" @click="confirmarVincular(f)" title="Vincular">
                <font-awesome-icon :icon="['fas', 'check']" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox: firma en grande -->
    <Teleport to="body">
      <div v-if="lightboxFirma" class="rf-lightbox-backdrop" @click="lightboxFirma = null">
        <div class="rf-lightbox">
          <img :src="lightboxFirma.url" alt="Firma" class="rf-lightbox-img" />
          <p class="rf-lightbox-info">{{ formatDate(lightboxFirma.fecha) }}</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useDatabaseStore } from '../stores/database';
import SignaturePad from '../components/SignaturePad.vue';
import {
  ensurePortalToken, captureFirma, getFirmasCliente, deleteFirma,
  migrateAllPortalSubcollections, getAllPendingFirmas, getFacturasCliente,
  updateFirmaFecha, linkFirmasToFactura,
} from '../services/portal';
import dayjs from 'dayjs';

const databaseStore = useDatabaseStore();

const migrando = ref(false);
const migracionResultado = ref('');
async function onMigrar() {
  migrando.value = true;
  migracionResultado.value = '';
  try {
    const n = await migrateAllPortalSubcollections();
    migracionResultado.value = n > 0 ? `Listo: ${n} cliente(s) migrado(s).` : 'Listo: no había nada pendiente de migrar.';
  } catch (error) {
    console.error('Error migrando el portal:', error);
    migracionResultado.value = 'Error al migrar. Revisa la consola.';
  } finally {
    migrando.value = false;
  }
}

const clienteSeleccionado = ref('');
const clienteQuery = ref('');
const showDropdown = ref(false);
const firmas = ref([]);
const facturasCliente = ref([]);
const cargandoFirmas = ref(false);
const guardando = ref(false);
const tokenActual = ref(null);
const clienteCardRef = ref(null);
const filtroEstado = ref('todas');
const lightboxFirma = ref(null);
const editingFechaId = ref(null);
const editFechaValue = ref('');
const vinculandoId = ref(null);
const vincularSeleccion = ref('');

const pendientesGlobal = ref([]);
const cargandoPendientesGlobal = ref(false);

const pendientesPorCliente = computed(() => {
  const map = new Map();
  for (const p of pendientesGlobal.value) {
    map.set(p.clienteNombre, (map.get(p.clienteNombre) || 0) + 1);
  }
  return map;
});

async function cargarPendientesGlobal() {
  cargandoPendientesGlobal.value = true;
  try {
    pendientesGlobal.value = await getAllPendingFirmas();
  } catch (error) {
    console.error('Error al cargar las firmas pendientes globales:', error);
  } finally {
    cargandoPendientesGlobal.value = false;
  }
}

const firmasFiltradas = computed(() => {
  if (filtroEstado.value === 'pendiente') return firmas.value.filter((f) => !f.facturaId);
  if (filtroEstado.value === 'vinculada') return firmas.value.filter((f) => f.facturaId);
  return firmas.value;
});

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
  filtroEstado.value = 'todas';
}

function seleccionarClienteDesdeGlobal(nombre) {
  const cliente = databaseStore.clientes.find((c) => c.nombre === nombre);
  if (cliente) seleccionarCliente(cliente);
  else { clienteSeleccionado.value = nombre; clienteQuery.value = nombre; filtroEstado.value = 'todas'; }
  nextTick(() => clienteCardRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
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

const formatRelative = (iso) => {
  const d = dayjs(iso);
  if (!d.isValid()) return '';
  const days = dayjs().diff(d, 'day');
  if (days <= 0) return 'hoy';
  if (days === 1) return 'hace 1 día';
  return `hace ${days} días`;
};

async function cargarFirmas() {
  const cliente = databaseStore.clientes.find((c) => c.nombre === clienteSeleccionado.value);
  if (!cliente) { firmas.value = []; facturasCliente.value = []; tokenActual.value = null; return; }
  cargandoFirmas.value = true;
  try {
    tokenActual.value = await ensurePortalToken(cliente.nombre, cliente.email, cliente.direccion);
    const [firmasData, facturasData] = await Promise.all([
      getFirmasCliente(tokenActual.value),
      getFacturasCliente(tokenActual.value),
    ]);
    firmas.value = firmasData;
    facturasCliente.value = facturasData;
  } catch (error) {
    console.error('Error al cargar las firmas del cliente:', error);
    firmas.value = [];
    facturasCliente.value = [];
  } finally {
    cargandoFirmas.value = false;
  }
}

watch(clienteSeleccionado, cargarFirmas);

onMounted(() => {
  if (!databaseStore.clientes.length) databaseStore.fetchClientes();
  cargarPendientesGlobal();
});

async function onFirmaCapturada(dataUrl) {
  if (!tokenActual.value) return;
  guardando.value = true;
  try {
    await captureFirma(tokenActual.value, dataUrl);
    await cargarFirmas();
    await cargarPendientesGlobal();
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
    await deleteFirma(tokenActual.value, firma.id, `firmas/${tokenActual.value}/${firma.id}.png`);
    firmas.value = firmas.value.filter((f) => f.id !== firma.id);
    await cargarPendientesGlobal();
  } catch (error) {
    console.error('Error al borrar la firma:', error);
    alert('No se pudo borrar la firma.');
  }
}

function startEditFecha(firma) {
  editingFechaId.value = firma.id;
  const d = dayjs(firma.fecha);
  editFechaValue.value = d.isValid() ? d.format('YYYY-MM-DDTHH:mm') : '';
}

async function saveEditFecha(firma) {
  if (!editFechaValue.value) { editingFechaId.value = null; return; }
  const nuevaFechaISO = dayjs(editFechaValue.value).toISOString();
  try {
    await updateFirmaFecha(tokenActual.value, firma.id, nuevaFechaISO);
    firma.fecha = nuevaFechaISO;
    editingFechaId.value = null;
    await cargarPendientesGlobal();
  } catch (error) {
    console.error('Error al actualizar la fecha de la firma:', error);
    alert('No se pudo actualizar la fecha.');
  }
}

async function confirmarVincular(firma) {
  if (!vincularSeleccion.value) return;
  try {
    await linkFirmasToFactura(tokenActual.value, vincularSeleccion.value, [firma.id]);
    firma.facturaId = vincularSeleccion.value;
    vinculandoId.value = null;
    vincularSeleccion.value = '';
    await cargarPendientesGlobal();
  } catch (error) {
    console.error('Error al vincular la firma a la factura:', error);
    alert('No se pudo vincular la firma.');
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
.rf-sub { font-family: 'Raleway', sans-serif; font-size: 0.88rem; color: #64748b; margin: 0; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

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
.rf-count--warn { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
.rf-card-body { padding: 20px 22px; }

.rf-portal-link {
  margin-left: auto;
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #60a5fa;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.rf-portal-link:hover { text-decoration: underline; }

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.rf-dropdown-item:hover { background: rgba(96,165,250,0.12); }
.rf-dropdown-item--empty { color: #64748b; cursor: default; }
.rf-dropdown-item--empty:hover { background: none; }
.rf-dropdown-badge {
  font-size: 0.64rem;
  font-weight: 700;
  color: #fbbf24;
  background: rgba(251,191,36,0.15);
  border-radius: 10px;
  padding: 1px 7px;
  flex-shrink: 0;
}

.rf-hint { font-family: 'Raleway', sans-serif; font-size: 0.84rem; color: #64748b; }

.rf-migrate-btn {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.84rem;
  background: rgba(96,165,250,0.15);
  color: #60a5fa;
  border: 1px solid rgba(96,165,250,0.3);
  border-radius: 10px;
  padding: 9px 16px;
  cursor: pointer;
  margin: 6px 0;
  transition: opacity 0.2s;
}
.rf-migrate-btn:hover { opacity: 0.85; }
.rf-migrate-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Vista global de pendientes ── */
.rf-pending-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 360px;
  overflow-y: auto;
}
.rf-pending-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;
}
.rf-pending-item:hover { background: rgba(96,165,250,0.08); border-color: rgba(96,165,250,0.2); }
.rf-pending-thumb { height: 36px; background: #fff; border-radius: 5px; flex-shrink: 0; }
.rf-pending-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.rf-pending-name { font-family: 'Raleway', sans-serif; font-size: 0.86rem; font-weight: 700; color: #e2e8f0; }
.rf-pending-date { font-family: 'Raleway', sans-serif; font-size: 0.7rem; color: #64748b; }

/* ── Filtros ── */
.rf-filtros { display: flex; gap: 6px; margin-bottom: 16px; }
.rf-filtro {
  font-family: 'Raleway', sans-serif;
  font-size: 0.76rem;
  font-weight: 600;
  background: rgba(255,255,255,0.04);
  color: #64748b;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 5px 13px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.rf-filtro:hover { color: #94a3b8; }
.rf-filtro--activo { background: rgba(96,165,250,0.15); color: #60a5fa; border-color: rgba(96,165,250,0.3); }

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
  width: 140px;
  position: relative;
}
.rf-firma-img { height: 60px; background: #fff; border-radius: 6px; cursor: zoom-in; }
.rf-firma-date {
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.rf-edit-icon { font-size: 0.6rem; opacity: 0.6; }
.rf-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
}
.rf-badge--pending { background: rgba(251,191,36,0.15); color: #fbbf24; }
.rf-badge--linked  { background: rgba(52,211,153,0.15); color: #34d399; }

.rf-firma-actions { display: flex; gap: 6px; margin-top: 2px; }
.rf-action-btn {
  background: rgba(96,165,250,0.15);
  color: #60a5fa;
  border: none;
  border-radius: 6px;
  width: 22px;
  height: 22px;
  font-size: 0.68rem;
  cursor: pointer;
}
.rf-action-btn--danger { background: rgba(239,68,68,0.15); color: #f87171; }

.rf-fecha-input {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(96,165,250,0.3);
  border-radius: 6px;
  color: #f1f5f9;
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem;
  padding: 3px 4px;
}
.rf-fecha-actions { display: flex; gap: 4px; }
.rf-fecha-btn {
  background: rgba(255,255,255,0.06);
  color: #94a3b8;
  border: none;
  border-radius: 6px;
  width: 20px;
  height: 20px;
  font-size: 0.62rem;
  cursor: pointer;
}
.rf-fecha-btn--ok { background: rgba(52,211,153,0.15); color: #34d399; }
.rf-fecha-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.rf-vincular-box {
  display: flex;
  gap: 4px;
  width: 100%;
  margin-top: 4px;
}
.rf-vincular-select {
  flex: 1;
  min-width: 0;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(96,165,250,0.3);
  border-radius: 6px;
  color: #f1f5f9;
  font-family: 'Raleway', sans-serif;
  font-size: 0.66rem;
  padding: 3px;
}
.rf-vincular-select option { background: #0f1729; }

/* ── Lightbox ── */
.rf-lightbox-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.rf-lightbox {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
  max-width: 90vw;
  text-align: center;
}
.rf-lightbox-img { max-width: 100%; max-height: 60vh; background: #fff; border-radius: 8px; }
.rf-lightbox-info { font-family: 'Raleway', sans-serif; font-size: 0.84rem; color: #94a3b8; margin: 12px 0 0; }

@media (max-width: 480px) {
  .rf-wrap { padding: 24px 12px 48px; }
}
</style>
