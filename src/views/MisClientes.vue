<template>
  <div class="container-fluid bg-white">
    <h1 class="text-center mt-2 pt-5 mb-4 ">Mis clientes</h1>
    <h2 class="text-center pb-3"> <font-awesome-icon :icon="['fas', 'calendar-days']" class="me-2 fa-lg"
        style="color: #4970B6" />{{ diaActual }}</h2>

    <!-- Indicadores de carga para la vista principal -->
    <div v-if="databaseStore.isLoadingClientes" class="text-center p-3">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando clientes...</span>
      </div>
      <p class="mt-2">Cargando clientes...</p>
    </div>
    <div v-else-if="databaseStore.errorClientes" class="alert alert-danger text-center">
      Error al cargar clientes: {{ databaseStore.errorClientes.message }}
    </div>

    <!-- Contenido principal de la vista si no hay carga ni error -->
    <div class="container-fluid p-0" v-else>
      <div class="row">
        <!-- Sección de Detalles del Cliente Seleccionado y Añadir Limpieza (ahora solo detalles y historial) -->
        <div v-if="clienteSeleccionado" class="col-12 mt-4">
          <div class="card mb-4 shadow-sm">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 class="mb-0">Detalles del Cliente: {{ clienteSeleccionado.nombre }} {{ clienteSeleccionado.apellido }}</h3>
              <button @click="clienteSeleccionado = null; historialLimpiezasCliente = []" class="btn btn-light btn-sm" title="Cerrar detalles">
                <font-awesome-icon :icon="['fas', 'times']" /> Cerrar
              </button>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <h5>Información de Contacto</h5>
                  <p><strong>Teléfono:</strong> {{ clienteSeleccionado.telefono || 'N/A' }}</p>
                  <p><strong>Email:</strong> {{ clienteSeleccionado.email || 'N/A' }}</p>
                  <!-- MODIFICACIÓN AQUÍ -->
                  <p>
                    <strong>Última Limpieza:</strong>
                    <span :class="timeSinceLastCleaning.statusClass">
                      <b>{{ timeSinceLastCleaning.text }}</b>
                    </span>
                  </p>
                </div>
                <div class="col-md-6 mb-3">
                  <h5>Dirección de Facturación</h5>
                  <p>{{ clienteSeleccionado.direccion }}</p>
                  <p>{{ clienteSeleccionado.direccionComplementaria }}</p>
                  <p>{{ clienteSeleccionado.codigoPostal }} {{ clienteSeleccionado.ciudad }} ({{ clienteSeleccionado.provincia }})</p>
                </div>
                <div class="col-md-6 mb-3" v-if="clienteSeleccionado.direccionIntervencion && clienteSeleccionado.direccionIntervencion.calle">
                  <h5>Dirección de Intervención</h5>
                  <p>{{ clienteSeleccionado.direccionIntervencion.calle }}</p>
                  <p>{{ clienteSeleccionado.direccionIntervencion.complementaria}}</p>
                  <p>{{ clienteSeleccionado.direccionIntervencion.codigoPostal }} {{ clienteSeleccionado.direccionIntervencion.ciudad }} ({{ clienteSeleccionado.direccionIntervencion.provincia }})</p>
                </div>
                <div class="col-md-6 mb-3">
                  <h5>Tarifas de Limpieza</h5>
                  <p><strong>Exterior:</strong> {{ formatCurrency(clienteSeleccionado.precioExterior) }}</p>
                  <p><strong>Interior:</strong> {{ formatCurrency(clienteSeleccionado.precioInterior) }}</p>
                </div>
              </div>
              <hr>

              <h5 class="mt-4">Historial de Limpiezas</h5>
              <div v-if="historialLimpiezasCliente.length > 0" class="table-responsive">
                <table class="table table-sm table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Factura #</th>
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="limpieza in historialLimpiezasCliente" :key="limpieza.id">
                      <td>{{ limpieza.factura }}</td>
                      <td class="text-center">
                        {{ formatEuropeanDate(limpieza.semana1) }}
                        <br v-if="limpieza.semana1Tipo" />
                        <span v-if="limpieza.semana1Tipo === 'exterior' || limpieza.semana1Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                        <span v-if="limpieza.semana1Tipo === 'interior' || limpieza.semana1Tipo === 'ambas'" class="badge bg-secondary">I</span>
                      </td>
                      <td class="text-center">
                        {{ formatEuropeanDate(limpieza.semana2) }}
                        <br v-if="limpieza.semana2Tipo" />
                        <span v-if="limpieza.semana2Tipo === 'exterior' || limpieza.semana2Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                        <span v-if="limpieza.semana2Tipo === 'interior' || limpieza.semana2Tipo === 'ambas'" class="badge bg-secondary">I</span>
                      </td>
                      <td class="text-center">
                        {{ formatEuropeanDate(limpieza.semana3) }}
                        <br v-if="limpieza.semana3Tipo" />
                        <span v-if="limpieza.semana3Tipo === 'exterior' || limpieza.semana3Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                        <span v-if="limpieza.semana3Tipo === 'interior' || limpieza.semana3Tipo === 'ambas'" class="badge bg-secondary">I</span>
                      </td>
                      <td class="text-center">
                        {{ formatEuropeanDate(limpieza.semana4) }}
                        <br v-if="limpieza.semana4Tipo" />
                        <span v-if="limpieza.semana4Tipo === 'exterior' || limpieza.semana4Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                        <span v-if="limpieza.semana4Tipo === 'interior' || limpieza.semana4Tipo === 'ambas'" class="badge bg-secondary">I</span>
                      </td>
                      <td class="text-center">
                        {{ formatEuropeanDate(limpieza.semana5) }}
                        <br v-if="limpieza.semana5Tipo" />
                        <span v-if="limpieza.semana5Tipo === 'exterior' || limpieza.semana5Tipo === 'ambas'" class="badge bg-primary me-1">E</span>
                        <span v-if="limpieza.semana5Tipo === 'interior' || limpieza.semana5Tipo === 'ambas'" class="badge bg-secondary">I</span>
                      </td>
                      <td>{{ formatCurrency(limpieza.precioBruto) }}</td>
                      <td><strong>{{ formatCurrency(calculatePrecioNeto(limpieza.precioBruto)) }}</strong></td>
                      <td>{{ formatCurrency(calculateCotizacion(limpieza.precioBruto)) }}</td>
                      <td>{{ limpieza.fechaPago ? formatEuropeanDate(limpieza.fechaPago) : 'N/A' }}</td>
                      <td>
                        <span :class="{'badge bg-success': limpieza.fechaPago, 'badge bg-warning text-dark': !limpieza.fechaPago}">
                          {{ limpieza.fechaPago ? 'Pagado' : 'Pendiente' }}
                        </span>
                      </td>
                      <td>{{ limpieza.formaPago || 'N/A' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p v-else class="text-muted">No hay limpiezas registradas para este cliente.</p>
            </div>
          </div>
        </div>

        <!-- Sección de gestión de todos los clientes -->
        <div class="col-12 mt-5">
          <h2 class="text-center mb-4">Gestión de Todos los Clientes</h2>
          <div class="mb-3">
            <button class="btn btn-success" @click="openAddClientModal">Añadir Nuevo Cliente</button>
          </div>

          <div class="card mt-4">
            <!-- Encabezado del desplegable AHORA MÁS GRANDE Y VISIBLE -->
            <div class="card-header d-flex justify-content-between align-items-center bg-light py-3 px-4">
              <h2 class="mb-0">
                <button class="btn btn-link text-decoration-none text-dark p-0 d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseClients" aria-expanded="false" aria-controls="collapseClients">
                  Lista Completa de Clientes <span class="badge bg-secondary ms-3 fs-5">{{ clientCount }}</span>
                  <font-awesome-icon :icon="['fas', 'chevron-down']" class="collapse-icon ms-3 fa-lg" />
                </button>
              </h2>
            </div>
            <!-- Cuerpo del desplegable (colapsable) -->
            <div class="card-body collapse" id="collapseClients">
              <div v-if="databaseStore.isUpdatingClient" class="alert alert-info">
                Guardando cambios del cliente...
              </div>
              <div v-if="databaseStore.updateClientError" class="alert alert-danger">
                Error al actualizar el cliente: {{ databaseStore.updateClientError.message }}
              </div>
              <div v-if="databaseStore.isDeletingClient" class="alert alert-info">
                Eliminando cliente...
              </div>
              <div v-if="databaseStore.deleteClientError" class="alert alert-danger">
                Error al eliminar el cliente: {{ databaseStore.deleteClientError.message }}
              </div>

              <div class="table-responsive" v-if="databaseStore.clientes.length > 0">
                <table class="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Nombre Completo</th>
                      <th>Dirección Facturación</th>
                      <th>Dirección Intervención</th>
                      <th>Contacto</th>
                      <th>Precio Exterior (€)</th>
                      <th>Precio Interior (€)</th>
                      <th>Tarifa Total (€)</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="cliente in databaseStore.clientes" :key="cliente.id">
                      <td>{{ cliente.nombre }} {{ cliente.apellido }}</td>
                      <td>
                        {{ cliente.direccion }}<br>
                        {{ cliente.codigoPostal }} {{ cliente.ciudad }} ({{ cliente.provincia }})
                      </td>
                      <td>
                        <span v-if="cliente.direccionIntervencion && cliente.direccionIntervencion.calle">
                          {{ cliente.direccionIntervencion.calle }}<br>
                          {{ cliente.direccionIntervencion.codigoPostal }} {{ cliente.direccionIntervencion.ciudad }} ({{ cliente.direccionIntervencion.provincia }})
                        </span>
                        <span v-else>N/A</span>
                      </td>
                      <td>
                        <span v-if="cliente.telefono">{{ cliente.telefono }}</span>
                        <span v-if="cliente.telefono && cliente.email"> | </span>
                        <span v-if="cliente.email">{{ cliente.email }}</span>
                      </td>
                      <td>{{ formatCurrency(cliente.precioExterior) }}</td>
                      <td>{{ formatCurrency(cliente.precioInterior) }}</td>
                      <td><strong>{{ formatCurrency(cliente.precioExterior + cliente.precioInterior) }}</strong></td>
                      <td>
                        <button @click="selectClientForDetails(cliente)" class="btn btn-sm btn-primary me-2" title="Ver detalles y añadir limpieza">
                          <font-awesome-icon :icon="['fas', 'eye']" />
                        </button>
                        <button @click="openEditClientModal(cliente)" class="btn btn-sm btn-info text-white me-2" title="Editar cliente">
                          <font-awesome-icon :icon="['fas', 'file-pen']" />
                        </button>
                        <button @click="confirmDeleteClient(client)" class="btn btn-sm btn-danger" title="Eliminar cliente">
                          <font-awesome-icon :icon="['fas', 'trash-can']" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="alert alert-warning m-3">
                No hay clientes registrados aún. ¡Añade uno usando el botón de arriba!
              </div>
            </div>
          </div>
        </div>

        <!-- Nueva Sección de Gráficos de Ingresos -->
        <div class="col-12 mt-5">
          <h2 class="text-center mb-4">Evolución de Ingresos</h2>
          <div class="card mt-4 p-4">
            <div class="row">

              <!-- Gráfico de Ingresos Mensuales -->
              <div class="col-12 col-md-6 mb-4">
                <h3 class="mb-3">Ingresos Mensuales</h3>
                <div v-if="monthlyIncomeSeries[0] && monthlyIncomeSeries[0].data.length > 0">
                  <apexchart type="line" :options="monthlyIncomeChartOptions" :series="monthlyIncomeSeries"></apexchart>
                </div>
                <div v-else class="alert alert-info text-center">
                  No hay datos de ingresos mensuales disponibles para mostrar el gráfico.
                </div>
              </div>

              <!-- Gráfico de Ingresos Anuales -->
              <div class="col-12 col-md-6 mb-4">
                <h3 class="mb-3">Ingresos Anuales</h3>
                <div v-if="yearlyIncomeSeries[0] && yearlyIncomeSeries[0].data.length > 0">
                  <apexchart type="bar" :options="yearlyIncomeChartOptions" :series="yearlyIncomeSeries"></apexchart>
                </div>
                <div v-else class="alert alert-info text-center">
                  No hay datos de ingresos anuales disponibles para mostrar el gráfico.
                </div>
              </div>

            </div>
          </div>
        </div>
<!-- Sección de Gastos -->
<div class="col-12 mt-5">
  <GastosTable />
</div>
        <!-- Componentes externos -->
        <div>
          <!-- <NuevaFactura /> -->
        </div>
        <div class="row col-12 mb-4 p-2 mapa bg-white">
          <Mapa />
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para Añadir Nuevo Cliente -->
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
                  <label for="new-client-intervencion-calle" class="form-label">Dirección (Calle y Número)</label>
                  <input type="text" class="form-control" id="new-client-intervencion-calle"
                    v-model="newClient.direccionIntervencion.calle">
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
                    v-model="newClient.codigoPostal">
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

  <!-- Modal para Editar Cliente Existente -->
  <div v-if="isEditClientModalOpen" class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="editClientModalLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editClientModalLabel">Editar Cliente: {{ editedClient.nombre }} {{ editedClient.apellido }}</h5>
          <button type="button" class="btn-close" @click="closeEditClientModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEditedClient">
              <div class="row g-3">
                <div class="col-12 mb-3">
                  <h4 class="mb-0">Información Personal</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-nombre" class="form-label">Nombre</label>
                  <input type="text" class="form-control" id="edit-client-nombre" v-model="editedClient.nombre" required>
                </div>
                <div class="col-md-6">
                  <label for="edit-client-apellido" class="form-label">Apellido</label>
                  <input type="text" class="form-control" id="edit-client-apellido" v-model="editedClient.apellido"
                    required>
                </div>

                <div class="col-12 mt-4 mb-3">
                  <h4 class="mb-0">Dirección de Facturación</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <div class="col-12">
                  <label for="edit-client-direccion" class="form-label">Dirección (Calle y Número)</label>
                  <input type="text" class="form-control" id="edit-client-direccion" v-model="editedClient.direccion"
                    required>
                </div>
                <div class="col-12">
                  <label for="new-client-direccion" class="form-label">Dirección Complementaria (Opcional)</label>
                  <input type="text" class="form-control" id="new-client-direccion" v-model="editedClient.direccionComplementaria">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-ciudad" class="form-label">Ciudad</label>
                  <input type="text" class="form-control" id="edit-client-ciudad" v-model="editedClient.ciudad" required>
                </div>
                <div class="col-md-6">
                  <label for="edit-client-provincia" class="form-label">Provincia</label>
                  <input type="text" class="form-control" id="edit-client-provincia" v-model="editedClient.provincia"
                    required>
                </div>
                <div class="col-md-4">
                  <label for="edit-client-codigo-postal" class="form-label">Código Postal</label>
                  <input type="text" class="form-control" id="edit-client-codigo-postal"
                    v-model="editedClient.codigoPostal">
                </div>

                <div class="col-12 mt-4 mb-3">
                  <h4 class="mb-0">Dirección de Intervención (Opcional)</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <div class="col-12">
                  <label for="edit-client-intervencion-calle" class="form-label">Dirección (Calle y Número)</label>
                  <input type="text" class="form-control" id="edit-client-intervencion-calle"
                    v-model="editedClient.direccionIntervencion.calle">
                </div>
                 <div class="col-12">
                  <label for="new-client-intervencion-calle" class="form-label">Dirección Complementaria (Opcional)</label>
                  <input type="text" class="form-control" id="new-client-intervencion-calle"
                    v-model="editedClient.direccionIntervencion.complementaria">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-intervencion-ciudad" class="form-label">Ciudad</label>
                  <input type="text" class="form-control" id="edit-client-intervencion-ciudad"
                    v-model="editedClient.direccionIntervencion.ciudad">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-intervencion-provincia" class="form-label">Provincia</label>
                  <input type="text" class="form-control" id="edit-client-intervencion-provincia"
                    v-model="editedClient.direccionIntervencion.provincia">
                </div>
                <div class="col-md-4">
                  <label for="edit-client-intervencion-codigo-postal" class="form-label">Código Postal</label>
                  <input type="text" class="form-control" id="edit-client-intervencion-codigo-postal"
                    v-model="editedClient.codigoPostal">
                </div>

                <div class="col-12 mt-4 mb-3">
                  <h4 class="mb-0">Información de Contacto</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-telefono" class="form-label">Teléfono</label>
                  <input type="tel" class="form-control" id="edit-client-telefono" v-model="editedClient.telefono">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="edit-client-email" v-model="editedClient.email">
                </div>
                <div class="col-12 mt-4 mb-3">
                  <h4 class="mb-0">Tipo de Cliente</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-tipo" class="form-label">Tipo de Cliente</label>
                  <select id="edit-client-tipo" class="form-select" v-model="editedClient.tipoCliente" required>
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
                  <label for="edit-client-precio-exterior" class="form-label">Precio por Limpieza Exterior</label>
                  <input type="number" class="form-control" id="edit-client-precio-exterior"
                    v-model.number="editedClient.precioExterior" step="0.01" min="0">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-precio-interior" class="form-label">Precio por Limpieza Interior</label>
                  <input type="number" class="form-control" id="edit-client-precio-interior"
                    v-model.number="editedClient.precioInterior" step="0.01" min="0">
                </div>
              </div>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeEditClientModal">Cancelar</button>
          <button type="button" class="btn btn-primary" @click="saveEditedClient" :disabled="databaseStore.isUpdatingClient">
            {{ databaseStore.isUpdatingClient ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </div>
    </div>
    </div>
  <div v-if="isEditClientModalOpen" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useDatabaseStore } from "../stores/database";
import dayjs from "dayjs";
import 'dayjs/locale/es'; // ¡Importante para que 'fromNow' se muestre en español!
import 'dayjs/locale/fr';

import VueApexCharts from "vue3-apexcharts";
import Mapa from '../components/Mapa.vue';
import GastosTable from '../components/GastosTable.vue';

// --- ESTADOS LOCALES Y REFERENCES ---
const databaseStore = useDatabaseStore();
const diaActual = ref(dayjs().locale('es').format('DD MMMM YYYY'));
const clienteSeleccionado = ref(null);
const historialLimpiezasCliente = ref([]); // Para el historial de limpiezas del cliente seleccionado

// ... (El resto de tus refs como newClient, editedClient, etc.)
const newClient = ref({
  id: null, nombre: '', apellido: '', direccion: '',direccionComplementaria:'', ciudad: '', provincia: '', codigoPostal: '',
  direccionIntervencion: { calle: '',complementaria:'', ciudad: '', provincia: '', codigoPostal: '' },
  telefono: '', email: '', precioExterior: 0.00, precioInterior: 0.00, tipoCliente: ''
});
const editedClient = ref({
  id: null, nombre: '', apellido: '', direccion: '', ciudad: '', provincia: '', codigoPostal: '',
  direccionIntervencion: { calle: '',complementaria:'', ciudad: '', provincia: '', codigoPostal: '' },
  telefono: '', email: '', precioExterior: 0.00, precioInterior: 0.00, tipoCliente: ''
});

const isAddClientModalOpen = ref(false);
const isEditClientModalOpen = ref(false);
const isSavingNewClient = ref(false);
const isSavingEditedClient = ref(false);

const clientCount = computed(() => databaseStore.clientes.length);

// --- Funciones para manejar los modales de cliente ---
const openAddClientModal = () => {
  isAddClientModalOpen.value = true;
  Object.assign(newClient.value, {
    nombre: '', apellido: '', direccion: '', ciudad: '', provincia: '', codigoPostal: '',
    direccionIntervencion: { calle: '', ciudad: '', provincia: '', codigoPostal: '' },
    telefono: '', email: '', precioExterior: 0.00, precioInterior: 0.00, tipoCliente: ''
  });
};

const closeAddClientModal = () => {
  isAddClientModalOpen.value = false;
};

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
  } catch (error) {
    alert('Error al añadir el cliente: ' + (databaseStore.addClientError?.message || 'Desconocido'));
    console.error("Error al guardar el nuevo cliente:", error);
  } finally {
    isSavingNewClient.value = false;
  }
};

const openEditClientModal = (client) => {
  isEditClientModalOpen.value = true;
  // Copia profunda para no modificar el original directamente
  editedClient.value = JSON.parse(JSON.stringify(client));
  // Asegurarse de que direccionIntervencion exista para evitar errores
  if (!editedClient.value.direccionIntervencion) {
    editedClient.value.direccionIntervencion = { calle: '', ciudad: '', provincia: '', codigoPostal: '' };
  }
};

const closeEditClientModal = () => {
  isEditClientModalOpen.value = false;
  editedClient.value = {
    id: null, nombre: '', apellido: '', direccion: '', ciudad: '', provincia: '', codigoPostal: '',
    direccionIntervencion: { calle: '', ciudad: '', provincia: '', codigoPostal: '' },
    telefono: '', email: '', precioExterior: 0.00, precioInterior: 0.00, tipoCliente: ''
  };
};

const saveEditedClient = async () => {
  if (!editedClient.value.nombre || !editedClient.value.apellido) {
    alert('Por favor, ingresa el Nombre y Apellido del cliente.');
    return;
  }
  isSavingEditedClient.value = true;
  try {
    await databaseStore.updateClient(editedClient.value.id, editedClient.value);
    alert('Cliente actualizado con éxito!');
    closeEditClientModal();
    // Si el cliente editado es el mismo que el seleccionado para detalles, actualiza los detalles también
    if (clienteSeleccionado.value && clienteSeleccionado.value.id === editedClient.value.id) {
        clienteSeleccionado.value = editedClient.value;
        // Si se actualizó el cliente seleccionado, también refrescar el historial
        selectClientForDetails(editedClient.value);
    }
  } catch (error) {
    alert('Error al actualizar el cliente: ' + (databaseStore.updateClientError?.message || 'Desconocido'));
    console.error("Error al actualizar el cliente:", error);
  } finally {
    isSavingEditedClient.value = false;
  }
};

const confirmDeleteClient = async (client) => {
  const isConfirmed = window.confirm(`¿Estás seguro de que quieres eliminar al cliente ${client.nombre} ${client.apellido}?`);
  if (isConfirmed) {
    try {
      await databaseStore.deleteClient(client.id);
      alert('Cliente eliminado con éxito!');
      if (clienteSeleccionado.value && clienteSeleccionado.value.id === client.id) {
        clienteSeleccionado.value = null; // Limpiar detalles si el cliente eliminado era el seleccionado
        historialLimpiezasCliente.value = []; // Limpiar historial también
      }
    } catch (error) {
      alert('Error al eliminar el cliente: ' + (databaseStore.deleteClientError?.message || 'Desconocido'));
      console.error("Error al eliminar el cliente:", error);
    }
  }
};

// --- Funciones de Formato ---
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

const formatEuropeanDate = (dateValue) => {
  if (!dateValue) return '';
  let date;
  if (typeof dateValue.toDate === 'function') {
    date = dayjs(dateValue.toDate());
  } else if (dateValue instanceof Date) {
    date = dayjs(dateValue);
  } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    date = dayjs(dateValue);
    if (!date.isValid()) { /* console.warn('Fecha inválida detectada:', dateValue); */ return ''; }
  } else {
    /* console.warn('Formato de fecha desconocido:', dateValue); */ return '';
  }
  return date.format('DD/MM/YYYY');
};

const calculateCotizacion = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) return 0;
  return parseFloat((brute * 0.21).toFixed(2));
};

const calculatePrecioNeto = (precioBruto) => {
  const brute = Number(precioBruto);
  if (isNaN(brute) || brute <= 0) return 0;
  const cotizacion = calculateCotizacion(brute);
  return parseFloat((brute - cotizacion).toFixed(2));
};

// --- Modificación de selectClientForDetails ---
const selectClientForDetails = (client) => {
  clienteSeleccionado.value = client;
  // Filtramos todas las limpiezas de la tienda que pertenecen a este cliente.
  historialLimpiezasCliente.value = databaseStore.limpiezas
    .filter((limpieza) => limpieza.clienteId === client.id)
    .sort((a, b) => {
      // Ordenar por fecha principal de limpieza (la más reciente primero)
      const dateA = getRelevantCleaningDate(a) ? dayjs(getRelevantCleaningDate(a)) : dayjs('1900-01-01');
      const dateB = getRelevantCleaningDate(b) ? dayjs(getRelevantCleaningDate(b)) : dayjs('1900-01-01');
      return dateB.diff(dateA); // Orden descendente (más reciente primero)
    });
};

// Función para obtener la fecha más relevante de una limpieza (la más temprana de todas las fechas asociadas)
const getRelevantCleaningDate = (limpiezaData) => {
  let relevantDate = null;

  // Priorizar fechaPrincipalLimpieza si existe y es válida
  if (limpiezaData.fechaPrincipalLimpieza) {
    const principalDate = dayjs(limpiezaData.fechaPrincipalLimpieza);
    if (principalDate.isValid()) {
      relevantDate = principalDate;
    }
  }

  // Si no hay fechaPrincipalLimpieza válida, buscar la fecha más temprana entre semanas
  // Solo busca en semanas si no encontró una fecha principal que ya sea la más temprana.
  for (let i = 1; i <= 5; i++) {
    const dateString = limpiezaData[`semana${i}`];
    if (dateString) {
      const currentDate = dayjs(dateString);
      if (currentDate.isValid()) {
        if (!relevantDate || currentDate.isBefore(relevantDate)) {
          relevantDate = currentDate;
        }
      }
    }
  }

  // Luego, buscar en las limpiezas extra y actualizar si alguna es más temprana
  if (limpiezaData.extraCleanings && limpiezaData.extraCleanings.length > 0) {
    for (const extra of limpiezaData.extraCleanings) {
      if (extra.date) {
        const extraDate = dayjs(extra.date);
        if (extraDate.isValid()) {
          if (!relevantDate || extraDate.isBefore(relevantDate)) {
            relevantDate = extraDate;
          }
        }
      }
    }
  }
  return relevantDate ? relevantDate.format('YYYY-MM-DD') : null;
};


// --- MODIFICACIÓN: timeSinceLastCleaning para devolver también el statusClass ---
const timeSinceLastCleaning = computed(() => {
  if (!historialLimpiezasCliente.value || historialLimpiezasCliente.value.length === 0) {
    return { text: 'Sin limpiezas previas', statusClass: '' }; // Sin clase si no hay limpiezas
  }

  const lastCleaning = historialLimpiezasCliente.value[0];
  const lastCleaningDateStr = getRelevantCleaningDate(lastCleaning);

  if (!lastCleaningDateStr) {
    return { text: 'Fecha de última limpieza no disponible', statusClass: '' };
  }

  const date = dayjs(lastCleaningDateStr);
  if (!date.isValid()) {
    return { text: 'Fecha inválida', statusClass: '' };
  }

  dayjs.locale('es'); // Asegurarse de que dayjs use el locale español para 'fromNow'

  const now = dayjs();
  const daysDifference = now.diff(date, 'days'); // Diferencia en días

  let statusClass = '';
  let formattedText;

  if (daysDifference >= 30) { // Más de un mes (30 días o más)
    statusClass = 'text-danger';
    formattedText = `${formatEuropeanDate(date)} (${now.from(date)})`; // Fecha exacta (hace X tiempo)
  } else if (daysDifference >= 20 && daysDifference <= 29) { // Entre 20 y 29 días
    statusClass = 'text-warning';
    formattedText = now.from(date); // Solo hace X tiempo
  } else { // Menos de 20 días
    statusClass = 'text-success';
    formattedText = now.from(date); // Solo hace X tiempo
  }

  return { text: formattedText, statusClass: statusClass };
});


// --- Gráficos - MODIFICADO PARA USAR PRECIO NETO ---
const monthlyIncomeChartOptions = computed(() => ({
  chart: {
    id: 'monthly-income-chart',
    toolbar: { show: false },
  },
  xaxis: {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    title: { text: 'Mes' }
  },
  yaxis: {
    title: { text: 'Ingresos Netos (€)' }, // Título actualizado
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) { return formatCurrency(val); }
  },
  tooltip: {
    y: {
      formatter: function (val) { return formatCurrency(val); }
    }
  }
}));

const monthlyIncomeSeries = computed(() => {
  const data = Array(12).fill(0); // Inicializar 12 meses con 0
  databaseStore.limpiezas.forEach(limpieza => {
    if (limpieza.fechaPago && limpieza.precioBruto) {
      const month = dayjs(limpieza.fechaPago).month(); // 0-11
      // *** CAMBIO AQUÍ: Usar calculatePrecioNeto ***
      data[month] += calculatePrecioNeto(limpieza.precioBruto);
    }
  });
  return [{ name: 'Ingresos Netos', data: data.map(val => parseFloat(val.toFixed(2))) }]; // Nombre actualizado
});

const yearlyIncomeDataAndCategories = computed(() => {
    const incomeByYear = {};
    let minYear = new Date().getFullYear();
    let maxYear = new Date().getFullYear();

    databaseStore.limpiezas.forEach(limpieza => {
        if (limpieza.fechaPago && limpieza.precioBruto) {
            const year = dayjs(limpieza.fechaPago).year();
            minYear = Math.min(minYear, year);
            maxYear = Math.max(maxYear, year);

            if (!incomeByYear[year]) {
                incomeByYear[year] = 0;
            }
            // *** CAMBIO AQUÍ: Usar calculatePrecioNeto ***
            incomeByYear[year] += calculatePrecioNeto(limpieza.precioBruto);
        }
    });

    if (Object.keys(incomeByYear).length === 0 && databaseStore.limpiezas.length === 0) {
        incomeByYear[new Date().getFullYear()] = 0;
        minYear = new Date().getFullYear();
        maxYear = new Date().getFullYear();
    }
    if (!incomeByYear[new Date().getFullYear()]) {
      incomeByYear[new Date().getFullYear()] = 0;
      minYear = Math.min(minYear, new Date().getFullYear());
      maxYear = Math.max(maxYear, new Date().getFullYear());
    }

    const categories = [];
    const data = [];
    for (let year = minYear; year <= maxYear; year++) {
        categories.push(year.toString());
        data.push(parseFloat((incomeByYear[year] || 0).toFixed(2)));
    }

    return { categories, data };
});

const yearlyIncomeSeries = computed(() => {
    return [{ name: 'Ingresos Netos', data: yearlyIncomeDataAndCategories.value.data }]; // Nombre actualizado
});

const yearlyIncomeChartOptions = computed(() => ({
  chart: {
    id: 'yearly-income-chart',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  xaxis: {
    categories: yearlyIncomeDataAndCategories.value.categories,
    title: { text: 'Año' }
  },
  yaxis: {
    title: { text: 'Ingresos Netos (€)' }, // Título actualizado
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) { return formatCurrency(val); }
  },
  tooltip: {
    y: {
      formatter: function (val) { return formatCurrency(val); }
    }
  }
}));


// --- LIFECYCLE HOOKS ---
onMounted(async () => {
  // Carga todas las limpiezas para asegurar un historial completo.
  await databaseStore.fetchLimpiezas();
  await databaseStore.fetchClientes();
});
</script>

