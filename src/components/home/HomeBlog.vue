<template>
  <section class="hb-section">

    <div class="hb-header">
      <span class="hb-label">
        <font-awesome-icon :icon="['fas', 'book-open']" class="me-1" />
        Blog &amp; Consejos
      </span>
      <h2 class="hb-title">Guías de <span class="hb-accent">limpieza de cristales</span></h2>
      <p class="hb-sub">Consejos profesionales para cada época del año</p>
    </div>

    <div class="hb-grid">
      <router-link
        v-for="article in articles"
        :key="article.slug"
        :to="`/blog/${article.slug}`"
        class="hb-card"
      >
        <div class="hb-card-icon-wrap" :style="{ background: article.colorPale }">
          <span class="hb-card-icon">{{ article.icon }}</span>
        </div>
        <div class="hb-card-body">
          <span class="hb-season" :style="{ color: article.color }">{{ article.season }}</span>
          <h3 class="hb-card-title">{{ article.title }}</h3>
          <span class="hb-read" :style="{ color: article.color }">
            Leer <font-awesome-icon :icon="['fas', 'arrow-right']" class="ms-1" />
          </span>
        </div>
      </router-link>
    </div>

    <div class="hb-footer">
      <router-link to="/blog" class="hb-btn">
        Ver todos los artículos <font-awesome-icon :icon="['fas', 'arrow-right']" class="ms-2" />
      </router-link>
    </div>

  </section>
</template>

<script setup>
import { articles } from '../../data/blog.js';
</script>

<style scoped>
.hb-section {
  background: var(--white);
  margin: 12px 15px;
  border-radius: var(--r-lg);
  padding: 40px 28px 36px;
}

.hb-header {
  text-align: center;
  margin-bottom: 32px;
}
.hb-label {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--blue-pale); color: var(--blue);
  font-family: 'Raleway', sans-serif; font-size: 0.72rem;
  font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
  padding: 5px 14px; border-radius: 20px; margin-bottom: 16px;
}
.hb-title {
  font-family: 'Anton', sans-serif; font-size: 2.2rem;
  color: var(--text); margin: 0 0 10px; line-height: 1.15;
}
.hb-accent { color: var(--blue); }
.hb-sub {
  font-family: 'Raleway', sans-serif; font-size: 0.95rem;
  color: var(--text-muted); margin: 0;
}

.hb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.hb-card {
  display: flex; flex-direction: column;
  background: var(--slate); border: 1px solid var(--border);
  border-radius: var(--r-md); overflow: hidden; text-decoration: none;
  transition: box-shadow 0.2s, transform 0.2s;
}
.hb-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.08); transform: translateY(-3px); }

.hb-card-icon-wrap {
  display: flex; align-items: center; justify-content: center;
  padding: 22px 0;
}
.hb-card-icon { font-size: 2.2rem; line-height: 1; }

.hb-card-body {
  padding: 14px 16px 18px;
  display: flex; flex-direction: column; gap: 6px; flex: 1;
}
.hb-season {
  font-family: 'Raleway', sans-serif; font-size: 0.7rem;
  font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase;
}
.hb-card-title {
  font-family: 'Raleway', sans-serif; font-size: 0.88rem;
  font-weight: 700; color: var(--text); margin: 0; line-height: 1.4;
  flex: 1;
}
.hb-read {
  font-family: 'Raleway', sans-serif; font-size: 0.8rem; font-weight: 700;
  margin-top: 4px;
}

.hb-footer { text-align: center; }
.hb-btn {
  display: inline-flex; align-items: center;
  background: var(--blue); color: #fff;
  font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.9rem;
  padding: 12px 28px; border-radius: 11px; text-decoration: none;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.hb-btn:hover {
  background: var(--blue-hover); color: #fff;
  transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,0.35);
}

@media (max-width: 768px) {
  .hb-section { margin: 10px 10px; padding: 32px 16px 28px; border-radius: var(--r-md); }
  .hb-title { font-size: 1.7rem; }
}
</style>
