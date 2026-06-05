<template>
  <div class="advantages-bar mx-3">
    <div class="row g-0 text-center">
      <div class="col-md-3 col-6 advantage-item animate-on-scroll">
        <font-awesome-icon :icon="['fas', 'droplet']" class="advantage-icon" />
        <h6 class="advantage-title">Agua desmineralizada</h6>
        <p class="advantage-desc">Sin rayas ni residuos de cal</p>
      </div>
      <div class="col-md-3 col-6 advantage-item animate-on-scroll">
        <font-awesome-icon :icon="['fas', 'shield-halved']" class="advantage-icon" />
        <h6 class="advantage-title">Seguro de responsabilidad</h6>
        <p class="advantage-desc">Trabajamos cubiertos y con garantía</p>
      </div>
      <div class="col-md-3 col-6 advantage-item animate-on-scroll">
        <font-awesome-icon :icon="['fas', 'file-invoice']" class="advantage-icon" />
        <h6 class="advantage-title">Factura disponible</h6>
        <p class="advantage-desc">Para particulares y empresas</p>
      </div>
      <div class="col-md-3 col-6 advantage-item animate-on-scroll">
        <font-awesome-icon :icon="['fas', 'clock']" class="advantage-icon" />
        <h6 class="advantage-title">Respuesta en 24 h</h6>
        <p class="advantage-desc">Presupuesto rápido y sin letra pequeña</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.advantages-bar {
  background: var(--navy);
  border-radius: var(--r-lg);
  padding: 30px 12px;
  margin: 12px 15px;
}
.advantage-item {
  padding: 18px 10px;
  border-right: 1px solid rgba(255,255,255,0.06);
}
.advantage-item:last-child { border-right: none; }
.advantage-icon {
  font-size: 1.9rem;
  color: var(--blue-light);
  margin-bottom: 10px;
  display: block;
}
.advantage-title {
  color: var(--white);
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 3px;
}
.advantage-desc { color: #94a3b8; font-size: 0.78rem; margin: 0; }

@media (max-width: 768px) {
  .advantages-bar { margin: 10px 10px; border-radius: var(--r-md); }
  .advantage-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .advantage-item:last-child { border-bottom: none; }
}
</style>
