<template>
  <footer class="row">
    <router-link to="/">
      <h4 class="text-white text-center py-4"> <img
              class="logo zoom navbar-brand-item d-inline h-40px h-md-60px"
              src="../assets/img/logorglimpiezas.png"
              alt="RG Limpieza de cristales logo"
            /></h4>
    </router-link>
    <div class="row text-center col-md-3 p-2">
      <p class="text-white">Roys Abreu</p>
    </div>
    <!-- <div class="row text-center col-md-3 p-2">
      <p class="text-white">Toucanet souscrit à une assurance de responsabilité civile professionelle.</p>
    </div>
    <div class="row text-center col-md-3 p-2">
      <p class="text-white">Mediateur de la consommation:</p>
      <p class="text-white">CM2C   cm2c.net</p>
      <p class="text-white">14 rue Saint-Jean</p>
      <p class="text-white">75017 Paris</p>
      <p class="text-white">06 09 20 48 86</p>
    </div> -->
    <div class="row text-center col-md-3 p-2">
      <ul>
        <li>
          <router-link to="/confidentialite"  
                >Politica de cookies y de privacidad
              </router-link>
        </li>
        <li>
          <router-link to="/mentionslegales"  
                >Aviso legal
              </router-link>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
</script>

<style>

a{
  text-decoration: none;
  color: white;
}
a:hover{
  color: #f24e29;
}
footer {
  background-color: #000000;
}
</style>