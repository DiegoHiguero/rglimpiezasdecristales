<template>
  <section class="zonas-section">

    <div class="zonas-header">
      <span class="zonas-label">
        <font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />
        Cobertura geográfica
      </span>
      <h2 class="zonas-title">Limpieza de cristales en <span class="zonas-accent">toda la Comunidad de Madrid</span></h2>
      <p class="zonas-sub">
        Realizamos limpieza de cristales y ventanas en Madrid capital y en todos los municipios del área metropolitana.
        Si tienes dudas sobre tu zona, <strong>llámanos y lo confirmamos.</strong>
      </p>
    </div>

    <div class="zonas-grid">
      <div class="zona-card" v-for="zona in zonas" :key="zona.nombre">
        <div class="zona-card-head">
          <span class="zona-icon-box" :style="{ background: zona.colorPale, color: zona.color }">
            <font-awesome-icon :icon="zona.icono" />
          </span>
          <span class="zona-nombre">{{ zona.nombre }}</span>
        </div>
        <ul class="zona-lista">
          <li v-for="municipio in zona.municipios" :key="municipio">
            <font-awesome-icon :icon="['fas', 'check']" class="zona-check" />
            {{ municipio }}
          </li>
        </ul>
      </div>
    </div>

    <div class="zonas-footer">
      <p class="zonas-nota">
        <font-awesome-icon :icon="['fas', 'circle-info']" class="me-2" />
        ¿Tu municipio no aparece? Es posible que también cubramos tu zona.
      </p>
      <div class="zonas-ctas">
        <a href="tel:+34696169435" class="zonas-btn zonas-btn--primary">
          <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />Llamar ahora
        </a>
        <a href="https://wa.me/34696169435" target="_blank" rel="noopener noreferrer" class="zonas-btn zonas-btn--whatsapp">
          <font-awesome-icon :icon="['fab', 'whatsapp']" class="me-2" />WhatsApp
        </a>
      </div>
    </div>

  </section>
</template>

<script setup>
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
    municipios: ['Getafe', 'Leganés', 'Alcorcón', 'Fuenlabrada', 'Móstoles', 'Parla', 'Pinto', 'Valdemoro', 'Aranjuez'],
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
.zonas-section {
  background: var(--slate);
  margin: 12px 15px;
  border-radius: var(--r-lg);
  overflow: hidden;
  padding: 40px 28px 36px;
}

/* ── Header ── */
.zonas-header {
  text-align: center;
  margin-bottom: 36px;
}

.zonas-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--blue-pale);
  color: var(--blue);
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 18px;
}

.zonas-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.2rem;
  color: var(--text);
  margin: 0 0 14px;
  line-height: 1.15;
}
.zonas-accent { color: var(--blue); }

.zonas-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.97rem;
  color: var(--text-muted);
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.6;
}
.zonas-sub strong { color: var(--text); }

/* ── Grid de zonas ── */
.zonas-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}

.zona-card {
  width: 240px;
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
.zona-nombre {
  font-family: 'Anton', sans-serif;
  font-size: 1.05rem;
  color: var(--text);
  letter-spacing: 0.02em;
}

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

.zonas-ctas {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.zonas-btn {
  display: inline-flex;
  align-items: center;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.86rem;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;
}
.zonas-btn--primary {
  background: var(--blue);
  color: #fff;
}
.zonas-btn--primary:hover {
  background: var(--blue-hover);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(37,99,235,0.35);
}
.zonas-btn--whatsapp {
  background: #25D366;
  color: #fff;
}
.zonas-btn--whatsapp:hover {
  background: #1ebe5d;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(37,211,102,0.35);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .zonas-section { margin: 10px 10px; padding: 32px 16px 28px; border-radius: var(--r-md); }
  .zonas-title { font-size: 1.7rem; }
  .zonas-footer { flex-direction: column; align-items: flex-start; }
  .zonas-ctas { width: 100%; }
  .zonas-btn { flex: 1; justify-content: center; }
}
</style>
