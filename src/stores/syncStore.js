/**
 * syncStore.js — Estado de la base de datos Google Sheets.
 * Gestiona el refresh manual y periódico de datos.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDatabaseStore } from './database'
import dayjs from 'dayjs'

export const useSyncStore = defineStore('sync', () => {
  const isRefreshing = ref(false)
  const lastRefresh  = ref(null)
  const status       = ref('idle')   // 'idle' | 'loading' | 'success' | 'error'
  const message      = ref('')
  let   _interval    = null

  // Alias para compatibilidad con Dashboard
  const isSyncing = isRefreshing

  async function refreshAll() {
    if (isRefreshing.value) return
    isRefreshing.value = true
    status.value       = 'loading'
    message.value      = 'Actualizando datos...'

    const db = useDatabaseStore()
    try {
      await Promise.all([
        db.fetchLimpiezas(db.selectedMonth, db.selectedYear),
        db.fetchClientes(),
        db.fetchGastos(db.selectedMonthGastos, db.selectedYearGastos),
      ])
      lastRefresh.value = dayjs().format('DD/MM/YYYY HH:mm')
      status.value      = 'success'
      message.value     = 'Datos actualizados desde Google Sheets'
    } catch (err) {
      status.value  = 'error'
      message.value = err.message || 'Error al leer Google Sheets'
      console.error('[SyncStore]', err)
    } finally {
      isRefreshing.value = false
    }
  }

  function startAutoSync(intervalMinutes = 10) {
    stopAutoSync()
    refreshAll()
    _interval = setInterval(refreshAll, intervalMinutes * 60 * 1000)
  }

  function stopAutoSync() {
    if (_interval) { clearInterval(_interval); _interval = null }
  }

  // Alias para compatibilidad con Dashboard (botones de acción)
  const performSync  = refreshAll
  const manualExport = refreshAll
  const manualImport = refreshAll

  return { isSyncing, isRefreshing, lastSync: lastRefresh, status, message, refreshAll, performSync, manualExport, manualImport, startAutoSync, stopAutoSync }
})
