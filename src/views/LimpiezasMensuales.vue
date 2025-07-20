<template>
  <div class="container mt-4">
    <h2 class="mb-4 bg-white p-4 text-center">Registro Mensual de Limpiezas</h2>
    <!-- Formulario para añadir nueva limpieza -->
    <div class="card mb-4">
      <div class="card-header">
        Añadir Nueva Limpieza (Factura #{{ proximaFactura }})
      </div>
      <div class="card-body">
        <form @submit.prevent="agregarLimpieza">
          <div class="row g-3">
            <div class="col-md-4">
              <label for="cliente" class="form-label">Cliente</label>
                <select id="cliente" class="form-select" v-model="nuevaLimpieza.cliente" required>
                <option value="" disabled>Seleccione un cliente</option>
                <option v-if="databaseStore.isLoadingClientes">Cargando clientes...</option>
                <option v-if="databaseStore.errorClientes" disabled>Error al cargar clientes</option>
                <option v-for="cliente in databaseStore.clientes" :key="cliente.id" :value="cliente.nombre">
                  {{ cliente.nombre }}
                </option>
                <!-- Opción para añadir uno nuevo si no está en la lista (opcional, si quieres esa funcionalidad) -->
                <!-- <option value="OTRO_NUEVO_CLIENTE">Añadir nuevo cliente...</option> -->
              </select>
              <button type="button" class="btn btn-info text-white btn-sm mt-2" @click="openAddClientModal">
                Añadir Cliente
              </button>
            </div>
             <div class="col-md-2">
              <label for="semana1" class="form-label">Semana 1 </label>
              <input type="date" class="form-control" id="semana1" v-model="nuevaLimpieza.semana1" >
              <!-- INICIO CAMBIO: Botones para Semana 1 -->
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
              <!-- FIN CAMBIO: Botones para Semana 1 -->
            </div>
            <div class="col-md-2">
              <label for="semana2" class="form-label">Semana 2 </label>
              <input type="date" class="form-control" id="semana2" v-model="nuevaLimpieza.semana2">
              <!-- INICIO CAMBIO: Botones para Semana 2 -->
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
              <!-- FIN CAMBIO: Botones para Semana 2 -->
            </div>
             <div class="col-md-2">
              <label for="semana3" class="form-label">Semana 3 </label>
              <input type="date" class="form-control" id="semana3" v-model="nuevaLimpieza.semana3">
              <!-- INICIO CAMBIO: Botones para Semana 3 -->
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
              <!-- FIN CAMBIO: Botones para Semana 3 -->
            </div>
             <div class="col-md-2">
              <label for="semana4" class="form-label">Semana 4 </label>
              <input type="date" class="form-control" id="semana4" v-model="nuevaLimpieza.semana4">
              <!-- INICIO CAMBIO: Botones para Semana 4 -->
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
              <!-- FIN CAMBIO: Botones para Semana 4 -->
            </div>
             <div class="col-md-2">
              <label for="semana5" class="form-label">Semana 5 </label>
              <input type="date" class="form-control" id="semana5" v-model="nuevaLimpieza.semana5">
              <!-- INICIO CAMBIO: Botones para Semana 5 -->
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
              <!-- FIN CAMBIO: Botones para Semana 5 -->
            </div>
            <div class="col-md-3">
               <label for="precioBruto" class="form-label">Precio Bruto (€)</label>
               <input type="number" step="0.01" class="form-control" id="precioBruto" v-model.number="nuevaLimpieza.precioBruto">
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
            <div class="col-12">
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                {{ isLoading ? 'Guardando...' : 'Añadir Registro' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
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
             <!-- Iteramos sobre la computed property availableYears -->
            <select id="filterYear" class="form-select" v-model="selectedYear">
              <option value="">Todos los años</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
           <div class="col-md-4 d-grid">
             <!-- Botón para aplicar el filtro, llama al método applyFilter -->
             <button class="btn btn-secondary" @click="applyFilter">Aplicar Filtro</button>
          </div>
           <div class="col-md-12 d-grid">
              <!-- Botón para resetear el filtro, llama al método resetFilter -->
             <button class="btn btn-outline-secondary" @click="resetFilter">Mostrar Todos</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Lista de Limpiezas -->
    <div class="card mt-4">
       <div class="card-header d-flex align-items-center">
        <!-- El texto "Registros Existentes" se mantiene a la izquierda por defecto en un contenedor flex -->
        <h3 class="mb-0">Registro </h3> 
        
        <!-- Este div tomará el espacio restante y centrará su contenido -->
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
      <div v-if="isLoading && databaseStore.limpiezas.length === 0" class="alert alert-info">
        Cargando registros...
      </div>
       <div v-else-if="error" class="alert alert-danger">
        Error al cargar los registros: {{ error.message }}
      </div>
      <!-- Mostrar la tabla si no hay error y ha cargado datos -->
      <div class="card-body" v-else-if="databaseStore.limpiezas.length > 0">
        
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
                <!-- **NUEVA COLUMNA para acciones** -->
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
                      <tr v-for="limpieza in databaseStore.limpiezas" :key="limpieza.id">
                <td>{{ limpieza.factura }}</td>
                <td>{{ limpieza.cliente }}</td>
                <td class="text-center">
                  {{ limpieza.semana1 }}
                  <br v-if="limpieza.semana1Tipo" /> <!-- Solo salta línea si hay tipo -->
                  <!-- Badges para Semana 1 -->
                  <span v-if="limpieza.semana1Tipo === 'exterior' || limpieza.semana1Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                  <span v-if="limpieza.semana1Tipo === 'interior' || limpieza.semana1Tipo === 'ambas'" class="badge bg-secondary">I</span>
                </td>
                <td class="text-center">
                  {{ limpieza.semana2 }}
                  <br v-if="limpieza.semana2Tipo" />
                  <!-- Badges para Semana 2 -->
                  <span v-if="limpieza.semana2Tipo === 'exterior' || limpieza.semana2Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                  <span v-if="limpieza.semana2Tipo === 'interior' || limpieza.semana2Tipo === 'ambas'" class="badge bg-secondary">I</span>
                </td>
                <td class="text-center">
                  {{ limpieza.semana3 }}
                  <br v-if="limpieza.semana3Tipo" />
                  <!-- Badges para Semana 3 -->
                  <span v-if="limpieza.semana3Tipo === 'exterior' || limpieza.semana3Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                  <span v-if="limpieza.semana3Tipo === 'interior' || limpieza.semana3Tipo === 'ambas'" class="badge bg-secondary">I</span>
                </td>
                <td class="text-center">
                  {{ limpieza.semana4 }}
                  <br v-if="limpieza.semana4Tipo" />
                  <!-- Badges para Semana 4 -->
                  <span v-if="limpieza.semana4Tipo === 'exterior' || limpieza.semana4Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                  <span v-if="limpieza.semana4Tipo === 'interior' || limpieza.semana4Tipo === 'ambas'" class="badge bg-secondary">I</span>
                </td>
                <td class="text-center">
                  {{ limpieza.semana5 }}
                  <br v-if="limpieza.semana5Tipo" />
                  <!-- Badges para Semana 5 -->
                  <span v-if="limpieza.semana5Tipo === 'exterior' || limpieza.semana5Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                  <span v-if="limpieza.semana5Tipo === 'interior' || limpieza.semana5Tipo === 'ambas'" class="badge bg-secondary">I</span>
                </td>
                <td>{{ formatCurrency(limpieza.precioBruto) }}</td>
                <td><strong>{{ formatCurrency(calculatePrecioNeto(limpieza.precioBruto)) }}</strong></td>
                <td>{{ formatCurrency(calculateCotizacion(limpieza.precioBruto)) }}</td>
                <td>{{ limpieza.fechaPago }}</td>
                <td>
                   <span :class="{'badge bg-success': limpieza.fechaPago, 'badge bg-warning text-dark': !limpieza.fechaPago}">
                      {{ limpieza.fechaPago ? 'Pagao' : 'Pendiente' }}
                   </span>
                </td>
                <td>{{ limpieza.formaPago }}</td>
                 <td class="d-flex justify-content-around">
                   <button @click="openEditModal(limpieza)" class="btn  btn-sm btn-secondary">Editar</button>
                   <button @click="confirmDelete(limpieza)" class="btn btn-sm btn-danger">Eliminar</button>
                 </td>
              </tr>
            </tbody>
             <tfoot>
              <tr>
                <!-- Celda que abarca las primeras 7 columnas (Factura # a Semana 5) -->
                <td colspan="7"><strong>Totales:</strong></td>
                <!-- Celda para el Total Bruto -->
                <td>{{ formatCurrency(totalsSummary.totalBruto) }}</td>
                <!-- Celda para el Total Neto -->
                <td><strong>{{ formatCurrency(totalsSummary.totalNeto) }}</strong></td>
                <!-- Celda para la Total Cotización -->
                <td>{{ formatCurrency(totalsSummary.totalCotizacion) }}</td>
                <!-- Celda que abarca las últimas 4 columnas (Fecha Pago a Acciones) -->
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

    <!-- **ESTRUCTURA DEL MODAL DE EDICIÓN (con clases de Bootstrap)** -->
    <!-- Usamos v-if para controlar si el modal está visible -->
    <div v-if="isEditModalOpen" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="editModalLabel" aria-modal="true" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Editar Registro (Factura #{{ editedLimpieza.factura }}) </h5>
            <button type="button" class="btn-close" @click="closeEditModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Formulario de edición dentro del modal -->
             <form @submit.prevent="saveEditedLimpieza">
                <h5>{{ editedLimpieza.cliente }}</h5>
                  <div class="col-md-6">
                    <label for="edit-semana1" class="form-label">Semana 1 </label>
                    <input type="date" class="form-control" id="edit-semana1" v-model="editedLimpieza.semana1">
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
                    <input type="date" class="form-control" id="edit-semana2" v-model="editedLimpieza.semana2">
                    <!-- INICIO CAMBIO: Botones para Semana 2 en el modal -->
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
                    <!-- FIN CAMBIO: Botones para Semana 2 en el modal -->
                  </div>

                   <div class="col-md-6">
                    <label for="edit-semana3" class="form-label">Semana 3 </label>
                    <input type="date" class="form-control" id="edit-semana3" v-model="editedLimpieza.semana3">
                    <!-- INICIO CAMBIO: Botones para Semana 3 en el modal -->
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
                    <!-- FIN CAMBIO: Botones para Semana 3 en el modal -->
                  </div>

                   <div class="col-md-6">
                    <label for="edit-semana4" class="form-label">Semana 4 </label>
                    <input type="date" class="form-control" id="edit-semana4" v-model="editedLimpieza.semana4">
                    <!-- INICIO CAMBIO: Botones para Semana 4 en el modal -->
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
                    <!-- FIN CAMBIO: Botones para Semana 4 en el modal -->
                  </div>

                   <div class="col-md-6">
                    <label for="edit-semana5" class="form-label">Semana 5 </label>
                    <input type="date" class="form-control" id="edit-semana5" v-model="editedLimpieza.semana5">
                    <!-- INICIO CAMBIO: Botones para Semana 5 en el modal -->
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
                    <!-- FIN CAMBIO: Botones para Semana 5 en el modal -->
                  <div class="col-md-6">
                     <label for="edit-precioBruto" class="form-label">Precio Bruto (€)</label>
                     <input type="number" step="0.01" class="form-control" id="edit-precioBruto" v-model.number="editedLimpieza.precioBruto">
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
                </div>
             </form>
              <div class="mt-3" v-if="editedLimpieza.precioBruto > 0">
                <p><strong>Precio Neto (23.2%):</strong> {{ formatCurrency(calculatePrecioNeto(editedLimpieza.precioBruto)) }}</p>
                <p><strong>Cotización (Restante):</strong> {{ formatCurrency(calculateCotizacion(editedLimpieza.precioBruto)) }}</p>
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancelar</button>
            <!-- Deshabilitamos el botón si está cargando la edición (estado local) o actualizando (estado store) -->
            <button type="button" class="btn btn-primary" @click="saveEditedLimpieza" :disabled="isLoadingEdit || databaseStore.isUpdating">
               {{ isLoadingEdit || databaseStore.isUpdating ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>
      </div>
    </div>
     <!-- Overlay para el modal -->
     <!-- Usamos v-if para mostrar el overlay solo cuando el modal está abierto -->
     <div v-if="isEditModalOpen" class="modal-backdrop fade show"></div>
<!-- NUEVO: Estructura del Modal para Añadir Cliente -->
<div v-if="isAddClientModalOpen" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="addClientModalLabel" aria-modal="true" role="dialog">
  <div class="modal-dialog modal-lg"> <!-- Modal más grande para contener más campos -->
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="addClientModalLabel">Añadir Nuevo Cliente</h5>
        <button type="button" class="btn-close" @click="closeAddClientModal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="saveNewClient">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="new-client-nombre" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="new-client-nombre" v-model="newClient.nombre" required>
            </div>
            <div class="col-md-6">
              <label for="new-client-apellido" class="form-label">Apellido</label>
              <input type="text" class="form-control" id="new-client-apellido" v-model="newClient.apellido" required>
            </div>
            <div class="col-12">
              <label for="new-client-direccion" class="form-label">Dirección</label>
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
             <div class="col-md-4"> <!-- ¡NUEVO CAMPO! -->
              <label for="new-client-codigo-postal" class="form-label">Código Postal</label>
              <input type="text" class="form-control" id="new-client-codigo-postal" v-model="newClient.codigoPostal">
            </div>
            <div class="col-md-6">
              <label for="new-client-telefono" class="form-label">Teléfono</label>
              <input type="tel" class="form-control" id="new-client-telefono" v-model="newClient.telefono">
            </div>
            <div class="col-md-6">
              <label for="new-client-email" class="form-label">Email</label>
              <input type="email" class="form-control" id="new-client-email" v-model="newClient.email">
            </div>
            <!-- Botón de submit dentro del formulario si se envía con @submit.prevent -->
            <!-- Aquí el botón de "Guardar Cliente" está en el footer, por lo que no es necesario aquí. -->
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

<!-- NUEVO: Overlay para el modal de Añadir Cliente -->
<div v-if="isAddClientModalOpen" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useDatabaseStore } from "../stores/database";
import { jsPDF } from "jspdf";
// Asegúrate de importar 'jspdf-autotable' así para que extienda jsPDF
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable'
const isGeneratingPdf = ref(false);
const databaseStore = useDatabaseStore();
// Estados de carga y error del store para la carga inicial y añadir 
const isLoading = computed(() => databaseStore.isLoading);
const error = computed(() => databaseStore.error);

// Datos reactivos para el formulario de nueva limpieza 
const nuevaLimpieza = ref({
  cliente: '',
  semana1: '',
  semana1Exterior: false, // ¡Nuevo!
  semana1Interior: false, // ¡Nuevo!
  semana2: '',
  semana2Exterior: false, // ¡Nuevo!
  semana2Interior: false, // ¡Nuevo!
  semana3: '',
  semana3Exterior: false, // ¡Nuevo!
  semana3Interior: false, // ¡Nuevo!
  semana4: '',
  semana4Exterior: false, // ¡Nuevo!
  semana4Interior: false, // ¡Nuevo!
  semana5: '',
  semana5Exterior: false, // ¡Nuevo!
  semana5Interior: false, // ¡Nuevo!
  precioBruto: null,
  formaPago: 'Efectivo',
  fechaPago: null,
});
const isAddClientModalOpen = ref(false);
const isSavingNewClient = ref(false); // Para el estado de carga del botón del modal

const newClient = ref({
  nombre: '',
  apellido: '',
  direccion: '',
  ciudad: '',
  provincia: '',
  codigoPostal: '',
  telefono: '',
  email: '',
});
// Añadimos el estado de error específico del store para la actualización
// Inicializamos editedLimpieza con estructura para evitar errores de acceso a propiedades
// Asegúrate de que los valores iniciales sean null o el tipo esperado para v-model
const editedLimpieza = ref({
  id: null, // Necesitaremos el ID para actualizar
  factura: null, // Puedes inicializarlo con 0 o null
  cliente: '',
  semana1: '',
  semana1Exterior: false, // ¡Nuevo!
  semana1Interior: false, // ¡Nuevo!
  semana2: '',
  semana2Exterior: false, // ¡Nuevo!
  semana2Interior: false, // ¡Nuevo!
  semana3: '',
  semana3Exterior: false, // ¡Nuevo!
  semana3Interior: false, // ¡Nuevo!
  semana4: '',
  semana4Exterior: false, // ¡Nuevo!
  semana4Interior: false, // ¡Nuevo!
  semana5: '',
  semana5Exterior: false, // ¡Nuevo!
  semana5Interior: false, // ¡Nuevo!
  precioBruto: null,
  formaPago: 'Efectivo',
  fechaPago: null,
});
// const updateError = computed(() => databaseStore.updateError); // Ya lo usamos directo en el template

// Obtener el próximo número de factura usando el getter del store 
const proximaFactura = computed(() => databaseStore.nextFacturaFormatted);

// Estados para el modal de edición
const isEditModalOpen = ref(false);

// Inicializamos con la fecha actual por defecto
const now = new Date();
const selectedMonth = ref(now.getMonth().toString()); // getMonth() es 0-indexed, lo guardamos como string para el select
const selectedYear = ref(now.getFullYear().toString()); // getFullYear() es el año completo, lo guardamos como string

// Genera dinámicamente una lista de años disponibles
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  // Puedes ajustar el rango de años según necesites, por ejemplo, 5 años antes y 5 después
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
});
const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// ... (tus otras variables y propiedades computadas existentes)

// NUEVA PROPIEDAD COMPUTADA: Genera el resumen del filtro para mostrar en el título
const displayFilterSummary = computed(() => {
  let monthText = '';
  let yearText = '';

  // Formatear el mes
  if (selectedMonth.value === '') {
    monthText = 'Todos los meses';
  } else {
    // selectedMonth.value es un string como '0', '1', etc.
    monthText = monthNames[parseInt(selectedMonth.value)];
  }

  // Formatear el año
  if (selectedYear.value === '') {
    yearText = 'Todos los años';
  } else {
    yearText = selectedYear.value;
  }

  // Combinar el texto del mes y el año
  if (selectedMonth.value === '' && selectedYear.value === '') {
    return 'Todos los registros'; // Si no hay filtros, muestra esto
  } else if (selectedMonth.value !== '' && selectedYear.value !== '') {
    return ` ${monthText} - ${yearText}`; // Ejemplo: "de Enero de 2024"
  } else if (selectedMonth.value !== '') {
    return ` ${monthText}`; // Ejemplo: "de Enero"
  } else { // selectedYear.value !== ''
    return `del año ${yearText}`; // Ejemplo: "del año 2024"
  }
});
const applyFilter = () => {
  // Llama a la acción del store para cargar los datos filtrados
  // selectedMonth y selectedYear ya están en el formato correcto (string '0'-'11' o 'YYYY', o '')
  console.log("Aplicando filtro:", { month: selectedMonth.value, year: selectedYear.value });
  // Pasar los valores tal cual. El store se encargará de convertirlos a number si es necesario
  databaseStore.fetchLimpiezas(selectedMonth.value, selectedYear.value);
};

// Resetea los filtros y carga todos los datos
const resetFilter = () => {
  selectedMonth.value = ''; // Resetea el mes a "Todos"
  selectedYear.value = '';  // Resetea el año a "Todos"
  console.log("Reseteando filtro, cargando todos los registros.");
  databaseStore.fetchLimpiezas(); // Llama a fetchLimpiezas sin argumentos para cargar todo
};
// Calcula el precio neto (23.2% del precio bruto)
// Calcula la cotización (23.2% del precio bruto)
const calculateCotizacion = (precioBruto) => {
  // Asegura que precioBruto es un número y es positivo
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) {
    return 0;
  }
  // Calcula el 23.2% y redondea a 2 decimales
  return parseFloat((brute * 0.232).toFixed(2));
};

// Calcula el precio neto (precio bruto - cotización)
const calculatePrecioNeto = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) {
    return 0;
  }
  const cotizacion = calculateCotizacion(brute);
  // Calcula el resto y redondea a 2 decimales
  return parseFloat((brute - cotizacion).toFixed(2));
};
const totalsSummary = computed(() => {
  let totalBruto = 0;
  let totalNeto = 0;
  let totalCotizacion = 0;

  databaseStore.limpiezas.forEach(limpieza => {
    // Asegúrate de que precioBruto es un número válido antes de sumarlo y calcular net/cotiz
    const bruto = Number(limpieza.precioBruto);
    if (!isNaN(bruto) && bruto > 0) {
      totalBruto += bruto;
      totalNeto += calculatePrecioNeto(bruto); // Suma el neto calculado para esta fila
      totalCotizacion += calculateCotizacion(bruto); // Suma la cotización calculada para esta fila
    }
  });

  // Retorna los totales redondeados a 2 decimales si es necesario (las funciones calculate ya redondean)
  return {
    totalBruto: parseFloat(totalBruto.toFixed(2)),
    totalNeto: parseFloat(totalNeto.toFixed(2)),
    totalCotizacion: parseFloat(totalCotizacion.toFixed(2)),
  };
});
// Formatea un número como moneda (€)
const formatCurrency = (value) => {
  const numberValue = Number(value);
   if (isNaN(numberValue)) {
     return ''; // O podrías devolver '0.00 €' si prefieres
   }
   // Usar Intl.NumberFormat para formateo de moneda
   return new Intl.NumberFormat('es-ES', {
     style: 'currency',
     currency: 'EUR',
     minimumFractionDigits: 2,
     maximumFractionDigits: 2,
   }).format(numberValue);
};
const editingLimpiezaId = ref(null); // null como valor inicial
// Estado de carga específico para la acción de guardar edición en el componente
// Aunque el store tiene isUpdating, a veces es útil tener uno local para deshabilitar el botón
const isLoadingEdit = ref(false);
// Función para añadir una nueva limpieza 

// Función para abrir y cerrar el modal
/**
// NUEVA FUNCIÓN: Maneja el toggle de los botones Exterior/Interior
/**
 * @param {string} semanaKey Ej: 'semana1', 'semana2'
 * @param {('exterior'|'interior')} tipo Ej: 'exterior', 'interior'
 * @param {Object} targetObject Recibe el objeto directamente (editedLimpieza.value)
 */
const toggleSemanaType = (semanaKey, tipo, targetObject) => {
  console.log('--- Inicia toggleSemanaType ---');
  console.log('Argumento targetObject (recibido):', targetObject); // Esto será tu Proxy(Object)

  // Ya no necesitamos la comprobación de targetRef.value, porque targetObject YA ES el objeto.
  // Solo una comprobación básica para asegurarnos de que es un objeto válido.
  if (!targetObject || typeof targetObject !== 'object') {
    console.error(`ERROR: targetObject no es un objeto válido. Recibido: ${targetObject}`);
    console.error('Asegúrate de que estás pasando un objeto reactivo como el tercer argumento.');
    return;
  }

  const exteriorKey = `${semanaKey}Exterior`;
  const interiorKey = `${semanaKey}Interior`;

  if (tipo === 'exterior') {
    // Aquí usamos targetObject directamente, sin .value
    if (Object.prototype.hasOwnProperty.call(targetObject, exteriorKey)) {
        targetObject[exteriorKey] = !targetObject[exteriorKey];
    } else {
        console.warn(`Advertencia: La propiedad '${exteriorKey}' no existe en el objeto para modificar.`);
        return;
    }

    // Lógica para limpiar/establecer la fecha
    if (!targetObject[exteriorKey] && !targetObject[interiorKey]) {
        targetObject[semanaKey] = ''; // Limpia la fecha si ambos están desactivados
    } else if (targetObject[exteriorKey] || targetObject[interiorKey]) {
        if (!targetObject[semanaKey]) {
            targetObject[semanaKey] = new Date().toISOString().split('T')[0];
        }
    }

  } else if (tipo === 'interior') {
    // Aquí usamos targetObject directamente, sin .value
    if (Object.prototype.hasOwnProperty.call(targetObject, interiorKey)) {
        targetObject[interiorKey] = !targetObject[interiorKey];
    } else {
        console.warn(`Advertencia: La propiedad '${interiorKey}' no existe en el objeto para modificar.`);
        return;
    }

    // Lógica para limpiar/establecer la fecha
    if (!targetObject[exteriorKey] && !targetObject[interiorKey]) {
        targetObject[semanaKey] = ''; // Limpia la fecha si ambos están desactivados
    } else if (targetObject[exteriorKey] || targetObject[interiorKey]) {
        if (!targetObject[semanaKey]) {
            targetObject[semanaKey] = new Date().toISOString().split('T')[0];
        }
    }
  }
  console.log('Objeto targetObject después de la modificación:', targetObject);
  console.log('--- Finaliza toggleSemanaType ---');
};


/**
 * NUEVA FUNCIÓN: Construye la cadena de tipo de limpieza (exterior, interior, ambas, null)
 * @param {boolean} isExterior
 * @param {boolean} isInterior
 * @returns {string|null}
 */
const getLimpiezaTypeString = (isExterior, isInterior) => {
  if (isExterior && isInterior) {
    return 'ambas';
  } else if (isExterior) {
    return 'exterior';
  } else if (isInterior) {
    return 'interior';
  }
  return null; // Si ninguna está seleccionada
};

// Función para añadir una nueva limpieza 
const agregarLimpieza = async () => {
  const clienteCompleto = nuevaLimpieza.value.cliente && nuevaLimpieza.value.cliente.trim() !== '';
  
  let algunaSemanaCompleta = false;
  for (let i = 1; i <= 5; i++) {
    if (nuevaLimpieza.value[`semana${i}`] || nuevaLimpieza.value[`semana${i}Exterior`] || nuevaLimpieza.value[`semana${i}Interior`]) {
      algunaSemanaCompleta = true;
      break;
    }
  }

  if (!clienteCompleto || !algunaSemanaCompleta) {
    alert('Por favor, completa al menos el nombre del cliente y una fecha o tipo de limpieza para alguna semana.');
    return;
  }
  const limpiezaParaGuardar = { ...nuevaLimpieza.value };

  // 2. Ajusta las propiedades específicas y calcula los campos 'semanaXTipo'
  limpiezaParaGuardar.cliente = nuevaLimpieza.value.cliente.trim();
  limpiezaParaGuardar.precioBruto = nuevaLimpieza.value.precioBruto > 0 ? nuevaLimpieza.value.precioBruto : null;
  limpiezaParaGuardar.fechaPago = nuevaLimpieza.value.fechaPago || null; // Asegura que sea null si está vacío

  // Itera sobre las semanas para asegurar que las fechas vacías son null
  // y para calcular el campo 'semanaXTipo' que es el que se guarda
  for (let i = 1; i <= 5; i++) {
    const semanaKey = `semana${i}`;
    const exteriorKey = `${semanaKey}Exterior`;
    const interiorKey = `${semanaKey}Interior`;

    limpiezaParaGuardar[semanaKey] = limpiezaParaGuardar[semanaKey] || null; // Convertir '' a null

    // Calcula el tipo de limpieza (exterior, interior, ambas, null) para guardar
    limpiezaParaGuardar[`${semanaKey}Tipo`] = getLimpiezaTypeString(
      limpiezaParaGuardar[exteriorKey],
      limpiezaParaGuardar[interiorKey]
    );

    // Opcional: Elimina las propiedades booleanas individuales si solo vas a guardar 'semanaXTipo'
    // Esto hace tu documento de Firestore más limpio.
    delete limpiezaParaGuardar[exteriorKey];
    delete limpiezaParaGuardar[interiorKey];
  }
  // ... (resto de la preparación de limpiezaParaGuardar para las semanas)

  try {
    // Llama a la acción del store, la acción ahora asignará el número de factura
    await databaseStore.addLimpieza(limpiezaParaGuardar);
    // Limpiar el formulario después de añadir exitosamente
    // ... (tu lógica existente para limpiar nuevaLimpieza.value)
  } catch (err) {
    alert('Error al añadir el registro: ' + (err.message || 'Desconocido'));
    console.error("Error al añadir limpieza en componente:", err);
  }
};

// Función para abrir y cerrar el modal
const openEditModal = (limpieza) => {
    editingLimpiezaId.value = limpieza.id; // Guarda el ID del documento que se edita

    // Copia los datos del documento
    const tempEditedLimpieza = {
       ...limpieza, // Copia todas las propiedades
       // Asegúrate de que los campos de fecha vacíos sean null o ''
       semana1: limpieza.semana1 || null, 
       semana2: limpieza.semana2 || null,
       semana3: limpieza.semana3 || null,
       semana4: limpieza.semana4 || null,
       semana5: limpieza.semana5 || null,
       precioBruto: limpieza.precioBruto ?? null,
       fechaPago: limpieza.fechaPago || null, 
       formaPago: limpieza.formaPago || 'Efectivo',
    };

    // NUEVO: Traduce la cadena de tipo a las propiedades booleanas para el modal
    for (let i = 1; i <= 5; i++) {
      const tipo = tempEditedLimpieza[`semana${i}Tipo`];
      tempEditedLimpieza[`semana${i}Exterior`] = tipo === 'exterior' || tipo === 'ambas';
      tempEditedLimpieza[`semana${i}Interior`] = tipo === 'interior' || tipo === 'ambas';
    }

    editedLimpieza.value = tempEditedLimpieza; // Asigna el objeto preparado
    isEditModalOpen.value = true; // Abre el modal
    databaseStore.updateError = null; // Limpia cualquier error de actualización previo al abrir el modal
};

const closeEditModal = () => {
    isEditModalOpen.value = false; // Cierra el modal
    editingLimpiezaId.value = null; // Limpia el ID
    // Opcional: Limpiar los datos del formulario al cerrar
    editedLimpieza.value = {
      id: null, factura: null, cliente: '', semana1: null, semana2: null, semana3: null,
      semana4: null, semana5: null, formaPago: 'Efectivo',fechaPago: null,precioBruto: null,
    };
     // También puedes limpiar errores de actualización si los hubiera
     databaseStore.updateError = null;
};
// NUEVO: Funciones para el modal de añadir cliente
const openAddClientModal = () => {
  isAddClientModalOpen.value = true;
  // Opcional: Limpiar el formulario cada vez que se abre el modal
  newClient.value = {
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    telefono: '',
    email: '',
  };
};

const closeAddClientModal = () => {
  isAddClientModalOpen.value = false;
};

const saveNewClient = async () => {
  // Simple validación: al menos el nombre y apellido son obligatorios
  if (!newClient.value.nombre || !newClient.value.apellido) {
    alert('Por favor, ingresa el Nombre y Apellido del cliente.');
    return;
  }

  isSavingNewClient.value = true; // Activa el estado de carga del botón

  try {
    // Llamar a la acción del store para añadir el cliente
    await databaseStore.addClient(newClient.value);
    
    alert('Cliente añadido con éxito!');
    closeAddClientModal(); // Cierra el modal
    databaseStore.fetchClientes(); // Recarga la lista de clientes para actualizar el select

  } catch (error) {
    console.error("Error al guardar el nuevo cliente:", error);
    alert('Error al añadir el cliente: ' + (error.message || 'Desconocido'));
  } finally {
    isSavingNewClient.value = false; // Desactiva el estado de carga
  }
};
// Función para guardar los cambios en Firestore
const saveEditedLimpieza = async () => {
  if (!editingLimpiezaId.value) {
    console.error("No hay documento seleccionado para editar.");
    // Podrías mostrar una alerta o un mensaje aquí
    return;
  }

  isLoadingEdit.value = true; // Inicia el estado de carga de edición local
  // No necesitas limpiar databaseStore.updateError aquí, ya se hace en el store y al abrir el modal

  // Prepara los datos a enviar a Firestore
  // Es importante limpiar los campos de fecha vacíos si no quieres guardarlos como strings vacíos.
  // Firestore prefiere null para campos "vacíos" o ausentes.
  const dataToUpdate = {
    cliente: editedLimpieza.value.cliente,
    // Convierte string vacío a null para campos opcionales de fecha
    semana1: editedLimpieza.value.semana1 || null,
    semana2: editedLimpieza.value.semana2 || null,
    semana3: editedLimpieza.value.semana3 || null,
    semana4: editedLimpieza.value.semana4 || null,
    semana5: editedLimpieza.value.semana5 || null,
    
    formaPago: editedLimpieza.value.formaPago,
    fechaPago: editedLimpieza.value.fechaPago || null,
    precioBruto: editedLimpieza.value.precioBruto > 0 ? editedLimpieza.value.precioBruto : null,
    // No incluyas 'id', 'factura', o 'createdAt' aquí a menos que quieras que se sobrescriban
    // updateDoc solo actualiza los campos que le pasas.
  };
for (let i = 1; i <= 5; i++) {
    // Guardamos la fecha de la semana (o null si está vacía)
    dataToUpdate[`semana${i}`] = editedLimpieza.value[`semana${i}`] || null;
    
    // Generamos y guardamos el string de tipo de limpieza (ej: 'exterior', 'interior', 'ambas', 'ninguno')
    // A partir de los booleanos modificados por toggleSemanaType
    dataToUpdate[`semana${i}Tipo`] = getLimpiezaTypeString(
      editedLimpieza.value[`semana${i}Exterior`],
      editedLimpieza.value[`semana${i}Interior`]
    );
  }
  try {
    // Llama a la nueva acción del store para actualizar en Firestore
    await databaseStore.updateLimpieza(editingLimpiezaId.value, dataToUpdate);

    // Si la actualización fue exitosa (la acción del store no lanzó un error)
    console.log("Limpieza actualizada con éxito en Firestore y estado local.");
    closeEditModal(); // Cierra el modal

  } catch (err) {
    // El error ya fue manejado y registrado en el store (databaseStore.updateError)
    console.error("Error guardando la limpieza editada en el componente:", err);
    // El mensaje de error se mostrará automáticamente en el template gracias a:
    // <div v-if="databaseStore.updateError" class="alert alert-danger mt-3">
    //    Error al guardar los cambios: {{ databaseStore.updateError.message }}
    // </div>
    // Puedes añadir una alerta adicional si lo prefieres, pero el mensaje en la UI es mejor.
    // alert('Error al guardar los cambios: ' + (databaseStore.updateError?.message || 'Desconocido'));
  } finally {
    isLoadingEdit.value = false; // Finaliza el estado de carga de edición local
  }
};
const confirmDelete = async (limpieza) => {
  // Muestra un cuadro de diálogo de confirmación nativo del navegador
  const isConfirmed = window.confirm(`¿Estás seguro de que quieres eliminar el registro de ${limpieza.cliente} (Factura #${limpieza.factura})?`);

  if (isConfirmed) {
    try {
      // Llama a la nueva acción del store para eliminar el documento
      await databaseStore.deleteLimpieza(limpieza.id);
      console.log("Registro eliminado con éxito:", limpieza.id);
      // No necesitas hacer nada más aquí, el store actualiza el estado local.
      databaseStore.deleteError = null; // Limpia errores de eliminación previos si existieran

    } catch (err) {
      console.error("Error al eliminar el registro en el componente:", err);
      // El error ya fue manejado y registrado en el store (databaseStore.deleteError)
      // Puedes mostrar una alerta adicional si lo deseas, pero el mensaje en la UI es mejor.
       alert('Error al eliminar el registro: ' + (databaseStore.deleteError?.message || 'Desconocido')); // Usamos ?. por si deleteError es null
    }
  }
};
const handleGeneratePdf = async () => {
  const limpiezas = databaseStore.limpiezas;

  if (!limpiezas || limpiezas.length === 0) {
    alert("No hay registros para generar el PDF.");
    return;
  }

  isGeneratingPdf.value = true; // Activa el estado de carga

  try {
    const doc = new jsPDF();

    const mainTitle = "Registro Mensual de Limpiezas";
    const filterSummaryText = displayFilterSummary.value; 

    doc.setFontSize(16);
    doc.text(mainTitle, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    if (filterSummaryText !== 'Todos los registros') {
        doc.text(filterSummaryText, doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
    }

    let startYForTable = filterSummaryText !== 'Todos los registros' ? 35 : 25;

    const tableColumn = [
      "Factura #", "Cliente", "Sem. 1", "Sem. 2", "Sem. 3", "Sem. 4", "Sem. 5",
      "Bruto (€)", "Neto (€)", "Cotiz. (€)", "Fecha Pago", "Estado", "Forma Pago"
    ];

    // Función auxiliar para formatear la información de cada semana
    const formatSemanaInfoForPdf = (limpieza, weekNum) => {
        const date = limpieza[`semana${weekNum}`] || '';
        const tipo = limpieza[`semana${weekNum}Tipo`];
        
        let typeIndicator = '';
        if (tipo === 'exterior') {
            typeIndicator = 'E';
        } else if (tipo === 'interior') {
            typeIndicator = 'I';
        } else if (tipo === 'ambas') {
            typeIndicator = 'E  I';
        }
        
        if (date) {
            return `${date} ${typeIndicator}`.trim();
        } else if (typeIndicator) {
            return typeIndicator; 
        }
        return '';
    };

    // Mapea los datos de Pinia a un array de arrays para autoTable
    const tableRows = limpiezas.map(limpieza => {
      const precioBrutoDeLaLimpieza = limpieza.precioBruto;

      return [
        limpieza.factura,
        limpieza.cliente,
        formatSemanaInfoForPdf(limpieza, 1),
        formatSemanaInfoForPdf(limpieza, 2),
        formatSemanaInfoForPdf(limpieza, 3),
        formatSemanaInfoForPdf(limpieza, 4),
        formatSemanaInfoForPdf(limpieza, 5),
        formatCurrency(precioBrutoDeLaLimpieza),
        formatCurrency(calculatePrecioNeto(precioBrutoDeLaLimpieza)),
        formatCurrency(calculateCotizacion(precioBrutoDeLaLimpieza)),
        limpieza.fechaPago || '',
        limpieza.fechaPago ? 'Pagado' : 'Pendiente',
        limpieza.formaPago,
      ];
    });

    // --- ¡MOVEMOS ESTA LÍNEA AQUÍ, ANTES DE USAR 'totals' EN 'tableFoot'! ---
    const totals = totalsSummary.value; // <-- ¡AQUÍ ES DONDE DEBE ESTAR!

    const tableFoot = [
      [
        'Totales:', '', '', '', '', '', '', 
        formatCurrency(totals.totalBruto),
        formatCurrency(totals.totalNeto),
        formatCurrency(totals.totalCotizacion),
        '', '', '' 
      ]
    ];

    autoTable(doc, {
      startY: startYForTable,
      head: [tableColumn],
      body: tableRows,
      foot: tableFoot,
      theme: 'striped',
      styles: { fontSize: 6, valign: 'middle' },
      headStyles: { fontSize: 7, fillColor: [22, 160, 133], valign: 'middle', halign: 'center' },
      footStyles: {
          fontStyle: 'bold',
          valign: 'middle',
          fontSize: 8, fillColor: [22, 160, 133],
      }, 
      margin: 5,
      columnStyles: {
          2: { cellWidth: 14, halign: 'center' },
          3: { cellWidth: 14, halign: 'center' },
          4: { cellWidth: 14, halign: 'center' },
          5: { cellWidth: 14, halign: 'center' },
          6: { cellWidth: 14, halign: 'center' },
      },
      footColumnStyles: {
        0: { halign: 'right' }
      },
    });

    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    let filename = 'registro_limpiezas_';
    let monthPart = '';
    let yearPart = '';

    if (selectedMonth.value !== '') {
      monthPart = monthNames[parseInt(selectedMonth.value)];
    }

    if (selectedYear.value !== '') {
      yearPart = selectedYear.value;
    }

    if (monthPart && yearPart) {
      filename += `${monthPart}-${yearPart}`;
    } else if (monthPart) {
      filename += `${monthPart}`;
    } else if (yearPart) {
      filename += `${yearPart}`;
    }
    
    filename += '.pdf';

    doc.save(filename);

    console.log("PDF generado con éxito.");

  } catch (error) {
    console.error("Error al generar el PDF:", error);
    alert("Hubo un error al generar el PDF. Consulta la consola para más detalles.");
  } finally {
    isGeneratingPdf.value = false;
  }
};

// Cargar los datos al montar el componente 
onMounted(() => {
  // Obtenemos el mes y año actuales
  const now = new Date();
  const currentMonth = now.getMonth().toString(); // getMonth() es 0-indexed (0 para Enero)
  const currentYear = now.getFullYear().toString();

  // Establecemos los valores por defecto de los selectores
  selectedMonth.value = currentMonth;
  selectedYear.value = currentYear;

  // Llamamos a la acción del store para cargar los datos, pasando el mes y año actuales
  // La acción fetchLimpiezas en el store debe estar preparada para recibir estos argumentos
  databaseStore.fetchLimpiezas(currentMonth, currentYear);
  
  // NUEVO: Cargar la lista de clientes al montar el componente
  databaseStore.fetchClientes();
});

</script>

<style scoped>
/* Puedes añadir estilos específicos para este componente aquí si es necesario */
/* Por ejemplo, para ajustar el ancho de las columnas si Bootstrap no lo hace perfecto */

/* Ajustes para el modal de Bootstrap si no usas el JS de Bootstrap */
.modal {
  /* Posición fija, cubre toda la pantalla */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Fondo semitransparente */
  background-color: rgba(0, 0, 0, 0.5); /* Un fallback, aunque el modal-backdrop lo crea Bootstrap */
  /* Centrar el contenido */
  display: flex;
  justify-content: center;
  align-items: center;
  /* Asegurarse de que esté por encima de todo */
  z-index: 1050; /* Z-index típico para modales de Bootstrap */
  /* Ocultar por defecto y mostrar con v-if */
   /* v-if ya maneja display: none/block, pero estas reglas son buenas para la estructura */
}

/* El modal-backdrop ya lo genera Bootstrap con show */
/* Si no usas el JS de Bootstrap, asegúrate de tener .modal-backdrop en tu HTML */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040; /* Z-index menor que el modal */
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

.modal-backdrop.fade { opacity: 0; }
.modal-backdrop.show { opacity: .5; } /* Opacidad por defecto de Bootstrap */


/* El modal-content y modal-dialog son manejados por las clases de Bootstrap */
/* Si necesitas personalización, podrías añadir reglas aquí */
</style>