<template>
  <div class="nf-wrap">
    <div class="nf-inner">

      <img src="../assets/img/404-ilustracion.webp" alt="No podemos limpiar esta ventana... Error 404" class="nf-illustration" />

      <h1 class="nf-title">Esta página no existe</h1>
      <p class="nf-sub">Puede que la URL esté mal escrita o que la página haya sido eliminada.<br>Pero los cristales de Madrid siguen necesitando limpieza.</p>

      <div class="nf-btns">
        <router-link to="/" class="nf-btn nf-btn--primary">Volver al inicio</router-link>
        <router-link to="/contacto" class="nf-btn nf-btn--outline">Pedir presupuesto</router-link>
      </div>

      <div class="nf-links">
        <router-link to="/#servicios">Servicios</router-link>
        <span>·</span>
        <router-link to="/blog">Blog</router-link>
        <span>·</span>
        <router-link to="/contacto">Contacto</router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.nf-wrap {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: var(--slate);
}

.nf-inner {
  text-align: center;
  max-width: 520px;
}

.nf-illustration {
  width: 100%;
  max-width: 340px;
  height: auto;
  margin: 0 auto 28px;
  display: block;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.25);
  transform: rotate(-2deg);
  transition: transform 0.3s ease;
}
.nf-illustration:hover { transform: rotate(-1deg) scale(1.02); }

.nf-title {
  font-family: 'Anton', sans-serif;
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  color: var(--text);
  margin: 0 0 14px;
}

.nf-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.97rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0 0 36px;
}

.nf-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.nf-btn {
  font-family: 'Raleway', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 12px 28px;
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}

.nf-btn--primary {
  background: var(--blue);
  color: #fff;
}
.nf-btn--primary:hover {
  background: var(--blue-hover);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.35);
}

.nf-btn--outline {
  background: transparent;
  color: var(--blue);
  border: 1.5px solid var(--blue);
}
.nf-btn--outline:hover {
  background: var(--blue);
  color: #fff;
  transform: translateY(-2px);
}

.nf-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.82rem;
}
.nf-links a { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
.nf-links a:hover { color: var(--blue); }
.nf-links span { color: var(--border); }
</style>
