<template>
  <!-- Nosotros -->
  <div class="texto-principal-nosotros" id="texto-principal">
    <span class="ns-label">
      <font-awesome-icon :icon="['fas', 'user-tie']" class="me-2" />Sobre mí
    </span>
    <div class="ns-grid">
      <div class="ns-img-wrap animate-on-scroll">
        <img class="ns-img" src="../../assets/img/yomismo.webp"
             alt="Roys Abreu, profesional en limpieza de cristales en altura" />
        <div class="ns-img-overlay"></div>
        <div class="ns-img-badge">
          <span class="ns-badge-num">+10</span>
          <span class="ns-badge-label">años de<br>experiencia</span>
        </div>
      </div>
      <div class="ns-content animate-on-scroll">
        <h2 class="ns-title">¡Hola, soy<br><span class="ns-title-accent">Roys Abreu!</span></h2>
        <p class="ns-role">Autónomo especializado · Royall Clean · Madrid y área metropolitana</p>
        <p class="ns-text">Soy un profesional autónomo con más de 10 años especializándome en la limpieza de cristales y fachadas. En Royall Clean me comprometo a ofrecer un servicio impecable, eficiente y de confianza, adaptado a cada cliente — residencial o empresarial. No solo obtienes limpieza: obtienes tranquilidad y resultados que se ven.</p>
        <div class="ns-tags">
          <span class="ns-tag"><font-awesome-icon :icon="['fas', 'check']" class="me-1" />Certificado</span>
          <span class="ns-tag"><font-awesome-icon :icon="['fas', 'user-tie']" class="me-1" />Trabajo autónomo</span>
          <span class="ns-tag"><font-awesome-icon :icon="['fas', 'seedling']" class="me-1" />Productos eco</span>
          <span class="ns-tag"><font-awesome-icon :icon="['fas', 'heart']" class="me-1" />Trato personal</span>
        </div>
        <router-link to="/contacto" class="ns-cta">
          <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Pedir presupuesto sin compromiso
        </router-link>
      </div>
    </div>
  </div>

  <!-- Info cards -->
  <div class="info-cards">
    <div class="row g-4 justify-content-center">
      <div class="col-md-6 animate-on-scroll">
        <div class="ic-card ic-card--green">
          <div class="ic-band"></div>
          <div class="ic-content">
          <div class="ic-img-wrap">
            <img src="../../assets/img/logocarta.webp" class="ic-img" alt="Nuestra misión" />
          </div>
          <div class="ic-body">
            <h3 class="ic-title">Nuestra misión</h3>
            <p class="ic-text">Resultados impecables, sin complicaciones. Tu satisfacción es nuestra garantía.</p>
            <ul class="ic-list">
              <li>Máxima calidad garantizada</li>
              <li>Altos estándares de seguridad</li>
              <li>Profesional de confianza</li>
              <li>Satisfacción o lo repetimos</li>
            </ul>
          </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 animate-on-scroll">
        <div class="ic-card ic-card--orange">
          <div class="ic-band"></div>
          <div class="ic-content">
          <div class="ic-img-wrap">
            <img src="../../assets/img/materiales.webp" class="ic-img" alt="Materiales profesionales" />
          </div>
          <div class="ic-body">
            <h3 class="ic-title">Materiales de primera</h3>
            <p class="ic-text">Herramientas profesionales Unger, reconocidas internacionalmente por su precisión.</p>
            <ul class="ic-list">
              <li>Pértigas telescópicas Unger</li>
              <li>Sistema de agua pura</li>
              <li>Microfibra de alto rendimiento</li>
              <li>Productos 100% ecológicos</li>
            </ul>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
</script>

<style scoped>
/* ── NOSOTROS ── */
.texto-principal-nosotros {
  background: var(--white);
  margin: 12px 20px 0;
  padding: 40px 40px 28px;
  border-radius: var(--r-lg) var(--r-lg) 0 0;
  font-family: 'Raleway', sans-serif;
}
.ns-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}
.ns-img-wrap {
  position: relative;
  border-radius: var(--r-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}
.ns-img {
  width: 100%;
  height: 460px;
  object-fit: cover;
  object-position: center 18%;
  display: block;
  border-radius: var(--r-md);
}
.ns-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15,23,41,0.55) 0%, transparent 55%);
  border-radius: var(--r-md);
  pointer-events: none;
}
.ns-img-badge {
  position: absolute;
  bottom: 22px;
  left: 22px;
  background: var(--blue);
  border-radius: 14px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(37,99,235,0.5);
}
.ns-badge-num {
  font-family: 'Anton', sans-serif;
  font-size: 2rem;
  color: #fff;
  line-height: 1;
}
.ns-badge-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255,255,255,0.85);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.4;
}
.ns-content { display: flex; flex-direction: column; }
.ns-label {
  display: flex;
  width: fit-content;
  align-items: center;
  background: var(--blue-pale);
  color: var(--blue-hover);
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 24px;
}
.ns-title {
  font-family: 'Anton', sans-serif;
  color: var(--text);
  font-size: 2.8rem;
  line-height: 1.1;
  margin: 0 0 10px;
}
.ns-title-accent { color: var(--blue); }
.ns-role {
  font-family: 'Raleway', sans-serif;
  color: var(--text-muted);
  font-size: 0.88rem;
  font-weight: 600;
  margin: 0 0 22px;
  padding-bottom: 22px;
  border-bottom: 2px solid var(--border);
}
.ns-text {
  font-family: 'Raleway', sans-serif;
  color: var(--text-muted);
  font-size: 0.97rem;
  line-height: 1.85;
  margin: 0 0 24px;
}
.ns-text strong { color: var(--text); }
.ns-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 30px;
}
.ns-tag {
  display: inline-flex;
  align-items: center;
  background: var(--white);
  border: 1.5px solid var(--border);
  color: var(--text);
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.ns-tag:hover { border-color: var(--blue); color: var(--blue); background: var(--blue-pale); }
.ns-cta {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  background: var(--blue);
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  padding: 12px 26px;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.ns-cta:hover {
  background: var(--blue-hover);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(37,99,235,0.38);
}

/* ── INFO CARDS ── */
.info-cards {
  background: var(--white);
  margin: 0 20px;
  padding: 4px 28px 32px;
  border-radius: 0 0 var(--r-lg) var(--r-lg);
}

.ic-card {
  background: var(--white);
  border-radius: var(--r-md);
  height: 100%;
  border: 1.5px solid var(--border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s, box-shadow 0.25s;
}
.ic-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }

.ic-band {
  height: 5px;
  flex-shrink: 0;
}
.ic-card--green .ic-band  { background: #10b981; }
.ic-card--orange .ic-band { background: #f59e0b; }

.ic-content {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
}

.ic-img-wrap {
  width: 150px;
  flex-shrink: 0;
  overflow: hidden;
}
.ic-card--green .ic-img-wrap  { background: #f0fdf4; }
.ic-card--orange .ic-img-wrap { background: #fffbeb; }

.ic-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 16px;
  display: block;
  transition: transform 0.35s;
}
.ic-card:hover .ic-img { transform: scale(1.05); }

.ic-body {
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.ic-title {
  font-family: 'Anton', sans-serif;
  color: var(--text);
  font-size: 1.1rem;
  margin: 0 0 8px;
  letter-spacing: 0.3px;
}
.ic-text {
  font-family: 'Raleway', sans-serif;
  color: var(--text-muted);
  font-size: 0.83rem;
  line-height: 1.6;
  margin: 0 0 14px;
}
.ic-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.ic-list li {
  font-family: 'Raleway', sans-serif;
  font-size: 0.81rem;
  color: var(--text);
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 9px;
}
.ic-list li:last-child { border-bottom: none; }
.ic-list li::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ic-card--green  .ic-list li::before { background: #10b981; }
.ic-card--orange .ic-list li::before { background: #f59e0b; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .ns-grid { grid-template-columns: 1fr; gap: 28px; }
  .ns-img { height: 300px; object-position: center 20%; }
  .ns-title { font-size: 2.1rem; }
  .texto-principal-nosotros { padding: 32px 18px 24px; }
}
@media (max-width: 768px) {
  .texto-principal-nosotros { margin: 10px 10px 0; }
  .info-cards { margin: 0 10px; padding: 8px 10px 28px; }
  .ic-card { flex-direction: column; }
  .ic-content { flex-direction: column; }
  .ic-img-wrap { width: 100%; height: 180px; }
  .ic-body { border-left: none; border-top: 4px solid transparent; }
  .ic-card--green .ic-body  { border-top-color: #10b981; }
  .ic-card--orange .ic-body { border-top-color: #f59e0b; }
  .info-cards { margin: 0 10px; padding: 8px 10px 28px; }
}
</style>
