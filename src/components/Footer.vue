<template>
  <footer>
    <div class="ft-inner">
      <div class="ft-top">
        <div class="ft-brand">
          <img src="../assets/img/ROYAL_CLEAN_2025_BLANCO.png" alt="Royall Clean" class="ft-logo" />
          <p class="ft-tagline">Limpieza profesional de cristales y fachadas en Madrid y alrededores. Más de 10 años de experiencia a tu servicio.</p>
          <div class="ft-social">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" class="ft-social-link" aria-label="Facebook"><font-awesome-icon :icon="['fab', 'facebook']" /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" class="ft-social-link" aria-label="Instagram"><font-awesome-icon :icon="['fab', 'instagram']" /></a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" class="ft-social-link" aria-label="LinkedIn"><font-awesome-icon :icon="['fab', 'linkedin']" /></a>
            <a href="https://wa.me/34696169435" target="_blank" rel="noopener noreferrer" class="ft-social-link" aria-label="WhatsApp"><font-awesome-icon :icon="['fab', 'whatsapp']" /></a>
          </div>
        </div>
        <div class="ft-col">
          <h6 class="ft-heading">Navegación</h6>
          <ul>
            <li><router-link to="/">Inicio</router-link></li>
            <li><router-link to="/#texto-principal">Nosotros</router-link></li>
            <li><router-link to="/#servicios">Servicios</router-link></li>
            <li><router-link to="/#precios">Precios</router-link></li>
            <li><router-link to="/contacto">Contacto</router-link></li>
          </ul>
        </div>
        <div class="ft-col">
          <h6 class="ft-heading">Contacto</h6>
          <ul>
            <li><font-awesome-icon :icon="['fas', 'phone']" class="ft-icon" /><a href="tel:+34696169435">+34 696 169 435</a></li>
            <li><font-awesome-icon :icon="['fas', 'envelope']" class="ft-icon" /><a href="mailto:info@royallclean.es">info@royallclean.es</a></li>
            <li><font-awesome-icon :icon="['fas', 'location-dot']" class="ft-icon" /><span>Madrid y alrededores</span></li>
          </ul>
        </div>
        <div class="ft-col">
          <h6 class="ft-heading">Legal</h6>
          <ul>
            <li><router-link to="/politica-privacidad">Política de cookies</router-link></li>
            <li><router-link to="/politica-privacidad">Política de privacidad</router-link></li>
            <li><router-link to="/aviso-legal">Aviso legal</router-link></li>
          </ul>
        </div>
        <div class="ft-col">
          <h6 class="ft-heading">Páginas amigas</h6>
          <ul>
            <li class="ft-friend-item">
              <a href="https://toucanet.fr/" target="_blank" rel="noopener noreferrer" class="ft-friend-link">
                <img src="../assets/img/toucanet-logo.png" alt="Toucanet.fr" class="ft-friend-logo" />
                <span>Toucanet.fr</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="ft-divider"></div>
      <div class="ft-bottom">
        <span class="ft-copy">© 2025 Royall Clean · Todos los derechos reservados</span>
        <span class="ft-location"><font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />Madrid, España</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
footer { margin: 0 15px 15px; font-family: 'Raleway', sans-serif; }
.ft-inner { background: var(--navy); border-radius: var(--r-lg); padding: 48px 40px 28px; }
.ft-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
.ft-logo { height: 44px; width: auto; display: block; margin-bottom: 16px; }
.ft-tagline { color: #64748b; font-size: 0.83rem; line-height: 1.7; margin: 0 0 22px; max-width: 260px; }
.ft-social { display: flex; gap: 8px; }
.ft-social-link { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 9px; color: #64748b; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07); font-size: 0.88rem; text-decoration: none; transition: color 0.2s, background 0.2s, transform 0.2s, border-color 0.2s; }
.ft-social-link:hover { color: var(--blue-light); background: rgba(96,165,250,0.1); border-color: rgba(96,165,250,0.22); transform: translateY(-2px); }
.ft-heading { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; margin: 0 0 18px; }
.ft-col ul { list-style: none; padding: 0; margin: 0; }
.ft-col ul li { display: flex; align-items: center; gap: 9px; margin-bottom: 12px; font-size: 0.84rem; color: #64748b; }
.ft-col ul li a, .ft-col ul li span { color: #64748b; text-decoration: none; transition: color 0.2s; }
.ft-col ul li a:hover { color: var(--white); }
.ft-icon { color: #475569; font-size: 0.78rem; flex-shrink: 0; width: 14px; }
.ft-friend-item { display: block !important; }
.ft-friend-link { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: #64748b; transition: color 0.2s; }
.ft-friend-link:hover { color: var(--white); }
.ft-friend-logo { width: 28px; height: 28px; border-radius: 6px; object-fit: contain; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); padding: 3px; flex-shrink: 0; }
.ft-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 22px; }
.ft-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.ft-copy, .ft-location { font-size: 0.75rem; color: #475569; }
@media (max-width: 900px) { .ft-top { grid-template-columns: 1fr 1fr; gap: 28px; } .ft-inner { padding: 36px 24px 22px; } }
@media (max-width: 540px) { .ft-top { grid-template-columns: 1fr; gap: 24px; } footer { margin: 0 10px 12px; } .ft-inner { padding: 28px 16px 18px; border-radius: var(--r-md); } .ft-tagline { max-width: 100%; } }
</style>