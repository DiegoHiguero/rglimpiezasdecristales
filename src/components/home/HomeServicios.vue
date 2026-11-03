<template>
  <div class="svc-section" id="servicios">

    <span class="sec-label"><font-awesome-icon :icon="['fas', 'hand-sparkles']" class="me-1" />Lo que hacemos</span>
    <div class="sec-head">
      <h2 class="sec-title">Limpieza <span class="sec-accent">profesional</span> para cada espacio</h2>
      <p class="sec-sub">Trabajamos sin interrumpir tu día a día, en casa o en tu negocio</p>
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
          <font-awesome-icon :icon="['fas', 'trophy']" class="me-1" />Servicio exclusivo
        </div>
        <div class="svc-img-wrap">
          <img src="../../assets/img/20261006-pertiga-fachada.webp" class="svc-img" alt="Limpieza de cristales en altura con pértiga y agua pura" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--teal">Altura</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--teal"><font-awesome-icon :icon="['fas', 'droplet']" /></span>
            <h3 class="svc-name">Limpieza en altura: pértiga y agua pura</h3>
          </div>
          <p class="svc-desc">Ventanas y fachadas sin andamios: con pértiga hasta 4 plantas y con agua pura Unger HydroPower hasta 10 metros, sin marcas.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Pértiga telescópica hasta 4 plantas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Agua pura Unger HydroPower hasta 10 m</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Sin andamios ni marcas</li>
          </ul>
          <router-link to="/agua-pura-altura" class="svc-btn">Saber más</router-link>
        </div>
      </div>

      <div class="svc-card animate-on-scroll">
        <div class="svc-img-wrap">
          <img src="../../assets/img/casamadera.webp" class="svc-img" alt="Limpieza de cristales en hogares" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--green">Hogares</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--green"><font-awesome-icon :icon="['fas', 'house']" /></span>
            <h3 class="svc-name">Casas y apartamentos</h3>
          </div>
          <p class="svc-desc">Casas y pisos relucientes. Cristales, balcones y terrazas con la máxima dedicación.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Interior y exterior incluidos</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Marcos, juntas y barandillas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Productos 100% ecológicos</li>
          </ul>
          <router-link to="/limpieza-cristales-hogares" class="svc-btn">Saber más</router-link>
        </div>
      </div>

      <div class="svc-card animate-on-scroll">
        <div class="svc-img-wrap">
          <img src="../../assets/img/restaurant.webp" class="svc-img" alt="Limpieza de cristales en negocios" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--blue">Negocios</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--blue"><font-awesome-icon :icon="['fas', 'store']" /></span>
            <h3 class="svc-name">Locales comerciales</h3>
          </div>
          <p class="svc-desc">Escaparates y lunas de tiendas, bares y cafeterías a pie de calle, siempre impecables sin interrumpir tu actividad.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Escaparates, lunas y puertas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Limpieza sin cerrar el negocio</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Frecuencia quincenal o mensual</li>
          </ul>
          <router-link to="/limpieza-cristales-locales-comerciales" class="svc-btn">Saber más</router-link>
        </div>
      </div>

      <div class="svc-card animate-on-scroll">
        <div class="svc-img-wrap">
          <img src="../../assets/img/comunidad-pertiga-fachada-h.webp" class="svc-img" alt="Limpieza de cristales en comunidades de vecinos" />
          <div class="svc-overlay"></div>
          <span class="svc-tag svc-tag--indigo">Comunidades</span>
        </div>
        <div class="svc-body">
          <div class="svc-body-head">
            <span class="svc-icon svc-icon--indigo"><font-awesome-icon :icon="['fas', 'building-columns']" /></span>
            <h3 class="svc-name">Comunidades de vecinos</h3>
          </div>
          <p class="svc-desc">Portales, escaleras y cristaleras de zonas comunes con mantenimiento periódico para la comunidad.</p>
          <ul class="svc-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Factura para la comunidad</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Contrato de mantenimiento</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Presupuesto para administradores</li>
          </ul>
          <router-link to="/limpieza-cristales-comunidades" class="svc-btn">Saber más</router-link>
        </div>
      </div>

      <TransitionGroup name="svc-reveal">

          <div class="svc-card svc-card--extra" data-stagger="1" v-if="mostrarTodas" key="oficinas">
            <div class="svc-img-wrap">
              <img src="../../assets/img/unger-oficinas.webp" class="svc-img" style="object-position: center top" alt="Limpieza de cristales en empresas" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--purple">Empresas</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--purple"><font-awesome-icon :icon="['fas', 'building']" /></span>
                <h3 class="svc-name">Oficinas y edificios</h3>
              </div>
              <p class="svc-desc">Grandes superficies acristaladas de oficinas, edificios y naves, por dentro y por fuera, con calendario fijo.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Grandes cristaleras y mamparas</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Horarios adaptados a tu empresa</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Contrato y factura para empresas</li>
              </ul>
              <router-link to="/limpieza-cristales-oficinas" class="svc-btn">Saber más</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="2" v-if="mostrarTodas" key="presion">
            <div class="svc-img-wrap">
              <img src="../../assets/img/presion.webp" class="svc-img" alt="Limpieza con agua a presión de patios y terrazas" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--orange">Agua a presión</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--orange"><font-awesome-icon :icon="['fas', 'shower']" /></span>
                <h3 class="svc-name">Limpieza con agua a presión</h3>
              </div>
              <p class="svc-desc">Patios, terrazas, fachadas, toldos y suelos exteriores como nuevos, con la presión justa para cada superficie.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Patios, terrazas y suelos exteriores</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Fachadas, muros y toldos</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Presión adaptada a cada material</li>
              </ul>
              <router-link to="/limpieza-agua-a-presion" class="svc-btn">Saber más</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="3" v-if="mostrarTodas" key="placas">
            <div class="svc-img-wrap">
              <img src="../../assets/img/limpieza-panel-thumb.webp" class="svc-img" alt="Limpieza de placas solares" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--yellow">Placas solares</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--yellow"><font-awesome-icon :icon="['fas', 'solar-panel']" /></span>
                <h3 class="svc-name">Placas solares</h3>
              </div>
              <p class="svc-desc">La suciedad acumulada puede reducir hasta un 25% la eficiencia. Limpieza con agua desmineralizada.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Agua desmineralizada sin rayas</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Sin productos químicos agresivos</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Mantenimiento periódico</li>
              </ul>
              <router-link to="/limpieza-placas-solares" class="svc-btn">Saber más</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="4" v-if="mostrarTodas" key="obras">
            <div class="svc-img-wrap">
              <img src="../../assets/img/20260323_184851.webp" class="svc-img" alt="Limpieza de obras y fin de obra" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--cyan">Fin de obra</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--cyan"><font-awesome-icon :icon="['fas', 'broom']" /></span>
                <h3 class="svc-name">Limpiezas de obras</h3>
              </div>
              <p class="svc-desc">Tras una reforma, dejamos el espacio listo para estrenar: polvo, pintura y adhesivos fuera.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Polvo y restos de construcción</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Eliminación de adhesivos y pintura</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Cristales, suelos y azulejos</li>
              </ul>
              <router-link to="/limpieza-fin-de-obra" class="svc-btn">Saber más</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="5" v-if="mostrarTodas" key="grafitis">
            <div class="svc-img-wrap">
              <img src="../../assets/img/grafitis.webp" class="svc-img" alt="Limpieza y eliminación de grafitis" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--rose">Grafitis</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--rose"><font-awesome-icon :icon="['fas', 'spray-can']" /></span>
                <h3 class="svc-name">Limpieza de grafitis</h3>
              </div>
              <p class="svc-desc">Eliminamos grafitis en fachadas, muros y mobiliario urbano sin dañar la superficie original.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Fachadas y muros</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Portales y zonas comunes</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Sin dañar la superficie</li>
              </ul>
              <router-link to="/limpieza-grafitis" class="svc-btn">Saber más</router-link>
            </div>
          </div>

          <div class="svc-card svc-card--extra" data-stagger="6" v-if="mostrarTodas" key="vinilos">
            <div class="svc-img-wrap">
              <img src="../../assets/img/vinilo.webp" class="svc-img" alt="Retirada de vinilos en escaparates y cristales" />
              <div class="svc-overlay"></div>
              <span class="svc-tag svc-tag--fuchsia">Vinilos</span>
            </div>
            <div class="svc-body">
              <div class="svc-body-head">
                <span class="svc-icon svc-icon--fuchsia"><font-awesome-icon :icon="['fas', 'scissors']" /></span>
                <h3 class="svc-name">Retirada de vinilos</h3>
              </div>
              <p class="svc-desc">Retiramos vinilos de escaparates y cristaleras sin dejar residuos ni rayar el cristal.</p>
              <ul class="svc-list">
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Escaparates y lunas</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Sin rayar ni dañar el cristal</li>
                <li><font-awesome-icon :icon="['fas', 'check']" class="svc-check" />Eliminación de restos de adhesivo</li>
              </ul>
              <router-link to="/retirada-de-vinilos" class="svc-btn">Saber más</router-link>
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
        <span class="svc-toggle-text">{{ showAll ? 'Mostrar menos' : 'Ver más servicios' }}</span>
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
