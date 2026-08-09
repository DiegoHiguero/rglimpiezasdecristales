<template>
  <div class="rm-card">
    <div class="rm-card-head">
      <span class="rm-card-title">
        <font-awesome-icon :icon="['fas', 'route']" class="me-2" />
        Hoja de Ruta
      </span>
      <span class="rm-card-sub">Pasos pendientes en la web</span>
    </div>

    <div class="rm-grid">
      <div v-for="grupo in roadmap" :key="grupo.categoria" class="rm-group">
        <div class="rm-group-head">
          <font-awesome-icon :icon="['fas', grupo.icon]" class="rm-group-icon" />
          <span class="rm-group-title">{{ grupo.categoria }}</span>
        </div>
        <ul class="rm-list">
          <li v-for="item in grupo.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { roadmap } from '../data/roadmap';
</script>

<style scoped>
.rm-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 22px 24px;
  box-shadow: var(--shadow-sm);
}
.rm-card-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.rm-card-title {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text);
}
.rm-card-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.rm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}
.rm-group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.rm-group-icon {
  color: var(--blue);
  font-size: 0.8rem;
}
.rm-group-title {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text);
}
.rm-list {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.rm-list li {
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem;
  color: var(--text-muted);
  line-height: 1.45;
}

@media (max-width: 768px) {
  .rm-card { padding: 16px 18px; }
}
</style>
