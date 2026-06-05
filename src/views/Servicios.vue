<template>
  <div class="sv-wrap">

    <!-- Cabecera -->
    <div class="sv-header">
      <span class="sv-label">Lo que hacemos</span>
      <h1 class="sv-title">Limpieza de <span class="sv-accent">cristales y ventanas</span> en Madrid</h1>
      <p class="sv-sub">Soluciones profesionales de limpieza de cristales y ventanas para hogares, negocios y comunidades en Madrid y alrededores. Presupuesto gratuito en menos de 24 h.</p>
      <div class="sv-badges">
        <span class="sv-badge"><font-awesome-icon :icon="['fas', 'check']" class="me-1" />+10 años de experiencia</span>
        <span class="sv-badge"><font-awesome-icon :icon="['fas', 'tag']" class="me-1" />Presupuesto gratis</span>
        <span class="sv-badge"><font-awesome-icon :icon="['fas', 'seedling']" class="me-1" />Productos ecológicos</span>
      </div>
    </div>

    <!-- Cards de servicios -->
    <div class="sv-grid">

      <!-- Negocios -->
      <div class="sv-card sv-card--blue">
        <div class="sv-card-img-wrap">
          <img src="../assets/img/restaurant.jpg" alt="Limpieza de cristales en negocios y locales comerciales Madrid" class="sv-card-img" />
          <div class="sv-card-overlay"></div>
          <span class="sv-num">01</span>
        </div>
        <div class="sv-card-body">
          <div class="sv-card-icon" style="background:rgba(96,165,250,0.12);border-color:rgba(96,165,250,0.25);">
            <font-awesome-icon :icon="['fas', 'store']" style="color:#60a5fa" />
          </div>
          <h2 class="sv-card-title" style="color:#60a5fa">Locales y Negocios</h2>
          <p class="sv-card-desc">Tiendas, cafeterías, consultorios, farmacias y todo tipo de locales comerciales. Cristales de escaparate, puertas y fachadas siempre impecables, sin interrumpir tu actividad diaria.</p>
          <ul class="sv-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#60a5fa" />Escaparates y cristaleras</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#60a5fa" />Puertas de entrada</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#60a5fa" />Mamparas interiores</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#60a5fa" />Servicio periódico a medida</li>
          </ul>
          <router-link to="/contacto" class="sv-cta" style="--c:#60a5fa;--cs:rgba(96,165,250,0.2)">
            <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Pedir presupuesto
          </router-link>
        </div>
      </div>

      <!-- Hogares -->
      <div class="sv-card sv-card--green">
        <div class="sv-card-img-wrap">
          <img src="../assets/img/casamadera.jpeg" alt="Limpieza de cristales en hogares y viviendas Madrid" class="sv-card-img" />
          <div class="sv-card-overlay"></div>
          <span class="sv-num">02</span>
        </div>
        <div class="sv-card-body">
          <div class="sv-card-icon" style="background:rgba(52,211,153,0.12);border-color:rgba(52,211,153,0.25);">
            <font-awesome-icon :icon="['fas', 'house']" style="color:#34d399" />
          </div>
          <h2 class="sv-card-title" style="color:#34d399">Hogares y Viviendas</h2>
          <p class="sv-card-desc">Casas unifamiliares, pisos, áticos y chalets. Ventanas, balcones, terrazas y mamparas de baño limpias a fondo con los mejores productos ecológicos.</p>
          <ul class="sv-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#34d399" />Ventanas y ventanales</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#34d399" />Balcones y terrazas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#34d399" />Mamparas de baño</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#34d399" />Barandillas de cristal</li>
          </ul>
          <router-link to="/contacto" class="sv-cta" style="--c:#34d399;--cs:rgba(52,211,153,0.2)">
            <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Pedir presupuesto
          </router-link>
        </div>
      </div>

      <!-- Comunidades y Empresas -->
      <div class="sv-card sv-card--purple">
        <div class="sv-card-img-wrap">
          <img src="../assets/img/office-buildings.jpg" alt="Limpieza de cristales en empresas y comunidades de vecinos Madrid" class="sv-card-img" />
          <div class="sv-card-overlay"></div>
          <span class="sv-num">03</span>
        </div>
        <div class="sv-card-body">
          <div class="sv-card-icon" style="background:rgba(167,139,250,0.12);border-color:rgba(167,139,250,0.25);">
            <font-awesome-icon :icon="['fas', 'building']" style="color:#a78bfa" />
          </div>
          <h2 class="sv-card-title" style="color:#a78bfa">Empresas y Comunidades</h2>
          <p class="sv-card-desc">Oficinas, edificios de oficinas, comunidades de vecinos y naves industriales. Planes de mantenimiento a medida con horarios flexibles.</p>
          <ul class="sv-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#a78bfa" />Oficinas y despachos</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#a78bfa" />Comunidades de vecinos</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#a78bfa" />Edificios y fachadas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#a78bfa" />Contratos de mantenimiento</li>
          </ul>
          <router-link to="/contacto" class="sv-cta" style="--c:#a78bfa;--cs:rgba(167,139,250,0.2)">
            <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Pedir presupuesto
          </router-link>
        </div>
      </div>

      <!-- Agua a presión -->
      <div class="sv-card sv-card--orange">
        <div class="sv-card-img-wrap">
          <img src="../assets/img/hidrolimpiadoras.jpg" alt="Limpieza con agua a presión en Madrid" class="sv-card-img" />
          <div class="sv-card-overlay"></div>
          <span class="sv-num">04</span>
        </div>
        <div class="sv-card-body">
          <div class="sv-card-icon" style="background:rgba(251,146,60,0.12);border-color:rgba(251,146,60,0.25);">
            <font-awesome-icon :icon="['fas', 'droplet']" style="color:#fb923c" />
          </div>
          <h2 class="sv-card-title" style="color:#fb923c">Limpieza a Presión</h2>
          <p class="sv-card-desc">Fachadas, patios, garajes, aceras y cualquier superficie exterior con suciedad difícil. Resultados inmediatos y duraderos con equipos de alta presión.</p>
          <ul class="sv-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#fb923c" />Fachadas y muros</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#fb923c" />Patios y garajes</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#fb923c" />Aceras y zonas comunes</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#fb923c" />Eliminación de grafitis</li>
          </ul>
          <router-link to="/contacto" class="sv-cta" style="--c:#fb923c;--cs:rgba(251,146,60,0.2)">
            <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Pedir presupuesto
          </router-link>
        </div>
      </div>

      <!-- Placas Solares -->
      <div class="sv-card sv-card--yellow">
        <div class="sv-card-img-wrap">
          <img src="../assets/img/limpieza-panel-thumb.jpg" alt="Limpieza de placas solares en Madrid" class="sv-card-img" />
          <div class="sv-card-overlay"></div>
          <span class="sv-num">05</span>
        </div>
        <div class="sv-card-body">
          <div class="sv-card-icon" style="background:rgba(250,204,21,0.12);border-color:rgba(250,204,21,0.25);">
            <font-awesome-icon :icon="['fas', 'solar-panel']" style="color:#facc15" />
          </div>
          <h2 class="sv-card-title" style="color:#facc15">Placas Solares</h2>
          <p class="sv-card-desc">La suciedad y el polvo acumulado en los paneles solares puede reducir su eficiencia hasta un 25 %. Limpieza especializada con agua desmineralizada.</p>
          <ul class="sv-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#facc15" />Paneles fotovoltaicos</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#facc15" />Agua desmineralizada sin rayas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#facc15" />Sin productos químicos agresivos</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#facc15" />Mantenimiento periódico</li>
          </ul>
          <router-link to="/contacto" class="sv-cta" style="--c:#facc15;--cs:rgba(250,204,21,0.12)">
            <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Pedir presupuesto
          </router-link>
        </div>
      </div>

      <!-- Limpiezas de Obras -->
      <div class="sv-card sv-card--cyan">
        <div class="sv-card-img-wrap">
          <img src="../assets/img/20260323_184851.jpg" alt="Limpieza de obras y fin de obra en Madrid" class="sv-card-img" />
          <div class="sv-card-overlay"></div>
          <span class="sv-num">06</span>
        </div>
        <div class="sv-card-body">
          <div class="sv-card-icon" style="background:rgba(34,211,238,0.12);border-color:rgba(34,211,238,0.25);">
            <font-awesome-icon :icon="['fas', 'broom']" style="color:#22d3ee" />
          </div>
          <h2 class="sv-card-title" style="color:#22d3ee">Limpiezas de Obras</h2>
          <p class="sv-card-desc">Tras una reforma o construcción, dejamos el espacio listo para estrenar. Eliminamos polvo de escayola, restos de pintura, adhesivos y cualquier residuo de obra.</p>
          <ul class="sv-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#22d3ee" />Polvo y restos de construcción</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#22d3ee" />Eliminación de adhesivos y pintura</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#22d3ee" />Cristales, suelos y azulejos</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#22d3ee" />Pisos, locales y chalets</li>
          </ul>
          <router-link to="/contacto" class="sv-cta" style="--c:#22d3ee;--cs:rgba(34,211,238,0.12)">
            <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Pedir presupuesto
          </router-link>
        </div>
      </div>

      <!-- Limpieza de Grafitis -->
      <div class="sv-card sv-card--rose">
        <div class="sv-card-img-wrap">
          <img src="../assets/img/grafitis.jpg" alt="Limpieza y eliminación de grafitis en Madrid" class="sv-card-img" />
          <div class="sv-card-overlay"></div>
          <span class="sv-num">07</span>
        </div>
        <div class="sv-card-body">
          <div class="sv-card-icon" style="background:rgba(251,113,133,0.12);border-color:rgba(251,113,133,0.25);">
            <font-awesome-icon :icon="['fas', 'spray-can']" style="color:#fb7185" />
          </div>
          <h2 class="sv-card-title" style="color:#fb7185">Limpieza de Grafitis</h2>
          <p class="sv-card-desc">Eliminamos grafitis en fachadas, muros, portales y mobiliario urbano de forma eficaz y sin dañar la superficie. Actuación rápida para restaurar el aspecto original del inmueble.</p>
          <ul class="sv-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#fb7185" />Fachadas y muros</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#fb7185" />Portales y zonas comunes</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#fb7185" />Mobiliario urbano y vallados</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#fb7185" />Sin dañar la superficie</li>
          </ul>
          <router-link to="/contacto" class="sv-cta" style="--c:#fb7185;--cs:rgba(251,113,133,0.2)">
            <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Pedir presupuesto
          </router-link>
        </div>
      </div>

      <!-- Retirada de Vinilos -->
      <div class="sv-card sv-card--fuchsia">
        <div class="sv-card-img-wrap">
          <img src="../assets/img/vinilo.jpg" alt="Retirada de vinilos en escaparates y cristales Madrid" class="sv-card-img" />
          <div class="sv-card-overlay"></div>
          <span class="sv-num">08</span>
        </div>
        <div class="sv-card-body">
          <div class="sv-card-icon" style="background:rgba(232,121,249,0.12);border-color:rgba(232,121,249,0.25);">
            <font-awesome-icon :icon="['fas', 'scissors']" style="color:#e879f9" />
          </div>
          <h2 class="sv-card-title" style="color:#e879f9">Retirada de Vinilos</h2>
          <p class="sv-card-desc">Retiramos vinilos adhesivos en escaparates, lunas, cristaleras y vehículos sin dejar residuos ni rayar el cristal. Acabado limpio y profesional listo para nueva decoración.</p>
          <ul class="sv-list">
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#e879f9" />Escaparates y lunas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#e879f9" />Cristaleras y mamparas</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#e879f9" />Sin rayar ni dañar el cristal</li>
            <li><font-awesome-icon :icon="['fas', 'check']" class="sv-check" style="color:#e879f9" />Eliminación de restos de adhesivo</li>
          </ul>
          <router-link to="/contacto" class="sv-cta" style="--c:#e879f9;--cs:rgba(232,121,249,0.2)">
            <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Pedir presupuesto
          </router-link>
        </div>
      </div>

    </div>

    <!-- Proceso de trabajo -->
    <div class="sv-process">
      <div class="sv-section-head">
        <span class="sv-label">Cómo trabajamos</span>
        <h2 class="sv-title-sm">Proceso <span class="sv-accent">sencillo</span></h2>
        <p class="sv-sub-sm">Del primer contacto al resultado impecable en 4 pasos</p>
      </div>
      <div class="sv-steps">
        <div class="sv-step">
          <div class="sv-step-num">1</div>
          <h3 class="sv-step-title">Solicita presupuesto</h3>
          <p class="sv-step-desc">Escríbenos por el formulario, WhatsApp o llámanos. Sin compromiso y completamente gratis.</p>
        </div>
        <div class="sv-step-arrow"><font-awesome-icon :icon="['fas', 'chevron-right']" /></div>
        <div class="sv-step">
          <div class="sv-step-num">2</div>
          <h3 class="sv-step-title">Recibe tu presupuesto</h3>
          <p class="sv-step-desc">Te respondemos en menos de 24 horas con un presupuesto detallado y sin letra pequeña.</p>
        </div>
        <div class="sv-step-arrow"><font-awesome-icon :icon="['fas', 'chevron-right']" /></div>
        <div class="sv-step">
          <div class="sv-step-num">3</div>
          <h3 class="sv-step-title">Acordamos fecha</h3>
          <p class="sv-step-desc">Elegimos juntos el día y hora que mejor te venga. Máxima flexibilidad de horario.</p>
        </div>
        <div class="sv-step-arrow"><font-awesome-icon :icon="['fas', 'chevron-right']" /></div>
        <div class="sv-step">
          <div class="sv-step-num">4</div>
          <h3 class="sv-step-title">Resultado impecable</h3>
          <p class="sv-step-desc">Llegamos a la hora acordada y dejamos todo brillante. Garantía de satisfacción total.</p>
        </div>
      </div>
    </div>

    <!-- Zona de cobertura -->
    <div class="sv-coverage">
      <div class="sv-coverage-inner">
        <div class="sv-coverage-text">
          <span class="sv-label">Zona de servicio</span>
          <h2 class="sv-title-sm">Trabajamos en <span class="sv-accent">toda Madrid</span></h2>
          <p class="sv-sub-sm">Cubrimos Madrid capital y toda su área metropolitana. Para zonas más alejadas, consúltanos sin compromiso.</p>
          <div class="sv-zones">
            <span class="sv-zone"><font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />Madrid capital</span>
            <span class="sv-zone"><font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />Getafe</span>
            <span class="sv-zone"><font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />Leganés</span>
            <span class="sv-zone"><font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />Móstoles</span>
            <span class="sv-zone"><font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />Alcorcón</span>
            <span class="sv-zone"><font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />Majadahonda</span>
            <span class="sv-zone"><font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />Pozuelo</span>
            <span class="sv-zone"><font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />Las Rozas</span>
          </div>
        </div>
        <img src="../assets/img/mapa.png" alt="Mapa de cobertura Royall Clean Madrid" class="sv-coverage-img" />
      </div>
    </div>

    <!-- CTA final -->
    <div class="sv-cta-block">
      <h2 class="sv-cta-title">¿Listo para tener los cristales impecables?</h2>
      <p class="sv-cta-sub">Presupuesto gratuito · Respuesta en 24 h · Sin compromiso</p>
      <div class="sv-cta-btns">
        <router-link to="/contacto" class="sv-cta-main">
          <font-awesome-icon :icon="['fas', 'paper-plane']" class="me-2" />Solicitar presupuesto gratis
        </router-link>
        <a href="tel:+34696169435" class="sv-cta-sec">
          <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />696 169 435
        </a>
      </div>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.sv-wrap {
  min-height: calc(100vh - 54px);
  background: #151515;
  padding: 52px 16px 80px;
}

/* ── Header ── */
.sv-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 60px;
}
.sv-label {
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
  margin-bottom: 14px;
}
.sv-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.8rem;
  color: #fff;
  line-height: 1.1;
  margin: 0 0 14px;
}
.sv-accent { color: #60a5fa; }
.sv-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 1rem;
  color: #64748b;
  line-height: 1.7;
  margin: 0 0 24px;
}
.sv-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
.sv-badge {
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #94a3b8;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 5px 14px;
}

/* ── Grid de servicios ── */
.sv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto 72px;
}

.sv-card {
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s, box-shadow 0.25s;
}
.sv-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}

.sv-card-img-wrap {
  position: relative;
  height: 220px;
  flex-shrink: 0;
}
.sv-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.sv-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(10,16,30,0.9) 0%, rgba(10,16,30,0.15) 60%, transparent 100%);
}
.sv-num {
  position: absolute;
  bottom: 14px;
  left: 18px;
  font-family: 'Anton', sans-serif;
  font-size: 3rem;
  color: rgba(255,255,255,0.08);
  line-height: 1;
}

.sv-card-body {
  padding: 24px 24px 28px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.sv-card-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-bottom: 16px;
}
.sv-card-title {
  font-family: 'Anton', sans-serif;
  font-size: 1.5rem;
  margin: 0 0 12px;
  letter-spacing: 0.4px;
}
.sv-card-desc {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.75;
  margin: 0 0 18px;
  flex: 1;
}
.sv-list {
  list-style: none;
  padding: 0;
  margin: 0 0 22px;
}
.sv-list li {
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.sv-list li:last-child { border-bottom: none; }
.sv-check { font-size: 0.65rem; flex-shrink: 0; }

.sv-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  color: var(--c);
  border: 1.5px solid var(--c);
  background: var(--cs);
  padding: 10px 18px;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}
.sv-cta:hover {
  background: var(--c);
  color: #fff;
  transform: translateY(-1px);
}

/* ── Proceso ── */
.sv-process {
  max-width: 1100px;
  margin: 0 auto 72px;
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 52px 40px;
}
.sv-section-head {
  text-align: center;
  margin-bottom: 48px;
}
.sv-title-sm {
  font-family: 'Anton', sans-serif;
  font-size: 2rem;
  color: #fff;
  margin: 0 0 10px;
}
.sv-sub-sm {
  font-family: 'Raleway', sans-serif;
  font-size: 0.92rem;
  color: #64748b;
  margin: 0;
}
.sv-steps {
  display: flex;
  align-items: flex-start;
  gap: 0;
}
.sv-step {
  flex: 1;
  text-align: center;
  padding: 0 16px;
}
.sv-step-num {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(96,165,250,0.12);
  border: 2px solid rgba(96,165,250,0.3);
  color: #60a5fa;
  font-family: 'Anton', sans-serif;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.sv-step-title {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  color: #f1f5f9;
  margin: 0 0 8px;
}
.sv-step-desc {
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.65;
  margin: 0;
}
.sv-step-arrow {
  color: rgba(96,165,250,0.3);
  font-size: 1.1rem;
  padding-top: 18px;
  flex-shrink: 0;
}

/* ── Cobertura ── */
.sv-coverage {
  max-width: 1100px;
  margin: 0 auto 72px;
}
.sv-coverage-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px;
  align-items: center;
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 48px 44px;
}
.sv-coverage-text { display: flex; flex-direction: column; }
.sv-coverage-img {
  width: 200px;
  height: 200px;
  object-fit: contain;
  opacity: 0.75;
  border-radius: 12px;
}
.sv-zones {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}
.sv-zone {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #60a5fa;
  background: rgba(96,165,250,0.08);
  border: 1px solid rgba(96,165,250,0.2);
  border-radius: 20px;
  padding: 4px 13px;
}

/* ── CTA final ── */
.sv-cta-block {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  background: linear-gradient(135deg, #0f1729 0%, #1e2d4a 100%);
  border: 1px solid rgba(96,165,250,0.2);
  border-radius: 20px;
  padding: 56px 32px;
}
.sv-cta-title {
  font-family: 'Anton', sans-serif;
  font-size: 2rem;
  color: #fff;
  margin: 0 0 12px;
}
.sv-cta-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 32px;
}
.sv-cta-btns {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
.sv-cta-main {
  display: inline-flex;
  align-items: center;
  background: #2563eb;
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 13px 28px;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.sv-cta-main:hover {
  background: #1d4ed8;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 26px rgba(37,99,235,0.45);
}
.sv-cta-sec {
  display: inline-flex;
  align-items: center;
  background: transparent;
  color: #f1f5f9;
  border: 1.5px solid rgba(255,255,255,0.2);
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 13px 28px;
  border-radius: 12px;
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s;
}
.sv-cta-sec:hover {
  border-color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.05);
  color: #fff;
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .sv-grid { grid-template-columns: repeat(2, 1fr); max-width: 780px; }
}
@media (max-width: 900px) {
  .sv-process { padding: 36px 20px; }
  .sv-steps { flex-direction: column; align-items: center; gap: 8px; }
  .sv-step-arrow { transform: rotate(90deg); padding: 0; }
  .sv-coverage-inner { grid-template-columns: 1fr; }
  .sv-coverage-img { display: none; }
}
@media (max-width: 640px) {
  .sv-wrap { padding: 36px 12px 60px; }
  .sv-title { font-size: 2rem; }
  .sv-grid { grid-template-columns: 1fr; max-width: 480px; }
  .sv-cta-block { padding: 40px 20px; }
  .sv-cta-title { font-size: 1.5rem; }
}
</style>
