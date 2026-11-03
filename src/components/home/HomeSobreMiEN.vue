<template>
  <!-- About -->
  <div class="texto-principal-nosotros" id="about">
    <div class="ns-grid">
      <div class="ns-img-wrap animate-on-scroll">
        <img class="ns-img" src="../../assets/img/yomismo.webp"
             alt="Roys Abreu, professional window cleaner working at height" />
        <div class="ns-img-overlay"></div>
      </div>
      <div class="ns-content animate-on-scroll">
        <span class="ns-label">
          <font-awesome-icon :icon="['fas', 'user-tie']" class="me-1" />About me
        </span>
        <h2 class="ns-title">Hi, I'm<br><span class="ns-title-accent">Roys Abreu!</span></h2>
        <p class="ns-role">Founder of Royall Clean · Madrid</p>
        <p class="ns-text">I have been cleaning windows in Madrid since 2013 and I specialise in <strong>difficult jobs</strong>, the ones others won't take on. I work independently, so you deal directly with me, and I would rather take a little longer and have you happy with the result.</p>
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
  margin-bottom: 16px;
}
.ns-title {
  font-family: 'Anton', sans-serif;
  color: var(--text);
  font-size: 2.4rem;
  line-height: 1.1;
  margin: 0 0 10px;
}
.ns-title-accent { color: var(--blue); }
:root[data-theme="dark"] .ns-label { color: var(--blue-light); }
:root[data-theme="dark"] .ns-title-accent { color: var(--blue-light); }
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

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .ns-grid { grid-template-columns: 1fr; gap: 28px; }
  .ns-img { height: 300px; object-position: center 20%; }
  .ns-title { font-size: 1.85rem; }
  .texto-principal-nosotros { padding: 32px 18px 24px; }
}
@media (max-width: 768px) {
  .texto-principal-nosotros { margin: 10px; border-radius: var(--r-md); }
}
@media (max-width: 480px) {
}
</style>
