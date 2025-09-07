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
              <input
                type="text"
                class="form-control"
                id="manualFactura"
                v-model="manualFacturaInput"
                placeholder="Dejar vacío para generar automáticamente"
              />
              <small class="form-text text-muted">Si se deja vacío, se usará: {{ proximaFactura }}</small>
            </div>
            <!-- Fin de sección para número de factura manual -->

            <div class="row justify-content-center mt-3">
              <div class="col-md-2">
                <label for="semana1" class="form-label">Semana 1 </label>
                <input type="date" class="form-control mb-2" id="semana1" v-model="nuevaLimpieza.semana1" >
                <label for="semana1precio" class="form-label">Precio (€)</label>
                <input type="number" step="0.01" class="form-control" id="semana1precio" v-model.number="nuevaLimpieza.semana1precio">
                <div class="d-flex gap-2 mt-1">
                  <button type="button"
                          class="btn btn-sm"
                          :class="[nuevaLimpieza.semana1Exterior ? 'btn-success' : 'btn-danger']"
                          @click="toggleSemanaType('semana1', 'exterior',nuevaLimpieza)">
                    Exterior
                  </button>
                  <button type="button"
                          class="btn btn-sm"
                          :class="[nuevaLimpieza.semana1Interior ? 'btn-success' : 'btn-danger']"
                          @click="toggleSemanaType('semana1', 'interior',nuevaLimpieza)">
                    Interior
                  </button>
                </div>
              </div>
              <div class="col-md-2">
                <label for="semana2" class="form-label">Semana 2 </label>
                <input type="date" class="form-control mb-2" id="semana2" v-model="nuevaLimpieza.semana2">
                <label for="semana2precio" class="form-label">Precio (€)</label>
                <input type="number" step="0.01" class="form-control" id="semana2precio" v-model.number="nuevaLimpieza.semana2precio">
                <div class="d-flex gap-2 mt-1">
                  <button type="button"
                          class="btn btn-sm"
                          :class="[nuevaLimpieza.semana2Exterior ? 'btn-success' : 'btn-danger']"
                          @click="toggleSemanaType('semana2', 'exterior',nuevaLimpieza)">
                    Exterior
                  </button>
                  <button type="button"
                          class="btn btn-sm"
                          :class="[nuevaLimpieza.semana2Interior ? 'btn-success' : 'btn-danger']"
                          @click="toggleSemanaType('semana2', 'interior',nuevaLimpieza)">
                    Interior
                  </button>
                </div>
              </div>
              <div class="col-md-2">
                <label for="semana3" class="form-label">Semana 3 </label>
                <input type="date" class="form-control mb-2" id="semana3" v-model="nuevaLimpieza.semana3">
                <label for="semana3precio" class="form-label">Precio (€)</label>
                <input type="number" step="0.01" class="form-control" id="semana3precio" v-model.number="nuevaLimpieza.semana3precio">
                <div class="d-flex gap-2 mt-1">
                  <button type="button"
                          class="btn btn-sm"
                          :class="[nuevaLimpieza.semana3Exterior ? 'btn-success' : 'btn-danger']"
                          @click="toggleSemanaType('semana3', 'exterior',nuevaLimpieza)">
                    Exterior
                  </button>
                  <button type="button"
                          class="btn btn-sm"
                          :class="[nuevaLimpieza.semana3Interior ? 'btn-success' : 'btn-danger']"
                          @click="toggleSemanaType('semana3', 'interior',nuevaLimpieza)">
                    Interior
                  </button>
                </div>
              </div>
              <div class="col-md-2">
                <label for="semana4" class="form-label">Semana 4 </label>
                <input type="date" class="form-control mb-2" id="semana4" v-model="nuevaLimpieza.semana4">
                <label for="semana4precio" class="form-label">Precio (€)</label>
                <input type="number" step="0.01" class="form-control" id="semana4precio" v-model.number="nuevaLimpieza.semana4precio">
                <div class="d-flex gap-2 mt-1">
                  <button type="button"
                          class="btn btn-sm"
                          :class="[nuevaLimpieza.semana4Exterior ? 'btn-success' : 'btn-danger']"
                          @click="toggleSemanaType('semana4', 'exterior',nuevaLimpieza)">
                    Exterior
                  </button>
                  <button type="button"
                          class="btn btn-sm"
                          :class="[nuevaLimpieza.semana4Interior ? 'btn-success' : 'btn-danger']"
                          @click="toggleSemanaType('semana4', 'interior',nuevaLimpieza)">
                    Interior
                  </button>
                </div>
              </div>
              <div class="col-md-2">
                <label for="semana5" class="form-label">Semana 5 </label>
                <input type="date" class="form-control mb-2" id="semana5" v-model="nuevaLimpieza.semana5">
                <label for="semana5precio" class="form-label">Precio (€)</label>
                <input type="number" step="0.01" class="form-control" id="semana5precio" v-model.number="nuevaLimpieza.semana5precio">
                <div class="d-flex gap-2 mt-1">
                  <button type="button"
                          class="btn btn-sm"
                          :class="[nuevaLimpieza.semana5Exterior ? 'btn-success' : 'btn-danger']"
                          @click="toggleSemanaType('semana5', 'exterior',nuevaLimpieza)">
                    Exterior
                  </button>
                  <button type="button"
                          class="btn btn-sm"
                          :class="[nuevaLimpieza.semana5Interior ? 'btn-success' : 'btn-danger']"
                          @click="toggleSemanaType('semana5', 'interior',nuevaLimpieza)">
                    Interior
                  </button>
                </div>
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
        <button class="btn btn-success m-3" @click="handleGeneratePdf" :disabled="isGeneratingPdf || databaseStore.limpiezas.length === 0">
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
                  :class="{'bg-danger-subtle': isPaymentDateMismatched(limpieza)}">
                <td>{{ limpieza.factura }}</td>
                <td>{{ limpieza.cliente }}</td>
                <td class="text-center">
                  {{ formatEuropeanDate(limpieza.semana1) }}
                  <br v-if="limpieza.semana1Tipo" />
                  <span v-if="limpieza.semana1Tipo === 'exterior' || limpieza.semana1Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                  <span v-if="limpieza.semana1Tipo === 'interior' || limpieza.semana1Tipo === 'ambas'" class="badge bg-secondary">I</span>
                  <div v-if="limpieza.semana1precio !== null">
                    <small class="text-muted">{{ formatCurrency(limpieza.semana1precio) }}</small>
                  </div>
                </td>
                <td class="text-center">
                  {{ formatEuropeanDate(limpieza.semana2) }}
                  <br v-if="limpieza.semana2Tipo" />
                  <span v-if="limpieza.semana2Tipo === 'exterior' || limpieza.semana2Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                  <span v-if="limpieza.semana2Tipo === 'interior' || limpieza.semana2Tipo === 'ambas'" class="badge bg-secondary">I</span>
                  <div v-if="limpieza.semana2precio !== null">
                    <small class="text-muted">{{ formatCurrency(limpieza.semana2precio) }}</small>
                  </div>
                </td>
                <td class="text-center">
                  {{ formatEuropeanDate(limpieza.semana3) }}
                  <br v-if="limpieza.semana3Tipo" />
                  <span v-if="limpieza.semana3Tipo === 'exterior' || limpieza.semana3Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                  <span v-if="limpieza.semana3Tipo === 'interior' || limpieza.semana3Tipo === 'ambas'" class="badge bg-secondary">I</span>
                  <div v-if="limpieza.semana3precio !== null">
                    <small class="text-muted">{{ formatCurrency(limpieza.semana3precio) }}</small>
                  </div>
                </td>
                <td class="text-center">
                  {{ formatEuropeanDate(limpieza.semana4) }}
                  <br v-if="limpieza.semana4Tipo" />
                  <span v-if="limpieza.semana4Tipo === 'exterior' || limpieza.semana4Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                  <span v-if="limpieza.semana4Tipo === 'interior' || limpieza.semana4Tipo === 'ambas'" class="badge bg-secondary">I</span>
                  <div v-if="limpieza.semana4precio !== null">
                    <small class="text-muted">{{ formatCurrency(limpieza.semana4precio) }}</small>
                  </div>
                </td>
                <td class="text-center">
                  {{ formatEuropeanDate(limpieza.semana5) }}
                  <br v-if="limpieza.semana5Tipo" />
                  <span v-if="limpieza.semana5Tipo === 'exterior' || limpieza.semana5Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                  <span v-if="limpieza.semana5Tipo === 'interior' || limpieza.semana5Tipo === 'ambas'" class="badge bg-secondary">I</span>
                  <div v-if="limpieza.semana5precio !== null">
                    <small class="text-muted">{{ formatCurrency(limpieza.semana5precio) }}</small>
                  </div>
                </td>
                <td>{{ limpieza.precioBruto }}</td>
                <td><strong>{{ formatCurrency(calculatePrecioNeto(limpieza.precioBruto)) }}</strong></td>
                <td>{{ formatCurrency(calculateCotizacion(limpieza.precioBruto)) }}</td>
                <td>{{ formatEuropeanDate(limpieza.fechaPago) }}</td>
                <td>
                   <span :class="{'badge bg-success': limpieza.fechaPago, 'badge bg-warning text-dark': !limpieza.fechaPago}">
                      {{ limpieza.fechaPago ? 'Pagao' : 'Pendiente' }}
                   </span>
                </td>
                <td>{{ limpieza.formaPago }}</td>
                <td class="d-flex justify-content-around align-items-center gap-2">
                  <button @click="openEditModal(limpieza)" class="btn btn-sm btn-secondary d-flex justify-content-center align-items-center">
                    <font-awesome-icon :icon="['fas', 'file-pen']"/>
                  </button>
                  <button @click="confirmDelete(limpieza)" class="btn btn-sm btn-warning d-flex justify-content-center align-items-center">
                    <font-awesome-icon :icon="['fas', 'trash-can']"/>
                  </button>
                    <button @click="previewFactura(limpieza)" class="btn btn-sm btn-info text-white d-flex justify-content-center align-items-center">
                    <font-awesome-icon :icon="['fas', 'eye']"/>
                  </button>
                  <button @click="facturaPdf(limpieza)" class="btn btn-sm btn-danger d-flex justify-content-center align-items-center">
                    <font-awesome-icon :icon="['fas', 'file-pdf']"/>
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <!-- Fila para el total PAGADO -->
              <tr>
                <td colspan="7" class="text-end"><strong>TOTAL PAGADO</strong></td>
                <td>{{ formatCurrency(totalPagado) }}</td>
                <td><h4><strong>{{ formatCurrency(totalNetoPagado) }}</strong></h4></td>
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
                  <span class="text-danger"><h4><strong>{{ formatCurrency(totalPendienteNeto) }}</strong></h4></span>
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

    <!-- Estructura del Modal de Edición -->
     <div v-if="isEditModalOpen" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="editModalLabel" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-lg">
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
                    <input type="number" step="0.01" class="form-control" id="edit-semana1precio" v-model.number="editedLimpieza.semana1precio">
                    <div class="d-flex gap-2 mt-1">
                      <button type="button"
                              class="btn btn-sm"
                              :class="[editedLimpieza.semana1Exterior ? 'btn-success' : 'btn-danger']"
                              @click="toggleSemanaType('semana1', 'exterior', editedLimpieza)">
                        Exterior
                      </button>
                      <button type="button"
                              class="btn btn-sm"
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
                    <input type="number" step="0.01" class="form-control" id="edit-semana2precio" v-model.number="editedLimpieza.semana2precio">
                    <div class="d-flex gap-2 mt-1">
                      <button type="button"
                              class="btn btn-sm"
                              :class="[editedLimpieza.semana2Exterior ? 'btn-success' : 'btn-danger']"
                              @click="toggleSemanaType('semana2', 'exterior', editedLimpieza)">
                        Exterior
                      </button>
                      <button type="button"
                              class="btn btn-sm"
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
                    <input type="number" step="0.01" class="form-control" id="edit-semana3precio" v-model.number="editedLimpieza.semana3precio">
                    <div class="d-flex gap-2 mt-1">
                      <button type="button"
                              class="btn btn-sm"
                              :class="[editedLimpieza.semana3Exterior ? 'btn-success' : 'btn-danger']"
                              @click="toggleSemanaType('semana3', 'exterior', editedLimpieza)">
                        Exterior
                      </button>
                      <button type="button"
                              class="btn btn-sm"
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
                    <input type="number" step="0.01" class="form-control" id="edit-semana4precio" v-model.number="editedLimpieza.semana4precio">
                    <div class="d-flex gap-2 mt-1">
                      <button type="button"
                              class="btn btn-sm"
                              :class="[editedLimpieza.semana4Exterior ? 'btn-success' : 'btn-danger']"
                              @click="toggleSemanaType('semana4', 'exterior', editedLimpieza)">
                        Exterior
                      </button>
                      <button type="button"
                              class="btn btn-sm"
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
                    <input type="number" step="0.01" class="form-control" id="edit-semana5precio" v-model.number="editedLimpieza.semana5precio">
                    <div class="d-flex gap-2 mt-1">
                      <button type="button"
                              class="btn btn-sm"
                              :class="[editedLimpieza.semana5Exterior ? 'btn-success' : 'btn-danger']"
                              @click="toggleSemanaType('semana5', 'exterior', editedLimpieza)">
                        Exterior
                      </button>
                      <button type="button"
                              class="btn btn-sm"
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
                </div> <!-- Cierre del row g-3 -->
             </form>
              <div class="mt-3" v-if="editedLimpieza.precioBruto > 0">
                <p><strong>Precio Neto (23.2%):</strong> {{ formatCurrency(calculatePrecioNeto(editedLimpieza.precioBruto)) }}</p>
                <p><strong>Cotización (Restante):</strong> {{ formatCurrency(calculateCotizacion(editedLimpieza.precioBruto)) }}</p>
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="saveEditedLimpieza" :disabled="isLoadingEdit || databaseStore.isUpdating">
               {{ isLoadingEdit || databaseStore.isUpdating ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isEditModalOpen" class="modal-backdrop fade show"></div>

    <!-- Estructura del Modal para Añadir Cliente -->
    <div v-if="isAddClientModalOpen" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="addClientModalLabel" aria-modal="true" role="dialog">
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
                  <input type="text" class="form-control" id="new-client-apellido" v-model="newClient.apellido" required>
                </div>

                <div class="col-12 mt-4 mb-3">
                    <h4 class="mb-0">Dirección de Facturación</h4>
                    <hr class="mt-2 mb-3">
                </div>
                <div class="col-12">
                  <label for="new-client-direccion" class="form-label">Dirección (Calle y Número)</label>
                  <input type="text" class="form-control" id="new-client-direccion" v-model="newClient.direccion" required>
                </div>
                <div class="col-md-6">
                  <label for="new-client-ciudad" class="form-label">Ciudad</label>
                  <input type="text" class="form-control" id="new-client-ciudad" v-model="newClient.ciudad" required>
                </div>
                <div class="col-md-6">
                  <label for="new-client-provincia" class="form-label">Provincia</label>
                  <input type="text" class="form-control" id="new-client-provincia" v-model="newClient.provincia" required>
                </div>
                <div class="col-md-4">
                  <label for="new-client-codigo-postal" class="form-label">Código Postal</label>
                  <input type="text" class="form-control" id="new-client-codigo-postal" v-model="newClient.codigoPostal">
                </div>

                <div class="col-12 mt-4 mb-3">
                    <h4 class="mb-0">Dirección de Intervención (Opcional)</h4>
                    <hr class="mt-2 mb-3">
                </div>
                <div class="col-12">
                    <label for="new-client-intervencion-calle" class="form-label">Dirección (Calle y Número)</label>
                    <input type="text" class="form-control" id="new-client-intervencion-calle" v-model="newClient.direccionIntervencion.calle">
                </div>
                <div class="col-md-6">
                    <label for="new-client-intervencion-ciudad" class="form-label">Ciudad</label>
                    <input type="text" class="form-control" id="new-client-intervencion-ciudad" v-model="newClient.direccionIntervencion.ciudad">
                </div>
                <div class="col-md-6">
                    <label for="new-client-intervencion-provincia" class="form-label">Provincia</label>
                    <input type="text" class="form-control" id="new-client-intervencion-provincia" v-model="newClient.direccionIntervencion.provincia">
                </div>
                <div class="col-md-4">
                    <label for="new-client-intervencion-codigo-postal" class="form-label">Código Postal</label>
                    <input type="text" class="form-control" id="new-client-intervencion-codigo-postal" v-model="newClient.direccionIntervencion.codigoPostal">
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
                    <option value="cooperativa">Cooperativa</option>
                    <option value="casa">Casa</option>
                  </select>
                </div>
                <div class="col-12 mt-4 mb-3">
                    <h4 class="mb-0">Tarifas de Limpieza (€)</h4>
                    <hr class="mt-2 mb-3">
                </div>
                <div class="col-md-6">
                  <label for="new-client-precio-exterior" class="form-label">Precio por Limpieza Exterior</label>
                  <input type="number" class="form-control" id="new-client-precio-exterior" v-model.number="newClient.precioExterior" step="0.01" min="0">
                </div>
                <div class="col-md-6">
                  <label for="new-client-precio-interior" class="form-label">Precio por Limpieza Interior</label>
                  <input type="number" class="form-control" id="new-client-precio-interior" v-model.number="newClient.precioInterior" step="0.01" min="0">
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

    <!-- Modal de Vista Previa de Factura -->
    <div v-if="isPreviewModalOpen" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="pdfPreviewModalLabel" aria-modal="true" role="dialog">
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
import { autoTable } from 'jspdf-autotable';
import dayjs from "dayjs"; // Asegúrate de que dayjs está importado

import PagosPendientesView from '../components/PagosPendientesView.vue';

// --- ESTADOS LOCALES Y REFERENCES ---
const databaseStore = useDatabaseStore();
const isGeneratingPdf = ref(false); // Estado para el spinner del PDF resumen
const manualFacturaInput = ref(''); 
const totalPendiente = computed(() => {
  let sum = 0;
  // Iterar sobre todos los registros de limpieza
  for (const limpieza of databaseStore.limpiezas) {
    // Un registro está 'Pendiente' si su fechaPago es nula o falsy
    if (!limpieza.fechaPago) {
      sum += (limpieza.precioBruto || 0); // Suma el precio bruto de los pendientes
    }
  }
  return sum;
});
const totalPendienteNeto = computed(() => { // NUEVA: TOTAL NETO PENDIENTE
  let sum = 0;
  for (const limpieza of databaseStore.limpiezas) {
    if (!limpieza.fechaPago) {
      sum += calculatePrecioNeto(limpieza.precioBruto || 0);
    }
  }
  return sum;
});

const totalPendienteCotizacion = computed(() => { // NUEVA: TOTAL COTIZACIÓN PENDIENTE
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
  // Itera sobre los registros de limpieza que ya están filtrados por mes/año si aplica
  for (const limpieza of databaseStore.limpiezas) {
    // Si la fechaPago existe, significa que el registro está 'Pagado'
    if (limpieza.fechaPago) {
      sum += (limpieza.precioBruto || 0); // Suma el precio bruto (por defecto 0 si es nulo)
    }
  }
  return sum;
});

const totalNetoPagado = computed(() => {
  let sum = 0;
  for (const limpieza of databaseStore.limpiezas) {
    if (limpieza.fechaPago) {
      sum += calculatePrecioNeto(limpieza.precioBruto || 0);
    }
  }
  return sum;
});
const totalCotizacionPagado = computed(() => {
  let sum = 0;
  for (const limpieza of databaseStore.limpiezas) {
    if (limpieza.fechaPago) {
      sum += calculateCotizacion(limpieza.precioBruto || 0);
    }
  }
  return sum;
});
const totalPendienteMesActual = computed(() => {
  let sum = 0;
  // databaseStore.limpiezas ya contiene los registros filtrados por mes y año
  for (const limpieza of databaseStore.limpiezas) {
    // Si la limpieza no tiene fecha de pago, significa que está pendiente
    if (!limpieza.fechaPago) {
      sum += (limpieza.precioBruto || 0); // Suma el precio bruto, asegurando 0 si es nulo
    }
  }
  return sum;
});
// Estados para los datos de los formularios
const nuevaLimpieza = ref({
  cliente: '',
  clienteId: null,
  semana1: '', semana1Exterior: false, semana1Interior: false, semana1precio: null, // Nuevo campo
  semana2: '', semana2Exterior: false, semana2Interior: false, semana2precio: null, // Nuevo campo
  semana3: '', semana3Exterior: false, semana3Interior: false, semana3precio: null, // Nuevo campo
  semana4: '', semana4Exterior: false, semana4Interior: false, semana4precio: null, // Nuevo campo
  semana5: '', semana5Exterior: false, semana5Interior: false, semana5precio: null, // Nuevo campo
  formaPago: 'Efectivo',
  fechaPago: null,
});

const editedLimpieza = ref({
  id: null, factura: null, cliente: '', clienteId: null,
  semana1: '', semana1Exterior: false, semana1Interior: false, semana1precio: null, // Nuevo campo
  semana2: '', semana2Exterior: false, semana2Interior: false, semana2precio: null, // Nuevo campo
  semana3: '', semana3Exterior: false, semana3Interior: false, semana3precio: null, // Nuevo campo
  semana4: '', semana4Exterior: false, semana4Interior: false, semana4precio: null, // Nuevo campo
  semana5: '', semana5Exterior: false, semana5Interior: false, semana5precio: null, // Nuevo campo
  formaPago: 'Efectivo', fechaPago: null, precioBruto: null,
});

const newClient = ref({
  nombre: '', apellido: '', direccion: '', ciudad: '', provincia: '', codigoPostal: '',
  direccionIntervencion: { calle: '', ciudad: '', provincia: '', codigoPostal: '' },
  telefono: '', email: '', precioExterior: 0.00, precioInterior: 0.00,tipoCliente: ''
});

// Estados para el control de modales
const isEditModalOpen = ref(false);
const isAddClientModalOpen = ref(false);
const isPreviewModalOpen = ref(false);

// Estados de carga específicos para este componente (no manejados directamente por el store)
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
    const semanaPrecioKey = `semana${i}precio`; // Clave del precio semanal personalizado

    let weeklyPrice = 0;
    // Si se ha definido un precio semanal personalizado para esta semana
    if (limpiezaData[semanaPrecioKey] !== null && typeof limpiezaData[semanaPrecioKey] !== 'undefined' && !isNaN(parseFloat(limpiezaData[semanaPrecioKey]))) {
      weeklyPrice = parseFloat(limpiezaData[semanaPrecioKey]);
    } else {
      // Si no hay precio personalizado, usa los precios por defecto del cliente
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

const calculatedPrecioBrutoNueva = computed(() => {
  return calculatePrecioBruto(nuevaLimpieza.value, selectedClientForNueva.value);
});
const calculatedPrecioBrutoEdited = computed(() => {
  return calculatePrecioBruto(editedLimpieza.value, selectedClientForEdited.value);
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
  const limpiezas = [...databaseStore.limpiezas]; // Crear una copia superficial para ordenar

  // Lógica de ordenamiento:
  // 1. Las limpiezas pagadas con discrepancia de fecha van primero (resaltadas).
  // 2. Luego, el resto de limpiezas, ordenadas por factura descendente.
  limpiezas.sort((a, b) => {
    const aIsMismatchedPaid = a.fechaPago && isPaymentDateMismatched(a);
    const bIsMismatchedPaid = b.fechaPago && isPaymentDateMismatched(b);

    // Si 'a' tiene discrepancia y 'b' no, 'a' va primero
    if (aIsMismatchedPaid && !bIsMismatchedPaid) {
      return -1;
    }
    // Si 'b' tiene discrepancia y 'a' no, 'b' va primero
    if (!aIsMismatchedPaid && bIsMismatchedPaid) {
      return 1;
    }

    // Si ambos tienen discrepancia O ninguno la tiene, ordena por número de factura (descendente)
    // Asumiendo que `factura` es una cadena (ej. 'F2024-01-001'), puedes usar `localeCompare`
    // Si es un número, simplemente `b.factura - a.factura`.
    return b.factura.localeCompare(a.factura);
  });

  return limpiezas;
});

/**
 * Función para determinar si una fila debe resaltarse.
 * Retorna true si la limpieza está pagada Y el mes/año de fechaPago
 * no coincide con el mes/año de fechaPrincipalLimpieza.
 */
const isPaymentDateMismatched = (limpieza) => {
  // Solo se resalta si está pagado Y hay una discrepancia de fechas.
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
 * @param {Object} limpiezaData - Objeto de limpieza con campos semana1-5.
 * @returns {string|null} Fecha en formato 'YYYY-MM-DD' o null.
 */
const getEarliestSemanaDate = (limpiezaData) => {
  let earliestDate = null;
  for (let i = 1; i <= 5; i++) {
    const dateString = limpiezaData[`semana${i}`];
    if (dateString) {
      const currentDate = dayjs(dateString); // Usa dayjs para parsear
      if (currentDate.isValid()) { // Verifica si la fecha es válida
        if (!earliestDate || currentDate.isBefore(earliestDate)) { // Usa isBefore de dayjs
          earliestDate = currentDate;
        }
      }
    }
  }
  return earliestDate ? earliestDate.format('YYYY-MM-DD') : null;
};

/**
 * Construye la cadena de tipo de limpieza (exterior, interior, ambas, null)
 * @param {boolean} isExterior
 * @param {boolean} isInterior
 * @returns {string|null}
 */
const getLimpiezaTypeString = (isExterior, isInterior) => {
  if (isExterior && isInterior) return 'ambas';
  if (isExterior) return 'exterior';
  if (isInterior) return 'interior';
  return null;
};

/**
 * Formatea una fecha a formato europeo (DD/MM/AAAA).
 * @param {string|Date|firebase.firestore.Timestamp} dateValue - Valor de la fecha.
 * @returns {string} Fecha formateada o cadena vacía.
 */
const formatEuropeanDate = (dateValue) => {
  if (!dateValue) return '';
  let date;
  if (typeof dateValue.toDate === 'function') { // Firebase Timestamp
    date = dayjs(dateValue.toDate());
  } else if (dateValue instanceof Date) {
    date = dayjs(dateValue);
  } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    date = dayjs(dateValue); // Usa dayjs para parsear cadenas de fecha de forma fiable
    if (!date.isValid()) { console.warn('Fecha inválida detectada:', dateValue); return ''; }
  } else {
    console.warn('Formato de fecha desconocido:', dateValue); return '';
  }
  return date.format('DD/MM/YYYY'); // Formatea a 'DD/MM/YYYY'
};

/**
 * Calcula la cotización (23.2% del precio bruto).
 * @param {number} precioBruto - Precio bruto.
 * @returns {number} Cotización redondeada a 2 decimales.
 */
const calculateCotizacion = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) return 0;
  return parseFloat((brute * 0.232).toFixed(2));
};

/**
 * Calcula el precio neto (precio bruto - cotización).
 * @param {number} precioBruto - Precio bruto.
 * @returns {number} Precio neto redondeado a 2 decimales.
 */
const calculatePrecioNeto = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) return 0;
  const cotizacion = calculateCotizacion(brute);
  return parseFloat((brute - cotizacion).toFixed(2));
};

/**
 * Formatea un número a moneda (€).
 * @param {number} value - Valor numérico.
 * @returns {string} Valor formateado con símbolo de euro.
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

  // Activa/desactiva el tipo específico
  if (tipo === 'exterior') {
    if (Object.prototype.hasOwnProperty.call(targetObject, exteriorKey)) {
      targetObject[exteriorKey] = !targetObject[exteriorKey];
    } else { console.warn(`Advertencia: La propiedad '${exteriorKey}' no existe.`); return; }
  } else if (tipo === 'interior') {
    if (Object.prototype.hasOwnProperty.call(targetObject, interiorKey)) {
      targetObject[interiorKey] = !targetObject[interiorKey];
    } else { console.warn(`Advertencia: La propiedad '${interiorKey}' no existe.`); return; }
  }

  // Determina el estado actual de exterior/interior para esta semana
  const currentExterior = targetObject[exteriorKey];
  const currentInterior = targetObject[interiorKey];

  // Lógica para establecer/limpiar la fecha
  if (!currentExterior && !currentInterior) {
    targetObject[semanaKey] = ''; // Limpia la fecha si ambos tipos están desactivados
  } else if (!targetObject[semanaKey]) { // Establece la fecha si los tipos están activados pero la fecha está vacía
    targetObject[semanaKey] = dayjs().format('YYYY-MM-DD');
  }

  // --- LÓGICA CORREGIDA PARA EL PRECIO SEMANAL ---
  const clientData = (targetObject === nuevaLimpieza.value) ? selectedClientForNueva.value : selectedClientForEdited.value;

  if (clientData) {
    let newCalculatedWeeklyPrice = 0;
    if (currentExterior) {
      newCalculatedWeeklyPrice += (clientData.precioExterior || 0);
    }
    if (currentInterior) {
      newCalculatedWeeklyPrice += (clientData.precioInterior || 0);
    }

    // Siempre recalcula y asigna el precio semanal si hay al menos un tipo de limpieza activo.
    // Si ambos están desactivados, limpia el precio semanal personalizado.
    if (currentExterior || currentInterior) {
        targetObject[semanaPrecioKey] = parseFloat(newCalculatedWeeklyPrice.toFixed(2));
    } else {
        targetObject[semanaPrecioKey] = null;
    }
  } else {
    console.warn("No hay datos de cliente disponibles para auto-llenar el precio semanal.");
    // Aún si no hay datos de cliente, si ambos tipos están desactivados, limpia el precio.
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
    semana1precio: limpieza.semana1precio ?? null, // Cargar precio semanal
    semana2precio: limpieza.semana2precio ?? null, // Cargar precio semanal
    semana3precio: limpieza.semana3precio ?? null, // Cargar precio semanal
    semana4precio: limpieza.semana4precio ?? null, // Cargar precio semanal
    semana5precio: limpieza.semana5precio ?? null, // Cargar precio semanal
    precioBruto: limpieza.precioBruto ?? null,
    fechaPago: limpieza.fechaPago || null,
    formaPago: limpieza.formaPago || 'Efectivo',
    clienteId: limpieza.clienteId || null,
  };

  for (let i = 1; i <= 5; i++) {
    const tipo = tempEditedLimpieza[`semana${i}Tipo`];
    tempEditedLimpieza[`semana${i}Exterior`] = tipo === 'exterior' || tipo === 'ambas';
    tempEditedLimpieza[`semana${i}Interior`] = tipo === 'interior' || tipo === 'ambas';
  }
  editedLimpieza.value = tempEditedLimpieza;
  isEditModalOpen.value = true;
  databaseStore.updateLimpiezaError = null; // Limpia errores previos del store
};


/**
 * Cierra el modal de edición y resetea los datos.
 */
const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingLimpiezaId.value = null;
  // Resetea el formulario de forma reactiva
  Object.assign(editedLimpieza.value, {
    id: null, factura: null, cliente: '', clienteId: null,
    semana1: '', semana1Exterior: false, semana1Interior: false, semana1precio: null, // Resetear
    semana2: '', semana2Exterior: false, semana2Interior: false, semana2precio: null, // Resetear
    semana3: '', semana3Exterior: false, semana3Interior: false, semana3precio: null, // Resetear
    semana4: '', semana4Exterior: false, semana4Interior: false, semana4precio: null, // Resetear
    semana5: '', semana5Exterior: false, semana5Interior: false, semana5precio: null, // Resetear
    formaPago: 'Efectivo', fechaPago: null, precioBruto: null,tipoCliente: '',
  });
  databaseStore.updateLimpiezaError = null;
};


/**
 * Abre el modal para añadir un nuevo cliente y resetea el formulario.
 */
const openAddClientModal = () => {
  isAddClientModalOpen.value = true;
  Object.assign(newClient.value, {
    nombre: '', apellido: '', direccion: '', ciudad: '', provincia: '', codigoPostal: '',
    direccionIntervencion: { calle: '', ciudad: '', provincia: '', codigoPostal: '' },
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
 * Cierra el modal de vista previa del PDF.
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
  // Validaciones iniciales
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
  if (!algunaSemanaCompleta) { alert('Por favor, completa al menos una fecha o tipo de limpieza para alguna semana.'); return; }

   const limpiezaParaGuardar = { ...nuevaLimpieza.value };
  limpiezaParaGuardar.precioBruto = calculatedPrecioBrutoNueva.value;
  limpiezaParaGuardar.clienteId = nuevaLimpieza.value.clienteId;
  limpiezaParaGuardar.cliente = `${client.nombre} ${(client.apellido || '')}`.trim();
  limpiezaParaGuardar.fechaPago = nuevaLimpieza.value.fechaPago || null;

  for (let i = 1; i <= 5; i++) {
    const semanaKey = `semana${i}`;
    const semanaPrecioKey = `${semanaKey}precio`; // Clave del precio semanal

    limpiezaParaGuardar[semanaKey] = limpiezaParaGuardar[semanaKey] || null;
    limpiezaParaGuardar[semanaPrecioKey] = limpiezaParaGuardar[semanaPrecioKey] ?? null; // Asegura que se guarde el precio semanal (null si no está definido)

    limpiezaParaGuardar[`${semanaKey}Tipo`] = getLimpiezaTypeString(
      limpiezaParaGuardar[`${semanaKey}Exterior`],
      limpiezaParaGuardar[`${semanaKey}Interior`]
    );
    delete limpiezaParaGuardar[`${semanaKey}Exterior`];
    delete limpiezaParaGuardar[`${semanaKey}Interior`];
  }

  limpiezaParaGuardar.fechaPrincipalLimpieza = getEarliestSemanaDate(limpiezaParaGuardar);

  try {
    await databaseStore.addLimpieza(limpiezaParaGuardar);
    alert('Registro añadido con éxito!');
    // Resetea el formulario
    Object.assign(nuevaLimpieza.value, {
      cliente: '', clienteId: null,
      semana1: '', semana1Exterior: false, semana1Interior: false, semana1precio: null,
      semana2: '', semana2Exterior: false, semana2Interior: false, semana2precio: null,
      semana3: '', semana3Exterior: false, semana3Interior: false, semana3precio: null,
      semana4: '', semana4Exterior: false, semana4Interior: false, semana4precio: null,
      semana5: '', semana5Exterior: false, semana5Interior: false, semana5precio: null,
      formaPago: 'Efectivo', fechaPago: null,
    });
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

  isLoadingEdit.value = true; // Activa estado de carga local

  const dataToUpdate = {
    factura: editedLimpieza.value.factura,
    clienteId: editedLimpieza.value.clienteId,
    cliente: `${client.nombre} ${(client.apellido || '')}`.trim(),
    formaPago: editedLimpieza.value.formaPago,
    fechaPago: editedLimpieza.value.fechaPago || null,
    precioBruto: calculatedPrecioBrutoEdited.value,
  };

  for (let i = 1; i <= 5; i++) {
    const semanaKey = `semana${i}`;
    const semanaPrecioKey = `${semanaKey}precio`; // Clave del precio semanal

    dataToUpdate[semanaKey] = editedLimpieza.value[semanaKey] || null;
    dataToUpdate[semanaPrecioKey] = editedLimpieza.value[semanaPrecioKey] ?? null; // Asegura que se guarde el precio semanal

    dataToUpdate[`${semanaKey}Tipo`] = getLimpiezaTypeString(
      editedLimpieza.value[`${semanaKey}Exterior`],
      editedLimpieza.value[`${semanaKey}Interior`]
    );
  }
  dataToUpdate.fechaPrincipalLimpieza = getEarliestSemanaDate(editedLimpieza.value);

  try {
    await databaseStore.updateLimpieza(editingLimpiezaId.value, dataToUpdate);
    console.log("Limpieza actualizada con éxito.");
    closeEditModal();
  } catch (err) {
    alert('Error al guardar los cambios: ' + (databaseStore.updateLimpiezaError?.message || 'Desconocido'));
    console.error("Error guardando la limpieza editada:", err);
  } finally {
    isLoadingEdit.value = false; // Desactiva estado de carga local
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
    await databaseStore.fetchClientes(); // Recarga la lista para actualizar el select
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
  // Pasa los valores de los select locales a la acción del store
  databaseStore.fetchLimpiezas(selectedMonth.value, selectedYear.value);
};

/**
 * Resetea los filtros y carga todas las limpiezas.
 */
const resetFilter = () => {
  selectedMonth.value = '';
  selectedYear.value = '';
  console.log("Reseteando filtro, cargando todos los registros.");
  // Llama sin argumentos para cargar todos los registros (dentro de los límites de Firestore si no hay filtros)
  databaseStore.fetchLimpiezas();
};

// --- GENERACIÓN DE PDFs ---

/**
 * Genera el contenido PDF de una factura.
 */
const generateInvoicePdfContent = async (limpieza) => {
  let clientDetails = null;
  if (!limpieza.clienteId) { alert("La limpieza no tiene un clienteId asociado."); return null; }

  try {
    clientDetails = await databaseStore.fetchClientById(limpieza.clienteId);
    if (!clientDetails) { alert("Cliente no encontrado para la factura."); return null; }
  } catch (error) {
    alert("Error al obtener los detalles del cliente para la factura."); return null;
  }

  const doc = new jsPDF();
  const img = "src/assets/img/logo.png";

  // Configuración general del PDF
  doc.setFillColor(195, 228, 156); doc.rect(10, 220, 190, 60, "F");
  doc.setFillColor(195, 228, 156); doc.rect(10, 10, 190, 20, "F");
  doc.setDrawColor(0, 0, 0); doc.rect(10, 10, 190, 270);

  // Logo y título
  doc.addImage(img, 'png', 20, 10, 20, 23);
  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text("T O U C A N E T", 40, 20);
  doc.setFontSize(12); doc.text("Nettoyage des vitres", 41, 25);
  doc.setFontSize(20); doc.text("FACTURE", 130, 22);

  // Detalles de la empresa (traducción ajustada)
  doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text("Micro-emprendedor", 15, 42); doc.text("Diego Higuero (EI)", 15, 47);
  doc.text("12, rue d'Harcet", 15, 52); doc.text("64200 Biarritz", 15, 57);
  doc.text("06 58 80 24 03", 15, 62); doc.text("toucanet64@gmail.com", 15, 70);
  doc.text("www.toucanet.fr", 15, 77); doc.text("Nº SIREN: 977686641", 15, 82);
  doc.text("A pagar antes del: fecha de facturación + 6 día hábil (o según el acuerdo)", 15, 92);
  doc.text("Dirección de intervención (si es diferente de la dirección de facturación):", 15, 97);

  // Dirección de intervención del cliente
  let { calle, ciudad, provincia, codigoPostal } = clientDetails.direccionIntervencion || {};
  calle = calle || ''; ciudad = ciudad || ''; provincia = provincia || ''; codigoPostal = codigoPostal || '';

  doc.text(calle, 20, 102);
  let cityAndPostalCombined = '';
  if (codigoPostal && ciudad) cityAndPostalCombined = `${codigoPostal} ${ciudad}`;
  else if (codigoPostal) cityAndPostalCombined = codigoPostal;
  else if (ciudad) cityAndPostalCombined = ciudad;
  doc.text(cityAndPostalCombined, 20, 107);
  doc.text(provincia, 20, 112);

  // Detalles de la factura y cliente (traducción ajustada)
  doc.setFillColor(219, 219, 219); doc.rect(140, 42, 60, 7.5, "F");
  doc.rect(140, 42, 60, 15); doc.rect(140, 42, 60, 7.5); doc.rect(140, 42, 35, 15);
  doc.setFontSize(12); doc.text("FACTURA #", 146, 47); doc.text("FECHA", 182, 47);
  doc.setFontSize(10); doc.text(limpieza.factura.toString(), 147, 55);
  doc.text(dayjs().format('DD/MM/YYYY'), 180, 55); // Usa dayjs para la fecha actual

  doc.setFillColor(195, 228, 156); doc.rect(140, 69, 60, 28, "F");
  doc.setFillColor(219, 219, 219); doc.rect(140, 62, 60, 7.5, "F");
  doc.rect(140, 62, 60, 35); doc.rect(140, 62, 60, 7.5);
  doc.setFontSize(10); doc.text("FACTURAR A", 147, 67); doc.setFontSize(8);
  doc.text(`${clientDetails.nombre || ''} ${clientDetails.apellido || ''}`, 147, 75);
  doc.text(clientDetails.direccion || 'N/A', 147, 80);
  doc.text(`${clientDetails.codigoPostal || ''} ${clientDetails.ciudad || ''}`, 147, 85);
  doc.text(clientDetails.email || 'N/A', 147, 90);

  // Sección de descripción de servicios (traducción ajustada)
  doc.setFillColor(219, 219, 219); doc.rect(10, 120, 190, 7.5, "F");
  doc.rect(10, 120, 190, 7.5); doc.rect(10, 120, 100, 90); doc.rect(10, 120, 125, 90);
  doc.rect(10, 120, 140, 90); doc.rect(10, 120, 170, 90); doc.rect(10, 120, 170, 90);
  doc.rect(10, 120, 190, 90); doc.rect(10, 210, 125, 10); doc.rect(10, 210, 170, 10);
  doc.rect(10, 120, 190, 100); doc.setFontSize(8);
  doc.text("DESCRIPCIÓN", 15, 125); doc.text("FECHA", 117, 125);
  doc.text("CANT", 140, 125); doc.text("PRECIO UNITARIO SIN IMPUESTOS", 153, 125); doc.text("TOTAL SIN IMPUESTOS", 183, 125);

  // Detalles de las semanas de limpieza
  const extPrice = clientDetails.precioExterior || 0;
  const intPrice = clientDetails.precioInterior || 0;
  let currentY = 135;
  const lineGap = 5;
  let calculatedInvoiceTotal = 0;

  for (let i = 1; i <= 5; i++) {
    const semanaKey = `semana${i}`;
    const semanaTipo = limpieza[`${semanaKey}Tipo`];
    const fecha = limpieza[semanaKey];
    let descriptionText = '';
    let weeklyTotal = 0;

    if (semanaTipo === 'exterior') { descriptionText = `Limpieza exterior `; weeklyTotal = extPrice; }
    else if (semanaTipo === 'interior') { descriptionText = `Limpieza interior `; weeklyTotal = intPrice; }
    else if (semanaTipo === 'ambas') { descriptionText = `Limpieza exterior e interior`; weeklyTotal = extPrice + intPrice; }
    else { continue; }
    
    if (weeklyTotal > 0) {
      doc.text(descriptionText, 15, currentY);
      doc.text(formatEuropeanDate(fecha), 116, currentY);
      doc.text('1', 142, currentY);
      doc.text(formatCurrency(weeklyTotal), 159, currentY);
      doc.text(formatCurrency(weeklyTotal), 185, currentY);
      calculatedInvoiceTotal += weeklyTotal;
      currentY += lineGap;
    }
  }

  doc.setFontSize(10); doc.text("¡Muchas gracias!", 55, 216);
  doc.setFont("helvetica", "bold"); doc.text("TOTAL SIN IMPUESTOS", 160, 216);
  doc.text(formatCurrency(calculatedInvoiceTotal), 184, 216);

  // Información legal (traducción ajustada)
  doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text("Toucanet tiene un seguro de responsabilidad civil profesional.", 15, 226);
  doc.setFont("helvetica", "bold"); doc.text("Términos de pago:", 15, 231);
  doc.setFont("helvetica", "normal"); doc.text("Transferencia bancaria, cheque, efectivo. Pago en una", 48, 231);
  doc.text("sola vez dentro de los 6 días hábiles posteriores a la emisión de la factura.", 15, 236);
  doc.text("Titular de la cuenta:", 25, 241); doc.setFont("helvetica", "italic"); doc.text("DIEGO HIGUERO RUIZ", 53, 241);
  doc.setFont("helvetica", "normal"); doc.text("Nombre del banco:", 25, 246); doc.setFont("helvetica", "italic"); doc.text("Caisse d'Epargne", 53, 246);
  doc.setFont("helvetica", "normal"); doc.text("Código IBAN:", 25, 251); doc.setFont("helvetica", "italic"); doc.text("FR76 1333 5000 4008 0026 8561 397", 53, 251);
  doc.setFont("helvetica", "normal"); doc.text("BIC:", 25, 256); doc.setFont("helvetica", "italic"); doc.text("13335 00040 08002685613 97", 53, 256);
  doc.text("En caso de retraso en el pago, se aplicará una compensación a tanto alzado por gastos de", 15, 265);
  doc.text("recuperación de 40€ según", 15, 270); doc.setFont("helvetica", "italic"); doc.text("el artículo L.441-5 del Código de Comercio", 50, 270);

  // Total a pagar (traducción ajustada)
  doc.rect(135, 225, 65, 15); doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.text("TOTAL A PAGAR (IVA incluido):", 140, 232);
  doc.setFontSize(12); doc.text(formatCurrency(calculatedInvoiceTotal), 180, 232);
  doc.setFont("helvetica", "italic"); doc.setFontSize(7); doc.text("IVA no aplicable - artículo 293 B del CGI", 140, 238);
  doc.text("Mediador del consumidor:", 140, 255); doc.text("CM2C cm2c.net", 145, 258);
  doc.text("14 rue Saint-Jean", 145, 261); doc.text("75017 París", 145, 264); doc.text("06 09 20 48 86", 145, 267);

  return doc;
};

/**
 * Genera y muestra una vista previa del PDF de la factura.
 */
const previewFactura = async (limpieza) => {
  const doc = await generateInvoicePdfContent(limpieza);
  if (doc) {
    pdfPreviewUrl.value = doc.output('datauristring');
    isPreviewModalOpen.value = true;
  }
};

/**
 * Descarga el PDF de la factura.
 */
const downloadFactura = async (limpieza) => {
  const doc = await generateInvoicePdfContent(limpieza);
  if (doc) {
    doc.save(`factura_${limpieza.factura}_${limpieza.cliente}.pdf`);
  }
};

/**
 * Wrapper para generar y descargar el PDF de la factura (para el botón de tabla).
 */
const facturaPdf = async (limpieza) => {
  await downloadFactura(limpieza);
};

/**
 * Genera un PDF resumen de todas las limpiezas en la tabla.
 */
const handleGeneratePdf = async () => {
  isGeneratingPdf.value = true;
  try {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("Resumen de Registros de Limpiezas", 14, 22);
    doc.setFontSize(11); doc.setTextColor(100);

    const headers = [
      "Factura #", "Cliente", "Sem.1", "Sem.2", "Sem.3", "Sem.4", "Sem.5",
      "Bruto (€)", "Neto (€)", "Cot. (€)", "Fecha Pago", "Estado", "Forma Pago"
    ];

    const data = databaseStore.limpiezas.map(limpieza => {
      const getShortWeekType = (semanaTipo) => {
        if (semanaTipo === 'exterior') return 'E';
        if (semanaTipo === 'interior') return 'I';
        if (semanaTipo === 'ambas') return 'E+I';
        return '';
      };

      return [
        limpieza.factura,
        limpieza.cliente,
        (limpieza.semana1 ? formatEuropeanDate(limpieza.semana1) : '') + (limpieza.semana1Tipo ? ` (${getShortWeekType(limpieza.semana1Tipo)})` : ''),
        (limpieza.semana2 ? formatEuropeanDate(limpieza.semana2) : '') + (limpieza.semana2Tipo ? ` (${getShortWeekType(limpieza.semana2Tipo)})` : ''),
        (limpieza.semana3 ? formatEuropeanDate(limpieza.semana3) : '') + (limpieza.semana3Tipo ? ` (${getShortWeekType(limpieza.semana3Tipo)})` : ''),
        (limpieza.semana4 ? formatEuropeanDate(limpieza.semana4) : '') + (limpieza.semana4Tipo ? ` (${getShortWeekType(limpieza.semana4Tipo)})` : ''),
        (limpieza.semana5 ? formatEuropeanDate(limpieza.semana5) : '') + (limpieza.semana5Tipo ? ` (${getShortWeekType(limpieza.semana5Tipo)})` : ''),
        formatCurrency(limpieza.precioBruto),
        formatCurrency(calculatePrecioNeto(limpieza.precioBruto)),
        formatCurrency(calculateCotizacion(limpieza.precioBruto)),
        limpieza.fechaPago ? formatEuropeanDate(limpieza.fechaPago) : 'Pendiente',
        limpieza.fechaPago ? 'Pagado' : 'Pendiente',
        limpieza.formaPago || ''
      ];
    });

    // Call autoTable as a function and capture its return value
    const tableResult = autoTable(doc, {
      head: [headers],
      body: data,
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [195, 228, 156], textColor: [0, 0, 0], fontStyle: 'bold' },
    });

    // Get the final Y position from the tableResult object
    const finalY = tableResult.finalY;

    // Add the summary text using the finalY from the table
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Bruto: ${formatCurrency(totalsSummary.value.totalBruto)}`, 14, finalY + 10);
    doc.text(`Total Neto: ${formatCurrency(totalsSummary.value.totalNeto)}`, 14, finalY + 15);
    doc.text(`Total Cotización: ${formatCurrency(totalsSummary.value.totalCotizacion)}`, 14, finalY + 20);

    doc.save(`resumen_limpiezas_${dayjs().format('DD-MM-YYYY')}.pdf`); // Usa dayjs para la fecha del nombre del archivo
  } catch (error) {
    console.error("Error al generar el PDF de resumen:", error);
    alert("Hubo un error al generar el PDF de resumen. Por favor, inténtalo de nuevo.");
  } finally {
    isGeneratingPdf.value = false;
  }
};


// --- LIFECYCLE HOOKS ---

onMounted(async () => {
  const currentMonth = now.getMonth().toString();
  const currentYear = now.getFullYear().toString();

  selectedMonth.value = currentMonth;
  selectedYear.value = currentYear;

  // Cargar datos iniciales
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
    background-color: #28a745; /* Color verde */
    border-color: #28a745;
    color: white;
}

.btn-sm.btn-danger {
    background-color: #dc3545; /* Color rojo */
    border-color: #dc3545;
    color: white;
}

/* --- Estilos Generales de Tabla --- */
.table-responsive {
  overflow-x: auto; /* Permite el scroll horizontal si la tabla es muy ancha */
}

.table {
  width: 100%; /* Asegura que la tabla ocupe todo el ancho disponible */
  border-collapse: collapse; /* Para un borde más limpio entre celdas */
}

/* --- Solución para el Número de Factura no Cortado --- */
/* Apunta a la primera columna (Factura #) en th y td */
.table th:nth-child(1),
.table td:nth-child(1) {
  min-width: 100px; /* Un ancho mínimo para asegurar espacio, ajusta si es necesario */
  white-space: nowrap; /* Evita que el texto de la factura se rompa en múltiples líneas */
  word-break: keep-all; /* Mantiene la palabra completa si no cabe */
}

/* --- Solución para Centrado Vertical General en Todas las Celdas (Texto y Contenido Simple) --- */
.table th,
.table td {
  vertical-align: middle; /* Alinea verticalmente al medio */
}

/* --- Centrado Vertical para Iconos de Acciones (Contenedores Flex) --- */
/* Este selector apunta específicamente a la celda que contiene los botones de acción.
   Asegura que el contenido (los botones) se centre verticalmente dentro de la celda,
   que es un contenedor flex debido a las clases de Bootstrap como 'd-flex'. */
.table tbody tr td.d-flex { /* Apunta a cualquier td que tenga la clase d-flex */
  align-items: center; /* Centra los elementos flex directos (tus botones) */
  /* Los justify-content y gap-2 de Bootstrap ya deberían funcionar si los tienes en el HTML.
     Si no, podrías forzarlos aquí:
     justify-content: space-around;
     gap: 0.5rem;
  */
}

/* --- Estilos para Resaltar Filas con Discrepancia de Pago --- */
/* Se utiliza .bg-danger-subtle de Bootstrap, pero se asegura su aplicación */
.bg-danger-subtle {
    background-color: #f8d7da !important; /* Asegura el color de fondo suave de Bootstrap para peligro/advertencia */
}
.table-striped tbody tr.bg-danger-subtle > td {
    background-color: #f8d7da !important; /* Asegura el fondo para las celdas individuales en filas stripe */
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
  z-index: 1050;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  opacity: .5; /* Asegura la opacidad del fondo */
}

/* Las transiciones 'fade' y 'show' son manejadas por Bootstrap */
/* .modal-backdrop.fade { opacity: 0; } */
/* .modal-backdrop.show { opacity: .5; } */


/* El modal-content y modal-dialog son manejados por las clases de Bootstrap */
/* Si necesitas personalización, podrías añadir reglas aquí */
</style>