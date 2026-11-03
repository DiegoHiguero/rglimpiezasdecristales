<template>
  <div class="gv-page">

    <div class="gv-header">
      <div>
        <span class="gv-label">Panel Admin</span>
        <h1 class="gv-title">Gestión de <span class="gv-accent">Gastos</span></h1>
      </div>
    </div>

    <GastosTable />

  </div>
</template>

<script setup>
import GastosTable from '../components/GastosTable.vue'
</script>

<style scoped>
.gv-page {
  background: #080d1a;
  min-height: 100vh;
  padding: 36px 24px 60px;
}

.gv-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
}

.gv-label {
  display: block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #334155;
  margin-bottom: 4px;
}

.gv-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  color: #e2e8f0;
  margin: 0;
  line-height: 1.1;
}

.gv-accent {
  color: #60a5fa;
}
</style>
