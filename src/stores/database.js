/**
 * database.js — Store de datos principal.
 * Usa Google Sheets como base de datos (via sheetDB.js).
 * Colecciones: limpiezas, clientes, gastos.
 * Mensajes se gestionan en Firestore (formulario público).
 */

import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getAll, addRecord, updateRecord, removeRecord } from '../services/sheetDB'

dayjs.extend(relativeTime)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function matchesMonthYear(dateStr, month, year) {
  if (!dateStr) return false
  const d = dayjs(dateStr)
  const yearOk  = !year  || d.year()  === parseInt(year)
  const monthOk = month === '' || d.month() === parseInt(month)
  return yearOk && monthOk
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    // Limpiezas
    limpiezas:          [],
    _allLimpiezas:      [],       // caché sin filtrar
    nextFacturaFormatted: 'Calculando...',
    isLoadingLimpiezas: false,
    errorLimpiezas:     null,
    isAddingLimpieza:   false,
    addLimpiezaError:   null,
    isUpdatingLimpieza: false,
    updateLimpiezaError: null,
    isDeletingLimpieza: false,
    deleteLimpiezaError: null,
    selectedMonth: '',
    selectedYear:  '',

    // Clientes
    clientes:           [],
    isLoadingClientes:  false,
    errorClientes:      null,
    isAddingClient:     false,
    addClientError:     null,
    isUpdatingClient:   false,
    updateClientError:  null,
    isDeletingClient:   false,
    deleteClientError:  null,

    // Gastos
    gastos:             [],
    isLoadingGastos:    false,
    errorGastos:        null,
    isAddingGasto:      false,
    addGastoError:      null,
    isUpdatingGasto:    false,
    updateGastoError:   null,
    isDeletingGasto:    false,
    deleteGastoError:   null,
    selectedMonthGastos: '',
    selectedYearGastos:  '',
  }),

  // ─── Getters ──────────────────────────────────────────────────────────────

  getters: {
    pendingLimpiezas: (state) =>
      state._allLimpiezas
        .filter(l => !l.fechaPago)
        .sort((a, b) => new Date(a.fechaPrincipalLimpieza || 0) - new Date(b.fechaPrincipalLimpieza || 0)),

    getClientById: (state) => (id) =>
      state.clientes.find(c => c.id === id) || null,

    totalBrutoLimpiezas: (state) =>
      state.limpiezas.reduce((s, l) => s + (Number(l.precioBruto) || 0), 0),

    totalNetoLimpiezas: (state) =>
      state.limpiezas.reduce((s, l) => {
        const b = Number(l.precioBruto)
        return s + (isNaN(b) ? 0 : b - b * 0.232)
      }, 0),

    totalCotizacionLimpiezas: (state) =>
      state.limpiezas.reduce((s, l) => {
        const b = Number(l.precioBruto)
        return s + (isNaN(b) ? 0 : b * 0.232)
      }, 0),

    totalGastosConIVA: (state) =>
      state.gastos.reduce((s, g) => s + (Number(g.precioConIVA) || 0), 0),

    totalGastosSinIVA: (state) =>
      state.gastos.reduce((s, g) => s + (Number(g.precioSinIVA) || 0), 0),

    totalIVA: (state) =>
      state.gastos.reduce((s, g) => s + (Number(g.iva) || 0), 0),

    isProcessing: (state) =>
      state.isLoadingLimpiezas || state.isAddingLimpieza || state.isUpdatingLimpieza || state.isDeletingLimpieza ||
      state.isLoadingClientes  || state.isAddingClient   || state.isUpdatingClient   || state.isDeletingClient,

    hasError: (state) =>
      state.errorLimpiezas || state.addLimpiezaError || state.updateLimpiezaError || state.deleteLimpiezaError ||
      state.errorClientes  || state.addClientError   || state.updateClientError   || state.deleteClientError || null,
  },

  // ─── Actions ──────────────────────────────────────────────────────────────

  actions: {

    // ── Factura numbering ──────────────────────────────────────────────────

    async fetchNextFacturaFormattedNumber() {
      const now   = new Date()
      const year  = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const prefix = `F${year}-${month}-`

      const source = this._allLimpiezas.length ? this._allLimpiezas : await getAll('limpiezas')

      let maxSeq = 0
      for (const l of source) {
        if (l.factura?.startsWith(prefix)) {
          const parts = l.factura.split('-')
          const n = parseInt(parts[parts.length - 1]) || 0
          if (n > maxSeq) maxSeq = n
        }
      }
      this.nextFacturaFormatted = `${prefix}${String(maxSeq + 1).padStart(3, '0')}`
    },

    // ── Limpiezas ──────────────────────────────────────────────────────────

    async fetchLimpiezas(month = '', year = '') {
      this.isLoadingLimpiezas = true
      this.errorLimpiezas     = null
      this.selectedMonth = month
      this.selectedYear  = year
      try {
        const all = await getAll('limpiezas')
        this._allLimpiezas = all

        if (!year) {
          this.limpiezas = [...all]
        } else {
          this.limpiezas = all.filter(l =>
            matchesMonthYear(l.fechaPrincipalLimpieza, month, year) ||
            matchesMonthYear(l.fechaPago, month, year)
          )
        }
        await this.fetchNextFacturaFormattedNumber()
      } catch (e) {
        this.errorLimpiezas = e
        console.error('[DB] fetchLimpiezas:', e)
      } finally {
        this.isLoadingLimpiezas = false
      }
    },

    async addLimpieza(data) {
      this.isAddingLimpieza = true
      this.addLimpiezaError = null
      try {
        // Auto-factura si no se proporcionó
        let factura = data.factura?.trim()
        if (!factura) {
          await this.fetchNextFacturaFormattedNumber()
          factura = this.nextFacturaFormatted
        }
        // Resolver nombre del cliente para columna display
        const c = this.clientes.find(cl => cl.id === data.clienteId)
        const clienteName = c ? `${c.nombre || ''} ${c.apellido || ''}`.trim() : ''

        await addRecord('limpiezas', { ...data, factura, clienteName })
        await this.fetchLimpiezas(this.selectedMonth, this.selectedYear)
      } catch (e) {
        this.addLimpiezaError = e
        console.error('[DB] addLimpieza:', e)
        throw e
      } finally {
        this.isAddingLimpieza = false
      }
    },

    async updateLimpieza(id, data) {
      this.isUpdatingLimpieza  = true
      this.updateLimpiezaError = null
      try {
        // Recalcular nombre si cambió clienteId
        const patch = { ...data }
        if (data.clienteId) {
          const c = this.clientes.find(cl => cl.id === data.clienteId)
          patch.clienteName = c ? `${c.nombre || ''} ${c.apellido || ''}`.trim() : ''
        }
        await updateRecord('limpiezas', id, patch)
        await this.fetchLimpiezas(this.selectedMonth, this.selectedYear)
      } catch (e) {
        this.updateLimpiezaError = e
        console.error('[DB] updateLimpieza:', e)
        throw e
      } finally {
        this.isUpdatingLimpieza = false
      }
    },

    async deleteLimpieza(id) {
      this.isDeletingLimpieza  = true
      this.deleteLimpiezaError = null
      try {
        await removeRecord('limpiezas', id)
        this.limpiezas     = this.limpiezas.filter(l => l.id !== id)
        this._allLimpiezas = this._allLimpiezas.filter(l => l.id !== id)
      } catch (e) {
        this.deleteLimpiezaError = e
        console.error('[DB] deleteLimpieza:', e)
        throw e
      } finally {
        this.isDeletingLimpieza = false
      }
    },

    async updatePaymentStatus(id, newFechaPago, newFormaPago) {
      this.isUpdatingLimpieza  = true
      this.updateLimpiezaError = null
      try {
        await updateRecord('limpiezas', id, { fechaPago: newFechaPago || '', formaPago: newFormaPago || '' })
        await this.fetchLimpiezas(this.selectedMonth, this.selectedYear)
      } catch (e) {
        this.updateLimpiezaError = e
        console.error('[DB] updatePaymentStatus:', e)
        throw e
      } finally {
        this.isUpdatingLimpieza = false
      }
    },

    // ── Clientes ──────────────────────────────────────────────────────────

    async fetchClientes() {
      this.isLoadingClientes = true
      this.errorClientes     = null
      try {
        this.clientes = (await getAll('clientes')).sort((a, b) =>
          (a.nombre || '').localeCompare(b.nombre || '', 'es')
        )
      } catch (e) {
        this.errorClientes = e
        console.error('[DB] fetchClientes:', e)
        this.clientes = []
      } finally {
        this.isLoadingClientes = false
      }
    },

    async fetchClientById(id) {
      if (!id) return null
      const cached = this.clientes.find(c => c.id === id)
      if (cached) return cached
      await this.fetchClientes()
      return this.clientes.find(c => c.id === id) || null
    },

    async addClient(data) {
      this.isAddingClient = true
      this.addClientError = null
      try {
        await addRecord('clientes', data)
        await this.fetchClientes()
      } catch (e) {
        this.addClientError = e
        console.error('[DB] addClient:', e)
        throw e
      } finally {
        this.isAddingClient = false
      }
    },

    async updateClient(id, data) {
      this.isUpdatingClient  = true
      this.updateClientError = null
      try {
        await updateRecord('clientes', id, data)
        const idx = this.clientes.findIndex(c => c.id === id)
        if (idx !== -1) this.clientes[idx] = { ...this.clientes[idx], ...data }
      } catch (e) {
        this.updateClientError = e
        console.error('[DB] updateClient:', e)
        throw e
      } finally {
        this.isUpdatingClient = false
      }
    },

    async deleteClient(id) {
      this.isDeletingClient  = true
      this.deleteClientError = null
      try {
        await removeRecord('clientes', id)
        this.clientes = this.clientes.filter(c => c.id !== id)
      } catch (e) {
        this.deleteClientError = e
        console.error('[DB] deleteClient:', e)
        throw e
      } finally {
        this.isDeletingClient = false
      }
    },

    // ── Gastos ────────────────────────────────────────────────────────────

    async fetchGastos(month = '', year = '') {
      this.isLoadingGastos    = true
      this.errorGastos        = null
      this.selectedMonthGastos = month
      this.selectedYearGastos  = year
      try {
        const all = await getAll('gastos')
        if (!year) {
          this.gastos = all
        } else {
          this.gastos = all.filter(g => matchesMonthYear(g.fechaFactura, month, year))
        }
      } catch (e) {
        this.errorGastos = e
        console.error('[DB] fetchGastos:', e)
      } finally {
        this.isLoadingGastos = false
      }
    },

    async addGasto(data) {
      this.isAddingGasto = true
      this.addGastoError = null
      try {
        await addRecord('gastos', data)
        await this.fetchGastos(this.selectedMonthGastos, this.selectedYearGastos)
      } catch (e) {
        this.addGastoError = e
        console.error('[DB] addGasto:', e)
        throw e
      } finally {
        this.isAddingGasto = false
      }
    },

    async updateGasto(id, data) {
      this.isUpdatingGasto  = true
      this.updateGastoError = null
      try {
        await updateRecord('gastos', id, data)
        await this.fetchGastos(this.selectedMonthGastos, this.selectedYearGastos)
      } catch (e) {
        this.updateGastoError = e
        console.error('[DB] updateGasto:', e)
        throw e
      } finally {
        this.isUpdatingGasto = false
      }
    },

    async deleteGasto(id) {
      this.isDeletingGasto  = true
      this.deleteGastoError = null
      try {
        await removeRecord('gastos', id)
        this.gastos = this.gastos.filter(g => g.id !== id)
      } catch (e) {
        this.deleteGastoError = e
        console.error('[DB] deleteGasto:', e)
        throw e
      } finally {
        this.isDeletingGasto = false
      }
    },

    // ── Utilidades ────────────────────────────────────────────────────────

    ultimoDia(dias) {
      if (dias?.length > 0) {
        return dayjs(dias[dias.length - 1].fechaLimp).fromNow()
      }
      return 'aun no hay datos'
    },
  },
})
