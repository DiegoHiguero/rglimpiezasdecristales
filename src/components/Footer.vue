<template>
  <footer class="row mt-3" style="  background-color: #323131;">
    <div class="d-flex justify-content-evenly col-md-9 pt-2 legal">
      <ul class="row d-flex justify-content-evenly col-md-9 p-2 ">
        <li class="col-md-6 text-center">
          <router-link to="/confidentialite"  
                >Politica de cookies y de privacidad
              </router-link>
        </li>
        <li class="col-md-6 text-center">
          <router-link to="/mentionslegales"  
                >Avisos legales
              </router-link>
        </li>
      </ul>
    </div>
    <div class="d-flex  justify-content-evenly align-items-end text-center col-md-3 p-2 brandsContainer">
      <p class="text-white "><font-awesome-icon :icon="['fab', 'instagram']" size="lg" class="brands"  /></p>
      <p class="text-white "><font-awesome-icon :icon="['fab', 'twitter']" size="lg" class="brands" /></p>
      <p class="text-white "><font-awesome-icon :icon="['fab', 'facebook-f']" size="lg" class="brands" /></p>
      <p class="text-white "><font-awesome-icon :icon="['fab', 'linkedin-in']" size="lg" class="brands"  /></p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>

a{
  text-decoration: none;
  color: white;
  background-color: #4b8355;
}
.legal {
  background-color: #4b8355;
  border-radius: 15px 15px 0px 0px;
}
li{
  background-color: #4b8355;
}
a:hover{
  color: #f24e29;
  font-size: 1rem;
}
footer {
  background-color: #000000;
}
.brands {
    color: #5AB36A;
  }
  .brandsContainer{
    background-color: #323131;
  }
@media (max-width: 768px) {
  .brands {
    color: #323131;
  }
  .brandsContainer{
    background-color: #4b8355;
  }
  }
</style>