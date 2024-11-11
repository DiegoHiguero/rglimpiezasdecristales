<template>
   <h1 class="text-center mt-4 mb-4 bg-white">Registro clientes</h1>
   <div class="container bg-white p-4 ">
    <div class="text-center p-2 mt-2 alert alert-danger " v-if="userStore.timeOut !== false" >
               {{ userStore.mensaje }}
         </div>
     <form @submit.prevent="handleSubmit" class=" mt-4 row g-3 ">
          <div class="col-md-5 ">
              <label for="exampleFormControlInput1" class="col-sm-2 col-form-label ">Email</label>
                  <div >
                      <input type="email" 
                            class="form-control" 
                            id="exampleFormControlInput1" 
                            placeholder="name@example.com"
                            v-model.trim="email">
                  </div>
          </div>
          <div class="col-md-4">
              <label for="validationServer01" class="form-label ">Nombre</label>
                      <input type="text" 
                             class="form-control " 
                             id="validationServer01" 
                             v-model="nombre"
                             required>
                    <!-- <div class="valid-feedback">
                      Looks good!
                    </div> -->
          </div>
          <div class="col-md-4">
              <label for="validationServer02" class="form-label ">Apellido</label>
                      <input type="text" 
                             class="form-control " 
                             id="validationServer02" 
                             v-model="apellido"
                             required>
                      <!-- <div class="valid-feedback">
                        Looks good!
                      </div> -->
          </div>
          <div class="col-md-4">
              <label for="validationServerUsername" class="form-label ">Nombre Usuario</label>
                  <div class="input-group has-validation">
                        <input type="text" 
                               class="form-control " 
                               id="validationServerUsername"
                                aria-describedby="inputGroupPrepend3 validationServerUsernameFeedback" 
                                v-model="nombreUsuario"
                                required>
                        <!-- <div id="validationServerUsernameFeedback" class="invalid-feedback">
                          Please choose a username.
                        </div> -->
                  </div>
          </div>
          <div class="col-md-6">
                <label for="validationServer03" class="form-label ">Direccion</label>
                        <input type="text"
                               class="form-control" 
                               id="validationServer03"
                               aria-describedby="validationServer03Feedback"
                               v-model="direccion"
                                required>
                        <!-- <div id="validationServer03Feedback" class="invalid-feedback">
                          Please provide a valid city.
                        </div> -->
          </div>
          <div class="col-md-6">
                <label for="validationServer08" class="form-label ">Numéro Téléphone</label>
                        <input type="number"
                               class="form-control" 
                               id="validationServer08"
                               aria-describedby="validationServer08Feedback"
                               v-model="telephone"
                                required>
                        <!-- <div id="validationServer08Feedback" class="invalid-feedback">
                          Please provide a valid city.
                        </div> -->
          </div>
          <div class="col-md-6">
                  <label for="validationServer04" class="form-label ">Ciudad</label>
                        <input type="text" 
                               class="form-control" 
                               id="validationServer04" 
                               aria-describedby="validationServer03Feedback"
                               v-model="ciudad"
                               required>
                        <!-- <div id="validationServer03Feedback" class="invalid-feedback">
                          Please provide a valid city.
                        </div> -->
          </div>
          <div class="col-md-4">
                    <label for="validationServer05" class="form-label ">Provincia</label>
                          <input type="text" 
                                 class="form-control" 
                                 id="validationServer05" 
                                 aria-describedby="validationServer03Feedback" 
                                 v-model="provincia"
                                 required>
                        
                          <!-- <div id="validationServer04Feedback" class="invalid-feedback">
                            Please select a valid state.
                          </div> -->
                </div>
          <div class="col-md-4">
                    <label for="validationServer06" class="form-label ">Codigo Postal</label>
                          <input type="text" 
                                 class="form-control" 
                                 id="validationServer06"
                                 aria-describedby="validationServer05Feedback"
                                 v-model="codigoPostal"
                                 required>
                          <!-- <div id="validationServer05Feedback" class="invalid-feedback">
                            Please provide a valid zip.
                          </div> -->
          </div>
          <div class="col-md-4">
                      <label for="validationServer07" class="form-label ">Precio</label>
                            <input type="number"
                                 class="form-control " 
                                 id="validationServer07" 
                                 aria-describedby="validationServer05Feedback"
                                 v-model="precio"
                                 required>
                            <!-- <div id="validationServer05Feedback" class="invalid-feedback">
                              Please provide a valid zip.
                            </div> -->
          </div>
          <!-- <div class="col-md-4">
                      <label for="validationServer07" class="form-label">Creacion</label>
                            <input type="date"
                                 class="form-control " 
                                 id="validationServer08" 
                                 aria-describedby="validationServer05Feedback"
                                 v-model="creacion"
                                 required>
                          <div id="validationServer05Feedback" class="invalid-feedback">
                              Please provide a valid zip.
                            </div> 
          </div> -->
          <h2>{{creacion}}</h2>
          <div class="container semana">
            <h4 class="text-success ">Dias de limpieza</h4>
            <ul class="d-flex justify-content-evenly nav">
                <li>
                    <input type="checkbox"  
                           class="btn-check" 
                           id="btn-check-outlined1"
                           v-model="diasLimpieza"
                           value="Lundi"
                           autocomplete="off">
                    <label class="btn btn-outline-primary" id="dia" for="btn-check-outlined1">Lundi</label>
                </li>
                <li>
                    <input type="checkbox"  
                           class="btn-check" 
                           id="btn-check-outlined2" 
                           v-model="diasLimpieza"
                           value="Mardi"
                           autocomplete="off">
                    <label class="btn btn-outline-primary" id="dia" for="btn-check-outlined2">Mardi</label>
                </li>
                <li>
                    <input type="checkbox" 
                           class="btn-check" 
                           id="btn-check-outlined3"
                           v-model="diasLimpieza"
                           value="Mercredi "
                           autocomplete="off">
                    <label class="btn btn-outline-primary" id="dia" for="btn-check-outlined3">Mercredi </label>
                </li>
                <li>
                    <input type="checkbox"  
                           class="btn-check"
                            id="btn-check-outlined4" 
                            v-model="diasLimpieza"
                            value="Jeudi "
                            autocomplete="off">
                    <label class="btn btn-outline-primary" id="dia" for="btn-check-outlined4">Jeudi </label>
                </li>
                <li>
                    <input type="checkbox"  
                           class="btn-check" 
                           id="btn-check-outlined5"
                           v-model="diasLimpieza"
                           value="Vendredi "
                           autocomplete="off">
                    <label class="btn btn-outline-primary" id="dia" for="btn-check-outlined5">Vendredi </label>
                </li>
                <li>
                    <input type="checkbox"  
                           class="btn-check"
                           id="btn-check-outlined6" 
                           v-model="diasLimpieza"
                           value="Samedi "
                           autocomplete="off">
                    <label class="btn btn-outline-primary" id="dia" for="btn-check-outlined6">Samedi </label>
                </li>
                <li>
                    <input type="checkbox"  
                           class="btn-check" 
                           id="btn-check-outlined7" 
                           v-model="diasLimpieza"
                           value="Dimanche "
                           autocomplete="off">
                    <label class="btn btn-outline-primary" id="dia" for="btn-check-outlined7">Dimanche </label>
                </li>
            </ul>
          </div>
          <button class="btn btn-success col-sm-12 mb-4" :disabled=userStore.loadingUser>Crear Usuario</button>
   </form>
   </div>
</template>

<script setup>
import { ref } from "vue"
import { useUserStore } from "../stores/user"
import {  useRouter} from "vue-router";
import { useDatabaseStore } from "../stores/database";


const userStore = useUserStore()
const databaseStore = useDatabaseStore()
const router = useRouter()


const email = ref('') // vinculamos el dato directamente con ref
const password = ref('') 
const nombre = ref('') 
const apellido = ref('') 
const nombreUsuario = ref('') 
const direccion = ref('') 
const telephone = ref('') 
const ciudad = ref('') 
const provincia = ref('') 
const codigoPostal = ref('') 
const precio = ref('') 
const creacion = ref('') 
const diasLimpieza = ref([])
const fechaCreacion = () =>{
  const current = new Date();
      const date = `${current.getDate()} - ${current.getMonth()+1} - ${current.getFullYear()}`;
      return  date

}


const handleSubmit = async () => {
  if(!email.value || !password.value.length > 6){
    userStore.mensajeAlerta("Il faut remplir toutes les champs")
  }
    await userStore.registerUser(email.value, password.value)
     databaseStore.addCliente(
      apellido.value,
      ciudad.value,
      codigoPostal.value,
      diasLimpieza.value,
      direccion.value,
      telephone.value,
      email.value,
      nombre.value,
      nombreUsuario.value,
      precio.value,
      provincia.value,
      fechaCreacion()

    )
     router.push('/misClientes')
    
}
</script>

<style>
 #dia{
        padding: 2.75rem 2.75rem;
    }
    
</style>