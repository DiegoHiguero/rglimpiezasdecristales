/**
 * invoicePdf.js — Plantilla visual de la factura (jsPDF), compartida entre
 * el editor de facturas del admin (LimpiezasMensuales.vue) y el portal
 * público del cliente, para que el PDF descargado sea siempre el mismo
 * diseño independientemente de quién lo genere.
 */

import { jsPDF } from 'jspdf'
import dayjs from 'dayjs'
import logo from '../assets/img/ROYAL_CLEAN_2025_BLANCO.png'
import phoneIcon from '../assets/img/mobile.png'
import emailIcon from '../assets/img/envelope.png'
import webIcon from '../assets/img/globe.png'
import locationIcon from '../assets/img/location.png'

const ROW_HEIGHT = 10

export function formatCurrency(value) {
  const numberValue = Number(value)
  if (isNaN(numberValue)) return ''
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(numberValue)
}

/**
 * @param {Object} params
 * @param {string} params.factura        Número de factura
 * @param {string} [params.fecha]        Fecha ya formateada (DD/MM/YYYY); por defecto hoy
 * @param {string} params.clientName
 * @param {string} params.clientAddress
 * @param {Array<{description:string, qty:number, unitPrice:number, totalHT:number}>} params.items
 * @returns {import('jspdf').jsPDF}
 */
export function buildInvoicePdf({ factura, fecha, clientName, clientAddress, items }) {
  const doc = new jsPDF()

  const invoiceNumber = String(factura || '')
  const currentDate = fecha || dayjs().format('DD/MM/YYYY')

  // --- LOGO ---
  doc.addImage(logo, 'PNG', 20, 20, 50, 20)

  // --- Encabezado ---
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('FACTURA', 150, 40)

  // --- Info cliente ---
  doc.setFontSize(8)
  doc.setTextColor('#4970B6')
  doc.setFont('helvetica', 'bold')
  doc.text('EXPEDIDA A:', 20, 70)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor('black')
  doc.text(clientName || '', 20, 75)
  doc.text(clientAddress || 'N/A', 20, 80)

  // --- FACT# y FECHA ---
  doc.setFont('helvetica', 'bold')
  doc.setTextColor('#4970B6')
  doc.setFontSize(9)
  doc.text('FACT#:', 150, 70)
  doc.text('FECHA:', 150, 77)

  doc.setFont('helvetica', 'normal')
  doc.setTextColor('black')
  doc.text(invoiceNumber, 190, 70, { align: 'right' })
  doc.text(currentDate, 190, 77, { align: 'right' })

  // --- Tabla de ítems ---
  const tableY = 95
  const headerHeight = 9
  const contentLinesHeight = 15

  doc.setDrawColor('#4970B6')
  doc.setFillColor('#4970B6')
  doc.rect(20, tableY, 170, headerHeight, 'F')

  doc.setTextColor('white')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Descripción de servicio', 35, tableY + 6)
  doc.text('Cant.', 130, tableY + 6, { align: 'center' })
  doc.text('Precio u.', 155, tableY + 6, { align: 'center' })
  doc.text('Importe', 185, tableY + 6, { align: 'right' })

  doc.setTextColor('black')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)

  const currentItemY = tableY + headerHeight + 5
  let subtotal = 0
  let itemsDrawn = 0

  for (const item of items || []) {
    if (item.totalHT && item.totalHT > 0) {
      const itemRectY = currentItemY + (itemsDrawn * (ROW_HEIGHT + 5)) - 5
      doc.rect(20, itemRectY, 170, ROW_HEIGHT)

      const textBaselineY = itemRectY + ROW_HEIGHT / 2
      const description = item.description || ''
      const defaultTextStartX = 23
      const descriptionColStartX = 20
      const descriptionColWidthForCentering = 110

      const windowCleaningWithDatesPattern = /^(Limpieza de cristales)\s*\((.+)\)$/
      const match = description.match(windowCleaningWithDatesPattern)

      if (match) {
        const baseText = match[1]
        const rawDatesContent = `(${match[2]})`
        const dynamicTextStartXWithDates = 35

        doc.setFontSize(9)
        doc.text(baseText, dynamicTextStartXWithDates, textBaselineY)

        const baseTextWidth = doc.getTextWidth(baseText)
        doc.setFontSize(7)
        doc.text(rawDatesContent, dynamicTextStartXWithDates + baseTextWidth + 1, textBaselineY)
      } else if (description === 'Limpieza de cristales') {
        doc.setFontSize(10)
        const textWidth = doc.getTextWidth(description)
        const centerX = descriptionColStartX + (descriptionColWidthForCentering / 2) - (textWidth / 2)
        doc.text(description, centerX, textBaselineY)
      } else {
        doc.setFontSize(9)
        doc.text(description, defaultTextStartX, textBaselineY)
      }

      doc.setFontSize(10)
      doc.text(String(item.qty || 0), 130, textBaselineY, { align: 'center' })
      doc.text(formatCurrency(item.unitPrice || 0), 155, textBaselineY, { align: 'center' })
      doc.text(formatCurrency(item.totalHT), 185, textBaselineY, { align: 'right' })

      subtotal += item.totalHT
      itemsDrawn++
    }
  }

  const dynamicHeight = itemsDrawn * contentLinesHeight
  let totalsY = currentItemY + dynamicHeight + 5

  const iva = subtotal * 0.21
  const total = subtotal + iva

  // --- Totales alineados con columna Importe ---
  const rowHeightTotal = 7
  const rowSpacing = 1
  const totalLabels = ['Subtotal', 'IVA 21%', 'TOTAL']
  const totalValues = [subtotal, iva, total]

  for (let i = 0; i < totalLabels.length; i++) {
    const y = totalsY + i * (rowHeightTotal + rowSpacing)

    doc.setFillColor('#4970B6')
    doc.setDrawColor('#4970B6')
    doc.rect(120, y - 6, 40, rowHeightTotal, 'FD')
    doc.setTextColor('white')
    doc.setFont('helvetica', 'bold')
    doc.text(totalLabels[i], 140, y - 1, { align: 'center' })

    doc.setFillColor('white')
    doc.setDrawColor('#4970B6')
    doc.rect(160, y - 6, 30, rowHeightTotal, 'FD')
    doc.setTextColor('black')

    if (i === 2) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
    } else {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
    }

    doc.text(formatCurrency(totalValues[i]), 190, y - 1, { align: 'right' })
  }

  totalsY += totalLabels.length * (rowHeightTotal + rowSpacing) + 10

  // --- Datos de pago ---
  let paymentY = totalsY
  doc.setTextColor('#4970B6')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('DATOS DE PAGO', 20, paymentY)

  paymentY += 10
  doc.setFontSize(10)
  doc.setTextColor('black')
  doc.setFont('helvetica', 'normal')
  doc.text('DNI: 50349726-N', 25, paymentY)
  paymentY += 5
  doc.text('N/C: ROYS GREGORY ABREU REINOSO', 25, paymentY)
  paymentY += 5
  doc.text('IBAN:ES69 1465 0340 53 1718233167', 25, paymentY)
  paymentY += 7
  doc.addImage(phoneIcon, 'PNG', 25, paymentY - 3, 5, 5)
  doc.text('696169435', 32, paymentY)
  paymentY += 7
  doc.addImage(emailIcon, 'PNG', 25, paymentY - 3, 5, 5)
  doc.text('roys.abreu@hotmail.es', 32, paymentY)
  paymentY += 7
  doc.addImage(webIcon, 'PNG', 25, paymentY - 3, 5, 5)
  doc.text('www.royallclean.es', 32, paymentY)
  paymentY += 7
  doc.addImage(locationIcon, 'PNG', 25, paymentY - 3, 5, 5)
  doc.text('Av. Segunda República, 17 1D, 28905 (Madrid)', 32, paymentY)

  return doc
}

/**
 * Construye el PDF de una factura tal como se guarda en el portal público
 * (una sola línea con el concepto y el total, sin desglose semanal — ese
 * desglose nunca llega a persistirse hoy en la hoja de cálculo).
 */
export function buildInvoicePdfFromPortal({ factura, fecha, clientName, clientAddress, concepto, total }) {
  const totalNum = Number(total) || 0
  const subtotal = parseFloat((totalNum / 1.21).toFixed(2))
  return buildInvoicePdf({
    factura,
    fecha,
    clientName,
    clientAddress,
    items: [{ description: concepto || 'Limpieza de cristales', qty: 1, unitPrice: subtotal, totalHT: subtotal }],
  })
}
