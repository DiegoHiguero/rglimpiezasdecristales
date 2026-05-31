<template>
  <div class="testimonials-section">

    <div class="ti-header">
      <span class="ti-label">
        <svg class="g-icon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Reseñas verificadas de Google
      </span>

      <h2 class="ti-title">Lo que dicen <span class="ti-accent">nuestros clientes</span></h2>
      <p class="ti-sub">Opiniones reales, sin filtros ni retoques</p>

      <div class="ti-summary">
        <div class="ti-rating-box">
          <div class="ti-stars">★★★★★</div>
          <span class="ti-rating-label">Valoración en <strong>Google</strong></span>
        </div>
        <a
          href="https://share.google/bqfKwS6rprwkS5FZI"
          target="_blank"
          rel="noopener noreferrer"
          class="ti-review-btn"
        >
          <font-awesome-icon :icon="['fas', 'star']" class="me-2" />
          ¿Quedaste satisfecho? Déjanos tu opinión
        </a>
      </div>
    </div>

    <div ref="widgetContainer"></div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const widgetContainer = ref(null);

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://widget.trustmary.com/7oo3gRRZW';
  script.async = true;
  widgetContainer.value?.appendChild(script);
});
</script>

<style scoped>
.testimonials-section {
  background: var(--white);
  margin: 12px 15px;
  border-radius: var(--r-lg);
  overflow: hidden;
}

/* ── Header ── */
.ti-header {
  text-align: center;
  padding: 40px 28px 28px;
  border-bottom: 1px solid var(--border);
}

.ti-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
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
.g-icon { flex-shrink: 0; }

.ti-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.2rem;
  color: var(--text);
  margin: 0 0 12px;
  line-height: 1.15;
}
.ti-accent { color: var(--blue); }

.ti-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0 0 28px;
}

.ti-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.ti-rating-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: var(--slate);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 12px 24px;
}
.ti-stars {
  color: #f59e0b;
  font-size: 1.3rem;
  letter-spacing: 3px;
  line-height: 1;
}
.ti-rating-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
}
.ti-rating-label strong { color: var(--text); }

.ti-review-btn {
  display: inline-flex;
  align-items: center;
  background: var(--blue);
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  padding: 12px 22px;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.ti-review-btn:hover {
  background: var(--blue-hover);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37,99,235,0.35);
}

@media (max-width: 768px) {
  .testimonials-section { margin: 10px 10px; border-radius: var(--r-md); }
  .ti-header { padding: 36px 16px 28px; }
  .ti-title { font-size: 1.7rem; }
  .ti-summary { flex-direction: column; gap: 14px; }
  .ti-review-btn { width: 100%; justify-content: center; }
  .ti-grid { padding: 24px 16px 28px; gap: 14px; }
}
</style>
