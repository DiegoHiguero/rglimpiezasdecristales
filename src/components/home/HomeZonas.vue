<template>
  <section class="zonas-section" id="zonas">

    <span class="sec-label">
      <font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />
      Cobertura geográfica
    </span>
    <div class="sec-head">
      <h2 class="sec-title">Trabajamos en toda la Comunidad de Madrid</h2>
      <p class="sec-sub">
        Madrid capital y todos los municipios del área metropolitana.
      </p>
    </div>

    <div class="zonas-grid">
      <div class="zona-card" v-for="zona in zonas" :key="zona.nombre"
           :class="{ 'zona-card--open': abierta === zona.nombre }">
        <button type="button" class="zona-card-head" :aria-expanded="abierta === zona.nombre"
                @click="abierta = abierta === zona.nombre ? null : zona.nombre">
          <span class="zona-icon-box" :style="{ background: zona.colorPale, color: zona.color }">
            <font-awesome-icon :icon="zona.icono" />
          </span>
          <span class="zona-nombre">{{ zona.nombre }}</span>
          <font-awesome-icon :icon="['fas', 'chevron-down']" class="zona-chevron" />
        </button>
        <ul class="zona-lista">
          <li v-for="municipio in zona.municipios" :key="municipio">
            <font-awesome-icon :icon="['fas', 'check']" class="zona-check" />
            <router-link v-if="paginasZona[municipio]" :to="paginasZona[municipio]" class="zona-link">{{ municipio }}</router-link>
            <template v-else>{{ municipio }}</template>
          </li>
        </ul>
      </div>
    </div>

    <div class="zonas-footer">
      <p class="zonas-nota">
        <font-awesome-icon :icon="['fas', 'circle-info']" class="me-2" />
        ¿Tu municipio no aparece? Llámanos al <a href="tel:+34625950506" class="zonas-tel">625 950 506</a> y lo confirmamos.
      </p>
    </div>

  </section>
</template>

<script setup>
import { ref } from 'vue';

// En móvil cada zona se pliega; los municipios siguen en el HTML (SEO local)
const abierta = ref(null);

// Municipios con página propia (src/data/zonas.js)
const paginasZona = {
  'Centro': '/limpieza-cristales-madrid-centro',
  'Getafe': '/limpieza-cristales-getafe',
  'Griñón': '/limpieza-cristales-grinon',
  'Las Rozas': '/limpieza-cristales-las-rozas',
  'Pozuelo de Alarcón': '/limpieza-cristales-pozuelo-de-alarcon',
};

const zonas = [
  {
    nombre: 'Madrid Capital',
    icono: ['fas', 'city'],
    color: '#2563eb', colorPale: '#eff6ff',
    municipios: ['Centro', 'Salamanca', 'Retiro', 'Chamberí', 'Tetuán', 'Carabanchel', 'Vallecas', 'Hortaleza', 'Moratalaz', 'Vicálvaro'],
  },
  {
    nombre: 'Sur',
    icono: ['fas', 'compass'],
    color: '#16a34a', colorPale: '#f0fdf4',
    municipios: ['Getafe', 'Leganés', 'Alcorcón', 'Fuenlabrada', 'Móstoles', 'Parla', 'Pinto', 'Valdemoro', 'Griñón', 'Aranjuez'],
  },
  {
    nombre: 'Norte',
    icono: ['fas', 'compass'],
    color: '#9333ea', colorPale: '#faf5ff',
    municipios: ['Alcobendas', 'San Sebastián de los Reyes', 'Tres Cantos', 'Colmenar Viejo', 'Algete', 'Cobeña'],
  },
  {
    nombre: 'Oeste',
    icono: ['fas', 'compass'],
    color: '#ea580c', colorPale: '#fff7ed',
    municipios: ['Pozuelo de Alarcón', 'Majadahonda', 'Las Rozas', 'Boadilla del Monte', 'Villanueva de la Cañada', 'Brunete', 'Villaviciosa de Odón'],
  },
  {
    nombre: 'Este',
    icono: ['fas', 'compass'],
    color: '#0891b2', colorPale: '#ecfeff',
    municipios: ['Alcalá de Henares', 'Torrejón de Ardoz', 'Coslada', 'San Fernando de Henares', 'Rivas-Vaciamadrid', 'Mejorada del Campo'],
  },
];
</script>

<style scoped>
.zona-link { color: var(--blue); font-weight: 600; text-decoration: none; }
.zona-link:hover { text-decoration: underline; }

.zonas-section {
  scroll-margin-top: 88px;
  background: var(--white);
  margin: 12px 20px;
  border-radius: var(--r-lg);
  overflow: hidden;
  padding: 40px 28px 36px;
}

/* ── Header ── */




/* ── Grid de zonas ── */
.zonas-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 32px;
}

.zona-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 18px 16px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.zona-card:hover {
  box-shadow: 0 6px 24px rgba(0,0,0,0.07);
  transform: translateY(-3px);
}

.zona-card-head {
  width: 100%;
  padding: 0;
  background: none;
  border-top: none; border-left: none; border-right: none;
  text-align: left;
  cursor: default;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.zona-icon-box {
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem; flex-shrink: 0;
}
/* El fondo pastel va inline (colorPale); en oscuro se sustituye por uno translúcido */
:root[data-theme="dark"] .zona-icon-box { background: rgba(255,255,255,0.07) !important; }
.zona-nombre {
  font-family: 'Anton', sans-serif;
  font-size: 1.05rem;
  color: var(--text);
  letter-spacing: 0.02em;
}

.zona-chevron { display: none; margin-left: auto; color: var(--text-muted); font-size: 0.8rem; transition: transform 0.25s; }

.zona-lista {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.zona-lista li {
  font-family: 'Raleway', sans-serif;
  font-size: 0.83rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 7px;
}
.zona-check {
  color: var(--blue);
  font-size: 0.65rem;
  flex-shrink: 0;
}

/* ── Footer ── */
.zonas-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 18px 22px;
}

.zonas-nota {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: var(--text-muted);
  margin: 0;
}



/* Un solo color para los iconos de zona (el pastel de cada una va inline) */
.zona-icon-box { background: var(--blue-pale) !important; color: var(--blue) !important; }

/* Escritorio: una fila por zona con los municipios como etiquetas, en lugar de
   cinco columnas de listas; los que tienen página propia van resaltados */
@media (min-width: 769px) {
  .zonas-grid { display: flex; flex-direction: column; gap: 0; border-top: 1px solid var(--border); }
  .zona-card {
    display: grid;
    grid-template-columns: 190px 1fr;
    align-items: center;
    gap: 16px;
    padding: 16px 4px;
    border: 0;
    border-bottom: 1px solid var(--border);
    border-radius: 0;
    background: none;
  }
  .zona-card:hover { transform: none; box-shadow: none; }
  .zona-card-head { margin: 0; padding: 0; border: 0; }
  .zona-lista { flex-direction: row; flex-wrap: wrap; gap: 8px; }
  .zona-lista li {
    font-size: 0.82rem;
    padding: 5px 12px;
    border-radius: 20px;
    background: var(--slate);
    border: 1px solid var(--border);
  }
  .zona-lista li:has(.zona-link) { background: var(--blue-pale); border-color: transparent; }
  :root[data-theme="dark"] .zona-link { color: #93c5fd; }
  .zona-check { display: none; }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .zonas-grid { grid-template-columns: 1fr; gap: 10px; margin-bottom: 24px; }
  .zona-card { padding: 12px 14px; }
  .zona-card:hover { transform: none; }
  .zona-card-head { cursor: pointer; margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
  .zona-chevron { display: block; }
  .zona-card--open .zona-chevron { transform: rotate(180deg); }
  .zona-card:not(.zona-card--open) .zona-lista { display: none; }
  .zona-card--open .zona-lista { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); }
  .zonas-section { margin: 10px 10px; padding: 32px 16px 28px; border-radius: var(--r-md); }
  .zonas-footer { flex-direction: column; align-items: flex-start; }
}
.zonas-tel { color: var(--blue); font-weight: 700; text-decoration: none; white-space: nowrap; }
.zonas-tel:hover { text-decoration: underline; }
</style>
