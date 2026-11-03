/**
 * migrateFB.js — Migración única de Firestore → Google Sheets.
 * Lee las colecciones existentes en Firestore y las vuelca en las
 * pestañas correspondientes de la hoja, conservando los IDs originales.
 */

import { getDocs, collection } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { bulkReplace } from './sheetDB'

function firestoreDate(val) {
  if (!val) return ''
  if (val?.toDate) return val.toDate().toISOString().slice(0, 10)
  if (typeof val === 'string') return val.slice(0, 10)
  return ''
}

// ─── Leer colecciones de Firestore ──────────────────────────────────────────

async function readLimpiezas(clienteMap) {
  const snap = await getDocs(collection(db, 'limpiezasMensuales'))
  return snap.docs.map(d => {
    const v = d.data()
    const clienteId = v.clienteId || ''
    return {
      id:                     d.id,
      factura:                v.factura || '',
      clienteId,
      clienteName:            clienteMap[clienteId] || '',
      fechaPrincipalLimpieza: v.fechaPrincipalLimpieza || '',
      fechaPago:              v.fechaPago || '',
      formaPago:              v.formaPago || '',
      importe:                Number(v.importe) || Number(v.precioBruto) || 0,
      precioBruto:            Number(v.precioBruto) || Number(v.importe) || 0,
      descripcion:            v.descripcion || '',
      createdAt:              firestoreDate(v.createdAt),
    }
  })
}

async function readClientes() {
  const snap = await getDocs(collection(db, 'clientes'))
  return snap.docs.map(d => {
    const v = d.data()
    return {
      id:           d.id,
      nombre:       v.nombre || '',
      apellido:     v.apellido || '',
      telefono:     v.telefono || '',
      email:        v.email || '',
      direccion:    v.direccion || '',
      codigoPostal: v.codigoPostal || '',
      ciudad:       v.ciudad || '',
      direccionIntervencion: {
        calle:        v.direccionIntervencion?.calle || '',
        codigoPostal: v.direccionIntervencion?.codigoPostal || '',
        ciudad:       v.direccionIntervencion?.ciudad || '',
        provincia:    v.direccionIntervencion?.provincia || '',
      },
      notas:     v.notas || '',
      createdAt: firestoreDate(v.createdAt),
    }
  })
}

async function readGastos() {
  // GastosTable usa la colección 'gastos' (con campos IVA)
  const snap = await getDocs(collection(db, 'gastos'))
  const gastos = snap.docs.map(d => {
    const v = d.data()
    return {
      id:            d.id,
      tipo:          v.tipo || 'Gasolina',
      fechaFactura:  v.fechaFactura || '',
      numeroFactura: v.numeroFactura || '',
      precioSinIVA:  Number(v.precioSinIVA) || 0,
      iva:           Number(v.iva) || 0,
      precioConIVA:  Number(v.precioConIVA) || 0,
      notas:         v.notas || '',
      verificado:    Boolean(v.verificado),
      createdAt:     firestoreDate(v.createdAt),
    }
  })

  // También intentamos la colección 'gastosMensuales' (campos distintos)
  try {
    const snap2 = await getDocs(collection(db, 'gastosMensuales'))
    for (const d of snap2.docs) {
      if (gastos.find(g => g.id === d.id)) continue // ya migrado
      const v = d.data()
      const importe = Number(v.importe) || Number(v.precioConIVA) || 0
      gastos.push({
        id:            d.id,
        tipo:          v.categoria || 'Otros',
        fechaFactura:  v.fechaFactura || '',
        numeroFactura: '',
        precioSinIVA:  importe / 1.21,
        iva:           importe - importe / 1.21,
        precioConIVA:  importe,
        notas:         v.descripcion || '',
        verificado:    false,
        createdAt:     firestoreDate(v.createdAt),
      })
    }
  } catch { /* gastosMensuales puede no existir */ }

  return gastos
}

// ─── Migración principal ─────────────────────────────────────────────────────

/**
 * Migra todos los datos de Firestore a Google Sheets.
 * @param {(msg: string, pct: number) => void} onProgress
 * @returns {{ limpiezas: number, clientes: number, gastos: number }}
 */
export async function migrateFromFirestore(onProgress) {
  // 1. Clientes primero (para resolver nombres en limpiezas)
  onProgress('Leyendo clientes de Firestore...', 5)
  const clientes = await readClientes()
  const clienteMap = Object.fromEntries(
    clientes.map(c => [c.id, `${c.nombre} ${c.apellido || ''}`.trim()])
  )

  // 2. Limpiezas
  onProgress('Leyendo limpiezas de Firestore...', 20)
  const limpiezas = await readLimpiezas(clienteMap)

  // 3. Gastos
  onProgress('Leyendo gastos de Firestore...', 40)
  const gastos = await readGastos()

  // 4. Escribir en Sheets
  onProgress(`Escribiendo ${clientes.length} clientes en Sheets...`, 55)
  await bulkReplace('clientes', clientes)

  onProgress(`Escribiendo ${limpiezas.length} limpiezas en Sheets...`, 70)
  await bulkReplace('limpiezas', limpiezas)

  onProgress(`Escribiendo ${gastos.length} gastos en Sheets...`, 90)
  await bulkReplace('gastos', gastos)

  onProgress('¡Migración completada!', 100)

  return { limpiezas: limpiezas.length, clientes: clientes.length, gastos: gastos.length }
}
