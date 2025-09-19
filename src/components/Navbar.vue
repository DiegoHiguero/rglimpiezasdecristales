<template>
  <nav class="navbar navbar-expand-lg py-0 container-fluid" id="scrollspyHeading1">
    <router-link class="navbar-brand text-center ps-4 " to="/"> <!-- Corregido: navbar-brand en lugar de navbar-expand -->
      <img
        class="logo zoom d-inline "
        src="../assets/img/logoweb.png"
        alt="RG Limpieza de cristales logo"
      />
    </router-link>
    <button
      class="navbar-toggler text-end "
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNavAltMarkup"
      aria-controls="navbarNavAltMarkup"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon mx-4"></span>
    </button>
    <div class=" menu collapse navbar-collapse bg-body-tertiary p-2 rounded-bottom-4 " id="navbarNavAltMarkup">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center"> <!-- Añadido align-items-center para centrado vertical -->
            <li class="nav-item">
              <router-link
                to="/registro"
                v-if="userStore.userData && userStore.userData.email === 'higuerodiego@gmail.com' || userStore.userData.email === 'roys.abreu@gmail.com'"
                class="nav-link navbar-custom-btn"
                ><font-awesome-icon
                  :icon="['fas', 'address-card']"
                  class="me-2"
                />Registro</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                to="/misClientes"
                v-if="userStore.userData && userStore.userData.email === 'higuerodiego@gmail.com' || userStore.userData.email === 'roys.abreu@gmail.com'"
                class="nav-link navbar-custom-btn" 
                ><font-awesome-icon
                  :icon="['fas', 'rectangle-list']"
                  class="me-2"
                />Mis Clientes</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                to="/admin/mensajes"
                v-if="userStore.userData && userStore.userData.email"
                class="nav-link navbar-custom-btn position-relative" 
              >
                <font-awesome-icon
                  :icon="['fas', 'file-invoice']"
                  class="me-2"
                />Mensajes
                <span v-if="userStore.unreadMessagesCount > 0" class="badge bg-danger rounded-pill unread-badge">
                  {{ userStore.unreadMessagesCount }}
                  <span class="visually-hidden">mensajes no leídos</span>
                </span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/login"
                v-if="!userStore.userData || !userStore.userData.email"
                class="nav-link navbar-custom-btn" 
              >
                <font-awesome-icon
                  :icon="['fas', 'user']"
                  class="me-2 "
                />Conexion
              </router-link>
            </li>
            <li class="nav-item">
              <button
                class="nav-link navbar-custom-btn" 
                v-if="userStore.userData && userStore.userData.email"
                @click="userStore.logOutUser"
              >
                <font-awesome-icon
                  :icon="['fas', 'right-from-bracket']"
                  class="me-2"
                />Cerrar sesión
              </button>
            </li>
          </ul>
          </div>
  </nav>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { onMounted, onUnmounted } from 'vue'; // Importa onMounted y onUnmounted

const userStore = useUserStore();

onMounted(() => {
  // Se asume que userStore.currentUser() ya es llamado globalmente o en App.vue
  // Si userStore.userData está cargado y el usuario es admin, inicia el listener de mensajes no leídos.
  // Tu `useUserStore` debe contener la lógica para determinar si es admin.
  // (Como lo tenías en la primera interacción: userStore.isAdminUser(userStore.userData))
  // Para simplificar aquí, se usa la condición de email, pero ajusta según tu `isAdminUser`
  if (userStore.userData && userStore.userData.email === 'higuerodiego@gmail.com') { // O tu lógica isAdminUser
    userStore.startUnreadMessagesListener(); // Esta función debe estar definida en userStore
  }
});

onUnmounted(() => {
  // Asegúrate de detener el listener cuando el componente se desmonte para evitar fugas de memoria.
  if (userStore.userData && userStore.userData.email === 'higuerodiego@gmail.com') {
    userStore.stopUnreadMessagesListener(); // Esta función también debe estar definida en userStore
  }
});
</script>
<style scoped>
/* Estilos existentes */
.navbar .navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%23007bff' stroke-linecap='round' stroke-miterlimit='10' stroke-width='4' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
 padding-right: 0px;
}
a {
  text-decoration: none;
}
.colorfondo {
  background-color: #4970B6;
}
.navbar-toggler:focus {
  color: #151515;
}
.navbar {
  background-color: #151515;
  top: 0px;
  width: 100%;
  z-index: 2;
  /* Margin ajustado para evitar que el navbar se vea afectado por el margin-left del menu */
  margin: 0;
}
.logo {
  max-width: 10rem;
}
svg {
  vertical-align: bottom;
  height: 1em; /* Ajusta la altura del icono a la altura de la fuente */
}
*,
*::before,
*::after {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
img {
  overflow-clip-margin: content-box;
  overflow: clip;
}

/* --- Estilos para los botones del Navbar --- */

.menu {
  /* Eliminar altura fija, permitir que el contenido la defina */
  /* height: 80px; */
  border-radius: 0px 0px 15px 15px;
  background-color: white;
  margin-right: auto;
  margin: 0px 15px 0px 15px; /* Mantiene el margen lateral */
  display: flex; /* Para centrar verticalmente el ul si es necesario */
  align-items: center; /* Centra el contenido del menú verticalmente */
  width: auto; /* Permite que el menú se ajuste a su contenido */
}

ul.navbar-nav {
  padding: 0; /* Elimina el padding superior que empujaba los elementos */
  /* align-items-center en el HTML se encarga del centrado vertical */
}

.navbar-custom-btn {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  font-size: 1rem; /* Tamaño de fuente más legible */
  color: #6c757d; /* Color gris suave */
  background-color: transparent; /* Fondo transparente por defecto */
  padding: 0.6rem 1rem; /* Padding uniforme para todos los botones */
  margin: 0 0.5rem; /* Espacio horizontal entre los botones */
  border-radius: 0.3rem; /* Bordes ligeramente redondeados */
  transition: all 0.3s ease; /* Animación suave para todas las propiedades */
  display: flex; /* Para alinear ícono y texto */
  align-items: center; /* Centrar ícono y texto verticalmente */
  white-space: nowrap; /* Evitar que el texto del botón se rompa en varias líneas */
  border: none; /* Asegura que no haya borde */
  text-decoration: none; /* Asegura que no haya subrayado en router-link */
}

.navbar-custom-btn:hover {
  color: #343a40; /* Texto gris más oscuro al pasar el ratón */
  background-color: rgba(108, 117, 125, 0.1); /* Fondo gris muy suave al pasar el ratón */
  transform: translateY(-2px); /* Pequeña elevación como animación */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sutil sombra para dar profundidad */
}

/* El `btn` genérico estaba causando problemas, lo hemos reemplazado por `navbar-custom-btn`.
   Si tienes otros botones en la app que necesitan el estilo Bootstrap `.btn`, puedes mantenerlo,
   pero asegúrate de que no afecte a estos. Para estos botones de navegación, la clase `navbar-custom-btn` es la que manda.
*/
.btn {
  /* Estas reglas generales de .btn pueden eliminarse o redefinirse si no se usan en otro lugar.
     Para los botones del navbar, navbar-custom-btn es más específico. */
  border: none;
  font-size: inherit;
  padding: inherit;
  background-color: transparent;
  color: inherit;
}

/* Limpia los estilos antiguos específicos por ID que podrían entrar en conflicto */
#boton-master,
#boton-session,
#boton-accueil,
#boton-contact,
#boton-services {
  /* Reinicia o anula propiedades que puedan generar conflictos */
  background: transparent;
  color: inherit; /* Hereda el color de navbar-custom-btn */
  padding-top: initial; /* Elimina padding-top específico */
  margin-bottom: initial; /* Elimina margin-bottom específico */
  font-size: inherit;
}


/* --- Media Queries (ajustes para dispositivos pequeños) --- */
@media (max-width: 991.98px) { /* breakpoint 'lg' de Bootstrap */
  .menu {
    height: auto;
    border-radius: 0px 0px 15px 15px;
    background-color: #ffffff;
    padding-top: 0px;
    margin-left: 15px; /* Ajusta el margen izquierdo */
    text-align: left;
    margin-top: 10px;
    flex-direction: column; /* Apila los elementos verticalmente en móvil */
    align-items: flex-start; /* Alinea los elementos al inicio */
    width: calc(100% - 30px); /* Ocupa el ancho completo menos los márgenes */
  }

  ul.navbar-nav {
    padding: 8px 0px 10px 0px;
    flex-direction: column; /* Asegura que la lista sea vertical */
    width: 100%; /* Ocupa todo el ancho disponible */
  }

  .nav-item {
    width: 100%; /* Cada elemento de la lista ocupa todo el ancho */
    margin-bottom: 5px; /* Espaciado vertical entre elementos */
  }

  .navbar-custom-btn {
    width: 100%; /* El botón ocupa todo el ancho del elemento de la lista */
    margin: 0; /* Elimina los márgenes horizontales en móvil */
    text-align: left; /* Alinea el texto a la izquierda */
    justify-content: flex-start; /* Alinea ícono y texto al inicio */
  }

  .navbar-custom-btn:hover {
    transform: none; /* Desactiva la animación de elevación en móvil para un mejor tacto */
    box-shadow: none; /* Sin sombra en móvil */
    background-color: rgba(108, 117, 125, 0.05); /* Hover más sutil en móvil */
  }

  .navbar-toggler {margin-top: 0;} /* Ajusta el margen del toggler */
  .logo { max-width: 8rem; } /* Logo ligeramente más pequeño en móvil */
}
</style>

