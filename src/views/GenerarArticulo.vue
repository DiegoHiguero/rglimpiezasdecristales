<template>
  <div class="ga-wrap">

    <div class="ga-header">
      <div>
        <span class="ga-chip">Panel Admin</span>
        <h1 class="ga-title">Generar <span class="ga-accent">Artículo</span></h1>
        <p class="ga-sub">Rellena los datos, copia el prompt y pégalo en <strong>claude.ai</strong></p>
      </div>
      <a href="https://claude.ai" target="_blank" rel="noopener" class="ga-btn ga-btn--blue">
        <font-awesome-icon :icon="['fas', 'arrow-up-right-from-square']" />
        Abrir Claude.ai
      </a>
    </div>

    <!-- Datos -->
    <div class="ga-card">
      <div class="ga-card-head">
        <span class="ga-card-title">
          <font-awesome-icon :icon="['fas', 'file-pen']" class="me-2" />
          Personalizar prompt
        </span>
      </div>
      <div class="ga-card-body">
        <div class="ga-grid">
          <div class="ga-field">
            <label class="ga-label">Tipo de artículo</label>
            <select class="ga-select" v-model="form.tipo">
              <option value="Guía práctica tipo Cómo hacer, con consejos paso a paso">Guía práctica (Cómo hacer…)</option>
              <option value="Artículo sobre frecuencia y mantenimiento recomendado">Frecuencia y mantenimiento</option>
              <option value="Artículo comparativo orientado a contratar servicios profesionales">Comparativo y contratación</option>
            </select>
          </div>
          <div class="ga-field">
            <label class="ga-label">Temporada</label>
            <select class="ga-select" v-model="form.temporada" @change="updateKeyword">
              <option>Primavera</option>
              <option>Verano</option>
              <option>Otoño</option>
              <option>Invierno</option>
            </select>
          </div>
          <div class="ga-field ga-field--full">
            <label class="ga-label">Tema concreto</label>
            <input class="ga-input" v-model="form.tema"
              placeholder="Ej: escaparates de tiendas, cristales de oficinas, fachadas de edificios…" />
          </div>
          <div class="ga-field ga-field--full">
            <label class="ga-label">Palabra clave principal</label>
            <input class="ga-input" v-model="form.keyword" />
          </div>
        </div>
      </div>
    </div>

    <!-- Prompt listo -->
    <div class="ga-card">
      <div class="ga-card-head">
        <span class="ga-card-title">
          <font-awesome-icon :icon="['fas', 'copy']" class="me-2" />
          Prompt para Claude.ai
        </span>
        <button class="ga-btn ga-btn--blue" @click="copyPrompt">
          <font-awesome-icon :icon="['fas', copied ? 'check' : 'copy']" />
          {{ copied ? '¡Copiado!' : 'Copiar prompt' }}
        </button>
      </div>
      <div class="ga-card-body">
        <pre class="ga-prompt">{{ prompt }}</pre>
      </div>
    </div>

    <!-- Instrucciones -->
    <div class="ga-steps">
      <div class="ga-step">
        <span class="ga-step-num">1</span>
        <span>Rellena los datos de arriba y pulsa <strong>Copiar prompt</strong></span>
      </div>
      <div class="ga-step">
        <span class="ga-step-num">2</span>
        <span>Ve a <strong>claude.ai</strong>, abre una conversación nueva y pega el prompt</span>
      </div>
      <div class="ga-step">
        <span class="ga-step-num">3</span>
        <span>Claude devuelve un bloque JSON — cópialo y pégalo dentro del array <code>articles</code> en <code>src/data/blog.js</code></span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const KEYWORDS = {
  Primavera: 'limpieza de cristales en primavera',
  Verano:    'limpieza de cristales en verano',
  Otoño:     'limpieza de cristales en otoño',
  Invierno:  'limpieza de cristales en invierno',
};

const form = ref({
  tipo:      'Guía práctica tipo Cómo hacer, con consejos paso a paso',
  temporada: 'Primavera',
  tema:      '',
  keyword:   KEYWORDS['Primavera'],
});

const copied = ref(false);

function updateKeyword() {
  form.value.keyword = KEYWORDS[form.value.temporada] || '';
}

const prompt = computed(() => `Eres el redactor SEO de Royall Clean, empresa de limpiacristales en Madrid (tel: 696 169 435).

Escribe un artículo de blog en español con estos datos:
- Tipo: ${form.value.tipo}
- Temporada: ${form.value.temporada}
- Tema: ${form.value.tema || '[escribe el tema]'}
- Palabra clave: ${form.value.keyword}

Requisitos:
- Entre 1.000 y 1.400 palabras
- Estructura con <h2> y <h3>
- Menciona Madrid al menos 2 veces de forma natural
- Llamada a la acción al final hacia Royall Clean con el teléfono 696 169 435
- Usa SOLO estas etiquetas HTML: <p>, <h2>, <h3>, <ul>, <li>, <strong>
- Tono profesional y cercano, orientado a comercios, oficinas y comunidades de vecinos

Devuelve ÚNICAMENTE un objeto JSON válido, sin texto adicional:
{
  "title": "título del artículo (máximo 65 caracteres)",
  "slug": "slug-en-kebab-case-sin-tildes",
  "excerpt": "resumen de 2-3 frases atractivas (máximo 250 caracteres)",
  "metaDescription": "meta description SEO con la keyword (máximo 155 caracteres)",
  "content": "<h2>...</h2><p>contenido HTML completo del artículo</p>"
}`);

async function copyPrompt() {
  await navigator.clipboard.writeText(prompt.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2500);
}
</script>

<style scoped>
.ga-wrap {
  min-height: 100vh;
  background: var(--slate, #0d1526);
  padding: 36px 24px 60px;
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ga-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.ga-chip {
  display: inline-block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #60a5fa;
  background: rgba(96,165,250,0.1);
  border: 1px solid rgba(96,165,250,0.2);
  border-radius: 20px;
  padding: 3px 14px;
  margin-bottom: 10px;
}
.ga-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.2rem;
  color: #f1f5f9;
  margin: 0 0 4px;
  line-height: 1.1;
}
.ga-accent { color: #60a5fa; }
.ga-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #64748b;
  margin: 0;
}

.ga-card {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  overflow: hidden;
}
.ga-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.ga-card-title {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  color: #e2e8f0;
}
.ga-card-body { padding: 20px; }

.ga-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.ga-field { display: flex; flex-direction: column; gap: 6px; }
.ga-field--full { grid-column: 1 / -1; }
.ga-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.ga-input, .ga-select {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #e2e8f0;
  background: #080d1a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 9px 12px;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}
.ga-input:focus, .ga-select:focus { border-color: rgba(96,165,250,0.5); }

.ga-prompt {
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  color: #94a3b8;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  line-height: 1.6;
}

.ga-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
  text-decoration: none;
  white-space: nowrap;
}
.ga-btn--blue { background: #2563eb; color: #fff; }
.ga-btn--blue:hover { background: #1d4ed8; }

.ga-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ga-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #64748b;
  padding: 12px 16px;
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
}
.ga-step-num {
  flex-shrink: 0;
  width: 24px; height: 24px;
  background: rgba(96,165,250,0.12);
  color: #60a5fa;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
  font-size: 0.78rem;
}
.ga-step strong { color: #e2e8f0; }
.ga-step code {
  background: rgba(96,165,250,0.08);
  color: #60a5fa;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.75rem;
}

@media (max-width: 640px) {
  .ga-wrap { padding: 24px 12px 48px; }
  .ga-grid { grid-template-columns: 1fr; }
  .ga-field--full { grid-column: 1; }
  .ga-title { font-size: 1.7rem; }
}
</style>
