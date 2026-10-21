<template>
  <div class="pc-wrap">

    <!-- Cargando -->
    <div v-if="loading" class="pc-state">
      <div class="pc-spinner"></div>
      <p>Cargando tu información...</p>
    </div>

    <!-- Sin token: pantalla de acceso -->
    <div v-else-if="!token" class="pc-card pc-login">
      <img src="../assets/img/ROYAL_CLEAN_2025_BLANCO.png" class="pc-logo" alt="Royall Clean" />
      <h1 class="pc-title">Portal de clientes</h1>
      <p class="pc-sub">Consulta tus facturas y firmas de servicio.</p>

      <button class="pc-google-btn" @click="handleGoogleSignIn" :disabled="signingIn">
        <svg class="pc-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {{ signingIn ? 'Conectando...' : 'Iniciar sesión con Google' }}
      </button>

      <p class="pc-hint">¿Tu empresa te mandó un enlace directo? Ábrelo desde el email o WhatsApp que recibiste.</p>

      <p v-if="loginError" class="pc-error">{{ loginError }}</p>
    </div>

    <!-- Token no encontrado -->
    <div v-else-if="!portalData" class="pc-card pc-login">
      <img src="../assets/img/ROYAL_CLEAN_2025_BLANCO.png" class="pc-logo" alt="Royall Clean" />
      <p class="pc-error">No hemos encontrado tu información. Comprueba el enlace o contacta con nosotros.</p>
    </div>

    <!-- Datos del cliente -->
    <div v-else class="pc-content">
      <div class="pc-header">
        <img src="../assets/img/ROYAL_CLEAN_2025_BLANCO.png" class="pc-logo pc-logo--sm" alt="Royall Clean" />
        <div>
          <span class="pc-label">Portal de clientes</span>
          <h1 class="pc-title">{{ portalData.clienteNombre }}</h1>
        </div>
      </div>

      <div v-if="portalData.facturas.length === 0" class="pc-empty">
        Todavía no hay facturas registradas.
      </div>

      <div v-else class="pc-facturas">
        <div v-for="f in portalData.facturas" :key="f.id" class="pc-factura-card">
          <div class="pc-factura-head">
            <div>
              <span class="pc-factura-num">Factura {{ f.id }}</span>
              <span class="pc-factura-date">{{ formatDate(f.fecha) }}</span>
            </div>
            <span class="pc-badge" :class="f.estado === 'Pagada' ? 'pc-badge--paid' : 'pc-badge--pending'">{{ f.estado || 'Pendiente' }}</span>
          </div>
          <p class="pc-factura-concepto">{{ f.concepto || 'Limpieza de cristales' }}</p>
          <div class="pc-factura-foot">
            <span class="pc-factura-total">{{ formatCurrency(f.total) }}</span>
            <button class="pc-btn" @click="descargarPdf(f)">
              <font-awesome-icon :icon="['fas', 'file-pdf']" class="me-2" />Descargar factura
            </button>
          </div>

          <div v-if="f.firmas && f.firmas.length" class="pc-firmas">
            <span class="pc-firmas-label">Firmas ({{ f.firmas.length }})</span>
            <div class="pc-firmas-list">
              <img v-for="(firma, i) in f.firmas" :key="i" :src="firma.url" class="pc-firma-thumb" alt="Firma" />
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getPortalData, findTokenByEmail } from '../services/portal';
import { buildInvoicePdfFromPortal, formatCurrency } from '../utils/invoicePdf';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();

const token = ref(route.params.token || null);
const portalData = ref(null);
const loading = ref(false);
const signingIn = ref(false);
const loginError = ref('');

const formatDate = (iso) => {
  if (!iso) return '';
  const d = dayjs(iso);
  return d.isValid() ? d.format('DD/MM/YYYY') : iso;
};

const loadPortalData = async (t) => {
  loading.value = true;
  try {
    portalData.value = await getPortalData(t);
  } catch (error) {
    console.error('Error al cargar el portal del cliente:', error);
    portalData.value = null;
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  signingIn.value = true;
  loginError.value = '';
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const email = result.user?.email;
    const foundToken = await findTokenByEmail(email);
    if (!foundToken) {
      loginError.value = `No encontramos ninguna cuenta con el email ${email}. Contacta con nosotros para vincularla.`;
      return;
    }
    token.value = foundToken;
    router.replace(`/portal/${foundToken}`);
    await loadPortalData(foundToken);
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    loginError.value = 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.';
  } finally {
    signingIn.value = false;
  }
};

const descargarPdf = (factura) => {
  const doc = buildInvoicePdfFromPortal({
    factura: factura.id,
    fecha: formatDate(factura.fecha),
    clientName: portalData.value.clienteNombre,
    clientAddress: portalData.value.clienteDireccion,
    concepto: factura.concepto,
    total: factura.total,
  });
  doc.save(`Factura ${factura.id}.pdf`);
};

onMounted(() => {
  if (token.value) loadPortalData(token.value);
});
</script>

<style scoped>
.pc-wrap {
  min-height: 100vh;
  background: #080d1a;
  padding: 32px 16px 60px;
}

.pc-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 14px;
  color: #64748b;
  font-family: 'Raleway', sans-serif;
}
.pc-spinner {
  width: 32px; height: 32px;
  border: 3px solid rgba(96,165,250,0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: pc-spin 0.8s linear infinite;
}
@keyframes pc-spin { to { transform: rotate(360deg); } }

.pc-card {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  padding: 36px 28px;
  max-width: 420px;
  margin: 60px auto 0;
  text-align: center;
}
.pc-logo { height: 42px; width: auto; margin-bottom: 18px; }
.pc-logo--sm { height: 36px; margin-bottom: 0; }
.pc-title {
  font-family: 'Anton', sans-serif;
  font-size: 1.7rem;
  color: #f1f5f9;
  margin: 0 0 6px;
}
.pc-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #64748b;
  margin: 0 0 24px;
}
.pc-hint {
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem;
  color: #475569;
  margin: 18px 0 0;
}
.pc-error {
  font-family: 'Raleway', sans-serif;
  font-size: 0.85rem;
  color: #f87171;
  margin-top: 14px;
}

.pc-google-btn {
  width: 100%;
  padding: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  color: #cbd5e1;
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  font-size: 0.88rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.2s, border-color 0.2s;
}
.pc-google-btn:hover:not(:disabled) { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); }
.pc-google-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.pc-google-icon { width: 18px; height: 18px; flex-shrink: 0; }

.pc-content { max-width: 720px; margin: 0 auto; }
.pc-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
.pc-label {
  display: block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #60a5fa;
  margin-bottom: 4px;
}
.pc-header .pc-title { text-align: left; }

.pc-empty {
  font-family: 'Raleway', sans-serif;
  color: #64748b;
  text-align: center;
  padding: 40px 0;
}

.pc-facturas { display: flex; flex-direction: column; gap: 14px; }
.pc-factura-card {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 18px 20px;
}
.pc-factura-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.pc-factura-num {
  display: block;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: #f1f5f9;
}
.pc-factura-date { font-family: 'Raleway', sans-serif; font-size: 0.75rem; color: #64748b; }
.pc-factura-concepto { font-family: 'Raleway', sans-serif; font-size: 0.85rem; color: #94a3b8; margin: 6px 0 14px; }

.pc-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 12px;
  white-space: nowrap;
  flex-shrink: 0;
}
.pc-badge--paid    { background: rgba(34,197,94,0.12); color: #4ade80; }
.pc-badge--pending { background: rgba(239,68,68,0.12);  color: #f87171; }

.pc-factura-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.pc-factura-total { font-family: 'Anton', sans-serif; font-size: 1.15rem; color: #f1f5f9; }
.pc-btn {
  display: inline-flex;
  align-items: center;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.82rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.pc-btn:hover { opacity: 0.88; }

.pc-firmas { margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06); }
.pc-firmas-label {
  display: block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 8px;
}
.pc-firmas-list { display: flex; flex-wrap: wrap; gap: 8px; }
.pc-firma-thumb { height: 56px; border-radius: 6px; background: #fff; border: 1px solid rgba(255,255,255,0.1); }

@media (max-width: 480px) {
  .pc-card { padding: 28px 20px; margin-top: 30px; }
}
</style>
