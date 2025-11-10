<template>
  <div class="container-flex m-4">
    <h2 class="mb-4 bg-white p-4 text-center">Registro Mensual de Limpiezas</h2>
    <!-- Formulario para añadir nueva limpieza -->
    <div class="card mb-4">
      <div class="card-header">
        <h3>Añadir Nueva Limpieza</h3> (Factura #{{ proximaFactura }})
      </div>
      <div class="card-body">
        <form @submit.prevent="agregarLimpieza">
          <div class="row g-3">
            <div class="mt-3">
              <div class="col-md-4">
                <label for="cliente" class="form-label">Cliente</label>
                <select id="cliente" class="form-select" v-model="nuevaLimpieza.clienteId" required>
                  <option value="" disabled>Seleccione un cliente</option>
                  <option v-if="databaseStore.isLoadingClientes">Cargando clientes...</option>
                  <option v-if="databaseStore.errorClientes" disabled>Error al cargar clientes</option>
                  <option v-for="cliente in databaseStore.clientes" :key="cliente.id" :value="cliente.id">
                    {{ cliente.nombre }} {{ cliente.apellido }}
                  </option>
                </select>
                <button type="button" class="btn btn-info text-white btn-sm mt-2" @click="openAddClientModal">
                  Añadir Cliente
                </button>
              </div>
            </div>

            <!-- Sección para número de factura manual (nueva adición) -->
            <div class="col-md-4 mt-3">
              <label for="manualFactura" class="form-label">Número de Factura Manual (Opcional)</label>
              <input type="text" class="form-control" id="manualFactura" v-model="manualFacturaInput"
                placeholder="Dejar vacío para generar automáticamente" />
              <small class="form-text text-muted">Si se deja vacío, se usará: {{ proximaFactura }}</small>
            </div>
            <!-- Fin de sección para número de factura manual -->

            <div class="row justify-content-center mt-3">
              <div class="col-md-3">
                <label for="semana1" class="form-label">Semana 1 </label>
                <input type="date" class="form-control mb-2" id="semana1" v-model="nuevaLimpieza.semana1">
                <label for="semana1Notas" class="form-label">Notas</label>
                <input type="text" class="form-control" id="semana1Notas" v-model="nuevaLimpieza.semana1Notas"
                  placeholder="Notas para Semana 1">
              </div>
              <div class="col-md-3">
                <label for="semana2" class="form-label">Semana 2 </label>
                <input type="date" class="form-control mb-2" id="semana2" v-model="nuevaLimpieza.semana2">
                <label for="semana2Notas" class="form-label">Notas</label>
                <input type="text" class="form-control" id="semana2Notas" v-model="nuevaLimpieza.semana2Notas"
                  placeholder="Notas para Semana 2">
              </div>
              <div class="col-md-3">
                <label for="semana3" class="form-label">Semana 3 </label>
                <input type="date" class="form-control mb-2" id="semana3" v-model="nuevaLimpieza.semana3">
                <label for="semana3Notas" class="form-label">Notas</label>
                <input type="text" class="form-control" id="semana3Notas" v-model="nuevaLimpieza.semana3Notas"
                  placeholder="Notas para Semana 3">
              </div>
              <div class="col-md-3">
                <label for="semana4" class="form-label">Semana 4 </label>
                <input type="date" class="form-control mb-2" id="semana4" v-model="nuevaLimpieza.semana4">
                <label for="semana4Notas" class="form-label">Notas</label>
                <input type="text" class="form-control" id="semana4Notas" v-model="nuevaLimpieza.semana4Notas"
                  placeholder="Notas para Semana 4">
              </div>
            </div>
            <div class="row g-3 mt-4">
            <h4>Limpiezas Extra</h4>
            <div v-for="(extra, index) in nuevaLimpieza.extraCleanings" :key="index" class="col-12">
              <div class="row g-2 align-items-end mb-2">
                <div class="col-md-3">
                  <label :for="'extra-desc-' + index" class="form-label">Descripcion</label>
                  <input type="text" :id="'extra-desc-' + index" class="form-control" v-model="extra.description">
                </div>
                <div class="col-md-2">
                  <label :for="'extra-date-' + index" class="form-label">Fecha</label>
                  <input type="date" :id="'extra-date-' + index" class="form-control" v-model="extra.date">
                </div>
                <div class="col-md-2">
                  <label :for="'extra-qty-' + index" class="form-label">Cantidad</label>
                  <input type="number" :id="'extra-qty-' + index" class="form-control" v-model.number="extra.quantity" min="1">
                </div>
                <div class="col-md-2">
                  <label :for="'extra-price-' + index" class="form-label">Precio Unidad (€)</label>
                  <input type="number" :id="'extra-price-' + index" class="form-control" v-model.number="extra.unitPrice" step="0.01" min="0">
                </div>
                <div class="col-md-2">
                  <label class="form-label">Total (€)</label>
                  <input type="text" class="form-control" :value="(Number(extra.quantity) * Number(extra.unitPrice) || 0).toFixed(2)" readonly>
                </div>
                <div class="col-md-1">
                  <button type="button" class="btn btn-danger btn-sm" @click="removeExtraCleaning(index)">X</button>
                </div>
              </div>
            </div>
            <div class="col-12">
              <button type="button" class="btn btn-success btn-sm" @click="addExtraCleaningLine">Añadir Línea Extra</button>
            </div>
          </div>
            <div class="row justify-content-center mt-4">
              <div class="col-md-3">
                <label for="precioBruto" class="form-label">Precio Bruto (€)</label>
                <input type="number" step="0.01" class="form-control" id="precioBruto"
                  :value="calculatedPrecioBrutoNueva" readonly>
              </div>
              <div class="col-md-3">
                <label for="formaPago" class="form-label">Forma de Pago</label>
                <select id="formaPago" class="form-select" v-model="nuevaLimpieza.formaPago">
                  <option value="Efectivo">Efectivo</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Giro Bancario">Giro Bancario</option>
                </select>
              </div>
              <div class="col-md-3">
                <label for="fechaPago" class="form-label">Fecha de Pago</label>
                <input type="date" class="form-control" id="fechaPago" v-model="nuevaLimpieza.fechaPago">
              </div>
              <div class="col-12 justify-content-center mt-2">
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                  {{ isLoading ? 'Guardando...' : 'Añadir Registro' }}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Sección de Filtrar Registros -->
    <div class="card mb-4">
      <div class="card-header">
        <h3>Filtrar Registros</h3>
      </div>
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label for="filterMonth" class="form-label">Seleccionar Mes</label>
            <select id="filterMonth" class="form-select" v-model="selectedMonth">
              <option value="">Todos los meses</option>
              <option value="0">Enero</option>
              <option value="1">Febrero</option>
              <option value="2">Marzo</option>
              <option value="3">Abril</option>
              <option value="4">Mayo</option>
              <option value="5">Junio</option>
              <option value="6">Julio</option>
              <option value="7">Agosto</option>
              <option value="8">Septiembre</option>
              <option value="9">Octubre</option>
              <option value="10">Noviembre</option>
              <option value="11">Diciembre</option>
            </select>
          </div>
          <div class="col-md-4">
            <label for="filterYear" class="form-label">Seleccionar Año</label>
            <select id="filterYear" class="form-select" v-model="selectedYear">
              <option value="">Todos los años</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div class="col-md-4 d-grid">
            <button class="btn btn-secondary" @click="applyFilter">Aplicar Filtro</button>
          </div>
          <div class="col-md-12 d-grid">
            <button class="btn btn-outline-secondary" @click="resetFilter">Mostrar Todos</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Componente PagosPendientesView -->
    <PagosPendientesView :totalPendiente="totalPendiente" />
    <!-- Sección principal de Registro con la tabla -->
    <div class="card mt-4">
      <div class="card-header d-flex align-items-center">
        <h3 class="mb-0">Registro</h3>
        <div class="flex-grow-1 text-center">
          <h2 class="mb-0">
            <b><span v-if="displayFilterSummary !== 'Todos los registros'">{{ displayFilterSummary }}</span></b>
          </h2>
        </div>
      </div>
      <div>
        <button class="btn btn-success m-3" @click="handleGeneratePdf"
          :disabled="isGeneratingPdf || databaseStore.limpiezas.length === 0">
          <span v-if="isGeneratingPdf" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          {{ isGeneratingPdf ? 'Generando PDF...' : 'Generar PDF' }}
        </button>
      </div>
      <!-- Mostrar estado de carga o error -->
      <div v-if="isLoading && displayLimpiezas.length === 0" class="alert alert-info">
        Cargando registros...
      </div>
      <div v-else-if="error" class="alert alert-danger">
        Error al cargar los registros: {{ error.message }}
      </div>
      <!-- Mostrar la tabla si no hay error y ha cargado datos -->
      <div class="card-body" v-else-if="displayLimpiezas.length > 0">
        <div v-if="isLoading || databaseStore.isUpdating" class="alert alert-info">
          {{ isLoading ? 'Actualizando registros...' : 'Guardando cambios...' }}
        </div>
       <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Factura #</th>
              <th>Cliente</th>
              <th style="min-width: 100px;">Sem.1</th>
              <th style="min-width: 100px;">Sem.2</th>
              <th style="min-width: 100px;">Sem.3</th>
              <th style="min-width: 100px;">Sem.4</th>
              <th style="min-width: 100px;">Sem.5</th>
              <th>Bruto(€)</th>
              <th>Neto(€)</th>
              <th>Cot(€)</th>
              <th>Fecha Pago</th>
              <th>Estado</th>
              <th>Forma Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="limpieza in displayLimpiezas" :key="limpieza.id"
                :class="{ 'bg-danger-subtle': isPaymentDateMismatched(limpieza) }">
              <td>{{ limpieza.factura }}</td>
              <td>{{ limpieza.cliente }}</td>

              <!-- Semanas 1-5 -->
              <td class="text-center">
                {{ formatEuropeanDate(limpieza.semana1) }}
                <br v-if="limpieza.semana1Tipo" />
                <span v-if="limpieza.semana1Tipo === 'exterior' || limpieza.semana1Tipo === 'ambas'"
                      class="badge bg-primary me-1">E</span>
                <span v-if="limpieza.semana1Tipo === 'interior' || limpieza.semana1Tipo === 'ambas'"
                      class="badge bg-secondary">I</span>
                <div v-if="limpieza.semana1precio !== null">
                  <small class="text-muted">{{ formatCurrency(limpieza.semana1precio) }}</small>
                </div>
              </td>
              <td class="text-center">
                {{ formatEuropeanDate(limpieza.semana2) }}
                <br v-if="limpieza.semana2Tipo" />
                <span v-if="limpieza.semana2Tipo === 'exterior' || limpieza.semana2Tipo === 'ambas'"
                      class="badge bg-primary me-1">E</span>
                <span v-if="limpieza.semana2Tipo === 'interior' || limpieza.semana2Tipo === 'ambas'"
                      class="badge bg-secondary">I</span>
                <div v-if="limpieza.semana2precio !== null">
                  <small class="text-muted">{{ formatCurrency(limpieza.semana2precio) }}</small>
                </div>
              </td>
              <td class="text-center">
                {{ formatEuropeanDate(limpieza.semana3) }}
                <br v-if="limpieza.semana3Tipo" />
                <span v-if="limpieza.semana3Tipo === 'exterior' || limpieza.semana3Tipo === 'ambas'"
                      class="badge bg-primary me-1">E</span>
                <span v-if="limpieza.semana3Tipo === 'interior' || limpieza.semana3Tipo === 'ambas'"
                      class="badge bg-secondary">I</span>
                <div v-if="limpieza.semana3precio !== null">
                  <small class="text-muted">{{ formatCurrency(limpieza.semana3precio) }}</small>
                </div>
              </td>
              <td class="text-center">
                {{ formatEuropeanDate(limpieza.semana4) }}
                <br v-if="limpieza.semana4Tipo" />
                <span v-if="limpieza.semana4Tipo === 'exterior' || limpieza.semana4Tipo === 'ambas'"
                      class="badge bg-primary me-1">E</span>
                <span v-if="limpieza.semana4Tipo === 'interior' || limpieza.semana4Tipo === 'ambas'"
                      class="badge bg-secondary">I</span>
                <div v-if="limpieza.semana4precio !== null">
                  <small class="text-muted">{{ formatCurrency(limpieza.semana4precio) }}</small>
                </div>
              </td>
              <td class="text-center">
                {{ formatEuropeanDate(limpieza.semana5) }}
                <br v-if="limpieza.semana5Tipo" />
                <span v-if="limpieza.semana5Tipo === 'exterior' || limpieza.semana5Tipo === 'ambas'"
                      class="badge bg-primary me-1">E</span>
                <span v-if="limpieza.semana5Tipo === 'interior' || limpieza.semana5Tipo === 'ambas'"
                      class="badge bg-secondary">I</span>
                <div v-if="limpieza.semana5precio !== null">
                  <small class="text-muted">{{ formatCurrency(limpieza.semana5precio) }}</small>
                </div>
              </td>

              <td>{{ limpieza.precioBruto }}€</td>
              <td><strong>{{ formatCurrency(calculatePrecioNeto(limpieza.precioBruto)) }}</strong></td>
              <td>{{ formatCurrency(calculateCotizacion(limpieza.precioBruto)) }}</td>
              <td>{{ formatEuropeanDate(limpieza.fechaPago) }}</td>
              <td>
                <span :class="{ 'badge bg-success': limpieza.fechaPago, 'badge bg-warning text-dark': !limpieza.fechaPago }">
                  {{ limpieza.fechaPago ? 'Pagao' : 'Pendiente' }}
                </span>
              </td>
              <td>{{ limpieza.formaPago }}</td>

              <!-- Acciones con botones de Drive y Email resaltados -->
              <td class="d-flex justify-content-around align-items-center gap-2">

                <!-- Editar registro -->
                <button @click="openEditModal(limpieza)"
                        class="btn btn-sm btn-secondary d-flex justify-content-center align-items-center"
                        title="Éditer le registre">
                  <font-awesome-icon :icon="['fas', 'file-pen']" />
                </button>

                <!-- Eliminar registro -->
                <button @click="confirmDelete(limpieza)"
                        class="btn btn-sm btn-warning d-flex justify-content-center align-items-center"
                        title="Supprimer le registre">
                  <font-awesome-icon :icon="['fas', 'trash-can']" />
                </button>

                <!-- Generar factura -->
                <button @click="openInvoiceEditor(limpieza)"
                        class="btn btn-sm btn-primary d-flex justify-content-center align-items-center"
                        title="Éditer et générer la facture">
                  <font-awesome-icon :icon="['fas', 'file-invoice']" />
                </button>

                <!-- Guardar en Drive -->
                <button @click="saveInvoiceToGoogleDrive(limpieza)" :disabled="isSavingToDrive"
                        :class="['btn', 'btn-sm', 'd-flex', 'justify-content-center', 'align-items-center', limpieza.facturaEnviada ? 'btn-success' : 'btn-light']"
                        title="Guardar en Google Drive">
                  <span v-if="isSavingToDrive" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <font-awesome-icon :icon="['fab', 'google-drive']" />
                </button>

                <!-- Enviar email -->
                <button @click="sendInvoiceByEmail(limpieza)" :disabled="isSendingEmail"
                        :class="['btn', 'btn-sm', 'd-flex', 'justify-content-center', 'align-items-center', limpieza.emailEnviado ? 'btn-success' : 'btn-light']"
                        title="Enviar factura por correo">
                  <span v-if="isSendingEmail" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <font-awesome-icon :icon="['fas', 'envelope']" />
                </button>

              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td class="text-start"><strong>CLIENTES: {{ uniqueClientsInDisplay }}</strong></td>
              <td colspan="6" class="text-end"><strong>TOTAL PAGADO</strong></td>
              <td>{{ formatCurrency(totalPagado) }}</td>
              <td><h4><strong>{{ formatCurrency(totalNetoPagado) }}</strong></h4></td>
              <td>{{ formatCurrency(totalCotizacionPagado) }}</td>
              <td colspan="4"></td>
            </tr>
            <tr>
              <td colspan="7" class="text-end"><span><strong>TOTAL PENDIENTE</strong></span></td>
              <td><span>{{ formatCurrency(totalPendiente) }}</span></td>
              <td><span class="text-danger"><h4><strong>{{ formatCurrency(totalPendienteNeto) }}</strong></h4></span></td>
              <td>{{ formatCurrency(totalPendienteCotizacion) }}</td>
              <td colspan="4"></td>
            </tr>
          </tfoot>
        </table>
        </div>
        <div v-if="databaseStore.updateError" class="alert alert-danger mt-3">
          Error al guardar los cambios: {{ databaseStore.updateError.message }}
        </div>
      </div>
      <div v-else class="alert alert-warning">
        No hay registros de limpieza aún. ¡Añade uno!
      </div>
    </div>
    <!-- Estructura del Modal de Edición (registro individual) -->
    <div v-if="isEditModalOpen" class="modal fade show" style="display: block;" tabindex="-1"
      aria-labelledby="editModalLabel" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Editar Registro (Factura #{{ editedLimpieza.factura }}) </h5>
            <button type="button" class="btn-close" @click="closeEditModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Formulario de edición dentro del modal -->
            <form @submit.prevent="saveEditedLimpieza">
              <!-- NUEVO CAMPO: Número de Factura -->
              <div class="mb-3">
                <label for="edit-factura" class="form-label">Número de Factura</label>
                <input type="text" class="form-control" id="edit-factura" v-model="editedLimpieza.factura" required>
              </div>
              <!-- FIN NUEVO CAMPO -->

              <h5>{{ editedLimpieza.cliente }}</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="edit-semana1" class="form-label">Semana 1 </label>
                  <input type="date" class="form-control mb-2" id="edit-semana1" v-model="editedLimpieza.semana1">
                  <label for="edit-semana1Notas" class="form-label">Notas</label>
                  <input type="text" class="form-control" id="edit-semana1Notas" v-model="editedLimpieza.semana1Notas"
                    placeholder="Notas para Semana 1">
                </div>
                <div class="col-md-6">
                  <label for="edit-semana2" class="form-label">Semana 2 </label>
                  <input type="date" class="form-control mb-2" id="edit-semana2" v-model="editedLimpieza.semana2">
                  <label for="edit-semana2Notas" class="form-label">Notas</label>
                  <input type="text" class="form-control" id="edit-semana2Notas" v-model="editedLimpieza.semana2Notas"
                    placeholder="Notas para Semana 2">
                </div>
                <div class="col-md-6">
                  <label for="edit-semana3" class="form-label">Semana 3 </label>
                  <input type="date" class="form-control mb-2" id="edit-semana3" v-model="editedLimpieza.semana3">
                  <label for="edit-semana3Notas" class="form-label">Notas</label>
                  <input type="text" class="form-control" id="edit-semana3Notas" v-model="editedLimpieza.semana3Notas"
                    placeholder="Notas para Semana 3">
                </div>
                <div class="col-md-6">
                  <label for="edit-semana4" class="form-label">Semana 4 </label>
                  <input type="date" class="form-control mb-2" id="edit-semana4" v-model="editedLimpieza.semana4">
                  <label for="edit-semana4Notas" class="form-label">Notas</label>
                  <input type="text" class="form-control" id="edit-semana4Notas" v-model="editedLimpieza.semana4Notas"
                    placeholder="Notas para Semana 4">
                </div>
                <!-- Semana 5 ELIMINADA del modal de edición -->

                <div class="col-md-6">
                  <label for="edit-precioBruto" class="form-label">Precio Bruto (€)</label>
                  <input type="number" step="0.01" class="form-control" id="edit-precioBruto"
                    :value="calculatedPrecioBrutoEdited" readonly>
                </div>
                <div class="col-md-6">
                  <label for="edit-formaPago" class="form-label">Forma de Pago</label>
                  <select id="edit-formaPago" class="form-select" v-model="editedLimpieza.formaPago">
                    <option value="Efectivo">Efectivo</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Giro Bancario">Giro Bancario</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="edit-fechaPago" class="form-label">Fecha de Pago</label>
                  <input type="date" class="form-control" id="edit-fechaPago" v-model="editedLimpieza.fechaPago">
                </div>
                        <div class="row g-3 mt-4">
          <h4>Limpiezas Extra</h4>
          <div v-for="(extra, index) in editedLimpieza.extraCleanings" :key="index" class="col-12">
            <div class="row g-2 align-items-end mb-2">
              <div class="col-md-3">
                <label :for="'edit-extra-desc-' + index" class="form-label">Descripcion</label>
                <input type="text" :id="'edit-extra-desc-' + index" class="form-control" v-model="extra.description">
              </div>
              <div class="col-md-2">
                <label :for="'edit-extra-date-' + index" class="form-label">Fecha</label>
                <input type="date" :id="'edit-extra-date-' + index" class="form-control" v-model="extra.date">
              </div>
              <div class="col-md-2">
                <label :for="'edit-extra-qty-' + index" class="form-label">Cantidad</label>
                <input type="number" :id="'edit-extra-qty-' + index" class="form-control" v-model.number="extra.quantity" min="1">
              </div>
              <div class="col-md-2">
                <label :for="'edit-extra-price-' + index" class="form-label">Precio Unitario(€)</label>
                <input type="number" :id="'edit-extra-price-' + index" class="form-control" v-model.number="extra.unitPrice" step="0.01" min="0">
              </div>
              <div class="col-md-2">
                <label class="form-label">Total(€)</label>
                <input type="text" class="form-control" :value="(Number(extra.quantity) * Number(extra.unitPrice) || 0).toFixed(2)" readonly>
              </div>
              <div class="col-md-1">
                <button type="button" class="btn btn-danger btn-sm" @click="removeExtraCleaningEdited(index)">X</button>
              </div>
            </div>
          </div>
          <div class="col-12">
            <button type="button" class="btn btn-success btn-sm" @click="addExtraCleaningLineEdited">Añadir Línea Extra</button>
          </div>
        </div>

              </div> <!-- Cierre del row g-3 -->
            </form>
            <div class="mt-3" v-if="editedLimpieza.precioBruto > 0">
              <p><strong>Precio Neto:</strong> {{
                formatCurrency(calculatePrecioNeto(editedLimpieza.precioBruto)) }}</p>
              <p><strong>IVA (21%):</strong> {{
                formatCurrency(calculateCotizacion(editedLimpieza.precioBruto)) }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="saveEditedLimpieza"
              :disabled="isLoadingEdit || databaseStore.isUpdating">
              {{ isLoadingEdit || databaseStore.isUpdating ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isEditModalOpen" class="modal-backdrop fade show"></div>
    <!-- Estructura del Modal para Añadir Cliente -->
    <div v-if="isAddClientModalOpen" class="modal fade show" style="display: block;" tabindex="-1"
      aria-labelledby="addClientModalLabel" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addClientModalLabel">Añadir Nuevo Cliente</h5>
            <button type="button" class="btn-close" @click="closeAddClientModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveNewClient">
              <div class="row g-3">
                <div class="col-12 mb-3">
                  <h4 class="mb-0">Información Personal</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <div class="col-md-6">
                  <label for="new-client-nombre" class="form-label">Nombre</label>
                  <input type="text" class="form-control" id="new-client-nombre" v-model="newClient.nombre" required>
                </div>
                <div class="col-md-6">
                  <label for="new-client-apellido" class="form-label">Apellido</label>
                  <input type="text" class="form-control" id="new-client-apellido" v-model="newClient.apellido"
                    required>
                </div>

                <div class="col-12 mt-4 mb-3">
                  <h4 class="mb-0">Dirección de Facturación</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <div class="col-12">
                  <label for="new-client-direccion" class="form-label">Dirección (Calle y Número)</label>
                  <input type="text" class="form-control" id="new-client-direccion" v-model="newClient.direccion"
                    required>
                </div>
                <div class="col-12">
                  <label for="new-client-direccion" class="form-label">Dirección Complementaria (Opcional)</label>
                  <input type="text" class="form-control" id="new-client-direccion" v-model="newClient.direccionComplementaria">
                </div>
                <div class="col-md-6">
                  <label for="new-client-ciudad" class="form-label">Ciudad</label>
                  <input type="text" class="form-control" id="new-client-ciudad" v-model="newClient.ciudad" required>
                </div>
                <div class="col-md-6">
                  <label for="new-client-provincia" class="form-label">Provincia</label>
                  <input type="text" class="form-control" id="new-client-provincia" v-model="newClient.provincia"
                    required>
                </div>
                <div class="col-md-4">
                  <label for="new-client-codigo-postal" class="form-label">Código Postal</label>
                  <input type="text" class="form-control" id="new-client-codigo-postal"
                    v-model="newClient.codigoPostal">
                </div>

                <div class="col-12 mt-4 mb-3">
                  <h4 class="mb-0">Dirección de Intervención (Opcional)</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <div class="col-12">
                  <label for="new-client-intervencion-calle" class="form-label">Dirección (Calle y Número)</label>
                  <input type="text" class="form-control" id="new-client-intervencion-calle"
                    v-model="newClient.direccionIntervencion.calle">
                </div>
                <div class="col-12">
                  <label for="new-client-intervencion-calle" class="form-label">Dirección Complementaria (Opcional)</label>
                  <input type="text" class="form-control" id="new-client-intervencion-calle"
                    v-model="newClient.direccionIntervencion.complementaria">
                </div>
                
                <div class="col-md-6">
                  <label for="new-client-intervencion-ciudad" class="form-label">Ciudad</label>
                  <input type="text" class="form-control" id="new-client-intervencion-ciudad"
                    v-model="newClient.direccionIntervencion.ciudad">
                </div>
                <div class="col-md-6">
                  <label for="new-client-intervencion-provincia" class="form-label">Provincia</label>
                  <input type="text" class="form-control" id="new-client-intervencion-provincia"
                    v-model="newClient.direccionIntervencion.provincia">
                </div>
                <div class="col-md-4">
                  <label for="new-client-intervencion-codigo-postal" class="form-label">Código Postal</label>
                  <input type="text" class="form-control" id="new-client-intervencion-codigo-postal"
                    v-model="newClient.direccionIntervencion.codigoPostal">
                </div>

                <div class="col-12 mt-4 mb-3">
                  <h4 class="mb-0">Información de Contacto</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <div class="col-md-6">
                  <label for="new-client-telefono" class="form-label">Teléfono</label>
                  <input type="tel" class="form-control" id="new-client-telefono" v-model="newClient.telefono">
                </div>
                <div class="col-md-6">
                  <label for="new-client-email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="new-client-email" v-model="newClient.email">
                </div>
                <div class="col-12 mt-4 mb-3">
                  <h4 class="mb-0">Tipo de Cliente</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <div class="col-md-6">
                  <label for="new-client-tipo" class="form-label">Tipo de Cliente</label>
                  <select id="new-client-tipo" class="form-select" v-model="newClient.tipoCliente" required>
                    <option value="" disabled>Seleccione un tipo</option>
                    <option value="empresa">Empresa</option>
                    <option value="casa">Casa</option>
                  </select>
                </div>
                <div class="col-12 mt-4 mb-3">
                  <h4 class="mb-0">Tarifas de Limpieza (€)</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <!-- INICIO: CAMBIO SOLICITADO -->
                <div class="col-md-6">
                  <label for="new-client-precio-neto" class="form-label">Precio Neto (€)</label>
                  <input type="number" class="form-control" id="new-client-precio-neto"
                    v-model.number="newClient.precioNeto" step="0.01" min="0">
                </div>
                <div class="col-md-6">
                  <label for="new-client-precio-con-iva" class="form-label">Precio con IVA 21% (€)</label>
                  <input type="text" class="form-control" id="new-client-precio-con-iva"
                    :value="calculatedNewClientPrecioConIva" readonly>
                </div>
                <!-- FIN: CAMBIO SOLICITADO -->
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeAddClientModal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="saveNewClient" :disabled="isSavingNewClient">
              {{ isSavingNewClient ? 'Guardando...' : 'Guardar Cliente' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isAddClientModalOpen" class="modal-backdrop fade show"></div>

    <!-- INICIO: INTEGRACIÓN DEL NUEVO MODAL InvoiceEditorModal -->
    <InvoiceEditorModal
      :invoiceData="editableInvoiceData"
      :isOpen="isInvoiceEditorModalOpen"
      @close="closeInvoiceEditor"
      @generatePdf="handleGenerateEditedPdf"
      @previewPdf="handlePreviewEditedPdf"
      :formatCurrency="formatCurrency"
       :limpiezaId="editingLimpiezaId"          
      @saveCustomItems="handleSaveCustomItems"  
    />
    <!-- FIN: INTEGRACIÓN DEL NUEVO MODAL InvoiceEditorModal -->

    <!-- Modal de Vista Previa de Factura (EXISTENTE) -->
    <!-- Este modal ahora se activa a través de handlePreviewEditedPdf desde InvoiceEditorModal -->
    <div v-if="isPreviewModalOpen" class="modal fade show pdf-preview-modal" style="display: block;" tabindex="-1"
      aria-labelledby="pdfPreviewModalLabel" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="pdfPreviewModalLabel">Vista Previa de Factura</h5>
            <button type="button" class="btn-close" @click="closePreviewModal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="height: 80vh;">
            <iframe :src="pdfPreviewUrl" frameborder="0" width="100%" height="100%"></iframe>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closePreviewModal">Cerrar</button>
            <!-- Este botón 'Descargar' probablemente deba ser revisado. Si la descarga principal ahora es desde InvoiceEditorModal,
                 este botón aquí podría no ser necesario, o necesitaría recibir los datos adecuados.
                 Lo he dejado como estaba para no introducir cambios no solicitados en la lógica de descarga. -->
            <button type="button" class="btn btn-primary" @click="downloadFactura(editedLimpieza)">Descargar</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isPreviewModalOpen" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useDatabaseStore } from "../stores/database";
import { jsPDF } from "jspdf";
import dayjs from "dayjs";
import 'dayjs/locale/es';
import 'dayjs/locale/fr';

import PagosPendientesView from '../components/PagosPendientesView.vue';
import InvoiceEditorModal from '../components/InvoiceEditorModal.vue';
import logo from '../assets/img/logoweb.png';
import phoneIcon from '../assets/img/mobile.png';
import emailIcon from '../assets/img/envelope.png';
import webIcon from '../assets/img/globe.png';
import locationIcon from '../assets/img/location.png';
import { useUserStore } from "../stores/user"
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    limit,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    getDoc,
    updateDoc,
    // No utilizados en esta versión: runTransaction, Timestamp, onAuthStateChanged (auth handling is in user store)
} from 'firebase/firestore';
import Swal from 'sweetalert2';
// Establecer el locale de dayjs para los PDFs y cualquier otra operación que lo requiera.
// Aquí se establece a francés como en tu código original para PDF, pero puedes ajustarlo.
dayjs.locale('fr');

// --- ESTADOS LOCALES Y REFERENCES ---
const databaseStore = useDatabaseStore();

const userStore = useUserStore()
const isGeneratingPdf = ref(false); // Estado para el spinner del PDF resumen
const manualFacturaInput = ref('');

// --- NUEVOS ESTADOS PARA EL EDITOR DE FACTURAS ---
const isInvoiceEditorModalOpen = ref(false); // Controla la visibilidad del modal del editor de facturas
const editableInvoiceData = ref(null); // Contendrá los datos de la factura que se pasarán al editor
// --- FIN NUEVOS ESTADOS ---
const isSendingEmail = ref(false);

const isSavingToDrive = ref(false); // <--- NUEVO: Estado para el spinner de Google Drive

const sendInvoiceByEmail = async (limpieza) => {
  isSendingEmail.value = true;

  try {
    const databaseStore = useDatabaseStore();
    const userStore = useUserStore();

    // 🧾 Construcción de los ítems de factura
    const invoiceItems = [];
    for (let i = 1; i <= 5; i++) {
      const semanaKey = `semana${i}`;
      const semanaTipo = limpieza[`${semanaKey}Tipo`];
      const fecha = limpieza[semanaKey];
      const semanaPrecio = limpieza[`${semanaKey}precio`];

      if (!semanaTipo || !fecha) continue;

      let descriptionText = "";
      if (semanaTipo === "exterior") descriptionText = "Nettoyage extérieur";
      else if (semanaTipo === "interior") descriptionText = "Nettoyage intérieur";
      else if (semanaTipo === "ambas") descriptionText = "Nettoyage extérieur et intérieur";

      invoiceItems.push({
        description: descriptionText,
        date: dayjs(fecha).format("YYYY-MM-DD"),
        qty: 1,
        unitPrice: parseFloat(semanaPrecio?.toFixed?.() || limpieza.precioBruto || 0),
        totalHT: parseFloat(semanaPrecio?.toFixed?.() || limpieza.precioBruto || 0),
        isOriginalCleaning: true,
      });
    }

    // 🧩 Añadir limpiezas extra si existen
    if (limpieza.extraCleanings?.length) {
      limpieza.extraCleanings.forEach((extra) => {
        if (extra.description && extra.unitPrice && extra.quantity > 0) {
          invoiceItems.push({
            description: extra.description,
            date: extra.date ? dayjs(extra.date).format("YYYY-MM-DD") : "",
            qty: extra.quantity,
            unitPrice: parseFloat(extra.unitPrice.toFixed(2)),
            totalHT: parseFloat((extra.quantity * extra.unitPrice).toFixed(2)),
            isOriginalCleaning: false,
          });
        }
      });
    }

    // 📄 Datos completos de factura
    const finalInvoiceDataForPdf = {
      factura: limpieza.factura,
      clienteId: limpieza.clienteId,
      clientDetails: await databaseStore.fetchClientById(limpieza.clienteId),
      invoiceItems, // ✅ ahora lleno correctamente
      formaPago: limpieza.formaPago || "Efectivo",
      fechaPago: limpieza.fechaPago ? dayjs(limpieza.fechaPago).format("YYYY-MM-DD") : "",
    };

    // 🧠 Generar el PDF
    const docPdf = await generateInvoicePdfContent(finalInvoiceDataForPdf);
    if (!docPdf) {
      alert("Fallo al generar el PDF.");
      return;
    }

    const pdfBase64 = docPdf.output("datauristring").split(",")[1];

    // ✉️ Enviar correo al cliente
    await sendInvoiceToClient(limpieza, pdfBase64, userStore);

    // ✅ Marcar como enviado
    const limpiezaRef = doc(db, "limpiezasMensuales", limpieza.id);
    await updateDoc(limpiezaRef, { emailEnviado: true });
    limpieza.emailEnviado = true;

    Swal.fire({
      icon: "success",
      title: "¡Factura enviada!",
      html: `La factura de <strong>${finalInvoiceDataForPdf.clientDetails.nombre}</strong> se ha enviado correctamente.`,
      timer: 4000,
      showConfirmButton: false,
    });

  } catch (error) {
    console.error("Error al enviar la factura:", error);
    alert(`Error al enviar la factura: ${error.message}`);
  } finally {
    isSendingEmail.value = false;
  }
};



const saveInvoiceToGoogleDrive = async (limpieza) => {
  const databaseStore = useDatabaseStore();
  isSavingToDrive.value = true;

  try {
    // 1️⃣ Verificar usuario autenticado
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Swal.fire({
        icon: "warning",
        title: "Non authentifié",
        text: "Veuillez vous connecter avant de sauvegarder la facture.",
      });
      return;
    }

    // 2️⃣ Verificar token de Google Drive
    const googleAccessToken = userStore.googleAccessToken;
    if (!googleAccessToken) {
      Swal.fire({
        icon: "warning",
        title: "Connexion Google requise",
        text: "Veuillez d'abord vous connecter avec Google pour enregistrer la facture.",
      });
      return;
    }

    // 3️⃣ Datos del cliente
    const clientDetails = await databaseStore.fetchClientById(limpieza.clienteId);
    if (!clientDetails) {
      Swal.fire({
        icon: "error",
        title: "Client introuvable",
        text: "Impossible de trouver les informations du client.",
      });
      return;
    }

    // 4️⃣ Construir ítems de factura
    const invoiceItems = [];
    for (let i = 1; i <= 5; i++) {
      const semanaKey = `semana${i}`;
      const semanaTipo = limpieza[`${semanaKey}Tipo`];
      const fecha = limpieza[semanaKey];
      const semanaPrecio = limpieza[`${semanaKey}precio`];
      if (!semanaTipo || !fecha) continue;

      let descriptionText = "";
      if (semanaTipo === "exterior") descriptionText = "Nettoyage extérieur";
      else if (semanaTipo === "interior") descriptionText = "Nettoyage intérieur";
      else if (semanaTipo === "ambas") descriptionText = "Nettoyage extérieur et intérieur";

      invoiceItems.push({
        description: descriptionText,
        date: dayjs(fecha).format("YYYY-MM-DD"),
        qty: 1,
        unitPrice: parseFloat(semanaPrecio?.toFixed?.() || limpieza.precioBruto || 0),
        totalHT: parseFloat(semanaPrecio?.toFixed?.() || limpieza.precioBruto || 0),
        isOriginalCleaning: true,
      });
    }

    if (limpieza.extraCleanings?.length) {
      limpieza.extraCleanings.forEach((extra) => {
        if (extra.description && extra.unitPrice && extra.quantity > 0) {
          invoiceItems.push({
            description: extra.description,
            date: extra.date ? dayjs(extra.date).format("YYYY-MM-DD") : "",
            qty: extra.quantity,
            unitPrice: parseFloat(extra.unitPrice.toFixed(2)),
            totalHT: parseFloat((extra.quantity * extra.unitPrice).toFixed(2)),
            isOriginalCleaning: false,
          });
        }
      });
    }

    // 5️⃣ Generar PDF
    const finalInvoiceDataForPdf = {
      factura: limpieza.factura,
      clienteId: limpieza.clienteId,
      clientDetails,
      invoiceItems,
      formaPago: limpieza.formaPago || "Espèces",
      fechaPago: limpieza.fechaPago ? dayjs(limpieza.fechaPago).format("YYYY-MM-DD") : "",
    };

    // Renombramos doc a pdfDoc para evitar conflicto con Firebase
    const pdfDoc = await generateInvoicePdfContent(finalInvoiceDataForPdf);
    if (!pdfDoc) {
      Swal.fire({
        icon: "error",
        title: "Erreur PDF",
        text: "Impossible de générer le fichier PDF de la facture.",
      });
      return;
    }

    // 6️⃣ Preparar el archivo PDF
    const fileContentBase64 = pdfDoc.output("datauristring").split(",")[1];
    const fileBlob = new Blob([Uint8Array.from(atob(fileContentBase64), (c) => c.charCodeAt(0))], { type: "application/pdf" });

    const now = dayjs();
    const anioActual = now.year();
    const mesActual = now.format("MMMM").toUpperCase(); // ej. "NOVEMBRE"

    const filename = `${clientDetails.nombre.replace(/[^a-zA-Z0-9-]/g, "_")}_${mesActual}_${anioActual}.pdf`;

    // 7️⃣ Crear estructura de carpetas
    const rootFolder = await getOrCreateFolder("FACTURES", googleAccessToken);
    const yearFolder = await getOrCreateFolder(`${anioActual}`, googleAccessToken, rootFolder);
    const monthFolderName = `${mesActual} ${anioActual}`;
    const monthFolder = await getOrCreateFolder(monthFolderName, googleAccessToken, yearFolder);

    // 8️⃣ Mostrar loader
    Swal.fire({
      title: "Téléversement de la facture...",
      html: "Veuillez patienter quelques secondes.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // 9️⃣ Subir a Drive
    const uploadedFile = await uploadPdfToDrive(filename, monthFolder, fileBlob, googleAccessToken);
    Swal.close();

    if (uploadedFile?.id) {
      // 🔹 Actualizar Firestore: marcar facturaEnviada
      const limpiezaRef = doc(db, 'limpiezasMensuales', limpieza.id);
      await updateDoc(limpiezaRef, { facturaEnviada: true });
      limpieza.facturaEnviada = true;
      Swal.fire({
        icon: "success",
        title: "Facture enregistrée !",
        html: `La facture a été sauvegardée avec succès dans Google Drive.<br>
               <a href="https://drive.google.com/file/d/${uploadedFile.id}/view" target="_blank">📄 Voir la facture</a>`,
        confirmButtonText: "Fermer",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Le fichier n’a pas pu être téléversé sur Google Drive.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erreur inattendue",
      text: `Une erreur est survenue : ${error.message || "Inconnue"}`,
    });
    console.error("Erreur dans saveInvoiceToGoogleDrive:", error);
  } finally {
    isSavingToDrive.value = false;
  }
};

const sendInvoiceToClient = async (limpieza, pdfBase64, userStore) => {
  const databaseStore = useDatabaseStore(); // inicializar Pinia

  async function toBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function base64EncodeUnicode(str) {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, 
        (match, p1) => String.fromCharCode('0x' + p1)
      )
    );
  }

  try {
   
    const clientDetails = await databaseStore.fetchClientById(limpieza.clienteId);

    if (!clientDetails?.email) {
      alert("No se encontró el email del cliente.");
      return;
    }

    const email = clientDetails.email;
    const fecha = dayjs(limpieza.fecha || new Date());
    const mes = fecha.locale('fr').format('MMMM');
    const ano = fecha.format('YYYY');
    const subject = `Facture nettoyage des vitres ${mes} ${ano}`;

    const bloquePago = !limpieza.fechaPago
      ? `<p>Veuillez noter que le paiement doit être effectué d'ici la date d'échéance indiquée.</p>
         <p style="margin-left:20px;">
           <strong>Virement bancaire :</strong><br>
           Titulaire du compte: DIEGO HIGUERO RUIZ<br>
           Nom de la banque: Caisse d'Epargne<br>
           Code IBAN: FR76 1333 5000 4008 0026 8561 397<br>
           RIB: 13335 00040 08002685613 97
         </p>`
      : '';

    const trackingPixel = `<img src="https://tu-servidor.com/trackEmail?clienteId=${limpieza.clienteId}&factura=${limpieza.factura}" width="1" height="1" />`;

    const body = `
      <p>A l'attention de ${clientDetails.nombre},</p>
      <p>Nous espérons que vous allez bien. Veuillez trouver ci-dessous la facture.</p>
      ${bloquePago}
      <p>Bien cordialement,</p>
      ${trackingPixel}
    `;

    const messageParts = [
      `From: ${userStore.userData.email}`,
      `To: ${email}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      'Content-Type: multipart/mixed; boundary="boundary_string"',
      "",
      "--boundary_string",
      'Content-Type: text/html; charset="UTF-8"',
      "",
      body,
      "",
      "--boundary_string",
      "Content-Type: application/pdf",
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="factura_${clientDetails.nombre}_${limpieza.factura}.pdf"`,
      "",
      pdfBase64,
      "",
      "--boundary_string--"
    ];

    const emailContent = messageParts.join("\r\n");

    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${userStore.googleAccessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ raw: base64EncodeUnicode(emailContent) })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error enviando email: ${text}`);
    }

    // 🔹 Actualizar Firestore: marcar emailEnviado
    const limpiezaRef = doc(db, 'limpiezasMensuales', limpieza.id);
    await updateDoc(limpiezaRef, { emailEnviado: true });
    limpieza.emailEnviado = true;

    Swal.fire({
      icon: 'success',
      title: '¡Correo enviado!',
      html: `La factura de <strong>${clientDetails.nombre}</strong> ha sido enviada con éxito.`,
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false
    });

  } catch (error) {
    alert(`Error al enviar la factura: ${error.message}`);
  }
};
const currentFilterMonth = computed(() => {
  const monthStr = databaseStore.selectedMonth;
  return monthStr !== '' ? parseInt(monthStr) : null;
});

const currentFilterYear = computed(() => {
  const yearStr = databaseStore.selectedYear;
  return yearStr !== '' ? parseInt(yearStr) : null;
});

const totalPendiente = computed(() => {
  let sum = 0;
  for (const limpieza of databaseStore.limpiezas) {
    if (!limpieza.fechaPago) {
      sum += (limpieza.precioBruto || 0);
    }
  }
  return sum;
});
const totalPendienteNeto = computed(() => {
  let sum = 0;
  for (const limpieza of databaseStore.limpiezas) {
    if (!limpieza.fechaPago) {
      sum += calculatePrecioNeto(limpieza.precioBruto || 0);
    }
  }
  return sum;
});

const totalPendienteCotizacion = computed(() => {
  let sum = 0;
  for (const limpieza of databaseStore.limpiezas) {
    if (!limpieza.fechaPago) {
      sum += calculateCotizacion(limpieza.precioBruto || 0);
    }
  }
  return sum;
});
const totalPagado = computed(() => {
  let sum = 0;
  const filterMonth = currentFilterMonth.value;
  const filterYear = currentFilterYear.value;

  if (filterMonth === null || filterYear === null) {
      return 0;
  }

  for (const limpieza of databaseStore.limpiezas) {
    if (limpieza.fechaPago) {
      const pagoDate = dayjs(limpieza.fechaPago);
      if (pagoDate.month() === filterMonth && pagoDate.year() === filterYear) {
        sum += (limpieza.precioBruto || 0);
      }
    }
  }
  return sum;
});

const totalNetoPagado = computed(() => {
  let sum = 0;
  const filterMonth = currentFilterMonth.value;
  const filterYear = currentFilterYear.value;

  if (filterMonth === null || filterYear === null) {
      return 0;
  }

  for (const limpieza of databaseStore.limpiezas) {
    if (limpieza.fechaPago) {
      const pagoDate = dayjs(limpieza.fechaPago);
      if (pagoDate.month() === filterMonth && pagoDate.year() === filterYear) {
        sum += calculatePrecioNeto(limpieza.precioBruto || 0);
      }
    }
  }
  return sum;
});

const totalCotizacionPagado = computed(() => {
  let sum = 0;
  const filterMonth = currentFilterMonth.value;
  const filterYear = currentFilterYear.value;

  if (filterMonth === null || filterYear === null) {
      return 0;
  }

  for (const limpieza of databaseStore.limpiezas) {
    if (limpieza.fechaPago) {
      const pagoDate = dayjs(limpieza.fechaPago);
      if (pagoDate.month() === filterMonth && pagoDate.year() === filterYear) {
        sum += calculateCotizacion(limpieza.precioBruto || 0);
      }
    }
  }
  return sum;
});
const totalPendienteMesActual = computed(() => {
  let sum = 0;
  for (const limpieza of databaseStore.limpiezas) {
    if (!limpieza.fechaPago) {
      sum += (limpieza.precioBruto || 0);
    }
  }
  return sum;
});
const nuevaLimpieza = ref({
  cliente: '',
  clienteId: null,
  semana1: '',
  semana1Notas: '',
  semana2: '',
  semana2Notas: '',
  semana3: '',
  semana3Notas: '',
  semana4: '',
  semana4Notas: '',
  // ... (propiedades de semana existentes con solo fecha y notas) ...
  extraCleanings: [{ description: '', date: '', quantity: 1, unitPrice: 0 }],
  formaPago: 'Efectivo',
  fechaPago: null,
  basePriceNeto: 0, // <-- NUEVO: Para guardar el precio neto base del cliente
});

const editedLimpieza = ref({
  id: null, factura: null, cliente: '', clienteId: null,
  semana1: '', semana1Notas: '',
  semana2: '', semana2Notas: '',
  semana3: '', semana3Notas: '',
  semana4: '', semana4Notas: '',
  // ... (propiedades de semana existentes con solo fecha y notas) ...
  extraCleanings: [],
  formaPago: 'Efectivo', fechaPago: null, precioBruto: null,
  basePriceNeto: 0, // <-- NUEVO: Para guardar el precio neto base del cliente
});


const newClient = ref({
  nombre: '', apellido: '', direccion: '',direccionComplementaria:'', ciudad: '', provincia: '', codigoPostal: '',
  direccionIntervencion: { calle: '',complementaria:'', ciudad: '', provincia: '', codigoPostal: '' },
  telefono: '', email: '', tipoCliente: '',
  precioNeto: 0.00 
});
// ...otras propiedades computadas existentes...

// Calculado para el Precio con IVA en el formulario de nuevo cliente
const calculatedNewClientPrecioConIva = computed(() => {
  const neto = Number(newClient.value.precioNeto);
  if (isNaN(neto) || neto < 0) return formatCurrency(0);
  return formatCurrency(neto * 1.21); // Suponiendo un 21% de IVA
});

// ...resto del código de propiedades computadas...


// Metodos para limpiezas extra en el formulario de NUEVA limpieza
const addExtraCleaningLine = () => {
  nuevaLimpieza.value.extraCleanings.push({
    description: '',
    date: '',
    quantity: 1,
    unitPrice: 0,
  });
};

const removeExtraCleaning = (index) => {
  nuevaLimpieza.value.extraCleanings.splice(index, 1);
};

// Metodos para limpiezas extra en el formulario de EDICION
const addExtraCleaningLineEdited = () => {
  editedLimpieza.value.extraCleanings.push({
    description: '',
    date: '',
    quantity: 1,
    unitPrice: 0,
  });
};

const removeExtraCleaningEdited = (index) => {
  editedLimpieza.value.extraCleanings.splice(index, 1);
};

// Estados para el control de modales
const isEditModalOpen = ref(false);
const isAddClientModalOpen = ref(false);
const isPreviewModalOpen = ref(false); // Este es para la previsualización del PDF genérico, no el editor

// Estados de carga específicos para este componente
const isLoadingEdit = ref(false);
const isSavingNewClient = ref(false);

// IDs para edición/previsualización
const editingLimpiezaId = ref(null);
const pdfPreviewUrl = ref(null);

// Filtros
const now = new Date();
const selectedMonth = ref(now.getMonth().toString());
const selectedYear = ref(now.getFullYear().toString());

// --- COMPUTED PROPERTIES ---

const isLoading = computed(() => databaseStore.isLoadingLimpiezas);
const error = computed(() => databaseStore.errorLimpiezas);

const proximaFactura = computed(() => databaseStore.nextFacturaFormatted);

const selectedClientForNueva = computed(() => {
  return databaseStore.clientes.find(c => c.id === nuevaLimpieza.value.clienteId) || null;
});
const selectedClientForEdited = computed(() => {
  return databaseStore.clientes.find(c => c.id === editedLimpieza.value.clienteId) || null;
});

const calculatePrecioBruto = (limpiezaData, clientData) => {
  let total = 0;
  const client = clientData;
  if (!client) return 0;

  const extPrice = client.precioExterior || 0;
  const intPrice = client.precioInterior || 0;

  for (let i = 1; i <= 5; i++) {
    const semanaExteriorKey = `semana${i}Exterior`;
    const semanaInteriorKey = `semana${i}Interior`;
    const semanaPrecioKey = `semana${i}precio`;

    let weeklyPrice = 0;
    if (limpiezaData[semanaPrecioKey] !== null && typeof limpiezaData[semanaPrecioKey] !== 'undefined' && !isNaN(parseFloat(limpiezaData[semanaPrecioKey]))) {
      weeklyPrice = parseFloat(limpiezaData[semanaPrecioKey]);
    } else {
      if (limpiezaData[semanaExteriorKey]) {
        weeklyPrice += extPrice;
      }
      if (limpiezaData[semanaInteriorKey]) {
        weeklyPrice += intPrice;
      }
    }
    total += weeklyPrice;
  }
  return parseFloat(total.toFixed(2));
};

// Computed para el total de limpiezas extra en el formulario de NUEVA limpieza
const calculatedExtraCleaningsTotalNueva = computed(() => {
  let total = 0;
  for (const extra of nuevaLimpieza.value.extraCleanings) {
    if (extra.quantity && extra.unitPrice) {
      total += (Number(extra.quantity) * Number(extra.unitPrice));
    }
  }
  return parseFloat(total.toFixed(2));
});

// Computed para el total de limpiezas extra en el formulario de EDICION
const calculatedExtraCleaningsTotalEdited = computed(() => {
  let total = 0;
  for (const extra of editedLimpieza.value.extraCleanings) {
    if (extra.quantity && extra.unitPrice) {
      total += (Number(extra.quantity) * Number(extra.unitPrice));
    }
  }
  return parseFloat(total.toFixed(2));
});


// Calculado para el formulario de EDICION



const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
});

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const displayFilterSummary = computed(() => {
  let monthText = databaseStore.selectedMonth === '' ? 'Todos los meses' : monthNames[parseInt(databaseStore.selectedMonth)];
  let yearText = databaseStore.selectedYear === '' ? 'Todos los años' : databaseStore.selectedYear;

  if (databaseStore.selectedMonth === '' && databaseStore.selectedYear === '') return 'Todos los registros';
  if (databaseStore.selectedMonth !== '' && databaseStore.selectedYear !== '') return `${monthText} - ${yearText}`;
  if (databaseStore.selectedMonth !== '') return monthText;
  return `del año ${yearText}`;
});

const totalsSummary = computed(() => ({
  totalBruto: databaseStore.totalBrutoLimpiezas,
  totalNeto: databaseStore.totalNetoLimpiezas,
  totalCotizacion: databaseStore.totalCotizacionLimpiezas,
}));

/**
 * Propiedad computada para la lista de limpiezas a mostrar en la tabla.
 * Aplica ordenación personalizada: los pagos con fecha principal y fecha de pago
 * en meses/años diferentes aparecen al principio de la lista.
 */
const displayLimpiezas = computed(() => {
  const limpiezas = [...databaseStore.limpiezas];

  limpiezas.sort((a, b) => {
    const aIsMismatchedPaid = a.fechaPago && isPaymentDateMismatched(a);
    const bIsMismatchedPaid = b.fechaPago && isPaymentDateMismatched(b);

    if (aIsMismatchedPaid && !bIsMismatchedPaid) {
      return -1;
    }
    if (!aIsMismatchedPaid && bIsMismatchedPaid) {
      return 1;
    }

    return b.factura.localeCompare(a.factura);
  });

  return limpiezas;
});

const uniqueClientsInDisplay = computed(() => {
  if (!displayLimpiezas.value || displayLimpiezas.value.length === 0) {
    return 0;
  }
  const clientIds = new Set();
  displayLimpiezas.value.forEach(limpieza => {
    if (limpieza.clienteId) {
      clientIds.add(limpieza.clienteId);
    }
  });
  return clientIds.size;
});


/**
 * Función para determinar si una fila debe resaltarse.
 */
const isPaymentDateMismatched = (limpieza) => {
  if (!limpieza.fechaPago || !limpieza.fechaPrincipalLimpieza) {
    return false;
  }
  const principalDate = dayjs(limpieza.fechaPrincipalLimpieza);
  const pagoDate = dayjs(limpieza.fechaPago);

  return (principalDate.month() !== pagoDate.month() || principalDate.year() !== pagoDate.year());
};


// --- FUNCIONES UTILITARIAS ---

/**
 * Busca la fecha más temprana entre semana1 y semana5.
 */
const getEarliestSemanaDate = (limpiezaData) => {
  let earliestDate = null;
  // Modificado para iterar hasta semana4 según tu estructura de datos actual
  for (let i = 1; i <= 4; i++) {
    const dateString = limpiezaData[`semana${i}`];
    if (dateString) {
      const currentDate = dayjs(dateString);
      if (currentDate.isValid()) {
        if (!earliestDate || currentDate.isBefore(earliestDate)) {
          earliestDate = currentDate;
        }
      }
    }
  }
  // También considerar las fechas de las limpiezas extra si existen
  if (limpiezaData.extraCleanings && limpiezaData.extraCleanings.length > 0) {
    for (const extra of limpiezaData.extraCleanings) {
      if (extra.date) {
        const extraDate = dayjs(extra.date);
        if (extraDate.isValid()) {
          if (!earliestDate || extraDate.isBefore(earliestDate)) {
            earliestDate = extraDate;
          }
        }
      }
    }
  }

  return earliestDate ? earliestDate.format('YYYY-MM-DD') : null;
};



/**
 * Formatea una fecha a formato europeo (DD/MM/AAAA).
 */
const formatEuropeanDate = (dateValue) => {
  if (!dateValue) return '';
  let date;
  if (typeof dateValue.toDate === 'function') {
    date = dayjs(dateValue.toDate());
  } else if (dateValue instanceof Date) {
    date = dayjs(dateValue);
  } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    date = dayjs(dateValue);
    if (!date.isValid()) { console.warn('Fecha inválida detectada:', dateValue); return ''; }
  } else {
    console.warn('Formato de fecha desconocido:', dateValue); return '';
  }
  // Utiliza el locale de dayjs que ya está configurado (fr en este caso)
  return date.format('DD/MM/YYYY');
};

/**
 * Calcula la cotización (21% del precio bruto).
 */
const calculateCotizacion = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) return 0;
  // Para obtener el IVA del precio bruto: (Precio Bruto / 1.21) * 0.21
  return parseFloat(((brute / 1.21) * 0.21).toFixed(2));
};
/**
 * Calcula el precio neto (precio bruto - cotización).
 */
const calculatePrecioNeto = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) return 0;
  // Para obtener el precio neto del precio bruto: Precio Bruto / 1.21
  return parseFloat((brute / 1.21).toFixed(2));
};
// NUEVA: Propiedad computada para el precio neto base del cliente seleccionado (para la creación)
const baseNetPriceNueva = computed(() => {
  const client = selectedClientForNueva.value;
  return client ? (client.precioNeto || 0) : 0;
});

// NUEVA: Propiedad computada para el precio neto base del cliente seleccionado (para la edición)
const baseNetPriceEdited = computed(() => {
  const client = selectedClientForEdited.value;
  // Si no hay cliente seleccionado en el modal de edición, usa el valor ya almacenado en editedLimpieza
  return client ? (client.precioNeto || 0) : (editedLimpieza.value.basePriceNeto || 0);
});

// Calculado para el formulario de NUEVA limpieza
const calculatedPrecioBrutoNueva = computed(() => {
  // Suma el precio neto base del cliente y el total de limpiezas extra
  const totalNetoBase = baseNetPriceNueva.value + calculatedExtraCleaningsTotalNueva.value;
  // Calcula el precio bruto aplicando el 21% de IVA
  return parseFloat((totalNetoBase * 1.21).toFixed(2));
});

// Calculado para el formulario de EDICION
const calculatedPrecioBrutoEdited = computed(() => {
  // Suma el precio neto base del cliente y el total de limpiezas extra
  const totalNetoBase = baseNetPriceEdited.value + calculatedExtraCleaningsTotalEdited.value;
  // Calcula el precio bruto aplicando el 21% de IVA
  return parseFloat((totalNetoBase * 1.21).toFixed(2));
});
/**
 * Formatea un número a moneda (€).
 */
const formatCurrency = (value) => {
  const numberValue = Number(value);
  if (isNaN(numberValue)) return '';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

// --- MANEJO DE MODALES ---




/**
 * Abre el modal de edición y carga los datos de la limpieza.
 */
const openEditModal = (limpieza) => {
  editingLimpiezaId.value = limpieza.id;
  const tempEditedLimpieza = {
    ...limpieza,
    semana1: limpieza.semana1 || '', semana1Notas: limpieza.semana1Notas || '',
    semana2: limpieza.semana2 || '', semana2Notas: limpieza.semana2Notas || '',
    semana3: limpieza.semana3 || '', semana3Notas: limpieza.semana3Notas || '',
    semana4: limpieza.semana4 || '', semana4Notas: limpieza.semana4Notas || '',
    fechaPago: limpieza.fechaPago || null,
    formaPago: limpieza.formaPago || 'Efectivo',
    clienteId: limpieza.clienteId || null,
    basePriceNeto: limpieza.basePriceNeto || 0, // Asegurarse de que basePriceNeto se copia
    extraCleanings: limpieza.extraCleanings ? JSON.parse(JSON.stringify(limpieza.extraCleanings)) : [{ description: '', date: '', quantity: 1, unitPrice: 0 }], // Añade una línea vacía si no hay extras
  };

  // ELIMINA CUALQUIER BUCLE QUE ASIGNE semanaXExterior/Interior/precio/Tipo
  // for (let i = 1; i <= 5; i++) {
  //   const tipo = tempEditedLimpieza[`semana${i}Tipo`];
  //   tempEditedLimpieza[`semana${i}Exterior`] = tipo === 'exterior' || tipo === 'ambas';
  //   tempEditedLimpieza[`semana${i}Interior`] = tipo === 'interior' || tipo === 'ambas';
  // }
  editedLimpieza.value = tempEditedLimpieza;
  isEditModalOpen.value = true;
  databaseStore.updateLimpiezaError = null;
};



/**
 * Cierra el modal de edición y resetea los datos.
 */
const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingLimpiezaId.value = null;
  Object.assign(editedLimpieza.value, {
    id: null, factura: null, cliente: '', clienteId: null,
    semana1: '', semana1Notas: '',
    semana2: '', semana2Notas: '',
    semana3: '', semana3Notas: '',
    semana4: '', semana4Notas: '',
    extraCleanings: [],
    formaPago: 'Efectivo', fechaPago: null, precioBruto: null, tipoCliente: '',
    basePriceNeto: 0, // Resetear basePriceNeto
  });
  databaseStore.updateLimpiezaError = null;
};



/**
 * Abre el modal para añadir un nuevo cliente y resetea el formulario.
 */
const openAddClientModal = () => {
  isAddClientModalOpen.value = true;
  Object.assign(newClient.value, {
    nombre: '', apellido: '', direccion: '',direccionComplementaria:"", ciudad: '', provincia: '', codigoPostal: '',
    direccionIntervencion: { calle: '',complementaria:'', ciudad: '', provincia: '', codigoPostal: '' },
    telefono: '', email: '',precioNeto:'',
  });
};

/**
 * Cierra el modal de añadir cliente.
 */
const closeAddClientModal = () => {
  isAddClientModalOpen.value = false;
};

/**
 * Cierra el modal de vista previa del PDF genérico.
 */
const closePreviewModal = () => {
  isPreviewModalOpen.value = false;
  pdfPreviewUrl.value = null;
};


// --- CRUD DE LIMPIEZAS ---

/**
 * Añade un nuevo registro de limpieza.
 */
const agregarLimpieza = async () => {
  if (!nuevaLimpieza.value.clienteId) { alert('Por favor, selecciona un cliente.'); return; }
  const client = selectedClientForNueva.value;
  if (!client) { alert('Error: Cliente no encontrado con el ID seleccionado.'); return; }

  let algunaSemanaConFecha = false; // Ahora solo necesitamos saber si hay alguna fecha
  for (let i = 1; i <= 4; i++) { // Cambiado de 5 a 4 si no tienes semana 5 en la UI
    if (nuevaLimpieza.value[`semana${i}`]) {
      algunaSemanaConFecha = true;
      break;
    }
  }
  // También consideramos las limpiezas extra como un indicador de "algo que guardar"
  const hasExtraCleanings = nuevaLimpieza.value.extraCleanings.some(
    extra => extra.description && extra.unitPrice && extra.quantity > 0
  );

  if (!algunaSemanaConFecha && !hasExtraCleanings) {
    alert('Por favor, completa al menos una fecha de limpieza o añade una limpieza extra.');
    return;
  }

  const limpiezaParaGuardar = { ...nuevaLimpieza.value };

  limpiezaParaGuardar.factura = manualFacturaInput.value.trim() !== ''
    ? manualFacturaInput.value.trim()
    : proximaFactura.value;

  // IMPORTANT: Almacenar el precio neto base del cliente en el registro de limpieza
  limpiezaParaGuardar.basePriceNeto = baseNetPriceNueva.value; // Usa la propiedad computada

  // El precioBruto ahora se calcula directamente desde el baseNetPriceNueva + extras
  limpiezaParaGuardar.precioBruto = calculatedPrecioBrutoNueva.value;

  limpiezaParaGuardar.clienteId = nuevaLimpieza.value.clienteId;
  limpiezaParaGuardar.cliente = `${client.nombre} ${(client.apellido || '')}`.trim();
  limpiezaParaGuardar.fechaPago = nuevaLimpieza.value.fechaPago || null;

  // Asegurar que las fechas de semana sean null si están vacías, sin lógica de tipo/precio
  limpiezaParaGuardar.semana1 = limpiezaParaGuardar.semana1 || null;
  limpiezaParaGuardar.semana1Notas = limpiezaParaGuardar.semana1Notas || null;
  limpiezaParaGuardar.semana2 = limpiezaParaGuardar.semana2 || null;
  limpiezaParaGuardar.semana2Notas = limpiezaParaGuardar.semana2Notas || null;
  limpiezaParaGuardar.semana3 = limpiezaParaGuardar.semana3 || null;
  limpiezaParaGuardar.semana3Notas = limpiezaParaGuardar.semana3Notas || null;
  limpiezaParaGuardar.semana4 = limpiezaParaGuardar.semana4 || null;
  limpiezaParaGuardar.semana4Notas = limpiezaParaGuardar.semana4Notas || null;
  // Elimina cualquier referencia a semanaXExterior, semanaXInterior, semanaXprecio, semanaXTipo

  // Guardamos solo las extraCleanings válidas
  limpiezaParaGuardar.extraCleanings = limpiezaParaGuardar.extraCleanings.filter(
    extra => extra.description && extra.unitPrice && extra.quantity > 0
  );

  limpiezaParaGuardar.fechaPrincipalLimpieza = getEarliestSemanaDate(limpiezaParaGuardar);

  try {
    await databaseStore.addLimpieza(limpiezaParaGuardar);
    alert('Registro añadido con éxito!');
    // Reiniciar el formulario
    Object.assign(nuevaLimpieza.value, {
      cliente: '', clienteId: null,
      semana1: '', semana1Notas: '',
      semana2: '', semana2Notas: '',
      semana3: '', semana3Notas: '',
      semana4: '', semana4Notas: '',
      extraCleanings: [{ description: '', date: '', quantity: 1, unitPrice: 0 }], // Reset extraCleanings
      formaPago: 'Efectivo', fechaPago: null, basePriceNeto: 0, // Reiniciar basePriceNeto
    });
    manualFacturaInput.value = '';
  } catch (err) {
    alert('Error al añadir el registro: ' + (databaseStore.addLimpiezaError?.message || 'Desconocido'));
    console.error("Error al añadir limpieza en componente:", err);
  }
};


/**
 * Guarda los cambios de un registro de limpieza editado.
 */
const saveEditedLimpieza = async () => {
  if (!editingLimpiezaId.value) { console.error("No hay documento seleccionado para editar."); return; }
  if (!editedLimpieza.value.clienteId) { alert('Error: No se encontró el ID del cliente para la edición.'); return; }

  const client = selectedClientForEdited.value;
  if (!client) { alert('Error: Cliente no encontrado con el ID de edición.'); return; }

  isLoadingEdit.value = true;

  const dataToUpdate = {
    factura: editedLimpieza.value.factura,
    clienteId: editedLimpieza.value.clienteId,
    cliente: `${client.nombre} ${(client.apellido || '')}`.trim(),
    formaPago: editedLimpieza.value.formaPago,
    fechaPago: editedLimpieza.value.fechaPago || null,
    basePriceNeto: baseNetPriceEdited.value, // Actualizar basePriceNeto desde la propiedad computada
    precioBruto: calculatedPrecioBrutoEdited.value, // Re-calcular precioBruto
  };

  // Asegurar que las fechas de semana y notas sean null si están vacías
  dataToUpdate.semana1 = editedLimpieza.value.semana1 || null;
  dataToUpdate.semana1Notas = editedLimpieza.value.semana1Notas || null;
  dataToUpdate.semana2 = editedLimpieza.value.semana2 || null;
  dataToUpdate.semana2Notas = editedLimpieza.value.semana2Notas || null;
  dataToUpdate.semana3 = editedLimpieza.value.semana3 || null;
  dataToUpdate.semana3Notas = editedLimpieza.value.semana3Notas || null;
  dataToUpdate.semana4 = editedLimpieza.value.semana4 || null;
  dataToUpdate.semana4Notas = editedLimpieza.value.semana4Notas || null;
  // Elimina cualquier referencia a semanaXExterior, semanaXInterior, semanaXprecio, semanaXTipo

  dataToUpdate.fechaPrincipalLimpieza = getEarliestSemanaDate(editedLimpieza.value);

  // Asegurarse de que extraCleanings se guarde correctamente también en la edición
  dataToUpdate.extraCleanings = editedLimpieza.value.extraCleanings.filter(
    extra => extra.description && extra.unitPrice && extra.quantity > 0
  );

  try {
    await databaseStore.updateLimpieza(editingLimpiezaId.value, dataToUpdate);
    console.log("Limpieza actualizada con éxito.");
    closeEditModal();
  } catch (err) {
    alert('Error al guardar los cambios: ' + (databaseStore.updateLimpiezaError?.message || 'Desconocido'));
    console.error("Error guardando la limpieza editada:", err);
  } finally {
    isLoadingEdit.value = false;
  }
};


/**
 * Confirma y elimina un registro de limpieza.
 */
const confirmDelete = async (limpieza) => {
  const isConfirmed = window.confirm(`¿Estás seguro de que quieres eliminar el registro de ${limpieza.cliente} (Factura #${limpieza.factura})?`);
  if (isConfirmed) {
    try {
      await databaseStore.deleteLimpieza(limpieza.id);
      console.log("Registro eliminado con éxito:", limpieza.id);
    } catch (err) {
      alert('Error al eliminar el registro: ' + (databaseStore.deleteLimpiezaError?.message || 'Desconocido'));
      console.error("Error al eliminar el registro:", err);
    }
  }
};

// --- CRUD DE CLIENTES ---

/**
 * Guarda un nuevo cliente añadido desde el modal.
 */
const saveNewClient = async () => {
  if (!newClient.value.nombre || !newClient.value.apellido) {
    alert('Por favor, ingresa el Nombre y Apellido del cliente.');
    return;
  }
  isSavingNewClient.value = true;
  try {
    await databaseStore.addClient(newClient.value);
    alert('Cliente añadido con éxito!');
    closeAddClientModal();
    await databaseStore.fetchClientes();
  } catch (error) {
    alert('Error al añadir el cliente: ' + (databaseStore.addClientError?.message || 'Desconocido'));
    console.error("Error al guardar el nuevo cliente:", error);
  } finally {
    isSavingNewClient.value = false;
  }
};

// --- FILTRADO DE DATOS ---

/**
 * Aplica los filtros seleccionados y carga las limpiezas.
 */
const applyFilter = () => {
  console.log("Aplicando filtro:", { month: selectedMonth.value, year: selectedYear.value });
  databaseStore.fetchLimpiezas(selectedMonth.value, selectedYear.value);
};

/**
 * Resetea los filtros y carga todas las limpiezas.
 */
const resetFilter = () => {
  selectedMonth.value = '';
  selectedYear.value = '';
  console.log("Reseteando filtro, cargando todos los registros.");
  databaseStore.fetchLimpiezas();
};

// --- GENERACIÓN DE PDFs ---

/**
 * Genera el contenido PDF de una factura.
 * Ahora recibe un objeto `invoiceData` ya procesado con todos los ítems.
 */
const generateInvoicePdfContent = async (invoiceData) => {
  if (!invoiceData || !invoiceData.clienteId || !invoiceData.factura || !invoiceData.invoiceItems || !invoiceData.clientDetails) {
    alert("Datos de factura incompletos para la generación del PDF.");
    return null;
  }

  const doc = new jsPDF();

  const clientDetails = invoiceData.clientDetails;
  const clientName = `${clientDetails.nombre || ''} ${clientDetails.apellido || ''}`;
  const clientAddress = clientDetails.direccion || 'N/A';
  const invoiceNumber = invoiceData.factura.toString();
  // Usa el locale configurado globalmente para dayjs, que aquí es 'fr'
  const currentDate = dayjs().format('DD/MM/YYYY');

  // --- LOGO ---
  doc.addImage(logo, 'PNG', 20, 20, 50, 20);

  // --- Encabezado ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("FACTURA", 150, 40);

  // --- Info cliente ---
  doc.setFontSize(8);
  doc.setTextColor("#4970B6");
  doc.setFont("helvetica", "bold");
  doc.text("EXPEDIDA A:", 20, 70);

  doc.setFont("helvetica", "normal");
  doc.setTextColor("black");
  doc.text(clientName, 20, 75);
  doc.text(clientAddress, 20, 80);

  // --- FACT# y FECHA ---
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#4970B6");
  doc.setFontSize(9);
  doc.text("FACT#:", 150, 70);
  doc.text("FECHA:", 150, 77);

  doc.setFont("helvetica", "normal");
  doc.setTextColor("black");
  doc.text(invoiceNumber, 190, 70, { align: "right" });
  doc.text(currentDate, 190, 77, { align: "right" });

  // --- Tabla de ítems ---
  let tableY = 95;
  const headerHeight = 9;
  // Altura para las dos líneas de contenido (descripción + detalles)
  const contentLinesHeight = 15; 

  doc.setDrawColor("#4970B6");
  doc.setFillColor("#4970B6");
  doc.rect(20, tableY, 170, headerHeight, "F");

  doc.setTextColor("white");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Descripción de servicio", 35, tableY + 6);
  doc.text("Cant.", 130, tableY + 6, { align: "center" });
  doc.text("Precio u.", 155, tableY + 6, { align: "center" });
  doc.text("Importe", 185, tableY + 6, { align: "right" });

  doc.setTextColor("black");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  let currentItemY = tableY + headerHeight + 5;
  let subtotal = 0;
  let itemsDrawn = 0;

  for (const item of invoiceData.invoiceItems) {
    if (item.totalHT && item.totalHT > 0) {
      // Calculamos la posición Y para el rectángulo de la fila
      const itemRectY = currentItemY + (itemsDrawn * (rowHeight + 5)) - 5;
      doc.rect(20, itemRectY, 170, rowHeight); // Dibuja el rectángulo de la fila

      // Calculamos la línea base vertical para el texto, para que esté centrado en el rowHeight
      const textBaselineY = itemRectY + rowHeight / 2;

      const description = item.description || '';
      const defaultTextStartX = 23; // Posición X por defecto para la alineación a la izquierda
      
      // Ancho aproximado de la columna de descripción para centrar
      const descriptionColStartX = 20;
      const descriptionColWidthForCentering = 110; // Ancho desde 20 hasta 130 para centrar

      // Regex para detectar "Limpieza de cristales" seguido de fechas entre paréntesis
      const windowCleaningWithDatesPattern = /^(Limpieza de cristales)\s*\((.+)\)$/;
      const match = description.match(windowCleaningWithDatesPattern);

      if (match) {
        // --- Caso: "Limpieza de cristales (fechas)" ---
        const baseText = match[1]; // "Limpieza de cristales"
        const rawDatesContent = `(${match[2]})`; // Contenido de las fechas, con paréntesis incluidos

        // Define una nueva posición de inicio X para este caso, más a la derecha que defaultTextStartX
        const dynamicTextStartXWithDates = 35; // Ajusta este valor (ej: 30, 35, 40) para moverlo más a la derecha

        // 1. Imprime "Limpieza de cristales" con tamaño 9
        doc.setFontSize(9);
        doc.text(baseText, dynamicTextStartXWithDates, textBaselineY);

        // 2. Calcula dónde deben empezar las fechas
        // Es crucial calcular el ancho del texto base *con el tamaño de fuente actual (9)*
        const baseTextWidth = doc.getTextWidth(baseText); 

        // 3. Imprime las fechas inmediatamente después, con tamaño 7 (más pequeño)
        doc.setFontSize(7); 
        // La posición X para las fechas es la posición del texto base + su ancho + un pequeño espacio
        doc.text(rawDatesContent, dynamicTextStartXWithDates + baseTextWidth + 1, textBaselineY);

      } else if (description === 'Limpieza de cristales') {
        // --- Caso: "Limpieza de cristales" SIN fechas ---
        // Se ejecuta si 'openInvoiceEditor' lo identificó como limpieza de cristales,
        // pero no se encontraron fechas en las propiedades 'semanaX'.
        doc.setFontSize(10); // Tamaño 10 como solicitado
        const textWidth = doc.getTextWidth(description);
        const centerX = descriptionColStartX + (descriptionColWidthForCentering / 2) - (textWidth / 2);
        doc.text(description, centerX, textBaselineY); // Centrado, como solicitado
      } else {
        // --- Caso: "Limpieza Mensual" o cualquier otra descripción ---
        doc.setFontSize(9); // Tamaño base para otras descripciones
        doc.text(description, defaultTextStartX, textBaselineY); // Alineado a la izquierda por defecto
      }

      // Restauramos el tamaño de fuente para el resto de las columnas (Cantidad, Precio u., Importe)
      doc.setFontSize(10); 
      doc.text(String(item.qty || 0), 130, textBaselineY, { align: "center" });
      doc.text(formatCurrency(item.unitPrice || 0), 155, textBaselineY, { align: "center" });
      doc.text(formatCurrency(item.totalHT), 185, textBaselineY, { align: "right" });
      
      subtotal += item.totalHT;
      itemsDrawn++;
    }
  }

  const dynamicHeight = itemsDrawn * contentLinesHeight;
  let totalsY = currentItemY + dynamicHeight + 5;

  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  // --- Totales alineados con columna Importe ---
  const rowHeightTotal = 7;
  const rowSpacing = 1;
  const totalLabels = ["Subtotal", "IVA 21%", "TOTAL"];
  const totalValues = [subtotal, iva, total];

  for (let i = 0; i < totalLabels.length; i++) {
    const y = totalsY + i * (rowHeightTotal + rowSpacing);

    // Label centrado vertical
    doc.setFillColor("#4970B6");
    doc.setDrawColor("#4970B6");
    doc.rect(120, y - 6, 40, rowHeightTotal, "FD");
    doc.setTextColor("white");
    doc.setFont("helvetica", "bold");
    doc.text(totalLabels[i], 140, y - 1, { align: 'center' });

    // Valores alineados a la derecha sobre el borde de "Importe"
    doc.setFillColor("white");
    doc.setDrawColor("#4970B6");
    doc.rect(160, y - 6, 30, rowHeightTotal, "FD");
    doc.setTextColor("black");

    if (i === 2) { // TOTAL
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12); // <--- tamaño más grande para TOTAL
    } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
    }

    doc.text(formatCurrency(totalValues[i]), 190, y - 1, { align: "right" });
  }

  totalsY += totalLabels.length * (rowHeightTotal + rowSpacing) + 10;

  // --- Datos de pago ---
  let paymentY = totalsY;
  doc.setTextColor("#4970B6");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("DATOS DE PAGO", 20, paymentY);

  paymentY += 10;
  doc.setFontSize(10);
  doc.setTextColor("black");
  doc.setFont("helvetica", "normal");
  doc.text("DNI: 50349726-N", 25, paymentY);
  paymentY += 5;
  doc.text("N/C: ROYS GREGORY ABREU REINOSO", 25, paymentY);
  paymentY += 5;
  doc.text("IBAN:ES69 1465 0340 53 1718233167", 25, paymentY);
  paymentY += 7;
  doc.addImage(phoneIcon, 'PNG', 25, paymentY - 3, 5, 5);
  doc.text("696169435", 32, paymentY);
  paymentY += 7;
  doc.addImage(emailIcon, 'PNG', 25, paymentY - 3, 5, 5);
  doc.text("roys.abreu@hotmail.es", 32, paymentY);
  paymentY += 7;
  doc.addImage(webIcon, 'PNG', 25, paymentY - 3, 5, 5);
  doc.text("www.royallclean.es", 32, paymentY);
  paymentY += 7;
  doc.addImage(locationIcon, 'PNG', 25, paymentY - 3, 5, 5);
  doc.text("Av. Segunda República, 17 1D, 28905 (Madrid)", 32, paymentY);

  return doc;
};



const downloadFactura = async(limpieza)=> {
      if (!limpieza) {
        console.error("No se proporcionaron datos de limpieza para descargar la factura.");
        return;
      }

      // Asegurarse de que tenemos el nombre completo del cliente si es necesario
      // O solo el 'cliente' que ya parece ser el nombre completo en tus tablas
      const clientName = limpieza.cliente.replace(/[^a-zA-Z0-9]/g, '_'); // Limpiar el nombre del cliente para el nombre de archivo
      const invoiceNumber = limpieza.factura;

      // Generar el nombre del archivo deseado
      const filename = `${invoiceNumber} - ${clientName}.pdf`;

      try {
        // Asumo que `limpieza` aquí ya tiene todos los datos necesarios pre-procesados
        // para `invoiceItems` y `clientDetails` o que `openInvoiceEditor` se encarga de esto.
        // Para esta función `downloadFactura` necesitarías una `limpieza.invoiceItems`
        // y `limpieza.clientDetails` ya preparados, o llamar a una función similar
        // a `openInvoiceEditor` para construirlos.
        // Por simplicidad, asumiré que los datos son pasados como en tu ejemplo original.
        const doc = await generateInvoicePdfContent({
          clienteId: limpieza.clienteId,
          factura: limpieza.factura,
          invoiceItems: limpieza.invoiceItems, // <-- ¡Importante! Asegúrate de que esto tenga los ítems finales
          clientDetails: limpieza.clientDetails // <-- ¡Importante! Asegúrate de que esto tenga los detalles del cliente
        });

        if (doc) {
          // Guardar el PDF con el nombre de archivo generado
          doc.save(filename);
        } else {
          console.error("La generación del PDF falló.");
        }
      } catch (error) {
        console.error("Error al descargar la factura:", error);
        alert("Ocurrió un error al descargar la factura.");
      }
    };

// --- Funciones para abrir y cerrar el editor de facturas ---
const openInvoiceEditor = async (limpieza) => {
  let clientDetails = null;
  if (!limpieza.clienteId) { alert("La limpieza no tiene un clientID asociado."); return; }
  try {
    clientDetails = await databaseStore.fetchClientById(limpieza.clienteId);
    if (!clientDetails) { alert("Client non trouvé pour la facture."); return; }
  } catch (error) {
    alert("Erreur lors de la récupération des detalles du client pour la facture.");
    return;
  }

  const invoiceItems = [];

  // AÑADIR LA LÍNEA PRINCIPAL DE "LIMPIEZA MENSUAL"
  // Calculamos el precio neto a partir del precioBruto almacenado en la limpieza
  // O usamos el basePriceNeto si está disponible
  const mainCleaningNetPrice = limpieza.basePriceNeto > 0
    ? limpieza.basePriceNeto
    : (limpieza.precioBruto ? parseFloat((limpieza.precioBruto / 1.21).toFixed(2)) : 0);

  if (mainCleaningNetPrice > 0) {
      let mainDescription = 'Limpieza de cristales'; // Descripción por defecto
      const weekDates = [];

      // --- INICIO DE LA MODIFICACIÓN ---
      // Verificamos si existen propiedades 'semanaX' en el objeto limpieza
      // para determinar si es una limpieza de cristales y recoger las fechas.
      let isWindowCleaning = false;
      // Iteramos hasta 4, que es el máximo de `semanaX` en tu modelo
      for (let i = 1; i <= 4; i++) { 
          const weekProperty = `semana${i}`;
          // Si la propiedad existe en 'limpieza' y tiene un valor (no null, no undefined, no vacío)
          if (limpieza[weekProperty]) { 
              isWindowCleaning = true;
              weekDates.push(formatEuropeanDate(limpieza[weekProperty]));
          }
      }

      if (isWindowCleaning) {
          mainDescription = 'Limpieza de cristales'; // Cambiamos la descripción base
          if (weekDates.length > 0) {
              // Añadimos las fechas formateadas entre paréntesis, separadas por coma
              mainDescription += ` (${weekDates.join(', ')})`; 
          }
      }
      // --- FIN DE LA MODIFICACIÓN ---

      invoiceItems.push({
          description: 'Limpieza Mensual',
          date: limpieza.fechaPrincipalLimpieza ? dayjs(limpieza.fechaPrincipalLimpieza).format('YYYY-MM-DD') : '',
          qty: 1,
          unitPrice: mainCleaningNetPrice, // Este es el precio NETO unitario para la línea
          totalHT: mainCleaningNetPrice, // Total Hors Taxe
          isOriginalCleaning: true
      });
  }

  // AÑADIR LAS LIMPIEZAS EXTRAS como antes
  if (limpieza.extraCleanings && limpieza.extraCleanings.length > 0) {
    limpieza.extraCleanings.forEach(extra => {
      if (extra.description && extra.unitPrice && extra.quantity > 0) {
        invoiceItems.push({
          description: extra.description,
          date: extra.date ? dayjs(extra.date).format('YYYY-MM-DD') : '',
          qty: extra.quantity,
          unitPrice: parseFloat(extra.unitPrice.toFixed(2)),
          totalHT: parseFloat((extra.quantity * extra.unitPrice).toFixed(2)),
          isOriginalCleaning: false
        });
      }
    });
  }

  // Preparar los datos para el modal de edición
  editableInvoiceData.value = {
    factura: limpieza.factura,
    clienteId: limpieza.clienteId,
    clientDetails: clientDetails,
    invoiceItems: invoiceItems,
    customItems: [],
    formaPago: limpieza.formaPago || 'Efectivo',
    fechaPago: limpieza.fechaPago ? dayjs(limpieza.fechaPago).format('YYYY-MM-DD') : '',
  };

  isInvoiceEditorModalOpen.value = true;
};


const handleGenerateEditedPdf = async (finalInvoiceData) => {
    const doc = await generateInvoicePdfContent(finalInvoiceData);
    if (doc) {
        // Asegúrate de que clientDetails.nombre existe antes de usarlo
        const clientNameForFilename = finalInvoiceData.clientDetails.nombre ? finalInvoiceData.clientDetails.nombre.replace(/[^a-zA-Z0-9-]/g, '_') : 'cliente_desconocido';
        doc.save(`facture_${finalInvoiceData.factura}_${clientNameForFilename}.pdf`);
    }
};

const handlePreviewEditedPdf = async (finalInvoiceData) => {
    const doc = await generateInvoicePdfContent(finalInvoiceData);
    if (doc) {
        pdfPreviewUrl.value = doc.output('datauristring');
        isPreviewModalOpen.value = true; // Abre tu modal de vista previa estándar
    }
};

const closeInvoiceEditor = () => {
    isInvoiceEditorModalOpen.value = false;
    editableInvoiceData.value = null; // Limpiar datos al cerrar
};


/**
 * Genera un PDF resumen de todas las limpiezas en la tabla.
 */
const drawTableHeader = (doc, headers, columnWidths, startX, currentY, rowHeight) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setFillColor(195, 228, 156);
  doc.rect(startX, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight, "F");

  let currentX = startX;
  headers.forEach((header, index) => {
    const columnCenter = currentX + (columnWidths[index] / 2);
    doc.text(header, columnCenter, currentY + rowHeight / 2, { align: 'center', baseline: 'middle' });
    currentX += columnWidths[index];
  });
  return currentY + rowHeight;
};

const handleGeneratePdf = async () => {
  isGeneratingPdf.value = true;
  try {
    if (!databaseStore.limpiezas || databaseStore.limpiezas.length === 0) {
      alert("No se encontraron registros de limpieza para generar el PDF de resumen.");
      isGeneratingPdf.value = false;
      return;
    }

    // dayjs.locale('fr'); // Ya está configurado globalmente al inicio del script

    const doc = new jsPDF('l');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const topMargin = 25;
    const bottomMargin = 20;
    const leftMargin = 15;
    const rightMargin = 15;
    const usableWidth = pageWidth - leftMargin - rightMargin;

    // Usa el locale configurado globalmente para dayjs, que aquí es 'fr'
    const currentMonthYear = dayjs().format('MMMM YYYY').toUpperCase();
    const titleText = `RESUMEN LIMPIEZAS ${currentMonthYear}`;

    doc.setFontSize(18);
    doc.text(titleText, pageWidth / 2, topMargin - 10, { align: 'center' });
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Actualizar encabezados: eliminar "Sem.1", "Sem.2", "Sem.3", "Sem.4", "Sem.5"
    // y reemplazarlos con un solo "Fecha Limpieza Principal" o similar, si se quiere.
    // Si no, simplemente eliminar las columnas semanales.
    const headers = [
      "Facture N°", "Client", "Fec. Prin.", // Nuevo encabezado
      "Brut (€)", "Net (€)", "Cot. (€)", "Date Paiement", "Statut", "Mode Paiement"
    ];

    let totalBrutoPagado = 0;
    let totalNetoPagado = 0;
    let totalCotizacionPagado = 0;

    let totalBrutoPendiente = 0;
    let totalNetoPendiente = 0;
    let totalCotizacionPendiente = 0;

    const currentMonthYearFormatted = dayjs().format('YYYY-MM');

    // ELIMINAR getWeekCellContent, ya no es necesario
    // const getWeekCellContent = (date, type) => { /* ... */ };


    // ELIMINAR getShortWeekType, ya no es necesario


    const data = databaseStore.limpiezas.map(limpieza => {
      if (limpieza.fechaPago) {
        totalBrutoPagado += (limpieza.precioBruto || 0);
        totalNetoPagado += calculatePrecioNeto(limpieza.precioBruto || 0);
        totalCotizacionPagado += calculateCotizacion(limpieza.precioBruto || 0);
      } else {
        totalBrutoPendiente += (limpieza.precioBruto || 0);
        totalNetoPendiente += calculatePrecioNeto(limpieza.precioBruto || 0);
        totalCotizacionPendiente += calculateCotizacion(limpieza.precioBruto || 0);
      }

      let needsOrangeHighlight = false;
      if (limpieza.fechaPago && limpieza.fechaPrincipalLimpieza) {
        const pagoMonthYear = dayjs(limpieza.fechaPago).format('YYYY-MM');
        const limpiezaMonthYear = dayjs(limpieza.fechaPrincipalLimpieza).format('YYYY-MM');
        if (pagoMonthYear === currentMonthYearFormatted && limpiezaMonthYear !== currentMonthYearFormatted) {
          needsOrangeHighlight = true;
        }
      }

      return {
        rowContent: [
          String(limpieza.factura || ''),
          String(limpieza.cliente || ''),
          String(limpieza.fechaPrincipalLimpieza ? formatEuropeanDate(limpieza.fechaPrincipalLimpieza) : ''), // Nuevo campo
          String(formatCurrency(limpieza.precioBruto)),
          String(formatCurrency(calculatePrecioNeto(limpieza.precioBruto))),
          String(formatCurrency(calculateCotizacion(limpieza.precioBruto))),
          String(limpieza.fechaPago ? formatEuropeanDate(limpieza.fechaPago) : 'En attente'),
          String(limpieza.fechaPago ? 'Payé' : 'En attente'),
          String(limpieza.formaPago || '')
        ],
        isPending: !limpieza.fechaPago,
        isOrangeHighlight: needsOrangeHighlight
      };
    });

    doc.setFontSize(8);
    const cellPadding = 2;
    const rowHeight = 10;
    const minColWidth = 15;

    const maxContentWidths = Array(headers.length).fill(0);

    doc.setFont("helvetica", "bold");
    headers.forEach((header, index) => {
      maxContentWidths[index] = Math.max(maxContentWidths[index], doc.getTextWidth(header));
    });

    doc.setFont("helvetica", "normal");
    data.forEach(item => {
      item.rowContent.forEach((cell, colIndex) => {
        // La lógica para `Array.isArray(cell)` ya no es necesaria aquí, porque solo tendrás strings
        const cellText = String(cell);
        maxContentWidths[colIndex] = Math.max(maxContentWidths[colIndex], doc.getTextWidth(cellText));
      });
    });

    const columnWidths = maxContentWidths.map(width => Math.max(minColWidth, width + (2 * cellPadding)));

    const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
    const startX = leftMargin + (usableWidth - tableWidth) / 2;

    let currentY = topMargin + 10;

    currentY = drawTableHeader(doc, headers, columnWidths, startX, currentY, rowHeight);

    const summaryBlockHeight = 30;
    const spaceNeededForTotals = bottomMargin + summaryBlockHeight;

    data.forEach((item, rowIndex) => {
      if (currentY + rowHeight + (rowIndex === data.length - 1 ? spaceNeededForTotals : 0) > pageHeight - bottomMargin) {
        doc.addPage();
        currentY = topMargin;
        currentY = drawTableHeader(doc, headers, columnWidths, startX, currentY, rowHeight);
      }

      let currentX = startX;

      if (item.isOrangeHighlight) {
        doc.setFillColor(255, 230, 204);
      } else if (item.isPending) {
        doc.setFillColor(255, 221, 221);
      } else if (rowIndex % 2 === 0) {
        doc.setFillColor(240, 240, 240);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      doc.rect(startX, currentY, tableWidth, rowHeight, "F");

      item.rowContent.forEach((cell, colIndex) => {
        // Eliminar la lógica condicional para Array.isArray(cell)
        const cellText = String(cell);
        doc.text(cellText, currentX + cellPadding, currentY + rowHeight / 2, { baseline: 'middle' });
        currentX += columnWidths[colIndex];
      });

      currentY += rowHeight;
    });

    if (currentY + summaryBlockHeight > pageHeight - bottomMargin) {
      doc.addPage();
      currentY = topMargin;
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);

    let summaryY = currentY + 10;
    let currentSummaryX = startX;

    doc.text(`Payé:  Brut `, currentSummaryX, summaryY);
    currentSummaryX += doc.getTextWidth(`Payé:  Brut `);

    doc.text(`${formatCurrency(totalBrutoPagado)}`, currentSummaryX, summaryY);
    currentSummaryX += doc.getTextWidth(`${formatCurrency(totalBrutoPagado)}`);

    doc.text(` |  Net `, currentSummaryX, summaryY);
    currentSummaryX += doc.getTextWidth(` |  Net `);

    doc.setFont("helvetica", "bold");
    doc.text(`${formatCurrency(totalNetoPagado)}`, currentSummaryX, summaryY);
    currentSummaryX += doc.getTextWidth(`${formatCurrency(totalNetoPagado)}`);

    doc.setFont("helvetica", "normal");
    doc.text(` |  Cotisation `, currentSummaryX, summaryY);
    currentSummaryX += doc.getTextWidth(` |  Cotisation `);

    doc.text(`${formatCurrency(totalCotizacionPagado)}`, currentSummaryX, summaryY);

    summaryY += 10;
    currentSummaryX = startX;

    doc.text(`En attente: Brut `, currentSummaryX, summaryY);
    currentSummaryX += doc.getTextWidth(`En attente: Brut `);

    doc.text(`${formatCurrency(totalBrutoPendiente)}`, currentSummaryX, summaryY);
    currentSummaryX += doc.getTextWidth(`${formatCurrency(totalBrutoPendiente)}`);

    doc.text(` | Net `, currentSummaryX, summaryY);
    currentSummaryX += doc.getTextWidth(` | Net `);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 0, 0);
    doc.text(`${formatCurrency(totalNetoPendiente)}`, currentSummaryX, summaryY);
    currentSummaryX += doc.getTextWidth(`${formatCurrency(totalNetoPendiente)}`);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(` | Cotisation `, currentSummaryX, summaryY);
    currentSummaryX += doc.getTextWidth(` |  Cotisation `);

    doc.text(`${formatCurrency(totalCotizacionPendiente)}`, currentSummaryX, summaryY);


    const nowPdf = dayjs();
    const pdfCreationDateTime = nowPdf.format('DD/MM/YYYY HH:mm:ss');
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} / ${pageCount}`, pageWidth / 2, pageHeight - bottomMargin / 2, { align: 'center' });
      doc.text(`${pdfCreationDateTime}`, pageWidth - rightMargin, pageHeight - bottomMargin / 2, { align: 'right' });
    }

    doc.save(`résumé_nettoyages_${dayjs().format('DD-MM-YYYY')}.pdf`);
  } catch (error) {
    console.error("Erreur lors de la génération du PDF de résumé :", error);
    alert("Une erreur est survenue lors de la generación du PDF de résumé. Veuillez réessayer.");
  } finally {
    isGeneratingPdf.value = false;
  }
};


const handleSaveCustomItems = async (limpiezaId, customItems) => {
  try {
    // Aquí puedes implementar la lógica para guardar los customItems en la base de datos
    // para la limpieza específica (limpiezaId).
    // Esto podría implicar una nueva función en tu useDatabaseStore.
    console.log(`Guardando ítems personalizados para la limpieza ${limpiezaId}:`, customItems);
    // Ejemplo: await databaseStore.updateLimpiezaCustomItems(limpiezaId, customItems);
    // Si la actualización es exitosa, podrías cerrar el modal o dar un feedback.
    alert('Ítems personalizados guardados con éxito (funcionalidad de guardado aún en desarrollo).');
  } catch (error) {
    console.error("Error al guardar ítems personalizados:", error);
    alert("Error al guardar ítems personalizados.");
  }
};


// --- LIFECYCLE HOOKS ---

onMounted(async () => {
  const currentMonth = now.getMonth().toString();
  const currentYear = now.getFullYear().toString();

  selectedMonth.value = currentMonth;
  selectedYear.value = currentYear;

  await databaseStore.fetchLimpiezas(currentMonth, currentYear);
  await databaseStore.fetchClientes();
  await databaseStore.fetchNextFacturaFormattedNumber();
});
</script>


<style scoped>
/*
  =====================================
  Estilos Específicos del Componente
  RegistroMensualDeLimpiezas.vue
  =====================================
*/

/* --- Colores de Botones Personalizados (para Exterior/Interior) --- */
.btn-sm.btn-success {
  background-color: #28a745;
  /* Color verde */
  border-color: #28a745;
  color: white;
}

.btn-sm.btn-danger {
  background-color: #dc3545;
  /* Color rojo */
  border-color: #dc3545;
  color: white;
}

/* --- Estilos Generales de Tabla --- */
.table-responsive {
  overflow-x: auto;
  /* Permite el scroll horizontal si la tabla es muy ancha */
}

.table {
  width: 100%;
  /* Asegura que la tabla ocupe todo el ancho disponible */
  border-collapse: collapse;
  /* Para un borde más limpio entre celdas */
}

/* --- Solución para el Número de Factura no Cortado --- */
/* Apunta a la primera columna (Factura #) en th y td */
.table th:nth-child(1),
.table td:nth-child(1) {
  min-width: 100px;
  /* Un ancho mínimo para asegurar espacio, ajusta si es necesario */
  white-space: nowrap;
  /* Evita que el texto de la factura se rompa en múltiples líneas */
  word-break: keep-all;
  /* Mantiene la palabra completa si no cabe */
}

/* --- Solución para Centrado Vertical General en Todas las Celdas (Texto y Contenido Simple) --- */
.table th,
.table td {
  vertical-align: middle;
  /* Alinea verticalmente al medio */
}

/* --- Centrado Vertical para Iconos de Acciones (Contenedores Flex) --- */
/* Este selector apunta específicamente a la celda que contiene los botones de acción.
   Asegura que el contenido (los botones) se centre verticalmente dentro de la celda,
   que es un contenedor flex debido a las clases de Bootstrap como 'd-flex'. */
.table tbody tr td.d-flex {
  /* Apunta a cualquier td que tenga la clase d-flex */
  align-items: center;
  /* Centra los elementos flex directos (tus botones) */
  /* Los justify-content y gap-2 de Bootstrap ya deberían funcionar si los tienes en el HTML.
     Si no, podrías forzarlos aquí:
     justify-content: space-around;
     gap: 0.5rem;
  */
}

/* --- Estilos para Resaltar Filas con Discrepancia de Pago --- */
/* Se utiliza .bg-danger-subtle de Bootstrap, pero se asegura su aplicación */
.bg-danger-subtle {
  background-color: #f8d7da !important;
  /* Asegura el color de fondo suave de Bootstrap para peligro/advertencia */
}

.table-striped tbody tr.bg-danger-subtle>td {
  background-color: #f8d7da !important;
  /* Asegura el fondo para las celdas individuales en filas stripe */
}


/* --- Otros Estilos de la Tabla --- */
/* Estilo para filas impares */
.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Estilo para el hover de las filas */
.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.075);
}

/* Ajuste para el spinner de carga en los botones */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: .15em;
}

/*
  =====================================
  Estilos para Modales (Generales o si Bootstrap JS no se usa)
  =====================================
  Nota: Si usas el JavaScript de Bootstrap para los modales, muchas de estas reglas
  pueden ser redundantes o podrían ser manejadas mejor por las clases de Bootstrap.
  Se incluyen aquí tal como las proporcionaste para consolidar.
*/
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Bootstrap ya genera el fondo semitransparente con .modal-backdrop */
  /* display: flex; /* Esto ya lo maneja Bootstrap con la clase 'show' */
  justify-content: center;
  align-items: center;
  z-index: 1050; /* ¡CAMBIO CLAVE AQUÍ! El modal debe tener un z-index más alto */
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040; /* ¡CAMBIO CLAVE AQUÍ! El fondo debe tener un z-index más bajo */
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: .5;
  /* Asegura la opacidad del fondo */
}
.pdf-preview-modal {
  z-index: 1060; /* ¡Más alto que cualquier otro modal base (1050)! */
}

.pdf-preview-backdrop {
  z-index: 1055; /* ¡Más alto que el modal base (1050), pero menor que el pdf-preview-modal (1060)! */
}
/* Las transiciones 'fade' y 'show' son manejadas por Bootstrap */
/* .modal-backdrop.fade { opacity: 0; } */
/* .modal-backdrop.show { opacity: .5; } */


/* El modal-content y modal-dialog son manejados por las clases de Bootstrap */
/* Si necesitas personalización, podrías añadir reglas aquí */
</style>
