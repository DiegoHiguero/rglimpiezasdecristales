<template>
  <!-- Franja fina de cifras y garantías; va dentro del fondo oscuro del hero -->
  <div class="section3" ref="sectionRef">
    <div
      class="stat-item"
      v-for="(s, i) in stats"
      :key="s.label"
      :class="{ 'is-visible': hasAnimated }"
      :style="{ transitionDelay: (i * 0.08) + 's' }"
    >
      <span class="stat-number">{{ s.prefix }}{{ displayValues[i].toLocaleString('es-ES') }}</span>
      <span class="stat-label">{{ s.label }}</span>
    </div>
    <div class="perk" v-for="p in perks" :key="p.titulo">
      <font-awesome-icon :icon="p.icon" class="perk-icon" />
      <span class="stat-label">{{ p.titulo }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = [
  // Desde 2013
  { target: 13,    prefix: '+', label: 'años de experiencia' },
  // 8-12 servicios al día, ~200 días al año, 13 años (cálculo por lo bajo)
  { target: 20000, prefix: '+', label: 'trabajos' },
  { target: 300,   prefix: '+', label: 'clientes' },
];

const perks = [
  { icon: ['fas', 'shield-halved'], titulo: 'Con seguro' },
  { icon: ['fas', 'file-invoice'],  titulo: 'Con factura' },
];

const displayValues = ref(stats.map(() => 0));
const sectionRef    = ref(null);
const hasAnimated   = ref(false);

function animateCount(index, target) {
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    displayValues.value[index] = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

onMounted(() => {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated.value) {
        hasAnimated.value = true;
        stats.forEach((s, i) => animateCount(i, s.target));
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  if (sectionRef.value) observer.observe(sectionRef.value);
});
</script>

<style scoped>
.section3 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background: rgba(10, 16, 30, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--r-md);
  padding: 12px 8px;
}
.stat-item, .perk {
  display: flex;
  align-items: baseline;
  gap: 7px;
  padding: 4px 22px;
  border-right: 1px solid rgba(255,255,255,0.14);
}
.section3 > :last-child { border-right: none; }
.stat-item {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.stat-item.is-visible { opacity: 1; transform: translateY(0); }
.perk { align-items: center; }

.stat-number {
  font-family: 'Anton', sans-serif;
  font-size: 1.45rem;
  color: #fff;
  line-height: 1;
}
.stat-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255,255,255,0.75);
}
.perk-icon { color: #60a5fa; font-size: 0.95rem; }

/* Modo claro: franja blanca, a juego con el panel y el formulario del hero */
:root:not([data-theme="dark"]) .section3 {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(0,0,0,0.07);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}
:root:not([data-theme="dark"]) .stat-number { color: #1e293b; }
:root:not([data-theme="dark"]) .stat-label { color: #475569; }
:root:not([data-theme="dark"]) .perk-icon { color: #2563eb; }
:root:not([data-theme="dark"]) .stat-item,
:root:not([data-theme="dark"]) .perk { border-color: rgba(0,0,0,0.1); }

@media (max-width: 768px) {
  .section3 { padding: 10px 4px; row-gap: 8px; }
  .stat-item {
    flex-direction: column;
    align-items: center;
    gap: 3px;
    flex: 1 1 30%;
    padding: 2px 6px;
  }
  .stat-item:nth-child(3) { border-right: none; }
  .stat-number { font-size: 1.3rem; }
  .stat-label { font-size: 0.7rem; text-align: center; }
  .perk {
    flex: 1 1 45%;
    justify-content: center;
    padding: 8px 6px 2px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
}
</style>
