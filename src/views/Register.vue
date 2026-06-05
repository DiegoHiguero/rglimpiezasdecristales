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

        <!-- Sección: Datos de acceso -->
        <p class="rg-section-title">Datos de acceso</p>
        <div class="rg-row">
          <div class="rf">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'envelope']" /></div>
            <div class="rf-body">
              <label>Email</label>
              <input type="email" placeholder="cliente@email.com" v-model.trim="email" />
            </div>
          </div>
        </div>

        <!-- Sección: Datos personales -->
        <p class="rg-section-title">Datos personales</p>
        <div class="rg-row rg-row--3">
          <div class="rf">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'user']" /></div>
            <div class="rf-body">
              <label>Nombre</label>
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
          <div class="rf">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'address-card']" /></div>
            <div class="rf-body">
              <label>Usuario</label>
              <input type="text" placeholder="Nombre de usuario" v-model="nombreUsuario" />
            </div>
          </div>
        </div>

        <!-- Sección: Ubicación -->
        <p class="rg-section-title">Ubicación</p>
        <div class="rg-row">
          <div class="rf">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'location-dot']" /></div>
            <div class="rf-body">
              <label>Dirección</label>
              <input type="text" placeholder="Calle y número" v-model="direccion" />
            </div>
          </div>
          <div class="rf">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'phone']" /></div>
            <div class="rf-body">
              <label>Teléfono</label>
              <input type="tel" placeholder="+34 600 000 000" v-model="telephone" />
            </div>
          </div>
        </div>
        <div class="rg-row rg-row--3">
          <div class="rf">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'house']" /></div>
            <div class="rf-body">
              <label>Ciudad</label>
              <input type="text" placeholder="Ciudad" v-model="ciudad" />
            </div>
          </div>
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
        </div>

        <!-- Sección: Servicio -->
        <p class="rg-section-title">Servicio</p>
        <div class="rg-row">
          <div class="rf">
            <div class="rf-icon"><font-awesome-icon :icon="['fas', 'tag']" /></div>
            <div class="rf-body">
              <label>Precio (€)</label>
              <input type="number" placeholder="0.00" v-model="precio" />
            </div>
          </div>
          <div class="rf-check">
            <label class="rg-check-label">
              <input type="checkbox" v-model="casa" class="rg-checkbox" />
              <span class="rg-check-box">
                <font-awesome-icon :icon="['fas', 'check']" class="rg-check-tick" />
              </span>
              <span>Es un particular</span>
            </label>
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

        <button type="submit" class="rg-submit" :disabled="userStore.loadingUser">
          <span v-if="!userStore.loadingUser">
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
import { useRouter } from 'vue-router';
import { useDatabaseStore } from '../stores/database';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxSdk from '@mapbox/mapbox-sdk/services/geocoding';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();

const email        = ref('');
const password     = ref('');
const nombre       = ref('');
const apellido     = ref('');
const nombreUsuario = ref('');
const direccion    = ref('');
const telephone    = ref('');
const ciudad       = ref('');
const provincia    = ref('');
const codigoPostal = ref('');
const precio       = ref('');
const casa         = ref('');
const creacion     = ref('');
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

const handleSubmit = async () => {
  if (!email.value || password.value.length < 6) {
    userStore.mensajeAlerta('Rellena todos los campos obligatorios');
    return;
  }
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
  databaseStore.addCliente(
    apellido.value, ciudad.value, codigoPostal.value, diasLimpieza.value,
    direccion.value, telephone.value, email.value, nombre.value,
    nombreUsuario.value, precio.value, casa.value, provincia.value,
    fechaCreacion(), coordinatesData,
  );
  router.push('/misClientes');
};
</script>

<style scoped>
.rg-wrap {
  min-height: calc(100vh - 54px);
  padding: 40px 16px 72px;
  background: var(--slate);
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

/* ── Checkbox ── */
.rf-check {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.rg-check-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-muted);
  user-select: none;
}
.rg-check-label input { display: none; }
.rg-check-box {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid var(--border);
  background: var(--slate);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s;
}
.rg-check-tick { color: #fff; font-size: 0.65rem; opacity: 0; transition: opacity 0.15s; }
.rg-check-label input:checked ~ .rg-check-box {
  background: var(--blue);
  border-color: var(--blue);
}
.rg-check-label input:checked ~ .rg-check-box .rg-check-tick { opacity: 1; }

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
