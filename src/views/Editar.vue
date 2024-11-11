<template>
  <div class="container">
    <h1 class="text-center mt-4 mb-4 text-white">Editar clientes</h1>
    <form @submit.prevent="handleSubmit" class="mt-4 row g-3">
      <div class="col-md-4">
        <label for="exampleFormControlInput1" class="col-sm-2 col-form-label"
          >Email</label
        >
        <div class="col-sm-6">
          <input
            type="email"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="name@example.com"
            v-model.trim="email"
          />
        </div>
      </div>
      <div class="col-md-4">
        <label for="inputPassword" class="col-sm-2 col-form-label"
          >Contrasena</label
        >
        <div class="col-sm-6">
          <input
            type="password"
            class="form-control"
            id="inputPassword"
            v-model.trim="password"
          />
        </div>
      </div>
      <div class="col-md-4">
        <label for="validationServer01" class="form-label">Nombre</label>
        <input
          type="text"
          class="form-control"
          id="validationServer01"
          v-model="nombre"
          required
        />
        <!-- <div class="valid-feedback">
                      Looks good!
                    </div> -->
      </div>
      <div class="col-md-4">
        <label for="validationServer02" class="form-label">Apellido</label>
        <input
          type="text"
          class="form-control"
          id="validationServer02"
          v-model="apellido"
          required
        />
        <!-- <div class="valid-feedback">
                        Looks good!
                      </div> -->
      </div>
      <div class="col-md-4">
        <label for="validationServerUsername" class="form-label"
          >Nombre Usuario</label
        >
        <div class="input-group has-validation">
          <input
            type="text"
            class="form-control"
            id="validationServerUsername"
            aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback"
            v-model="nombreUsuario"
            required
          />
          <!-- <div id="validationServerUsernameFeedback" class="invalid-feedback">
                          Please choose a username.
                        </div> -->
        </div>
      </div>
      <div class="col-md-6">
        <label for="validationServer03" class="form-label">Direccion</label>
        <input
          type="text"
          class="form-control"
          id="validationServer03"
          aria-describedby="validationServer03Feedback"
          v-model="direccion"
          required
        />
        <!-- <div id="validationServer03Feedback" class="invalid-feedback">
                          Please provide a valid city.
                        </div> -->
      </div>
      <div class="col-md-6">
        <label for="validationServer04" class="form-label">Ciudad</label>
        <input
          type="text"
          class="form-control"
          id="validationServer04"
          aria-describedby="validationServer03Feedback"
          v-model="ciudad"
          required
        />
        <!-- <div id="validationServer03Feedback" class="invalid-feedback">
                          Please provide a valid city.
                        </div> -->
      </div>
      <div class="col-md-3">
        <label for="validationServer05" class="form-label">Provincia</label>
        <input
          type="text"
          class="form-control"
          id="validationServer05"
          aria-describedby="validationServer03Feedback"
          v-model="provincia"
          required
        />

        <!-- <div id="validationServer04Feedback" class="invalid-feedback">
                            Please select a valid state.
                          </div> -->
      </div>
      <div class="col-md-3">
        <label for="validationServer06" class="form-label">Codigo Postal</label>
        <input
          type="text"
          class="form-control"
          id="validationServer06"
          aria-describedby="validationServer05Feedback"
          v-model="codigoPostal"
          required
        />
        <!-- <div id="validationServer05Feedback" class="invalid-feedback">
                            Please provide a valid zip.
                          </div> -->
      </div>
      <div class="col-md-3">
        <label for="validationServer07" class="form-label">Precio</label>
        <input
          type="number"
          class="form-control"
          id="validationServer07"
          aria-describedby="validationServer05Feedback"
          v-model="precio"
          required
        />
        <!-- <div id="validationServer05Feedback" class="invalid-feedback">
                              Please provide a valid zip.
                            </div> -->
      </div>
      <div class="container semana">
        <h4>Dias de limpieza</h4>
        <ul class="d-flex justify-content-evenly nav">
          <li>
            <input
              type="checkbox"
              class="btn-check"
              id="btn-check-outlined1"
              v-model="diasLimpieza"
              value="Lunes"
              autocomplete="off"
            />
            <label
              class="btn btn-outline-primary"
              id="dia"
              for="btn-check-outlined1"
              >Lunes</label
            >
          </li>
          <li>
            <input
              type="checkbox"
              class="btn-check"
              id="btn-check-outlined2"
              v-model="diasLimpieza"
              value="Martes"
              autocomplete="off"
            />
            <label
              class="btn btn-outline-primary"
              id="dia"
              for="btn-check-outlined2"
              >Martes</label
            >
          </li>
          <li>
            <input
              type="checkbox"
              class="btn-check"
              id="btn-check-outlined3"
              v-model="diasLimpieza"
              value="Miercoles"
              autocomplete="off"
            />
            <label
              class="btn btn-outline-primary"
              id="dia"
              for="btn-check-outlined3"
              >Miercoles</label
            >
          </li>
          <li>
            <input
              type="checkbox"
              class="btn-check"
              id="btn-check-outlined4"
              v-model="diasLimpieza"
              value="Jueves"
              autocomplete="off"
            />
            <label
              class="btn btn-outline-primary"
              id="dia"
              for="btn-check-outlined4"
              >Jueves</label
            >
          </li>
          <li>
            <input
              type="checkbox"
              class="btn-check"
              id="btn-check-outlined5"
              v-model="diasLimpieza"
              value="Viernes"
              autocomplete="off"
            />
            <label
              class="btn btn-outline-primary"
              id="dia"
              for="btn-check-outlined5"
              >Viernes</label
            >
          </li>
          <li>
            <input
              type="checkbox"
              class="btn-check"
              id="btn-check-outlined6"
              v-model="diasLimpieza"
              value="Sabado"
              autocomplete="off"
            />
            <label
              class="btn btn-outline-primary"
              id="dia"
              for="btn-check-outlined6"
              >Sabado</label
            >
          </li>
          <li>
            <input
              type="checkbox"
              class="btn-check"
              id="btn-check-outlined7"
              v-model="diasLimpieza"
              value="Domingo"
              autocomplete="off"
            />
            <label
              class="btn btn-outline-primary"
              id="dia"
              for="btn-check-outlined7"
              >Domingo</label
            >
          </li>
        </ul>
      </div>
      <button
        class="btn btn-warning col-sm-12"
        :disabled="userStore.loadingUser"
      >
        Editar Usuario
      </button>
    </form>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const handleSubmit = () => {
  console.log("editar");
};
const route = useRoute();
</script>

<style>
</style>