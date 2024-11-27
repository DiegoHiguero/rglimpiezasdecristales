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
    <section class="intro row d-flex justify-content-center">
      <div class="text-center " style="margin-top: 8vh;">
        <img class="zoom navbar-brand-item d-inline mt-4 p-4" src="../assets/img/logorglimpiezas.png" alt="RGLImpiezasnpm logo"
          style="max-width: 250px" />
        <div class="row">
          <h1 class="text-center">
            <span class="logo-parts">T</span>
            <span class="logo-parts">O</span>
            <span class="logo-parts">U</span>
            <span class="logo-parts">C</span>
            <span class="logo-parts">A</span>
            <span class="logo-parts">N</span>
            <span class="logo-parts">E</span>
            <span class="logo-parts">T</span>
          </h1>
          <h2 class="text-center bold">Limpieza de cristales</h2>
        </div>
      </div>
    </section>
    <section class="row d-flex justify-content-center py-3 my-2 bg-image">
      <div class="row col-md-6 m-2 p-2">
        <h1 class="display-2 mx-2 px-2 mt-4 pt-4">
          Redonnez de <span class="textAnimation">l'éclat</span> à vos vitres !
        </h1>
        <h1 class="m-3 p-2">
          <span style="color: #26873a; font-weight: bold">Toucanet </span> est
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
    <section class="row d-flex justify-content-center py-3 my-2">
      <div class="row d-flex justify-content-center p-4 m-4">
        <div class="col-md-5 order-2 order-md-1 text-center">
          <img class="img-fluid imagen6 ml-4" src="../assets/img/unger3.png" alt="unger" />
        </div>
        <div class="col-md-6 order-1 order-md-2">
          <h2 class="m-4">Nettoyage avec eau pure <span class="badge bg-success">Nouveau</span></h2>
          <p class="m-4 pt-4">Avec le système de nettoyage à l'eau pure, les surfaces peuvent être nettoyées <span style=" font-style: italic; font-weight: bold">sans produits
            chimiques</span>, les salissures peuvent être éliminées rapidement et efficacement grâce à la puissance de
            nettoyage élevée de l'eau pure produite</p>
            <h3 class="m-4 underlineSVG">Applications</h3>
            <ul class="m-4">
              <li class="mt-4 pt-4 lista">Façades en Hauteur</li>
              <li class="lista">Vitres difficile accès</li>
              <li class="lista">Plaques solaires</li>
              <li class="lista">Vérandas</li>
            </ul>
        </div>
      </div>
      <h1 class="p-3 text-center">
        Nettoyage des vitres depuis <span class="textAnimation">15 ans</span>
      </h1>
      <div class="row d-flex justify-content-center p-4">
        <div class="carta carta4 row col-md-10 p-0 zoom">
          <div class="col-md-3 p-0">
            <img class="img-fluid imagen2" src="../assets/img/maisonbasque.jpg" alt="immeuble" />
          </div>
          <div class="col-md-9">
            <h3 class="p-3" style="font-weight: bold">
              Maison
            </h3>
            <p class="px-4 py-1 text-break">
              Nous comprenons l'importance de maintenir vos fenêtres propres et étincelantes,
              non seulement pour l'esthétique de votre maison, mais aussi pour <span
                style=" font-style: italic; font-weight: bold">votre bien-être et votre confort. </span>
              Avec notre équipe expérimentée et notre approche innovante,
              nous sommes là pour vous offrir des résultats impeccables à chaque fois.
            </p>
          </div>
        </div>
        <div class="carta carta3 row col-md-10 p-0 zoom">
          <div class="col-md-9 order-2 order-md-1">
            <h3 class="p-3" style="font-weight: bold">
              Immeubles
            </h3>
            <p class="px-4 py-1">
              Nous offrons un service de nettoyage de vitres complet pour votre
              maison, garantissant des
              <span style=" font-style: italic; font-weight: bold">résultats impeccables</span>
              et sans traces. Que vous ayez des fenêtres standard, des baies
              vitrées ou des lucarnes, nous sommes équipés pour les nettoyer
              avec soin.
            </p>
          </div>
          <div class="col-md-3 order-1 order-md-2 imagen p-0">
            <img class="img-fluid imagen" src="../assets/img/immeuble.jpg" alt="immeuble" />
          </div>
        </div>
        <div class="carta carta2 row col-md-10 p-0 zoom">
          <div class="col-md-3 p-0">
            <img class="img-fluid imagen2" src="../assets/img/vitrine.jpg" alt="immeuble" />
          </div>
          <div class="col-md-9">
            <h3 class="p-3" style=" font-weight: bold">
              Magasins
            </h3>
            <p class="px-4 py-1 text-break">
              Nos services s'adressent également aux entreprises de toutes
              tailles. Des bureaux aux magasins en passant par les immeubles de
              bureaux, nous assurons des vitres propres et transparentes pour
              une
              <span style=" font-style: italic; font-weight: bold">image professionnelle</span>
              de votre entreprise.
            </p>
          </div>
        </div>
        <div class="carta carta1 row col-md-10 p-0 zoom">
          <div class="col-md-9 order-2 order-md-1">
            <h3 class="p-3" style=" font-weight: bold">
              Verandas
            </h3>
            <p class="px-2 py-1">
              La véranda est devenue le choix de prédilection pour gagner de la
              superficie tout en ayant confort et
              <span style=" font-style: italic; font-weight: bold">luminosité.</span>
              Été comme hiver, une véranda vous offre une nouvelle pièce de vie
              lumineuse et agréable
            </p>
          </div>
          <div class="col-md-3 order-1 order-md-2 imagen p-0">
            <img class="img-fluid imagen" src="../assets/img/veranda1.png" alt="immeuble" />
          </div>
        </div>
      </div>
    </section>
    <section class="row d-flex justify-content-center p-2 m-2">
      <h1 class="p-3 text-center">
        Nos<span style="color: #51f772"> prix </span><font-awesome-icon :icon="['fas', 'hand-holding-dollar']"
          class="me-2 fa" style="color: #51f772" />
      </h1>
      <div class="row d-flex justify-content-center col-md-6 p-2 m-2">
        <h3 class="p-4 m-4">
          Nos <span style="color: #51f772">prix sont indicatifs.</span> Le
          nettoyage des vitres peut varier en fonction de la difficulté,
          quantité et d'autres facteurs.
        </h3>
        <h3 class="p-4 m-1">
          Les tarifs
          <span style="color: #51f772">incluent le prix des produits</span> et
          correspondent au prix facturé
          <span style="color: #51f772">d'une seule prestation.</span>
        </h3>
      </div>
      <div class="row d-flex justify-content-center p-4">
        <div class="cartaPrecio col-md-3 text-center p-4 m-4 zoom">
          <h1 class="mt-2" style="color: #35ba4f">Petit Magasins</h1>
          <img class="iconoPrix mb-4 navbar-brand-item d-inline h-40px h-md-60px"
            src="../assets/img/petitmagasinpng.png" alt="Toucanet logo" style="font-size: 4rem" />
          <h1 class="display-3 text-white">
            12<span style="font-size: 20px">€</span> - 25<span style="font-size: 20px">€</span>
          </h1>
          <ul class="text-white p-0">
            <li>Nettoyage vitrine</li>
            <li>Nettoyage porte</li>
          </ul>
        </div>
        <div class="cartaPrecio col-md-3 text-center p-4 m-4 zoom">
          <h1 class="mt-2" style="color: #35ba4f">Magasins</h1>
          <img class="iconoPrix mb-4 navbar-brand-item d-inline h-40px h-md-60px" src="../assets/img/magasinpng.png"
            alt="Toucanet logo" style="font-size: 4rem" />
          <h1 class="display-3 text-white">
            22<span style="font-size: 20px">€</span> - 45<span style="font-size: 20px">€</span>
          </h1>
          <ul class="text-white p-0">
            <li>Nettoyage plusiers vitrines</li>
            <li>Nettoyage porte</li>
          </ul>
        </div>
        <div class="cartaPrecio col-md-3 text-center p-4 m-4 zoom">
          <h1 class="mt-2" style="color: #35ba4f">Grand Magasins</h1>
          <img class="iconoPrix mb-4 navbar-brand-item d-inline h-40px h-md-60px"
            src="../assets/img/grandmagasinpng.png" alt="Toucanet logo" style="font-size: 4rem" />
          <h1 class="display-3 text-white">
            32<span style="font-size: 20px">€</span> - 59<span style="font-size: 20px">€</span>
          </h1>
          <ul class="text-white p-0">
            <li>Nettoyage vitrine avec perche</li>
            <li>Nettoyage porte</li>
          </ul>
        </div>
        <div class="cartaPrecio col-md-3 text-center p-4 m-4 zoom">
          <h1 class="mt-2" style="color: #35ba4f">Appartements</h1>
          <img class="iconoPrix mb-4 navbar-brand-item d-inline h-40px h-md-60px" src="../assets/img/appartements.png"
            alt="Toucanet logo" style="font-size: 4rem" />
          <h1 class="display-3 text-white">
            20<span style="font-size: 20px">€</span> - 45<span style="font-size: 20px">€</span>
          </h1>
          <ul class="text-white p-0">
            <li>Nettoyage fenêtres</li>
            <li>Nettoyage balcon</li>
          </ul>
        </div>
        <div class="cartaPrecio col-md-3 text-center p-4 m-4 zoom">
          <h1 class="mt-2" style="color: #35ba4f">Maisons</h1>
          <img class="iconoPrix mb-4 navbar-brand-item d-inline h-40px h-md-60px" src="../assets/img/maisons.png"
            alt="Toucanet logo" style="font-size: 4rem" />
          <h1 class="display-3 text-white">
            32<span style="font-size: 20px">€</span> - 78<span style="font-size: 20px">€</span>
          </h1>
          <ul class="text-white p-0">
            <li>Nettoyage fenêtres</li>
            <li>Nettoyage balcon</li>
            <li>Nettoyage verandas</li>
            <li>Nettoyage garde-corps</li>
          </ul>
        </div>
        <div class="cartaPrecio col-md-3 text-center p-4 m-4 zoom">
          <h1 class="mt-2" style="color: #35ba4f">Hôtel</h1>
          <img class="iconoPrix mb-4 navbar-brand-item d-inline h-40px h-md-60px" src="../assets/img/hotel.png"
            alt="Toucanet logo" style="font-size: 4rem" />
          <h1 class="display-3 text-white">
            4<span style="font-size: 20px">€</span> - 9<span style="font-size: 20px">€ / chambre</span>
          </h1>
          <ul class="text-white p-0">
            <li>Nettoyage fenêtres</li>
            <li>Nettoyage parties communes</li>
            <li>Nettoyage verandas</li>
            <li>Nettoyage garde-corps</li>
          </ul>
        </div>
      </div>
    </section>
    <section>
      <component is="script" src="https://widget.trustmary.com/AV90QDh7O" async></component>
    </section>
    <section class="row d-flex justify-content-center py-3 my-2">
      <div class="row d-flex justify-content-center">
        <div class="d-flex justify-content-center">
          <font-awesome-icon :icon="['fas', 'comments']" class="me-2 fa-2xl" style="color: #37b650" />
        </div>
        <h1 class="text-center p-4">Nous Contacter</h1>
        <h3 class="d-flex justify-content-center">
          Besoin de nous contacter ?
        </h3>
        <div class="d-flex justify-content-center mt-3">
          <router-link class="btn btn mx-auto" style="background-color: #37b650; color: white; font-weight: bold"
            to="/contacto">
            Oui !
          </router-link>
        </div>
      </div>
    </section>
    <section class="seccion2 row py-4">
      <h2 class="text-center text-white p-4">Pourquoi nous choisir</h2>
      <div class="col-md-12 d-flex justify-content-center text white py-4 row">
        <div class="col-md-3 p-4">
          <div class="py-3 text-center" style="color: #c1e531">
            <font-awesome-icon :icon="['fas', 'user-tie']" class="me-2 fa-2xl" />
          </div>
          <h4 class="text-white text-center pb-3">Professionnalisme</h4>
          <p class="text-white text-center">
            Notre équipe est composée de professionnels qualifiés et
            expérimentés qui sont formés pour traiter toutes sortes de vitres et
            de surfaces en verre.
          </p>
        </div>
        <div class="col-md-3 p-4">
          <div class="py-3 text-center" style="color: #315be5">
            <font-awesome-icon :icon="['fas', 'hand-sparkles']" class="me-2 fa-2xl" />
          </div>
          <h4 class="text-white text-center pb-3">Matériel de pointe</h4>
          <p class="text-white text-center">
            Nous utilisons des équipements et des produits de nettoyage de haute
            qualité pour obtenir des résultats optimaux sans endommager vos
            vitres.
          </p>
        </div>
        <div class="col-md-3 p-4">
          <div class="py-3 text-center" style="color: #31e552">
            <font-awesome-icon :icon="['fas', 'seedling']" class="me-2 fa-2xl" />
          </div>
          <h4 class="text-white text-center pb-3">
            Respect de l'environnement
          </h4>
          <p class="text-white text-center">
            Nous sommes soucieux de l'environnement et utilisons des produits
            respectueux de l'environnement dans la mesure du possible.
          </p>
        </div>
        <div class="col-md-3 p-4">
          <div class="py-3 text-center" style="color: #b831e5">
            <font-awesome-icon :icon="['fas', 'clock']" class="me-2 fa-2xl" />
          </div>
          <h4 class="text-white text-center pb-3">Flexibilité horaire</h4>
          <p class="text-white text-center">
            Nous sommes flexibles et pouvons nous adapter à vos horaires pour
            minimiser les interruptions dans vos activités quotidiennes.
          </p>
        </div>
      </div>
    </section>
    <section class="seccion2 row p-4">
      <h2 class="text-center text-white p-4">Notre propre savon</h2>
      <div class="col-md-6 d-flex justify-content-center">
        <img class="imagen3 img-fluid p-4" src="../assets/img/liquidevaiselle.jpg" alt="" />
      </div>
      <div class="col-md-6">
        <div class="row d-flex justify-content-between">
          <div class="col-md-8 mt-4 pt-2 mt-4">
            <h3 class="text-white p-1 mb-4">
              Savon <span style="color: #31e552">bio </span>
              <font-awesome-icon :icon="['fas', 'pump-soap']" class="me-2 fa-l" style="color: #31e552" />
            </h3>
            <p class="text-white">
              Apportez une touche de naturel à votre nettoyage et préservez
              l'éclat de vos vitres tout en
              <span style="color: #31e552; font-weight: bold">respectant l'environnement</span>
              . Optez dès maintenant pour notre savon bio pour vitres et
              redécouvrez la transparence cristalline de vos surfaces.
            </p>
          </div>
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
  background: rgb(227, 230, 176);
  background: linear-gradient(90deg,
      rgb(243, 244, 240) 0%,
      rgb(250, 244, 80) 51%,
      rgb(239, 240, 228) 100%);
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
  /* width: -webkit-fill-available;
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
  background-image: url("../assets/img/white-2563976_1280.jpg"); */
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