<template>
  <div class="al-wrap">

    <!-- Cabecera -->
    <div class="al-header">
      <span class="al-label">Legal</span>
      <h1 class="al-title">Aviso <span class="al-accent">Legal</span></h1>
      <p class="al-date">Última actualización: 01/09/2023</p>
    </div>

    <!-- Contenido -->
    <div class="al-card">

      <div class="al-intro">
        En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información
        y de Comercio Electrónico (LSSICE), se pone a disposición del usuario la siguiente información
        sobre el titular y responsable de este sitio web.
      </div>

      <!-- 1. Datos del titular -->
      <div class="al-section">
        <div class="al-section-title">
          <span class="al-num">1</span>
          Datos del titular
        </div>
        <div class="al-data-grid">
          <div class="al-data-item">
            <font-awesome-icon :icon="['fas', 'user']" class="al-data-icon" />
            <div>
              <span class="al-data-label">Titular</span>
              <span class="al-data-value">Roys Abreu</span>
            </div>
          </div>
          <div class="al-data-item">
            <font-awesome-icon :icon="['fas', 'briefcase']" class="al-data-icon" />
            <div>
              <span class="al-data-label">Nombre comercial</span>
              <span class="al-data-value">Royall Clean</span>
            </div>
          </div>
          <div class="al-data-item">
            <font-awesome-icon :icon="['fas', 'location-dot']" class="al-data-icon" />
            <div>
              <span class="al-data-label">Domicilio</span>
              <span class="al-data-value">Calle Angeles 10, bajo 9 · 28902 Getafe, Madrid · España</span>
            </div>
          </div>
          <div class="al-data-item">
            <font-awesome-icon :icon="['fas', 'envelope']" class="al-data-icon" />
            <div>
              <span class="al-data-label">Email de contacto</span>
              <a href="mailto:info@royallclean.es" class="al-data-value al-link">info@royallclean.es</a>
            </div>
          </div>
          <div class="al-data-item">
            <font-awesome-icon :icon="['fas', 'phone']" class="al-data-icon" />
            <div>
              <span class="al-data-label">Teléfono</span>
              <a href="tel:+34696169435" class="al-data-value al-link">+34 696 169 435</a>
            </div>
          </div>
          <div class="al-data-item">
            <font-awesome-icon :icon="['fas', 'globe']" class="al-data-icon" />
            <div>
              <span class="al-data-label">Sitio web</span>
              <span class="al-data-value">royal-clean-services.web.app</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Objeto -->
      <div class="al-section">
        <div class="al-section-title">
          <span class="al-num">2</span>
          Objeto y ámbito de aplicación
        </div>
        <p class="al-text">
          El presente aviso legal regula el acceso y uso del sitio web de Royall Clean, empresa dedicada
          a la limpieza profesional de cristales para hogares, locales comerciales y cooperativas en
          Madrid y alrededores. El acceso a este sitio web implica la aceptación plena de las condiciones
          establecidas en este aviso legal.
        </p>
      </div>

      <!-- 3. Condiciones de uso -->
      <div class="al-section">
        <div class="al-section-title">
          <span class="al-num">3</span>
          Condiciones de uso
        </div>
        <p class="al-text">El usuario se compromete a:</p>
        <ul class="al-list">
          <li>Hacer un uso correcto del sitio web conforme a la ley, la moral y el orden público.</li>
          <li>No realizar acciones que puedan dañar, inutilizar o deteriorar el sitio o sus servicios.</li>
          <li>No introducir, almacenar o difundir contenidos ilícitos, difamatorios o que vulneren derechos de terceros.</li>
          <li>No utilizar el sitio con fines publicitarios o comerciales no autorizados.</li>
        </ul>
        <p class="al-text">
          El titular se reserva el derecho a modificar, suspender o cancelar el acceso al sitio web
          sin previo aviso cuando lo estime conveniente.
        </p>
      </div>

      <!-- 4. Propiedad intelectual -->
      <div class="al-section">
        <div class="al-section-title">
          <span class="al-num">4</span>
          Propiedad intelectual e industrial
        </div>
        <p class="al-text">
          Todos los contenidos del sitio web —incluyendo textos, fotografías, logotipos, imágenes,
          diseño gráfico y código fuente— son propiedad de Roys Abreu o de terceros que han autorizado
          su uso, y están protegidos por la normativa española e internacional sobre propiedad intelectual
          e industrial.
        </p>
        <p class="al-text">
          Queda expresamente prohibida la reproducción, distribución, comunicación pública o transformación
          de cualquier contenido del sitio sin autorización previa y por escrito del titular.
        </p>
      </div>

      <!-- 5. Responsabilidad -->
      <div class="al-section">
        <div class="al-section-title">
          <span class="al-num">5</span>
          Limitación de responsabilidad
        </div>
        <p class="al-text">
          El titular no se responsabiliza de los daños o perjuicios derivados del uso de la información
          contenida en este sitio, de errores u omisiones en los contenidos, ni de la disponibilidad
          técnica del sitio. Asimismo, no garantiza la ausencia de virus u otros elementos que puedan
          alterar los sistemas informáticos del usuario.
        </p>
        <p class="al-text">
          El sitio puede contener enlaces a sitios web de terceros. Royall Clean no se hace responsable
          del contenido, privacidad ni prácticas de dichos sitios externos.
        </p>
      </div>

      <!-- 6. Alojamiento -->
      <div class="al-section">
        <div class="al-section-title">
          <span class="al-num">6</span>
          Alojamiento web
        </div>
        <div class="al-host-block">
          <font-awesome-icon :icon="['fas', 'server']" class="al-host-icon" />
          <div>
            <p class="al-text" style="margin:0 0 6px;">
              Este sitio web está alojado en <strong>Firebase Hosting</strong>, servicio de Google LLC.
            </p>
            <p class="al-text" style="margin:0; color: #475569; font-size: 0.82rem;">
              Google LLC · 1600 Amphitheatre Parkway, Mountain View, California 94043, EE.UU.
            </p>
          </div>
        </div>
      </div>

      <!-- 7. Protección de datos -->
      <div class="al-section">
        <div class="al-section-title">
          <span class="al-num">7</span>
          Protección de datos personales
        </div>
        <p class="al-text">
          El tratamiento de los datos personales facilitados a través de este sitio web se rige por
          nuestra
          <router-link to="/politica-privacidad" class="al-link">Política de Privacidad</router-link>,
          en cumplimiento del Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica
          3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
        </p>
      </div>

      <!-- 8. Legislación -->
      <div class="al-section" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0;">
        <div class="al-section-title">
          <span class="al-num">8</span>
          Legislación aplicable y jurisdicción
        </div>
        <p class="al-text">
          Este aviso legal se rige por la legislación española. Para la resolución de cualquier
          controversia derivada del acceso o uso de este sitio web, las partes se someten
          expresamente a los juzgados y tribunales de Madrid, con renuncia a cualquier otro fuero
          que pudiera corresponderles.
        </p>
      </div>

      <!-- Contacto final -->
      <div class="al-contact-box">
        <font-awesome-icon :icon="['fas', 'envelope']" class="al-contact-icon" />
        <div>
          <p class="al-contact-title">¿Tienes alguna consulta legal?</p>
          <a href="mailto:info@royallclean.es" class="al-link">info@royallclean.es</a>
          &nbsp;·&nbsp;
          <router-link to="/contacto" class="al-link">Formulario de contacto</router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.al-wrap {
  min-height: calc(100vh - 54px);
  background: #151515;
  padding: 52px 16px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Header ── */
.al-header {
  text-align: center;
  max-width: 640px;
  margin-bottom: 36px;
}
.al-label {
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
.al-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.6rem;
  color: #fff;
  line-height: 1.1;
  margin: 0 0 10px;
}
.al-accent { color: #60a5fa; }
.al-date {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  color: #475569;
  margin: 0;
}

/* ── Card ── */
.al-card {
  width: 100%;
  max-width: 780px;
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 40px 44px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
}

.al-intro {
  font-family: 'Raleway', sans-serif;
  font-size: 0.92rem;
  color: #64748b;
  line-height: 1.75;
  border-left: 3px solid rgba(96,165,250,0.35);
  padding-left: 16px;
  margin-bottom: 32px;
}

/* ── Sections ── */
.al-section {
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.al-section-title {
  font-family: 'Raleway', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.al-num {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgba(96,165,250,0.15);
  border: 1px solid rgba(96,165,250,0.25);
  color: #60a5fa;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.al-text {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.75;
  margin: 0 0 10px;
}
.al-text:last-child { margin-bottom: 0; }

.al-list {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.75;
  padding-left: 20px;
  margin: 0 0 12px;
}
.al-list li { margin-bottom: 4px; }
.al-list li::marker { color: #60a5fa; }

.al-link {
  color: #60a5fa;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.15s;
}
.al-link:hover { opacity: 0.75; }

/* ── Data grid ── */
.al-data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.al-data-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 12px 14px;
}
.al-data-icon { color: #60a5fa; font-size: 0.82rem; margin-top: 3px; flex-shrink: 0; }
.al-data-label {
  display: block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #475569;
  margin-bottom: 3px;
}
.al-data-value {
  display: block;
  font-family: 'Raleway', sans-serif;
  font-size: 0.86rem;
  color: #94a3b8;
  line-height: 1.4;
}

/* ── Hosting block ── */
.al-host-block {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 16px;
}
.al-host-icon { color: #60a5fa; font-size: 1rem; margin-top: 2px; flex-shrink: 0; }

/* ── Contact box ── */
.al-contact-box {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  background: rgba(96,165,250,0.06);
  border: 1px solid rgba(96,165,250,0.15);
  border-radius: 12px;
  padding: 18px 20px;
}
.al-contact-icon { color: #60a5fa; font-size: 1.1rem; flex-shrink: 0; }
.al-contact-title {
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  color: #94a3b8;
  margin: 0 0 4px;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .al-title { font-size: 2rem; }
  .al-card { padding: 24px 18px; }
  .al-wrap { padding: 36px 12px 60px; }
  .al-data-grid { grid-template-columns: 1fr; }
}
</style>
