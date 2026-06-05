<template>
  <Navbar v-if="!isAdminRoute" />
  <AdminSidebar v-if="isAdminRoute" />
  <div v-if="isAdminRoute" class="admin-wrap">
    <router-view v-if="!userStore.loadingSesion"></router-view>
    <div v-else class="d-flex justify-content-center align-items-center" style="height:60vh">
      <div class="spinner-grow text-primary" style="width:3rem;height:3rem" role="status"></div>
    </div>
  </div>
  <template v-else>
    <router-view v-if="!userStore.loadingSesion"></router-view>
    <div v-else class="d-flex justify-content-center">
      <div class="spinner-grow text-success" style="width: 4rem; height: 4rem" role="status">
        <span class="sr-only"></span>
      </div>
    </div>
    <Footer />
  </template>
  <CookieBanner />
</template>

<script setup>
import { computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import CookieBanner from "./components/CookieBanner.vue";
import AdminSidebar from "./components/AdminSidebar.vue";
import { useUserStore } from "./stores/user";
import { useSyncStore } from "./stores/syncStore";
import { useSheetsStore } from "./stores/sheetsStore";

const userStore   = useUserStore();
const syncStore   = useSyncStore();
const sheetsStore = useSheetsStore();
const route = useRoute();

const adminPaths = ['/dashboard', '/Register', '/registro', '/misClientes', '/misFacturas', '/gastos', '/sheet/', '/admin/'];
const isAdminRoute = computed(() => adminPaths.some(p => route.path === p || route.path.startsWith(p)));

watchEffect(() => {
  if (isAdminRoute.value) {
    document.body.classList.add('admin-mode');
  } else {
    document.body.classList.remove('admin-mode');
  }
});

// Auto-sync: starts when admin is logged in, stops otherwise
watchEffect(() => {
  if (isAdminRoute.value && userStore.userData?.uid && userStore.googleAccessToken) {
    sheetsStore.loadTabs();      // carga pestañas para el sidebar dinámico
    syncStore.startAutoSync(10); // every 10 minutes
  } else if (!isAdminRoute.value) {
    syncStore.stopAutoSync();
  }
});
</script>

<style>

body {
  font-size: 16px;
  text-rendering: optimizeLegibility;
  font-weight: initial;
  background-color: #151515;
  padding-top: 54px;
}

body.admin-mode {
  padding-top: 0 !important;
  background-color: #080d1a !important;
}

.admin-wrap {
  margin-left: 232px;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .admin-wrap { margin-left: 0; }
}


/*@font-face {
  font-family: "Baloo 2";
  src: local("Baloo 2"),
    url(./assets/Baloo_2/Baloo2-VariableFont_wght.ttf) format("truetype");
}*/
.zoom {
  transition: all 0.2s ease-in-out;
}
.zoom:hover {
  transform: scale(1.05);
}
</style>