<template>
  <!-- Mobile toggle -->
  <button class="as-toggle" @click="mobileOpen = !mobileOpen" :class="{ open: mobileOpen }">
    <font-awesome-icon :icon="['fas', mobileOpen ? 'xmark' : 'bars']" />
  </button>

  <!-- Overlay móvil -->
  <div v-if="mobileOpen" class="as-overlay" @click="mobileOpen = false"></div>

  <aside class="as-sidebar" :class="{ 'as-open': mobileOpen }">

    <!-- Marca -->
    <div class="as-brand">
      <router-link to="/dashboard" class="as-brand-link" @click="mobileOpen = false">
        <img src="../assets/img/ROYAL_CLEAN_2025_BLANCO.png" alt="Royall Clean" class="as-logo" />
      </router-link>
    </div>

    <!-- Administración -->
    <div class="as-section-label">Administración</div>
    <nav class="as-nav">
      <router-link to="/dashboard" class="as-link" :class="{ 'as-active': route.path === '/dashboard' }" @click="mobileOpen = false">
        <span class="as-icon"><font-awesome-icon :icon="['fas', 'compass']" /></span>
        Panel principal
      </router-link>
      <router-link to="/Register" class="as-link" :class="{ 'as-active': route.path === '/Register' }" @click="mobileOpen = false">
        <span class="as-icon"><font-awesome-icon :icon="['fas', 'user']" /></span>
        Nuevo cliente
      </router-link>
      <router-link to="/misFacturas" class="as-link" :class="{ 'as-active': route.path === '/misFacturas' }" @click="mobileOpen = false">
        <span class="as-icon"><font-awesome-icon :icon="['fas', 'file-invoice']" /></span>
        Facturas
      </router-link>
    </nav>

    <!-- Google Sheets (dinámico) -->
    <div class="as-divider"></div>
    <div class="as-section-label as-section-label--sheets">
      Google Sheets
      <button class="as-refresh-btn" @click="reloadTabs" :disabled="sheetsStore.loading" title="Recargar pestañas">
        <font-awesome-icon :icon="['fas', 'arrows-rotate']" :class="{ 'as-spin': sheetsStore.loading }" />
      </button>
    </div>

    <!-- Cargando tabs -->
    <div v-if="sheetsStore.loading && !sheetsStore.tabs.length" class="as-tabs-loading">
      <div class="as-dot-spin"></div>
      <span>Cargando hojas...</span>
    </div>

    <nav v-else class="as-nav">
      <router-link
        v-for="tab in sheetsStore.tabs"
        :key="tab"
        :to="tabPath(tab)"
        class="as-link"
        :class="{ 'as-active': isTabActive(tab) }"
        @click="mobileOpen = false"
      >
        <span class="as-icon"><font-awesome-icon :icon="['fas', tabIcon(tab)]" /></span>
        {{ tab }}
      </router-link>
    </nav>

    <!-- Mensajes (Firestore, no Sheets) -->
    <div class="as-divider"></div>
    <div class="as-section-label">Sitio web</div>
    <nav class="as-nav">
      <router-link to="/admin/generar" class="as-link" :class="{ 'as-active': route.path === '/admin/generar' }" @click="mobileOpen = false">
        <span class="as-icon"><font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" /></span>
        Generar artículo
      </router-link>
      <router-link to="/admin/mensajes" class="as-link" :class="{ 'as-active': route.path === '/admin/mensajes' }" @click="mobileOpen = false">
        <span class="as-icon"><font-awesome-icon :icon="['fas', 'envelope-open-text']" /></span>
        Mensajes
        <span v-if="userStore.unreadMessagesCount > 0" class="as-badge">{{ userStore.unreadMessagesCount }}</span>
      </router-link>
      <router-link to="/" class="as-link as-link--muted" @click="mobileOpen = false">
        <span class="as-icon"><font-awesome-icon :icon="['fas', 'house']" /></span>
        Ver sitio web
      </router-link>
    </nav>

    <!-- Usuario y logout -->
    <div class="as-footer">
      <div class="as-user">
        <div class="as-user-avatar">{{ userInitial }}</div>
        <div class="as-user-info">
          <span class="as-user-name">{{ userName }}</span>
          <span class="as-user-role">Administrador</span>
        </div>
      </div>
      <button class="as-logout" @click="userStore.logOutUser" title="Cerrar sesión">
        <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
      </button>
    </div>

  </aside>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useSheetsStore } from '../stores/sheetsStore';

const route       = useRoute();
const userStore   = useUserStore();
const sheetsStore = useSheetsStore();
const mobileOpen  = ref(false);

// Carga las pestañas cuando el usuario tiene token (y solo una vez)
watch(
  () => userStore.googleAccessToken,
  token => { if (token && !sheetsStore.tabs.length && !sheetsStore.loading) sheetsStore.loadTabs() },
  { immediate: true }
);

// Tabs conocidos → rutas específicas ya existentes
const KNOWN_ROUTES = {
  'Limpiezas': '/registro',
  'Clientes':  '/misClientes',
  'Gastos':    '/gastos',
};

// Iconos por tab conocido, genérico para el resto
const KNOWN_ICONS = {
  'Limpiezas':        'rectangle-list',
  'Clientes':         'address-card',
  'Gastos':           'hand-holding-dollar',
  'Servicios':        'broom',
  'Configuracion':    'circle-info',
  'Configuración':    'circle-info',
  'Resumen':          'calendar-days',
  'Resumen Mensual':  'calendar-days',
};

function tabPath(tab) {
  return KNOWN_ROUTES[tab] || `/sheet/${encodeURIComponent(tab)}`;
}

function tabIcon(tab) {
  return KNOWN_ICONS[tab] || 'table-cells';
}

function isTabActive(tab) {
  const path = tabPath(tab);
  if (route.path === path) return true;
  if (route.params?.tab === tab || route.params?.tab === encodeURIComponent(tab)) return true;
  return false;
}

async function reloadTabs() {
  await sheetsStore.reloadTabs();
}

const userName = computed(() => {
  const email = userStore.userData?.email || '';
  if (email.includes('roys')) return 'Roys';
  if (email.includes('diego') || email.includes('higuero')) return 'Diego';
  return 'Admin';
});

const userInitial = computed(() => userName.value.charAt(0).toUpperCase());
</script>

<style scoped>
/* ── Sidebar ── */
.as-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 232px;
  background: #0a0f1e;
  border-right: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  z-index: 150;
  overflow-y: auto;
  padding-bottom: 16px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
}

/* ── Brand ── */
.as-brand {
  padding: 20px 18px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 6px;
}
.as-brand-link { display: block; }
.as-logo { height: 36px; width: auto; }

/* ── Section label ── */
.as-section-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #334155;
  padding: 8px 18px 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.as-refresh-btn {
  background: none;
  border: none;
  color: #334155;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.7rem;
  transition: color 0.15s;
}
.as-refresh-btn:hover:not(:disabled) { color: #60a5fa; }
.as-refresh-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Loading state for tabs ── */
.as-tabs-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  color: #334155;
}
.as-dot-spin {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(96,165,250,0.2);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: as-spin 0.8s linear infinite;
  flex-shrink: 0;
}
.as-spin { animation: as-spin 0.7s linear infinite; }
@keyframes as-spin { to { transform: rotate(360deg); } }

/* ── Nav ── */
.as-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 10px;
}

.as-link {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  color: #64748b;
  text-decoration: none;
  padding: 9px 10px;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
  position: relative;
}
.as-link:hover { background: rgba(255,255,255,0.05); color: #94a3b8; }
.as-link.as-active { background: rgba(96,165,250,0.12); color: #60a5fa; }
.as-link.as-active .as-icon { color: #60a5fa; }
.as-link--muted { color: #475569; }
.as-link--muted:hover { color: #64748b; }

.as-icon {
  width: 18px;
  text-align: center;
  font-size: 0.85rem;
  color: #475569;
  flex-shrink: 0;
  transition: color 0.15s;
}
.as-link:hover .as-icon { color: #64748b; }

.as-badge {
  margin-left: auto;
  background: #ef4444;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

/* ── Divider ── */
.as-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 10px 18px;
}

/* ── Footer ── */
.as-footer {
  margin-top: auto;
  padding: 12px 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  gap: 10px;
}
.as-user { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.as-user-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: rgba(96,165,250,0.15);
  border: 1px solid rgba(96,165,250,0.25);
  color: #60a5fa;
  font-family: 'Anton', sans-serif;
  font-size: 0.95rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.as-user-info { display: flex; flex-direction: column; min-width: 0; }
.as-user-name {
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.as-user-role { font-family: 'Raleway', sans-serif; font-size: 0.68rem; color: #475569; }
.as-logout {
  background: none;
  border: none;
  color: #475569;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: color 0.2s, background 0.2s;
  flex-shrink: 0;
}
.as-logout:hover { color: #f87171; background: rgba(248,113,113,0.1); }

/* ── Mobile toggle ── */
.as-toggle {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 201;
  width: 44px; height: 44px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 20px rgba(37,99,235,0.5);
  transition: background 0.2s, transform 0.2s;
}
.as-toggle:hover { background: #1d4ed8; transform: scale(1.05); }
.as-toggle.open { background: #475569; }
.as-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 149;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .as-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .as-sidebar.as-open { transform: translateX(0); }
  .as-toggle { display: flex; align-items: center; justify-content: center; }
  .as-overlay { display: block; }
}
</style>
