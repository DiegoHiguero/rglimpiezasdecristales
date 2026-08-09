/**
 * portal.js — Portal público de clientes: enlace único por cliente, espejo
 * ligero de sus facturas, y firmas capturadas por separado (en cada visita)
 * que luego se vinculan a una factura cuando se emite. Vive en Firestore
 * (no en la hoja de cálculo) porque el cliente no puede ni debe
 * autenticarse con la cuenta de Google del admin para leer Sheets.
 */

import { db, storage } from '../firebaseConfig'
import { doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore'
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
 */
export async function mirrorFacturaToPortal(portalToken, { numeroFactura, fecha, concepto, total, estado }) {
  if (!portalToken || !numeroFactura) return
  const facturaRef = doc(db, 'facturasPublicas', portalToken, 'facturas', String(numeroFactura))
  await setDoc(facturaRef, { fecha: fecha || '', concepto: concepto || '', total: total ?? 0, estado: estado || 'Pendiente' }, { merge: true })
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

  await setDoc(doc(db, 'facturasPublicas', portalToken, 'firmas', firmaId), {
    url,
    fecha: new Date().toISOString(),
    facturaId: null,
  })
  return { id: firmaId, url }
}

/** Todas las firmas de un cliente (vinculadas o no), más recientes primero. */
export async function getFirmasCliente(portalToken) {
  if (!portalToken) return []
  const snap = await getDocs(collection(db, 'facturasPublicas', portalToken, 'firmas'))
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))
}

/** Vincula una o varias firmas sueltas a una factura ya emitida. */
export async function linkFirmasToFactura(portalToken, numeroFactura, firmaIds) {
  if (!portalToken || !numeroFactura || !firmaIds?.length) return
  await Promise.all(
    firmaIds.map((id) =>
      updateDoc(doc(db, 'facturasPublicas', portalToken, 'firmas', id), { facturaId: String(numeroFactura) })
    )
  )
}

/** Borra una firma suelta (pensado para corregir capturas por error). */
export async function deleteFirma(portalToken, firmaId, storageUrl) {
  if (!portalToken || !firmaId) return
  await deleteDoc(doc(db, 'facturasPublicas', portalToken, 'firmas', firmaId))
  if (storageUrl) {
    try { await deleteObject(ref(storage, storageUrl)) } catch { /* si ya no existe, no pasa nada */ }
  }
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

  const [facturasSnap, firmasSnap] = await Promise.all([
    getDocs(collection(db, 'facturasPublicas', token, 'facturas')),
    getDocs(collection(db, 'facturasPublicas', token, 'firmas')),
  ])

  const firmasPorFactura = {}
  firmasSnap.docs.forEach((d) => {
    const data = d.data()
    if (!data.facturaId) return
    if (!firmasPorFactura[data.facturaId]) firmasPorFactura[data.facturaId] = []
    firmasPorFactura[data.facturaId].push({ id: d.id, ...data })
  })

  const facturas = facturasSnap.docs
    .map((d) => ({ id: d.id, ...d.data(), firmas: firmasPorFactura[d.id] || [] }))
    .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))

  return { ...clienteSnap.data(), facturas }
}
