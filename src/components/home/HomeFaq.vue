<template>
  <div class="faq-section">
    <span class="svc-label"><font-awesome-icon :icon="['fas', 'comments']" class="me-1" />Preguntas frecuentes</span>
    <div class="faq-header">
      <h2 class="faq-title">Lo que más nos <span class="faq-accent">preguntan</span></h2>
      <p class="faq-sub">Todo lo que necesitas saber antes de pedir tu presupuesto</p>
    </div>
    <div class="faq-list">
      <div v-for="(item, i) in faqs" :key="i" class="faq-item" :class="{ 'faq-item--open': openFaq === i }">
        <button class="faq-question" @click="openFaq = openFaq === i ? null : i">
          <span>{{ item.q }}</span>
          <font-awesome-icon :icon="['fas', openFaq === i ? 'chevron-up' : 'chevron-down']" class="faq-chevron" />
        </button>
        <div class="faq-answer" v-show="openFaq === i">{{ item.a }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const openFaq = ref(null);

const faqs = [
  { q: '¿Cuánto cuesta la limpieza de cristales?', a: 'Los precios orientativos parten de €15 para locales pequeños, €50 para apartamentos y €75 para chalets. Cada presupuesto es personalizado y gratuito — contáctanos y te respondemos en menos de 24 horas.' },
  { q: '¿Con qué frecuencia debo limpiar los cristales?', a: 'Para locales comerciales recomendamos limpieza mensual o quincenal para mantener una imagen impecable. En hogares y comunidades, cada 2-3 meses suele ser suficiente.' },
  { q: '¿En qué zonas de Madrid trabajáis?', a: 'Cubrimos Madrid capital y toda su área metropolitana: Getafe, Leganés, Móstoles, Alcorcón, Majadahonda, Pozuelo, Las Rozas y alrededores.' },
  { q: '¿Cómo solicito un presupuesto?', a: 'Puedes contactarnos a través del formulario, por WhatsApp al 696 169 435 o llamándonos. Te enviamos el presupuesto en menos de 24 horas.' },
  { q: '¿Podéis limpiar cristales en altura?', a: 'Sí. Trabajamos con pértigas telescópicas profesionales y equipos de agua pura que permiten limpiar con total seguridad hasta 4-5 plantas sin andamios.' },
  { q: '¿Qué incluye el servicio?', a: 'El servicio incluye limpieza completa de cristales interiores y exteriores, marcos, juntas y barandillas. Utilizamos productos 100% ecológicos y agua desmineralizada.' },
];
</script>

<style scoped>
.faq-section {
  background: var(--white);
  margin: 12px 20px;
  padding: 40px 28px 32px;
  border-radius: var(--r-lg);
}
.faq-header { text-align: center; margin-bottom: 24px; }
.svc-label {
  display: block;
  width: fit-content;
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
.faq-title { font-family: 'Anton', sans-serif; font-size: 2rem; color: var(--text); margin: 0 0 10px; }
.faq-accent { color: var(--blue); }
.faq-sub { font-family: 'Raleway', sans-serif; font-size: 0.92rem; color: var(--text-muted); margin: 0; }

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 820px;
  margin: 0 auto;
}
.faq-item {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.faq-item--open {
  border-color: rgba(37,99,235,0.35);
  box-shadow: var(--shadow-sm);
}
.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  background: none;
  border: none;
  padding: 18px 22px;
  cursor: pointer;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--text);
  text-align: left;
  transition: color 0.2s;
}
.faq-item--open .faq-question { color: var(--blue); }
.faq-chevron { color: #94a3b8; font-size: 0.75rem; flex-shrink: 0; transition: color 0.2s; }
.faq-item--open .faq-chevron { color: var(--blue); }
.faq-answer {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.75;
  padding: 0 22px 18px;
}

@media (max-width: 768px) {
  .faq-section { margin: 10px 10px; padding: 36px 14px 28px; border-radius: var(--r-md); }
}
</style>
