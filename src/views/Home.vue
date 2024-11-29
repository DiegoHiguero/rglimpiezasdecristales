<template>
  <div class="">
    <div class="cookie-disclaimer col-12" v-show="!userStore.isActive" v-if="!userStore.cookie">
      <div class="cookie-close accept-cookie" @click="closeBanner()">
        <i class="fa fa-times"></i>
      </div>
      <div class="row">
        <h4 class="text-white">Paramètres de confidentialité</h4>
        <p class="cookies">
          Pour vous offrir la meilleure expérience possible, nous utilisons des
          cookies et des technologies similaires. Certains cookies sont
          nécessaires au fonctionnement de notre site Internet et ne peuvent
          être refusés. Vous pouvez accepter ou refuser l'utilisation de cookies
          supplémentaires, que nous utilisons uniquement pour améliorer votre
          expérience. Aucune de ces données ne sera jamais vendue ou utilisée à
          des fins de marketing. Pour en savoir plus, lisez la politique de
          confidentialité. Vous pouvez personnaliser vos paramètres à tout
          moment en vous rendant sur la page des Règles de confidentialité.
        </p>
        <div class="d-flex justify-content-start">
          <button type="button" @click="setCookie('cookieConsent-ANALYTICS', true, 2)"
            class="me-2 btn btn-secondary accept-cookie d-inline">
            Acepter
          </button>
          <button type="button" @click="refuseCookie('cookieConsent-ANALYTICS', false, 2)"
            class="me-2 btn btn-secondary accept-cookie d-inline">
            Refuser
          </button>
        </div>
      </div>
    </div>
    <section class="row d-flex justify-content-center py-3 my-2 bg-image">
      <div class="row col-md-6 m-2 p-2">
        <h1 class="display-2 mx-2 px-2 mt-4 pt-4">
          Profesionales en Limpieza de Cristales <span class="textAnimation">Con más de 8 años de experiencia en el sector!</span> 
        </h1>
        <h1 class="m-3 p-2">
          <span style="color: #26873a; font-weight: bold">RG Limpieza de cristales </span> est
          un service de nettoyage des vitres pour les particuliers et
          professionnels.
        </h1>
      </div>
      <div class="row col-md-6 pt-2 d-flex justify-content-center mt-4"
        style="background-color: transparent; z-index: 2">
        <div class="col-lg-8 col-10 mt-4 p-4 pt-1 p-lg-8 formulario" style="border-radius: 0.75rem">
          <form @submit.prevent="handleSubmit" class="mt-4 row g-3">
            <div class="row mt-3 d-lg-flex col-12 justify-content-around">
              <h2 class="text-center text-white">
                Demandez un devis gratuit !
              </h2>
              <!-- <div class="col-md-5 d-flex justify-content-center row">
                        <font-awesome-icon
                          :icon="['fas', 'phone']"
                          class="me-2 text-white text-center mb-3 icon fa-xl"
                        />
                        <p class="text-white text-center">+33 658 80 24 03</p>
                      </div>
                      <div class="col-md-5 d-flex justify-content-center row">
                        <font-awesome-icon
                          :icon="['fas', 'envelope']"
                          class="me-2 text-white text-center mb-3 icon fa-xl"
                        />
                        <p class="text-white text-center">toucanet64@gmail.com</p>
                      </div> -->
            </div>
            <div class="">
              <label for="validationServer01" class="col-sm-2 col-form-label text-white" required>Prénom</label>
              <input type="text" class="form-control" id="validationServer01" v-model="prenom" placeholder="Prenom"
                required />
              <!-- <div class="valid-feedback">
                            Looks good!
                          </div> -->
            </div>
            <div class="">
              <label for="exampleFormControlInput1" class="col-sm-2 col-form-label text-white" required>Email</label>
              <input type="email" class="form-control border-0" id="exampleFormControlInput1"
                placeholder="name@example.com" v-model.trim="email" />
            </div>
            <div class="">
              <label for="exampleFormControlInput2" class="col-sm-2 col-form-label text-white"
                required>Téléphone</label>
              <input type="phone" class="form-control border-0" id="exampleFormControlInput2" placeholder="votre numero"
                v-model.trim="phone" />
            </div>
            <div class="mb-3 mb-4">
              <label for="inputPassword" class="col-sm-2 col-form-label text-white" required>Message</label>
              <textarea class="form-control border-0" id="inputPassubjetsword" placeholder="Message" v-model="message"
                required></textarea>
            </div>
            <div class="text-center p-2 mt-2 alert alert-success" v-if="userStore.timeOut !== false">
              {{ userStore.mensaje }}
              <!-- <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> -->
            </div>
            <div class="d-grid">
              <button class="btn" style="
                  background-color: #1a5f28;
                  color: white;
                  font-weight: bold;
                " @click="enviarMensaje()">
                Confirmer
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
//setup expone los los datos

import { useUserStore } from "../stores/user";
import { onMounted } from "vue";
import { ref } from "vue";
import emailjs from "@emailjs/browser";

const prenom = ref("");
const email = ref("");
const message = ref("");
const phone = ref("");

const userStore = useUserStore();

const enviarMensaje = async () => {
  if ((!prenom.value, !email.value, !message.value, !phone.value)) {
    userStore.mensajeAlerta("Il faut remplir toutes les champs");
  } else {
    try {
      const contactParams = {
        prenom: prenom.value,
        email: email.value,
        message: message.value,
        phone: phone.value,
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
            (prenom.value = ""),
              (email.value = ""),
              (message.value = ""),
              (phone.value = ""),
              userStore.mensajeAlerta(
                "Bien joué! Le message a été bien envoyé"
              );
          },
          (error) => {
            userStore.mensajeAlerta("Ups! Il y a eu un probleme");
          }
        );
    } catch (error) {
      console.log(error);
    }
  }
};
function closeBanner() {
  userStore.isActive = true;
}
function checkCookie() {
  var check = getCookie("cookieConsent-ANALYTICS");
  if (check !== "") {
    return (userStore.cookie = true);
  }
  if (check === false) {
    document.cookie =
      "cookieConsent-ANALYTICS" +
      "=; Path=/; Domain=localhost; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  } else {
    return (userStore.cookie = false); //setCookie("acookie", "accepted", 365);
  }
}
checkCookie();

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
  userStore.isActive = true;
  gtag("consent", "update", {
    ad_storage: "granted",
    analytics_storage: "granted",
  });
}
function refuseCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
  userStore.isActive = true;
  gtag("consent", "update", {
    ad_storage: "denied",
    analytics_storage: "denied",
  });
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
}
getCookie("toucanet");
const logoSpan = document.querySelector('.logo-parts')
function animacion() {
  setTimeout(() => {
    logoSpan.forEach((span, index) => {
      setTimeout(() => {
        span.classList.add('active')
      }, (index + 1) * 100)
    })
  }, 2300)
}

// animacion(){
//   setTimeout(()=>{
//     logoSpan.forEach((span,index)=>{
//       setTimeout(()=>{
//         span.classList.add('active');
//       },(index + 1) * 100);
//     });
//     setTimeout(()=>{
//       logoSpan.forEach((span,index)=>{
//         setTimeout(()=>{
//           span.classList.remove('active');
//           span.classList.add('fade');
//         },(span + 1) * 50)
//       });
//     },2000);
//     setTimeout(()=>{
//       intro.style.top = '100vh';
//     },2300)
//   })
// };

</script>

<style>
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
  font-size: 3.6rem;
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

section {
  background-color: #ffffff;
}

.cartaPrecio {
  background-color: #404040;
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
  background-color: #2c2c2c;
}

.landigParragraf {
  font-size: 1.6rem;
}

.textAnimation {
  background: rgb(50, 52, 33);
  background: linear-gradient(90deg,
      rgb(141, 152, 110) 0%,
      rgb(88, 86, 28) 51%,
      rgb(163, 163, 116) 100%);
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
  border-radius: 15px ;
}

.cookies {
  font-size: 15px;
  color: white;
}

.cookie-disclaimer {
  background: #000000;
  color: black;
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

.tiempo {
  color: #1a5f28;
  font-weight: 600;
}

.lista{
    list-style-type: disc !important;
    padding-left:1em !important;
    margin-left:1em;
    color: #1a5f28;
    font-weight: 600;
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
  background-color: black;
}

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
    border-radius: 20px ;
    clip-path: none;
  }
}
</style>