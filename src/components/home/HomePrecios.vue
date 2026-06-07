<template>
  <section class="section2" id="precios">
    <div class="container py-3">

      <div class="pricing-header">
        <span class="svc-label">Tarifas</span>
        <h2 class="pricing-title">Precios claros,<br><span class="pricing-accent">sin sorpresas</span></h2>
        <p class="pricing-sub">Tarifas orientativas — cada presupuesto es personalizado y gratuito.</p>
      </div>

      <div class="pc-grid">

        <div class="pc-card animate-on-scroll">
          <div class="pc-card-top">
            <img src="../../assets/img/petitmagasinpng.png" class="pc-img" alt="Local pequeño">
            <h4 class="pc-name">Local Pequeño</h4>
            <div class="pc-price">€20<span>/limpieza</span></div>
          </div>
          <ul class="pc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de ventanas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de puertas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Desinfección de cristales</li>
          </ul>
          <router-link to="/contacto" class="pc-btn">Solicitar presupuesto</router-link>
        </div>

        <div class="pc-card animate-on-scroll">
          <div class="pc-card-top">
            <img src="../../assets/img/magasinpng.png" class="pc-img" alt="Local mediano">
            <h4 class="pc-name">Local Mediano</h4>
            <div class="pc-price">€38<span>/limpieza</span></div>
          </div>
          <ul class="pc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de ventanas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de puertas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Desinfección de cristales</li>
          </ul>
          <router-link to="/contacto" class="pc-btn">Solicitar presupuesto</router-link>
        </div>

        <div class="pc-card animate-on-scroll">
          <div class="pc-card-top">
            <img src="../../assets/img/grandmagasinpng.png" class="pc-img" alt="Local grande">
            <h4 class="pc-name">Local Grande</h4>
            <div class="pc-price">€52<span>/limpieza</span></div>
          </div>
          <ul class="pc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza con pértiga</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de puertas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Desinfección de cristales</li>
          </ul>
          <router-link to="/contacto" class="pc-btn">Solicitar presupuesto</router-link>
        </div>

        <div class="pc-card animate-on-scroll">
          <div class="pc-card-top">
            <img src="../../assets/img/appartements.png" class="pc-img" alt="Apartamentos">
            <h4 class="pc-name">Apartamentos</h4>
            <div class="pc-price">€55<span>/limpieza</span></div>
          </div>
          <ul class="pc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de ventanas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de balcones</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Desinfección de cristales</li>
          </ul>
          <router-link to="/contacto" class="pc-btn">Solicitar presupuesto</router-link>
        </div>

        <div class="pc-card pc-card--featured animate-on-scroll">
          <div class="pc-featured-badge">Más solicitado</div>
          <div class="pc-card-top">
            <img src="../../assets/img/maisons.png" class="pc-img" alt="Chalet">
            <h4 class="pc-name">Chalet</h4>
            <div class="pc-price">€95<span>/limpieza</span></div>
          </div>
          <ul class="pc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de ventanas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de balcones</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de terrazas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de barandillas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Desinfección de cristales</li>
          </ul>
          <router-link to="/contacto" class="pc-btn pc-btn--featured">Solicitar presupuesto</router-link>
        </div>

        <div class="pc-card animate-on-scroll">
          <div class="pc-card-top">
            <img src="../../assets/img/hotel.png" class="pc-img" alt="Hotel">
            <h4 class="pc-name">Hotel</h4>
            <div class="pc-price">€4–9<span>/habitación</span></div>
          </div>
          <ul class="pc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de ventanas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de zonas comunes</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de terrazas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de barandillas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Desinfección de cristales</li>
          </ul>
          <router-link to="/contacto" class="pc-btn">Solicitar presupuesto</router-link>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.section2 { background: var(--white); border-radius: var(--r-lg); margin: 12px 20px; }

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
  margin-bottom: 12px;
}
.pricing-header { text-align: center; padding: 40px 20px 24px; }
.pricing-title { font-family: 'Anton', sans-serif; font-size: 2.6rem; color: var(--text); line-height: 1.15; margin: 14px 0 16px; }
.pricing-accent { color: var(--blue); }
.pricing-sub { font-family: 'Raleway', sans-serif; font-size: 1rem; color: var(--text-muted); max-width: 540px; margin: 0 auto 28px; line-height: 1.7; }

.pc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 8px;
}
.pc-card {
  background: var(--navy-2);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: var(--r-md);
  padding: 24px 20px 20px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}
.pc-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); border-color: rgba(96,165,250,0.2); }
.pc-card--featured { border-color: rgba(96,165,250,0.35); background: linear-gradient(160deg, #111c32 0%, #0f1729 100%); }
.pc-featured-badge {
  position: absolute;
  top: -1px; left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 14px;
  border-radius: 0 0 10px 10px;
  white-space: nowrap;
}
.pc-card-top { text-align: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,0.07); }
.pc-img { width: 72px; height: 72px; object-fit: contain; margin: 0 auto 12px; display: block; opacity: 0.9; filter: brightness(0) invert(1); }
.pc-name { font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.95rem; color: #f1f5f9; margin: 0 0 8px; }
.pc-price { font-family: 'Anton', sans-serif; font-size: 1.9rem; color: #60a5fa; line-height: 1; }
.pc-price span { font-family: 'Raleway', sans-serif; font-size: 0.8rem; font-weight: 500; color: #475569; }
.pc-list { list-style: none; padding: 0; margin: 0 0 20px; flex: 1; }
.pc-list li {
  font-family: 'Raleway', sans-serif;
  font-size: 0.83rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.pc-list li:last-child { border-bottom: none; }
.pc-check { color: #34d399; font-size: 0.65rem; flex-shrink: 0; }
.pc-btn {
  display: block;
  text-align: center;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.83rem;
  color: #60a5fa;
  border: 1.5px solid rgba(96,165,250,0.3);
  background: rgba(96,165,250,0.05);
  padding: 9px 12px;
  border-radius: 9px;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.pc-btn:hover { background: #2563eb; border-color: #2563eb; color: #fff; }
.pc-btn--featured { background: #2563eb; border-color: #2563eb; color: #fff; }
.pc-btn--featured:hover { background: #1d4ed8; border-color: #1d4ed8; }

@media (max-width: 900px) { .pc-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .section2 { margin: 10px 10px; border-radius: var(--r-md); } }
@media (max-width: 560px) { .pc-grid { grid-template-columns: 1fr; } }
</style>
