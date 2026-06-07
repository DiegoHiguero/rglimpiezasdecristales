<template>
  <div class="svc-section" id="servicios">

    <div class="svc-header">
      <span class="svc-label">Lo que hacemos</span>
      <h2 class="svc-title">Limpieza <span class="svc-accent">profesional</span><br>para cada espacio</h2>
      <p class="svc-subtitle">Sin andamios, sin complicaciones — trabajamos sin interrumpir tu día a día</p>
    </div>

    <div class="svc-grid">

      <div class="svc-card animate-on-scroll">
        <div class="svc-img-wrap">
          <img src="../../assets/img/restaurant.webp" class="svc-img" alt="Limpieza de cristales en negocios" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--blue">Negocios</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--blue"><font-awesome-icon :icon="['fas', 'store']" /></span>
            <h3 class="svc-name">Locales comerciales</h3>
          </div>
          <p class="svc-desc">Tiendas, cafeterías y locales siempre impecables, sin interrumpir tu actividad diaria.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Limpieza sin cerrar el negocio</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Frecuencia quincenal o mensual</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Presupuesto personalizado gratis</li>
          </ul>
          <router-link to="/contacto" class="svc-btn svc-btn--blue">Consultar precio</router-link>
        </div>
      </div>

      <div class="svc-card animate-on-scroll">
        <div class="svc-img-wrap">
          <img src="../../assets/img/casamadera.webp" class="svc-img" alt="Limpieza de cristales en hogares" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--green">Hogares</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--green"><font-awesome-icon :icon="['fas', 'house']" /></span>
            <h3 class="svc-name">Casas y apartamentos</h3>
          </div>
          <p class="svc-desc">Casas y pisos relucientes. Cristales, balcones y terrazas con la máxima dedicación.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Interior y exterior incluidos</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Marcos, juntas y barandillas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Productos 100% ecológicos</li>
          </ul>
          <router-link to="/contacto" class="svc-btn svc-btn--green">Consultar precio</router-link>
        </div>
      </div>

      <div class="svc-card animate-on-scroll">
        <div class="svc-img-wrap">
          <img src="../../assets/img/locales.webp" class="svc-img" alt="Limpieza de cristales en empresas" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--purple">Empresas</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--purple"><font-awesome-icon :icon="['fas', 'building']" /></span>
            <h3 class="svc-name">Oficinas y edificios</h3>
          </div>
          <p class="svc-desc">Oficinas, edificios y naves industriales. Planes a medida con horarios flexibles.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Contratos de mantenimiento</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Horarios adaptados a tu empresa</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Factura para empresas</li>
          </ul>
          <router-link to="/contacto" class="svc-btn svc-btn--purple">Consultar precio</router-link>
        </div>
      </div>

      <div class="svc-card svc-card--featured animate-on-scroll">
        <div class="svc-featured-badge">
          <font-awesome-icon :icon="['fas', 'bolt']" class="me-1" />Servicio especializado
        </div>
        <div class="svc-img-wrap">
          <img src="../../assets/img/presion.webp" class="svc-img" alt="Limpieza con agua a presión" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--orange">Agua a presión</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--orange"><font-awesome-icon :icon="['fas', 'droplet']" /></span>
            <h3 class="svc-name">Fachadas y exteriores</h3>
          </div>
          <p class="svc-desc">Fachadas, patios y garajes sin suciedad difícil. Resultados rápidos con equipos profesionales.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Hasta 350 bar de presión</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Fachadas, suelos y patios</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Resultados inmediatos y visibles</li>
          </ul>
          <router-link to="/contacto" class="svc-btn svc-btn--orange">Consultar precio</router-link>
        </div>
      </div>

    </div>

    <div class="svc-footer">
      <div class="svc-footer-icon">
        <font-awesome-icon :icon="['fas', 'arrow-up-from-water-pump']" />
      </div>
      <p class="svc-footer-text">¿Tienes un caso especial? También trabajamos en altura con pértigas telescópicas hasta 5 plantas, sin andamios.</p>
      <router-link to="/servicios" class="svc-footer-link">
        Ver todos los servicios
        <font-awesome-icon :icon="['fas', 'arrow-right']" class="svc-arrow" />
      </router-link>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.svc-section {
  background: var(--white);
  margin: 12px 20px;
  padding: 40px 28px 32px;
  border-radius: var(--r-lg);
}

/* ── Header ── */
.svc-header { text-align: center; margin-bottom: 28px; }
.svc-label {
  display: inline-block;
  background: var(--blue-pale);
  color: var(--blue);
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 14px;
}
.svc-title {
  font-family: 'Anton', sans-serif;
  color: var(--text);
  font-size: 2.6rem;
  line-height: 1.15;
  margin: 0 0 12px;
}
.svc-accent { color: var(--blue); }
.svc-subtitle {
  font-family: 'Raleway', sans-serif;
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0 auto;
  max-width: 500px;
}

/* ── Grid ── */
.svc-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* ── Card ── */
.svc-card {
  background: var(--navy-2);
  border-radius: var(--r-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid rgba(255,255,255,0.06);
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}
.svc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 24px 56px rgba(0,0,0,0.38);
  border-color: rgba(255,255,255,0.13);
}
.svc-card--featured { border-color: rgba(251,146,60,0.35); }

.svc-featured-badge {
  position: absolute;
  top: -1px; left: 50%;
  transform: translateX(-50%);
  background: #f97316;
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 16px;
  border-radius: 0 0 10px 10px;
  white-space: nowrap;
  z-index: 2;
}

/* ── Image ── */
.svc-img-wrap { position: relative; flex-shrink: 0; }
.svc-img { width: 100%; height: 200px; object-fit: cover; display: block; }
.svc-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10,16,30,0.85) 0%, transparent 60%);
}
.svc-tag {
  position: absolute;
  bottom: 14px; left: 16px;
  font-family: 'Anton', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
  line-height: 1;
}
.svc-tag--blue   { color: #60a5fa; }
.svc-tag--green  { color: #34d399; }
.svc-tag--purple { color: #a78bfa; }
.svc-tag--orange { color: #fb923c; }

/* ── Body ── */
.svc-body {
  padding: 20px 20px 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.svc-body-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.svc-icon {
  width: 40px; height: 40px;
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}
.svc-icon--blue   { background: rgba(96,165,250,0.15); color: #60a5fa; }
.svc-icon--green  { background: rgba(52,211,153,0.15); color: #34d399; }
.svc-icon--purple { background: rgba(167,139,250,0.15); color: #a78bfa; }
.svc-icon--orange { background: rgba(251,146,60,0.15); color: #fb923c; }

.svc-name {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: #f1f5f9;
  margin: 0;
  line-height: 1.2;
}

.svc-desc {
  font-family: 'Raleway', sans-serif;
  color: rgba(255,255,255,0.55);
  font-size: 0.85rem;
  line-height: 1.7;
  margin: 0 0 16px;
}

/* ── Feature list ── */
.svc-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.svc-list li {
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  gap: 9px;
}
.svc-check {
  color: #34d399;
  font-size: 0.65rem;
  flex-shrink: 0;
  background: rgba(52,211,153,0.12);
  width: 18px; height: 18px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

/* ── CTA buttons ── */
.svc-btn {
  display: block;
  text-align: center;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
  border: 1.5px solid transparent;
  transition: background 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s;
}
.svc-btn--blue   { color: #60a5fa; border-color: rgba(96,165,250,0.4);   background: rgba(96,165,250,0.07); }
.svc-btn--green  { color: #34d399; border-color: rgba(52,211,153,0.4);   background: rgba(52,211,153,0.07); }
.svc-btn--purple { color: #a78bfa; border-color: rgba(167,139,250,0.4);  background: rgba(167,139,250,0.07); }
.svc-btn--orange { color: #fb923c; border-color: rgba(251,146,60,0.4);   background: rgba(251,146,60,0.07); }

.svc-btn--blue:hover   { background: #60a5fa; color: #fff; }
.svc-btn--green:hover  { background: #34d399; color: #fff; }
.svc-btn--purple:hover { background: #a78bfa; color: #fff; }
.svc-btn--orange:hover { background: #fb923c; color: #fff; }
.svc-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,0,0,0.25); }

/* ── Footer strip ── */
.svc-footer {
  margin-top: 24px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.svc-footer-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: var(--blue-pale);
  color: var(--blue);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}
.svc-footer-text {
  font-family: 'Raleway', sans-serif;
  font-size: 0.87rem;
  color: var(--text-muted);
  margin: 0;
  flex: 1;
  min-width: 200px;
}
.svc-footer-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.87rem;
  color: var(--blue);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s;
}
.svc-footer-link:hover { color: var(--blue-hover); }
.svc-arrow { transition: transform 0.2s; }
.svc-footer-link:hover .svc-arrow { transform: translateX(4px); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .svc-section { margin: 10px 10px; padding: 32px 14px 24px; border-radius: var(--r-md); }
  .svc-title { font-size: 1.9rem; }
  .svc-grid { grid-template-columns: 1fr; gap: 12px; }
  .svc-footer { gap: 12px; padding: 16px; }
  .svc-footer-link { width: 100%; justify-content: center; }
}
</style>
