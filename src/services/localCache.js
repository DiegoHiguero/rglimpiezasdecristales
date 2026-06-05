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
 * Compara dos arrays de registros para detectar cambios.
 * Compara conteo, IDs y una huella ligera de los datos para evitar
 * serializar arrays grandes completos en cada sync.
 * @param {Array|null} cached
 * @param {Array} fresh
 * @returns {boolean}
 */
export function hasChanges(cached, fresh) {
  if (!cached || cached.length !== fresh.length) return true
  // Comparar fingerprint: IDs ordenados + suma de longitudes de valores
  const fp = arr => arr
    .map(r => r.id + ':' + Object.values(r).join('|').length)
    .sort()
    .join(',')
  return fp(cached) !== fp(fresh)
}
