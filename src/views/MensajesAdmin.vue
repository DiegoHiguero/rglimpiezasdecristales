<template>
  <div class="ma-wrap">

    <!-- Cabecera -->
    <div class="ma-header">
      <div>
        <span class="ma-label">Panel Admin</span>
        <h1 class="ma-title">Mensajes de <span class="ma-accent">Contacto</span></h1>
      </div>
      <div class="ma-header-right">
        <div class="ma-unread-chip" :class="unreadMessagesCount > 0 ? 'ma-unread-chip--red' : 'ma-unread-chip--green'">
          <font-awesome-icon :icon="['fas', unreadMessagesCount > 0 ? 'envelope' : 'envelope-open']" class="me-2" />
          {{ unreadMessagesCount }} sin leer
        </div>
        <button v-if="unreadMessagesCount > 0" class="ma-btn ma-btn--ghost" @click="markAllAsRead">
          <font-awesome-icon :icon="['fas', 'check-double']" class="me-2" />Todos leídos
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="ma-filters">
      <div class="ma-search">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="ma-search-icon" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar por nombre, email o teléfono..."
          class="ma-search-input"
        />
        <button v-if="searchQuery" class="ma-search-clear" @click="searchQuery = ''">
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
      </div>
      <div class="ma-tabs">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          class="ma-tab"
          :class="{ 'ma-tab--active': activeFilter === tab.value }"
          @click="activeFilter = tab.value"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="ma-tab-count">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-if="filteredMessages.length === 0" class="ma-empty-card">
      <font-awesome-icon :icon="['fas', 'inbox']" class="ma-empty-icon" />
      <p>{{ messages.length === 0 ? 'No hay mensajes en este momento.' : 'Ningún mensaje coincide con el filtro.' }}</p>
    </div>

    <!-- Grid de mensajes -->
    <div v-else class="ma-grid">
      <div
        v-for="message in filteredMessages"
        :key="message.id"
        class="ma-card"
        :class="{ 'ma-card--read': message.read }"
      >
        <!-- Encabezado tarjeta -->
        <div class="ma-card-header">
          <div class="ma-sender">
            <span class="ma-sender-name">{{ message.prenom }}</span>
            <span v-if="!message.read" class="ma-new-dot">Nuevo</span>
          </div>
          <span class="ma-date">{{ formatDate(message.timestamp) }}</span>
        </div>

        <!-- Cuerpo tarjeta -->
        <div class="ma-card-body">

          <!-- Email con acciones rápidas -->
          <div class="ma-meta-row">
            <div class="ma-meta-item">
              <font-awesome-icon :icon="['fas', 'envelope']" class="ma-meta-icon" />
              <span>{{ message.email }}</span>
            </div>
            <div class="ma-quick-actions">
              <a
                :href="`mailto:${message.email}?subject=Re%3A%20Contacto%20Royal%20Clean&body=Hola%20${encodeURIComponent(message.prenom)}%2C%0A%0A`"
                class="ma-quick-btn ma-quick-btn--blue"
                title="Responder por email"
              >
                <font-awesome-icon :icon="['fas', 'reply']" />
              </a>
              <button
                class="ma-quick-btn"
                :class="copiedId === message.id + '_email' ? 'ma-quick-btn--ok' : ''"
                @click="copyToClipboard(message.email, message.id + '_email')"
                title="Copiar email"
              >
                <font-awesome-icon :icon="['fas', copiedId === message.id + '_email' ? 'check' : 'copy']" />
              </button>
            </div>
          </div>

          <!-- Teléfono con acciones rápidas -->
          <div class="ma-meta-row">
            <div class="ma-meta-item">
              <font-awesome-icon :icon="['fas', 'phone']" class="ma-meta-icon" />
              <span>{{ message.phone }}</span>
            </div>
            <div class="ma-quick-actions">
              <a
                :href="`https://wa.me/${toWhatsAppNumber(message.phone)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="ma-quick-btn ma-quick-btn--wa"
                title="Abrir WhatsApp"
              >
                <font-awesome-icon :icon="['fab', 'whatsapp']" />
              </a>
              <button
                class="ma-quick-btn"
                :class="copiedId === message.id + '_phone' ? 'ma-quick-btn--ok' : ''"
                @click="copyToClipboard(message.phone, message.id + '_phone')"
                title="Copiar teléfono"
              >
                <font-awesome-icon :icon="['fas', copiedId === message.id + '_phone' ? 'check' : 'copy']" />
              </button>
            </div>
          </div>

          <!-- Texto del mensaje con toggle expandir -->
          <div class="ma-message-wrap">
            <p class="ma-message-text" :class="{ 'ma-message-text--expanded': expandedIds.has(message.id) }">
              {{ message.message }}
            </p>
            <button
              v-if="message.message && message.message.length > 160"
              class="ma-expand-btn"
              @click="toggleExpand(message.id)"
            >
              {{ expandedIds.has(message.id) ? 'Ver menos' : 'Ver más' }}
              <font-awesome-icon :icon="['fas', expandedIds.has(message.id) ? 'chevron-up' : 'chevron-down']" class="ms-1" />
            </button>
          </div>

          <!-- Etiquetas de estado -->
          <div class="ma-status-row">
            <button
              v-for="s in statuses"
              :key="s.value"
              class="ma-status-btn"
              :class="[s.cls, { 'ma-status-btn--active': (message.status || 'nuevo') === s.value }]"
              @click="setStatus(message.id, s.value)"
            >{{ s.label }}</button>
          </div>

        </div>

        <!-- Footer tarjeta -->
        <div class="ma-card-footer">
          <button v-if="!message.read" @click="markAsRead(message.id)" class="ma-btn ma-btn--green">
            <font-awesome-icon :icon="['fas', 'check']" class="me-2" />Leído
          </button>
          <button v-else @click="markAsUnread(message.id)" class="ma-btn ma-btn--ghost">
            <font-awesome-icon :icon="['fas', 'rotate-left']" class="me-2" />No leído
          </button>
          <button @click="deleteMessage(message.id)" class="ma-btn ma-btn--red">
            <font-awesome-icon :icon="['fas', 'trash-can']" class="me-2" />Eliminar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { db } from '../firebaseConfig'
import {
  collection, query, orderBy, onSnapshot,
  doc, updateDoc, deleteDoc, writeBatch, Timestamp
} from 'firebase/firestore'

interface Message {
  id: string
  prenom: string
  email: string
  phone: string
  message: string
  timestamp: Timestamp
  read: boolean
  status?: string
}

const messages    = ref<Message[]>([])
const searchQuery = ref('')
const activeFilter = ref('all')
const expandedIds  = ref(new Set<string>())
const copiedId     = ref('')
let unsubscribe: (() => void) | null = null
let prevCount = 0

const statuses = [
  { value: 'nuevo',       label: 'Nuevo',       cls: 'ma-status-btn--blue'   },
  { value: 'contactado',  label: 'Contactado',  cls: 'ma-status-btn--amber'  },
  { value: 'presupuesto', label: 'Presupuesto', cls: 'ma-status-btn--purple' },
  { value: 'cerrado',     label: 'Cerrado',     cls: 'ma-status-btn--teal'   },
]

const unreadMessagesCount = computed(() => messages.value.filter(m => !m.read).length)

const statusTabs = computed(() => [
  { value: 'all',         label: 'Todos',       count: 0 },
  { value: 'nuevo',       label: 'Nuevos',      count: messages.value.filter(m => !m.status || m.status === 'nuevo').length },
  { value: 'contactado',  label: 'Contactados', count: messages.value.filter(m => m.status === 'contactado').length },
  { value: 'presupuesto', label: 'Presupuesto', count: messages.value.filter(m => m.status === 'presupuesto').length },
  { value: 'cerrado',     label: 'Cerrados',    count: messages.value.filter(m => m.status === 'cerrado').length },
])

const filteredMessages = computed(() => {
  let list = [...messages.value].sort((a, b) => {
    if (a.read === b.read) return b.timestamp.toMillis() - a.timestamp.toMillis()
    return a.read ? 1 : -1
  })
  if (activeFilter.value !== 'all') {
    list = list.filter(m => (m.status || 'nuevo') === activeFilter.value)
  }
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(m =>
      m.prenom.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.includes(q)
    )
  }
  return list
})

// Notificación de navegador cuando llega un mensaje nuevo
watch(() => messages.value.length, (newLen) => {
  if (prevCount > 0 && newLen > prevCount && Notification.permission === 'granted') {
    new Notification('Royall Clean — Nuevo mensaje', {
      body: 'Tienes un nuevo mensaje de contacto.',
      icon: '/favicon.ico',
    })
  }
  prevCount = newLen
})

onMounted(() => {
  if (Notification.permission === 'default') Notification.requestPermission()

  const q = query(collection(db, 'mensajes'), orderBy('timestamp', 'desc'))
  unsubscribe = onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<Message, 'id'>),
      read: d.data().read || false,
    }))
  }, console.error)
})

onUnmounted(() => { if (unsubscribe) unsubscribe() })

// Acciones
const markAsRead   = (id: string) => updateDoc(doc(db, 'mensajes', id), { read: true }).catch(console.error)
const markAsUnread = (id: string) => updateDoc(doc(db, 'mensajes', id), { read: false }).catch(console.error)

const markAllAsRead = async () => {
  const batch = writeBatch(db)
  messages.value.filter(m => !m.read).forEach(m =>
    batch.update(doc(db, 'mensajes', m.id), { read: true })
  )
  await batch.commit()
}

const setStatus = (id: string, status: string) =>
  updateDoc(doc(db, 'mensajes', id), { status }).catch(console.error)

const deleteMessage = async (id: string) => {
  if (!confirm('¿Seguro que quieres eliminar este mensaje?')) return
  deleteDoc(doc(db, 'mensajes', id)).catch(console.error)
}

const toggleExpand = (id: string) => {
  const s = new Set(expandedIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  expandedIds.value = s
}

const copyToClipboard = async (text: string, key: string) => {
  await navigator.clipboard.writeText(text)
  copiedId.value = key
  setTimeout(() => { copiedId.value = '' }, 1500)
}

const toWhatsAppNumber = (phone: string) => {
  const d = phone.replace(/\D/g, '')
  if (d.startsWith('34')) return d
  if (d.length === 9) return '34' + d
  return d
}

const formatDate = (timestamp: Timestamp) => {
  if (!timestamp) return 'N/A'
  return timestamp.toDate().toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
}
</script>

<style scoped>
.ma-wrap {
  min-height: calc(100vh - 54px);
  background: #151515;
  padding: 36px 20px 60px;
  max-width: 1100px;
  margin: 0 auto;
}

/* ── Header ── */
.ma-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 14px;
}
.ma-header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.ma-label {
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
.ma-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: #fff; margin: 0; }
.ma-accent { color: #60a5fa; }

.ma-unread-chip {
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  border-radius: 20px;
  padding: 7px 14px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}
.ma-unread-chip--red   { background: rgba(239,68,68,0.12);  border: 1px solid rgba(239,68,68,0.25);  color: #f87171; }
.ma-unread-chip--green { background: rgba(34,197,94,0.1);   border: 1px solid rgba(34,197,94,0.2);   color: #4ade80; }

/* ── Filters ── */
.ma-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.ma-search {
  position: relative;
  display: flex;
  align-items: center;
}
.ma-search-icon {
  position: absolute;
  left: 14px;
  color: #475569;
  font-size: 0.82rem;
  pointer-events: none;
}
.ma-search-input {
  width: 100%;
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: #f1f5f9;
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  padding: 10px 38px 10px 38px;
  outline: none;
  transition: border-color 0.2s;
}
.ma-search-input:focus { border-color: rgba(96,165,250,0.4); }
.ma-search-input::placeholder { color: #334155; }
.ma-search-clear {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #475569;
  cursor: pointer;
  padding: 4px;
  font-size: 0.78rem;
  transition: color 0.15s;
}
.ma-search-clear:hover { color: #94a3b8; }

.ma-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.ma-tab {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.ma-tab:hover { background: rgba(255,255,255,0.08); color: #94a3b8; }
.ma-tab--active { background: rgba(96,165,250,0.15); border-color: rgba(96,165,250,0.3); color: #60a5fa; }
.ma-tab-count {
  font-size: 0.68rem;
  font-weight: 700;
  background: rgba(96,165,250,0.2);
  color: #60a5fa;
  border-radius: 10px;
  padding: 1px 6px;
}

/* ── Empty ── */
.ma-empty-card {
  background: #0f1729;
  border: 1px dashed rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 60px 20px;
  text-align: center;
  color: #475569;
  font-family: 'Raleway', sans-serif;
}
.ma-empty-icon { font-size: 2.5rem; margin-bottom: 14px; opacity: 0.25; display: block; }

/* ── Grid ── */
.ma-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

/* ── Card ── */
.ma-card {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-left: 3px solid #2563eb;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}
.ma-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
.ma-card--read { border-left-color: rgba(255,255,255,0.07); opacity: 0.65; }
.ma-card--read:hover { opacity: 1; }

.ma-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  gap: 10px;
}
.ma-sender { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ma-sender-name { font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.95rem; color: #f1f5f9; }
.ma-new-dot {
  font-family: 'Raleway', sans-serif;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(37,99,235,0.2);
  color: #60a5fa;
  border: 1px solid rgba(37,99,235,0.3);
  border-radius: 10px;
  padding: 2px 7px;
}
.ma-date { font-family: 'Raleway', sans-serif; font-size: 0.72rem; color: #475569; white-space: nowrap; flex-shrink: 0; }

.ma-card-body { padding: 14px 18px; flex: 1; display: flex; flex-direction: column; gap: 10px; }

/* ── Meta rows ── */
.ma-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.ma-meta-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.81rem;
  color: #64748b;
  min-width: 0;
  word-break: break-all;
}
.ma-meta-icon { color: #334155; font-size: 0.72rem; flex-shrink: 0; }

.ma-quick-actions { display: flex; gap: 5px; flex-shrink: 0; }
.ma-quick-btn {
  width: 28px; height: 28px;
  border-radius: 7px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  text-decoration: none;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.ma-quick-btn:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }
.ma-quick-btn--blue  { background: rgba(37,99,235,0.15);  border-color: rgba(37,99,235,0.25);  color: #60a5fa; }
.ma-quick-btn--wa    { background: rgba(37,211,102,0.12); border-color: rgba(37,211,102,0.25); color: #25d366; }
.ma-quick-btn--ok    { background: rgba(34,197,94,0.15);  border-color: rgba(34,197,94,0.25);  color: #4ade80; }

/* ── Message text ── */
.ma-message-wrap { display: flex; flex-direction: column; gap: 5px; }
.ma-message-text {
  font-family: 'Raleway', sans-serif;
  font-size: 0.86rem;
  color: #94a3b8;
  line-height: 1.65;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ma-message-text--expanded {
  display: block;
  -webkit-line-clamp: unset;
  overflow: visible;
}
.ma-expand-btn {
  background: none;
  border: none;
  color: #60a5fa;
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.15s;
}
.ma-expand-btn:hover { opacity: 0.75; }

/* ── Status buttons ── */
.ma-status-row { display: flex; gap: 5px; flex-wrap: wrap; padding-top: 4px; }
.ma-status-btn {
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid transparent;
  cursor: pointer;
  background: rgba(255,255,255,0.04);
  color: #475569;
  transition: background 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s;
  opacity: 0.5;
}
.ma-status-btn:hover { opacity: 0.85; }
.ma-status-btn--active { opacity: 1 !important; }

.ma-status-btn--blue.ma-status-btn--active   { background: rgba(37,99,235,0.2);   border-color: rgba(37,99,235,0.35);   color: #60a5fa; }
.ma-status-btn--amber.ma-status-btn--active  { background: rgba(245,158,11,0.2);  border-color: rgba(245,158,11,0.35);  color: #fbbf24; }
.ma-status-btn--purple.ma-status-btn--active { background: rgba(139,92,246,0.2);  border-color: rgba(139,92,246,0.35);  color: #a78bfa; }
.ma-status-btn--teal.ma-status-btn--active   { background: rgba(20,184,166,0.2);  border-color: rgba(20,184,166,0.35);  color: #2dd4bf; }

/* ── Footer ── */
.ma-card-footer {
  padding: 10px 18px;
  border-top: 1px solid rgba(255,255,255,0.05);
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

/* ── Buttons ── */
.ma-btn {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 7px 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.15s, transform 0.15s;
  white-space: nowrap;
}
.ma-btn:hover { opacity: 0.8; transform: translateY(-1px); }
.ma-btn--green { background: rgba(34,197,94,0.12);  border-color: rgba(34,197,94,0.25);  color: #4ade80; }
.ma-btn--ghost { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #94a3b8; }
.ma-btn--red   { background: rgba(239,68,68,0.12);  border-color: rgba(239,68,68,0.25);  color: #f87171; }

/* ── Responsive ── */
@media (max-width: 640px) {
  .ma-wrap { padding: 24px 12px 48px; }
  .ma-title { font-size: 1.6rem; }
  .ma-grid { grid-template-columns: 1fr; }
  .ma-card-footer { justify-content: stretch; }
  .ma-btn { flex: 1; justify-content: center; }
}
</style>
