<template>
  <div class="faq-section">
    <span class="svc-label"><font-awesome-icon :icon="['fas', 'comments']" class="me-1" />Frequently asked questions</span>
    <div class="faq-header">
      <h2 class="faq-title">What people <span class="faq-accent">ask us most</span></h2>
      <p class="faq-sub">Everything you need to know before requesting your quote</p>
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
  { q: 'How much does window cleaning cost?', a: 'Guide prices start from €15 for small shops, €50 for flats and €75 for houses. Every quote is free and tailored to you — get in touch and we\'ll reply within 24 hours.' },
  { q: 'How often should I clean my windows?', a: 'For commercial premises we recommend monthly or fortnightly cleaning to keep an impeccable image. For homes and residential communities, every 2-3 months is usually enough.' },
  { q: 'Which areas of Madrid do you cover?', a: 'We cover Madrid city and its entire metropolitan area: Getafe, Leganés, Móstoles, Alcorcón, Majadahonda, Pozuelo, Las Rozas and surrounding areas.' },
  { q: 'How do I request a quote?', a: 'You can contact us through the form, via WhatsApp on 696 169 435, or by calling us. We\'ll send you a quote within 24 hours.' },
  { q: 'Can you clean windows at height?', a: 'Yes. We work with professional telescopic poles and pure-water systems that let us safely clean up to 4-5 storeys without scaffolding.' },
  { q: 'What does the service include?', a: 'The service includes a full clean of interior and exterior glass, frames, seals and railings. We use 100% eco-friendly products and demineralised water.' },
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
  color: var(--blue-hover);
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
