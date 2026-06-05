import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import {
  getTabNames,
  getSheetRaw,
  appendSheetRow,
  updateSheetRow,
  deleteSheetRow,
  invalidateMeta,
} from '../services/sheetDB'

export const useSheetsStore = defineStore('sheets', () => {
  const tabs    = ref([])       // ['Limpiezas', 'Clientes', 'Servicios', ...]
  const tabData = reactive({})  // { 'Servicios': { headers, records, loading, error } }
  const loading = ref(false)

  async function loadTabs() {
    if (loading.value) return
    loading.value = true
    try {
      tabs.value = await getTabNames()
    } catch (e) {
      console.error('[SheetsStore] loadTabs:', e)
    } finally {
      loading.value = false
    }
  }

  async function reloadTabs() {
    invalidateMeta()
    tabs.value = []
    await loadTabs()
  }

  async function loadTab(tabName) {
    if (!tabData[tabName]) {
      tabData[tabName] = { headers: [], records: [], loading: false, error: null }
    }
    const td = tabData[tabName]
    td.loading = true
    td.error   = null
    try {
      const result = await getSheetRaw(tabName)
      td.headers = result.headers
      td.records = result.records
    } catch (e) {
      td.error = e.message
      console.error(`[SheetsStore] loadTab(${tabName}):`, e)
    } finally {
      td.loading = false
    }
  }

  async function appendRow(tabName, data) {
    const td = tabData[tabName]
    if (!td?.headers?.length) return
    await appendSheetRow(tabName, td.headers, data)
    await loadTab(tabName)
  }

  async function updateRow(tabName, rowNum, data) {
    const td = tabData[tabName]
    if (!td?.headers?.length) return
    await updateSheetRow(tabName, rowNum, td.headers, data)
    const idx = td.records.findIndex(r => r._row === rowNum)
    if (idx !== -1) td.records[idx] = { ...data, _row: rowNum }
  }

  async function deleteRow(tabName, rowNum) {
    await deleteSheetRow(tabName, rowNum)
    await loadTab(tabName) // recarga para corregir índices de fila
  }

  return { tabs, tabData, loading, loadTabs, reloadTabs, loadTab, appendRow, updateRow, deleteRow }
})
