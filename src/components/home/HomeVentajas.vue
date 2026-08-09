<template>
  <section class="v-section">

    <span class="v-label">
      <font-awesome-icon :icon="['fas', 'trophy']" class="me-1" />
      Por qué elegirnos
    </span>

    <div class="v-header">
      <h2 class="v-title">Limpieza profesional con <span class="v-accent">garantía total</span></h2>
      <p class="v-sub">Lo que nos diferencia de una limpieza cualquiera</p>
    </div>

    <div class="v-grid">
      <div class="v-card" v-for="item in ventajas" :key="item.titulo">
        <div class="v-icon-box" :style="{ background: item.bg, color: item.color }">
          <font-awesome-icon :icon="item.icono" />
        </div>
        <h3 class="v-card-title">{{ item.titulo }}</h3>
        <p class="v-card-desc">{{ item.desc }}</p>
      </div>
    </div>

  </section>
</template>

<script setup>
const ventajas = [
  {
    icono: ['fas', 'clock'],
    titulo: 'Respuesta en 24 h',
    desc: 'Presupuesto personalizado y gratuito sin esperar días.',
    bg: 'rgba(245,158,11,0.15)', color: '#f59e0b',
  },
  {
    icono: ['fas', 'droplet'],
    titulo: 'Agua desmineralizada',
    desc: 'Sin rayas, sin cal, sin residuos — cristal impecable.',
    bg: 'rgba(59,130,246,0.15)', color: '#60a5fa',
  },
  {
    icono: ['fas', 'shield-halved'],
    titulo: 'Seguro de responsabilidad',
    desc: 'Trabajamos con cobertura total. Cualquier incidencia, cubierta.',
    bg: 'rgba(139,92,246,0.15)', color: '#a78bfa',
  },
  {
    icono: ['fas', 'leaf'],
    titulo: 'Productos ecológicos',
    desc: 'Sin químicos agresivos. Seguros para niños, mascotas y plantas.',
    bg: 'rgba(16,185,129,0.15)', color: '#34d399',
  },
  {
    icono: ['fas', 'file-invoice'],
    titulo: 'Factura disponible',
    desc: 'Emitimos factura para particulares, autónomos y empresas.',
    bg: 'rgba(8,145,178,0.15)', color: '#22d3ee',
  },
  {
    icono: ['fas', 'star'],
    titulo: '5/5 en Google',
    desc: 'Más de 10 años de experiencia y clientes que repiten.',
    bg: 'rgba(249,115,22,0.15)', color: '#fb923c',
  },
];
</script>

<style scoped>
.v-section {
  background: var(--navy);
  border-radius: var(--r-lg);
  margin: 12px 20px;
  padding: 44px 32px 40px;
}

/* ── Label ── */
.v-label {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.7);
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 20px;
}

/* ── Header ── */
.v-header {
  text-align: center;
  margin-bottom: 36px;
}
.v-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.2rem;
  color: #f1f5f9;
  line-height: 1.15;
  margin: 0 0 10px;
}
.v-accent { color: var(--blue-light); }
.v-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.6);
  margin: 0;
}

/* ── Grid ── */
.v-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

/* ── Card ── */
.v-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: var(--r-md);
  padding: 24px 20px 22px;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
}
.v-card:hover {
  background: rgba(255,255,255,0.07);
  border-color: rgba(255,255,255,0.13);
  transform: translateY(-3px);
}

.v-icon-box {
  width: 46px; height: 46px;
  border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  margin-bottom: 14px;
  flex-shrink: 0;
}

.v-card-title {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.93rem;
  color: #f1f5f9;
  margin: 0 0 6px;
}

.v-card-desc {
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.48);
  margin: 0;
  line-height: 1.65;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .v-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .v-section { margin: 10px 10px; padding: 36px 16px 32px; border-radius: var(--r-md); }
  .v-title { font-size: 1.75rem; }
}
@media (max-width: 480px) {
  .v-grid { grid-template-columns: 1fr; }
}
</style>
