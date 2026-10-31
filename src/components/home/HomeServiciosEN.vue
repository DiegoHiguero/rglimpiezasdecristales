<template>
  <div class="svc-section" id="services">

    <span class="sec-label"><font-awesome-icon :icon="['fas', 'hand-sparkles']" class="me-1" />What we do</span>
    <div class="sec-head">
      <h2 class="sec-title">Professional <span class="sec-accent">cleaning</span> for every space</h2>
      <p class="sec-sub">We work without disrupting your day, at home or at your business</p>
    </div>

    <!-- Móvil: chips para saltar a un servicio del carrusel -->
    <div class="svc-chips" v-if="esMovil && etiquetas.length" ref="chipsRef">
      <button v-for="(et, i) in etiquetas" :key="et" type="button" class="svc-chip"
              :class="{ 'svc-chip--on': activo === i }" @click="irA(i)">{{ et }}</button>
    </div>

    <div class="svc-grid-wrap">
    <div class="svc-grid" ref="gridRef" @scroll.passive="onScroll">

      <div class="svc-card svc-card--featured animate-on-scroll">
        <div class="svc-featured-badge">
          <font-awesome-icon :icon="['fas', 'trophy']" class="me-1" />Exclusive service
        </div>
        <div class="svc-img-wrap">
          <img src="../../assets/img/20261006-pertiga-fachada.webp" class="svc-img" alt="Window cleaning at height with a telescopic pole and pure water" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--teal">Height</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--teal"><font-awesome-icon :icon="['fas', 'droplet']" /></span>
            <h3 class="svc-name">Cleaning at height: pole and pure water</h3>
          </div>
          <p class="svc-desc">Windows and façades with no scaffolding: telescopic pole up to 4 storeys and Unger HydroPower pure water up to 10 metres, streak-free.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Telescopic pole up to 4 storeys</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Unger HydroPower pure water up to 10 m</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />No scaffolding, no streaks</li>
          </ul>
          <router-link to="/agua-pura-altura" class="svc-btn">Learn more</router-link>
        </div>
      </div>

      <div class="svc-card animate-on-scroll">
        <div class="svc-img-wrap">
          <img src="../../assets/img/casamadera.webp" class="svc-img" alt="Window cleaning for homes" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--green">Homes</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--green"><font-awesome-icon :icon="['fas', 'house']" /></span>
            <h3 class="svc-name">Houses and flats</h3>
          </div>
          <p class="svc-desc">Sparkling houses and flats. Windows, balconies and terraces with the utmost care.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Interior and exterior included</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Frames, seals and railings</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />100% eco-friendly products</li>
          </ul>
          <router-link to="/limpieza-cristales-hogares" class="svc-btn">Learn more</router-link>
        </div>
      </div>

      <div class="svc-card animate-on-scroll">
        <div class="svc-img-wrap">
          <img src="../../assets/img/restaurant.webp" class="svc-img" alt="Window cleaning for businesses" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--blue">Businesses</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--blue"><font-awesome-icon :icon="['fas', 'store']" /></span>
            <h3 class="svc-name">Shops and commercial premises</h3>
          </div>
          <p class="svc-desc">Shop windows and glazing of street-level shops, bars and cafés, always spotless without disrupting your business.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Shop windows, glazing and doors</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Cleaning without closing your business</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Fortnightly or monthly frequency</li>
          </ul>
          <router-link to="/limpieza-cristales-locales-comerciales" class="svc-btn">Learn more</router-link>
        </div>
      </div>

      <div class="svc-card animate-on-scroll">
        <div class="svc-img-wrap">
          <img src="../../assets/img/comunidad-pertiga-fachada-h.webp" class="svc-img" alt="Window cleaning for residential communities" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--indigo">Communities</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--indigo"><font-awesome-icon :icon="['fas', 'building-columns']" /></span>
            <h3 class="svc-name">Residential communities</h3>
          </div>
          <p class="svc-desc">Entrances, stairwells and common-area glass with regular maintenance for the whole community.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Invoice for the community</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Maintenance contract</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Quotes for property managers</li>
          </ul>
          <router-link to="/limpieza-cristales-comunidades" class="svc-btn">Learn more</router-link>
        </div>
      </div>

      <TransitionGroup name="svc-reveal">

          <div class="svc-card svc-card--extra" data-stagger="1" v-if="mostrarTodas" key="oficinas">
            <div class="svc-img-wrap">
              <img src="../../assets/img/unger-oficinas.webp" class="svc-img" style="object-position: center top" alt="Window cleaning for companies" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--purple">Companies</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--purple"><font-awesome-icon :icon="['fas', 'building']" /></span>
                <h3 class="svc-name">Offices and buildings</h3>
              </div>
              <p class="svc-desc">Large glazed areas in offices, buildings and industrial units, inside and out, on a fixed schedule.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Large glass walls and partitions</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Schedules adapted to your business</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Contract and business invoicing</li>
              </ul>
              <router-link to="/limpieza-cristales-oficinas" class="svc-btn">Learn more</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="2" v-if="mostrarTodas" key="presion">
            <div class="svc-img-wrap">
              <img src="../../assets/img/presion.webp" class="svc-img" alt="Pressure washing of patios and terraces" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--orange">Pressure washing</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--orange"><font-awesome-icon :icon="['fas', 'shower']" /></span>
                <h3 class="svc-name">Pressure washing</h3>
              </div>
              <p class="svc-desc">Patios, terraces, façades, awnings and outdoor floors like new, with the right pressure for each surface.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Patios, terraces and outdoor floors</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Façades, walls and awnings</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Pressure adapted to each material</li>
              </ul>
              <router-link to="/limpieza-agua-a-presion" class="svc-btn">Learn more</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="3" v-if="mostrarTodas" key="placas">
            <div class="svc-img-wrap">
              <img src="../../assets/img/limpieza-panel-thumb.webp" class="svc-img" alt="Solar panel cleaning" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--yellow">Solar panels</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--yellow"><font-awesome-icon :icon="['fas', 'solar-panel']" /></span>
                <h3 class="svc-name">Solar panels</h3>
              </div>
              <p class="svc-desc">Accumulated dirt can cut efficiency by up to 25%. Cleaned with demineralised water.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Streak-free demineralised water</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />No harsh chemicals</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Regular maintenance</li>
              </ul>
              <router-link to="/limpieza-placas-solares" class="svc-btn">Learn more</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="4" v-if="mostrarTodas" key="obras">
            <div class="svc-img-wrap">
              <img src="../../assets/img/20260323_184851.webp" class="svc-img" alt="Post-construction cleaning" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--cyan">Post-construction</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--cyan"><font-awesome-icon :icon="['fas', 'broom']" /></span>
                <h3 class="svc-name">Post-construction cleaning</h3>
              </div>
              <p class="svc-desc">After a renovation, we leave the space move-in ready: dust, paint and adhesives gone.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Dust and construction debris</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Removal of adhesives and paint</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Windows, floors and tiles</li>
              </ul>
              <router-link to="/limpieza-fin-de-obra" class="svc-btn">Learn more</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="5" v-if="mostrarTodas" key="grafitis">
            <div class="svc-img-wrap">
              <img src="../../assets/img/grafitis.webp" class="svc-img" alt="Graffiti removal" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--rose">Graffiti</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--rose"><font-awesome-icon :icon="['fas', 'spray-can']" /></span>
                <h3 class="svc-name">Graffiti removal</h3>
              </div>
              <p class="svc-desc">We remove graffiti from façades, walls and street furniture without damaging the original surface.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Façades and walls</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Entrances and common areas</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />No damage to the surface</li>
              </ul>
              <router-link to="/limpieza-grafitis" class="svc-btn">Learn more</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="6" v-if="mostrarTodas" key="vinilos">
            <div class="svc-img-wrap">
              <img src="../../assets/img/vinilo.webp" class="svc-img" alt="Vinyl removal from shop windows" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--fuchsia">Vinyl</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--fuchsia"><font-awesome-icon :icon="['fas', 'scissors']" /></span>
                <h3 class="svc-name">Vinyl removal</h3>
              </div>
              <p class="svc-desc">We remove vinyl from shop windows and glass without leaving residue or scratching the glass.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Shop windows and glazing</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />No scratching or damage to the glass</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Adhesive residue removal</li>
              </ul>
              <router-link to="/retirada-de-vinilos" class="svc-btn">Learn more</router-link>
            </div>
          </div>

      </TransitionGroup>
    </div>

    <div class="svc-fade-mask" :class="{ 'svc-fade-mask--hidden': mostrarTodas }"></div>
    </div>

    <!-- Móvil: puntos indicadores del carrusel -->
    <div class="svc-dots" v-if="esMovil && etiquetas.length" aria-hidden="true">
      <span v-for="(et, i) in etiquetas" :key="et" class="svc-dot" :class="{ 'svc-dot--on': activo === i }"></span>
    </div>

    <div class="svc-footer" v-if="!esMovil">
      <button type="button" class="svc-toggle-btn" :class="{ 'svc-toggle-btn--open': showAll }" @click="showAll = !showAll">
        <span class="svc-toggle-text">{{ showAll ? 'Show less' : 'See more services' }}</span>
        <span class="svc-toggle-badge" v-if="!showAll">+{{ extraCount }}</span>
        <span class="svc-toggle-icon"><font-awesome-icon :icon="['fas', 'chevron-down']" /></span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
const showAll = ref(false);
const extraCount = 6;

// En móvil las tarjetas van en un carrusel horizontal con todos los servicios
// (sin "Ver más"), chips para saltar a uno y puntos que marcan la posición.
const esMovil = ref(false);
const mostrarTodas = computed(() => showAll.value || esMovil.value);
const gridRef = ref(null);
const chipsRef = ref(null);
const etiquetas = ref([]);
const activo = ref(0);
let mq = null;

const tarjetas = () => (gridRef.value ? [...gridRef.value.querySelectorAll('.svc-card')] : []);

const leerEtiquetas = async () => {
  await nextTick();
  etiquetas.value = tarjetas().map((c) => c.querySelector('.svc-tag')?.textContent.trim() || '');
};

const irA = (i) => {
  const cards = tarjetas();
  if (!cards[i]) return;
  gridRef.value.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: 'smooth' });
};

const onScroll = () => {
  if (!esMovil.value) return;
  const cards = tarjetas();
  if (cards.length < 2) return;
  const paso = cards[1].offsetLeft - cards[0].offsetLeft;
  const i = Math.max(0, Math.min(cards.length - 1, Math.round(gridRef.value.scrollLeft / paso)));
  if (i !== activo.value) {
    activo.value = i;
    // El chip activo se mantiene visible en su fila (sin mover la página)
    const chip = chipsRef.value?.children[i];
    if (chip) chipsRef.value.scrollTo({ left: chip.offsetLeft - chipsRef.value.clientWidth / 2 + chip.clientWidth / 2, behavior: 'smooth' });
  }
};

const actualizarMovil = (e) => { esMovil.value = e.matches; };
watch(esMovil, (v) => { if (v) leerEtiquetas(); activo.value = 0; });

onMounted(() => {
  mq = window.matchMedia('(max-width: 768px)');
  esMovil.value = mq.matches;
  mq.addEventListener('change', actualizarMovil);
  if (esMovil.value) leerEtiquetas();
});
onUnmounted(() => mq?.removeEventListener('change', actualizarMovil));
</script>

<style scoped>
.svc-section {
  scroll-margin-top: 88px;
  background: var(--white);
  margin: 12px 20px;
  padding: 40px 28px 32px;
  border-radius: var(--r-lg);
}

/* ── Header ── */

/* ── Grid ── */
.svc-grid-wrap { position: relative; }
.svc-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.svc-fade-mask {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 70px;
  background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--white) 85%);
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.3s ease;
}
.svc-fade-mask--hidden { opacity: 0; }

/* ── Card ── */
.svc-card {
  background: var(--navy-2);
  border-radius: var(--r-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid rgba(255,255,255,0.06);
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}
.svc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 24px 56px rgba(0,0,0,0.38);
  border-color: rgba(255,255,255,0.13);
}
.svc-card--featured { border-color: rgba(251,146,60,0.35); }

.svc-featured-badge {
  position: absolute;
  top: -1px; left: 50%;
  transform: translateX(-50%);
  background: #f97316;
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 16px;
  border-radius: 0 0 10px 10px;
  white-space: nowrap;
  z-index: 2;
}

/* ── Image ── */
.svc-img-wrap { position: relative; flex-shrink: 0; }
.svc-img { width: 100%; height: 200px; object-fit: cover; display: block; }
.svc-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10,16,30,0.85) 0%, transparent 60%);
}
.svc-tag {
  position: absolute;
  bottom: 14px; left: 16px;
  font-family: 'Anton', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
  line-height: 1;
}
/* Un solo color para todas las tarjetas: la foto ya las distingue */
.svc-tag { color: #fff; }

/* ── Body ── */
.svc-body {
  padding: 20px 20px 22px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.svc-body-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.svc-icon {
  width: 40px; height: 40px;
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}
.svc-icon { background: rgba(96,165,250,0.14); color: #60a5fa; }

.svc-name {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: #f1f5f9;
  margin: 0;
  line-height: 1.2;
}

.svc-desc {
  font-family: 'Raleway', sans-serif;
  color: rgba(255,255,255,0.55);
  font-size: 0.85rem;
  line-height: 1.7;
  margin: 0 0 16px;
}

/* ── Feature list ── */
.svc-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.svc-list li {
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  gap: 9px;
}
.svc-check {
  color: #60a5fa;
  font-size: 0.65rem;
  flex-shrink: 0;
  background: rgba(96,165,250,0.14);
  width: 18px; height: 18px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

/* ── CTA buttons ── */
.svc-btn {
  display: block;
  text-align: center;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
  border: 1.5px solid transparent;
  transition: background 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s;
}
.svc-btn { color: #93c5fd; border-color: rgba(96,165,250,0.35); background: rgba(96,165,250,0.07); }

.svc-btn:hover { background: var(--blue); border-color: var(--blue); color: #fff; }
.svc-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,0,0,0.25); }

.svc-btn-secondary {
  display: block;
  text-align: center;
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  font-size: 0.78rem;
  color: rgba(255,255,255,0.55);
  text-decoration: underline;
  margin-bottom: 10px;
}
.svc-btn-secondary:hover { color: rgba(255,255,255,0.85); }

/* Sin difuminado sobre las últimas tarjetas: el botón "Ver más" ya indica que hay más */
.svc-fade-mask { display: none; }

/* Modo claro: tarjetas claras como las del blog (la foto conserva su degradado) */
:root:not([data-theme="dark"]) .svc-card { background: var(--slate); border-color: var(--border); }
:root:not([data-theme="dark"]) .svc-card:hover { box-shadow: 0 16px 36px rgba(15,23,41,0.12); border-color: #cbd5e1; }
:root:not([data-theme="dark"]) .svc-card--featured { border-color: rgba(249,115,22,0.45); }
:root:not([data-theme="dark"]) .svc-name { color: var(--text); }
:root:not([data-theme="dark"]) .svc-desc { color: var(--text-muted); }
:root:not([data-theme="dark"]) .svc-list li { color: #334155; }
:root:not([data-theme="dark"]) .svc-icon,
:root:not([data-theme="dark"]) .svc-check { background: var(--blue-pale); color: var(--blue); }
:root:not([data-theme="dark"]) .svc-btn { color: var(--blue); border-color: rgba(37,99,235,0.3); background: #fff; }
:root:not([data-theme="dark"]) .svc-btn:hover { color: #fff; border-color: var(--blue); background: var(--blue); box-shadow: 0 6px 18px rgba(37,99,235,0.25); }
:root:not([data-theme="dark"]) .svc-btn-secondary { color: var(--text-muted); }
:root:not([data-theme="dark"]) .svc-btn-secondary:hover { color: var(--text); }

/* ── Footer strip ── */
.svc-footer {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
.svc-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.87rem;
  color: var(--blue-hover);
  background: var(--blue-pale);
  border: 1.5px solid rgba(37,99,235,0.2);
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s;
}
.svc-toggle-btn:hover {
  background: var(--white);
  border-color: var(--blue);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(37,99,235,0.18);
}
.svc-toggle-btn--open {
  background: var(--white);
  border-color: var(--border);
  color: var(--text-muted);
}
.svc-toggle-btn--open:hover { border-color: var(--text-muted); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
.svc-toggle-badge {
  background: var(--blue);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 20px;
  line-height: 1.5;
}
.svc-toggle-icon { display: flex; transition: transform 0.35s ease; }
.svc-toggle-btn--open .svc-toggle-icon { transform: rotate(180deg); }

/* ── Reveal transition (TransitionGroup) ── */
.svc-reveal-enter-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.svc-reveal-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.svc-reveal-enter-from,
.svc-reveal-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
.svc-card--extra[data-stagger="1"].svc-reveal-enter-active { transition-delay: 0ms; }
.svc-card--extra[data-stagger="2"].svc-reveal-enter-active { transition-delay: 60ms; }
.svc-card--extra[data-stagger="3"].svc-reveal-enter-active { transition-delay: 120ms; }
.svc-card--extra[data-stagger="4"].svc-reveal-enter-active { transition-delay: 180ms; }
.svc-card--extra[data-stagger="5"].svc-reveal-enter-active { transition-delay: 240ms; }
.svc-card--extra[data-stagger="6"].svc-reveal-enter-active { transition-delay: 300ms; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .svc-section { margin: 10px 10px; padding: 32px 14px 24px; border-radius: var(--r-md); }
  .svc-toggle-btn { width: 100%; justify-content: center; }

  /* Carrusel horizontal: asoma la siguiente tarjeta para que se note que hay más */
  .svc-grid {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 14px;
    margin: 0 -14px;
    padding: 4px 14px 6px;
    scrollbar-width: none;
  }
  .svc-grid::-webkit-scrollbar { display: none; }
  .svc-grid .svc-card {
    flex: 0 0 84%;
    scroll-snap-align: start;
    opacity: 1;
    transform: none;
  }
  /* Tarjeta compacta: foto más baja y textos más juntos */
  .svc-grid .svc-img { height: 140px; }
  .svc-grid .svc-body { padding: 14px 16px 16px; }
  .svc-grid .svc-desc { line-height: 1.5; margin-bottom: 10px; font-size: 0.82rem; }
  .svc-grid .svc-list { margin-bottom: 12px; gap: 6px; }
  .svc-grid .svc-list li { font-size: 0.8rem; }
  .svc-grid .svc-btn-secondary { margin-bottom: 6px; }
  .svc-grid .svc-btn { padding: 9px 14px; }
  .svc-fade-mask { display: none; }

  .svc-chips {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    margin: 0 -14px 14px;
    padding: 2px 14px;
    scrollbar-width: none;
  }
  .svc-chips::-webkit-scrollbar { display: none; }
  .svc-chip {
    flex: none;
    font-family: 'Raleway', sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-muted);
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 6px 14px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .svc-chip--on { background: var(--blue); border-color: var(--blue); color: #fff; }

  .svc-dots { display: flex; justify-content: center; gap: 6px; margin-top: 14px; }
  .svc-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border); transition: width 0.25s, background 0.25s; }
  .svc-dot--on { width: 20px; border-radius: 4px; background: var(--blue); }
}
</style>
