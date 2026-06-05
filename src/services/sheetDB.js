/**
 * sheetDB.js — Google Sheets como base de datos.
 * Implementa CRUD completo (getAll, add, update, remove) sobre 3 colecciones:
 * limpiezas, clientes, gastos.
 */

import { useUserStore } from '../stores/user'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebaseConfig'

const SPREADSHEET_ID = '1Fo2Tu0Y3buEFB9Elvo_SrjjkvwTISYO4cahvkaUmwO8'
const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`

// ─── Esquemas de colecciones ─────────────────────────────────────────────────

export const SCHEMA = {
  limpiezas: {
    tab: 'Limpiezas',
    header: ['ID', 'Factura', 'ID Cliente', 'Cliente', 'Fecha Servicio', 'Fecha Pago', 'Forma Pago', 'Importe', 'Precio Bruto', 'Descripción', 'Creado'],
    fromRow: r => ({
      id:                     r[0]  || '',
      factura:                r[1]  || '',
      clienteId:              r[2]  || '',
      // r[3] = nombre cliente (solo display)
      fechaPrincipalLimpieza: r[4]  || '',
      fechaPago:              r[5]  || null,
      formaPago:              r[6]  || '',
      importe:                parseFloat(r[7])  || 0,
      precioBruto:            parseFloat(r[8])  || parseFloat(r[7]) || 0,
      descripcion:            r[9]  || '',
      createdAt:              r[10] || '',
    }),
    toRow: d => [
      d.id                     || '',
      d.factura                || '',
      d.clienteId              || '',
      d.clienteName            || '',
      d.fechaPrincipalLimpieza || '',
      d.fechaPago              || '',
      d.formaPago              || '',
      String(d.importe         ?? 0),
      String(d.precioBruto     ?? d.importe ?? 0),
      d.descripcion            || '',
      d.createdAt              || today(),
    ],
  },

  clientes: {
    tab: 'Clientes',
    header: ['ID', 'Nombre', 'Apellido', 'Teléfono', 'Email', 'Dirección', 'CP', 'Ciudad', 'Dir Intervención', 'CP Int', 'Ciudad Int', 'Provincia Int', 'Notas', 'Creado'],
    fromRow: r => ({
      id:                   r[0]  || '',
      nombre:               r[1]  || '',
      apellido:             r[2]  || '',
      telefono:             r[3]  || '',
      email:                r[4]  || '',
      direccion:            r[5]  || '',
      codigoPostal:         r[6]  || '',
      ciudad:               r[7]  || '',
      direccionIntervencion: {
        calle:        r[8]  || '',
        codigoPostal: r[9]  || '',
        ciudad:       r[10] || '',
        provincia:    r[11] || '',
      },
      notas:   r[12] || '',
      createdAt: r[13] || '',
    }),
    toRow: d => [
      d.id              || '',
      d.nombre          || '',
      d.apellido        || '',
      d.telefono        || '',
      d.email           || '',
      d.direccion       || '',
      d.codigoPostal    || '',
      d.ciudad          || '',
      d.direccionIntervencion?.calle        || '',
      d.direccionIntervencion?.codigoPostal || '',
      d.direccionIntervencion?.ciudad       || '',
      d.direccionIntervencion?.provincia    || '',
      d.notas           || '',
      d.createdAt       || today(),
    ],
  },

  gastos: {
    tab: 'Gastos',
    header: ['ID', 'Tipo', 'Fecha Factura', 'Nº Factura', 'Sin IVA', 'IVA', 'Con IVA', 'Notas', 'Verificado', 'Creado'],
    fromRow: r => ({
      id:             r[0] || '',
      tipo:           r[1] || 'Gasolina',
      fechaFactura:   r[2] || '',
      numeroFactura:  r[3] || '',
      precioSinIVA:   parseFloat(r[4]) || 0,
      iva:            parseFloat(r[5]) || 0,
      precioConIVA:   parseFloat(r[6]) || 0,
      notas:          r[7] || '',
      verificado:     r[8] === 'true' || r[8] === true,
      createdAt:      r[9] || '',
    }),
    toRow: d => [
      d.id              || '',
      d.tipo            || 'Gasolina',
      d.fechaFactura    || '',
      d.numeroFactura   || '',
      String(d.precioSinIVA ?? 0),
      String(d.iva          ?? 0),
      String(d.precioConIVA ?? 0),
      d.notas           || '',
      String(d.verificado || false),
      d.createdAt       || today(),
    ],
  },
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// ─── Gestión del token OAuth2 ────────────────────────────────────────────────

async function getToken() {
  const userStore = useUserStore()
  if (userStore.googleAccessToken) return userStore.googleAccessToken

  const provider = new GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/spreadsheets')
  const result = await signInWithPopup(auth, provider)
  const cred = GoogleAuthProvider.credentialFromResult(result)
  if (!cred?.accessToken) throw new Error('No se pudo obtener el token de Google Sheets.')
  userStore.googleAccessToken = cred.accessToken
  return cred.accessToken
}

// ─── API wrapper ─────────────────────────────────────────────────────────────

async function api(path, method = 'GET', body = null, _retry = true) {
  const token = await getToken()
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && _retry) {
    useUserStore().googleAccessToken = null
    return api(path, method, body, false)
  }
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error(e?.error?.message || `Sheets API error ${res.status}`)
  }
  return res.json()
}

// ─── Metadatos de hojas ──────────────────────────────────────────────────────

let _meta        = null
let _metaPromise = null   // evita fetches concurrentes múltiples

async function getMeta() {
  if (_meta) return _meta
  // Si ya hay un fetch en curso, esperamos el mismo (no iniciamos otro)
  if (!_metaPromise) {
    _metaPromise = api('?fields=sheets.properties(sheetId,title)')
      .then(d => {
        _meta = (d.sheets || []).map(s => s.properties)
        _metaPromise = null
        return _meta
      })
      .catch(e => { _metaPromise = null; throw e })
  }
  return _metaPromise
}

async function getSheetId(title) {
  const meta = await getMeta()
  const s = meta.find(m => m.title === title)
  if (!s) throw new Error(`Pestaña "${title}" no encontrada`)
  return s.sheetId
}

async function ensureTabs(names) {
  const meta = await getMeta()
  const existing = new Set(meta.map(m => m.title))
  const missing = names.filter(n => !existing.has(n))
  if (!missing.length) return

  try {
    await api(':batchUpdate', 'POST', {
      requests: missing.map(title => ({ addSheet: { properties: { title } } })),
    })
  } catch (e) {
    // Ignorar "ya existe" — puede ocurrir por llamadas concurrentes
    const msg = (e.message || '').toLowerCase()
    if (!msg.includes('already exists') && !msg.includes('ya existe')) throw e
  }
  _meta = null   // invalidar caché para siguiente lectura
  _ready.clear() // forzar re-init de colecciones
}

async function ensureHeader(key) {
  const { tab, header } = SCHEMA[key]
  const d = await api(`/values/${enc(tab + '!A1:A1')}`)
  if (!d.values?.length) {
    await api(`/values/${enc(tab + '!A1')}?valueInputOption=RAW`, 'PUT', {
      range: `${tab}!A1`,
      values: [header],
    })
  }
}

function enc(s) {
  return encodeURIComponent(s)
}

// ─── Inicialización por colección (una sola vez) ──────────────────────────────

// Evita llamar ensureTabs+ensureHeader en cada lectura
const _ready = new Set()
const _readyPromises = {}

async function initIfNeeded(key) {
  if (_ready.has(key)) return
  if (_readyPromises[key]) return _readyPromises[key]
  _readyPromises[key] = (async () => {
    await ensureTabs([SCHEMA[key].tab])
    await ensureHeader(key)
    _ready.add(key)
    delete _readyPromises[key]
  })()
  return _readyPromises[key]
}

// ─── CRUD público ────────────────────────────────────────────────────────────

/**
 * Lee todos los registros de una colección.
 * @param {'limpiezas'|'clientes'|'gastos'} key
 * @returns {Promise<Array>}
 */
export async function getAll(key) {
  const { tab, fromRow } = SCHEMA[key]
  await initIfNeeded(key)

  const d = await api(`/values/${enc(tab + '!A2:Z')}`)
  return (d.values || []).filter(r => r[0]).map(fromRow)
}

/**
 * Añade un nuevo registro. Devuelve el ID generado.
 * @param {'limpiezas'|'clientes'|'gastos'} key
 * @param {Object} data  — incluir clienteName en limpiezas para la columna display
 * @returns {Promise<string>} id
 */
export async function addRecord(key, data) {
  const { tab, toRow } = SCHEMA[key]
  await initIfNeeded(key)

  const id = genId()
  const obj = { ...data, id, createdAt: data.createdAt || today() }
  const row = toRow(obj)

  await api(
    `/values/${enc(tab + '!A:Z')}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    'POST',
    { range: `${tab}!A:Z`, values: [row] },
  )
  return id
}

/**
 * Actualiza un registro existente por ID (merge parcial).
 * @param {'limpiezas'|'clientes'|'gastos'} key
 * @param {string} id
 * @param {Object} patch  — solo los campos que cambian
 */
export async function updateRecord(key, id, patch) {
  const { tab, fromRow, toRow } = SCHEMA[key]

  // 1. Buscar el índice de la fila (columna A, empezando en fila 2)
  const colA = await api(`/values/${enc(tab + '!A:A')}`)
  const rows = colA.values || []
  const rowIndex = rows.findIndex((r, i) => i > 0 && r[0] === id)
  if (rowIndex === -1) throw new Error(`[sheetDB] ID ${id} no encontrado en ${tab}`)

  const sheetRow = rowIndex + 1 // 1-based

  // 2. Leer la fila completa para hacer merge
  const existing = await api(`/values/${enc(tab + `!A${sheetRow}:Z${sheetRow}`)}`)
  const existingObj = fromRow((existing.values || [[]])[0] || [])

  // 3. Fusionar y escribir de vuelta
  const merged = { ...existingObj, ...patch, id }
  await api(
    `/values/${enc(tab + `!A${sheetRow}:Z${sheetRow}`)}?valueInputOption=RAW`,
    'PUT',
    { range: `${tab}!A${sheetRow}:Z${sheetRow}`, values: [toRow(merged)] },
  )
}

/**
 * Sobreescribe toda una pestaña con un array de objetos (conservando IDs).
 * Útil para migración masiva desde Firestore.
 * @param {'limpiezas'|'clientes'|'gastos'} key
 * @param {Array} records — deben tener el campo `id` ya asignado
 */
export async function bulkReplace(key, records) {
  const { tab, header, toRow } = SCHEMA[key]
  await ensureTabs([tab])

  const rows = [header, ...records.map(r => toRow(r))]
  await api(
    `/values/${enc(tab + '!A1')}?valueInputOption=RAW`,
    'PUT',
    { range: `${tab}!A1`, values: rows },
  )
}

/**
 * Elimina un registro por ID (borra la fila completa).
 * @param {'limpiezas'|'clientes'|'gastos'} key
 * @param {string} id
 */
export async function removeRecord(key, id) {
  const { tab } = SCHEMA[key]
  const sheetId = await getSheetId(tab)

  const colA = await api(`/values/${enc(tab + '!A:A')}`)
  const rows = colA.values || []
  const rowIndex = rows.findIndex((r, i) => i > 0 && r[0] === id)
  if (rowIndex === -1) throw new Error(`[sheetDB] ID ${id} no encontrado en ${tab}`)

  await api(':batchUpdate', 'POST', {
    requests: [{
      deleteDimension: {
        range: {
          sheetId,
          dimension: 'ROWS',
          startIndex: rowIndex,      // 0-based, row 0 = header no se toca por rowIndex > 0
          endIndex: rowIndex + 1,
        },
      },
    }],
  })
}
