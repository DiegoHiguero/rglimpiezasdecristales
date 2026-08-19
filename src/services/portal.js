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

/**
 * Migración única: consolida las subcolecciones `facturas`/`firmas` legadas
 * (de antes de este cambio) dentro de los campos array del documento padre.
 * Solo el admin puede ejecutarla (así lo exigen las reglas de Firestore
 * sobre esas subcolecciones). Idempotente — se puede ejecutar varias veces
 * sin duplicar datos.
 */
export async function migrateAllPortalSubcollections() {
  const tokensSnap = await getDocs(collection(db, 'clientePortalTokens'))
  let migrados = 0

  for (const tDoc of tokensSnap.docs) {
    const token = tDoc.data().token
    if (!token) continue

    const parentRef = doc(db, 'facturasPublicas', token)
    const parentSnap = await getDoc(parentRef)
    if (!parentSnap.exists()) continue

    const current = parentSnap.data()
    const facturasById = new Map((current.facturas || []).map((f) => [f.id, f]))
    const firmasById = new Map((current.firmas || []).map((f) => [f.id, f]))

    const [facturasSnap, firmasSnap] = await Promise.all([
      getDocs(collection(db, 'facturasPublicas', token, 'facturas')),
      getDocs(collection(db, 'facturasPublicas', token, 'firmas')),
    ])

    let cambios = false
    facturasSnap.docs.forEach((d) => {
      if (!facturasById.has(d.id)) { facturasById.set(d.id, { id: d.id, ...d.data() }); cambios = true }
    })
    firmasSnap.docs.forEach((d) => {
      if (!firmasById.has(d.id)) { firmasById.set(d.id, { id: d.id, ...d.data() }); cambios = true }
    })

    if (cambios) {
      await setDoc(parentRef, {
        facturas: Array.from(facturasById.values()),
        firmas: Array.from(firmasById.values()),
      }, { merge: true })
      migrados++
    }
  }

  return migrados
}
