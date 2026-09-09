/**
 * sheetDB.js — Google Sheets como base de datos.
 * Acceso genérico por pestaña (getSheetRaw/appendSheetRow/updateSheetRow/deleteSheetRow),
 * sin columna de ID: cada fila se identifica por su número de fila (_row).
 */

import { useUserStore } from '../stores/user'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebaseConfig'

const SPREADSHEET_ID = '1agb2ZG15SDYtrGD7fyi3hzRuHnj7uTwZP716_h5Qpro'
const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`

// ─── Gestión del token OAuth2 ────────────────────────────────────────────────

// Varias vistas piden datos de Sheets a la vez al cargar la página (clientes,
// limpiezas, gastos...). Sin esto, cada una encontraba el token vacío al mismo
// tiempo y abría su propia ventana de login de Google — varios popups a la
// vez, y cada popup completado pisaba el token del anterior a medias.
// Igual que getMeta(), una sola promesa en curso se comparte entre todas.
let _tokenPromise = null

async function getToken() {
  const userStore = useUserStore()
  if (userStore.googleAccessToken) return userStore.googleAccessToken

  if (!_tokenPromise) {
    _tokenPromise = (async () => {
      const provider = new GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/spreadsheets')
      const result = await signInWithPopup(auth, provider)
      const cred = GoogleAuthProvider.credentialFromResult(result)
      if (!cred?.accessToken) throw new Error('No se pudo obtener el token de Google Sheets.')
      userStore.googleAccessToken = cred.accessToken
      return cred.accessToken
    })().finally(() => { _tokenPromise = null })
  }
  return _tokenPromise
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

function enc(s) {
  return encodeURIComponent(s)
}

// ─── API genérica (cualquier pestaña, sin schema fijo) ───────────────────────

/**
 * Devuelve los nombres de todas las pestañas de la hoja.
 */
export async function getTabNames() {
  const meta = await getMeta()
  return meta.map(s => s.title)
}

/**
 * Invalida la caché de metadatos para forzar una recarga en la próxima llamada.
 */
export function invalidateMeta() {
  _meta = null
}

// Todas las pestañas de esta hoja siguen la misma plantilla: columna A vacía
// (margen), fila 2 = título, fila 3 = subtítulo, filas 4-5 en blanco,
// fila 6 = cabecera real, fila 7+ = datos.
const HEADER_ROW      = 6
const DATA_START_ROW  = HEADER_ROW + 1
const FIRST_COL       = 'B'
const FIRST_COL_INDEX = 2 // B

/**
 * Lee cualquier pestaña por nombre usando la fila 6 (columna B en adelante) como cabecera.
 * Cada registro incluye _row (número de fila 1-based) para edición/borrado.
 */
export async function getSheetRaw(tabName) {
  const d = await api(`/values/${enc(tabName + `!${FIRST_COL}${HEADER_ROW}:Z`)}`)
  const all = d.values || []
  if (!all.length) return { headers: [], records: [] }
  const headers = (all[0] || []).map(h => String(h))
  const records = all.slice(1)
    .map((row, i) => {
      const obj = { _row: DATA_START_ROW + i }
      headers.forEach((h, j) => { obj[h] = row[j] ?? '' })
      return obj
    })
    .filter(r => headers.some(h => r[h] !== ''))
  return { headers, records }
}

/**
 * Añade una nueva fila al final de la pestaña.
 */
export async function appendSheetRow(tabName, headers, data) {
  const row = headers.map(h => String(data[h] ?? ''))
  await api(
    `/values/${enc(tabName + `!${FIRST_COL}${HEADER_ROW}:Z`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    'POST',
    { range: `${tabName}!${FIRST_COL}${HEADER_ROW}:Z`, values: [row] },
  )
}

/**
 * Actualiza una fila existente por número de fila (1-based).
 */
export async function updateSheetRow(tabName, rowNum, headers, data) {
  const colEnd = colLetter(FIRST_COL_INDEX + headers.length - 1)
  const range = `${tabName}!${FIRST_COL}${rowNum}:${colEnd}${rowNum}`
  const row = headers.map(h => String(data[h] ?? ''))
  await api(`/values/${enc(range)}?valueInputOption=USER_ENTERED`, 'PUT', { range, values: [row] })
}

/**
 * Elimina una fila por número de fila (1-based).
 */
export async function deleteSheetRow(tabName, rowNum) {
  const sheetId = await getSheetId(tabName)
  await api(':batchUpdate', 'POST', {
    requests: [{
      deleteDimension: {
        range: { sheetId, dimension: 'ROWS', startIndex: rowNum - 1, endIndex: rowNum },
      },
    }],
  })
}

function colLetter(n) {
  let s = ''
  while (n > 0) {
    n--
    s = String.fromCharCode(65 + (n % 26)) + s
    n = Math.floor(n / 26)
  }
  return s || 'Z'
}
