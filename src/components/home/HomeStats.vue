<template>
  <div class="section3" ref="sectionRef">
    <div class="stats-row">
      <div
        class="stat-item"
        v-for="(s, i) in stats"
        :key="s.label"
        :class="{ 'is-visible': hasAnimated }"
        :style="{ transitionDelay: (i * 0.08) + 's' }"
      >
        <font-awesome-icon :icon="s.icon" class="stat-icon" />
        <span class="stat-number" v-if="!s.rating">{{ s.prefix }}{{ displayValues[i] }}</span>
        <span class="stat-number" v-else>5.0</span>
        <p class="stat-label">{{ s.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = [
  { icon: ['fas', 'clock'], target: 10,  prefix: '+', label: 'Años de experiencia' },
  { icon: ['fas', 'broom'], target: 500, prefix: '+', label: 'Trabajos realizados' },
  { icon: ['fas', 'user'],  target: 200, prefix: '+', label: 'Clientes satisfechos' },
  { icon: ['fas', 'star'],  rating: true, label: 'Valoración en Google' },
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
        stats.forEach((s, i) => { if (!s.rating) animateCount(i, s.target); });
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  if (sectionRef.value) observer.observe(sectionRef.value);
});
</script>

<style scoped>
.section3 {
  background: var(--white);
  margin: 12px 20px;
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  overflow: hidden;
}
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.stat-item {
  padding: 30px 16px;
  text-align: center;
  border-right: 1px solid var(--border);
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.stat-item:last-child { border-right: none; }
.stat-item.is-visible { opacity: 1; transform: translateY(0); }

.stat-icon {
  display: block;
  font-size: 1.05rem;
  color: var(--blue);
  margin-bottom: 12px;
}
.stat-item:last-child .stat-icon { color: #f59e0b; }

.stat-number {
  display: block;
  font-family: 'Anton', sans-serif;
  font-size: 2.1rem;
  color: var(--text);
  line-height: 1;
}
.stat-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 8px 0 0;
}

@media (max-width: 768px) {
  .section3 { margin: 10px 10px; border-radius: var(--r-md); }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .stat-item { padding: 22px 10px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .stat-item:nth-child(2n) { border-right: none; }
  .stat-item:nth-last-child(-n+2) { border-bottom: none; }
  .stat-number { font-size: 1.8rem; }
}
</style>
