<template>
  <h1 class="text-center mt-4 mb-4">Mis Facturas</h1>
  <div
    class="container-fluid row d-flex justify-content-center pt-4"
    v-for="item in databaseStore.documents"
    :key="item.id"
  >
    <div class="col-md-3 p-2 m-3 mx-4 tarjeta">
      <h3 class="text-white text-center pt-4">Information personnelle</h3>
      <div class="col-12 p-4">
        <p class="text-white"><b>Prénom : </b>{{ item.nombre }}</p>
        <p class="text-white"><b>Nom : </b>{{ item.apellido }}</p>
        <p class="text-white"><b>Adresse : </b> {{ item.direccion }}</p>
        <p class="text-white"><b>Ville : </b> {{ item.ciudad }}</p>
        <p class="text-white"><b>Département : </b> {{ item.provincia }}</p>
        <p class="text-white"><b>Code Postal : </b> {{ item.codigoPostal }}</p>
        <p class="text-white"><b>Prix : </b>{{ item.precio }} €</p>
        <p class="text-white"><b>Client depuis : </b>{{ item.creacion }}</p>
      </div>
    </div>
    <div class="col-md-3 p-2 m-3 mx-4 tarjeta">
      <h3 class="text-white text-center pt-4">Jours de passage</h3>
      <div class="d-flex flex-row p-4">
        <div
          class="card text-white bg-primary m-3"
          v-for="(item, index) in item.diasLimpieza"
          :key="index"
          style="max-width: 18rem"
        >
          <div class="card-body">
            <h5 class="card-title">{{ item }}</h5>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3 p-2 m-3 mx-4 container tarjeta">
      <h3 class="text-white text-center pt-4">Factures</h3>
      <div class="p-4">
        <ul>
          <li v-for="item in databaseStore.facturasUrl" :key="item">
            <a
              class="btn btn-success mt-3"
              :href="item.refFactura"
              target="_blank"
              >{{ item.nombreFactura
              }}<font-awesome-icon
                :icon="['fas', 'file-arrow-down']"
                class="ms-2"
            /></a>
          </li>
        </ul>
      </div>
    </div>
    <!-- <div class="container row col-10" style="background-color: white">
      <h4 class="text-center m-3">Passage :</h4>
      <div class="container">
        <CalendarMonth />
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { useDatabaseStore } from "../stores/database";

//userStore tendra toda la info de useUserStore
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import CalendarMonth from "../components/CalendarMonth.vue";

const databaseStore = useDatabaseStore();
const storage = getStorage();
const user = useUserStore();
const facturaCliente = [];

databaseStore.getInfoCliente();
</script>

<style>
.tarjeta {
  border-radius: 20px;
  background: rgb(0, 0, 0);
  background: linear-gradient(90deg, rgba(0, 0, 0, 1) 80%, rgb(2, 28, 31) 185%);
}
p {
  font-size: 1.2rem;
}
</style>