<template>
  <div class="mpc-wrap">
    <div class="mpc-header">
      <span class="mpc-label">Panel Admin</span>
      <h1 class="mpc-title">Mapa de <span class="mpc-accent">Clientes</span></h1>
    </div>
    <Mapa />
  </div>
</template>

<script setup>
import Mapa from '../components/Mapa.vue';
</script>

<style scoped>
.mpc-wrap {
  background: #080d1a;
  min-height: 100vh;
}
.mpc-header {
  padding: 36px 24px 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.mpc-label {
  display: inline-block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #60a5fa;
  background: rgba(96,165,250,0.1);
  border: 1px solid rgba(96,165,250,0.2);
  border-radius: 20px;
  padding: 3px 14px;
  margin-bottom: 10px;
}
.mpc-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: #f1f5f9; margin: 0; line-height: 1.1; }
.mpc-accent { color: #60a5fa; }

@media (max-width: 480px) {
  .mpc-header { padding: 24px 12px 16px; }
}
</style>
