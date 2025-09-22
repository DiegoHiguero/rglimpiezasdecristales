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
              <div class="col-md-2">
                <label for="semana1" class="form-label">Semana 1 </label>
                <input type="date" class="form-control mb-2" id="semana1" v-model="nuevaLimpieza.semana1">
                <label for="semana1precio" class="form-label">Precio (€)</label>
                <input type="number" step="0.01" class="form-control" id="semana1precio"
                  v-model.number="nuevaLimpieza.semana1precio">
                <div class="d-flex gap-2 mt-1">
                  <button type="button" class="btn btn-sm"
                    :class="[nuevaLimpieza.semana1Exterior ? 'btn-success' : 'btn-danger']"
                    @click="toggleSemanaType('semana1', 'exterior', nuevaLimpieza)">
                    Exterior
                  </button>
                  <button type="button" class="btn btn-sm"
                    :class="[nuevaLimpieza.semana1Interior ? 'btn-success' : 'btn-danger']"
                    @click="toggleSemanaType('semana1', 'interior', nuevaLimpieza)">
                    Interior
                  </button>
                </div>
              </div>
              <div class="col-md-2">
                <label for="semana2" class="form-label">Semana 2 </label>
                <input type="date" class="form-control mb-2" id="semana2" v-model="nuevaLimpieza.semana2">
                <label for="semana2precio" class="form-label">Precio (€)</label>
                <input type="number" step="0.01" class="form-control" id="semana2precio"
                  v-model.number="nuevaLimpieza.semana2precio">
                <div class="d-flex gap-2 mt-1">
                  <button type="button" class="btn btn-sm"
                    :class="[nuevaLimpieza.semana2Exterior ? 'btn-success' : 'btn-danger']"
                    @click="toggleSemanaType('semana2', 'exterior', nuevaLimpieza)">
                    Exterior
                  </button>
                  <button type="button" class="btn btn-sm"
                    :class="[nuevaLimpieza.semana2Interior ? 'btn-success' : 'btn-danger']"
                    @click="toggleSemanaType('semana2', 'interior', nuevaLimpieza)">
                    Interior
                  </button>
                </div>
              </div>
              <div class="col-md-2">
                <label for="semana3" class="form-label">Semana 3 </label>
                <input type="date" class="form-control mb-2" id="semana3" v-model="nuevaLimpieza.semana3">
                <label for="semana3precio" class="form-label">Precio (€)</label>
                <input type="number" step="0.01" class="form-control" id="semana3precio"
                  v-model.number="nuevaLimpieza.semana3precio">
                <div class="d-flex gap-2 mt-1">
                  <button type="button" class="btn btn-sm"
                    :class="[nuevaLimpieza.semana3Exterior ? 'btn-success' : 'btn-danger']"
                    @click="toggleSemanaType('semana3', 'exterior', nuevaLimpieza)">
                    Exterior
                  </button>
                  <button type="button" class="btn btn-sm"
                    :class="[nuevaLimpieza.semana3Interior ? 'btn-success' : 'btn-danger']"
                    @click="toggleSemanaType('semana3', 'interior', nuevaLimpieza)">
                    Interior
                  </button>
                </div>
              </div>
              <div class="col-md-2">
                <label for="semana4" class="form-label">Semana 4 </label>
                <input type="date" class="form-control mb-2" id="semana4" v-model="nuevaLimpieza.semana4">
                <label for="semana4precio" class="form-label">Precio (€)</label>
                <input type="number" step="0.01" class="form-control" id="semana4precio"
                  v-model.number="nuevaLimpieza.semana4precio">
                <div class="d-flex gap-2 mt-1">
                  <button type="button" class="btn btn-sm"
                    :class="[nuevaLimpieza.semana4Exterior ? 'btn-success' : 'btn-danger']"
                    @click="toggleSemanaType('semana4', 'exterior', nuevaLimpieza)">
                    Exterior
                  </button>
                  <button type="button" class="btn btn-sm"
                    :class="[nuevaLimpieza.semana4Interior ? 'btn-success' : 'btn-danger']"
                    @click="toggleSemanaType('semana4', 'interior', nuevaLimpieza)">
                    Interior
                  </button>
                </div>
              </div>
              <div class="col-md-2">
                <label for="semana5" class="form-label">Semana 5 </label>
                <input type="date" class="form-control mb-2" id="semana5" v-model="nuevaLimpieza.semana5">
                <label for="semana5precio" class="form-label">Precio (€)</label>
                <input type="number" step="0.01" class="form-control" id="semana5precio"
                  v-model.number="nuevaLimpieza.semana5precio">
                <div class="d-flex gap-2 mt-1">
                  <button type="button" class="btn btn-sm"
                    :class="[nuevaLimpieza.semana5Exterior ? 'btn-success' : 'btn-danger']"
                    @click="toggleSemanaType('semana5', 'exterior', nuevaLimpieza)">
                    Exterior
                  </button>
                  <button type="button" class="btn btn-sm"
                    :class="[nuevaLimpieza.semana5Interior ? 'btn-success' : 'btn-danger']"
                    @click="toggleSemanaType('semana5', 'interior', nuevaLimpieza)">
                    Interior
                  </button>
                </div>
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
                <th>IVA</th>
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
                  <span
                    :class="{ 'badge bg-success': limpieza.fechaPago, 'badge bg-warning text-dark': !limpieza.fechaPago }">
                    {{ limpieza.fechaPago ? 'Pagao' : 'Pendiente' }}
                  </span>
                </td>
                <td>{{ limpieza.formaPago }}</td>
                <td class="d-flex justify-content-around align-items-center gap-2">
                  <button @click="openEditModal(limpieza)"
                    class="btn btn-sm btn-secondary d-flex justify-content-center align-items-center"
                    title="Éditer le registre">
                    <font-awesome-icon :icon="['fas', 'file-pen']" />
                  </button>
                  <button @click="confirmDelete(limpieza)"
                    class="btn btn-sm btn-warning d-flex justify-content-center align-items-center"
                    title="Supprimer le registre">
                    <font-awesome-icon :icon="['fas', 'trash-can']" />
                  </button>
                  <!-- INICIO: CAMBIO DE BOTONES DE FACTURA -->
                  <button @click="openInvoiceEditor(limpieza)"
                    class="btn btn-sm btn-primary d-flex justify-content-center align-items-center"
                    title="Éditer et générer la facture">
                    <font-awesome-icon :icon="['fas', 'file-invoice']" />
                  </button>
                  <!-- FIN: CAMBIO DE BOTONES DE FACTURA -->
                </td>
              </tr>
            </tbody>
            <tfoot>
              <!-- Fila para la cantidad de clientes y el total PAGADO -->
              <tr>
                <td class="text-start"><strong>CLIENTES: {{ uniqueClientsInDisplay }}</strong></td>
                <td colspan="6" class="text-end"><strong>TOTAL PAGADO</strong></td>
                <td>{{ formatCurrency(totalPagado) }}</td>
                <td>
                  <h4><strong>{{ formatCurrency(totalNetoPagado) }}</strong></h4>
                </td>
                <td>{{ formatCurrency(totalCotizacionPagado) }}</td>
                <td colspan="4"></td>
              </tr>
              <!-- Fila para el total PENDIENTE del filtro actual -->
              <tr>
                <td colspan="7" class="text-end">
                  <span><strong>TOTAL PENDIENTE</strong></span>
                </td>
                <td>
                  <span>{{ formatCurrency(totalPendiente) }}</span>
                </td>
                <td>
                  <span class="text-danger">
                    <h4><strong>{{ formatCurrency(totalPendienteNeto) }}</strong></h4>
                  </span>
                </td>
                <td>
                  <span>{{ formatCurrency(totalPendienteCotizacion) }}</span>
                </td>
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
                <!-- ... (el resto de tus campos de semana, precio bruto, forma de pago, fecha de pago) ... -->
                <div class="col-md-6">
                  <label for="edit-semana1" class="form-label">Semana 1 </label>
                  <input type="date" class="form-control mb-2" id="edit-semana1" v-model="editedLimpieza.semana1">
                  <label for="edit-semana1precio" class="form-label">Precio (€)</label>
                  <input type="number" step="0.01" class="form-control" id="edit-semana1precio"
                    v-model.number="editedLimpieza.semana1precio">
                  <div class="d-flex gap-2 mt-1">
                    <button type="button" class="btn btn-sm"
                      :class="[editedLimpieza.semana1Exterior ? 'btn-success' : 'btn-danger']"
                      @click="toggleSemanaType('semana1', 'exterior', editedLimpieza)">
                      Exterior
                    </button>
                    <button type="button" class="btn btn-sm"
                      :class="[editedLimpieza.semana1Interior ? 'btn-success' : 'btn-danger']"
                      @click="toggleSemanaType('semana1', 'interior', editedLimpieza)">
                      Interior
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="edit-semana2" class="form-label">Semana 2 </label>
                  <input type="date" class="form-control mb-2" id="edit-semana2" v-model="editedLimpieza.semana2">
                  <label for="edit-semana2precio" class="form-label">Precio (€)</label>
                  <input type="number" step="0.01" class="form-control" id="edit-semana2precio"
                    v-model.number="editedLimpieza.semana2precio">
                  <div class="d-flex gap-2 mt-1">
                    <button type="button" class="btn btn-sm"
                      :class="[editedLimpieza.semana2Exterior ? 'btn-success' : 'btn-danger']"
                      @click="toggleSemanaType('semana2', 'exterior', editedLimpieza)">
                      Exterior
                    </button>
                    <button type="button" class="btn btn-sm"
                      :class="[editedLimpieza.semana2Interior ? 'btn-success' : 'btn-danger']"
                      @click="toggleSemanaType('semana2', 'interior', editedLimpieza)">
                      Interior
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="edit-semana3" class="form-label">Semana 3 </label>
                  <input type="date" class="form-control mb-2" id="edit-semana3" v-model="editedLimpieza.semana3">
                  <label for="edit-semana3precio" class="form-label">Precio (€)</label>
                  <input type="number" step="0.01" class="form-control" id="edit-semana3precio"
                    v-model.number="editedLimpieza.semana3precio">
                  <div class="d-flex gap-2 mt-1">
                    <button type="button" class="btn btn-sm"
                      :class="[editedLimpieza.semana3Exterior ? 'btn-success' : 'btn-danger']"
                      @click="toggleSemanaType('semana3', 'exterior', editedLimpieza)">
                      Exterior
                    </button>
                    <button type="button" class="btn btn-sm"
                      :class="[editedLimpieza.semana3Interior ? 'btn-success' : 'btn-danger']"
                      @click="toggleSemanaType('semana3', 'interior', editedLimpieza)">
                      Interior
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="edit-semana4" class="form-label">Semana 4 </label>
                  <input type="date" class="form-control mb-2" id="edit-semana4" v-model="editedLimpieza.semana4">
                  <label for="edit-semana4precio" class="form-label">Precio (€)</label>
                  <input type="number" step="0.01" class="form-control" id="edit-semana4precio"
                    v-model.number="editedLimpieza.semana4precio">
                  <div class="d-flex gap-2 mt-1">
                    <button type="button" class="btn btn-sm"
                      :class="[editedLimpieza.semana4Exterior ? 'btn-success' : 'btn-danger']"
                      @click="toggleSemanaType('semana4', 'exterior', editedLimpieza)">
                      Exterior
                    </button>
                    <button type="button" class="btn btn-sm"
                      :class="[editedLimpieza.semana4Interior ? 'btn-success' : 'btn-danger']"
                      @click="toggleSemanaType('semana4', 'interior', editedLimpieza)">
                      Interior
                    </button>
                  </div>
                </div>

                <div class="col-md-6">
                  <label for="edit-semana5" class="form-label">Semana 5 </label>
                  <input type="date" class="form-control mb-2" id="edit-semana5" v-model="editedLimpieza.semana5">
                  <label for="edit-semana5precio" class="form-label">Precio (€)</label>
                  <input type="number" step="0.01" class="form-control" id="edit-semana5precio"
                    v-model.number="editedLimpieza.semana5precio">
                  <div class="d-flex gap-2 mt-1">
                    <button type="button" class="btn btn-sm"
                      :class="[editedLimpieza.semana5Exterior ? 'btn-success' : 'btn-danger']"
                      @click="toggleSemanaType('semana5', 'exterior', editedLimpieza)">
                      Exterior
                    </button>
                    <button type="button" class="btn btn-sm"
                      :class="[editedLimpieza.semana5Interior ? 'btn-success' : 'btn-danger']"
                      @click="toggleSemanaType('semana5', 'interior', editedLimpieza)">
                      Interior
                    </button>
                  </div>
                </div>
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
                <div class="col-md-6">
                  <label for="new-client-precio-exterior" class="form-label">Precio por Limpieza Exterior</label>
                  <input type="number" class="form-control" id="new-client-precio-exterior"
                    v-model.number="newClient.precioExterior" step="0.01" min="0">
                </div>
                <div class="col-md-6">
                  <label for="new-client-precio-interior" class="form-label">Precio por Limpieza Interior</label>
                  <input type="number" class="form-control" id="new-client-precio-interior"
                    v-model.number="newClient.precioInterior" step="0.01" min="0">
                </div>
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

// --- ESTADOS LOCALES Y REFERENCES ---
const databaseStore = useDatabaseStore();
const isGeneratingPdf = ref(false); // Estado para el spinner del PDF resumen
const manualFacturaInput = ref('');

// --- NUEVOS ESTADOS PARA EL EDITOR DE FACTURAS ---
const isInvoiceEditorModalOpen = ref(false); // Controla la visibilidad del modal del editor de facturas
const editableInvoiceData = ref(null); // Contendrá los datos de la factura que se pasarán al editor
// --- FIN NUEVOS ESTADOS ---


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
  semana1: '', semana1Exterior: false, semana1Interior: false, semana1precio: null,
  semana2: '', semana2Exterior: false, semana2Interior: false, semana2precio: null,
  semana3: '', semana3Exterior: false, semana3Interior: false, semana3precio: null,
  semana4: '', semana4Exterior: false, semana4Interior: false, semana4precio: null,
  semana5: '', semana5Exterior: false, semana5Interior: false, semana5precio: null,
  extraCleanings: [{ description: '', date: '', quantity: 1, unitPrice: 0 }],
  formaPago: 'Efectivo',
  fechaPago: null,
});

const editedLimpieza = ref({
  id: null, factura: null, cliente: '', clienteId: null,
  semana1: '', semana1Exterior: false, semana1Interior: false, semana1precio: null,
  semana2: '', semana2Exterior: false, semana2Interior: false, semana2precio: null,
  semana3: '', semana3Exterior: false, semana3Interior: false, semana3precio: null,
  semana4: '', semana4Exterior: false, semana4Interior: false, semana4precio: null,
  semana5: '', semana5Exterior: false, semana5Interior: false, semana5precio: null,
  extraCleanings: [], // Inicializar como array vacío para edición
  formaPago: 'Efectivo', fechaPago: null, precioBruto: null,
});

const newClient = ref({
  nombre: '', apellido: '', direccion: '',direccionComplementaria:'', ciudad: '', provincia: '', codigoPostal: '',
  direccionIntervencion: { calle: '',complementaria:'', ciudad: '', provincia: '', codigoPostal: '' },
  telefono: '', email: '', precioExterior: 0.00, precioInterior: 0.00, tipoCliente: ''
});

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

// Calculado para el formulario de NUEVA limpieza
const calculatedPrecioBrutoNueva = computed(() => {
  return (calculatePrecioBruto(nuevaLimpieza.value, selectedClientForNueva.value) + calculatedExtraCleaningsTotalNueva.value);
});

// Calculado para el formulario de EDICION
const calculatedPrecioBrutoEdited = computed(() => {
  return (calculatePrecioBruto(editedLimpieza.value, selectedClientForEdited.value) + calculatedExtraCleaningsTotalEdited.value);
});


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
  for (let i = 1; i <= 5; i++) {
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
 * Construye la cadena de tipo de limpieza (exterior, interior, ambas, null)
 */
const getLimpiezaTypeString = (isExterior, isInterior) => {
  if (isExterior && isInterior) return 'ambas';
  if (isExterior) return 'exterior';
  if (isInterior) return 'interior';
  return null;
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
  return date.format('DD/MM/YYYY');
};

/**
 * Calcula la cotización (21% del precio bruto).
 */
const calculateCotizacion = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) return 0;
  return parseFloat((brute * 0.21).toFixed(2));
};

/**
 * Calcula el precio neto (precio bruto - cotización).
 */
const calculatePrecioNeto = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) return 0;
  const cotizacion = calculateCotizacion(brute);
  return parseFloat((brute - cotizacion).toFixed(2));
};

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
 * Alterna el estado de los botones Exterior/Interior y actualiza la fecha de la semana.
 */
const toggleSemanaType = (semanaKey, tipo, targetObject) => {
  const exteriorKey = `${semanaKey}Exterior`;
  const interiorKey = `${semanaKey}Interior`;
  const semanaPrecioKey = `${semanaKey}precio`;

  if (!targetObject || typeof targetObject !== 'object') {
    console.error(`ERROR: targetObject no es un objeto válido. Recibido: ${targetObject}`);
    return;
  }

  if (tipo === 'exterior') {
    if (Object.prototype.hasOwnProperty.call(targetObject, exteriorKey)) {
      targetObject[exteriorKey] = !targetObject[exteriorKey];
    } else { console.warn(`Advertencia: La propiedad '${exteriorKey}' no existe.`); return; }
  } else if (tipo === 'interior') {
    if (Object.prototype.hasOwnProperty.call(targetObject, interiorKey)) {
      targetObject[interiorKey] = !targetObject[interiorKey];
    } else { console.warn(`Advertencia: La propiedad '${interiorKey}' no existe.`); return; }
  }

  const currentExterior = targetObject[exteriorKey];
  const currentInterior = targetObject[interiorKey];

  if (!currentExterior && !currentInterior) {
    targetObject[semanaKey] = '';
  } else if (!targetObject[semanaKey]) {
    targetObject[semanaKey] = dayjs().format('YYYY-MM-DD');
  }

  const clientData = (targetObject === nuevaLimpieza.value) ? selectedClientForNueva.value : selectedClientForEdited.value;

  if (clientData) {
    let newCalculatedWeeklyPrice = 0;
    if (currentExterior) {
      newCalculatedWeeklyPrice += (clientData.precioExterior || 0);
    }
    if (currentInterior) {
      newCalculatedWeeklyPrice += (clientData.precioInterior || 0);
    }

    if (currentExterior || currentInterior) {
      targetObject[semanaPrecioKey] = parseFloat(newCalculatedWeeklyPrice.toFixed(2));
    } else {
      targetObject[semanaPrecioKey] = null;
    }
  } else {
    console.warn("No hay datos de cliente disponibles para auto-llenar el precio semanal.");
    if (!currentExterior && !currentInterior) {
      targetObject[semanaPrecioKey] = null;
    }
  }
};


/**
 * Abre el modal de edición y carga los datos de la limpieza.
 */
const openEditModal = (limpieza) => {
  editingLimpiezaId.value = limpieza.id;
  const tempEditedLimpieza = {
    ...limpieza,
    semana1: limpieza.semana1 || '', semana2: limpieza.semana2 || '', semana3: limpieza.semana3 || '',
    semana4: limpieza.semana4 || '', semana5: limpieza.semana5 || '',
    semana1precio: limpieza.semana1precio ?? null,
    semana2precio: limpieza.semana2precio ?? null,
    semana3precio: limpieza.semana3precio ?? null,
    semana4precio: limpieza.semana4precio ?? null,
    semana5precio: limpieza.semana5precio ?? null,
    precioBruto: limpieza.precioBruto ?? null,
    fechaPago: limpieza.fechaPago || null,
    formaPago: limpieza.formaPago || 'Efectivo',
    clienteId: limpieza.clienteId || null,
    // Asegúrate de que extraCleanings también se copie para edición
    extraCleanings: limpieza.extraCleanings ? JSON.parse(JSON.stringify(limpieza.extraCleanings)) : [{ description: '', date: '', quantity: 1, unitPrice: 0 }], // Añade una línea vacía si no hay extras
  };

  for (let i = 1; i <= 5; i++) {
    const tipo = tempEditedLimpieza[`semana${i}Tipo`];
    tempEditedLimpieza[`semana${i}Exterior`] = tipo === 'exterior' || tipo === 'ambas';
    tempEditedLimpieza[`semana${i}Interior`] = tipo === 'interior' || tipo === 'ambas';
  }
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
    semana1: '', semana1Exterior: false, semana1Interior: false, semana1precio: null,
    semana2: '', semana2Exterior: false, semana2Interior: false, semana2precio: null,
    semana3: '', semana3Exterior: false, semana3Interior: false, semana3precio: null,
    semana4: '', semana4Exterior: false, semana4Interior: false, semana4precio: null,
    semana5: '', semana5Exterior: false, semana5Interior: false, semana5precio: null,
    extraCleanings: [], // Reset extraCleanings a array vacío
    formaPago: 'Efectivo', fechaPago: null, precioBruto: null, tipoCliente: '',
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
    telefono: '', email: '', precioExterior: 0.00, precioInterior: 0.00,
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

  let algunaSemanaCompleta = false;
  for (let i = 1; i <= 5; i++) {
    if (nuevaLimpieza.value[`semana${i}`] || nuevaLimpieza.value[`semana${i}Exterior`] || nuevaLimpieza.value[`semana${i}Interior`]) {
      algunaSemanaCompleta = true;
      break;
    }
  }
  // También consideramos las limpiezas extra como un indicador de "algo que guardar"
  const hasExtraCleanings = nuevaLimpieza.value.extraCleanings.some(
    extra => extra.description && extra.unitPrice && extra.quantity > 0
  );

  if (!algunaSemanaCompleta && !hasExtraCleanings) {
    alert('Por favor, completa al menos una fecha o tipo de limpieza para alguna semana, o añade una limpieza extra.');
    return;
  }

  const limpiezaParaGuardar = { ...nuevaLimpieza.value };

  limpiezaParaGuardar.factura = manualFacturaInput.value.trim() !== ''
    ? manualFacturaInput.value.trim()
    : proximaFactura.value;

  // Calculamos el precio bruto inicial de las semanas
  let basePrecioBruto = calculatePrecioBruto(nuevaLimpieza.value, selectedClientForNueva.value);
  // Sumamos el total de las limpiezas extra al precio bruto
  basePrecioBruto += calculatedExtraCleaningsTotalNueva.value; // Usar el computed para nueva
  limpiezaParaGuardar.precioBruto = parseFloat(basePrecioBruto.toFixed(2));

  limpiezaParaGuardar.clienteId = nuevaLimpieza.value.clienteId;
  limpiezaParaGuardar.cliente = `${client.nombre} ${(client.apellido || '')}`.trim();
  limpiezaParaGuardar.fechaPago = nuevaLimpieza.value.fechaPago || null;

  for (let i = 1; i <= 5; i++) {
    const semanaKey = `semana${i}`;
    const semanaPrecioKey = `${semanaKey}precio`;

    limpiezaParaGuardar[semanaKey] = limpiezaParaGuardar[semanaKey] || null;
    limpiezaParaGuardar[semanaPrecioKey] = limpiezaParaGuardar[semanaPrecioKey] ?? null;

    limpiezaParaGuardar[`${semanaKey}Tipo`] = getLimpiezaTypeString(
      limpiezaParaGuardar[`${semanaKey}Exterior`],
      limpiezaParaGuardar[`${semanaKey}Interior`]
    );
    delete limpiezaParaGuardar[`${semanaKey}Exterior`];
    delete limpiezaParaGuardar[`${semanaKey}Interior`];
  }

  // Guardamos solo las extraCleanings válidas (con descripción y precio)
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
      semana1: '', semana1Exterior: false, semana1Interior: false, semana1precio: null,
      semana2: '', semana2Exterior: false, semana2Interior: false, semana2precio: null,
      semana3: '', semana3Exterior: false, semana3Interior: false, semana3precio: null,
      semana4: '', semana4Exterior: false, semana4Interior: false, semana4precio: null,
      semana5: '', semana5Exterior: false, semana5Interior: false, semana5precio: null,
      extraCleanings: [{ description: '', date: '', quantity: 1, unitPrice: 0 }], // Reset extraCleanings
      formaPago: 'Efectivo', fechaPago: null,
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
    // Modificación: Re-calculamos el precio bruto para la edición
    precioBruto: calculatedPrecioBrutoEdited.value, // Usar el computed para edición
  };

  for (let i = 1; i <= 5; i++) {
    const semanaKey = `semana${i}`;
    const semanaPrecioKey = `${semanaKey}precio`;

    dataToUpdate[semanaKey] = editedLimpieza.value[semanaKey] || null;
    dataToUpdate[semanaPrecioKey] = editedLimpieza.value[semanaPrecioKey] ?? null;

    dataToUpdate[`${semanaKey}Tipo`] = getLimpiezaTypeString(
      editedLimpieza.value[`${semanaKey}Exterior`],
      editedLimpieza.value[`${semanaKey}Interior`]
    );
  }
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
  // --- Validación (mantenida de la función original) ---
  if (!invoiceData || !invoiceData.clienteId || !invoiceData.factura || !invoiceData.invoiceItems || !invoiceData.clientDetails) {
    alert("Datos de factura incompletos para la generación del PDF.");
    return null;
  }

  // --- Inicializar PDF ---
  const doc = new jsPDF(); // Por defecto A4 vertical

  // --- Extraer detalles del cliente para un acceso más fácil ---
  const clientDetails = invoiceData.clientDetails;
  const clientName = `${clientDetails.nombre || ''} ${clientDetails.apellido || ''}`;
  const clientAddress = clientDetails.direccion || 'N/A';
  const invoiceNumber = invoiceData.factura.toString();
  const currentDate = dayjs().locale('fr').format('DD/MM/YYYY');

  // --- Encabezado de la factura ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("FACTURA ", 150, 40);

  // --- Información del cliente y la factura (siguiendo tu nueva lógica) ---
  doc.setFontSize(15);
  doc.setTextColor("#4970B6"); // Usando hex para 'verde' para ser preciso
  doc.setFont("helvetica", "bold");
  doc.text("EXPEDIDA A: ", 20, 70);
  doc.text("FACT#: ", 130, 70);
  doc.text("FECHA: ", 130, 77);

  doc.setFont("helvetica", "normal");
  doc.setTextColor("black");
  doc.setFontSize(12); // Fuente ligeramente más grande para los detalles del cliente para mejor lectura
  doc.text("Nombre: " + clientName, 20, 86);
  doc.text("Dirección: " + clientAddress, 20, 92);


  doc.setFontSize(10); // Restablecer tamaño de fuente para el texto siguiente si es necesario
  doc.text(invoiceNumber, 155, 70); // Número de factura dinámico
  doc.text(currentDate, 155, 77); // Fecha dinámica

  // --- Sección de descripción (siguiendo tu nueva lógica) ---
  let currentY = 100; // Y inicial para la sección de descripción
  const tableTopY = currentY;
  // const tableHeight = 90; // Altura fija para el área de ítems, ajusta según sea necesario
  const rowHeight = 9; // Altura de cada fila en el cuerpo de la tabla
  const headerRectHeight = 9; // <--- CAMBIO CLAVE: Altura del recuadro del encabezado

  doc.setDrawColor("#4970B6"); // Borde azul
  doc.rect(20, tableTopY, 170, headerRectHeight); // Caja del encabezado, ahora más ajustada
  doc.setFillColor("4970B6"); // Fondo verde más oscuro para el encabezado
  doc.rect(20, tableTopY, 170, headerRectHeight, "F"); // Relleno del encabezado, misma altura

  doc.setTextColor("white");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Descripción de servicio", 35, tableTopY + 6);
  doc.text("Cant.", 110, tableTopY + 6);
  doc.text("Precio u.", 140, tableTopY + 6);
  doc.text("Importe", 170, tableTopY + 6);

  doc.setTextColor("black");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10); // Tamaño de fuente para los detalles del ítem

  // --- CAMBIO CLAVE AQUÍ: AJUSTAR Y INICIAL PARA LA PRIMERA DESCRIPCIÓN ---
  // Se calcula para que el texto del primer ítem esté justo debajo del encabezado
  currentY = tableTopY + headerRectHeight + 5; // El rectángulo del ítem empezará aquí
  // Y del texto del ítem estará 5 unidades por debajo del inicio del rectángulo
  let initialItemTextY = currentY + 5;

  let calculatedInvoiceTotal = 0;
  let itemsDrawn = 0; // Contador para saber cuántos items se han dibujado

  for (const item of invoiceData.invoiceItems) {
    if (item.totalHT && item.totalHT > 0) {
      const itemY = initialItemTextY + (itemsDrawn * (rowHeight + 5)); // Posición Y para el texto del item
      const itemRectY = itemY - 5; // Posición Y para el rectángulo del item

      doc.rect(20, itemRectY, 170, rowHeight); // Rectángulo para cada fila de ítem
      doc.text(item.description || '', 35, itemY);
      doc.text(String(item.qty || 0), 110, itemY);
      doc.text(formatCurrency(item.unitPrice || 0), 140, itemY);
      doc.text(formatCurrency(item.totalHT), 170, itemY);
      calculatedInvoiceTotal += item.totalHT;
      itemsDrawn++;
    }
  }

  // Calcular la altura total que ocuparon los ítems dinámicamente
  const dynamicItemsHeight = itemsDrawn * (rowHeight + 5);


  // --- Sección Total (adaptada del total de tu función original) ---
  // Colocar el total debajo del último ítem dibujado + un espacio
  const totalY = initialItemTextY + dynamicItemsHeight + 5;
  doc.setTextColor("black");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL", 140, totalY);
  doc.text(formatCurrency(calculatedInvoiceTotal), 170, totalY);

  // --- Detalles de pago (siguiendo tu nueva lógica) ---
  currentY = totalY + 20; // Ajustar la posición Y basándose en el contenido anterior
  doc.setTextColor("#4970B6"); // Azul
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15); // Fuente más grande para el título de la sección
  doc.text("DATOS DE PAGO", 20, currentY);

  currentY += 10;
  doc.setFontSize(10);
  doc.setTextColor("black");
  doc.setFont("helvetica", "normal");
  doc.text("DNI: 50349726-N", 25, currentY);
  currentY += 5;
  doc.text("N/C: ROYS GREGORY ABREU REINOSO", 25, currentY);
  currentY += 5;
  doc.text("DNI: 50349726-N", 25, currentY);

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
        // Llamar a tu función que genera el contenido del PDF
        const doc = await generateInvoicePdfContent({
          clienteId: limpieza.clienteId, // Asegúrate de pasar todos los datos necesarios
          factura: limpieza.factura,
          invoiceItems: limpieza.invoiceItems, // Asumo que `limpieza` también tiene los invoiceItems customizados
          clientDetails: limpieza.clientDetails // Y los clientDetails
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
    alert("Erreur lors de la récupération des détails du client pour la facture.");
    return;
  }

  const invoiceItems = [];
  const extPrice = clientDetails.precioExterior || 0;
  const intPrice = clientDetails.precioInterior || 0;

  for (let i = 1; i <= 5; i++) {
    const semanaKey = `semana${i}`;
    const semanaTipo = limpieza[`${semanaKey}Tipo`];
    const fecha = limpieza[semanaKey];
    let descriptionText = '';
    let weeklyPrice = 0;

    if (semanaTipo === 'exterior') { descriptionText = `Nettoyage extérieur`; weeklyPrice = extPrice; }
    else if (semanaTipo === 'interior') { descriptionText = `Nettoyage intérieur`; weeklyPrice = intPrice; }
    else if (semanaTipo === 'ambas') { descriptionText = `Nettoyage extérieur et intérieur`; weeklyPrice = extPrice + intPrice; }
    else { continue; }

    // Usar el precio específico de la semana si existe, de lo contrario usar el calculado
    const semanaPrecio = limpieza[`${semanaKey}precio`];
    if (semanaPrecio !== null && typeof semanaPrecio !== 'undefined') {
        weeklyPrice = parseFloat(semanaPrecio);
    }

    if (weeklyPrice > 0) {
      invoiceItems.push({
        description: descriptionText,
        date: fecha ? dayjs(fecha).format('YYYY-MM-DD') : '', // Asegúrate de que formatEuropeanDate devuelve un string válido
        qty: 1,
        unitPrice: parseFloat(weeklyPrice.toFixed(2)),
        totalHT: parseFloat(weeklyPrice.toFixed(2)),
        isOriginalCleaning: true // Bandera para saber que es un ítem de limpieza original
      });
    }
  }

  // AÑADIR LAS LIMPIEZAS EXTRAS A invoiceItems
  if (limpieza.extraCleanings && limpieza.extraCleanings.length > 0) {
    limpieza.extraCleanings.forEach(extra => {
      if (extra.description && extra.unitPrice && extra.quantity > 0) {
        invoiceItems.push({
          description: extra.description,
          date: extra.date ? dayjs(extra.date).format('YYYY-MM-DD') : '',
          qty: extra.quantity,
          unitPrice: parseFloat(extra.unitPrice.toFixed(2)),
          totalHT: parseFloat((extra.quantity * extra.unitPrice).toFixed(2)),
          isOriginalCleaning: false // Indicar que es un ítem extra
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
    customItems: [], // Comenzar con ítems personalizados vacíos
    formaPago: limpieza.formaPago || 'Efectivo',
    fechaPago: limpieza.fechaPago ? dayjs(limpieza.fechaPago).format('YYYY-MM-DD') : '',
  };

  isInvoiceEditorModalOpen.value = true;
};

const handleGenerateEditedPdf = async (finalInvoiceData) => {
    const doc = await generateInvoicePdfContent(finalInvoiceData);
    if (doc) {
        const clientNameForFilename = finalInvoiceData.clientDetails.nombre.replace(/[^a-zA-Z0-9-]/g, '_');
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
      alert("Aucun enregistrement de nettoyage n'a été trouvé pour générer le PDF de résumé.");
      isGeneratingPdf.value = false;
      return;
    }

    dayjs.locale('fr');

    const doc = new jsPDF('l');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const topMargin = 25;
    const bottomMargin = 20;
    const leftMargin = 15;
    const rightMargin = 15;
    const usableWidth = pageWidth - leftMargin - rightMargin;

    const currentMonthYear = dayjs().format('MMMM YYYY').toUpperCase();
    const titleText = `RÉSUMÉ DES NETTOYAGES ${currentMonthYear}`;

    doc.setFontSize(18);
    doc.text(titleText, pageWidth / 2, topMargin - 10, { align: 'center' });
    doc.setFontSize(11);
    doc.setTextColor(100);

    const headers = [
      "Facture N°", "Client", "Sem.1", "Sem.2", "Sem.3", "Sem.4", "Sem.5",
      "Brut (€)", "Net (€)", "Cot. (€)", "Date Paiement", "Statut", "Mode Paiement"
    ];

    let totalBrutoPagado = 0;
    let totalNetoPagado = 0;
    let totalCotizacionPagado = 0;

    let totalBrutoPendiente = 0;
    let totalNetoPendiente = 0;
    let totalCotizacionPendiente = 0;

    const currentMonthYearFormatted = dayjs().format('YYYY-MM');

    const getWeekCellContent = (date, type) => {
      const dateStr = date ? formatEuropeanDate(date) : '';
      const typeStr = type ? getShortWeekType(type) : '';

      if (dateStr && typeStr) {
        return [dateStr, typeStr];
      } else if (dateStr) {
        return [dateStr];
      } else if (typeStr) {
        return [typeStr];
      }
      return [''];
    };

    const getShortWeekType = (semanaTipo) => {
      if (semanaTipo === 'exterior') return 'E';
      if (semanaTipo === 'interior') return 'I';
      if (semanaTipo === 'ambas') return 'E+I';
      return '';
    };

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
          getWeekCellContent(limpieza.semana1, limpieza.semana1Tipo),
          getWeekCellContent(limpieza.semana2, limpieza.semana2Tipo),
          getWeekCellContent(limpieza.semana3, limpieza.semana3Tipo),
          getWeekCellContent(limpieza.semana4, limpieza.semana4Tipo),
          getWeekCellContent(limpieza.semana5, limpieza.semana5Tipo),
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
        const cellText = Array.isArray(cell) ? cell.reduce((maxLen, current) => (doc.getTextWidth(current) > doc.getTextWidth(maxLen) ? current : maxLen), '') : String(cell);
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
        if (Array.isArray(cell) && (colIndex >= 2 && colIndex <= 6)) {
          const dateStr = cell[0];
          const typeStr = cell[1];

          const yOffset = 2;
          doc.text(dateStr, currentX + cellPadding, currentY + rowHeight / 2 - yOffset, { baseline: 'middle' });

          if (typeStr) {
            const columnCenter = currentX + (columnWidths[colIndex] / 2);
            doc.text(typeStr, columnCenter, currentY + rowHeight / 2 + yOffset, { align: 'center', baseline: 'middle' });
          }
        } else {
          const cellText = String(cell);
          doc.text(cellText, currentX + cellPadding, currentY + rowHeight / 2, { baseline: 'middle' });
        }
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


    const nowPdf = dayjs(); // Usar una nueva referencia para evitar conflicto de nombres con 'now' global
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
    alert("Une erreur est survenue lors de la génération du PDF de résumé. Veuillez réessayer.");
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
