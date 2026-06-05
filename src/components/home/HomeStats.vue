<template>
  <div class="section3">
    <div class="row text-center g-0 stats-row">
      <div class="col-md-3 col-6 stat-item">
        <span class="stat-number">+10</span>
        <p class="stat-label">Años de experiencia</p>
      </div>
      <div class="col-md-3 col-6 stat-item">
        <span class="stat-number">+200</span>
        <p class="stat-label">Clientes satisfechos</p>
      </div>
      <div class="col-md-3 col-6 stat-item">
        <span class="stat-number">+500</span>
        <p class="stat-label">Trabajos realizados</p>
      </div>
      <div class="col-md-3 col-6 stat-item">
        <span class="stat-number">5★</span>
        <p class="stat-label">Valoración en Google</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.section3 {
  background: var(--white);
  margin: 12px 15px;
  padding: 4px 0;
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  overflow: hidden;
}
.stats-row { padding: 4px 0; }
.stat-item { padding: 22px 12px; }
.stat-number {
  display: block;
  font-family: 'Anton', sans-serif;
  font-size: 2.4rem;
  color: var(--blue);
  line-height: 1;
}
.stat-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 5px;
  margin-bottom: 0;
}
@media (max-width: 768px) {
  .section3 { margin: 10px 10px; border-radius: var(--r-md); }
  .stat-number { font-size: 2rem; }
}
</style>
