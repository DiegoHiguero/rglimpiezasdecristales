<template>
  <div class="nf-wrap">
    <div class="nf-header">
      <span class="nf-label">Panel Admin</span>
      <h1 class="nf-title">Nueva <span class="nf-accent">Factura</span></h1>
      <p class="nf-sub">Registra una limpieza nueva y factúrala automáticamente.</p>
    </div>

    <div class="nf-card">
      <div class="nf-card-head">
        Añadir Nueva Limpieza
        <span class="nf-count">Factura #{{ proximaFactura }}</span>
      </div>
      <div class="nf-card-body">
        <form @submit.prevent="agregarLimpieza">

          <div class="nf-row">
            <div class="nf-field">
              <label>Cliente</label>
              <div class="nf-field-with-btn">
                <select v-model="nuevaLimpieza.clienteId" required>
                  <option value="" disabled>Seleccione un cliente</option>
                  <option v-if="databaseStore.isLoadingClientes" disabled>Cargando clientes...</option>
                  <option v-if="databaseStore.errorClientes" disabled>Error al cargar clientes</option>
                  <option v-for="cliente in databaseStore.clientes" :key="cliente.id" :value="cliente.nombre">
                    {{ cliente.nombre }}
                  </option>
                </select>
                <button type="button" class="nf-btn nf-btn--ghost nf-btn--sm" @click="openAddClientModal">+ Cliente</button>
              </div>
            </div>
            <div class="nf-field">
              <label>Número de Factura Manual (Opcional)</label>
              <input type="text" v-model="manualFacturaInput" placeholder="Dejar vacío para generar automáticamente" />
              <span class="nf-hint">Si se deja vacío, se usará: {{ proximaFactura }}</span>
            </div>
          </div>

          <div class="nf-subhead">Semanas</div>
          <div class="nf-semanas-grid">
            <div class="nf-field" v-for="n in 4" :key="n">
              <label>Semana {{ n }}</label>
              <input type="date" v-model="nuevaLimpieza[`semana${n}`]" />
              <input type="text" v-model="nuevaLimpieza[`semana${n}Notas`]" :placeholder="`Notas para Semana ${n}`" class="nf-notas-input" />
            </div>
          </div>

          <div class="nf-subhead">Limpiezas Extra</div>
          <div class="nf-extra-list">
            <div v-for="(extra, index) in nuevaLimpieza.extraCleanings" :key="index" class="nf-extra-row">
              <div class="nf-field nf-field--grow">
                <label>Descripción</label>
                <input type="text" v-model="extra.description" />
              </div>
              <div class="nf-field">
                <label>Fecha</label>
                <input type="date" v-model="extra.date" />
              </div>
              <div class="nf-field nf-field--sm">
                <label>Cantidad</label>
                <input type="number" v-model.number="extra.quantity" min="1" />
              </div>
              <div class="nf-field nf-field--sm">
                <label>Precio Unidad (€)</label>
                <input type="number" v-model.number="extra.unitPrice" step="0.01" min="0" />
              </div>
              <div class="nf-field nf-field--sm">
                <label>Total (€)</label>
                <input type="text" :value="(Number(extra.quantity) * Number(extra.unitPrice) || 0).toFixed(2)" readonly />
              </div>
              <button type="button" class="nf-remove-btn" @click="removeExtraCleaning(index)" title="Eliminar línea">
                <font-awesome-icon :icon="['fas', 'xmark']" />
              </button>
            </div>
          </div>
          <button type="button" class="nf-btn nf-btn--ghost nf-btn--sm" @click="addExtraCleaningLine">+ Añadir Línea Extra</button>

          <div class="nf-row nf-row--totals">
            <div class="nf-field">
              <label>Precio Bruto (€)</label>
              <input type="number" step="0.01" :value="calculatedPrecioBrutoNueva" readonly class="nf-readonly" />
            </div>
            <div class="nf-field">
              <label>Forma de Pago</label>
              <select v-model="nuevaLimpieza.formaPago">
                <option value="Efectivo">Efectivo</option>
                <option value="Cheque">Cheque</option>
                <option value="Giro Bancario">Giro Bancario</option>
              </select>
            </div>
            <div class="nf-field">
              <label>Fecha de Pago</label>
              <input type="date" v-model="nuevaLimpieza.fechaPago" />
            </div>
          </div>

          <div class="nf-field">
            <label>Firmas de este cliente a vincular ({{ firmasSeleccionadasNueva.length }} seleccionadas)</label>
            <p v-if="!nuevaLimpieza.clienteId" class="nf-hint">Selecciona un cliente para ver sus firmas.</p>
            <p v-else-if="cargandoFirmasNueva" class="nf-hint">Cargando firmas...</p>
            <p v-else-if="firmasPendientesNueva.length === 0" class="nf-hint">
              Este cliente no tiene firmas sin facturar. Captúralas desde "Registro de Firmas".
            </p>
            <div v-else class="nf-firmas-grid">
              <label v-for="f in firmasPendientesNueva" :key="f.id" class="nf-firma-item">
                <input type="checkbox" :value="f.id" v-model="firmasSeleccionadasNueva" />
                <img :src="f.url" alt="firma" class="nf-firma-img" :class="{ 'nf-firma-img--selected': firmasSeleccionadasNueva.includes(f.id) }" />
                <span class="nf-firma-date">{{ formatEuropeanDate(f.fecha) }}</span>
              </label>
            </div>
          </div>

          <div class="nf-submit-row">
            <button type="submit" class="nf-btn nf-btn--primary" :disabled="isLoading">
              {{ isLoading ? 'Guardando...' : 'Añadir Registro' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Añadir Cliente -->
    <Teleport to="body">
      <div v-if="isAddClientModalOpen" class="nf-modal-backdrop" @click.self="closeAddClientModal">
        <div class="nf-modal">
          <div class="nf-modal-header">
            <h5>Añadir Nuevo Cliente</h5>
            <button class="nf-modal-close" @click="closeAddClientModal">
              <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          <div class="nf-modal-body">
            <form @submit.prevent="saveNewClient">
              <div class="nf-row">
                <div class="nf-field">
                  <label>Nombre / Razón social</label>
                  <input type="text" v-model="newClient.nombre" required />
                </div>
                <div class="nf-field">
                  <label>NIF/CIF</label>
                  <input type="text" v-model="newClient.nifCif" />
                </div>
              </div>
              <div class="nf-field">
                <label>Dirección</label>
                <input type="text" v-model="newClient.direccion" />
              </div>
              <div class="nf-row">
                <div class="nf-field">
                  <label>Teléfono</label>
                  <input type="tel" v-model="newClient.telefono" />
                </div>
                <div class="nf-field">
                  <label>Email</label>
                  <input type="email" v-model="newClient.email" />
                </div>
              </div>
              <div class="nf-row">
                <div class="nf-field">
                  <label>Persona de contacto</label>
                  <input type="text" v-model="newClient.personaContacto" />
                </div>
                <div class="nf-field">
                  <label>Precio habitual (€)</label>
                  <input type="number" v-model.number="newClient.precioHabitual" step="0.01" min="0" />
                </div>
                <div class="nf-field">
                  <label>Categoría (para el mapa)</label>
                  <select v-model="newClient.tipoCliente">
                    <option value="">Sin especificar</option>
                    <option value="casa">Particular</option>
                    <option value="empresa">Empresa</option>
                    <option value="cooperativa">Cooperativa</option>
                  </select>
                </div>
              </div>
              <div class="nf-field">
                <label>Notas</label>
                <textarea v-model="newClient.notas" rows="2"></textarea>
              </div>
            </form>
          </div>
          <div class="nf-modal-footer">
            <button type="button" class="nf-btn nf-btn--ghost" @click="closeAddClientModal">Cancelar</button>
            <button type="button" class="nf-btn nf-btn--primary" @click="saveNewClient" :disabled="isSavingNewClient">
              {{ isSavingNewClient ? 'Guardando...' : 'Guardar Cliente' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useDatabaseStore } from '../stores/database';
import { ensurePortalToken, mirrorFacturaToPortal, getFirmasCliente, linkFirmasToFactura } from '../services/portal';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const databaseStore = useDatabaseStore();

const manualFacturaInput = ref('');

const nuevaLimpieza = ref({
  cliente: '',
  clienteId: null,
  semana1: '', semana1Notas: '',
  semana2: '', semana2Notas: '',
  semana3: '', semana3Notas: '',
  semana4: '', semana4Notas: '',
  extraCleanings: [{ description: '', date: '', quantity: 1, unitPrice: 0 }],
  formaPago: 'Efectivo',
  fechaPago: null,
  basePriceNeto: 0,
});

const newClient = ref({
  nombre: '', nifCif: '', direccion: '', telefono: '', email: '', personaContacto: '', notas: '', precioHabitual: 0.00, tipoCliente: '',
});

const isAddClientModalOpen = ref(false);
const isSavingNewClient = ref(false);

const isLoading = computed(() => databaseStore.isLoadingLimpiezas);
const proximaFactura = computed(() => databaseStore.nextFacturaFormatted);

const selectedClientForNueva = computed(() => {
  return databaseStore.clientes.find(c => c.nombre === nuevaLimpieza.value.clienteId) || null;
});

// ── Firmas pendientes (capturadas por separado en "Registro de Firmas") ──────
const firmasPendientesNueva = ref([]);
const firmasSeleccionadasNueva = ref([]);
const cargandoFirmasNueva = ref(false);

async function cargarFirmasPendientes(clienteNombre) {
  firmasPendientesNueva.value = [];
  if (!clienteNombre) return;
  const cliente = databaseStore.clientes.find(c => c.nombre === clienteNombre);
  if (!cliente) return;
  cargandoFirmasNueva.value = true;
  try {
    const token = await ensurePortalToken(cliente.nombre, cliente.email, cliente.direccion);
    const firmas = await getFirmasCliente(token);
    firmasPendientesNueva.value = firmas.filter(f => !f.facturaId);
  } catch (error) {
    console.error('Error al cargar las firmas pendientes del cliente:', error);
  } finally {
    cargandoFirmasNueva.value = false;
  }
}

watch(() => nuevaLimpieza.value.clienteId, (nombre) => {
  firmasSeleccionadasNueva.value = [];
  cargarFirmasPendientes(nombre);
});

// Métodos para limpiezas extra
const addExtraCleaningLine = () => {
  nuevaLimpieza.value.extraCleanings.push({ description: '', date: '', quantity: 1, unitPrice: 0 });
};
const removeExtraCleaning = (index) => {
  nuevaLimpieza.value.extraCleanings.splice(index, 1);
};

const calculatedExtraCleaningsTotalNueva = computed(() => {
  let total = 0;
  for (const extra of nuevaLimpieza.value.extraCleanings) {
    if (extra.quantity && extra.unitPrice) {
      total += (Number(extra.quantity) * Number(extra.unitPrice));
    }
  }
  return parseFloat(total.toFixed(2));
});

const baseNetPriceNueva = computed(() => {
  const client = selectedClientForNueva.value;
  return client ? (client.precioHabitual || 0) : 0;
});

const calculatedPrecioBrutoNueva = computed(() => {
  const totalNetoBase = baseNetPriceNueva.value + calculatedExtraCleaningsTotalNueva.value;
  return parseFloat((totalNetoBase * 1.21).toFixed(2));
});

const getEarliestSemanaDate = (limpiezaData) => {
  let earliestDate = null;
  for (let i = 1; i <= 4; i++) {
    const dateString = limpiezaData[`semana${i}`];
    if (dateString) {
      const currentDate = dayjs(dateString);
      if (currentDate.isValid() && (!earliestDate || currentDate.isBefore(earliestDate))) {
        earliestDate = currentDate;
      }
    }
  }
  if (limpiezaData.extraCleanings && limpiezaData.extraCleanings.length > 0) {
    for (const extra of limpiezaData.extraCleanings) {
      if (extra.date) {
        const extraDate = dayjs(extra.date);
        if (extraDate.isValid() && (!earliestDate || extraDate.isBefore(earliestDate))) {
          earliestDate = extraDate;
        }
      }
    }
  }
  return earliestDate ? earliestDate.format('YYYY-MM-DD') : null;
};

const formatEuropeanDate = (dateValue) => {
  if (!dateValue) return '';
  const date = dayjs(dateValue);
  return date.isValid() ? date.format('DD/MM/YYYY') : '';
};

const openAddClientModal = () => {
  isAddClientModalOpen.value = true;
  Object.assign(newClient.value, {
    nombre: '', nifCif: '', direccion: '', telefono: '', email: '', personaContacto: '', notas: '', precioHabitual: 0.00, tipoCliente: '',
  });
};
const closeAddClientModal = () => { isAddClientModalOpen.value = false; };

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
    await databaseStore.fetchClientes();
  } catch (error) {
    alert('Error al añadir el cliente: ' + (databaseStore.addClientError?.message || 'Desconocido'));
    console.error("Error al guardar el nuevo cliente:", error);
  } finally {
    isSavingNewClient.value = false;
  }
};

/**
 * Espeja la factura al portal público del cliente y vincula las firmas
 * seleccionadas (ya capturadas antes desde "Registro de Firmas"). No
 * bloquea ni deshace el guardado real en la hoja si falla — solo avisa en
 * consola, ya que la factura en sí ya quedó guardada.
 */
const mirrorFacturaConFirmas = async (client, limpiezaGuardada, firmaIds) => {
  try {
    const token = await ensurePortalToken(client.nombre, client.email, client.direccion);
    await mirrorFacturaToPortal(token, {
      numeroFactura: limpiezaGuardada.factura,
      fecha: limpiezaGuardada.fechaPrincipalLimpieza,
      concepto: 'Limpieza de cristales',
      total: limpiezaGuardada.precioBruto,
      estado: limpiezaGuardada.fechaPago ? 'Pagada' : 'Pendiente',
    });
    await linkFirmasToFactura(token, limpiezaGuardada.factura, firmaIds);
  } catch (err) {
    console.error('Error al espejar la factura/firmas al portal del cliente:', err);
  }
};

/**
 * Añade un nuevo registro de limpieza.
 */
const agregarLimpieza = async () => {
  if (!nuevaLimpieza.value.clienteId) { alert('Por favor, selecciona un cliente.'); return; }
  const client = selectedClientForNueva.value;
  if (!client) { alert('Error: Cliente no encontrado con el ID seleccionado.'); return; }

  let algunaSemanaConFecha = false;
  for (let i = 1; i <= 4; i++) {
    if (nuevaLimpieza.value[`semana${i}`]) { algunaSemanaConFecha = true; break; }
  }
  const hasExtraCleanings = nuevaLimpieza.value.extraCleanings.some(
    extra => extra.description && extra.unitPrice && extra.quantity > 0
  );

  if (!algunaSemanaConFecha && !hasExtraCleanings) {
    alert('Por favor, completa al menos una fecha de limpieza o añade una limpieza extra.');
    return;
  }

  const limpiezaParaGuardar = { ...nuevaLimpieza.value };

  // Si se deja en blanco, el store calcula el número en el momento de
  // guardar (leyendo la hoja en vivo) para no duplicar facturas.
  limpiezaParaGuardar.factura = manualFacturaInput.value.trim();

  limpiezaParaGuardar.basePriceNeto = baseNetPriceNueva.value;
  limpiezaParaGuardar.precioBruto = calculatedPrecioBrutoNueva.value;
  limpiezaParaGuardar.clienteId = nuevaLimpieza.value.clienteId;
  limpiezaParaGuardar.cliente = client.nombre;
  limpiezaParaGuardar.fechaPago = nuevaLimpieza.value.fechaPago || null;

  limpiezaParaGuardar.semana1 = limpiezaParaGuardar.semana1 || null;
  limpiezaParaGuardar.semana1Notas = limpiezaParaGuardar.semana1Notas || null;
  limpiezaParaGuardar.semana2 = limpiezaParaGuardar.semana2 || null;
  limpiezaParaGuardar.semana2Notas = limpiezaParaGuardar.semana2Notas || null;
  limpiezaParaGuardar.semana3 = limpiezaParaGuardar.semana3 || null;
  limpiezaParaGuardar.semana3Notas = limpiezaParaGuardar.semana3Notas || null;
  limpiezaParaGuardar.semana4 = limpiezaParaGuardar.semana4 || null;
  limpiezaParaGuardar.semana4Notas = limpiezaParaGuardar.semana4Notas || null;

  limpiezaParaGuardar.extraCleanings = limpiezaParaGuardar.extraCleanings.filter(
    extra => extra.description && extra.unitPrice && extra.quantity > 0
  );

  limpiezaParaGuardar.fechaPrincipalLimpieza = getEarliestSemanaDate(limpiezaParaGuardar);

  const firmasAVincular = [...firmasSeleccionadasNueva.value];

  try {
    const facturaFinal = await databaseStore.addLimpieza(limpiezaParaGuardar);
    limpiezaParaGuardar.factura = facturaFinal;
    alert(`Registro añadido con éxito! (Factura ${facturaFinal})`);
    Object.assign(nuevaLimpieza.value, {
      cliente: '', clienteId: null,
      semana1: '', semana1Notas: '',
      semana2: '', semana2Notas: '',
      semana3: '', semana3Notas: '',
      semana4: '', semana4Notas: '',
      extraCleanings: [{ description: '', date: '', quantity: 1, unitPrice: 0 }],
      formaPago: 'Efectivo', fechaPago: null, basePriceNeto: 0,
    });
    manualFacturaInput.value = '';
    firmasSeleccionadasNueva.value = [];
    firmasPendientesNueva.value = [];

    mirrorFacturaConFirmas(client, limpiezaParaGuardar, firmasAVincular);
  } catch (err) {
    alert('Error al añadir el registro: ' + (databaseStore.addLimpiezaError?.message || 'Desconocido'));
    console.error("Error al añadir limpieza en componente:", err);
  }
};

onMounted(async () => {
  await databaseStore.fetchClientes();
  await databaseStore.fetchNextFacturaFormattedNumber();
});
</script>

<style scoped>
.nf-wrap {
  min-height: 100vh;
  background: #080d1a;
  padding: 36px 24px 60px;
  max-width: 980px;
  margin: 0 auto;
}
.nf-header { margin-bottom: 24px; }
.nf-label {
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
  padding: 3px 14px;
  margin-bottom: 10px;
}
.nf-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: #f1f5f9; margin: 0 0 6px; line-height: 1.1; }
.nf-accent { color: #60a5fa; }
.nf-sub { font-family: 'Raleway', sans-serif; font-size: 0.88rem; color: #64748b; margin: 0; }

.nf-card {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  overflow: hidden;
}
.nf-card-head {
  padding: 16px 22px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 10px;
}
.nf-count {
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(96,165,250,0.15);
  color: #60a5fa;
  border: 1px solid rgba(96,165,250,0.25);
  border-radius: 12px;
  padding: 1px 9px;
}
.nf-card-body { padding: 24px 22px; }

.nf-subhead {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  margin: 22px 0 12px;
}
.nf-subhead:first-of-type { margin-top: 0; }

.nf-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 16px; margin-bottom: 6px; }
.nf-row--totals { margin-top: 6px; }

.nf-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.nf-field label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}
.nf-field input,
.nf-field select,
.nf-field textarea {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #f1f5f9;
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  padding: 9px 12px;
  outline: none;
  transition: border-color 0.2s;
  resize: none;
  width: 100%;
}
.nf-field input:focus,
.nf-field select:focus,
.nf-field textarea:focus { border-color: rgba(96,165,250,0.4); background: rgba(96,165,250,0.04); }
.nf-field input::placeholder,
.nf-field textarea::placeholder { color: #334155; }
.nf-field select option { background: #0f1729; }
.nf-field input[readonly],
.nf-readonly { color: #94a3b8; background: rgba(255,255,255,0.02); cursor: not-allowed; }

.nf-notas-input { margin-top: 6px; }

.nf-field-with-btn { display: flex; gap: 8px; align-items: flex-start; }
.nf-field-with-btn select { flex: 1; }

.nf-hint { font-family: 'Raleway', sans-serif; font-size: 0.82rem; color: #64748b; margin: 4px 0 0; }

.nf-semanas-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap: 16px; margin-bottom: 6px; }

.nf-extra-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
.nf-extra-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  flex-wrap: wrap;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 12px;
}
.nf-field--grow { flex: 2; min-width: 160px; }
.nf-field--sm { flex: 1; min-width: 100px; }
.nf-extra-row .nf-field { margin-bottom: 0; }
.nf-remove-btn {
  background: rgba(239,68,68,0.15);
  color: #f87171;
  border: none;
  border-radius: 7px;
  width: 34px;
  height: 34px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s;
}
.nf-remove-btn:hover { opacity: 0.8; }

.nf-firmas-grid { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
.nf-firma-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  padding: 10px;
  width: 110px;
  cursor: pointer;
}
.nf-firma-item input { display: none; }
.nf-firma-img { height: 56px; background: #fff; border-radius: 6px; border: 2px solid transparent; transition: border-color 0.15s; }
.nf-firma-img--selected { border-color: #2563eb; }
.nf-firma-date { font-family: 'Raleway', sans-serif; font-size: 0.65rem; color: #64748b; }

.nf-submit-row { margin-top: 20px; display: flex; justify-content: flex-end; }

.nf-btn {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.84rem;
  border: none;
  border-radius: 10px;
  padding: 9px 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.2s, transform 0.2s;
}
.nf-btn:hover { opacity: 0.85; transform: translateY(-1px); }
.nf-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.nf-btn--primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; }
.nf-btn--ghost { background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); }
.nf-btn--sm { padding: 6px 12px; font-size: 0.76rem; }

/* Modal Añadir Cliente */
.nf-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; }
.nf-modal { background: #0f1729; border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; width: 100%; max-width: 560px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,0.6); }
.nf-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); }
.nf-modal-header h5 { font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 1rem; color: #f1f5f9; margin: 0; }
.nf-modal-close { background: none; border: none; color: #64748b; font-size: 1rem; cursor: pointer; padding: 4px; transition: color 0.2s; }
.nf-modal-close:hover { color: #fff; }
.nf-modal-body { padding: 24px; overflow-y: auto; flex: 1; }
.nf-modal-body .nf-field { margin-bottom: 14px; }
.nf-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07); }

@media (max-width: 480px) {
  .nf-wrap { padding: 24px 12px 48px; }
  .nf-field-with-btn { flex-direction: column; }
}
</style>
