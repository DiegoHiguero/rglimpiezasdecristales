<template>
  <div class="sv-page">

    <!-- Header -->
    <div class="sv-header">
      <div>
        <span class="sv-label">Google Sheets</span>
        <h1 class="sv-title"><span class="sv-accent">{{ tabName }}</span></h1>
      </div>
      <div class="sv-header-actions">
        <button class="sv-btn sv-btn--secondary" @click="reload" :disabled="tab?.loading" title="Actualizar">
          <font-awesome-icon :icon="['fas', 'arrows-rotate']" :class="{ 'sv-spin': tab?.loading }" />
        </button>
        <button class="sv-btn sv-btn--primary" @click="openModal(null)">
          <font-awesome-icon :icon="['fas', 'plus']" />
          Nuevo registro
        </button>
      </div>
    </div>

    <!-- Cargando (primera vez) -->
    <div v-if="tab?.loading && !tab?.records?.length" class="sv-state">
      <div class="sv-spinner"></div>
      <span>Cargando datos de Sheets...</span>
    </div>

    <!-- Error -->
    <div v-else-if="tab?.error" class="sv-state sv-state--error">
      <font-awesome-icon :icon="['fas', 'triangle-exclamation']" />
      <span>{{ tab.error }}</span>
    </div>

    <!-- Tabla -->
    <template v-else-if="tab?.headers?.length">
      <div class="sv-toolbar">
        <div class="sv-search-wrap">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="sv-search-icon" />
          <input v-model="search" placeholder="Buscar en todos los campos..." class="sv-search" />
        </div>
        <span class="sv-count">{{ filtered.length }} registros</span>
      </div>

      <div class="sv-table-scroll">
        <table class="sv-table">
          <thead>
            <tr>
              <th v-for="h in tab.headers" :key="h">{{ h }}</th>
              <th class="sv-th-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filtered" :key="row._row">
              <td v-for="h in tab.headers" :key="h">
                <span class="sv-cell" :title="String(row[h])">{{ row[h] }}</span>
              </td>
              <td class="sv-td-actions">
                <button class="sv-icon-btn sv-icon-btn--edit" @click="openModal(row)" title="Editar">
                  <font-awesome-icon :icon="['fas', 'file-pen']" />
                </button>
                <button class="sv-icon-btn sv-icon-btn--del" @click="deleteTarget = row" title="Eliminar">
                  <font-awesome-icon :icon="['fas', 'trash-can']" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- Vacío -->
    <div v-else class="sv-state">
      <font-awesome-icon :icon="['fas', 'table-cells']" class="sv-empty-icon" />
      <span>Esta pestaña está vacía. Añade un registro.</span>
    </div>

    <!-- Modal añadir / editar -->
    <Teleport to="body">
      <div v-if="showModal" class="sv-backdrop" @click.self="closeModal">
        <div class="sv-modal">
          <div class="sv-modal-head">
            <h3>{{ editRow ? 'Editar registro' : 'Nuevo registro' }}</h3>
            <button class="sv-modal-x" @click="closeModal">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          <div class="sv-modal-body">
            <div v-for="h in tab.headers" :key="h" class="sv-field">
              <label>{{ h }}</label>
              <input
                v-if="fieldType(h) === 'date'"
                type="date"
                v-model="form[h]"
                class="sv-input"
              />
              <input
                v-else-if="fieldType(h) === 'number'"
                type="number"
                step="0.01"
                v-model="form[h]"
                class="sv-input"
              />
              <textarea
                v-else-if="fieldType(h) === 'long'"
                v-model="form[h]"
                rows="3"
                class="sv-input sv-textarea"
              ></textarea>
              <input
                v-else
                type="text"
                v-model="form[h]"
                class="sv-input"
              />
            </div>
          </div>
          <div class="sv-modal-foot">
            <button class="sv-btn sv-btn--ghost" @click="closeModal">Cancelar</button>
            <button class="sv-btn sv-btn--primary" @click="saveRow" :disabled="saving">
              <font-awesome-icon v-if="saving" :icon="['fas', 'arrows-rotate']" class="sv-spin" />
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal confirmar borrado -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="sv-backdrop" @click.self="deleteTarget = null">
        <div class="sv-modal sv-modal--sm">
          <div class="sv-modal-head">
            <h3>Eliminar registro</h3>
            <button class="sv-modal-x" @click="deleteTarget = null">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          <div class="sv-modal-body">
            <p class="sv-confirm-msg">¿Eliminar este registro? Esta acción no se puede deshacer y borrará la fila en Google Sheets.</p>
          </div>
          <div class="sv-modal-foot">
            <button class="sv-btn sv-btn--ghost" @click="deleteTarget = null">Cancelar</button>
            <button class="sv-btn sv-btn--danger" @click="doDelete" :disabled="deleting">
              {{ deleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSheetsStore } from '../stores/sheetsStore'

const route       = useRoute()
const sheetsStore = useSheetsStore()

const tabName = computed(() => route.params.tab)
const tab     = computed(() => sheetsStore.tabData[tabName.value] || null)

const search      = ref('')
const showModal   = ref(false)
const editRow     = ref(null)
const form        = ref({})
const saving      = ref(false)
const deleteTarget = ref(null)
const deleting    = ref(false)

const filtered = computed(() => {
  const records = tab.value?.records || []
  if (!search.value.trim()) return records
  const q = search.value.toLowerCase()
  return records.filter(r =>
    Object.entries(r).some(([k, v]) => k !== '_row' && String(v).toLowerCase().includes(q))
  )
})

function fieldType(h) {
  const lower = h.toLowerCase()
  if (lower.includes('fecha') || lower.includes('date')) return 'date'
  if (
    lower.includes('precio') || lower.includes('importe') || lower.includes('iva') ||
    lower.includes('total') || lower.includes('monto') || lower === 'sin iva' ||
    lower === 'con iva' || lower.includes('€') || lower.includes('coste')
  ) return 'number'
  if (lower.includes('nota') || lower.includes('descripci') || lower.includes('direcci')) return 'long'
  return 'text'
}

function openModal(row) {
  editRow.value = row
  form.value = {}
  const headers = tab.value?.headers || []
  if (row) {
    headers.forEach(h => { form.value[h] = row[h] ?? '' })
  } else {
    headers.forEach(h => { form.value[h] = '' })
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editRow.value = null
}

async function saveRow() {
  saving.value = true
  try {
    if (editRow.value) {
      await sheetsStore.updateRow(tabName.value, editRow.value._row, form.value)
    } else {
      await sheetsStore.appendRow(tabName.value, form.value)
    }
    closeModal()
  } catch (e) {
    console.error('[SheetView] saveRow:', e)
  } finally {
    saving.value = false
  }
}

async function doDelete() {
  deleting.value = true
  try {
    await sheetsStore.deleteRow(tabName.value, deleteTarget.value._row)
    deleteTarget.value = null
  } finally {
    deleting.value = false
  }
}

async function reload() {
  await sheetsStore.loadTab(tabName.value)
}

watch(tabName, name => {
  if (name) sheetsStore.loadTab(name)
}, { immediate: true })
</script>

<style scoped>
.sv-page {
  background: #080d1a;
  min-height: 100vh;
  padding: 36px 24px 60px;
}

/* ── Header ── */
.sv-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.sv-label {
  display: block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #334155;
  margin-bottom: 4px;
}
.sv-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  color: #e2e8f0;
  margin: 0;
  line-height: 1.1;
}
.sv-accent { color: #60a5fa; }
.sv-header-actions { display: flex; gap: 10px; align-items: center; }

/* ── Buttons ── */
.sv-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 9px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}
.sv-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.sv-btn--primary  { background: #2563eb; color: #fff; }
.sv-btn--primary:hover:not(:disabled) { background: #1d4ed8; }
.sv-btn--secondary {
  background: rgba(255,255,255,0.06);
  color: #94a3b8;
  padding: 9px 14px;
}
.sv-btn--secondary:hover:not(:disabled) { background: rgba(255,255,255,0.1); }
.sv-btn--ghost { background: transparent; color: #64748b; border: 1px solid rgba(255,255,255,0.1); }
.sv-btn--ghost:hover { background: rgba(255,255,255,0.05); }
.sv-btn--danger { background: #dc2626; color: #fff; }
.sv-btn--danger:hover:not(:disabled) { background: #b91c1c; }

/* ── State (loading / error / empty) ── */
.sv-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  color: #475569;
  font-family: 'Raleway', sans-serif;
  font-size: 0.9rem;
  padding: 80px 0;
}
.sv-state--error { color: #f87171; }
.sv-empty-icon { font-size: 2.5rem; opacity: 0.3; }
.sv-spinner {
  width: 32px; height: 32px;
  border: 3px solid rgba(96,165,250,0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: sv-rotate 0.8s linear infinite;
}

/* ── Toolbar ── */
.sv-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.sv-search-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 360px;
}
.sv-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #475569;
  font-size: 0.8rem;
}
.sv-search {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  color: #e2e8f0;
  font-family: 'Raleway', sans-serif;
  font-size: 0.83rem;
  padding: 8px 12px 8px 34px;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.sv-search:focus { border-color: rgba(96,165,250,0.4); }
.sv-search::placeholder { color: #475569; }
.sv-count {
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem;
  color: #475569;
  white-space: nowrap;
}

/* ── Table ── */
.sv-table-scroll {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.07);
}
.sv-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  min-width: 600px;
}
.sv-table thead tr {
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.sv-table th {
  padding: 11px 14px;
  text-align: left;
  font-weight: 700;
  color: #64748b;
  white-space: nowrap;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
}
.sv-th-actions { width: 90px; text-align: center; }
.sv-table tbody tr {
  border-bottom: 1px solid rgba(255,255,255,0.05);
  transition: background 0.1s;
}
.sv-table tbody tr:last-child { border-bottom: none; }
.sv-table tbody tr:hover { background: rgba(255,255,255,0.03); }
.sv-table td { padding: 9px 14px; color: #94a3b8; vertical-align: middle; }
.sv-cell {
  display: block;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sv-td-actions {
  text-align: center;
  white-space: nowrap;
  padding: 6px 10px;
}

/* ── Icon buttons ── */
.sv-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.82rem;
  padding: 5px 7px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}
.sv-icon-btn--edit { color: #60a5fa; }
.sv-icon-btn--edit:hover { background: rgba(96,165,250,0.12); }
.sv-icon-btn--del { color: #475569; }
.sv-icon-btn--del:hover { color: #f87171; background: rgba(248,113,113,0.1); }

/* ── Modal ── */
.sv-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  padding: 16px;
}
.sv-modal {
  background: #0f172a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  width: 100%;
  max-width: 540px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6);
}
.sv-modal--sm { max-width: 400px; }
.sv-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.sv-modal-head h3 {
  font-family: 'Raleway', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}
.sv-modal-x {
  background: none;
  border: none;
  color: #475569;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px 6px;
  border-radius: 6px;
  transition: color 0.15s, background 0.15s;
}
.sv-modal-x:hover { color: #94a3b8; background: rgba(255,255,255,0.06); }
.sv-modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}
.sv-confirm-msg {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #94a3b8;
  line-height: 1.55;
  margin: 0;
}
.sv-modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid rgba(255,255,255,0.07);
}

/* ── Form fields ── */
.sv-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.sv-field label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.74rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.sv-input {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #e2e8f0;
  font-family: 'Raleway', sans-serif;
  font-size: 0.85rem;
  padding: 9px 12px;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
  box-sizing: border-box;
}
.sv-input:focus { border-color: rgba(96,165,250,0.5); background: rgba(96,165,250,0.04); }
.sv-input::placeholder { color: #475569; }
.sv-textarea { resize: vertical; min-height: 72px; }

/* ── Spin animation ── */
.sv-spin { animation: sv-rotate 0.7s linear infinite; }
@keyframes sv-rotate { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .sv-page { padding: 20px 14px 40px; }
  .sv-header { flex-direction: column; align-items: flex-start; }
  .sv-modal { max-height: 92vh; }
}
</style>
