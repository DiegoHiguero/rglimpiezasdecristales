<template>
  <Navbar />
  <router-view v-if="!userStore.loadingSesion"></router-view>
  <div v-else class="d-flex justify-content-center">
    <div
      class="spinner-grow text-success"
      style="width: 4rem; height: 4rem"
      role="status"
    >
      <span class="sr-only"></span>
    </div>
  </div>
  <Footer />
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import { useUserStore } from "./stores/user";


export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      userStore: useUserStore(),
    };
  },
};
</script >

<style>

body {
  font-family: "Baloo 2", cursive;
  font-size: 16px;
  text-rendering: optimizeLegibility;
  font-weight: initial;
  background-color: #323131;

}
h1,
h2 {
  font-family: "Baloo 2";
}
p {
  font-family: "Baloo 2";
}
@font-face {
  font-family: "Baloo 2";
  src: local("Baloo 2"),
    url(./assets/Baloo_2/Baloo2-VariableFont_wght.ttf) format("truetype");
}
.zoom {
  transition: all 0.2s ease-in-out;
}
.zoom:hover {
  transform: scale(1.05);
}
</style>