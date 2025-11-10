<template>
  <div class="padre" >
    <!-- Contenido principal -->
    <div
      class="row d-flex justify-content-center ms-3 mx-3  bg-image principal mt-3  bg-body-tertiary rounded-4 align-items-md-stretch " >
      <div class="row col-md-6 m-2 p-2">
        <h1 class="display-4 p-3 fs-1"> <span class="prof"> Profesional en limpieza de Cristales</span>
          <span class="textAnimation">Con más de 10 años de experiencia en el sector de limpieza de cristales!</span></h1>
        <h1 class="p-3" style="color: #fff ;">
          <span style="color: #fff ;">En Royal Clean Limpieza de cristales </span> hacemos la diferencia!
        </h1>
      </div>
      <div class="row col-md-6 pt-2 pb-4 d-flex justify-content-center mt-4" style=" z-index: 2;">
        <div class="col-lg-8 mt-4 p-4 pt-1 p-lg-8 formulario" style="border-radius: 0.75rem;">
          <form @submit.prevent="enviarMensaje" class="mt-4 row g-3">
            <div class="row mt-3 d-lg-flex col-12 justify-content-around">
              <h2 class="text-center text-white">
                Pida presupuesto gratuito!
              </h2>
            </div>
            <div class="">
              <label for="prenomInput" class="col-sm-2 col-form-label text-white">Nombre</label>
              <input 
                type="text" 
                class="form-control" 
                :class="{ 'is-invalid': prenomError, 'is-valid': prenom.length > 0 && !prenomError }"
                id="prenomInput"
                 placeholder="Su nombre"  
                v-model="prenom" 
                @blur="validatePrenom" 
                @input="validatePrenom"
              />
              <div v-if="prenomError" class="invalid-feedback">
                {{ prenomError }}
              </div>
              <div v-else-if="prenom.length > 0 && !prenomError" class="valid-feedback">
                ¡Perfecto!
              </div>
            </div>
            <div class="">
              <label for="emailInput" class="col-sm-2 col-form-label text-white">Email</label>
              <input 
                type="email" 
                class="form-control border-0" 
                :class="{ 'is-invalid': emailError, 'is-valid': email.length > 0 && !emailError }"
                id="emailInput"
                placeholder="nombre@ejemplo.com" 
                v-model.trim="email" 
                @blur="validateEmail" 
                @input="validateEmail"
              />
              <div v-if="emailError" class="invalid-feedback">
                {{ emailError }}
              </div>
              <div v-else-if="email.length > 0 && !emailError" class="valid-feedback">
                ¡Perfecto!
              </div>
            </div>
            <div class="">
              <label for="phoneInput" class="col-sm-2 col-form-label text-white">Teléfono</label>
              <input 
                type="tel" 
                class="form-control border-0" 
                :class="{ 'is-invalid': phoneError, 'is-valid': phone.length > 0 && !phoneError }"
                id="phoneInput" 
                placeholder="Su numero"
                v-model.trim="phone" 
                @blur="validatePhone" 
                @input="validatePhone"
              />
              <div v-if="phoneError" class="invalid-feedback">
                {{ phoneError }}
              </div>
              <div v-else-if="phone.length > 0 && !phoneError" class="valid-feedback">
                ¡Perfecto!
              </div>
            </div>
            <div class="mb-3 mb-4">
              <label for="messageInput" class="col-sm-2 col-form-label text-white">Mensaje</label>
              <textarea 
                class="form-control border-0" 
                :class="{ 'is-invalid': messageError, 'is-valid': message.length > 0 && !messageError }"
                id="messageInput" 
                placeholder="Mensaje" 
                v-model="message" 
                @blur="validateMessage" 
                @input="validateMessage"
              ></textarea>
              <div v-if="messageError" class="invalid-feedback">
                {{ messageError }}
              </div>
              <div v-else-if="message.length > 0 && !messageError" class="valid-feedback">
               ¡Perfecto!
              </div>
            </div>
            <div class="text-center p-2 mt-2 alert alert-success" v-if="userStore.timeOut !== false">
              {{ userStore.mensaje }}
            </div>
            <div class="d-grid">
             <button :disabled="isSubmitting || !isFormValid" class="btn" style="
                  background-color: #3230af;
                  color: white;
                  font-weight: bold;
                ">
                {{ isSubmitting ? 'Envio en curso...' : 'Enviar' }}
              </button>
            </div>
          </form>
         </div>
      </div>

      <div class="section2 flex row">

      </div>
    </div>

    <div class="texto-principal-nosotros" id="texto-principal" >
      <div class="titulo-descripcion" id="scrollspyHeading2">
        <h1 class="imagen-descripcion display-4 mb-5 "  >
          NOSOTROS</h1>
      </div>
      <img class="imagen-nosotros" src="../assets/img//Header_Fensterreiniger_Glas_ANW_Toplock_000313.jpg" alt="">
      <h1 class="imagen-descripcion">¡Hola! Mi nombre es Roys Abreu</h1>
      <p class="parrafogratuito2"> Soy un profesional autónomo con amplia experiencia en limpieza de cristales especializada. 
        Bienvenidos a Royal Clean Limpieza Profesional, tu aliado de confianza para limpeza de cristales y fachadas impecables. 
        Nos comprometemos a ofrecer servicios integrales, eficientes y de alta calidad,
         adaptados a cada cliente, ya sea residencial o empresarial. Con Royal Clean Limpieza Profesional, 
         no solo obtienes limpieza, sino tranquilidad y resultados que se ven.

      </p>
      <p class="parrafogratuito2">
      </p>

    </div>
    <div class="accordion accordion-flush rounded-bottom-20 accordion pt-0 ps-3 px-3 " id="accordionExample">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button " type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
            aria-expanded="true" aria-controls="collapseOne">
            ¿Dónde trabajamos?
          </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
          <div class="accordion-body">
                      <img src="/src/assets/img/mapa.png" class="img-fluid m-2" style="width: 90px; " alt="">

            <p class="text-start mt-2"> <strong>Nuestro alcance de servicio en limpieza.</strong>
Ofrecemos servicios de limpieza en todo Madrid capital y su periferia: Madrid, Getafe, Majadahonda, Pozuelo, Las Rozas, Griñon y más.
También podemos desplazarnos a zonas más lejanas, con un precio ajustado según la distancia.
 flexibilidad geográfica y de precios nos permite ofrecerte un servicio de limpieza profesional allí donde lo necesites.</p>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
            Objetivos
          </button>
        </h2>
        <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
          <div class="accordion-body ">
                     <img src="/src/assets/img/logocarta.png" class="img-fluid" style="width: 90px; " alt="">
<p class="text-start mt-2"> <strong>Por qué se nos recomienda.</strong> Nuestra misión es ofrecer limpieza de cristales y fachadas con resultados impecables y sin complicaciones.
Trabajamos con los más altos estándares de calidad y seguridad para que tengas la tranquilidad de contar con profesionales de confianza.</p>
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
            Materiales de primera
          </button>
        </h2>
        <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
          <div class="accordion-body">
          <img src="/src/assets/img/materiales.png" class="img-fluid m-2" style="width: 90px; " alt="">

           <p class="text-start mt-2"><strong>Materiales y tecnología de vanguardia.</strong>
En Royal Clean trabajamos exclusivamente con materiales de la más alta calidad y lo último en tecnología de limpieza profesional. Utilizamos herramientas de la marca Unger, reconocida internacionalmente por su durabilidad, precisión y eficiencia.
Nuestros equipos incluyen sistemas de limpieza con pértigas telescópicas, paños de microfibra de alto rendimiento y sistemas de agua pura, que garantizan resultados impecables sin dañar superficies.
Además, empleamos productos de limpieza seguros, eficaces y respetuosos con el medio ambiente, seleccionados para ofrecer la máxima higiene y brillo en cada trabajo.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="section3 "> </div>


    <!-- Servicios-->
    <div class="texto-principal-servicios" id="texto-principal">
      <div class="titulo-descripcion align-self-start">
        <h1 class="imagen-descripcion display-4" id="scrollspyHeading3">SERVICIOS</h1>
      </div>
      <div class="ofrecerte ">
      </div>
      <div class="row row-cols-1 row-cols-md-2 g-4">
        <div class="col ">
          <div class="card h-100 bg-dark bg-gray-600">
            <img src="../assets/img/cristales.jpg" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title subtitulo-grande1">Negocios</h5>
              <div>
                <p class="card-text text-light fs-6">Mantener tu negocio limpio y ordenado es clave para transmitir confianza a tus clientes. 
                  Nos especializamos en la limpieza de tiendas, cafeterías, consultorios y pequeños locales comerciales.
                   Utilizamos productos seguros y técnicas eficientes para que tu espacio luzca siempre impecable, sin interrumpir tu actividad diaria.</p>
                <div>
                  
                   <!-- <a class="w-100 btn btn-lg btn-dark btn4 bg-primary" href="#scrollspyHeading1">Solicitar ahora</a>-->
                  <router-link
            to="/contacto"
            class="w-100 btn btn-lg btn-primary text-black fw-bold "
            id="boton-session" >
            Solicitar ahora
          </router-link>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card h-100 bg-dark bg-gray-900">
            <img src="../assets/img/hogares.jpg" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title subtitulo-grande2">Hogares</h5>
              <div>
                <p class="card-text text-light fs-6">Nada como llegar a un hogar limpio y fresco. 
                  Nos encargamos de la limpieza completa de casas y pisos, desde la limpieza general hasta el cuidado de detalles como cristales, 
                  cocinas, baños y zonas exteriores. 
                  Nos adaptamos a limpiezas puntuales o mantenimientos regulares, siempre con la máxima dedicación y esfuerzo.</p>
                <div>
                  
                    <router-link
            to="/contacto"
            class="w-100 btn btn-lg btn-info text-black fw-bold "
            id="boton-session" >
            Solicitar ahora
          </router-link>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card h-100 bg-dark bg-gray-900">
            <img src="../assets/img/locales.jpg" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title subtitulo-grande3">Empresas</h5>
              <div>
                <p class="card-text text-light fs-6">Sabemos que en los entornos corporativos y las grandes instalaciones, 
                  la limpieza es sinónimo de productividad y profesionalismo. 
                  Ofrecemos servicios de limpieza integral para oficinas, edificios, almacenes y plantas industriales,
                   con planes adaptados a la magnitud de cada proyecto y horarios flexibles para no afectar tus operaciones.</p>
                <div>
                  
                 
                           <router-link
            to="/contacto"
            class="w-100 btn btn-lg btn-secondary text-black fw-bold  "
            id="boton-session" >
            Solicitar ahora
          </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card h-100 bg-dark bg-gray-900">
            <img src="../assets/img/presion.jpg" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title subtitulo-grande4">Agua a presión</h5>
              <p class="card-text text-light fs-6">La suciedad difícil no es un problema para nosotros. 
                Nuestro servicio de limpieza con agua a presión elimina manchas, polvo y residuos en fachadas, terrazas, patios, aceras, 
                garajes y otras superficies exteriores.
                 Usamos equipos profesionales que garantizan resultados rápidos, efectivos y seguros para tus superficies.</p>
              <div>
                
           <router-link
            to="/contacto"
            class="w-100 btn btn-lg btn-warning text-black fw-bold"
            id="boton-session" >
            Solicitar ahora
          </router-link>
                
              </div>
            </div>
          </div>
        </div>
      </div>


      <section class="section2">
        <div class="container py-3">

          <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">

          </div>

          <div class="pricing-header p-3 pb-md-4 mx-auto text-center">
            <h1 class="display-4 fw-normal text-body-emphasis" id="scrollspyHeading4">Precios</h1>
            <p class="fs-5 text-body-secondary">Nuestros <small class="text-body-secondary fw-bold text-decoration-underline">precios son estimativos</small> y se ajustan en función de la complejidad, la cantidad de ventanas y otros factores específicos de cada trabajo.</p><p>
Todas nuestras tarifas incluyen los productos de limpieza y corresponden a un único servicio, garantizando calidad y transparencia en cada visita. <small class="text-body-secondary fw-bold text-decoration-underline">Los servicios se realizaran con presupuesto previo.</small></p>
          </div>



          <div class="row row-cols-1 row-cols-md-3 mb-3 text-center">
            <div class="col">
              <div class="card mb-4 rounded-3 shadow-sm">
                <div class="card-header py-3" >
                  <h4 class="my-0 fw-normal">Local Pequeño</h4>
                </div>
                <div class="card-body">
                  <h1 class="card-title pricing-card-title">A partir de €15<small class="text-body-secondary fw-light">/Limpieza</small>
                  </h1>
                  <img src="../assets/img/petitmagasinpng.png" class="card-img-top" style="width: 8rem;" alt="...">
                  <ul class="list-unstyled mt-3 mb-4">
                    <li>Limpieza de ventanas</li>
                    <li>Limpieza de puertas</li>
                    <li>Desinfección de cristales</li>
                    
                  </ul>
                   
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card mb-4 rounded-3 shadow-sm">
                <div class="card-header py-3">
                  <h4 class="my-0 fw-normal">Local Mediano</h4>
                </div>
                <div class="card-body">
                  <h1 class="card-title pricing-card-title">A partir de €22<small class="text-body-secondary fw-light">/Limpieza</small>
                  </h1>
                  <img src="../assets/img/magasinpng.png" class="card-img-top" style="width: 8rem;" alt="...">
                  <ul class="list-unstyled mt-3 mb-4">
                    <li>Limpieza de ventanas</li>
                    <li>Limpieza de puertas</li>
                    <li>Desinfección de cristales</li>
                  </ul>
                   
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card mb-4 rounded-3 shadow-sm">
                <div class="card-header py-3 ">
                  <h4 class="my-0 fw-normal">Local Grande</h4>
                </div>
                <div class="card-body">
                  <h1 class="card-title pricing-card-title">A partir de €30<small class="text-body-secondary fw-light">/Limpieza</small>
                  </h1>
                  <img src="../assets/img/grandmagasinpng.png" class="card-img-top" style="width: 8rem;" alt="...">
                  <ul class="list-unstyled mt-3 mb-4">
                    <li>Limpieza con pértiga</li>
                    <li>Limpieza de puertas</li>
                    <li>Desinfección de cristales</li>
                  </ul>
                   
                </div>
              </div>
            </div>
          </div>
          <div class="row row-cols-1 row-cols-md-3 mb-3 text-center">
            <div class="col">
              <div class="card mb-4 rounded-3 shadow-sm">
                <div class="card-header py-3">
                  <h4 class="my-0 fw-normal">Apartamentos</h4>
                </div>
                <div class="card-body">
                  <h1 class="card-title pricing-card-title">A partir de €50<small class="text-body-secondary fw-light">/Limpieza</small>
                  </h1>
                  <img src="../assets/img/appartements.png" class="card-img-top" style="width: 8rem;" alt="...">
                  <ul class="list-unstyled mt-3 mb-4">
                     <li>Limpieza de ventanas </li>
                    <li>Limpieza de balcones</li>
                    <li>Desinfección de cristales</li>
                  </ul>
                   
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card mb-4 rounded-3 shadow-sm">
                <div class="card-header py-3">
                  <h4 class="my-0 fw-normal">Chalet</h4>
                </div>
                <div class="card-body">
                  <h1 class="card-title pricing-card-title">A partir de €75<small class="text-body-secondary fw-light">/Limpieza</small>
                  </h1>
                  <img src="../assets/img/maisons.png" class="card-img-top" style="width: 8rem;" alt="...">
                  <ul class="list-unstyled mt-3 mb-4">
                    <li>Limpieza de ventanas</li>
                    <li>Limpieza de balcones</li>
                    <li>Limpieza de terrazas</li>
                    <li>Limpieza de barandillas</li>
                    <li>Desinfección de cristales</li>
                  </ul>
    
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card mb-4 rounded-3 shadow-sm ">
                <div class="card-header py-3 ">
                  <h4 class="my-0 fw-normal">Hotel</h4>
                </div>
                <div class="card-body">
                  <h1 class="card-title pricing-card-title">€4-9<small class="text-body-secondary fw-light">/Habitación</small>
                  </h1>
                  <img src="../assets/img/hotel.png" class="card-img-top" style="width: 8rem;" alt="...">
                  <ul class="list-unstyled mt-3 mb-4">
                    <li>Limpieza de ventanas</li>
                    <li>Limpieza de zonas comunes</li>
                    <li>Limpieza de terrazas</li>
                    <li>Limpieza de barandillas</li>
                    <li>Desinfección de cristales</li>
                  </ul>
                   
                </div>
              </div>
            </div>
          </div>
          




        </div>
      </section>
    </div>
    <!-- Finanal servicios-->
    <!--Final de contenedor-->
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from "../stores/user";
import { onMounted, ref, computed } from "vue";
import emailjs from "@emailjs/browser";
import { getAnalytics, logEvent } from "firebase/analytics";
import logoCoop from '../assets/img/logoCoop.png';
import creditWebp from '../assets/img/credit.webp';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { db, auth } from '../firebaseConfig'; 

const showCreditBanner = ref(true);
const fadeOutBanner = ref(false); 
// Preloader state
const showPreloader = ref(true);
const fadingOut = ref(false); // To keep preloader mounted during fade-out transition

// Existing form refs
const prenom = ref("");
const email = ref("");
const message = ref("");
const phone = ref("");

// Existing validation errors
const prenomError = ref("");
const emailError = ref("");
const phoneError = ref("");
const messageError = ref("");

const userStore = useUserStore();
const analytics = getAnalytics();
const isSubmitting = ref(false);

// --- Preloader Logic ---
onMounted(() => {
  setTimeout(() => {
    fadeOutBanner.value = true; // Inicia la animación de desvanecimiento
    setTimeout(() => {
      showCreditBanner.value = false; // Elimina completamente el banner del DOM después del fade-out
    }, 1000); // Coincide con la duración de la transición CSS
  }, 7000); 
    // Lógica para animar los iconos de ventajas al hacer scroll
  const advantageCards = document.querySelectorAll('.advantage-card');

  const observerOptions = {
    root: null, // Observa el viewport
    rootMargin: '0px',
    threshold: 0.5 // Dispara cuando el 50% del elemento es visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Si el elemento entra en la vista
        entry.target.classList.add('is-visible'); // Añade la clase para animar
        observer.unobserve(entry.target); // Deja de observar el elemento una vez que se ha animado
      }
    });
  }, observerOptions);

  // Observa cada tarjeta de ventaja
  advantageCards.forEach(card => {
    observer.observe(card);
  });
  // Hide preloader after a delay (e.g., 3 seconds)
  // In a real app, you might wait for actual data/image loading
  setTimeout(() => {
    fadingOut.value = true; // Start fade-out animation
    document.body.style.overflow = ''; // Re-enable scrolling

    // After the fade-out animation completes (e.g., 1s for transition)
    setTimeout(() => {
      showPreloader.value = false; // Completely remove preloader from DOM
      fadingOut.value = false; // Reset fade-out state
    }, 1000); // Should match CSS transition duration for .preloader-overlay.fade-out
  }, 3000); // Preloader visible for 3 seconds

  // Prevent scrolling while preloader is active
  document.body.style.overflow = 'hidden';

  // Your existing checkCookie logic
  checkCookie();
});

const scrollToCreditImpot = () => {
  const targetElement = document.getElementById('sectionCreditImpot');
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
    // Registramos un evento en Firebase Analytics cuando el banner es clicado
    logEvent(analytics, 'credit_banner_clicked', { action: 'scroll_to_section' });
  }
  // Opcional: Hacer que el banner desaparezca inmediatamente después de hacer clic
  fadeOutBanner.value = true;
  setTimeout(() => {
    showCreditBanner.value = false;
  }, 1000); // Coincide con la duración de la transición CSS
};
// --- Validation Functions ---
const validatePrenom = () => {
  prenomError.value = ""; // Clear previous error
  if (!prenom.value.trim()) {
    prenomError.value = "El nombre es obligatorio.";
    return false;
  }
  return true;
};

const validateEmail = () => {
  emailError.value = ""; // Clear previous error
  if (!email.value.trim()) {
    emailError.value = "Se requiere dirección de correo electrónico.";
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = "Por favor, introduce una dirección de correo electrónico válida.";
    return false;
  }
  return true;
};

const validatePhone = () => {
  phoneError.value = ""; // Clear previous error
  if (!phone.value.trim()) {
    phoneError.value = "Se requiere el número de teléfono.";
    return false;
  }
  // This regex allows digits, spaces, hyphens, and parentheses
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  if (!phoneRegex.test(phone.value)) {
    phoneError.value = "Ingrese un número de teléfono válido.";
    return false;
  }
  // Optional: Check minimum length after stripping non-digits
  if (phone.value.trim().replace(/[\s\-\(\)]/g, '').length < 9) {
    phoneError.value = "El número de teléfono debe contener al menos 9 dígitos.";
    return false;
  }
  return true;
};

const validateMessage = () => {
  messageError.value = ""; // Clear previous error
  if (!message.value.trim()) {
    messageError.value = "El mensaje es obligatorio.";
    return false;
  }
  if (message.value.trim().length < 10) {
    messageError.value = "El mensaje debe contener al menos 10 caracteres.";
    return false;
  }
  return true;
};

// --- Overall Form Validation (used before submission) ---
const validateForm = () => {
  userStore.mensaje = ''; // Clear general message before re-validating
  userStore.timeOut = false; // Reset timeout for general messages

  const isPrenomValid = validatePrenom();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isMessageValid = validateMessage();

  return isPrenomValid && isEmailValid && isPhoneValid && isMessageValid;
};

// Computed property to determine if the form is generally valid for button enabling
const isFormValid = computed(() => {
  // Check if all fields have content AND no specific field errors
  return prenom.value.trim() !== '' && !prenomError.value &&
         email.value.trim() !== '' && !emailError.value &&
         phone.value.trim() !== '' && !phoneError.value &&
         message.value.trim() !== '' && !messageError.value;
});

// --- Send Message Function (modified to integrate validation) ---
const enviarMensaje = async () => {
  if (isSubmitting.value) return;

  const formIsValid = validateForm();
  if (!formIsValid) {
    userStore.mensajeAlerta("Corrija cualquier error en el formulario antes de enviarlo.");
    // ... logEvent existente ...
    return;
  }

  isSubmitting.value = true;

  try {
    const contactParams = {
      prenom: prenom.value,
      email: email.value,
      message: message.value,
      phone: phone.value,
    };

    // 1. Envía el email (tu lógica existente)
    await emailjs.send(
      "service_iytm8yl",
      "template_7yngfsa",
      contactParams,
      "IF1Sn503DHVPja4II"
    );

    // 2. Guarda el mensaje en Firestore
    await addDoc(collection(db, "mensajes"), {
      prenom: prenom.value,
      email: email.value,
      message: message.value,
      phone: phone.value,
      timestamp: serverTimestamp(), // Guarda la fecha y hora del servidor
      read: false // Por defecto, el mensaje está "no leído"
    });

    // Éxito: Limpiar campos y mostrar mensaje
    prenom.value = "";
    email.value = "";
    message.value = "";
    phone.value = "";
    prenomError.value = "";
    emailError.value = "";
    phoneError.value = "";
    messageError.value = "";

    userStore.mensajeAlerta("¡Bien hecho! El mensaje se envió correctamente.");
    // ... logEvent existente ...

  } catch (error: any) {
    console.error("Error al enviar mensaje o guardar en Firestore:", error);
    userStore.mensajeAlerta("¡Ups! Hubo un problema al enviar el mensaje.");
    // ... logEvent existente ...
  } finally {
    isSubmitting.value = false;
  }
};

function closeBanner() {
  userStore.isActive = true;
  logEvent(analytics, 'cookie_banner_closed', { action: 'dismiss' });
}

function checkCookie() {
  var check = getCookie("cookieConsent-ANALYTICS");
  if (check !== "") {
    userStore.cookie = true;
  }
  // Corrected condition: getCookie returns a string, 'false' is a string
  else if (check === "false") {
    document.cookie = "cookieConsent-ANALYTICS" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  } else {
    userStore.cookie = false;
  }
}

function setCookie(cname: string, cvalue: boolean, exdays: number) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires + "; Path=/; Secure; SameSite=Lax";
  userStore.isActive = true;
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted",
    });
  }
  logEvent(analytics, 'cookie_banner_accepted', {
    consent_type: cname,
    value: cvalue
  });
}

function refuseCookie(cname: string, cvalue: boolean, exdays: number) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires + "; Path=/; Secure; SameSite=Lax";
  userStore.isActive = true;
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: "denied",
    });
  }
  logEvent(analytics, 'cookie_banner_refused', {
    consent_type: cname,
    value: cvalue
  });
}

function getCookie(cname: string): string {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
}
</script>

<style scoped>
.intro{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#fff;transition:opacity 1s ease-out,visibility 1s ease-out;z-index:1000;position:fixed;top:0;left:0;right:0;bottom:0}
.intro img{width:220px;animation:fadeIn 2s ease-in-out;z-index:2;position:relative}
.waves{position:absolute;bottom:0;width:100%;height:120px;overflow:hidden;line-height:0;z-index:1}
.waves svg{position:relative;display:block;width:200%;height:120px;animation:waveMove 8s linear infinite}
.wave1{fill:#4a7bd4;opacity:.6}
.wave2{fill:#6fa5f4;opacity:.5;animation-delay:-2s}
.wave3{fill:#4a7bd4;opacity:.3;animation-delay:-4s}
@keyframes fadeIn{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}
@keyframes waveMove{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.content{opacity:0;transition:opacity 1s ease-in}
.content.show{opacity:1}

  #app {
    max-width: 98%;
    margin: auto;
  }

  .underlineSVG::before {
    content: '';
    position: absolute;
    bottom: -0.125rem;
    left: -0.5rem;
    right: -0.5rem;
    height: 0.75rem;
    z-index: -1;
    background-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/664131/underline.svg');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .intro {
    background-color: white;
    top: -134vh;
    width: 100vw;
    position: fixed;
    height: 110vh;
    z-index: 3;
  }

  .logo-parts {
    font-size: 4rem;
    position: relative;
    display: inline-block;
    opacity: 0;
  }

  logo-parts.active {
    transition: ease-in-out .5s;
    opacity: 1;


  }

  logo-parts.fade {
    transition: ease-in-out .5s;
    bottom: 250px;
    opacity: 0;
    transition: ease-in-out .5s;

  }

  .cartaPrecio {
    background-color: #151515;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    border-radius: 5%;
  }

  ul li {
    font-size: 1.3rem;
  }

  .iconoPrix {
    width: 9rem;
  }

  .formulario {

    background-color: #151515;
    margin-bottom: 0px;
    margin-right: 20px;
    margin-left: 20px;
  }

  .landigParragraf {
    font-size: 1.6rem;
  }

  .textAnimation {
    background: rgb(33, 44, 171);
    background: linear-gradient(90deg,
        rgb(51, 49, 176) 0%,
        rgb(33, 18, 145) 51%,
        rgb(30, 5, 156) 100%);
    background-size: auto auto;
    background-clip: border-box;
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: textclip 4s linear infinite;
    display: inline-block;
  }

  .bg-image {
    background-color: #ffffff;
    border-radius: 15px;
  }

  .cookies {
    font-size: 15px;
    color: white;
  }

  .cookie-disclaimer {
    background: #151515;
    color: #151515;
    width: 100%;
    bottom: 0px;
    left: 0;
    z-index: 3;
    height: auto;
    position: fixed;
    padding: 20px;
  }

  .cookie-disclaimer .container {
    padding-top: 0px;
    padding-bottom: 20px;
  }

  .cookie-disclaimer .cookie-close {
    float: right;
    padding: 10px;
    cursor: pointer;
  }

  .tiempo2 {
    color: #b7b335;
    font-size: 2rem;
  }

  .imagen {
    border-radius: 20px;
    clip-path: polygon(20% 0%, 100% 0, 100% 100%, 9% 100%);
  }

  .imagenPartiesCommunes {
    max-width: 27em;
    width: -webkit-fill-available;
  }

  .imagenPartiesCommunes2 {
    max-width: 21em;
    width: -webkit-fill-available;
  }

  .imagen2 {
    border-radius: 20px;
    clip-path: polygon(0 0, 100% 0, 93% 100%, 0 100%);

  }

  .imagen6 {
    border-radius: 20px;
    max-height: 32rem;
    clip-path: polygon(0 0, 100% 0, 93% 100%, 0 100%);

  }

  .imagen3 {
    border-radius: 50px;
    max-width: 37rem;
    height: auto;
  }

  .imagen4 {
    border-radius: 20px;
    max-width: 13rem;
    height: auto;
  }

  .carta {
    border-radius: 20px;
    margin: 1rem 0rem 1rem 0rem;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    background-color: #d8d8da;
  }

  /* .carta1 {
  background: rgb(0, 0, 0);
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 1) 41%,
    rgba(31, 31, 2, 1) 100%
  );
}
.carta2 {
  background: rgb(0, 0, 0);
  background: linear-gradient(90deg, rgba(0, 0, 0, 1) 41%, rgb(2, 25, 31) 100%);
}
.carta3 {
  background: rgb(0, 0, 0);
  background: linear-gradient(90deg, rgba(0, 0, 0, 1) 41%, rgb(7, 31, 2) 100%);
}
.carta4 {
  background: rgb(0, 0, 0);
  background: linear-gradient(90deg, rgba(0, 0, 0, 1) 41%, rgb(31, 20, 2) 100%);
} */
  .seccion2 {
    background-color: #151515;
  }


  .principal {
    background: url("../assets/img/bannerssss.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-attachment: local;

  }

  .texto-principal-nosotros {
    flex-direction: column;
    padding: 0px 20px 0px 20px;
    background-color: #fff;
    background-size: contain;
    height: 580px;
    display: flex;
    /*align-items: center; */
    margin: 15px 15px 0px 15px;
    border-radius: 15px 15px 0px 0px;
    font-family: 'Raleway', sans-serif;
    height: auto;
    font-size: 20px;
    text-align: justify;
  }

  .imagen-nosotros {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-attachment: local;
    border-radius: 15px;
    height: auto;
  }

  .imagen-descripcion {

    display: flex;
    /*flex: content;*/
    text-align: left;
    margin-top: 10px;
    height: 43px;
  }

  .ofrecerte-imagen {
    width: 40px;
    height: 40px;

  }


  h1 {
    /*background: #151515;*/

    font-family: 'Anton', sans-serif;
    color: #151515;
    font-weight: 400;
    text-align: left;
    line-height: 1, 6;
    font-size: 21px;

    padding: 8px;

  }

  .section2 {
    display: flex;
    padding: 0px;
    /*background:white;*/
    margin: 0px 0px 0px 0px;
    border-radius: 0px 0px 15px 15px;
    /* padding: 0px 20px 0px 20px; */
  }

  .section2-nosotros {
    display: flex;
    padding: 20px;
    background: white;
    margin: 0px 15px 0px 15px;
    border-radius: 0px 0px 0px 0px;
    /* padding: 0px 20px 0px 20px; */
  }

  .section3 {
    background: white;
    /*background-image: url('../assets/img/nuestros_clientes.jpg');*/
    padding: 20px;
    border-radius: 0px 0px 15px 15px;
    /* padding: 0px 20px 0px 20px; */
    margin: 0px 15px 15px 15px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: local;
    height: auto;
  }

  .section3 img {
    flex: auto;

  }



  .div-profesional {
    background: none;
    display: block;
    flex: 1 1 50%;
    padding: 0px;

  }

  #titulo-profesional {
    text-transform: uppercase;
    /*letter-spacing: -1px;*/
    color: #151515;
    font-size: x-large;
    font-weight: 400;
    text-align: left;
    font-size: 35px;
    padding: 0px;
    margin: 0px;

  }

  /* .linea-vertical{
                    border-left: 1px solid #151515;
                    height: 100px;
                    align-self:center ;
                    
                }*/

  .titulo-profesional2 {
    letter-spacing: 1px;
    color: #151515;
    font-weight: 100;
    text-align: left;
    font-size: 29px;
    padding: 10px 30px 10px 10px;
    margin: 0px;
    border-right-style: double;

  }

  .parrafogratuito {
    font-family: 'Raleway', sans-serif;
    color: #151515;
    padding: 10px;
    text-align: justify;
    font-size: 20px;
    margin: 0px;
  }

  .icono {
    width: 30px;
    height: 30px;
    align-items: center;
    /* margin-left: 20px;*/
  }

  .gratuito-verde {
    color: #4970B6;

  }

  .gratuito-verde a {
    text-decoration: none;
    color: #4970B6;

  }

  .gratuito-verde a:hover {
    text-decoration: none;
    color: #838383;

  }

  .div-enlace-presupuesto {
    background: none;
    display: block;
    flex: 1 1 50%;







  }


  .titulo-descripcion {
    align-content: left;
    display: flex;
  }

  .titulo-descripcion img {
    object-fit: fill;
  }

  .section {
    background: #151515;
    display: flex;
    padding: 0px 15px 15px 15px;



  }



  .section img {
    width: 500px;
    height: 300px;
    display: flex;
  }

  .articulos {
    background: white;
    flex: 2 1 auto;
    display: flex;
    flex-flow: row wrap;
    border-radius: 5px 0px 0px 5px;
  }

  .article {
    background: rgb(255, 255, 255);
    flex: 1 1 40%;
    /*flex-wrap:wrap;*/
    padding: 10px;
    font-size: 13px;
    letter-spacing: 1px;
    border-radius: 5px 0px 0px 5px;

  }

  .article img {
    width: 100%;
  }

  h3 {
    color: #fff;
    font-size: 13px;
    padding: 10px 0 0 10px;
    margin-top: -100px;

  }

  h2 {
    color: #fff;
    font-size: 25px;
    padding: 0px 0 10px 10px;
    text-transform: uppercase;
    font-family: 'Raleway', sans-serif;
    font-weight: 600;


  }

  .navegacion {
    background: aliceblue;
    flex: 1 1 100%;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    border-radius: 0 0 0 5px;
  }

  .navegacion a {
    color: #151515;
  }

  .navegacion a:hover {
    color: #4970B6;
  }

  .aside {
    background: white;
    flex: 1 1 40%;
    padding: 15px;
    border-radius: 0 5px 5px 0;

  }

  .aside img {
    flex: 1 1 auto;
    /*width:100%;*/
    padding: 10px 0 0px 0px;
  }

  .publicidad {
    background: white;

  }

  /*SERVICIOS*/
  .texto-principal-servicios {
    display: flex;
    flex-direction: column;
    padding: 0px 20px 0px 20px;
    background-color: #fff;
    background-size: contain;
    height: 280px;
    align-items: center;
    /* Centra horizontalmente los ítems */
    justify-content: center;
    /* Centra verticalmente si hay altura */
    text-align: left;
    margin: 15px 15px 15px 15px;
    border-radius: 15px 15px 15px 15px;
    font-family: 'Raleway', sans-serif;
    height: auto;
    font-size: 20px;
  }

  .ofrecerte {
    display: flex;
    border-radius: 5px;
    padding: 20px;
    margin-top: 30px;
    color: #4970B6;
    font-weight: 600;
    font-style: italic;
    font-size: 18px;

  }

  .contenedor-servicios {
    display: flex;
    flex-direction: row;
    font-family: 'Raleway', sans-serif;
    flex-wrap: wrap;


    background-color: #151515;
    color: #fff;
    border-radius: 15px;
    padding: 5px;
    margin-top: 40px;
    width: 50%;
    align-self: center;
    align-items: center;
    /* Centra horizontalmente los ítems */
    justify-content: center;
    /* Centra verticalmente si hay altura */
    text-align: justify;
  }

  .imagen-servicios {
    display: flex;
    max-width: 100%;
    border-radius: 15px;
    max-height: 100%;
    height: auto;
    size: cover;
    text-align: left;
  }

  .subtitulo-medio {
    display: flex;
    font-size: 40px;
    margin: 20px;

  }

  .subtitulo-grande1 {
    display: flex;
    max-width: 100%;
    font-weight: 700;
    font-size: 70px;
    margin: 0px 20px 20px 20px;
    color: #4DABED;
    line-height: 90%;
  }

  .subtitulo-grande2 {
    max-width: 100%;
    font-weight: 700;
    font-size: 70px;
    margin: 0px 0px 0px 0px;
    color: #DCEFFE;
    line-height: 90%;
    display: flex;
  }

  .subtitulo-grande3 {
    max-width: 100%;
    font-weight: 700;
    font-size: 70px;
    margin: 0px 0px 0px 0px;
    color: #BABABA;
    line-height: 90%;
    display: flex;
  }

  .subtitulo-grande4 {
    max-width: 100%;
    font-weight: 700;
    font-size: 70px;
    margin: 0px 0px 0px 0px;
    color: #F7F000;
    line-height: 90%;
    display: flex;
  }

  .descripcion-servicio-texto {
    display: flex;

    flex-wrap: nowrap;
    text-align: justify;
    float: right;
    margin: 14px 0px 0px 20px;
  }

  .contenedor-titulos {
    display: flex;
    flex: 2 1 auto;
    font-family: 'Roboto Condensed', sans-serif;


  }

  .btn1 {

    background-color: #4DABED;
    border-radius: 15px;
    color: #151515;
    transition: all 0.5s;
    cursor: pointer;
    border: none;
    text-align: center;
    padding: 5px 10px 5px 10px;
    font-weight: 600;
    float: right;

  }

  .btn2 {
    background-color: #DCEFFE;
    border-radius: 15px;
    color: #151515;
    transition: all 0.5s;
    cursor: pointer;
    border: none;
    text-align: center;
    padding: 5px 10px 5px 10px;
    font-weight: 600;
    float: right;
  }

  .btn3 {
    background-color: #BABABA;
    border-radius: 15px;
    color: #151515;
    transition: all 0.5s;
    cursor: pointer;
    border: none;
    text-align: center;
    padding: 5px 10px 5px 10px;
    font-weight: 600;
    float: right;
  }

  .btn4 {
    background-color: #F7F000;
    border-radius: 15px;
    color: #151515;
    transition: all 0.5s;
    cursor: pointer;
    border: none;
    text-align: center;
    padding: 5px 10px 5px 10px;
    font-weight: 600;
    float: right;
  }

  .btn1:hover {
    background-color: #367bac;
    transition: all 0.4s;
  }

  .btn2:hover {
    background-color: #aab8c4;
    transition: all 0.4s;
  }

  .btn3:hover {
    background-color: #858484;
    transition: all 0.4s;
  }

  .btn4:hover {
    background-color: #c5bf00;
    transition: all 0.4s;
  }

  .gota {
    display: block;
    margin: auto;

  }

  .imagen-gota {
    margin-top: 40px;
  }

  .contenedor-servicios {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    box-sizing: border-box;
  }

  .contener-imagen-servicios {
    width: 100%;
    align-self: flex-start;
    margin-bottom: 20px;
  }

  .contener-imagen-servicios img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
  }

  .contenedor-titulos {
    margin-bottom: 15px;
  }

  .subtitulo-medio {
    font-size: 18px;
    margin: 0;
  }

  .subtitulo-grande1,
  .subtitulo-grande2,
  .subtitulo-grande3,
  .subtitulo-grande4 {
    font-size: 24px;
    font-weight: bold;
    margin: 5px 0;
  }

  .descripcion-servicio-texto {
    margin: 10px 0;
    max-width: 500px;
  }

  .contenedor-boton {
    margin-top: 15px;
  }

  .btn1,
  .btn2,
  .btn3,
  .btn4 {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .btn1:hover,
  .btn2:hover,
  .btn3:hover,
  .btn4:hover {
    background-color: #0056b3;
  }




  /*End footer */

  @keyframes slidein {
    from {
      margin-left: 0%;
    }

    to {
      margin-left: -10%;
    }
  }

  @keyframes textclip {
    to {
      background-position: 200% center;
    }
  }

  @media (max-width: 768px) {
    .imagen {
      border-radius: 20px 20px 0px 0px;
      clip-path: none;
    }

    .imagen2 {
      border-radius: 20px 20px 0px 0px;
      clip-path: none;
    }

    .imagen6 {
      border-radius: 20px;
      clip-path: none;
    }

    .section {
      background-color: #ffffff;
      background-repeat: round;
      background-size: contain;

    }
    .prof{
      color: #fff;

    }
  }
</style>