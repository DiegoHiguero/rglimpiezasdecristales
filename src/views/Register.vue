<template>
  <div class="rg-wrap">
    <div class="rg-card">

      <!-- Cabecera -->
      <div class="rg-header">
        <span class="rg-label">Panel Admin</span>
        <h1 class="rg-title">Nuevo <span class="rg-accent">cliente</span></h1>
        <p class="rg-sub">Rellena los datos del cliente para añadirlo al sistema.</p>
      </div>

      <!-- Error -->
      <div v-if="userStore.timeOut !== false" class="rg-feedback rg-feedback--err">
        <font-awesome-icon :icon="['fas', 'xmark']" class="me-2" />
        {{ userStore.mensaje }}
      </div>

      <form @submit.prevent="handleSubmit" novalidate>

        <!-- Sección: Datos personales -->
        <p class="rg-section-title">Datos personales</p>
        <div class="rg-row rg-row--3">
          <div class="rf" :class="{ 'rf--error': errors.nombre }">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'user']" /></div>
            <div class="rf-body">
              <label>Nombre <span class="rg-required">*</span></label>
              <input type="text" placeholder="Nombre" v-model="nombre" />
            </div>
          </div>
          <div class="rf">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'user']" /></div>
            <div class="rf-body">
              <label>Apellido</label>
              <input type="text" placeholder="Apellido" v-model="apellido" />
            </div>
          </div>
          <div class="rf" :class="{ 'rf--error': errors.telephone }">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'phone']" /></div>
            <div class="rf-body">
              <label>Teléfono <span class="rg-required">*</span></label>
              <input type="tel" placeholder="+34 600 000 000" v-model="telephone" />
            </div>
          </div>
        </div>
        <div class="rg-row">
          <div class="rf" :class="{ 'rf--error': errors.dni }">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'address-card']" /></div>
            <div class="rf-body">
              <label>DNI/NIF <span class="rg-required">*</span></label>
              <input type="text" placeholder="12345678A" v-model="dni" />
            </div>
          </div>
          <div class="rf" :class="{ 'rf--error': errors.email }">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'envelope']" /></div>
            <div class="rf-body">
              <label>Email</label>
              <input type="email" placeholder="cliente@email.com" v-model.trim="email" />
            </div>
          </div>
        </div>

        <!-- Sección: Ubicación -->
        <p class="rg-section-title">Ubicación</p>
        <div class="rg-row">
          <div class="rf" :class="{ 'rf--error': errors.direccion }">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'location-dot']" /></div>
            <div class="rf-body">
              <label>Dirección <span class="rg-required">*</span></label>
              <input type="text" placeholder="Calle y número" v-model="direccion" />
            </div>
          </div>
          <div class="rf" :class="{ 'rf--error': errors.ciudad }">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'house']" /></div>
            <div class="rf-body">
              <label>Ciudad <span class="rg-required">*</span></label>
              <input type="text" placeholder="Ciudad" v-model="ciudad" />
            </div>
          </div>
        </div>
        <div class="rg-row rg-row--3">
          <div class="rf">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'location-dot']" /></div>
            <div class="rf-body">
              <label>Provincia</label>
              <input type="text" placeholder="Provincia" v-model="provincia" />
            </div>
          </div>
          <div class="rf">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'location-dot']" /></div>
            <div class="rf-body">
              <label>Código Postal</label>
              <input type="text" placeholder="28001" v-model="codigoPostal" />
            </div>
          </div>
          <div class="rf">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'tag']" /></div>
            <div class="rf-body">
              <label>Precio habitual (€)</label>
              <input type="number" placeholder="0.00" v-model="precio" />
            </div>
          </div>
        </div>

        <!-- Sección: Tipo de cliente -->
        <p class="rg-section-title">Tipo de cliente</p>
        <div class="rg-row">
          <div class="rf">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'building']" /></div>
            <div class="rf-body">
              <label>Categoría</label>
              <select v-model="tipoCliente" class="rg-select">
                <option value="casa">Particular</option>
                <option value="empresa">Empresa</option>
                <option value="cooperativa">Cooperativa</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Días de limpieza -->
        <p class="rg-section-title">Días de limpieza</p>
        <div class="rg-days">
          <label v-for="dia in dias" :key="dia.val" class="rg-day-btn" :class="{ active: diasLimpieza.includes(dia.val) }">
            <input type="checkbox" v-model="diasLimpieza" :value="dia.val" />
            {{ dia.label }}
          </label>
        </div>

        <button type="submit" class="rg-submit" :disabled="saving">
          <span v-if="!saving">
            <font-awesome-icon :icon="['fas', 'check']" class="me-2" />
            Crear cliente
          </span>
          <span v-else class="rg-spinner"></span>
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useDatabaseStore } from '../stores/database';
import { useRouter } from 'vue-router';
import { db } from '../firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxSdk from '@mapbox/mapbox-sdk/services/geocoding';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();

const email        = ref('');
const dni          = ref('');
const nombre       = ref('');
const apellido     = ref('');
const direccion    = ref('');
const telephone    = ref('');
const ciudad       = ref('');
const provincia    = ref('');
const codigoPostal = ref('');
const precio       = ref('');
const tipoCliente  = ref('casa');
const saving       = ref(false);
const errors       = ref({});
const diasLimpieza = ref([]);

const dias = [
  { val: 'Lunes',     label: 'L' },
  { val: 'Martes',    label: 'M' },
  { val: 'Miércoles', label: 'X' },
  { val: 'Jueves',    label: 'J' },
  { val: 'Viernes',   label: 'V' },
  { val: 'Sábado',    label: 'S' },
  { val: 'Domingo',   label: 'D' },
];

const fechaCreacion = () => {
  const d = new Date();
  return `${d.getDate()} - ${d.getMonth() + 1} - ${d.getFullYear()}`;
};

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Antes esto comprobaba una contraseña que el formulario nunca pedía (venía
// de cuando esta vista era un registro de usuario con email/contraseña), así
// que la validación fallaba siempre sin importar lo que se rellenara.
// Ahora valida de verdad los campos que el cliente necesita.
const validate = () => {
  errors.value = {};
  if (!nombre.value.trim())    errors.value.nombre    = true;
  if (!dni.value.trim())       errors.value.dni       = true;
  if (!telephone.value.trim()) errors.value.telephone = true;
  if (!direccion.value.trim()) errors.value.direccion = true;
  if (!ciudad.value.trim())    errors.value.ciudad    = true;
  if (email.value && !EMAIL_RE.test(email.value)) errors.value.email = true;
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) {
    userStore.mensajeAlerta('Completa los campos obligatorios marcados en rojo.');
    return;
  }

  saving.value = true;
  try {
    // El cliente "real" — el que ven Mis Clientes, Nueva Factura, Registro
    // de Firmas, Facturas y el portal del cliente — vive en la hoja de
    // cálculo (pestaña CLIENTES), no en Firestore. Este es el guardado que
    // importa: si falla, no se considera creado el cliente.
    const nombreCompleto = apellido.value.trim()
      ? `${nombre.value.trim()} ${apellido.value.trim()}`
      : nombre.value.trim();
    await databaseStore.addClient({
      nombre:         nombreCompleto,
      nifCif:         dni.value.trim(),
      telefono:       telephone.value.trim(),
      email:          email.value.trim(),
      direccion:      direccion.value.trim(),
      precioHabitual: precio.value ? Number(precio.value) : 0,
      tipoCliente:    tipoCliente.value,
    });

    // Además se guarda (con geocodificación) en Firestore, que es de donde
    // lee el Mapa para pintar los marcadores — una base de datos aparte,
    // solo para esa vista. Si esto falla no se deshace el alta de arriba,
    // el cliente ya existe para facturar; solo no aparecería en el Mapa.
    try {
      let coordinatesData = null;
      try {
        const response = await mapboxClient.forwardGeocode({
          query: `${direccion.value}, ${ciudad.value}`,
          autocomplete: false,
          limit: 1,
        }).send();
        if (response?.body?.features?.length > 0) {
          coordinatesData = response.body.features[0].center;
        }
      } catch (e) {
        console.error('Geocoding error:', e);
      }

      await addDoc(collection(db, 'clientes'), {
        nombre:        nombre.value.trim(),
        apellido:      apellido.value.trim(),
        dni:           dni.value.trim(),
        telefono:      telephone.value.trim(),
        email:         email.value.trim(),
        direccion:     direccion.value.trim(),
        ciudad:        ciudad.value.trim(),
        provincia:     provincia.value.trim(),
        codigoPostal:  codigoPostal.value.trim(),
        precio:        precio.value ? Number(precio.value) : null,
        tipoCliente:   tipoCliente.value,
        diasLimpieza:  diasLimpieza.value,
        coordenadas:   coordinatesData,
        fechaCreacion: fechaCreacion(),
        createdAt:     serverTimestamp(),
      });
    } catch (e) {
      console.error('Error al guardar el cliente para el Mapa (no bloqueante):', e);
    }

    alert('Cliente creado con éxito.');
    router.push('/misClientes');
  } catch (e) {
    console.error('Error al crear el cliente:', e);
    userStore.mensajeAlerta('No se pudo guardar el cliente: ' + (e.message || 'Error desconocido'));
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.rg-wrap {
  min-height: 100vh;
  padding: 40px 16px 72px;
  background: #080d1a;
  display: flex;
  justify-content: center;
}

.rg-card {
  width: 100%;
  max-width: 860px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 40px 40px 36px;
  box-shadow: var(--shadow-lg);
  align-self: flex-start;
}

/* ── Header ── */
.rg-header { margin-bottom: 28px; }
.rg-back {
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
.rg-back:hover { color: #60a5fa; }

.rg-label {
  display: inline-block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--blue);
  background: var(--blue-pale);
  border: 1px solid rgba(37,99,235,0.2);
  border-radius: 20px;
  padding: 4px 14px;
  margin-bottom: 12px;
}
.rg-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.2rem;
  color: var(--text);
  margin: 0 0 6px;
}
.rg-accent { color: var(--blue); }
.rg-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: var(--text-muted);
  margin: 0;
}

/* ── Feedback ── */
.rg-feedback {
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.rg-feedback--err { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; }

/* ── Section titles ── */
.rg-section-title {
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 22px 0 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

/* ── Rows ── */
.rg-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 0;
}
.rg-row--3 { grid-template-columns: 1fr 1fr 1fr; }

/* ── Fields ── */
.rf {
  display: flex;
  align-items: center;
  background: var(--slate);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0 14px;
  margin-bottom: 12px;
  transition: border-color 0.2s, background 0.2s;
}
.rf:focus-within {
  border-color: var(--blue);
  background: var(--blue-pale);
}
.rf--error {
  border-color: #ef4444;
  background: rgba(239,68,68,0.05);
}
.rg-required { color: #ef4444; }
.rf-icon {
  color: var(--text-muted);
  font-size: 0.82rem;
  width: 16px;
  flex-shrink: 0;
  margin-right: 11px;
  transition: color 0.2s;
}
.rf:focus-within .rf-icon { color: var(--blue); }
.rf-body { flex: 1; padding: 9px 0; }
.rf-body label {
  display: block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 2px;
}
.rf-body input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  padding: 0;
}
.rf-body input::placeholder { color: var(--text-muted); opacity: 0.5; }
.rg-select {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  padding: 0;
  cursor: pointer;
}

/* ── Days ── */
.rg-days {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.rg-day-btn {
  position: relative;
  cursor: pointer;
}
.rg-day-btn input { display: none; }
.rg-day-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--slate);
  font-family: 'Raleway', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  user-select: none;
}
.rg-day-btn:hover { border-color: var(--blue); color: var(--text); }
.rg-day-btn.active {
  background: var(--blue-pale);
  border-color: var(--blue);
  color: var(--blue);
}

/* ── Submit ── */
.rg-submit {
  width: 100%;
  padding: 14px;
  margin-top: 24px;
  background: var(--blue);
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.rg-submit:hover:not(:disabled) {
  background: var(--blue-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37,99,235,0.35);
}
.rg-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.rg-spinner {
  width: 20px; height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Responsive ── */
@media (max-width: 700px) {
  .rg-card { padding: 28px 18px 24px; border-radius: 16px; }
  .rg-row, .rg-row--3 { grid-template-columns: 1fr; }
  .rg-title { font-size: 1.8rem; }
}
</style>
