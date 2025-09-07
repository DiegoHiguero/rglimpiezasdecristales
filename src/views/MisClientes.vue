<template>
  <div class="p-3 mt-2 py-3 my-2 bg-image">
    <h1 class="text-center mt-4 mb-4 ">Mis clientes</h1>
    <h2 class="text-center pb-3"> <font-awesome-icon :icon="['fas', 'calendar-days']" class="me-2 fa-lg"
        style="color: #37b650" />{{ diaActual }}</h2>
    <div v-if="databaseStore.loadingDoc" class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div class="container-fluid p-0" v-else>
      <div class="col-md-4 bg-white rounded mt-4 mb-4 p-3">
        <div class="col-12 ">
          <h3 class=""> Total Bruto: {{ databaseStore.totalGanancias }}€</h3>
        </div>
        <div class="col-12 ">
          <h3 class=""> Total Neto: {{ databaseStore.totalNeto }}€</h3>
        </div>
        <div class="col-12 ">
          <h3 class=""> Cotizacion: {{ databaseStore.cotizacion }}€</h3>
        </div>
        <div class="col-12 ">
          <h3 class=""> Total Clientes: {{ databaseStore.numeroClientes }}</h3>
        </div>
      </div>
      <div class="row">
        <div>
          <select name="status" class="form-select col-4" aria-label="Default select example"
            v-model="clienteSeleccionado">
            <option selected v-for="(item, index) in databaseStore.documents" :key="item.id" :value=item>{{
              item.nombreUsuario }}</option>
          </select>
          <div v-if="clienteSeleccionado === undefined">
            <h4 class="mt-2"><b>Por favor selecciona un cliente </b></h4>
          </div>
          <div class="row mt-5" v-else>
            <div class="row justify-content-around  mt-2">
              <div class="col-md-4 p-2 mb-3   tarjeta text-white p-4">
                <h4 class="d-flex justify-content-between"><b>{{ clienteSeleccionado.nombre }}</b><span
                    class="badge bg-success" style="font-size: 1.5rem;">{{ clienteSeleccionado.precio }} €</span></h4>
                <ul>
                  <li>
                    <p>{{ clienteSeleccionado.direccion }}</p>
                  </li>
                  <li>
                    <p>{{ clienteSeleccionado.codigoPostal }} {{ clienteSeleccionado.ciudad }}</p>
                  </li>
                  <li>
                    <p>{{ clienteSeleccionado.telephone }}</p>
                  </li>
                </ul>

              </div>
              <div class="col-md-4 p-2 mb-3 tarjeta text-white p-4">
                <h4 class="text-center m-3">Dias de limpieza</h4>
                <div class="d-flex flex-row">
                  <div class="card text-white bg-primary m-3" v-for="(item, index) in clienteSeleccionado.diasLimpieza"
                    :key="index" style="max-width: 18rem">
                    <div class="card-body">
                      <h5 class="card-title">{{ item }}</h5>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="col-md-3 p-2   tarjeta text-white p-4">
                  <h4 class="text-center m-3">Facturas :</h4>
                  <div class="row">
                    <p style="text-indent: 3%" id="cliente" v-for="item in clienteSeleccionado.factura" :key="item">
                      {{ item.nombre }}

                      <span class="btn btn-sm btn-warning"
                        @click="databaseStore.deleteFactura(item.id)"><font-awesome-icon
                          :icon="['fas', 'trash-can']" />Eliminar</span>
                      <a :href="item.referencia" target="_blank" class="btn btn-sm m-2 btn-primary"><font-awesome-icon
                          :icon="['fas', 'magnifying-glass']" />Ver</a>
                    </p>
                  </div>
                </div> -->
            </div>
            <div class="row  justify-content-around mt-2">
              <div class="col-md-5 m-2 p-3 limpiezas">
                <h2 class="text-center pt-2">Anadir Limpieza</h2>
                <div class="form-group mt-5">
                  <label for="startDate">Fecha</label>
                  <h1>{{ fecha }}</h1>
                  <input id="startDate" v-model="fecha" class="form-control" type="date" />
                </div>
                <div class="form-check mt-1 text-center">
                  <button class="btn " :class="[databaseStore.exterior ? 'btn-success' : 'btn-danger']"
                    @click="limpiezaExt()">
                    EXTERIOR
                  </button>
                  <button class="btn  m-3" :class="[databaseStore.interior ? 'btn-success' : 'btn-danger']"
                    @click="limpiezaInt()">
                    INTERIOR
                  </button>
                </div>
                <div class="form-group ">
                  <label for="exampleFormControlTextarea1">Mensaje</label>
                  <textarea v-model="mensage" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                </div>
                <div class=" mt-3">
                  <h2 class="text-center pt-2">Firma</h2>
                  <Vue3Signature ref="signature1" :w="'auto'" :h="'40vh'" class="example"></Vue3Signature>
                </div>
                <div class="text-center p-2 mt-2 alert alert-success d-flex justify-content-evenly " role="alert"
                  v-if="userStore.timeOut !== false">
                  <font-awesome-icon :icon="['fas', 'bell']" shake class="fa-xl" />
                  <h5>{{ userStore.mensaje }} </h5> <font-awesome-icon :icon="['fas', 'bell']" shake class="fa-xl" />
                </div>
                <button class="btn btn-primary col-12 mt-3 mb-3" @click="clear(index)">LIMPIAR
                </button>
                <button class="btn btn-success col-12 mt-3 mb-3"
                  @click="passage(clienteSeleccionado, 'image/jpeg', index)">ENVIAR
                </button>
              </div>
              <div class="row col-md-5  m-2 p-1  limpiezas">
                <div class="container col-md-11" id="accordionPassage">
                  <h2 class="text-center pt-2">Registro Limpiezas</h2>
                  <div class="container mt-3 p-0">
                    <select name="status" class="form-select col-4" v-model="mes">
                      <option value='enero'>enero</option>
                      <option value='febrero'>febrero</option>
                      <option value='marzo'>marzo</option>
                      <option value='abril'>abril</option>
                      <option value='mayo'>mayo</option>
                      <option value='junio'>junio</option>
                      <option value='julio'>julio</option>
                      <option value='agosto'>agosto</option>
                      <option value='septiembre'>septiembre</option>
                      <option value='octubre'>octubre</option>
                      <option value='noviembre'>noviembre</option>
                      <option value='diciembre'>diciembre</option>
                    </select>
                    <table class="table table-striped table-hover mt-4 pt-4">
                      <thead>
                        <tr class="text-center">
                          <th scope="col">J</th>
                          <th scope="col">EXT</th>
                          <th scope="col">INT</th>
                          <th scope="col">COM</th>
                        </tr>
                      </thead>
                      <tbody v-for=" (day, index) in clienteSeleccionado.registro">
                        <tr class="text-center" v-if="day.nombreMes === mes">
                          <th scope="row" v-if="day.fechaLimp === undefined">Aun no hay fecha</th>
                          <th scope="row" v-else>{{ day.diaLimp }} {{ day.fechaLimp }}</th>
                          <td v-if="day.exterior">
                            <font-awesome-icon :icon="['fas', 'check']" class="me-2 fa" style="color: #51f772" />
                          </td>
                          <td v-else>
                            <font-awesome-icon :icon="['fas', 'xmark']" class="me-2 fa" style="color: red" />
                          </td>
                          <td v-if="day.interior">
                            <font-awesome-icon :icon="['fas', 'check']" class="me-2 fa" style="color: #51f772" />
                          </td>
                          <td v-else>
                            <font-awesome-icon :icon="['fas', 'xmark']" class="me-2 fa" style="color: red" />
                          </td>
                          <td>{{ day.comentarios }} </td>
                          <td>
                            <div class="form-check">
                              <input class="form-check-input" type="checkbox" :value=day.imagen id="flexCheckChecked"
                                v-model="firmasSeleccionadas">
                              <img :src=day.imagen alt="firma del cliente" style="max-width: 120px;">
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="mb-4">
                      <button class="btn btn-success"
                        @click="userStore.firmasPDF(firmasSeleccionadas, clienteSeleccionado)">
                        Crear PDF Firmas
                      </button>
                      <hr class="hr mb-3" />
                    </div>
                    <div class="mt-4">
                      <h2 class="text-center pt-2">Nueva Factura</h2>
                      <form class="mt-4">
                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">Numero Factura</span>
                          </div>
                          <input type="text" class="form-control" placeholder="Numero Factura" aria-label="Username"
                            aria-describedby="basic-addon1" v-model="numFactura">
                        </div>
                        <div class="form-group mb-5">
                          <label for="startDate">Fecha</label>
                          <input id="startDate" v-model="fecha" class="form-control" type="date" />
                        </div>
                        <div v-for=" (item, index) in userStore.descripciones" class="d-flex row mb-3">
                          <div class=" mb-3 col-md-12">
                            <input type="text" maxlength="55" class="form-control" placeholder="descripcion"
                              :aria-label=item.descripcion aria-describedby="basic-addon1" v-model=descripcion[index]>
                          </div>
                          <div class=" mb-3 col-md-3">
                            <input type="number" class="form-control" placeholder="cant" :aria-label=item.cant
                              aria-describedby="basic-addon1" v-model=cant[index]>
                          </div>
                          <div class="mb-3 col-md-3">
                            <input type="number" class="form-control" placeholder="preciou" :aria-label=item.preciou
                              aria-describedby="basic-addon1" v-model=preciou[index]>
                          </div>
                          <div class="mb-3 col-md-3">
                            <input type="number" class="form-control" placeholder="importe" :aria-label=item.importe
                              aria-describedby="basic-addon1" v-model=importe[index]>
                          </div>
                          <hr class="hr mb-3" />
                        </div>
                        <div class="row">
                          <div class="col-6">
                            <button class="btn btn-warning mb-2 p-2 " @click.prevent="nuevaDescripcion()">
                              <font-awesome-icon :icon="['fas', 'plus']" class="me-2 fa-lg"
                                style="padding-left: .5rem;" />
                            </button>
                          </div>
                        </div>
                      </form>
                      <button class="btn btn-danger "
                        @click="userStore.crearPDF(clienteSeleccionado, descripcion, cant, preciou, importe, fecha, numFactura)">Crear
                        FACTURA PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="p-2 mt-5 mb-2 mapa bg-white">
          <Mapa />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { useDatabaseStore } from "../stores/database";
import { useRouter } from "vue-router";
import { reactive, ref } from 'vue'
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
  uploadString,
  getStorage,
  ref as refStorage,

} from "firebase/storage";
import Mapa from "../components/Mapa.vue";
import dayjs from "dayjs";
import { es } from "dayjs/locale/es";
import localeData from "dayjs/plugin/localeData";
dayjs.locale("es");

//userStore tendra toda la info de useUserStore
const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const descripcion = ref([])
const cant = ref([])
const preciou = ref([])
const importe = ref([])

databaseStore.getClientes();
databaseStore.getInfoCliente();
const clienteSeleccionado = ref();
const file = ref(null);
const fecha = ref();
const fechaDataPicker = ref();
const mes = ref();
const mensage = ref("");
const numFactura = ref("");
const month = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const date = dayjs();
const firmasSeleccionadas = ref([]);
const d = new Date();
const mesActual = month[d.getMonth()];
const diaActual = date.format('dddd DD MMMM YYYY');
const anoActual = d.getFullYear();

const signature1 = ref(null)
const limpiezaExt = () => {
  databaseStore.exterior = !databaseStore.exterior
}
const limpiezaInt = () => {
  databaseStore.interior = !databaseStore.interior
}
const nuevaDescripcion = () => {
  userStore.contador++
  userStore.descripciones.push({
    descripcion: "Descripcion ",
    cant: "cantidad2",
    preciou: "",
    importe: "",
  })

}
// const enviar = async (idCliente, cliente, index, email) => {
//   const factura = file.value[index].files;
//   const facturaNombre = factura[0].name;
//   userStore.enviarFactura(factura, cliente);

//   const clienteRef = doc(db, "clientes", idCliente);
//   try {
//     const facturaRef = `/${cliente}/${facturaNombre}`;
//     const storage = getStorage();
//     const referenciaUrl = storageRef(storage, facturaRef);
//     const urlCliente = await getDownloadURL(referenciaUrl).then((url) => {
//       return url;
//     });
//     await updateDoc(clienteRef, {
//       factura: arrayUnion({
//         referencia: urlCliente,
//         nombre: nombreFactura.value,
//       }),
//     });
//     const contactParams = {
//       clienteEmail: email,
//       to_name: cliente,
//       nombre: nombreFactura.value,
//       referencia: urlCliente,
//     };

//     emailjs
//       .send(
//         "service_emqkbc7",
//         "template_e1objeh",
//         contactParams,
//         "rFNGy51A07Q9Pt33i"
//       )
//       .then(
//         (result) => {
//           // console.log("SUCCESS!", result.text);
//         },
//         (error) => {
//           // console.log("FAILED...", error.text);
//         }
//       );
//   } catch (error) {
//     console.log(error);
//   }
// };
const clear = () => {
  signature1.value.clear()
}
const passage = async (cliente, t, index, nombreCliente, numfactura) => {

  signature1.value.addWaterMark({
    text: `${cliente.nombre} ${fecha.value}`,          // watermark text, > default ''
    font: "15px Arial",         // mark font, > default '20px sans-serif'
    style: 'all',               // fillText and strokeText,  'all'/'stroke'/'fill', > default 'fill
    fillStyle: "black",           // fillcolor, > default '#333'
    strokeStyle: "black",	       // strokecolor, > default '#333'
    x: 20,                     // fill positionX, > default 20
    y: 20,                     // fill positionY, > default 20
    sx: 20,                    // stroke positionX, > default 40
    sy: 20                     // stroke positionY, > default 40
  });
  const imagenDatos = signature1.value.save(t)
  const mes = new Date(fecha.value)
  const mesCalendario = month[mes.getMonth()];

  try {
    const clienteRef = collection(db, "clientes");
    const q = query(clienteRef, where("registro", "array-contains", "nombreMes"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
    })
    const storage = getStorage();
    const imageRef = refStorage(storage, `${cliente.nombre}-${fecha.value}`);
    uploadString(imageRef, imagenDatos, 'data_url').then((snapshot) => {
      console.log('Uploaded a data_url string!');

    });

    const date = dayjs(fecha.value);
    const fechaEs = date.format('dddd DD-MM-YYYY');
    const urlImagen = await getDownloadURL(imageRef).then((url) => {
      return url;
    });
    await updateDoc(doc(clienteRef, cliente.id,), {

      registro: arrayUnion({
        year: anoActual,
        nombreMes: mesCalendario,
        fechaLimp: fechaEs,
        interior: databaseStore.interior,
        exterior: databaseStore.exterior,
        comentarios: mensage.value,
        imagen: urlImagen
      })
    }, { merge: true })
    userStore.mensajeAlerta("Tu fecha se envio correctamente")
  } catch (error) {
    console.log(error);
    userStore.mensajeAlerta("UPS! Algo no funciono")
  } finally {
    databaseStore.interior = false;
    databaseStore.exterior = false;
    mensage.value = "";
    fecha.value = "";
    signature1.value.clear()

  }
}
</script>

<style>
.tarjeta {
  border-radius: 20px;
  background: rgb(0, 0, 0);
  background: linear-gradient(90deg, rgba(0, 0, 0, 1) 80%, rgb(2, 28, 31) 185%);
}

.limpiezas {
  background-color: #f8f5f5;
  border-radius: 19px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}
.bg-image {
  background-color: #ffffff;
  border-radius: 15px ;
}

#dia {
  padding: 2.75rem 2.75rem;
}

.mapa {
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

}

li {
  list-style: none;
}

label {
  color: black;
  font-weight: bold;
}

.nuevaLimpieza {
  background-color: rgba(192, 189, 189, 0.527);
}
</style>