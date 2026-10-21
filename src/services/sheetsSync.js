import { useUserStore } from '../stores/user'
import { useDatabaseStore } from '../stores/database'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, db } from '../firebaseConfig'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import dayjs from 'dayjs'

const SPREADSHEET_ID = '1Fo2Tu0Y3buEFB9Elvo_SrjjkvwTISYO4cahvkaUmwO8'
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'

const TABS = {
  limpiezas: 'Limpiezas',
  clientes: 'Clientes',
  gastos: 'Gastos',
  mensajes: 'Mensajes',
}

const HEADERS = {
  limpiezas: ['ID Firestore', 'Factura', 'Cliente', 'Fecha Servicio', 'Fecha Pago', 'Forma Pago', 'Importe (€)', 'Pagado', 'Descripción', 'ID Cliente'],
  clientes:  ['ID Firestore', 'Nombre', 'Apellido', 'Teléfono', 'Email', 'Dirección', 'CP', 'Ciudad'],
  gastos:    ['ID Firestore', 'Descripción', 'Importe (€)', 'Fecha', 'Categoría'],
  mensajes:  ['ID Firestore', 'Nombre', 'Email', 'Teléfono', 'Mensaje', 'Fecha', 'Leído'],
}

// ─── Token management ────────────────────────────────────────────────────────

async function getToken() {
  const userStore = useUserStore()

  if (userStore.googleAccessToken) return userStore.googleAccessToken

  const provider = new GoogleAuthProvider()
  provider.addScope(SHEETS_SCOPE)
  try {
    const result = await signInWithPopup(auth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    userStore.googleAccessToken = credential.accessToken
    return credential.accessToken
  } catch {
    throw new Error('No se pudo obtener autorización para Google Sheets. Por favor, inicia sesión de nuevo.')
  }
}

// ─── API helpers ─────────────────────────────────────────────────────────────

async function api(path, method = 'GET', body = null) {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    const userStore = useUserStore()
    userStore.googleAccessToken = null
    throw new Error('Sesión de Google expirada. Vuelve a iniciar sesión con Google.')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Error HTTP ${res.status} en Google Sheets API`)
  }
  return res.json()
}

async function getValues(range) {
  const data = await api(`/values/${encodeURIComponent(range)}`)
  return data.values || []
}

async function clearRange(range) {
  await api(`/values/${encodeURIComponent(range)}:clear`, 'POST')
}

async function putValues(range, values) {
  await api(`/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, 'PUT', {
    range,
    values,
  })
}

async function getSheetTitles() {
  const data = await api('?fields=sheets.properties(title)')
  return (data.sheets || []).map(s => s.properties.title)
}

async function ensureTabsExist(needed, existing) {
  const missing = needed.filter(name => !existing.includes(name))
  if (!missing.length) return

  await api(':batchUpdate', 'POST', {
    requests: missing.map(title => ({ addSheet: { properties: { title } } })),
  })
}

// ─── Export: Firestore → Sheets ───────────────────────────────────────────────

async function exportTab(tabName, header, rows) {
  await clearRange(`${tabName}!A:ZZ`)
  const data = rows.length ? [header, ...rows] : [header]
  await putValues(`${tabName}!A1`, data)
}

export async function exportToSheets(onProgress) {
  const dbStore = useDatabaseStore()

  onProgress('Leyendo datos de Firestore...')
  await Promise.all([
    dbStore.fetchLimpiezas('', ''),
    dbStore.fetchClientes(),
    dbStore.fetchGastos('', ''),
  ])

  onProgress('Preparando hojas de cálculo...')
  const existing = await getSheetTitles()
  await ensureTabsExist(Object.values(TABS), existing)

  // ── Limpiezas ──
  onProgress('Exportando limpiezas...')
  const clienteMap = Object.fromEntries(dbStore.clientes.map(c => [c.id, `${c.nombre || ''} ${c.apellido || ''}`.trim()]))
  const limpiezasRows = dbStore.limpiezas.map(l => [
    l.id || '',
    l.factura || '',
    clienteMap[l.clienteId] || '',
    l.fechaPrincipalLimpieza || '',
    l.fechaPago || '',
    l.formaPago || '',
    l.importe != null ? String(l.importe) : '',
    l.fechaPago ? 'Sí' : 'No',
    l.descripcion || '',
    l.clienteId || '',
  ])
  await exportTab(TABS.limpiezas, HEADERS.limpiezas, limpiezasRows)

  // ── Clientes ──
  onProgress('Exportando clientes...')
  const clientesRows = dbStore.clientes.map(c => [
    c.id || '',
    c.nombre || '',
    c.apellido || '',
    c.telefono || '',
    c.email || '',
    c.direccion || '',
    c.codigoPostal || '',
    c.ciudad || '',
  ])
  await exportTab(TABS.clientes, HEADERS.clientes, clientesRows)

  // ── Gastos ──
  onProgress('Exportando gastos...')
  const gastosRows = dbStore.gastos.map(g => [
    g.id || '',
    g.descripcion || '',
    g.importe != null ? String(g.importe) : '',
    g.fechaFactura || '',
    g.categoria || '',
  ])
  await exportTab(TABS.gastos, HEADERS.gastos, gastosRows)

  // ── Mensajes (solo exportar) ──
  onProgress('Exportando mensajes...')
  const mensajesSnap = await import('firebase/firestore').then(({ getDocs, collection: col, orderBy, query }) =>
    getDocs(query(col(db, 'mensajes'), orderBy('timestamp', 'desc')))
  )
  const mensajesRows = mensajesSnap.docs.map(d => {
    const m = d.data()
    const ts = m.timestamp?.toDate ? m.timestamp.toDate() : null
    return [
      d.id,
      m.prenom || m.nombre || '',
      m.email || '',
      m.telefono || '',
      m.mensaje || '',
      ts ? dayjs(ts).format('DD/MM/YYYY HH:mm') : '',
      m.read ? 'Sí' : 'No',
    ]
  })
  await exportTab(TABS.mensajes, HEADERS.mensajes, mensajesRows)

  onProgress('Exportación completada ✓')
}

// ─── Import: Sheets → Firestore ───────────────────────────────────────────────

export async function importFromSheets(onProgress) {
  const dbStore = useDatabaseStore()
  let total = 0

  // ── Clientes nuevos ──
  onProgress('Buscando nuevos clientes en la hoja...')
  const clienteRows = await getValues(`${TABS.clientes}!A2:H`)
  const newClientes = clienteRows.filter(r => !r[0] && r[1]?.trim()) // sin ID, con nombre

  for (const row of newClientes) {
    await addDoc(collection(db, 'clientes'), {
      nombre:    row[1]?.trim() || '',
      apellido:  row[2]?.trim() || '',
      telefono:  row[3]?.trim() || '',
      email:     row[4]?.trim() || '',
      direccion: row[5]?.trim() || '',
      codigoPostal: row[6]?.trim() || '',
      ciudad:    row[7]?.trim() || '',
      createdAt: serverTimestamp(),
    })
    total++
  }
  if (newClientes.length) onProgress(`${newClientes.length} cliente(s) importado(s)`)

  // ── Gastos nuevos ──
  onProgress('Buscando nuevos gastos en la hoja...')
  const gastoRows = await getValues(`${TABS.gastos}!A2:E`)
  const newGastos = gastoRows.filter(r => !r[0] && r[1]?.trim())

  for (const row of newGastos) {
    await addDoc(collection(db, 'gastosMensuales'), {
      descripcion:  row[1]?.trim() || '',
      importe:      parseFloat((row[2] || '0').replace(',', '.')) || 0,
      fechaFactura: row[3]?.trim() || '',
      categoria:    row[4]?.trim() || '',
      createdAt:    serverTimestamp(),
    })
    total++
  }
  if (newGastos.length) onProgress(`${newGastos.length} gasto(s) importado(s)`)

  // ── Limpiezas nuevas ──
  onProgress('Buscando nuevas limpiezas en la hoja...')
  await dbStore.fetchClientes()
  const nombreToId = Object.fromEntries(
    dbStore.clientes.map(c => [`${c.nombre || ''} ${c.apellido || ''}`.trim().toLowerCase(), c.id])
  )

  const limpiezaRows = await getValues(`${TABS.limpiezas}!A2:J`)
  const newLimpiezas = limpiezaRows.filter(r => !r[0] && (r[3]?.trim() || r[6]?.trim())) // sin ID, con fecha o importe

  for (const row of newLimpiezas) {
    const clienteNombre = (row[2] || '').trim().toLowerCase()
    const clienteId = row[9]?.trim() || nombreToId[clienteNombre] || ''
    await addDoc(collection(db, 'limpiezasMensuales'), {
      factura:                row[1]?.trim() || '',
      clienteId,
      fechaPrincipalLimpieza: row[3]?.trim() || '',
      fechaPago:              row[4]?.trim() || null,
      formaPago:              row[5]?.trim() || '',
      importe:                parseFloat((row[6] || '0').replace(',', '.')) || 0,
      descripcion:            row[8]?.trim() || '',
      createdAt:              serverTimestamp(),
    })
    total++
  }
  if (newLimpiezas.length) onProgress(`${newLimpiezas.length} limpieza(s) importada(s)`)

  return total
}

// ─── Full bidirectional sync ─────────────────────────────────────────────────

export async function syncAll(onProgress) {
  const imported = await importFromSheets(onProgress)
  await exportToSheets(onProgress)
  return imported
}
