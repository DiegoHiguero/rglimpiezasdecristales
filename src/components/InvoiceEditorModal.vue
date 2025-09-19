<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import dayjs from 'dayjs';

// No necesitamos importar formatCurrency desde un archivo externo aquí,
// ya que la recibiremos como una prop.

// Props que el componente padre (LimpiezasView.vue) le pasará
const props = defineProps({
  invoiceData: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  // ¡DECLARA formatCurrency como una prop de tipo Function!
  formatCurrency: {
    type: Function,
    required: true // O false si es opcional
  }
});

// Eventos que el modal emitirá al componente padre
const emit = defineEmits(['close', 'generatePdf', 'previewPdf']);

// Estado local para los ítems editables de la factura
const currentInvoice = ref(null);

// Función para inicializar currentInvoice a partir de props.invoiceData
const initializeCurrentInvoice = () => {
  if (props.invoiceData) {
    currentInvoice.value = JSON.parse(JSON.stringify(props.invoiceData));
    // Asegurarse de que customItems siempre sea un array y tenga al menos un elemento vacío
    if (!currentInvoice.value.customItems || currentInvoice.value.customItems.length === 0) {
      addCustomItem(); // Añade un ítem vacío para empezar
    } else {
       // Asegurar que los customItems tienen las propiedades numéricas como números
       currentInvoice.value.customItems.forEach(item => {
         item.qty = parseFloat(item.qty || 0);
         item.unitPrice = parseFloat(item.unitPrice || 0);
         item.totalHT = parseFloat(item.totalHT || 0);
       });
    }

    // Asegurar que los invoiceItems tienen las propiedades numéricas como números
    currentInvoice.value.invoiceItems.forEach(item => {
      item.qty = parseFloat(item.qty || 0);
      item.unitPrice = parseFloat(item.unitPrice || 0);
      item.totalHT = parseFloat(item.totalHT || 0);
    });

  } else {
    currentInvoice.value = null;
  }
};

// Observar cambios en props.invoiceData para re-inicializar
watch(() => props.invoiceData, (newVal) => {
  if (newVal) {
    initializeCurrentInvoice();
  }
}, { deep: true, immediate: true });

// Propiedad computada para calcular el total de todos los ítems (originales + personalizados)
const totalInvoiceAmount = computed(() => {
  if (!currentInvoice.value) return 0;
  let total = 0;
  currentInvoice.value.invoiceItems.forEach(item => {
    total += item.totalHT || 0;
  });
  currentInvoice.value.customItems.forEach(item => {
    total += item.totalHT || 0;
  });
  return parseFloat(total.toFixed(2));
});

// Métodos para manejar ítems personalizados
const addCustomItem = () => {
  if (!currentInvoice.value.customItems) {
    currentInvoice.value.customItems = [];
  }
  currentInvoice.value.customItems.push({
    description: '',
    date: dayjs().format('YYYY-MM-DD'), // Fecha predeterminada para nuevos ítems
    qty: 1,
    unitPrice: 0,
    totalHT: 0
  });
};

const removeCustomItem = (index) => {
  currentInvoice.value.customItems.splice(index, 1);
};

// Actualiza el totalHT de un ítem personalizado cuando cambian qty o unitPrice
const updateCustomItemTotal = (item) => {
  item.qty = parseFloat(item.qty) || 0;
  item.unitPrice = parseFloat(item.unitPrice) || 0;
  item.totalHT = parseFloat((item.qty * item.unitPrice).toFixed(2));
};

// Envía la solicitud para generar el PDF al padre
const generatePdf = () => {
  if (!currentInvoice.value) return;
  // Fusionar ítems originales y personalizados (filtrando los vacíos)
  const finalInvoiceData = {
    ...currentInvoice.value,
    invoiceItems: [
      ...currentInvoice.value.invoiceItems,
      ...currentInvoice.value.customItems.filter(item => item.description.trim() !== '' && item.totalHT !== 0)
    ]
  };
  emit('generatePdf', finalInvoiceData);
  emit('close'); // Cerrar modal después de generar
};

// Envía la solicitud para previsualizar el PDF al padre
const previewPdf = () => {
  if (!currentInvoice.value) return;
  const finalInvoiceData = {
    ...currentInvoice.value,
    invoiceItems: [
      ...currentInvoice.value.invoiceItems,
      ...currentInvoice.value.customItems.filter(item => item.description.trim() !== '' && item.totalHT !== 0)
    ]
  };
  emit('previewPdf', finalInvoiceData);
};

// Método para cerrar el modal
const closeModal = () => {
  emit('close');
};

// Watch para resetear el formulario y asegurar el scroll a la parte superior
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    initializeCurrentInvoice();
    nextTick(() => {
      const modalBody = document.querySelector('.invoice-editor-modal .modal-body');
      if (modalBody) modalBody.scrollTop = 0;
    });
  }
});

// Función auxiliar para formatear la fecha a YYYY-MM-DD para el input type="date"
const formatDateForInput = (dateValue) => {
  if (!dateValue) return '';
  let date;
  if (typeof dateValue.toDate === 'function') { // Firebase Timestamp
    date = dayjs(dateValue.toDate());
  } else if (dateValue instanceof Date) {
    date = dayjs(dateValue);
  } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    date = dayjs(dateValue);
    if (!date.isValid()) { return ''; }
  } else {
    return '';
  }
  return date.format('YYYY-MM-DD');
};
</script>

<template>
  <div v-if="isOpen && currentInvoice" class="modal fade show invoice-editor-modal" style="display: block;" tabindex="-1"
    aria-labelledby="invoiceEditorModalLabel" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="invoiceEditorModalLabel">
            Éditer la Facture (N° {{ currentInvoice.factura }})
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Fermer"></button>
        </div>
        <div class="modal-body">
          <div class="row mb-4">
            <div class="col-md-6">
              <h6 class="text-primary">Détails du Client</h6>
              <p><strong>{{ currentInvoice.clientDetails.nombre }} {{ currentInvoice.clientDetails.apellido }}</strong></p>
              <p>{{ currentInvoice.clientDetails.direccion }}</p>
              <p>{{ currentInvoice.clientDetails.codigoPostal }} {{ currentInvoice.clientDetails.ciudad }}</p>
              <p>Tel: {{ currentInvoice.clientDetails.telefono }}</p>
              <p>Email: {{ currentInvoice.clientDetails.email }}</p>
            </div>
            <div class="col-md-6">
              <h6 class="text-primary">Détails de la Facture</h6>
              <div class="mb-3">
                <label for="invoiceNumberEdit" class="form-label">Numéro de Facture:</label>
                <input type="text" class="form-control" id="invoiceNumberEdit" v-model="currentInvoice.factura" />
              </div>
              <div class="mb-3">
                <label for="paymentMethodEdit" class="form-label">Mode de paiement:</label>
                <select class="form-select" id="paymentMethodEdit" v-model="currentInvoice.formaPago">
                  <option value="Efectivo">Espèces</option>
                  <option value="Cheque">Chèque</option>
                  <option value="Giro Bancario">Virement Bancaire</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="paymentDateEdit" class="form-label">Date de paiement:</label>
                <input type="date" class="form-control" id="paymentDateEdit" v-model="currentInvoice.fechaPago" />
              </div>
            </div>
          </div>

          <h6 class="text-primary mb-3">Postes de Nettoyage (issus du Registre)</h6>
          <div class="table-responsive">
            <table class="table table-bordered table-sm">
              <thead>
                <tr class="table-light">
                  <th style="width: 40%;">Description</th>
                  <th style="width: 15%;">Date</th>
                  <th style="width: 10%;">Qté</th>
                  <th style="width: 15%;">Prix Unitaire H.T.</th>
                  <th style="width: 20%;">Total H.T.</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in currentInvoice.invoiceItems" :key="'item-' + index">
                  <td>
                    <!-- Puedes hacer la descripción editable si lo necesitas -->
                    <input type="text" class="form-control form-control-sm" v-model="item.description" />
                  </td>
                  <td>
                    <!-- Puedes hacer la fecha editable si lo necesitas -->
                    <input type="date" class="form-control form-control-sm" :value="formatDateForInput(item.date)" @input="event => item.date = event.target.value" />
                  </td>
                  <td>
                    <input type="number" step="1" min="0" class="form-control form-control-sm text-end" v-model.number="item.qty" @input="updateCustomItemTotal(item)" />
                  </td>
                  <td>
                    <input type="number" step="0.01" min="0" class="form-control form-control-sm text-end" v-model.number="item.unitPrice" @input="updateCustomItemTotal(item)" />
                  </td>
                  <td class="text-end">
                    {{ props.formatCurrency(item.totalHT) }} <!-- ¡USO DE LA PROP! -->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h6 class="text-primary mt-4 mb-3">Postes Personnalisés</h6>
          <div class="table-responsive">
            <table class="table table-bordered table-sm">
              <thead>
                <tr class="table-light">
                  <th style="width: 35%;">Description</th>
                  <th style="width: 15%;">Date</th>
                  <th style="width: 10%;">Qté</th>
                  <th style="width: 15%;">Prix Unitaire H.T.</th>
                  <th style="width: 20%;">Total H.T.</th>
                  <th style="width: 5%;"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(customItem, index) in currentInvoice.customItems" :key="'custom-' + index">
                  <td>
                    <input type="text" class="form-control form-control-sm" v-model="customItem.description" />
                  </td>
                  <td>
                    <input type="date" class="form-control form-control-sm" v-model="customItem.date" />
                  </td>
                  <td>
                    <input type="number" step="1" min="0" class="form-control form-control-sm text-end" v-model.number="customItem.qty" @input="updateCustomItemTotal(customItem)" />
                  </td>
                  <td>
                    <input type="number" step="0.01" min="0" class="form-control form-control-sm text-end" v-model.number="customItem.unitPrice" @input="updateCustomItemTotal(customItem)" />
                  </td>
                  <td class="text-end">
                    {{ props.formatCurrency(customItem.totalHT) }} <!-- ¡USO DE LA PROP! -->
                  </td>
                  <td>
                    <button type="button" class="btn btn-sm btn-outline-danger" @click="removeCustomItem(index)"
                      title="Supprimer la ligne">
                      <font-awesome-icon :icon="['fas', 'trash-can']" />
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4" class="text-end"><strong>TOTAL H.T. DE LA FACTURE:</strong></td>
                  <td class="text-end"><strong>{{ props.formatCurrency(totalInvoiceAmount) }}</strong></td> <!-- ¡USO DE LA PROP! -->
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <button type="button" class="btn btn-outline-primary btn-sm mt-2" @click="addCustomItem">
            <font-awesome-icon :icon="['fas', 'plus']" class="me-1" /> Ajouter une ligne personnalisée
          </button>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn btn-secondary" @click="closeModal">Fermer</button>
          <div>
            <button type="button" class="btn btn-info text-white me-2" @click="previewPdf">
              <font-awesome-icon :icon="['fas', 'eye']" class="me-1" /> Prévisualiser
            </button>
            <button type="button" class="btn btn-success" @click="generatePdf">
              <font-awesome-icon :icon="['fas', 'file-pdf']" class="me-1" /> Générer PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isOpen" class="modal-backdrop fade show"></div>
</template>

<style scoped>
/* Estilos específicos para este modal */
.invoice-editor-modal .modal-dialog {
  max-width: 95%;
  min-width: 900px;
}
.invoice-editor-modal .modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
.form-control-sm {
  height: calc(1.5em + 0.5rem + 2px);
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
}
table input[type="date"] {
  padding: 0.25rem;
}
.btn-close-white {
  filter: brightness(0) invert(1);
}
</style>
