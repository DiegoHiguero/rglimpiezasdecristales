<template>
  <div class="mensajes-admin-container">
    <h2 >Gestión de Mensajes de Contacto</h2>

    <div class="unread-badge-container">
      Mensajes no leídos:
      <span class="badge" :class="{ 'bg-success': unreadMessagesCount === 0, 'bg-danger': unreadMessagesCount > 0 }">
        {{ unreadMessagesCount }}
      </span>
    </div>

    <div v-if="messages.length === 0" class="no-messages">
      <p>No hay mensajes en este momento.</p>
    </div>

    <div v-else class="message-list">
      <div v-for="message in sortedMessages" :key="message.id" class="message-card" :class="{ 'message-read': message.read }">
        <div class="message-header">
          <h3>De: {{ message.prenom }} <span v-if="!message.read" class="unread-indicator">(No leído)</span></h3>
          <small>{{ formatDate(message.timestamp) }}</small>
        </div>
        <p class="message-email"><strong>Email:</strong> {{ message.email }}</p>
        <p class="message-phone"><strong>Teléfono:</strong> {{ message.phone }}</p>
        <div class="message-content-wrapper">
          <p class="message-content">{{ message.message }}</p>
        </div>
        <div class="message-actions">
          <button v-if="!message.read" @click="markAsRead(message.id)" class="btn btn-primary btn-sm">Marcar como Leído</button>
          <button v-else @click="markAsUnread(message.id)" class="btn btn-secondary btn-sm">Marcar como No Leído</button>
          <!-- Botón de Eliminar -->
          <button @click="deleteMessage(message.id)" class="btn btn-danger btn-sm">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { db, auth } from '../firebaseConfig'; 
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

interface Message {
  id: string;
  prenom: string;
  email: string;
  phone: string;
  message: string;
  timestamp: Timestamp;
  read: boolean;
}

const messages = ref<Message[]>([]);
let unsubscribe: (() => void) | null = null;

const unreadMessagesCount = computed(() => {
  return messages.value.filter(msg => !msg.read).length;
});

const sortedMessages = computed(() => {
  return [...messages.value].sort((a, b) => {
    // Los mensajes no leídos van primero
    if (a.read === b.read) {
      // Si ambos tienen el mismo estado, ordenar por fecha descendente
      return b.timestamp.toMillis() - a.timestamp.toMillis();
    }
    return a.read ? 1 : -1; // Mensajes no leídos (read: false) vienen antes que leídos (read: true)
  });
});

onMounted(() => {
  const q = query(collection(db, "mensajes"), orderBy("timestamp", "desc"));

  unsubscribe = onSnapshot(q, (snapshot) => {
    const fetchedMessages: Message[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      fetchedMessages.push({
        id: doc.id,
        prenom: data.prenom,
        email: data.email,
        phone: data.phone,
        message: data.message,
        timestamp: data.timestamp as Timestamp,
        read: data.read || false,
      });
    });
    messages.value = fetchedMessages;
  }, (error) => {
    console.error("Error al obtener mensajes de Firestore:", error);
  });
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

const markAsRead = async (id: string) => {
  try {
    const messageRef = doc(db, "mensajes", id);
    await updateDoc(messageRef, {
      read: true
    });
  } catch (error) {
    console.error("Error al marcar mensaje como leído:", error);
    alert("Hubo un error al marcar el mensaje como leído.");
  }
};

const markAsUnread = async (id: string) => {
  try {
    const messageRef = doc(db, "mensajes", id);
    await updateDoc(messageRef, {
      read: false
    });
  } catch (error) {
    console.error("Error al marcar mensaje como no leído:", error);
    alert("Hubo un error al marcar el mensaje como no leído.");
  }
};

const deleteMessage = async (id: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este mensaje? Esta acción no se puede deshacer.')) {
    try {
      await deleteDoc(doc(db, "mensajes", id));
      console.log(`Mensaje ${id} eliminado con éxito.`);
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
      alert("Hubo un error al eliminar el mensaje.");
    }
  }
};

const formatDate = (timestamp: Timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate();
  return date.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
};
</script>

<style scoped>
/* Contenedor principal de la vista de administración de mensajes */
.mensajes-admin-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #fcfcfc; /* Fondo ligeramente fuera de blanco */
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  font-family: 'Baloo 2', sans-serif;
  color: #333;
}

.mensajes-admin-container h2 {
  text-align: center;
  color: #4970B6; /* Azul principal */
  margin-bottom: 1.5rem;
  font-weight: 700;
}

/* Contenedor del badge de mensajes no leídos */
.unread-badge-container {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #555;
}

.unread-badge-container .badge {
  font-size: 1rem;
  padding: 0.4em 0.7em;
  border-radius: 0.5rem;
  margin-left: 0.5rem;
  vertical-align: middle;
}

/* Estilos para cuando no hay mensajes */
.no-messages {
  text-align: center;
  padding: 3rem;
  border: 1px dashed #ced4da;
  border-radius: 0.75rem;
  margin-top: 2rem;
  background-color: #f0f0f0;
  color: #6c757d;
  font-style: italic;
}

/* Lista de mensajes */
.message-list {
  display: grid;
  gap: 1.5rem; /* Espacio entre las tarjetas */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Responsive grid */
}

/* Estilo base para cada tarjeta de mensaje */
.message-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.message-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* Estilo específico para mensajes leídos */
.message-read {
  background-color: #f8f9fa; /* Fondo ligeramente gris para mensajes leídos */
  border-left: 5px solid #cccccc; /* Borde sutil para indicar leído */
  opacity: 0.85; /* Un poco menos prominente */
}

/* Encabezado del mensaje */
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #eeeeee;
  background-color: #f4f4f4; /* Fondo para el encabezado */
}

.message-read .message-header {
  background-color: #e9ecef; /* Un gris aún más claro para el encabezado leído */
}

.message-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4970B6; /* Azul principal para el nombre del remitente */
  margin: 0;
}

.message-read .message-header h3 {
  color: #495057; /* Un color más tenue para el nombre del remitente en mensajes leídos */
}

.message-header small {
  color: #6c757d;
  font-size: 0.85rem;
  flex-shrink: 0; /* Previene que la fecha se comprima */
  margin-left: 1rem;
}

.unread-indicator {
  color: #dc3545; /* Rojo de Bootstrap para el indicador de no leído */
  font-weight: bold;
  font-size: 0.9em;
  margin-left: 0.5rem;
}

/* Detalles del mensaje (email, teléfono) */
.message-card p {
  padding: 0.5rem 1.25rem 0; /* Ajusta el padding para la información */
  margin-bottom: 0.25rem; /* Pequeño margen entre párrafos */
  font-size: 0.95rem;
  color: #495057;
}

.message-card p strong {
  color: #343a40;
}

.message-email, .message-phone {
  word-break: break-all; /* Para prevenir overflow de emails/teléfonos largos */
}

/* Contenido del mensaje */
.message-content-wrapper {
  padding: 0.5rem 1.25rem 1rem;
  flex-grow: 1; /* Permite que el contenido ocupe el espacio disponible */
}

.message-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #495057;
  max-height: 100px; /* Limita la altura del mensaje para no desbordar */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4; /* Muestra hasta 4 líneas */
  -webkit-box-orient: vertical;
  margin-bottom: 0 !important; /* Elimina margen inferior extra */
}

/* Acciones del mensaje (botones) */
.message-actions {
  padding: 1rem 1.25rem;
  border-top: 1px solid #eeeeee;
  background-color: #f9f9f9;
  display: flex;
  justify-content: flex-end; /* Alinea los botones a la derecha */
  gap: 0.75rem; /* Espacio entre los botones */
  flex-wrap: wrap; /* Permite que los botones se envuelvan en pantallas pequeñas */
}

.message-read .message-actions {
  background-color: #e9ecef; /* Fondo de acciones para mensajes leídos */
}

.message-actions .btn {
  font-family: 'Baloo 2', sans-serif;
  font-weight: 600;
  border-radius: 0.3rem; /* Bordes suaves para los botones */
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
  white-space: nowrap; /* Evita que el texto del botón se rompa */
}

/* Colores de los botones para que coincidan con la marca si es posible */
.message-actions .btn-primary {
  background-color: #1A5F28;
  border-color: #1A5F28;
  color: white;
}

.message-actions .btn-primary:hover {
  background-color: #12421c;
  border-color: #12421c;
}

.message-actions .btn-secondary {
  background-color: #6c757d; /* Gris de Bootstrap para "Marcar como No Leído" */
  border-color: #6c757d;
  color: white;
}

.message-actions .btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}

.message-actions .btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.message-actions .btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

/* Media Queries para responsividad */
@media (max-width: 768px) {
  .mensajes-admin-container {
    padding: 1rem;
    margin: 1rem auto;
  }
  .message-list {
    grid-template-columns: 1fr; /* Una columna en pantallas pequeñas */
  }
  .message-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.75rem 1rem;
  }
  .message-header small {
    margin-left: 0;
    margin-top: 0.25rem;
  }
  .message-card p {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .message-content-wrapper {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .message-actions {
    justify-content: center; /* Centra los botones en pantallas pequeñas */
    padding: 0.75rem 1rem;
  }
  .message-actions .btn {
    width: 100%; /* Botones de ancho completo */
    margin-bottom: 0.5rem;
  }
  .message-actions .btn:last-child {
    margin-bottom: 0;
  }
}

@media (max-width: 480px) {
  .mensajes-admin-container h2 {
    font-size: 1.75rem;
  }
  .message-header h3 {
    font-size: 1.1rem;
  }
  .message-header small {
    font-size: 0.8rem;
  }
  .message-card p {
    font-size: 0.9rem;
  }
  .message-content {
    font-size: 0.95rem;
  }
}
</style>
