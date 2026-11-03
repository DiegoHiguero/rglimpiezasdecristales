<template>
  <div class="pp-wrap">

    <!-- Cabecera -->
    <div class="pp-header">
      <span class="pp-label">Legal</span>
      <h1 class="pp-title">Política de <span class="pp-accent">Privacidad</span></h1>
      <p class="pp-date">Fecha de entrada en vigor: 01/09/2023</p>
    </div>

    <!-- Contenido -->
    <div class="pp-card">

      <div class="pp-intro">
        Gracias por visitar nuestro sitio web. La protección de sus datos personales es una prioridad para nosotros.
        Esta política tiene como objetivo informarle sobre los tipos de datos que recopilamos, cómo los usamos
        y las medidas que tomamos para protegerlos.
      </div>

      <div class="pp-section">
        <div class="pp-section-title">
          <span class="pp-num">1</span>
          Recopilación de datos personales
        </div>
        <p class="pp-text">
          Recopilamos cierta información personal cuando usted utiliza nuestro sitio web, por ejemplo, cuando
          completa un formulario de contacto. Esta información puede incluir, sin limitarse a, su nombre,
          dirección de correo electrónico, dirección postal y número de teléfono.
        </p>
      </div>

      <div class="pp-section">
        <div class="pp-section-title">
          <span class="pp-num">2</span>
          Uso de datos personales
        </div>
        <p class="pp-text">
          Utilizamos los datos personales recopilados con el fin de:
        </p>
        <ul class="pp-list">
          <li>Responder a sus consultas y proporcionarle la información solicitada.</li>
          <li>Mejorar la experiencia del usuario analizando las tendencias de uso.</li>
          <li>Asegurar el correcto funcionamiento técnico de nuestro sitio web.</li>
        </ul>
      </div>

      <div class="pp-section">
        <div class="pp-section-title">
          <span class="pp-num">3</span>
          Compartir datos personales
        </div>
        <p class="pp-text">
          No vendemos, alquilamos ni compartimos sus datos personales con terceros con fines comerciales.
          Podemos compartirlos con proveedores de servicios que nos ayudan en nuestras actividades
          (alojamiento web, servicios de email, etc.), quienes están obligados a respetar la confidencialidad
          de sus datos y a utilizarlos únicamente en el marco de los servicios prestados en nuestro nombre.
        </p>
      </div>

      <div class="pp-section">
        <div class="pp-section-title">
          <span class="pp-num">4</span>
          Cookies y tecnologías similares
        </div>
        <p class="pp-text">
          Utilizamos cookies y otras tecnologías de seguimiento para mejorar su experiencia en nuestro sitio.
          Las cookies son pequeños archivos de texto almacenados en su dispositivo que nos ayudan a analizar
          tendencias de uso y personalizar el contenido. Puede modificar la configuración de su navegador
          para rechazarlas o ser advertido cuando se envíen.
        </p>
      </div>

      <div class="pp-section">
        <div class="pp-section-title">
          <span class="pp-num">5</span>
          Seguridad de los datos
        </div>
        <p class="pp-text">
          Tomamos las medidas de seguridad adecuadas para proteger sus datos contra cualquier acceso no
          autorizado, alteración o destrucción. Sin embargo, ningún método de transmisión por Internet es
          totalmente seguro, por lo que no podemos garantizar la seguridad absoluta de sus datos.
        </p>
      </div>

      <div class="pp-section">
        <div class="pp-section-title">
          <span class="pp-num">6</span>
          Sus derechos
        </div>
        <p class="pp-text">
          Dispone de un derecho de acceso, rectificación, modificación y supresión de los datos que le
          conciernen. Puede ejercer este derecho contactándonos a través del
          <router-link to="/contacto" class="pp-link">formulario de contacto</router-link> o por correo postal:
        </p>
        <div class="pp-address">
          <font-awesome-icon :icon="['fas', 'location-dot']" class="pp-address-icon" />
          <div>
            <strong>Roys Abreu</strong><br>
            Calle Angeles 10, bajo 9<br>
            28902 Getafe, Madrid — España
          </div>
        </div>
      </div>

      <div class="pp-section">
        <div class="pp-section-title">
          <span class="pp-num">7</span>
          Modificaciones de la política
        </div>
        <p class="pp-text">
          Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento.
          Cualquier actualización se publicará en esta página con una fecha de entrada en vigor actualizada.
          Al utilizar nuestro sitio web, usted acepta los términos de esta política.
        </p>
      </div>

      <!-- Contacto final -->
      <div class="pp-contact-box">
        <font-awesome-icon :icon="['fas', 'envelope']" class="pp-contact-icon" />
        <div>
          <p class="pp-contact-title">¿Tienes preguntas sobre esta política?</p>
          <a href="mailto:info@royallclean.es" class="pp-link">info@royallclean.es</a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.pp-wrap {
  min-height: calc(100vh - 72px);
  background: #151515;
  padding: 52px 16px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Header ── */
.pp-header {
  text-align: center;
  max-width: 640px;
  margin-bottom: 36px;
}
.pp-label {
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
.pp-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.6rem;
  color: #fff;
  line-height: 1.1;
  margin: 0 0 10px;
}
.pp-accent { color: #60a5fa; }
.pp-date {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  color: #475569;
  margin: 0;
}

/* ── Card ── */
.pp-card {
  width: 100%;
  max-width: 780px;
  background: #0f1729;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 40px 44px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
}

.pp-intro {
  font-family: 'Raleway', sans-serif;
  font-size: 0.92rem;
  color: #64748b;
  line-height: 1.75;
  border-left: 3px solid rgba(96,165,250,0.35);
  padding-left: 16px;
  margin-bottom: 32px;
}

/* ── Sections ── */
.pp-section {
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.pp-section:last-of-type { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

.pp-section-title {
  font-family: 'Raleway', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.pp-num {
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

.pp-text {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.75;
  margin: 0 0 10px;
}
.pp-text:last-child { margin-bottom: 0; }

.pp-list {
  font-family: 'Raleway', sans-serif;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.75;
  padding-left: 20px;
  margin: 0;
}
.pp-list li { margin-bottom: 4px; }
.pp-list li::marker { color: #60a5fa; }

.pp-link {
  color: #60a5fa;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.15s;
}
.pp-link:hover { opacity: 0.75; }

/* ── Address block ── */
.pp-address {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  padding: 14px 16px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.86rem;
  color: #94a3b8;
  line-height: 1.7;
}
.pp-address strong { color: #f1f5f9; }
.pp-address-icon { color: #60a5fa; font-size: 0.9rem; margin-top: 3px; flex-shrink: 0; }

/* ── Contact box ── */
.pp-contact-box {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  background: rgba(96,165,250,0.06);
  border: 1px solid rgba(96,165,250,0.15);
  border-radius: 12px;
  padding: 18px 20px;
}
.pp-contact-icon { color: #60a5fa; font-size: 1.1rem; flex-shrink: 0; }
.pp-contact-title {
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem;
  font-weight: 600;
  color: #94a3b8;
  margin: 0 0 4px;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .pp-title { font-size: 2rem; }
  .pp-card { padding: 24px 18px; }
  .pp-wrap { padding: 36px 12px 60px; }
}
</style>
