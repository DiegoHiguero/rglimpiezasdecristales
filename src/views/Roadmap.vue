<template>
  <div class="rmp-wrap">
    <div class="rmp-header">
      <span class="rmp-label">Panel Admin</span>
      <h1 class="rmp-title">Hoja de <span class="rmp-accent">Ruta</span></h1>
      <p class="rmp-sub">Pasos pendientes en la web y la app</p>
    </div>

    <RoadmapCard />
  </div>
</template>

<script setup>
import RoadmapCard from '../components/RoadmapCard.vue';
</script>

<style scoped>
.rmp-wrap {
  min-height: 100vh;
  background: #080d1a;
  padding: 36px 24px 60px;
  max-width: 1000px;
  margin: 0 auto;
}
.rmp-header { margin-bottom: 24px; }
.rmp-label {
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
.rmp-title {
  font-family: 'Anton', sans-serif;
  font-size: 2rem;
  color: #f1f5f9;
  margin: 0 0 6px;
  line-height: 1.1;
}
.rmp-accent { color: #60a5fa; }
.rmp-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #64748b;
  margin: 0;
}

@media (max-width: 480px) {
  .rmp-wrap { padding: 24px 12px 48px; }
}
</style>
