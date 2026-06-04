const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/Home.vue');
let content = fs.readFileSync(filePath, 'utf8');

const newCSS = `<style scoped>
/* ── HERO ── */
.principal {
  background: url('../assets/img/bannerssss.webp') center/cover no-repeat;
  position: relative;
  overflow: hidden;
  min-height: 500px;
  border-radius: var(--r-lg);
  margin-top: 12px;
}
.principal::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(15,23,41,0.75) 0%, rgba(37,99,235,0.35) 100%);
  border-radius: inherit;
  z-index: 1;
  pointer-events: none;
}
.principal > * { position: relative; z-index: 2; }
.prof {
  color: var(--white);
  text-shadow: 0 2px 12px rgba(0,0,0,0.5);
}
.textAnimation {
  background: linear-gradient(90deg, #60a5fa 0%, #93c5fd 50%, #60a5fa 100%);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textclip 4s linear infinite;
  display: inline-block;
}
.formulario {
  background: rgba(15,23,41,0.88);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: var(--r-md) !important;
}
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.28);
  color: var(--white);
  padding: 5px 16px;
  border-radius: 20px;
  font-size: 0.82rem;
  font-family: 'Raleway', sans-serif;
  backdrop-filter: blur(4px);
}

/* ── NOSOTROS ── */
.texto-principal-nosotros {
  background: var(--slate);
  margin: 15px 15px 0;
  padding: 32px 28px 24px;
  border-radius: var(--r-lg) var(--r-lg) 0 0;
  font-family: 'Raleway', sans-serif;
}
.imagen-nosotros {
  border-radius: var(--r-md);
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  margin-bottom: 20px;
}
.imagen-descripcion {
  font-family: 'Anton', sans-serif;
  color: var(--text);
  font-size: 1.9rem;
  display: block;
  height: auto;
  line-height: 1.2;
  margin-top: 8px;
}
.titulo-descripcion { display: flex; align-items: flex-start; }
.parrafogratuito2 {
  font-family: 'Raleway', sans-serif;
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.8;
  text-align: justify;
  margin-top: 10px;
  padding: 0;
}

/* ── ACCORDION ── */
.accordion {
  background: var(--slate);
  margin: 0 15px;
  border-radius: 0 0 var(--r-lg) var(--r-lg);
  border: none;
}
.accordion-item {
  background: var(--slate);
  border-color: var(--border);
}
.accordion-button {
  background: var(--slate) !important;
  color: var(--text);
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: none !important;
}
.accordion-button:not(.collapsed) {
  color: var(--blue);
  background: var(--blue-pale) !important;
}

/* ── STATS ── */
.section3 {
  background: var(--white);
  margin: 0 15px;
  padding: 4px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.stats-row { padding: 4px 0; }
.stat-item { padding: 22px 12px; }
.stat-number {
  display: block;
  font-family: 'Anton', sans-serif;
  font-size: 2.4rem;
  color: var(--blue);
  line-height: 1;
}
.stat-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 5px;
  margin-bottom: 0;
}

/* ── ADVANTAGES ── */
.advantages-bar {
  background: var(--navy);
  border-radius: var(--r-lg);
  padding: 30px 12px;
  margin: 0 15px;
}
.advantage-item {
  padding: 18px 10px;
  border-right: 1px solid rgba(255,255,255,0.06);
}
.advantage-item:last-child { border-right: none; }
.advantage-icon {
  font-size: 1.9rem;
  color: var(--blue-light);
  margin-bottom: 10px;
  display: block;
}
.advantage-title {
  color: var(--white);
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 3px;
}
.advantage-desc { color: #94a3b8; font-size: 0.78rem; margin: 0; }

/* ── SERVICES ── */
.texto-principal-servicios {
  background: var(--slate);
  margin: 0 15px 15px;
  padding: 32px 24px 28px;
  border-radius: var(--r-lg);
  font-family: 'Raleway', sans-serif;
}
.subtitulo-grande1,
.subtitulo-grande2,
.subtitulo-grande3,
.subtitulo-grande4 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 12px;
  padding-left: 12px;
  line-height: 1.3;
}
.subtitulo-grande1 { color: #60a5fa; border-left: 4px solid #60a5fa; }
.subtitulo-grande2 { color: #34d399; border-left: 4px solid #34d399; }
.subtitulo-grande3 { color: #a78bfa; border-left: 4px solid #a78bfa; }
.subtitulo-grande4 { color: #fb923c; border-left: 4px solid #fb923c; }
.card {
  border-radius: var(--r-md) !important;
  overflow: hidden;
  border: none !important;
  box-shadow: var(--shadow-md);
  transition: transform var(--t), box-shadow var(--t);
}
.card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.card.bg-dark, .card.bg-gray-600, .card.bg-gray-900 {
  background: var(--navy-2) !important;
}
.card-img-top { height: 210px; object-fit: cover; }

/* ── TESTIMONIALS ── */
.testimonials-section {
  background: var(--white);
  border-radius: var(--r-lg);
  padding: 48px 20px 40px;
}
.testimonials-title {
  font-family: 'Anton', sans-serif;
  color: var(--text);
  font-size: 1.9rem;
  letter-spacing: 1px;
}
.testimonial-card {
  background: var(--slate);
  border-radius: var(--r-md);
  padding: 24px;
  height: 100%;
  border: 1px solid var(--border);
  transition: transform var(--t), box-shadow var(--t);
}
.testimonial-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.stars { color: #f59e0b; font-size: 1rem; letter-spacing: 2px; }
.testimonial-text {
  font-family: 'Raleway', sans-serif;
  color: var(--text-muted);
  font-size: 0.93rem;
  line-height: 1.75;
  font-style: italic;
  margin-bottom: 18px;
}
.testimonial-author strong {
  font-family: 'Raleway', sans-serif;
  color: var(--text);
  font-size: 0.92rem;
}
.testimonial-author span { font-size: 0.8rem; }

/* ── PRICING ── */
.section2 { background: var(--slate); border-radius: var(--r-lg); margin: 0; }
.pricing-card-title {
  font-family: 'Anton', sans-serif;
  color: var(--text);
  font-size: 1.75rem;
}
.card.mb-4 {
  border: 1px solid var(--border) !important;
  background: var(--white) !important;
  box-shadow: var(--shadow-sm);
}
.card.mb-4:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
.card-header {
  background: var(--navy) !important;
  border-bottom: 3px solid var(--blue) !important;
}
.card-header h4 {
  color: var(--white);
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
}
ul li { font-size: 0.92rem; color: var(--text-muted); }

/* ── WHATSAPP FLOAT ── */
.whatsapp-float {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 56px;
  height: 56px;
  background: #25D366;
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  box-shadow: 0 4px 16px rgba(37,211,102,0.45);
  z-index: 999;
  transition: transform var(--t), box-shadow var(--t);
  text-decoration: none;
}
.whatsapp-float:hover {
  transform: scale(1.12);
  box-shadow: 0 6px 24px rgba(37,211,102,0.6);
  color: var(--white);
}

/* ── ANIMATIONS ── */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }

/* ── KEYFRAMES ── */
@keyframes textclip { to { background-position: 200% center; } }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .principal { min-height: 360px; border-radius: var(--r-md); }
  .texto-principal-nosotros { margin: 10px 10px 0; padding: 24px 16px 16px; }
  .accordion { margin: 0 10px; }
  .section3 { margin: 0 10px; }
  .advantages-bar { margin: 0 10px; border-radius: var(--r-md); }
  .advantage-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .advantage-item:last-child { border-bottom: none; }
  .texto-principal-servicios { margin: 0 10px 10px; padding: 24px 14px 20px; border-radius: var(--r-md); }
  .card-img-top { height: 170px; }
  .stat-number { font-size: 2rem; }
  .subtitulo-grande1,.subtitulo-grande2,.subtitulo-grande3,.subtitulo-grande4 { font-size: 1.15rem; }
}
</style>`;

content = content.replace(/<style scoped>[\s\S]*<\/style>/, newCSS);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Done. Lines: ' + content.split('\n').length);
