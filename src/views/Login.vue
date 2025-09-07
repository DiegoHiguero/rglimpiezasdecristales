<template>
  <div class="container">
    <div class="row">
     <div class="offset-lg-3 col-lg-6 col-12">
      <h2 class="mb-4 d-flex justify-content-center ">Conexion</h2>
      <div class="p-4 my-4 p-lg-8 form" style="border-radius: 0.75rem;">
        <div class="text-center p-2 mt-2 alert alert-danger " v-if="userStore.timeOut !== false" >
               {{ userStore.mensaje }}
         </div>
        <form @submit.prevent="handleSubmit" class=" mt-4 row g-3">
          <h1 class="mb-2 text-white">Bienvenue</h1>
           <div class="mb-3">
              <label for="exampleFormControlInput1" class="col-sm-2 col-form-label">Email</label>
              <input type="email" 
                            class="form-control border-0" 
                            id="exampleFormControlInput1" 
                            placeholder="name@example.com"
                            v-model.trim="email">
            </div>
          <div class="mb-3 mb-4">
              <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
              <input type="password" 
                            class="form-control border-0" 
                            id="inputPassword"
                            v-model.trim="password">
                  
          </div>
          <div class="d-grid">
            <button class="btn" style="background-color: #1A5F28;color: white;font-weight: bold;" :disabled="userStore.loadingUser">Envoyer</button>
          </div>
          
          <!-- ¡NUEVO: Botón de Google Sign-In! -->
          <div class="d-grid mt-3">
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="handleGoogleSignIn" 
              :disabled="userStore.loadingUser"
              style="background-color: #DB4437; border-color: #DB4437; color: white; font-weight: bold;"
            >
              <i class="fab fa-google me-2"></i> Iniciar sesión con Google
            </button>
          </div>
          <!-- Fin del nuevo botón -->

       </form>
      </div>
     </div>
    </div>
  
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useUserStore } from "../stores/user"
import { useRouter } from "vue-router";

const userStore = useUserStore()
const router = useRouter()

const email = ref('') 
const password = ref('') 

const handleSubmit = async () => {
  // Validar si los campos están vacíos
  if (!email.value || !password.value) {
    userStore.mensajeAlerta("Il faut remplir tous les champs");
    return;
  }
  
  // Validar la longitud de la contraseña
  if (password.value.length < 6) {
    userStore.mensajeAlerta("Le mot de passe doit avoir au moins 6 caractères");
    return;
  }
  
  await userStore.loginUser(email.value, password.value)
  // La redirección después del login (tanto para email/password como para Google)
  // se gestiona en la acción `initAuthListener` de tu userStore,
  // la cual debería ser llamada una vez al inicio de tu aplicación (ej. en main.js).
  // Por lo tanto, no necesitas las líneas de `router.push` aquí.
}

// ¡NUEVA FUNCIÓN: Manejador para el inicio de sesión con Google!
const handleGoogleSignIn = async () => {
  await userStore.signInWithGoogle()
  // La redirección después del login de Google también se gestiona en `initAuthListener`.
}

</script>

<style>
/* Posiblemente necesites un CDN para los iconos de Font Awesome si no los tienes ya */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.form{
  background: rgb(0,0,0);
background: linear-gradient(145deg, rgba(0,0,0,1) 41%, rgba(16,2,31,1) 73%);
}
</style>
