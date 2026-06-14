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
            <li><router-link to="/servicios">Limpieza de cristales</router-link></li>
            <li><router-link to="/#precios">Precios</router-link></li>
            <li><router-link to="/blog">Blog</router-link></li>
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
        <span class="ft-copy">
          © 2026 Royall Clean · Todos los derechos reservados
          <router-link v-if="!userStore.userData" to="/login" class="ft-login-ghost" tabindex="-1">
            <font-awesome-icon :icon="['fas', 'lock']" />
          </router-link>
        </span>

        <div class="ft-weather" v-if="!loading && weatherInfo">
          <span class="ft-weather-emoji">{{ weatherInfo.emoji }}</span>
          <span class="ft-weather-temp">{{ temp }}°C</span>
          <span class="ft-weather-sep">·</span>
          <span class="ft-weather-msg">{{ weatherInfo.msg }}</span>
        </div>

        <span class="ft-location"><font-awesome-icon :icon="['fas', 'location-dot']" class="me-1" />Madrid, España</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

const temp = ref(null);
const weatherCode = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=40.4168&longitude=-3.7038&current=temperature_2m,weather_code&timezone=Europe%2FMadrid'
    );
    const data = await res.json();
    temp.value = Math.round(data.current.temperature_2m);
    weatherCode.value = data.current.weather_code;
  } catch {
    // silently fail
  } finally {
    loading.value = false;
  }
});

const weatherInfo = computed(() => {
  const code = weatherCode.value;
  if (code === null) return null;
  if (code === 0)       return { emoji: '☀️', msg: '¡Día ideal para limpiar cristales!' };
  if (code <= 3)        return { emoji: '⛅', msg: 'Buen día para programar tu limpieza' };
  if (code <= 48)       return { emoji: '🌫️', msg: 'Buen día para programar tu limpieza' };
  if (code <= 67)       return { emoji: '🌧️', msg: 'Tras la lluvia, tus cristales te necesitan' };
  if (code <= 77)       return { emoji: '❄️', msg: 'Cuida tus cristales este invierno' };
  if (code <= 82)       return { emoji: '🌦️', msg: 'Tras la lluvia, tus cristales te necesitan' };
  return                       { emoji: '⛈️', msg: 'Tiempo de planificar tu próxima limpieza' };
});
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
.ft-login-ghost { color: #64748b; text-decoration: none; margin-left: 8px; font-size: 0.75rem; transition: color 0.2s; }
.ft-login-ghost:hover { color: #cbd5e1; }
.ft-weather { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 4px 12px; }
.ft-weather-emoji { font-size: 0.95rem; line-height: 1; }
.ft-weather-temp { font-size: 0.75rem; font-weight: 700; color: #94a3b8; }
.ft-weather-sep { color: #334155; font-size: 0.7rem; }
.ft-weather-msg { font-size: 0.72rem; color: #64748b; white-space: nowrap; }
@media (max-width: 900px) { .ft-top { grid-template-columns: 1fr 1fr; gap: 28px; } .ft-inner { padding: 36px 24px 22px; } }
@media (max-width: 540px) { .ft-top { grid-template-columns: 1fr; gap: 24px; } footer { margin: 0 10px 12px; } .ft-inner { padding: 28px 16px 18px; border-radius: var(--r-md); } .ft-tagline { max-width: 100%; } .ft-bottom { flex-direction: column; align-items: flex-start; gap: 10px; } .ft-weather { width: 100%; justify-content: center; } }
</style>