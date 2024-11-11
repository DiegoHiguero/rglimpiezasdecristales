<template>
    <div class="col-md-6">
        <div class="form-group col-md-6 mt-5">
            <label for="startDate">Anadir limpieza</label>
            <input id="startDate" v-model="fecha" class="form-control" type="date" />
        </div>
        <div class="form-check mt-1">
            <button class="btn " :class="[databaseStore.exterior ? 'btn-success' : 'btn-danger']"
                @click="limpiezaExt()">
                EXTERIOR
            </button>
            <button class="btn  m-3" :class="[databaseStore.interior ? 'btn-success' : 'btn-danger']"
                @click="limpiezaInt()">
                INTERIOR
            </button>
        </div>
        <div class="form-group col-6">
            <label for="exampleFormControlTextarea1">Example textarea</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        </div>
        <button class="btn btn-success col-6 mt-1" @click="passage(item.id)">ENVIAR
        </button>
    </div>
</template>
<script setup>
import { useDatabaseStore } from "../stores/database";
import { useRouter } from "vue-router";
import { ref } from "vue";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";
import { db } from "../firebaseConfig";
import emailjs from "@emailjs/browser";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";
import Mapa from "../components/Mapa.vue";

//userStore tendra toda la info de useUserStore
const databaseStore = useDatabaseStore();

const fecha = ref();

const month = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const d = new Date();
const mesActual = month[d.getMonth()];
const anoActual = d.getFullYear();



const limpiezaExt = () => {
  databaseStore.exterior = !databaseStore.exterior
}
const limpiezaInt = () => {
  databaseStore.interior = !databaseStore.interior
}
const passage = async (idCliente) => {

try {
  const clienteRef = collection(db, "clientes");
  const q = query(clienteRef, where("registro", "array-contains", "nombreMes"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
  })
  await updateDoc(doc(clienteRef, idCliente,), {


    registro: arrayUnion({
      year: anoActual,
      nombreMes: mesActual,
      fechaLimp: fecha.value,
      interior: databaseStore.interior,
      exterior: databaseStore.exterior,
      comentarios: "Seguimos pues"

    })
  }, { merge: true })
} catch (error) {
  console.log(error);
}
}
</script>
<style scoped></style>