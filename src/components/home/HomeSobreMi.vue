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
      </div>
      <div class="ns-content animate-on-scroll">
        <h2 class="ns-title">¡Hola, soy<br><span class="ns-title-accent">Roys Abreu!</span></h2>
        <p class="ns-role">Fundador de Royall Clean · Madrid</p>
        <p class="ns-text">Trabajo como autónomo, así que tratas directamente conmigo: desde el presupuesto hasta el último cristal. Me gusta hacer las cosas bien a la primera y que el cliente repita.</p>
        <!-- Contacto directo, coherente con "tratas directamente conmigo" -->
        <div class="ns-ctas">
          <a href="tel:+34625950506" class="ns-cta">
            <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />Llámame: 625 950 506
          </a>
          <a href="https://wa.me/34625950506?text=Hola%20Roys%2C%20quiero%20un%20presupuesto" target="_blank" rel="noopener noreferrer" class="ns-cta ns-cta--wa">
            <font-awesome-icon :icon="['fab', 'whatsapp']" class="me-2" />WhatsApp
          </a>
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
  scroll-margin-top: 88px;
  background: var(--white);
  margin: 12px 20px;
  padding: 40px;
  border-radius: var(--r-lg);
  font-family: 'Raleway', sans-serif;
}
.ns-grid {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 48px;
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
  height: 380px;
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
.ns-ctas { display: flex; flex-wrap: wrap; gap: 10px; }
.ns-cta--wa { background: #25d366; }
.ns-cta--wa:hover { background: #1ebe5b !important; box-shadow: 0 6px 22px rgba(37,211,102,0.35) !important; }
.ns-cta:hover {
  background: var(--blue-hover);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(37,99,235,0.38);
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .ns-grid { grid-template-columns: 1fr; gap: 28px; }
  .ns-img { height: 300px; object-position: center 20%; }
  .ns-title { font-size: 2.1rem; }
  .texto-principal-nosotros { padding: 32px 18px 24px; }
}
@media (max-width: 768px) {
  .texto-principal-nosotros { margin: 10px; border-radius: var(--r-md); }
}
@media (max-width: 480px) {
  .ns-cta { width: 100%; justify-content: center; }
}
</style>
