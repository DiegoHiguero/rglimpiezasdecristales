<template>
  <div class="svc-section" id="services">

    <span class="svc-label"><font-awesome-icon :icon="['fas', 'hand-sparkles']" class="me-1" />What we do</span>
    <div class="svc-header">
      <h2 class="svc-title">Professional <span class="svc-accent">cleaning</span><br>for every space</h2>
      <p class="svc-subtitle">No scaffolding, no hassle — we work without disrupting your day</p>
    </div>

    <div class="svc-grid-wrap">
    <div class="svc-grid">

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
          <p class="svc-desc">Shops, cafés and stores always spotless, without disrupting your daily activity.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Cleaning without closing your business</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Fortnightly or monthly frequency</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Free custom quote</li>
          </ul>
          <router-link to="/limpieza-cristales-locales-comerciales" class="svc-btn-secondary">Learn more</router-link>
          <router-link to="/en/contact" class="svc-btn svc-btn--blue">Get a quote</router-link>
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
          <router-link to="/limpieza-cristales-hogares" class="svc-btn-secondary">Learn more</router-link>
          <router-link to="/en/contact" class="svc-btn svc-btn--green">Get a quote</router-link>
        </div>
      </div>

      <div class="svc-card animate-on-scroll">
        <div class="svc-img-wrap">
          <img src="../../assets/img/locales.webp" class="svc-img" alt="Window cleaning for companies" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--purple">Companies</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--purple"><font-awesome-icon :icon="['fas', 'building']" /></span>
            <h3 class="svc-name">Offices and buildings</h3>
          </div>
          <p class="svc-desc">Offices, buildings and industrial units. Tailored plans with flexible schedules.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Maintenance contracts</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Schedules adapted to your business</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Business invoicing</li>
          </ul>
          <router-link to="/en/contact" class="svc-btn svc-btn--purple">Get a quote</router-link>
        </div>
      </div>

      <div class="svc-card svc-card--featured animate-on-scroll">
        <div class="svc-featured-badge">
          <font-awesome-icon :icon="['fas', 'bolt']" class="me-1" />Specialised service
        </div>
        <div class="svc-img-wrap">
          <img src="../../assets/img/presion.webp" class="svc-img" alt="Pressure washing" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--orange">Pressure washing</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--orange"><font-awesome-icon :icon="['fas', 'droplet']" /></span>
            <h3 class="svc-name">Façades and outdoor areas</h3>
          </div>
          <p class="svc-desc">Façades, patios and garages free of stubborn dirt. Fast results with professional equipment.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Up to 350 bar of pressure</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Façades, floors and patios</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Immediate, visible results</li>
          </ul>
          <router-link to="/limpieza-cristales-altura" class="svc-btn-secondary">Learn more</router-link>
          <router-link to="/en/contact" class="svc-btn svc-btn--orange">Get a quote</router-link>
        </div>
      </div>

      <TransitionGroup name="svc-reveal">

          <div class="svc-card svc-card--extra" data-stagger="1" v-if="showAll" key="comunidades">
            <div class="svc-img-wrap">
              <img src="../../assets/img/office-buildings.webp" class="svc-img" alt="Window cleaning for residential communities" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--purple">Communities</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--purple"><font-awesome-icon :icon="['fas', 'building-columns']" /></span>
                <h3 class="svc-name">Residential communities</h3>
              </div>
              <p class="svc-desc">Entrances, stairwells and common-area glass with regular maintenance for the whole community.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Invoice for the community</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Maintenance contract</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Quotes for property managers</li>
              </ul>
              <router-link to="/limpieza-cristales-comunidades" class="svc-btn-secondary">Learn more</router-link>
              <router-link to="/en/contact" class="svc-btn svc-btn--purple">Get a quote</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="2" v-if="showAll" key="placas">
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
              <router-link to="/limpieza-placas-solares" class="svc-btn-secondary">Learn more</router-link>
              <router-link to="/en/contact" class="svc-btn svc-btn--yellow">Get a quote</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="3" v-if="showAll" key="obras">
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
              <router-link to="/limpieza-fin-de-obra" class="svc-btn-secondary">Learn more</router-link>
              <router-link to="/en/contact" class="svc-btn svc-btn--cyan">Get a quote</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="4" v-if="showAll" key="grafitis">
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
              <router-link to="/limpieza-grafitis" class="svc-btn-secondary">Learn more</router-link>
              <router-link to="/en/contact" class="svc-btn svc-btn--rose">Get a quote</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="5" v-if="showAll" key="vinilos">
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
              <router-link to="/retirada-de-vinilos" class="svc-btn-secondary">Learn more</router-link>
              <router-link to="/en/contact" class="svc-btn svc-btn--fuchsia">Get a quote</router-link>
            </div>
          </div>

      </TransitionGroup>
    </div>

    <div class="svc-fade-mask" :class="{ 'svc-fade-mask--hidden': showAll }"></div>
    </div>

    <div class="svc-footer">
      <div class="svc-footer-icon">
        <font-awesome-icon :icon="['fas', 'arrow-up-from-water-pump']" />
      </div>
      <p class="svc-footer-text">Got a special case? We also work at height with telescopic poles up to 5 storeys, no scaffolding needed.</p>
      <button type="button" class="svc-toggle-btn" :class="{ 'svc-toggle-btn--open': showAll }" @click="showAll = !showAll">
        <span class="svc-toggle-text">{{ showAll ? 'Show less' : 'See more services' }}</span>
        <span class="svc-toggle-badge" v-if="!showAll">+{{ extraCount }}</span>
        <span class="svc-toggle-icon"><font-awesome-icon :icon="['fas', 'chevron-down']" /></span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
const showAll = ref(false);
const extraCount = 5;
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
.svc-header { text-align: center; margin-bottom: 28px; }
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
  margin-bottom: 14px;
}
.svc-title {
  font-family: 'Anton', sans-serif;
  color: var(--text);
  font-size: 2.6rem;
  line-height: 1.15;
  margin: 0 0 12px;
}
.svc-accent { color: var(--blue); }
.svc-subtitle {
  font-family: 'Raleway', sans-serif;
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0 auto;
  max-width: 500px;
}

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
.svc-tag--blue   { color: #60a5fa; }
.svc-tag--green  { color: #34d399; }
.svc-tag--purple { color: #a78bfa; }
.svc-tag--orange { color: #fb923c; }
.svc-tag--yellow  { color: #facc15; }
.svc-tag--cyan    { color: #22d3ee; }
.svc-tag--rose    { color: #fb7185; }
.svc-tag--fuchsia { color: #e879f9; }

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
.svc-icon--blue   { background: rgba(96,165,250,0.15); color: #60a5fa; }
.svc-icon--green  { background: rgba(52,211,153,0.15); color: #34d399; }
.svc-icon--purple { background: rgba(167,139,250,0.15); color: #a78bfa; }
.svc-icon--orange { background: rgba(251,146,60,0.15); color: #fb923c; }
.svc-icon--yellow  { background: rgba(250,204,21,0.15);  color: #facc15; }
.svc-icon--cyan    { background: rgba(34,211,238,0.15);  color: #22d3ee; }
.svc-icon--rose    { background: rgba(251,113,133,0.15); color: #fb7185; }
.svc-icon--fuchsia { background: rgba(232,121,249,0.15); color: #e879f9; }

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
  color: #34d399;
  font-size: 0.65rem;
  flex-shrink: 0;
  background: rgba(52,211,153,0.12);
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
.svc-btn--blue   { color: #60a5fa; border-color: rgba(96,165,250,0.4);   background: rgba(96,165,250,0.07); }
.svc-btn--green  { color: #34d399; border-color: rgba(52,211,153,0.4);   background: rgba(52,211,153,0.07); }
.svc-btn--purple { color: #a78bfa; border-color: rgba(167,139,250,0.4);  background: rgba(167,139,250,0.07); }
.svc-btn--orange { color: #fb923c; border-color: rgba(251,146,60,0.4);   background: rgba(251,146,60,0.07); }
.svc-btn--yellow  { color: #facc15; border-color: rgba(250,204,21,0.4);  background: rgba(250,204,21,0.07); }
.svc-btn--cyan    { color: #22d3ee; border-color: rgba(34,211,238,0.4);  background: rgba(34,211,238,0.07); }
.svc-btn--rose    { color: #fb7185; border-color: rgba(251,113,133,0.4); background: rgba(251,113,133,0.07); }
.svc-btn--fuchsia { color: #e879f9; border-color: rgba(232,121,249,0.4); background: rgba(232,121,249,0.07); }

.svc-btn--blue:hover    { background: #60a5fa; color: #fff; }
.svc-btn--green:hover   { background: #34d399; color: #fff; }
.svc-btn--purple:hover  { background: #a78bfa; color: #fff; }
.svc-btn--orange:hover  { background: #fb923c; color: #fff; }
.svc-btn--yellow:hover  { background: #facc15; color: #1e293b; }
.svc-btn--cyan:hover    { background: #22d3ee; color: #1e293b; }
.svc-btn--rose:hover    { background: #fb7185; color: #fff; }
.svc-btn--fuchsia:hover { background: #e879f9; color: #1e293b; }
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

/* ── Footer strip ── */
.svc-footer {
  margin-top: 24px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.svc-footer-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: var(--blue-pale);
  color: var(--blue-hover);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}
.svc-footer-text {
  font-family: 'Raleway', sans-serif;
  font-size: 0.87rem;
  color: var(--text-muted);
  margin: 0;
  flex: 1;
  min-width: 200px;
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

/* ── Responsive ── */
@media (max-width: 768px) {
  .svc-section { margin: 10px 10px; padding: 32px 14px 24px; border-radius: var(--r-md); }
  .svc-title { font-size: 1.9rem; }
  .svc-grid { grid-template-columns: 1fr; gap: 12px; }
  .svc-footer { gap: 12px; padding: 16px; }
  .svc-toggle-btn { width: 100%; justify-content: center; }
}
</style>
