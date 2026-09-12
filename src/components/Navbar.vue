<template>
  <nav class="navbar navbar-expand-lg" :class="{ scrolled: isScrolled }" id="scrollspyHeading1">
    <div class="nav-inner">

      <router-link class="navbar-brand" to="/">
        <img class="logo" src="../assets/img/ROYAL_CLEAN_2025_BLANCO.png" alt="Royall Clean logo" />
      </router-link>

      <button class="toggler" :class="{ open: menuOpen }" type="button"
        data-bs-toggle="collapse" data-bs-target="#navMenu"
        aria-controls="navMenu" :aria-expanded="menuOpen" aria-label="Abrir menú"
        @click="menuOpen = !menuOpen">
        <span class="bar bar-1"></span>
        <span class="bar bar-2"></span>
        <span class="bar bar-3"></span>
      </button>

      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item"><a class="nl" href="#" @click.prevent="scrollToSection('inicio')">Inicio</a></li>
          <li class="nav-item"><a class="nl" href="#" @click.prevent="scrollToSection('texto-principal')">Nosotros</a></li>
          <li class="nav-item"><a class="nl" href="#" @click.prevent="scrollToSection('servicios')">Servicios</a></li>
          <li class="nav-item"><a class="nl" href="#" @click.prevent="scrollToSection('trabajos-realizados')">Trabajos realizados</a></li>
          <li class="nav-item"><a class="nl" href="#" @click.prevent="scrollToSection('precios')">Precios</a></li>
          <li class="nav-item"><router-link class="nl" to="/blog" @click="closeNavbar">Blog</router-link></li>
          <li class="nav-item"><router-link class="nl" to="/contacto" @click="closeNavbar">Contacto</router-link></li>
        </ul>

        <div class="nav-right">
          <router-link to="/contacto" class="cta-btn" @click="closeNavbar">
            Presupuesto gratis
          </router-link>

          <button class="icon-btn theme-toggle" @click="toggleTheme" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
            <font-awesome-icon :icon="['fas', isDark ? 'sun' : 'moon']" />
          </button>

          <template v-if="userStore.userData?.email">
            <router-link v-if="isAdmin(userStore.userData.email)"
              to="/Register" class="icon-btn" title="Registro" @click="closeNavbar">
              <font-awesome-icon :icon="['fas', 'address-card']" />
            </router-link>
            <router-link v-if="isAdmin(userStore.userData.email)"
              to="/misClientes" class="icon-btn" title="Mis Clientes" @click="closeNavbar">
              <font-awesome-icon :icon="['fas', 'rectangle-list']" />
            </router-link>
            <router-link to="/admin/mensajes" class="icon-btn msg-btn" title="Mensajes" @click="closeNavbar">
              <font-awesome-icon :icon="['fas', 'file-invoice']" />
              <span v-if="userStore.unreadMessagesCount > 0" class="msg-dot">
                {{ userStore.unreadMessagesCount }}
              </span>
            </router-link>
            <button class="icon-btn" title="Cerrar sesión" @click="userStore.logOutUser">
              <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
            </button>
          </template>

        </div>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const isScrolled = ref(false);
const menuOpen = ref(false);

const isDark = ref(false);

const applyTheme = (dark) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('rc-theme', dark ? 'dark' : 'light');
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
};

const isAdmin = (email) =>
  email === 'roys.abreu@gmail.com';

const closeNavbar = () => {
  const menu = document.getElementById('navMenu');
  if (menu?.classList.contains('show')) {
    menuOpen.value = false;
    document.querySelector('.toggler')?.click();
  }
};

const scrollToSection = (id) => {
  closeNavbar();
  if (id === 'inicio') {
    route.path === '/'
      ? window.scrollTo({ top: 0, behavior: 'smooth' })
      : router.push('/');
    return;
  }
  if (route.path === '/') {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  } else {
    router.push(`/#${id}`);
  }
};

const handleScroll = () => { isScrolled.value = window.scrollY > 10; };

const handleOutsideClick = (e) => {
  if (!menuOpen.value) return;
  const nav = document.getElementById('scrollspyHeading1');
  if (nav && !nav.contains(e.target)) {
    closeNavbar();
  }
};

onMounted(() => {
  const saved = localStorage.getItem('rc-theme');
  isDark.value = saved === 'dark';
  applyTheme(isDark.value);

  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('click', handleOutsideClick);
  if (userStore.userData && isAdmin(userStore.userData.email)) {
    userStore.startUnreadMessagesListener();
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleOutsideClick);
  userStore.stopUnreadMessagesListener();
});
</script>

<style scoped>
/* ── BASE ── */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: rgba(15, 23, 41, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s, box-shadow 0.3s;
  padding: 0;
}
.navbar.scrolled {
  border-bottom-color: rgba(255, 255, 255, 0.07);
  box-shadow: 0 4px 28px rgba(0, 0, 0, 0.35);
}

/* ── INNER ── */
.nav-inner {
  display: flex;
  align-items: center;
  height: 54px;
  padding: 0 20px;
  width: 100%;
}

/* ── LOGO ── */
.navbar-brand { margin-left: 8px; }
.logo {
  height: 54px;
  width: auto;
  display: block;
  transition: transform 0.25s;
}
.logo:hover { transform: scale(1.04); }

/* ── HAMBURGER ── */
.toggler {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: 1.5px solid transparent;
  padding: 8px;
  margin-left: auto;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}
.toggler:hover {
  background: rgba(96, 165, 250, 0.1);
  border-color: rgba(96, 165, 250, 0.3);
}
.toggler:active { transform: scale(0.92); }
.toggler:focus { outline: none; box-shadow: none; }

.bar {
  display: block;
  width: 22px;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  transform-origin: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s ease,
              background 0.2s;
}
.toggler:hover .bar { background: #60a5fa; }

/* Estado abierto → X */
.toggler.open .bar-1 { transform: translateY(7px) rotate(45deg); }
.toggler.open .bar-2 { opacity: 0; transform: scaleX(0); }
.toggler.open .bar-3 { transform: translateY(-7px) rotate(-45deg); }
.toggler.open { border-color: rgba(96, 165, 250, 0.4); background: rgba(96, 165, 250, 0.08); }
.toggler.open .bar { background: #60a5fa; }

/* ── NAV LINKS ── */
ul.navbar-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nl {
  display: block;
  color: rgba(255, 255, 255, 0.65);
  font-family: 'Raleway', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 6px 13px;
  border-radius: 6px;
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
  white-space: nowrap;
}
.nl:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.09);
}

/* ── RIGHT ACTIONS ── */
.nav-right {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
}

.cta-btn {
  background: var(--blue);
  color: #fff;
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 7px 16px;
  border-radius: 20px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.cta-btn:hover {
  background: var(--blue-hover);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: rgba(255, 255, 255, 0.55);
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s, background 0.2s;
  position: relative;
  padding: 0;
}
.icon-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.theme-toggle { color: rgba(255,255,255,0.65); font-size: 0.9rem; }
.theme-toggle:hover { color: #fbbf24; background: rgba(251,191,36,0.1); }



.msg-btn { position: relative; }
.msg-dot {
  position: absolute;
  top: 1px;
  right: 1px;
  background: #ef4444;
  color: #fff;
  font-size: 0.58rem;
  font-weight: 700;
  min-width: 15px;
  height: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  line-height: 1;
}

/* ── MOBILE ── */
@media (max-width: 991.98px) {
  .toggler { display: flex; }

  .navbar-collapse {
    position: absolute;
    top: 60px;
    right: 12px;
    left: auto;
    width: auto;
    min-width: 230px;
    background: rgba(10, 17, 34, 0.98);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.55);
    padding: 10px 10px 12px;
  }

  ul.navbar-nav {
    flex-direction: column;
    align-items: stretch;
    gap: 1px;
    margin-bottom: 8px;
  }

  .nl {
    padding: 10px 14px;
    font-size: 0.9rem;
    border-radius: 8px;
    white-space: nowrap;
  }

  .nav-right {
    flex-wrap: wrap;
    gap: 6px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    margin-left: 0;
  }

  .cta-btn {
    flex: 1;
    text-align: center;
    padding: 9px 14px;
    font-size: 0.85rem;
    border-radius: 9px;
  }

  .icon-btn { width: 36px; height: 36px; font-size: 0.95rem; border-radius: 8px; }

  .logo { height: 54px; }
}

@media (max-width: 400px) {
  .navbar-collapse {
    right: 8px;
    left: 8px;
    min-width: 0;
    width: auto;
  }
}
</style>
