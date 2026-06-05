import { defineStore } from 'pinia'
import { ref } from 'vue'
import { syncAll, exportToSheets, importFromSheets } from '../services/sheetsSync'
import dayjs from 'dayjs'

export const useSyncStore = defineStore('sync', () => {
  const isSyncing  = ref(false)
  const lastSync   = ref(null)
  const status     = ref('idle')   // 'idle' | 'syncing' | 'success' | 'error'
  const message    = ref('')
  const imported   = ref(0)
  let   _interval  = null

  function setProgress(msg) {
    message.value = msg
  }

  async function performSync() {
    if (isSyncing.value) return
    isSyncing.value = true
    status.value    = 'syncing'
    message.value   = 'Iniciando sincronización...'
    imported.value  = 0

    try {
      const count = await syncAll(setProgress)
      imported.value  = count
      lastSync.value  = dayjs().format('DD/MM/YYYY HH:mm')
      status.value    = 'success'
      message.value   = count
        ? `Sincronizado — ${count} registro(s) nuevo(s) importado(s)`
        : 'Sincronizado correctamente'
    } catch (err) {
      status.value  = 'error'
      message.value = err.message || 'Error desconocido al sincronizar'
      console.error('[SheetsSync]', err)
    } finally {
      isSyncing.value = false
    }
  }

  async function manualExport() {
    if (isSyncing.value) return
    isSyncing.value = true
    status.value    = 'syncing'
    message.value   = 'Exportando a Google Sheets...'
    try {
      await exportToSheets(setProgress)
      lastSync.value = dayjs().format('DD/MM/YYYY HH:mm')
      status.value   = 'success'
      message.value  = 'Exportación completada'
    } catch (err) {
      status.value  = 'error'
      message.value = err.message || 'Error al exportar'
    } finally {
      isSyncing.value = false
    }
  }

  async function manualImport() {
    if (isSyncing.value) return
    isSyncing.value = true
    status.value    = 'syncing'
    message.value   = 'Importando desde Google Sheets...'
    try {
      const count = await importFromSheets(setProgress)
      imported.value = count
      lastSync.value = dayjs().format('DD/MM/YYYY HH:mm')
      status.value   = 'success'
      message.value  = count ? `${count} registro(s) importado(s)` : 'Sin datos nuevos en la hoja'
    } catch (err) {
      status.value  = 'error'
      message.value = err.message || 'Error al importar'
    } finally {
      isSyncing.value = false
    }
  }

  function startAutoSync(intervalMinutes = 10) {
    stopAutoSync()
    performSync()
    _interval = setInterval(performSync, intervalMinutes * 60 * 1000)
  }

  function stopAutoSync() {
    if (_interval) { clearInterval(_interval); _interval = null }
  }

  return { isSyncing, lastSync, status, message, imported, performSync, manualExport, manualImport, startAutoSync, stopAutoSync }
})
