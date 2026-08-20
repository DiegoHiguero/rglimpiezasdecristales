/**
 * portal.js — Portal público de clientes: enlace único por cliente, espejo
 * ligero de sus facturas, y firmas capturadas por separado (en cada visita)
 * que luego se vinculan a una factura cuando se emite. Vive en Firestore
 * (no en la hoja de cálculo) porque el cliente no puede ni debe
 * autenticarse con la cuenta de Google del admin para leer Sheets.
 */

import { db, storage } from '../firebaseConfig'
import { doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, arrayUnion, runTransaction } from 'firebase/firestore'
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage'

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Devuelve el token de portal del cliente, creándolo (y su índice por
 * email, si tiene) la primera vez que se pide.
 */
export async function ensurePortalToken(clienteNombre, clienteEmail = '', clienteDireccion = '') {
  const nameSlug = slugify(clienteNombre)
  if (!nameSlug) throw new Error('El cliente no tiene nombre para generar el enlace del portal.')

  const tokenRef = doc(db, 'clientePortalTokens', nameSlug)
  const snap = await getDoc(tokenRef)
  if (snap.exists()) return snap.data().token

  const token = crypto.randomUUID()
  const clienteData = { clienteNombre, clienteEmail: clienteEmail || '', clienteDireccion: clienteDireccion || '' }
  await setDoc(tokenRef, { token, ...clienteData })
  await setDoc(doc(db, 'facturasPublicas', token), clienteData)
  if (clienteEmail) {
    await setDoc(doc(db, 'clientePortalIndex', slugify(clienteEmail)), { clienteEmail, portalToken: token })
  }
  return token
}

/**
 * Crea/actualiza el espejo público de una factura (se llama tras guardarla
 * en la hoja de cálculo real).
 *
 * `facturas` y `firmas` viven como campos array dentro del propio documento
 * `facturasPublicas/{token}` (no como subcolecciones). Firestore no puede
 * distinguir, a nivel de reglas, entre "listar la subcolección de un padre
 * ya conocido" y "listar vía collection-group query sin conocer ningún
 * token" — un `allow read: if true` en una subcolección anidada se aplica
 * igual a ambos casos, así que una subcolección pública habría permitido
 * leer los datos de TODOS los clientes sin conocer ningún enlace. Guardar
 * estos datos como campos del documento padre (protegido por `allow get`
 * con el token exacto) cierra esa vía por diseño.
 */
export async function mirrorFacturaToPortal(portalToken, { numeroFactura, fecha, concepto, total, estado }) {
  if (!portalToken || !numeroFactura) return
  const parentRef = doc(db, 'facturasPublicas', portalToken)
  const id = String(numeroFactura)
  const entry = { id, fecha: fecha || '', concepto: concepto || '', total: total ?? 0, estado: estado || 'Pendiente' }

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(parentRef)
    const facturas = (snap.exists() ? snap.data().facturas : []) || []
    const idx = facturas.findIndex((f) => f.id === id)
    if (idx >= 0) facturas[idx] = { ...facturas[idx], ...entry }
    else facturas.push(entry)
    tx.set(parentRef, { facturas }, { merge: true })
  })
}

// ─── Firmas (independientes de la factura, se vinculan después) ────────────

/**
 * Sube una firma (PNG en data URL, tal como la entrega signature_pad) como
 * un registro suelto, sin vincular a ninguna factura todavía.
 */
export async function captureFirma(portalToken, dataUrl) {
  if (!portalToken || !dataUrl) return null
  const firmaId = crypto.randomUUID()
  const storageRef = ref(storage, `firmas/${portalToken}/${firmaId}.png`)
  await uploadString(storageRef, dataUrl, 'data_url')
  const url = await getDownloadURL(storageRef)

  const nuevaFirma = { id: firmaId, url, fecha: new Date().toISOString(), facturaId: null }
  await updateDoc(doc(db, 'facturasPublicas', portalToken), { firmas: arrayUnion(nuevaFirma) })
  return { id: firmaId, url }
}

/** Todas las firmas de un cliente (vinculadas o no), más recientes primero. */
export async function getFirmasCliente(portalToken) {
  if (!portalToken) return []
  const snap = await getDoc(doc(db, 'facturasPublicas', portalToken))
  if (!snap.exists()) return []
  return [...(snap.data().firmas || [])].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))
}

/** Cambia la fecha/hora de una firma (por si se capturó tarde o se olvidó ese día). */
export async function updateFirmaFecha(portalToken, firmaId, nuevaFechaISO) {
  if (!portalToken || !firmaId || !nuevaFechaISO) return
  const parentRef = doc(db, 'facturasPublicas', portalToken)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(parentRef)
    if (!snap.exists()) return
    const firmas = (snap.data().firmas || []).map((f) =>
      f.id === firmaId ? { ...f, fecha: nuevaFechaISO } : f
    )
    tx.update(parentRef, { firmas })
  })
}

/** Vincula una o varias firmas sueltas a una factura ya emitida. */
export async function linkFirmasToFactura(portalToken, numeroFactura, firmaIds) {
  if (!portalToken || !numeroFactura || !firmaIds?.length) return
  const parentRef = doc(db, 'facturasPublicas', portalToken)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(parentRef)
    if (!snap.exists()) return
    const firmas = (snap.data().firmas || []).map((f) =>
      firmaIds.includes(f.id) ? { ...f, facturaId: String(numeroFactura) } : f
    )
    tx.update(parentRef, { firmas })
  })
}

/** Borra una firma suelta (pensado para corregir capturas por error). */
export async function deleteFirma(portalToken, firmaId, storageUrl) {
  if (!portalToken || !firmaId) return
  const parentRef = doc(db, 'facturasPublicas', portalToken)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(parentRef)
    if (!snap.exists()) return
    const firmas = (snap.data().firmas || []).filter((f) => f.id !== firmaId)
    tx.update(parentRef, { firmas })
  })
  if (storageUrl) {
    try { await deleteObject(ref(storage, storageUrl)) } catch { /* si ya no existe, no pasa nada */ }
  }
}

/** Facturas espejadas de un cliente (solo lo necesario para vincular firmas), más recientes primero. */
export async function getFacturasCliente(portalToken) {
  if (!portalToken) return []
  const snap = await getDoc(doc(db, 'facturasPublicas', portalToken))
  if (!snap.exists()) return []
  return [...(snap.data().facturas || [])].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))
}

/**
 * Todas las firmas sin facturar, de todos los clientes que ya tienen enlace
 * de portal creado. Sirve para ver de un vistazo el trabajo atrasado sin
 * tener que buscar cliente por cliente. Requiere admin (lista
 * `clientePortalTokens`, que las reglas restringen a `isSignedInAsAdmin()`).
 */
export async function getAllPendingFirmas() {
  const tokensSnap = await getDocs(collection(db, 'clientePortalTokens'))
  const pendientes = []

  await Promise.all(tokensSnap.docs.map(async (tDoc) => {
    const { token, clienteNombre } = tDoc.data()
    if (!token) return
    const snap = await getDoc(doc(db, 'facturasPublicas', token))
    if (!snap.exists()) return
    ;(snap.data().firmas || [])
      .filter((f) => !f.facturaId)
      .forEach((f) => pendientes.push({ ...f, clienteNombre, token }))
  }))

  return pendientes.sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''))
}

/** Login por Google: busca el token de portal a partir del email verificado. */
export async function findTokenByEmail(email) {
  if (!email) return null
  const snap = await getDoc(doc(db, 'clientePortalIndex', slugify(email)))
  return snap.exists() ? snap.data().portalToken : null
}

/** Datos completos de un cliente + sus facturas (con sus firmas vinculadas), para el portal. */
export async function getPortalData(token) {
  if (!token) return null
  const clienteSnap = await getDoc(doc(db, 'facturasPublicas', token))
  if (!clienteSnap.exists()) return null

  const { facturas: rawFacturas, firmas: rawFirmas, ...clienteInfo } = clienteSnap.data()

  const firmasPorFactura = {}
  ;(rawFirmas || []).forEach((f) => {
    if (!f.facturaId) return
    if (!firmasPorFactura[f.facturaId]) firmasPorFactura[f.facturaId] = []
    firmasPorFactura[f.facturaId].push(f)
  })

  const facturas = (rawFacturas || [])
    .map((f) => ({ ...f, firmas: firmasPorFactura[f.id] || [] }))
    .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))

  return { ...clienteInfo, facturas }
}

