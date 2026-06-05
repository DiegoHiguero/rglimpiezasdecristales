/**
 * localCache.js — Caché local en localStorage para datos de Google Sheets.
 * Permite cargar datos al instante en el arranque y hacer sync inteligente
 * (solo actualiza el estado si hay datos nuevos o modificados).
 */

const PREFIX = 'rc_cache_'

/**
 * Guarda registros en localStorage con timestamp.
 * @param {'limpiezas'|'clientes'|'gastos'} key
 * @param {Array} records
 */
export function saveCache(key, records) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ records, ts: Date.now() }))
  } catch { /* cuota llena o no disponible */ }
}

/**
 * Carga registros de localStorage.
 * @param {'limpiezas'|'clientes'|'gastos'} key
 * @returns {{ records: Array, ts: number } | null}
 */
export function loadCache(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

/**
 * Compara dos arrays de registros por ID y contenido.
 * Devuelve true si hay diferencias (nuevo, modificado o eliminado).
 * @param {Array|null} cached
 * @param {Array} fresh
 * @returns {boolean}
 */
export function hasChanges(cached, fresh) {
  if (!cached || cached.length !== fresh.length) return true
  const sortById = arr => [...arr].sort((a, b) => (a.id < b.id ? -1 : 1))
  return JSON.stringify(sortById(cached)) !== JSON.stringify(sortById(fresh))
}
