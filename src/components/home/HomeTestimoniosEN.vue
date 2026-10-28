<template>
  <div class="testimonials-section">

    <span class="ti-label">
      <svg class="g-icon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Verified Google reviews
    </span>

    <div class="ti-header">
      <h2 class="ti-title">What <span class="ti-accent">our clients say</span></h2>
      <p class="ti-sub">Real reviews, no filters or touch-ups</p>
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

  const observer = new MutationObserver(() => {
    const container = widgetContainer.value;
    if (!container) return;
    container.querySelectorAll('*').forEach(el => {
      if (el.children.length === 0 && el.textContent.trim() === 'Here is what our customers say') {
        el.style.display = 'none';
        observer.disconnect();
      }
    });
  });

  if (widgetContainer.value) {
    observer.observe(widgetContainer.value, { childList: true, subtree: true });
  }
});
</script>

<style scoped>
.testimonials-section {
  background: var(--white);
  margin: 12px 20px;
  border-radius: var(--r-lg);
  overflow: hidden;
  padding: 40px 28px 0;
}

/* ── Header ── */
.ti-header {
  text-align: center;
  padding: 0 0 8px;
}

.ti-label {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 7px;
  background: var(--blue-pale);
  color: var(--blue-hover);
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

@media (max-width: 768px) {
  .testimonials-section { margin: 10px 10px; border-radius: var(--r-md); padding: 36px 16px 0; }
  .ti-title { font-size: 1.7rem; }
  .ti-grid { padding: 24px 16px 28px; gap: 14px; }
}
</style>
