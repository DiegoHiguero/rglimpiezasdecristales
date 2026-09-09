/**
 * database.js — Store de datos principal.
 * Lee/escribe directamente sobre las pestañas reales de la hoja de facturación
 * (CLIENTES, REGISTRO, GASTOS) vía sheetDB.js genérico
 * (getSheetRaw/appendSheetRow/updateSheetRow/deleteSheetRow), sin columna de ID:
 * cada fila se identifica por su número de fila (_row), expuesto también como `id`.
 * Mensajes se gestionan en Firestore (formulario público).
 */

import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getSheetRaw, appendSheetRow, updateSheetRow, deleteSheetRow } from '../services/sheetDB'
import { saveCache, loadCache, hasChanges } from '../services/localCache'

dayjs.extend(relativeTime)

// ─── Pestañas y cabeceras reales ───────────────────────────────────────────────

const TAB = {
  clientes:  'CLIENTES',
  facturas:  'REGISTRO',
  gastos:    'GASTOS',
}

const CLIENTES_HEADERS = ['Nombre / Razón social', 'NIF/CIF', 'Dirección', 'Teléfono', 'Email', 'Persona contacto', 'Notas', 'Precio habitual']
const FACTURAS_HEADERS = ['Nº Factura', 'Fecha', 'Cliente', 'NIF', 'Concepto', 'Base', 'IVA', 'Total', 'Estado', 'F. cobro', 'Trim.', 'Enlace PDF', 'Notas']
const GASTOS_HEADERS   = ['Fecha', 'Proveedor', 'NIF', 'Concepto', 'Categoría', 'Base', 'IVA sop.', 'Total', '% Ded.', 'IVA deduc.', 'Base deduc.', 'Trim.', 'Recibo (foto)', 'Nº Factura']

// ─── Helpers de formato (la hoja usa formato español: 1.234,56 € y DD/MM/AAAA) ──

function parseEuroNumber(str) {
  if (str === null || str === undefined || str === '') return 0
  if (typeof str === 'number') return str
  const s = String(str).replace(/[€\s]/g, '').trim()
  if (!s) return 0
  const n = parseFloat(s.replace(/\./g, '').replace(',', '.'))
  return isNaN(n) ? 0 : n
}

function formatEuroNumber(n) {
  return (Number(n) || 0).toFixed(2).replace('.', ',')
}

function isoToEuDate(iso) {
  if (!iso) return ''
  const d = dayjs(iso)
  return d.isValid() ? d.format('DD/MM/YYYY') : String(iso)
}

function euDateToIso(eu) {
  if (!eu) return ''
  const [d, m, y] = String(eu).trim().split('/')
  if (!d || !m || !y) return ''
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

function quarterOf(iso) {
  if (!iso) return ''
  const d = dayjs(iso)
  return d.isValid() ? `T${Math.floor(d.month() / 3) + 1}` : ''
}

function computeNextFactura(limpiezas) {
  const year   = new Date().getFullYear()
  const prefix = `F-${year}-`
  let maxSeq = 0
  for (const l of limpiezas) {
    if (l.factura?.startsWith(prefix)) {
      const n = parseInt(l.factura.slice(prefix.length)) || 0
      if (n > maxSeq) maxSeq = n
    }
  }
  return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`
}

function matchesMonthYear(isoDateStr, month, year) {
  if (!isoDateStr) return false
  const d = dayjs(isoDateStr)
  const yearOk  = !year  || d.year()  === parseInt(year)
  const monthOk = month === '' || d.month() === parseInt(month)
  return yearOk && monthOk
}

// ─── Mapeo fila ↔ objeto ────────────────────────────────────────────────────────

function clienteFromRow(r) {
  return {
    id:              r._row,
    _row:            r._row,
    nombre:          r['Nombre / Razón social'] || '',
    nifCif:          r['NIF/CIF'] || '',
    direccion:       r['Dirección'] || '',
    telefono:        r['Teléfono'] || '',
    email:           r['Email'] || '',
    personaContacto: r['Persona contacto'] || '',
    notas:           r['Notas'] || '',
    precioHabitual:  parseEuroNumber(r['Precio habitual']),
  }
}

function clienteToRow(d) {
  return {
    'Nombre / Razón social': d.nombre || '',
    'NIF/CIF':               d.nifCif || '',
    'Dirección':             d.direccion || '',
    'Teléfono':               d.telefono || '',
    'Email':                 d.email || '',
    'Persona contacto':      d.personaContacto || '',
    'Notas':                 d.notas || '',
    'Precio habitual':       d.precioHabitual ? formatEuroNumber(d.precioHabitual) : '',
  }
}

function facturaFromRow(r) {
  const fechaIso = euDateToIso(r['Fecha'])
  const estado   = r['Estado'] || 'Pendiente'
  return {
    id:                     r._row,
    _row:                   r._row,
    factura:                r['Nº Factura'] || '',
    fechaPrincipalLimpieza: fechaIso,
    clienteId:              r['Cliente'] || '',   // nombre del cliente — hace de clave de referencia
    cliente:                r['Cliente'] || '',    // alias de solo lectura para mostrar en tablas
    nif:                    r['NIF'] || '',
    descripcion:            r['Concepto'] || '',
    base:                   parseEuroNumber(r['Base']),
    iva:                    parseEuroNumber(r['IVA']),
    precioBruto:            parseEuroNumber(r['Total']),
    importe:                parseEuroNumber(r['Total']),
    estado,
    fechaPago:              estado === 'Pagada' ? (euDateToIso(r['F. cobro']) || fechaIso) : null,
    trimestre:              r['Trim.'] || '',
    enlacePDF:              r['Enlace PDF'] || '',
    notas:                  r['Notas'] || '',
  }
}

function facturaToRow(d) {
  const total = Number(d.precioBruto ?? d.importe ?? 0)
  const base  = d.base != null ? Number(d.base) : total / 1.21
  const iva   = d.iva  != null ? Number(d.iva)  : total - base
  const fecha = d.fechaPrincipalLimpieza || ''
  return {
    'Nº Factura': d.factura || '',
    'Fecha':      isoToEuDate(fecha),
    'Cliente':    d.clienteId || '',
    'NIF':        d.nif || '',
    'Concepto':   d.descripcion || 'LIMPIEZA DE CRISTALES',
    'Base':       formatEuroNumber(base),
    'IVA':        formatEuroNumber(iva),
    'Total':      formatEuroNumber(total),
    'Estado':     d.estado || (d.fechaPago ? 'Pagada' : 'Pendiente'),
    'F. cobro':   d.fechaPago ? isoToEuDate(d.fechaPago) : '',
    'Trim.':      d.trimestre || quarterOf(fecha),
    'Enlace PDF': d.enlacePDF || '',
    'Notas':      d.notas || '',
  }
}

function gastoFromRow(r) {
  return {
    id:            r._row,
    _row:          r._row,
    fechaFactura:  euDateToIso(r['Fecha']),
    proveedor:     r['Proveedor'] || '',
    nif:           r['NIF'] || '',
    tipo:          r['Categoría'] || 'Otros',
    concepto:      r['Concepto'] || '',
    precioSinIVA:  parseEuroNumber(r['Base']),
    iva:           parseEuroNumber(r['IVA sop.']),
    precioConIVA:  parseEuroNumber(r['Total']),
    trimestre:     r['Trim.'] || '',
    numeroFactura: r['Nº Factura'] || '',
  }
}

function gastoToRow(d) {
  const total = Number(d.precioConIVA ?? 0)
  const base  = total / 1.21
  const ivaSop = total - base
  const fecha = d.fechaFactura || ''
  return {
    'Fecha':          isoToEuDate(fecha),
    'Proveedor':      d.proveedor || '',
    'NIF':            d.nif || '',
    'Concepto':       d.concepto || d.tipo || '',
    'Categoría':      d.tipo || 'Otros',
    'Base':           formatEuroNumber(base),
    'IVA sop.':       formatEuroNumber(ivaSop),
    'Total':          formatEuroNumber(total),
    '% Ded.':         '100%',
    'IVA deduc.':     formatEuroNumber(ivaSop),
    'Base deduc.':    formatEuroNumber(base),
    'Trim.':          d.trimestre || quarterOf(fecha),
    'Recibo (foto)':  d.recibo || '',
    'Nº Factura':     d.numeroFactura || '',
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDatabaseStore = defineStore('database', {
  state: () => ({
    // Limpiezas / Facturas
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
    _allGastos:         [],
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
        .filter(l => l.estado !== 'Pagada')
        .sort((a, b) => new Date(a.fechaPrincipalLimpieza || 0) - new Date(b.fechaPrincipalLimpieza || 0)),

    getClientById: (state) => (nombre) =>
      state.clientes.find(c => c.nombre === nombre) || null,

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

    // ── Factura numbering (esquema real: F-AAAA-NNN, secuencia continua por año) ──

    /**
     * Lee la hoja EN VIVO (no la caché local) y calcula el siguiente número
     * de factura. Es la fuente autoritativa que se usa justo antes de
     * escribir una factura nueva, para no duplicar números aunque la
     * caché en memoria esté desactualizada (otra pestaña, otro día, etc.).
     */
    async fetchNextFacturaFormattedNumber() {
      const { records } = await getSheetRaw(TAB.facturas)
      this.nextFacturaFormatted = computeNextFactura(records.map(facturaFromRow))
      return this.nextFacturaFormatted
    },

    // ── Limpiezas / Facturas ───────────────────────────────────────────────

    async fetchLimpiezas(month = '', year = '') {
      this.selectedMonth = month
      this.selectedYear  = year

      if (!this._allLimpiezas.length) {
        const cached = loadCache('limpiezas')
        if (cached?.records?.length) {
          this._allLimpiezas = cached.records
          this.limpiezas = this._filterLimpiezas(cached.records, month, year)
        }
      } else {
        this.limpiezas = this._filterLimpiezas(this._allLimpiezas, month, year)
      }

      this.isLoadingLimpiezas = true
      this.errorLimpiezas     = null
      try {
        const { records } = await getSheetRaw(TAB.facturas)
        const fresh = records.map(facturaFromRow)
        if (hasChanges(this._allLimpiezas, fresh)) {
          this._allLimpiezas = fresh
          saveCache('limpiezas', fresh)
          this.limpiezas = this._filterLimpiezas(fresh, month, year)
        }
        // Vista previa del próximo número — barata (ya tenemos "fresh" en memoria)
        // y siempre se recalcula, para que nunca se quede en "Calculando...".
        this.nextFacturaFormatted = computeNextFactura(fresh)
      } catch (e) {
        this.errorLimpiezas = e
        console.error('[DB] fetchLimpiezas:', e)
      } finally {
        this.isLoadingLimpiezas = false
      }
    },

    _filterLimpiezas(all, month, year) {
      if (!year) return [...all]
      return all.filter(l =>
        matchesMonthYear(l.fechaPrincipalLimpieza, month, year) ||
        matchesMonthYear(l.fechaPago, month, year)
      )
    },

    async addLimpieza(data) {
      this.isAddingLimpieza = true
      this.addLimpiezaError = null
      try {
        let factura = data.factura?.trim()
        if (!factura) {
          // Autoritativo: lee la hoja en vivo justo antes de guardar, no la
          // caché en memoria — evita duplicar el número si ha pasado tiempo
          // desde la última carga (u otra factura se creó mientras tanto).
          factura = await this.fetchNextFacturaFormattedNumber()
        }
        const c = this.clientes.find(cl => cl.nombre === data.clienteId)

        await appendSheetRow(TAB.facturas, FACTURAS_HEADERS, facturaToRow({
          ...data, factura, nif: c?.nifCif || '',
        }))
        await this.fetchLimpiezas(this.selectedMonth, this.selectedYear)
        return factura
      } catch (e) {
        this.addLimpiezaError = e
        console.error('[DB] addLimpieza:', e)
        throw e
      } finally {
        this.isAddingLimpieza = false
      }
    },

    async updateLimpieza(row, data) {
      this.isUpdatingLimpieza  = true
      this.updateLimpiezaError = null
      try {
        const existing = this._allLimpiezas.find(l => l._row === row) || {}
        const c = this.clientes.find(cl => cl.nombre === (data.clienteId ?? existing.clienteId))
        const merged = { ...existing, ...data, nif: c?.nifCif || existing.nif }
        await updateSheetRow(TAB.facturas, row, FACTURAS_HEADERS, facturaToRow(merged))
        await this.fetchLimpiezas(this.selectedMonth, this.selectedYear)
      } catch (e) {
        this.updateLimpiezaError = e
        console.error('[DB] updateLimpieza:', e)
        throw e
      } finally {
        this.isUpdatingLimpieza = false
      }
    },

    async deleteLimpieza(row) {
      this.isDeletingLimpieza  = true
      this.deleteLimpiezaError = null
      try {
        await deleteSheetRow(TAB.facturas, row)
        this.limpiezas     = this.limpiezas.filter(l => l._row !== row)
        this._allLimpiezas = this._allLimpiezas.filter(l => l._row !== row)
      } catch (e) {
        this.deleteLimpiezaError = e
        console.error('[DB] deleteLimpieza:', e)
        throw e
      } finally {
        this.isDeletingLimpieza = false
      }
    },

    async updatePaymentStatus(row, newFechaPago) {
      this.isUpdatingLimpieza  = true
      this.updateLimpiezaError = null
      try {
        const existing = this._allLimpiezas.find(l => l._row === row) || {}
        const merged = { ...existing, fechaPago: newFechaPago || null, estado: newFechaPago ? 'Pagada' : 'Pendiente' }
        await updateSheetRow(TAB.facturas, row, FACTURAS_HEADERS, facturaToRow(merged))
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
      if (!this.clientes.length) {
        const cached = loadCache('clientes')
        if (cached?.records?.length) {
          this.clientes = this._sortClientes(cached.records)
        }
      }

      this.isLoadingClientes = true
      this.errorClientes     = null
      try {
        const { records } = await getSheetRaw(TAB.clientes)
        // Filas con validación de datos preparadas para futuros clientes
        // (u otra fila sin rellenar) pueden tener algo en alguna columna sin
        // ser un cliente real todavía — solo cuenta como cliente si tiene
        // Nombre / Razón social.
        const fresh = records.map(clienteFromRow).filter(c => c.nombre)
        if (hasChanges(this.clientes, fresh)) {
          this.clientes = this._sortClientes(fresh)
          saveCache('clientes', fresh)
        }
      } catch (e) {
        this.errorClientes = e
        console.error('[DB] fetchClientes:', e)
        if (!this.clientes.length) this.clientes = []
      } finally {
        this.isLoadingClientes = false
      }
    },

    _sortClientes(records) {
      return [...records].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '', 'es'))
    },

    async fetchClientById(nombre) {
      if (!nombre) return null
      const cached = this.clientes.find(c => c.nombre === nombre)
      if (cached) return cached
      await this.fetchClientes()
      return this.clientes.find(c => c.nombre === nombre) || null
    },

    async addClient(data) {
      this.isAddingClient = true
      this.addClientError = null
      try {
        await appendSheetRow(TAB.clientes, CLIENTES_HEADERS, clienteToRow(data))
        await this.fetchClientes()
      } catch (e) {
        this.addClientError = e
        console.error('[DB] addClient:', e)
        throw e
      } finally {
        this.isAddingClient = false
      }
    },

    async updateClient(row, data) {
      this.isUpdatingClient  = true
      this.updateClientError = null
      try {
        const existing = this.clientes.find(c => c._row === row) || {}
        await updateSheetRow(TAB.clientes, row, CLIENTES_HEADERS, clienteToRow({ ...existing, ...data }))
        // Recarga desde la hoja en vez de parchear en memoria: si antes se
        // borró un cliente en esta sesión, las filas de los que venían
        // detrás quedaron desfasadas (_row) hasta el próximo fetch — parchear
        // localmente con un _row obsoleto podría escribir en la fila de otro
        // cliente. Releer siempre corrige esto.
        await this.fetchClientes()
      } catch (e) {
        this.updateClientError = e
        console.error('[DB] updateClient:', e)
        throw e
      } finally {
        this.isUpdatingClient = false
      }
    },

    async deleteClient(row) {
      this.isDeletingClient  = true
      this.deleteClientError = null
      try {
        await deleteSheetRow(TAB.clientes, row)
        // Borrar una fila desplaza hacia arriba todas las siguientes en la
        // hoja real; recargar en vez de filtrar en memoria evita que el
        // resto de clientes se queden con un _row obsoleto (que apuntaría a
        // la fila de otro cliente en la siguiente edición o borrado).
        await this.fetchClientes()
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
      this.selectedMonthGastos = month
      this.selectedYearGastos  = year

      if (!this.gastos.length) {
        const cached = loadCache('gastos')
        if (cached?.records?.length) {
          this.gastos = this._filterGastos(cached.records, month, year)
          this._allGastos = cached.records
        }
      } else {
        this.gastos = this._filterGastos(this._allGastos || this.gastos, month, year)
      }

      this.isLoadingGastos = true
      this.errorGastos     = null
      try {
        const { records } = await getSheetRaw(TAB.gastos)
        const fresh = records.map(gastoFromRow)
        if (hasChanges(this._allGastos || this.gastos, fresh)) {
          this._allGastos = fresh
          saveCache('gastos', fresh)
          this.gastos = this._filterGastos(fresh, month, year)
        }
      } catch (e) {
        this.errorGastos = e
        console.error('[DB] fetchGastos:', e)
      } finally {
        this.isLoadingGastos = false
      }
    },

    _filterGastos(all, month, year) {
      if (!year) return [...all]
      return all.filter(g => matchesMonthYear(g.fechaFactura, month, year))
    },

    async addGasto(data) {
      this.isAddingGasto = true
      this.addGastoError = null
      try {
        await appendSheetRow(TAB.gastos, GASTOS_HEADERS, gastoToRow(data))
        await this.fetchGastos(this.selectedMonthGastos, this.selectedYearGastos)
      } catch (e) {
        this.addGastoError = e
        console.error('[DB] addGasto:', e)
        throw e
      } finally {
        this.isAddingGasto = false
      }
    },

    async updateGasto(row, data) {
      this.isUpdatingGasto  = true
      this.updateGastoError = null
      try {
        const existing = this._allGastos.find(g => g._row === row) || {}
        await updateSheetRow(TAB.gastos, row, GASTOS_HEADERS, gastoToRow({ ...existing, ...data }))
        await this.fetchGastos(this.selectedMonthGastos, this.selectedYearGastos)
      } catch (e) {
        this.updateGastoError = e
        console.error('[DB] updateGasto:', e)
        throw e
      } finally {
        this.isUpdatingGasto = false
      }
    },

    async deleteGasto(row) {
      this.isDeletingGasto  = true
      this.deleteGastoError = null
      try {
        await deleteSheetRow(TAB.gastos, row)
        this.gastos     = this.gastos.filter(g => g._row !== row)
        this._allGastos = this._allGastos.filter(g => g._row !== row)
        saveCache('gastos', this._allGastos)
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
