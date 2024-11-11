<template>
  <div class="container mb-4 bg-white">
    <div class="row d-flex justify-content-center">
      <div class="col-lg-7 col-12">
        <h3 class="  m-4 d-flex justify-content-center">
          Nous Contacter
        </h3>
        <div class="p-4 pt-1 p-lg-8 form"  style="border-radius: 0.75rem">
          
          <form @submit.prevent="handleSubmit" class="mt-1 row g-3">
            <div class="row mt-3 col-12 d-flex justify-content-around">
              <div class="col-md-4 d-flex justify-content-center row">
                <font-awesome-icon
                  :icon="['fas', 'phone']"
                  class="me-2 text-white text-center mb-3 icon fa-xl"
                />
                <p class="text-white text-center">+33 658 80 24 03</p>
              </div>
              <div class="col-md-4 d-flex justify-content-center row">
                <font-awesome-icon
                  :icon="['fas', 'envelope']"
                  class="me-2 text-white text-center mb-3 icon fa-xl"
                />
                <p class="text-white text-center">
                  toucanet64@gmail.com
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <label
                for="validationServer01"
                class="col-sm-2 col-form-label"
                required
                >Prénom</label
              >
              <input
                type="text"
                class="form-control"
                id="validationServer01"
                v-model="prenom"
                placeholder="Prenom"
                required
              />
              <!-- <div class="valid-feedback">
                      Looks good!
                    </div> -->
            </div>
            <div class="col-md-6">
              <label
                for="exampleFormControlInput1"
                class="col-sm-2 col-form-label"
                required
                >Email</label
              >
              <input
                type="email"
                class="form-control border-0"
                id="exampleFormControlInput1"
                placeholder="name@example.com"
                v-model.trim="email"
              />
            </div>
            <div class="mb-3 mb-4">
              <label
                for="inputPassword"
                class="col-sm-2 col-form-label"
                required
                >Sujet</label
              >
              <input
                class="form-control border-0"
                id="inputPassubjetsword"
                placeholder="Subjet"
                v-model="subjet"
                required
              />
            </div>
            <div class="mb-3 mb-4">
              <label
                for="inputPassword"
                class="col-sm-2 col-form-label"
                required
                >Message</label
              >
              <textarea
                class="form-control border-0"
                id="inputPassubjetsword"
                placeholder="Message"
                v-model="message"
                required
              ></textarea>
            </div>
            <div class="text-center p-2 mt-2 alert alert-success " v-if="userStore.timeOut !== false" >
               {{ userStore.mensaje }}
               <!-- <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> -->
         </div>
            <div class="d-grid">
              <button class="btn" style="background-color: #1A5F28;color: white;font-weight: bold;" @click="enviarMensaje()">
                Confirmer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import emailjs from "@emailjs/browser";

import { useUserStore } from "../stores/user";

const prenom = ref("");
const email = ref("");
const subjet = ref("");
const message = ref("");

const userStore = useUserStore();

const enviarMensaje = async () => {
  if(!prenom.value,!email.value , !message.value){
    userStore.mensajeAlerta("Il faut remplir toutes les champs")
  }else{
    try {
    const contactParams = {
      prenom: prenom.value,
      email: email.value,
      message: message.value,
    };

    await emailjs
      .send(
        "service_emqkbc7",
        "template_lu5kxwz",
        contactParams,
        "rFNGy51A07Q9Pt33i"
      )
      .then(
        (result) => {
          prenom.value="",
          email.value="",
          message.value="",
          userStore.mensajeAlerta("Bien joué! Le message a été bien envoyé")
        },
        (error) => {
          userStore.mensajeAlerta("Ups! Il y a eu un probleme")
        }
      );
  } catch (error) {
    console.log(error);
  }
  }
  
};
</script>

<style>
</style>