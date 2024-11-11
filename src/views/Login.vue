<template>
  <div class="container">
    <div class="row">
     <div class="offset-lg-3 col-lg-6 col-12">
      <h2 class="mb-4 d-flex justify-content-center text-white">Conexion</h2>
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
            <button class="btn " style="background-color: #1A5F28;color: white;font-weight: bold;" :disabled=userStore.loadingUser>Envoyer</button>
          </div>
    
       </form>
      </div>
     </div>
    </div>
  
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useUserStore } from "../stores/user"
import {  useRouter} from "vue-router";

const userStore = useUserStore()
const router = useRouter()

const email = ref('') // vinculamos el dato directamente con ref
const password = ref('') 

const handleSubmit = async () => {
  if(!email.value || !password.value.length > 6){
    userStore.mensajeAlerta("Il faur remplir toutes les champs")
  }
    await userStore.loginUser(email.value,password.value)
    if(userStore.userData.email === "higuerodiego@gmail.com"){
      router.push('/misClientes')
    }else{
      router.push('/misFacturas')
     
    }
}


</script>

<style>
.form{
  background: rgb(0,0,0);
background: linear-gradient(145deg, rgba(0,0,0,1) 41%, rgba(16,2,31,1) 73%);
}
</style>