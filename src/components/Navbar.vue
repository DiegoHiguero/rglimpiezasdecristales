<template>
  <nav class="navbar navbar-expand-lg py-0 container-fluid" id="scrollspyHeading1">
    <router-link class="navbar-expand text-center ps-4 " to="/">
      <img
        class="logo zoom navbar-brand-item d-inline "
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
    <div class=" menu collapse navbar-collapse bg-body-tertiary p-2 rounded-bottom-4  " id="navbarNavAltMarkup">
      <ul class="navbar-nav col">
        <li class="nav-item">
          <router-link to="/register" v-if="userStore.userData.email === 'roys.abreu@gmail.com'"
            class="me-4  btn-dark text-white" id="boton-master">
            Registro Clientes
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/misClientes" v-if="userStore.userData.email === 'roys.abreu@gmail.com'"
            class="me-4 btn btn-danger text-white" id="boton-master">
            
            Clientes
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/misFacturas" v-if="userStore.userData.email"
            class="me-4  btn-dark text-white" id="boton-master">
            Facturas
          </router-link>
        </li>
        <li class="nav-item" >
            
            <a class="nav-link me-4 router-link-active router-link-exact-active me-4 btn-outline-light" id="boton-session" href="#scrollspyHeading1">INICIO</a>
          <ul class="nav  d-flex flex-row">

            <li class="nav-item">
              <router-link
                to="/register"
                v-if="userStore.userData.email === 'roys.abreu@gmail.com'"
                class="me-4 btn-sm btn-dark text-white"
                id="boton-master"
                ><font-awesome-icon
                  :icon="['fas', 'address-card']"
                  class="me-2"
                />Registro Clientes</router-link
              >
            </li>
             <li class="nav-item">
              <router-link
                to="/registro"
                v-if="userStore.userData.email === 'roys.abreu@gmail.com'"
                class="me-4 btn-sm btn-dark text-white"
                id="boton-master"
                ><font-awesome-icon
                  :icon="['fas', 'address-card']"
                  class="me-2"
                />Registro</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                to="/misClientes"
                v-if="userStore.userData.email === 'roys.abreu@gmail.com'"
                class="me-4 btn-sm btn-dark text-white"
                id="boton-master"
                ><font-awesome-icon
                  :icon="['fas', 'rectangle-list']"
                  class="me-2"
                />Clientes</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                to="/misFacturas"
                v-if="userStore.userData.email"
                class="me-4 btn-sm btn-dark text-white"
                id="boton-master"
                ><font-awesome-icon
                  :icon="['fas', 'file-invoice']"
                  class="me-2"
                />Facturas</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                to="/"
                v-if="!userStore.userData.email"
                class="me-4  btn-sm btn-outline-light"
                id="boton-session"
              ><i class="fas fa-home"></i> INICIO
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/"
                v-if="!userStore.userData.email"
                class="me-4  btn-sm btn-outline-light"
                id="boton-session"
              ><i class="fas fa-briefcase"></i>NOSOTROS

              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/"
                v-if="!userStore.userData.email"

                class="me-4  btn-sm btn-outline-light"
                id="boton-session"
              ><i class="fas fa-concierge-bell"> </i> SERVICIOS

              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/"
                v-if="!userStore.userData.email"

                class="me-4  btn-sm btn-outline-light"
                id="boton-session"
              ><i class="fas fa-mobile-alt"></i> TRABAJOS

              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/login"
                v-if="!userStore.userData.email"
                class="me-4  btn-sm btn-outline-light"
                id="boton-session"
              >
                <font-awesome-icon
                  :icon="['fas', 'user']"
                  class="me-2 "
                />Iniciar sesión
              </router-link>
            </li>
            <li class="nav-item">
              <button
                class=" btn-sm btn-danger"
                v-if="userStore.userData.email"
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
import { useUserStore } from "../stores/user"; // Este import está correctamente en el nivel superior del módulo.

//userStore tendra toda la info de useUserStore
const userStore = useUserStore();
</script>

<style scoped>
.navbar .navbar-toggler-icon {
  /* Cambiado de verde a azul */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%23007bff' stroke-linecap='round' stroke-miterlimit='10' stroke-width='4' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
 padding-right: 0px;
}
a {
  text-decoration: none;
}
.colorfondo {
  background-color: #4970B6; /* Cambiado de verde a azul */
}
.navbar-toggler:focus {
  color: #151515; /* Cambiado de verde a azul */
}
.menu {
  height: 80px;
  border-radius: 0px 0px 15px 15px;
  background-color: white;
  margin-right: auto;
  margin: 0px 15px 0px 15px;
}
.btn {
  font-family: 'Anton', sans-serif;
  border: 0px;
  font-size: 0.5rem;
  padding-top: 27px;
  background-color: #fff;
  color: #151515;
}
.navbar {
  background-color: #151515;
  top: 0px;
  width: 100%;
  z-index: 2;
  margin: 0px 15px 0px 0px;
}
.logo {
  max-width: 10rem;
}


svg {
  vertical-align: bottom;
  height: 13px;
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
#boton-accueil {
  background: transparent;
  /* Cambiado de verde a azul */
  color: #151515;
  font-family: 'Anton', sans-serif;
  transition: all 0.2s ease-in-out;
  font-weight: 400;
}

#boton-accueil:hover {
  /* Cambiado de verde y blanco a azul y blanco */
  background: #151515;
  color: white;
  font-family: 'Anton', sans-serif;
}
#boton-contact {
  background: transparent;
  /* Cambiado de verde a azul */
  color: #151515;
  font-family: 'Anton', sans-serif;
  transition: all 0.2s ease-in-out;
  font-weight: 400;
}
#boton-contact:hover {
  /* Mantenido blanco, ya que el contraste con azul es bueno */
  color: white;
}
#boton-services {
  background: transparent;
  color: #8f199e; /* Mantenido púrpura, no es verde ni azul */
  transition: all 0.2s ease-in-out;
  font-weight: 400;
}
#boton-services:hover {
  background: #8f199e; /* Mantenido púrpura */
  /* Mantenido blanco, ya que el contraste con púrpura es bueno */
  color: white;
}
#boton-master {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
}
#boton-master:hover {
  /* Cambiado de verde a azul */
  color: #4970B6;
  font-family: 'Anton', sans-serif;
}
#boton-session {
  /* Cambiado de verde a azul */
  display: inline-block;
  color: #151515;
  transition: all 0.2s ease-in-out;
  font-family: 'Anton', sans-serif;
  font-weight: 200;
  font-size: medium;
  margin-bottom: -10px;
  
  
  
}
#boton-session:hover {
  /* Cambiado de verde oscuro a azul oscuro */
  color: #fff;
  background-color: #151515;
  border-radius: 15px 15px 0px 0px ;
  
}
ul {
  padding: 47px 0px 0px 20px;
  
  flex-direction: column;
}
@media (max-width: 768px) {
  .menu {
    
   
    height: auto;
    border-radius: 0px 0px 15px 15px;
    background-color: #ffffff;
    color: #ffffff;
    padding-top: 0px;
    margin-left: 20px;
    text-align:left;
    margin-top: 10px;
  }

ul {
  padding: 8px 20px 10px 20px;
  
  
  align-self: start;

}

li {
  height: auto;
  text-decoration: none;
  
  
}
#boton-session {
  /* Cambiado de verde a azul */
  
  margin-bottom: -25px;
  
}
#boton-session:hover {
  /* Cambiado de verde oscuro a azul oscuro */
  color:#4970B6;
  border-radius: 0px; 
  background-color:transparent;
  
  
}
.navbar-toggler {margin-top: 40px;}

}
</style>
