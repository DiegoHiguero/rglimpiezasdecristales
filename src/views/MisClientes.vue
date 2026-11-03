<template>
  <div class="mc-wrap">

    <!-- Cabecera -->
    <div class="mc-header">
      <div>
        <span class="mc-label">Panel Admin</span>
        <h1 class="mc-title">Mis <span class="mc-accent">clientes</span></h1>
      </div>
      <div class="mc-date">
        <font-awesome-icon :icon="['fas', 'calendar-days']" class="me-2" />{{ diaActual }}
      </div>
    </div>

    <!-- Carga / Error -->
    <div v-if="databaseStore.isLoadingClientes" class="mc-loading">
      <div class="mc-spinner"></div>
      <p>Cargando clientes...</p>
    </div>
    <div v-else-if="databaseStore.errorClientes" class="mc-alert mc-alert--err">
      Error al cargar clientes: {{ databaseStore.errorClientes.message }}
    </div>

    <!-- Contenido principal -->
    <div v-else>

      <!-- Detalles del cliente seleccionado -->
      <div v-if="clienteSeleccionado" class="mc-card mb-4">
        <div class="mc-card-header">
          <h3 class="mc-card-title">
            <font-awesome-icon :icon="['fas', 'user']" class="me-2" />
            {{ clienteSeleccionado.nombre }}
          </h3>
          <button @click="clienteSeleccionado = null; historialLimpiezasCliente = []" class="mc-btn mc-btn--ghost">
            <font-awesome-icon :icon="['fas', 'xmark']" class="me-1" /> Cerrar
          </button>
        </div>
        <div class="mc-card-body">
          <div class="mc-detail-grid">
            <div class="mc-detail-block">
              <p class="mc-detail-label">Contacto</p>
              <p class="mc-detail-value"><font-awesome-icon :icon="['fas', 'phone']" class="me-1 mc-detail-icon" />{{ clienteSeleccionado.telefono || 'N/A' }}</p>
              <p class="mc-detail-value"><font-awesome-icon :icon="['fas', 'envelope']" class="me-1 mc-detail-icon" />{{ clienteSeleccionado.email || 'N/A' }}</p>
              <p class="mc-detail-value" v-if="clienteSeleccionado.personaContacto"><font-awesome-icon :icon="['fas', 'address-card']" class="me-1 mc-detail-icon" />{{ clienteSeleccionado.personaContacto }}</p>
              <p class="mc-detail-value">
                <font-awesome-icon :icon="['fas', 'clock']" class="me-1 mc-detail-icon" />
                Última limpieza: <span :class="timeSinceLastCleaning.statusClass"><b>{{ timeSinceLastCleaning.text }}</b></span>
              </p>
            </div>
            <div class="mc-detail-block">
              <p class="mc-detail-label">Dirección · NIF/CIF</p>
              <p class="mc-detail-value">{{ clienteSeleccionado.direccion || 'N/A' }}</p>
              <p class="mc-detail-value">{{ clienteSeleccionado.nifCif || 'N/A' }}</p>
            </div>
            <div class="mc-detail-block">
              <p class="mc-detail-label">Precio habitual</p>
              <p class="mc-detail-value"><strong>{{ formatCurrency(clienteSeleccionado.precioHabitual) }}</strong></p>
            </div>
            <div class="mc-detail-block" v-if="clienteSeleccionado.notas">
              <p class="mc-detail-label">Notas</p>
              <p class="mc-detail-value">{{ clienteSeleccionado.notas }}</p>
            </div>
          </div>

          <div class="mc-section-divider">Historial de Facturas</div>
          <div v-if="historialLimpiezasCliente.length > 0" class="mc-table-wrap">
            <table class="mc-table">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Fecha</th>
                  <th>Concepto</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="limpieza in historialLimpiezasCliente" :key="limpieza.id">
                  <td>{{ limpieza.factura }}</td>
                  <td>{{ formatEuropeanDate(limpieza.fechaPrincipalLimpieza) }}</td>
                  <td>{{ limpieza.descripcion || '—' }}</td>
                  <td><strong>{{ formatCurrency(limpieza.precioBruto) }}</strong></td>
                  <td><span :class="limpieza.estado === 'Pagada' ? 'mc-badge mc-badge--green' : 'mc-badge mc-badge--yellow'">{{ limpieza.estado }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="mc-empty">No hay facturas registradas para este cliente.</p>
        </div>
      </div>

      <!-- Lista de clientes -->
      <div class="mc-card mb-4">
        <div class="mc-card-header">
          <h2 class="mc-card-title">
            Clientes
            <span class="mc-count">{{ clientCount }}</span>
          </h2>
          <button class="mc-btn mc-btn--primary" @click="openAddClientModal">
            <font-awesome-icon :icon="['fas', 'plus']" class="me-2" />Añadir cliente
          </button>
        </div>
        <div class="mc-card-body">
          <div v-if="databaseStore.isUpdatingClient || databaseStore.isDeletingClient" class="mc-alert mc-alert--info">
            {{ databaseStore.isUpdatingClient ? 'Guardando cambios...' : 'Eliminando cliente...' }}
          </div>
          <div v-if="databaseStore.updateClientError" class="mc-alert mc-alert--err">Error al actualizar: {{ databaseStore.updateClientError.message }}</div>
          <div v-if="databaseStore.deleteClientError" class="mc-alert mc-alert--err">Error al eliminar: {{ databaseStore.deleteClientError.message }}</div>

          <div v-if="databaseStore.clientes.length > 0" class="mc-table-wrap">
            <table class="mc-table">
              <thead>
                <tr>
                  <th>Nombre / Razón social</th>
                  <th>NIF/CIF</th>
                  <th>Dirección</th>
                  <th>Contacto</th>
                  <th>Precio habitual (€)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cliente in databaseStore.clientes" :key="cliente.id">
                  <td><strong>{{ cliente.nombre }}</strong></td>
                  <td>{{ cliente.nifCif || '—' }}</td>
                  <td>{{ cliente.direccion || '—' }}</td>
                  <td>
                    <span v-if="cliente.telefono">{{ cliente.telefono }}</span>
                    <br v-if="cliente.telefono && cliente.email" />
                    <span v-if="cliente.email" class="mc-muted">{{ cliente.email }}</span>
                  </td>
                  <td><strong>{{ formatCurrency(cliente.precioHabitual) }}</strong></td>
                  <td>
                    <div class="mc-actions">
                      <button @click="selectClientForDetails(cliente)" class="mc-icon-btn mc-icon-btn--blue" title="Ver detalles"><font-awesome-icon :icon="['fas', 'eye']" /></button>
                      <button @click="openEditClientModal(cliente)" class="mc-icon-btn mc-icon-btn--teal" title="Editar"><font-awesome-icon :icon="['fas', 'file-pen']" /></button>
                      <button @click="copyPortalLink(cliente)" class="mc-icon-btn mc-icon-btn--blue" title="Copiar enlace del portal" :disabled="generandoEnlace === cliente.nombre"><font-awesome-icon :icon="['fas', generandoEnlace === cliente.nombre ? 'rotate' : 'link']" :spin="generandoEnlace === cliente.nombre" /></button>
                      <button @click="openDeleteModal(cliente)" class="mc-icon-btn mc-icon-btn--red" title="Eliminar"><font-awesome-icon :icon="['fas', 'trash-can']" /></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="mc-empty">No hay clientes registrados aún.</p>
        </div>
      </div>

    </div>
  </div>

  <!-- Modal Añadir Cliente -->
  <div v-if="isAddClientModalOpen" class="mc-modal-backdrop" @click.self="closeAddClientModal">
    <div class="mc-modal">
      <div class="mc-modal-header">
        <h5>Añadir Nuevo Cliente</h5>
        <button class="mc-modal-close" @click="closeAddClientModal"><font-awesome-icon :icon="['fas', 'xmark']" /></button>
      </div>
      <div class="mc-modal-body">
        <form @submit.prevent="saveNewClient">
              <div class="row g-3">
                <div class="col-12 mb-3">
                  <h4 class="mb-0">Datos del cliente</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <div class="col-md-6">
                  <label for="new-client-nombre" class="form-label">Nombre / Razón social</label>
                  <input type="text" class="form-control" id="new-client-nombre" v-model="newClient.nombre" required>
                </div>
                <div class="col-md-6">
                  <label for="new-client-nif" class="form-label">NIF/CIF</label>
                  <input type="text" class="form-control" id="new-client-nif" v-model="newClient.nifCif">
                </div>
                <div class="col-12">
                  <label for="new-client-direccion" class="form-label">Dirección</label>
                  <input type="text" class="form-control" id="new-client-direccion" v-model="newClient.direccion">
                </div>
                <div class="col-md-6">
                  <label for="new-client-telefono" class="form-label">Teléfono</label>
                  <input type="tel" class="form-control" id="new-client-telefono" v-model="newClient.telefono">
                </div>
                <div class="col-md-6">
                  <label for="new-client-email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="new-client-email" v-model="newClient.email">
                </div>
                <div class="col-md-6">
                  <label for="new-client-persona-contacto" class="form-label">Persona de contacto</label>
                  <input type="text" class="form-control" id="new-client-persona-contacto" v-model="newClient.personaContacto">
                </div>
                <div class="col-md-6">
                  <label for="new-client-precio-habitual" class="form-label">Precio habitual (€)</label>
                  <input type="number" class="form-control" id="new-client-precio-habitual"
                    v-model.number="newClient.precioHabitual" step="0.01" min="0">
                </div>
                <div class="col-md-6">
                  <label for="new-client-categoria" class="form-label">Categoría (para el mapa)</label>
                  <select class="form-select" id="new-client-categoria" v-model="newClient.tipoCliente">
                    <option value="">Sin especificar</option>
                    <option value="chalet">Chalet</option>
                    <option value="piso">Piso</option>
                    <option value="empresa">Empresa</option>
                  </select>
                </div>
                <div class="col-12">
                  <label for="new-client-notas" class="form-label">Notas</label>
                  <textarea class="form-control" id="new-client-notas" v-model="newClient.notas" rows="2"></textarea>
                </div>
              </div>
            </form>
        </div>
      <div class="mc-modal-footer">
        <button class="mc-btn mc-btn--ghost" @click="closeAddClientModal">Cancelar</button>
        <button class="mc-btn mc-btn--primary" @click="saveNewClient" :disabled="isSavingNewClient">
          {{ isSavingNewClient ? 'Guardando...' : 'Guardar Cliente' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Editar Cliente -->
  <div v-if="isEditClientModalOpen" class="mc-modal-backdrop" @click.self="closeEditClientModal">
    <div class="mc-modal">
      <div class="mc-modal-header">
        <h5>Editar: {{ editedClient.nombre }}</h5>
        <button class="mc-modal-close" @click="closeEditClientModal"><font-awesome-icon :icon="['fas', 'xmark']" /></button>
      </div>
      <div class="mc-modal-body">
          <form @submit.prevent="saveEditedClient">
              <div class="row g-3">
                <div class="col-12 mb-3">
                  <h4 class="mb-0">Datos del cliente</h4>
                  <hr class="mt-2 mb-3">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-nombre" class="form-label">Nombre / Razón social</label>
                  <input type="text" class="form-control" id="edit-client-nombre" v-model="editedClient.nombre" required>
                </div>
                <div class="col-md-6">
                  <label for="edit-client-nif" class="form-label">NIF/CIF</label>
                  <input type="text" class="form-control" id="edit-client-nif" v-model="editedClient.nifCif">
                </div>
                <div class="col-12">
                  <label for="edit-client-direccion" class="form-label">Dirección</label>
                  <input type="text" class="form-control" id="edit-client-direccion" v-model="editedClient.direccion">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-telefono" class="form-label">Teléfono</label>
                  <input type="tel" class="form-control" id="edit-client-telefono" v-model="editedClient.telefono">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="edit-client-email" v-model="editedClient.email">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-persona-contacto" class="form-label">Persona de contacto</label>
                  <input type="text" class="form-control" id="edit-client-persona-contacto" v-model="editedClient.personaContacto">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-precio-habitual" class="form-label">Precio habitual (€)</label>
                  <input type="number" class="form-control" id="edit-client-precio-habitual"
                    v-model.number="editedClient.precioHabitual" step="0.01" min="0">
                </div>
                <div class="col-md-6">
                  <label for="edit-client-categoria" class="form-label">Categoría (para el mapa)</label>
                  <select class="form-select" id="edit-client-categoria" v-model="editedClient.tipoCliente">
                    <option value="">Sin especificar</option>
                    <option value="chalet">Chalet</option>
                    <option value="piso">Piso</option>
                    <option value="empresa">Empresa</option>
                  </select>
                </div>
                <div class="col-12">
                  <label for="edit-client-notas" class="form-label">Notas</label>
                  <textarea class="form-control" id="edit-client-notas" v-model="editedClient.notas" rows="2"></textarea>
                </div>
              </div>
            </form>
        </div>
      <div class="mc-modal-footer">
        <button class="mc-btn mc-btn--ghost" @click="closeEditClientModal">Cancelar</button>
        <button class="mc-btn mc-btn--primary" @click="saveEditedClient" :disabled="databaseStore.isUpdatingClient">
          {{ databaseStore.isUpdatingClient ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Modal Eliminar Cliente: requiere escribir el nombre para autorizar -->
  <div v-if="isDeleteModalOpen" class="mc-modal-backdrop" @click.self="closeDeleteModal">
    <div class="mc-modal mc-modal--danger">
      <div class="mc-modal-header">
        <h5><font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="me-2" />Eliminar cliente</h5>
        <button class="mc-modal-close" @click="closeDeleteModal"><font-awesome-icon :icon="['fas', 'xmark']" /></button>
      </div>
      <div class="mc-modal-body">
        <p class="mc-delete-warning">
          Vas a eliminar a <strong>{{ clienteAEliminar?.nombre }}</strong> de forma permanente de la hoja de clientes.
          No se puede deshacer. No borra sus facturas ya emitidas ni su portal, pero dejará de aparecer en el sistema.
        </p>
        <label class="mc-delete-label">Escribe el nombre del cliente para confirmar:</label>
        <input
          type="text"
          class="form-control"
          v-model="confirmacionTexto"
          :placeholder="clienteAEliminar?.nombre"
          autocomplete="off"
          @keyup.enter="eliminarClienteConfirmado"
        />
      </div>
      <div class="mc-modal-footer">
        <button class="mc-btn mc-btn--ghost" @click="closeDeleteModal">Cancelar</button>
        <button class="mc-btn mc-btn--danger" :disabled="!puedeEliminar || databaseStore.isDeletingClient" @click="eliminarClienteConfirmado">
          {{ databaseStore.isDeletingClient ? 'Eliminando...' : 'Eliminar definitivamente' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useDatabaseStore } from "../stores/database";
import dayjs from "dayjs";
import 'dayjs/locale/es'; // ¡Importante para que 'fromNow' se muestre en español!
import 'dayjs/locale/fr';

import { ensurePortalToken } from '../services/portal';

// --- ESTADOS LOCALES Y REFERENCES ---
const databaseStore = useDatabaseStore();
const diaActual = ref(dayjs().locale('es').format('DD MMMM YYYY'));
const clienteSeleccionado = ref(null);
const historialLimpiezasCliente = ref([]); // Para el historial de limpiezas del cliente seleccionado

// ... (El resto de tus refs como newClient, editedClient, etc.)
const newClient = ref({
  nombre: '', nifCif: '', direccion: '', telefono: '', email: '', personaContacto: '', notas: '', precioHabitual: 0.00, tipoCliente: '',
});
const editedClient = ref({
  id: null, nombre: '', nifCif: '', direccion: '', telefono: '', email: '', personaContacto: '', notas: '', precioHabitual: 0.00, tipoCliente: '',
});

const isAddClientModalOpen = ref(false);
const isEditClientModalOpen = ref(false);
const isSavingNewClient = ref(false);
const isSavingEditedClient = ref(false);

const clientCount = computed(() => databaseStore.clientes.length);

// --- Enlace del portal de cliente ---
const generandoEnlace = ref(null); // nombre del cliente cuyo enlace se está generando

const copyPortalLink = async (cliente) => {
  generandoEnlace.value = cliente.nombre;
  try {
    const token = await ensurePortalToken(cliente.nombre, cliente.email, cliente.direccion);
    const url = `${window.location.origin}/portal/${token}`;
    await navigator.clipboard.writeText(url);
    alert(`Enlace copiado al portapapeles:\n${url}`);
  } catch (error) {
    console.error('Error al generar el enlace del portal:', error);
    alert('No se pudo generar el enlace del portal.');
  } finally {
    generandoEnlace.value = null;
  }
};

// --- Funciones para manejar los modales de cliente ---
const openAddClientModal = () => {
  isAddClientModalOpen.value = true;
  Object.assign(newClient.value, {
    nombre: '', nifCif: '', direccion: '', telefono: '', email: '', personaContacto: '', notas: '', precioHabitual: 0.00, tipoCliente: '',
  });
};

const closeAddClientModal = () => {
  isAddClientModalOpen.value = false;
};

const saveNewClient = async () => {
  if (!newClient.value.nombre) {
    alert('Por favor, ingresa el Nombre / Razón social del cliente.');
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
};

const closeEditClientModal = () => {
  isEditClientModalOpen.value = false;
  editedClient.value = {
    id: null, nombre: '', nifCif: '', direccion: '', telefono: '', email: '', personaContacto: '', notas: '', precioHabitual: 0.00, tipoCliente: '',
  };
};

const saveEditedClient = async () => {
  if (!editedClient.value.nombre) {
    alert('Por favor, ingresa el Nombre / Razón social del cliente.');
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

// --- Eliminar cliente: exige escribir su nombre exacto como autorización,
// en vez de un simple confirm() del navegador que se puede pulsar sin querer.
const isDeleteModalOpen = ref(false);
const clienteAEliminar = ref(null);
const confirmacionTexto = ref('');

const puedeEliminar = computed(() =>
  !!clienteAEliminar.value && confirmacionTexto.value.trim() === clienteAEliminar.value.nombre
);

const openDeleteModal = (client) => {
  clienteAEliminar.value = client;
  confirmacionTexto.value = '';
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  clienteAEliminar.value = null;
  confirmacionTexto.value = '';
};

const eliminarClienteConfirmado = async () => {
  if (!puedeEliminar.value || !clienteAEliminar.value) return;
  const client = clienteAEliminar.value;
  try {
    await databaseStore.deleteClient(client.id);
    if (clienteSeleccionado.value && clienteSeleccionado.value.id === client.id) {
      clienteSeleccionado.value = null; // Limpiar detalles si el cliente eliminado era el seleccionado
      historialLimpiezasCliente.value = []; // Limpiar historial también
    }
    closeDeleteModal();
  } catch (error) {
    alert('Error al eliminar el cliente: ' + (databaseStore.deleteClientError?.message || 'Desconocido'));
    console.error("Error al eliminar el cliente:", error);
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

// --- Modificación de selectClientForDetails ---
const selectClientForDetails = (client) => {
  clienteSeleccionado.value = client;
  // Filtramos todas las facturas que pertenecen a este cliente (referenciado por nombre).
  historialLimpiezasCliente.value = databaseStore.limpiezas
    .filter((limpieza) => limpieza.clienteId === client.nombre)
    .sort((a, b) => {
      // Ordenar por fecha (la más reciente primero)
      const dateA = getRelevantCleaningDate(a) ? dayjs(getRelevantCleaningDate(a)) : dayjs('1900-01-01');
      const dateB = getRelevantCleaningDate(b) ? dayjs(getRelevantCleaningDate(b)) : dayjs('1900-01-01');
      return dateB.diff(dateA); // Orden descendente (más reciente primero)
    });
};

// Fecha de la factura (ya viene resuelta desde la hoja como fechaPrincipalLimpieza)
const getRelevantCleaningDate = (limpiezaData) => {
  const d = dayjs(limpiezaData.fechaPrincipalLimpieza);
  return d.isValid() ? d.format('YYYY-MM-DD') : null;
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


// --- LIFECYCLE HOOKS ---
onMounted(async () => {
  // Carga todas las limpiezas para asegurar un historial completo.
  await databaseStore.fetchLimpiezas();
  await databaseStore.fetchClientes();
});
</script>

<style scoped>
.mc-wrap {
  min-height: 100vh;
  background: #080d1a;
  padding: 36px 20px 60px;
  max-width: 1200px;
  margin: 0 auto;
}
.mc-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
}
.mc-back {
  display: inline-flex;
  align-items: center;
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.2s;
}
.mc-back:hover { color: #60a5fa; }

.mc-label {
  display: inline-block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #60a5fa;
  background: rgba(96,165,250,0.1);
  border: 1px solid rgba(96,165,250,0.2);
  border-radius: 20px;
  padding: 3px 12px;
  margin-bottom: 8px;
}
.mc-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: #fff; margin: 0; }
.mc-accent { color: #60a5fa; }
.mc-date { font-family: 'Raleway', sans-serif; font-size: 0.88rem; color: #64748b; font-weight: 600; }

.mc-loading { text-align: center; padding: 60px 20px; color: #64748b; font-family: 'Raleway', sans-serif; }
.mc-spinner {
  width: 32px; height: 32px;
  border: 3px solid rgba(96,165,250,0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto 14px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.mc-alert { font-family: 'Raleway', sans-serif; font-size: 0.84rem; border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; }
.mc-alert--err  { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.3);  color: #fca5a5; }
.mc-alert--info { background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.2); color: #93c5fd; }

.mc-card { background: #0f1729; border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
.mc-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-wrap: wrap;
  gap: 10px;
}
.mc-card-title { font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 1rem; color: #f1f5f9; margin: 0; display: flex; align-items: center; gap: 8px; }
.mc-count { font-size: 0.75rem; font-weight: 700; background: rgba(96,165,250,0.15); color: #60a5fa; border: 1px solid rgba(96,165,250,0.25); border-radius: 12px; padding: 2px 10px; }
.mc-card-body { padding: 20px 24px; }

.mc-detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
.mc-detail-label { font-family: 'Raleway', sans-serif; font-size: 0.66rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #475569; margin-bottom: 8px; }
.mc-detail-value { font-family: 'Raleway', sans-serif; font-size: 0.86rem; color: #94a3b8; margin-bottom: 4px; }
.mc-detail-icon { color: #475569; font-size: 0.75rem; }
.mc-section-divider { font-family: 'Raleway', sans-serif; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #475569; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; margin: 16px 0 12px; }

.mc-table-wrap { overflow-x: auto; }
.mc-table { width: 100%; border-collapse: collapse; font-family: 'Raleway', sans-serif; font-size: 0.84rem; }
.mc-table th { color: #475569; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.07); text-align: left; white-space: nowrap; }
.mc-table td { padding: 11px 12px; color: #94a3b8; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
.mc-table tbody tr:hover td { background: rgba(255,255,255,0.02); }
.mc-table strong { color: #e2e8f0; }
.mc-muted { color: #475569; font-size: 0.78rem; }
.mc-empty { font-family: 'Raleway', sans-serif; font-size: 0.88rem; color: #475569; padding: 12px 0; }

.mc-badge { display: inline-block; font-size: 0.65rem; font-weight: 700; border-radius: 6px; padding: 2px 6px; margin: 1px; }
.mc-badge--blue   { background: rgba(37,99,235,0.2);   color: #60a5fa; }
.mc-badge--grey   { background: rgba(100,116,139,0.2); color: #94a3b8; }
.mc-badge--green  { background: rgba(34,197,94,0.15);  color: #4ade80; }
.mc-badge--yellow { background: rgba(234,179,8,0.15);  color: #fbbf24; }

.mc-btn { font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.84rem; border: none; border-radius: 10px; padding: 8px 16px; cursor: pointer; display: inline-flex; align-items: center; transition: opacity 0.2s, transform 0.2s; }
.mc-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.mc-btn--primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; }
.mc-btn--ghost   { background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); }
.mc-btn--danger  { background: linear-gradient(135deg, #ef4444, #b91c1c); color: #fff; }
.mc-btn--danger:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

.mc-actions { display: flex; gap: 6px; }
.mc-icon-btn { width: 30px; height: 30px; border-radius: 7px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; transition: opacity 0.2s; }
.mc-icon-btn:hover { opacity: 0.8; }
.mc-icon-btn--blue { background: rgba(37,99,235,0.2);  color: #60a5fa; }
.mc-icon-btn--teal { background: rgba(20,184,166,0.2);  color: #2dd4bf; }
.mc-icon-btn--red  { background: rgba(239,68,68,0.2);   color: #f87171; }

.mc-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; }
.mc-modal { background: #0f1729; border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; width: 100%; max-width: 720px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,0.6); }
.mc-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); }
.mc-modal-header h5 { font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 1rem; color: #f1f5f9; margin: 0; }
.mc-modal-close { background: none; border: none; color: #64748b; font-size: 1rem; cursor: pointer; padding: 4px; transition: color 0.2s; }
.mc-modal-close:hover { color: #fff; }
.mc-modal-body { padding: 24px; overflow-y: auto; flex: 1; }
.mc-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07); }

.mc-modal--danger { max-width: 480px; border-color: rgba(239,68,68,0.25); }
.mc-modal--danger .mc-modal-header { border-bottom-color: rgba(239,68,68,0.15); }
.mc-modal--danger .mc-modal-header h5 { color: #f87171; display: flex; align-items: center; }
.mc-delete-warning { font-family: 'Raleway', sans-serif; font-size: 0.86rem; color: #94a3b8; line-height: 1.5; margin: 0 0 16px; }
.mc-delete-warning strong { color: #f1f5f9; }
.mc-delete-label { display: block; font-family: 'Raleway', sans-serif; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 6px; }

:deep(.form-control), :deep(.form-select) {
  background: rgba(255,255,255,0.05) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  color: #f1f5f9 !important;
  border-radius: 8px !important;
}
:deep(.form-control:focus), :deep(.form-select:focus) {
  background: rgba(96,165,250,0.06) !important;
  border-color: rgba(96,165,250,0.4) !important;
  box-shadow: none !important;
}
:deep(.form-control::placeholder) { color: #334155 !important; }
:deep(.form-label) { font-family: 'Raleway', sans-serif; font-size: 0.75rem; font-weight: 600; color: #64748b; }
:deep(h4) { font-family: 'Raleway', sans-serif; font-weight: 700; color: #94a3b8; font-size: 0.85rem; }
:deep(hr) { border-color: rgba(255,255,255,0.07); }

@media (max-width: 768px) {
  .mc-card-body { padding: 14px; }
  .mc-wrap { padding: 20px 12px 48px; }
}
</style>

