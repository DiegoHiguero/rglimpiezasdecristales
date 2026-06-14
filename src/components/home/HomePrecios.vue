<template>
  <section class="section2" id="precios">
    <div class="container py-3">

      <div class="pricing-header">
        <span class="svc-label">Tarifas</span>
        <h2 class="pricing-title">Precios claros,<br><span class="pricing-accent">sin sorpresas</span></h2>
        <p class="pricing-sub">Tarifas orientativas — cada presupuesto es personalizado y gratuito.</p>
      </div>

      <div class="pc-grid">

        <div class="pc-card pc-card--blue animate-on-scroll">
          <div class="pc-band"></div>
          <div class="pc-inner">
            <div class="pc-top">
              <div class="pc-icon-wrap"><i class="bi bi-shop"></i></div>
              <h4 class="pc-name">Local Pequeño</h4>
              <p class="pc-size">1–2 escaparates</p>
            </div>
            <div class="pc-price-wrap">
              <span class="pc-desde">desde</span>
              <div class="pc-price">€20<span>/limpieza</span></div>
            </div>
            <ul class="pc-list">
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de ventanas</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de puertas</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Desinfección de cristales</li>
            </ul>
            <router-link to="/contacto" class="pc-btn">Pedir presupuesto</router-link>
          </div>
        </div>

        <div class="pc-card pc-card--purple animate-on-scroll">
          <div class="pc-band"></div>
          <div class="pc-inner">
            <div class="pc-top">
              <div class="pc-icon-wrap"><i class="bi bi-shop-window"></i></div>
              <h4 class="pc-name">Local Mediano</h4>
              <p class="pc-size">3–5 escaparates</p>
            </div>
            <div class="pc-price-wrap">
              <span class="pc-desde">desde</span>
              <div class="pc-price">€38<span>/limpieza</span></div>
            </div>
            <ul class="pc-list">
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de ventanas</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de puertas</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Desinfección de cristales</li>
            </ul>
            <router-link to="/contacto" class="pc-btn">Pedir presupuesto</router-link>
          </div>
        </div>

        <div class="pc-card pc-card--teal animate-on-scroll">
          <div class="pc-band"></div>
          <div class="pc-inner">
            <div class="pc-top">
              <div class="pc-icon-wrap"><i class="bi bi-house-door"></i></div>
              <h4 class="pc-name">Local Grande</h4>
              <p class="pc-size">Fachada completa</p>
            </div>
            <div class="pc-price-wrap">
              <span class="pc-desde">desde</span>
              <div class="pc-price">€52<span>/limpieza</span></div>
            </div>
            <ul class="pc-list">
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza con pértiga</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de puertas</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Desinfección de cristales</li>
            </ul>
            <router-link to="/contacto" class="pc-btn">Pedir presupuesto</router-link>
          </div>
        </div>

        <div class="pc-card pc-card--green animate-on-scroll">
          <div class="pc-band"></div>
          <div class="pc-inner">
            <div class="pc-top">
              <div class="pc-icon-wrap"><i class="bi bi-buildings"></i></div>
              <h4 class="pc-name">Apartamentos</h4>
              <p class="pc-size">Piso o apartamento</p>
            </div>
            <div class="pc-price-wrap">
              <span class="pc-desde">desde</span>
              <div class="pc-price">€55<span>/limpieza</span></div>
            </div>
            <ul class="pc-list">
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de ventanas</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de balcones</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Desinfección de cristales</li>
            </ul>
            <router-link to="/contacto" class="pc-btn">Pedir presupuesto</router-link>
          </div>
        </div>

        <div class="pc-card pc-card--amber pc-card--featured animate-on-scroll">
          <div class="pc-band">
            <span class="pc-badge">Más solicitado</span>
          </div>
          <div class="pc-inner">
            <div class="pc-top">
              <div class="pc-icon-wrap"><i class="bi bi-houses"></i></div>
              <h4 class="pc-name">Chalet</h4>
              <p class="pc-size">Unifamiliar con jardín</p>
            </div>
            <div class="pc-price-wrap">
              <span class="pc-desde">desde</span>
              <div class="pc-price">€95<span>/limpieza</span></div>
            </div>
            <ul class="pc-list">
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de ventanas</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de balcones</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de terrazas</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de barandillas</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Desinfección de cristales</li>
            </ul>
            <router-link to="/contacto" class="pc-btn pc-btn--filled">Pedir presupuesto</router-link>
          </div>
        </div>

        <div class="pc-card pc-card--orange animate-on-scroll">
          <div class="pc-band"></div>
          <div class="pc-inner">
            <div class="pc-top">
              <div class="pc-icon-wrap"><i class="bi bi-building-fill"></i></div>
              <h4 class="pc-name">Hotel</h4>
              <p class="pc-size">Precio por habitación</p>
            </div>
            <div class="pc-price-wrap">
              <span class="pc-desde">desde</span>
              <div class="pc-price">€4–9<span>/habitación</span></div>
            </div>
            <ul class="pc-list">
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de ventanas</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de zonas comunes</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de terrazas</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Limpieza de barandillas</li>
              <li><font-awesome-icon :icon="['fas', 'check']" class="pc-check" />Desinfección de cristales</li>
            </ul>
            <router-link to="/contacto" class="pc-btn">Pedir presupuesto</router-link>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
/* ── Color tokens per tier ── */
.pc-card--blue   { --cc: #3b82f6; --cp: #eff6ff; }
.pc-card--purple { --cc: #8b5cf6; --cp: #f5f3ff; }
.pc-card--teal   { --cc: #0891b2; --cp: #ecfeff; }
.pc-card--green  { --cc: #10b981; --cp: #ecfdf5; }
.pc-card--amber  { --cc: #f59e0b; --cp: #fffbeb; }
.pc-card--orange { --cc: #f97316; --cp: #fff7ed; }

/* ── Section ── */
.section2 { background: var(--white); border-radius: var(--r-lg); margin: 12px 20px; }

.svc-label {
  display: block;
  width: fit-content;
  background: var(--blue-pale); color: var(--blue);
  font-family: 'Raleway', sans-serif; font-size: 0.72rem;
  font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
  padding: 5px 14px; border-radius: 20px; margin-bottom: 12px;
}
.pricing-header { text-align: center; padding: 40px 20px 24px; }
.pricing-title { font-family: 'Anton', sans-serif; font-size: 2.6rem; color: var(--text); line-height: 1.15; margin: 14px 0 16px; }
.pricing-accent { color: var(--blue); }
.pricing-sub { font-family: 'Raleway', sans-serif; font-size: 1rem; color: var(--text-muted); max-width: 540px; margin: 0 auto 28px; line-height: 1.7; }

/* ── Grid ── */
.pc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 8px;
}

/* ── Card ── */
.pc-card {
  background: var(--slate);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.25s, box-shadow 0.25s;
}
.pc-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }

.pc-card--featured {
  border-color: var(--cc);
  box-shadow: 0 0 0 1px var(--cc);
}
.pc-card--featured:hover { box-shadow: 0 16px 40px rgba(245,158,11,0.2), 0 0 0 1px var(--cc); }

/* ── Band ── */
.pc-band {
  height: 6px;
  background: var(--cc);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pc-badge {
  position: absolute;
  top: 6px;
  background: var(--cc);
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-size: 0.63rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 3px 14px;
  border-radius: 0 0 8px 8px;
  white-space: nowrap;
  z-index: 1;
}

/* ── Inner ── */
.pc-inner {
  padding: 22px 20px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* ── Top: icon + name + size ── */
.pc-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 18px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.pc-icon-wrap {
  width: 58px; height: 58px;
  border-radius: 16px;
  background: var(--cp);
  color: var(--cc);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.7rem;
  margin-bottom: 12px;
  transition: transform 0.2s;
}
.pc-icon-wrap i { line-height: 1; }
.pc-card:hover .pc-icon-wrap { transform: scale(1.08); }
.pc-name {
  font-family: 'Raleway', sans-serif; font-weight: 700;
  font-size: 1rem; color: var(--text); margin: 0 0 4px;
}
.pc-size {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem; color: var(--text-muted); margin: 0;
}

/* ── Price ── */
.pc-price-wrap {
  text-align: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.pc-desde {
  display: block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem; font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.06em;
  margin-bottom: 2px;
}
.pc-price {
  font-family: 'Anton', sans-serif;
  font-size: 2.2rem; color: var(--cc); line-height: 1;
}
.pc-price span {
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem; font-weight: 500; color: var(--text-muted);
  margin-left: 2px;
}

/* ── List ── */
.pc-list { list-style: none; padding: 0; margin: 0 0 20px; flex: 1; }
.pc-list li {
  font-family: 'Raleway', sans-serif;
  font-size: 0.83rem; color: var(--text-muted);
  display: flex; align-items: center; gap: 9px;
  padding: 7px 0;
  border-bottom: 1px solid var(--border);
}
.pc-list li:last-child { border-bottom: none; }
.pc-check { color: var(--cc); font-size: 0.65rem; flex-shrink: 0; }

/* ── Button ── */
.pc-btn {
  display: block; text-align: center;
  font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.85rem;
  color: var(--cc);
  border: 1.5px solid var(--cc);
  background: transparent;
  padding: 10px 12px; border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.pc-btn:hover { background: var(--cc); color: #fff; }
.pc-btn--filled { background: var(--cc); color: #fff; }
.pc-btn--filled:hover { opacity: 0.9; }

/* ── Responsive ── */
@media (max-width: 900px) { .pc-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .section2 { margin: 10px 10px; border-radius: var(--r-md); } }
@media (max-width: 560px) { .pc-grid { grid-template-columns: 1fr; } }
</style>
