<template>
  <nav class="navbar navbar-expand-lg py-0  ">
          <router-link class="navbar-brand col-4 text-center" to="/">
            <img
              class="logo zoom navbar-brand-item d-inline "
              src="../assets/img/logorglimpiezas.png"
              alt="RG Limpieza de cristales logo"
            />
          </router-link>
          <button class="navbar-toggler text-end col-2 " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class=" menu row collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul class="nav justify-content-space-evenly d-flex">
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
                class="me-4  btn-sm btn-secondary"
                id="boton-session"
              >INICIO
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/"
                v-if="!userStore.userData.email"
                class="me-4  btn-sm btn-secondary"
                id="boton-session"
              >NOSOTROS
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/"
                v-if="!userStore.userData.email"
                class="me-4  btn-sm btn-secondary"
                id="boton-session"
              >SERVICIOS
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/"
                v-if="!userStore.userData.email"
                class="me-4  btn-sm btn-secondary"
                id="boton-session"
              >TRABAJOS
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/login"
                v-if="!userStore.userData.email"
                class="me-4  btn-sm btn-secondary"
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
import { useUserStore } from "../stores/user";

//userStore tendra toda la info de useUserStore
const userStore = useUserStore();
</script>

<style scoped>
.navbar .navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='green' stroke-linecap='round' stroke-miterlimit='10' stroke-width='4' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  
}
a{
  text-decoration: none;}
.colorfondo{
  background-color: green;
}
.navbar-toggler:focus {
    color: green;
}
.menu{
height: 100px;
border-radius: 0px 0px 15px 15px;
background-color: white;
}
.btn {
  font-family: "Baloo 2";
  border: 0px;
  font-size: 1.1rem;
}
.navbar {
  background-color: #323131;
   top: 0px;
    width: 100%;
    z-index: 2;
   
}
.logo {
  max-width: 18rem;
}

img,
svg {
  vertical-align: middle;
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
  color: #B7B335;
  font-family: "Baloo 2";
  transition: all 0.2s ease-in-out;
  font-weight: bold;
}

#boton-accueil:hover {
  background: #B7B335;
  color: #eaebf1;
  font-family: "Baloo 2";
}
#boton-contact {
  background: transparent;
  color: #1A5F28;
  font-family: "Baloo 2";
  transition: all 0.2s ease-in-out;
  font-weight: bold;
}
#boton-contact:hover {
  background: #1A5F28;
  color: #eaebf1;
}
#boton-services {
  background: transparent;
  color: #8f199e;
  transition: all 0.2s ease-in-out;
  font-weight: bold;
}
#boton-services:hover {
  background: #8f199e;
  color: #eaebf1;
}
#boton-master {
  background: #1A5F28;
  font-family: "Baloo 2";
  font-weight: bold;
}
#boton-master:hover {
  background: #12421c;
  font-family: "Baloo 2";
}
#boton-session {
  background: #1A5F28;
  color: #f7f8fa;
  transition: all 0.2s ease-in-out;
  font-family: "Baloo 2";
  font-weight: bold;
}
#boton-session:hover {
  background: #12421c;
  color: #f7f8fa;
}
ul{
  justify-content: space-evenly;
  display: flex;
}
@media (max-width: 768px) {
  .menu{
height: 100px;
border-radius: 0px 0px 15px 15px;
background-color: #323131;
}
  }
</style>