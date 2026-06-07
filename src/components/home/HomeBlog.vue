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
      <!-- Featured first article -->
      <router-link :to="`/blog/${latest[0].slug}`" class="hb-featured">
        <div class="hb-featured-img">
          <img :src="latest[0].image" :alt="latest[0].title" loading="lazy" />
          <span class="hb-badge" :style="{ background: latest[0].color }">
            <font-awesome-icon :icon="latest[0].icon" class="me-1" />{{ latest[0].season }}
          </span>
        </div>
        <div class="hb-featured-body">
          <p class="hb-date">{{ latest[0].dateLabel }}</p>
          <h3 class="hb-featured-title">{{ latest[0].title }}</h3>
          <p class="hb-featured-excerpt">{{ latest[0].excerpt }}</p>
          <span class="hb-read" :style="{ color: latest[0].color }">
            Leer artículo <font-awesome-icon :icon="['fas', 'arrow-right']" class="ms-1" />
          </span>
        </div>
      </router-link>

      <!-- Other 2 articles -->
      <div class="hb-side">
        <router-link
          v-for="article in latest.slice(1)"
          :key="article.slug"
          :to="`/blog/${article.slug}`"
          class="hb-card"
        >
          <div class="hb-card-img-wrap">
            <img :src="article.image" :alt="article.title" loading="lazy" class="hb-card-img" />
            <span class="hb-badge" :style="{ background: article.color }">
              <font-awesome-icon :icon="article.icon" class="me-1" />{{ article.season }}
            </span>
          </div>
          <div class="hb-card-body">
            <p class="hb-date">{{ article.dateLabel }}</p>
            <h3 class="hb-card-title">{{ article.title }}</h3>
            <p class="hb-card-excerpt">{{ article.excerpt }}</p>
            <span class="hb-read" :style="{ color: article.color }">
              Leer <font-awesome-icon :icon="['fas', 'arrow-right']" class="ms-1" />
            </span>
          </div>
        </router-link>
      </div>
    </div>

    <div class="hb-footer">
      <router-link to="/blog" class="hb-btn">
        Ver todos los artículos <font-awesome-icon :icon="['fas', 'arrow-right']" class="ms-2" />
      </router-link>
    </div>

  </section>
</template>

<script setup>
import { computed } from 'vue';
import { articles } from '../../data/blog.js';

const latest = computed(() => articles.slice(0, 3));
</script>

<style scoped>
.hb-section {
  background: var(--white);
  margin: 12px 20px;
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

/* ── Grid layout ── */
.hb-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 28px;
}

/* ── Featured ── */
.hb-featured {
  display: flex;
  flex-direction: column;
  background: var(--slate);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  text-decoration: none;
  transition: box-shadow 0.2s, transform 0.2s;
}
.hb-featured:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.1); transform: translateY(-3px); }
.hb-featured-img {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}
.hb-featured-img img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform 0.4s ease;
}
.hb-featured:hover .hb-featured-img img { transform: scale(1.05); }
.hb-badge {
  position: absolute;
  bottom: 10px; left: 10px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: #fff; padding: 4px 11px; border-radius: 20px;
}
.hb-featured-body {
  padding: 18px 20px 22px;
  display: flex; flex-direction: column; gap: 8px; flex: 1;
}
.hb-featured-title {
  font-family: 'Anton', sans-serif;
  font-size: 1.2rem; color: var(--text); margin: 0; line-height: 1.25;
}
.hb-featured-excerpt {
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem; color: var(--text-muted); line-height: 1.6;
  margin: 0; flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Side cards ── */
.hb-side {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.hb-card {
  display: flex;
  flex-direction: column;
  background: var(--slate);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  overflow: hidden;
  text-decoration: none;
  flex: 1;
  transition: box-shadow 0.2s, transform 0.2s;
}
.hb-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.08); transform: translateY(-2px); }
.hb-card-img-wrap {
  position: relative;
  aspect-ratio: 16 / 6;
  overflow: hidden;
}
.hb-card-img {
  width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: transform 0.4s ease;
}
.hb-card:hover .hb-card-img { transform: scale(1.06); }
.hb-card-body {
  padding: 14px 16px 18px;
  display: flex; flex-direction: column; gap: 5px; flex: 1;
}
.hb-card-title {
  font-family: 'Raleway', sans-serif; font-size: 0.88rem;
  font-weight: 700; color: var(--text); margin: 0; line-height: 1.4;
}
.hb-card-excerpt {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem; color: var(--text-muted); line-height: 1.55;
  margin: 0; flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Shared ── */
.hb-date {
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem; color: var(--text-muted); margin: 0;
}
.hb-read {
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem; font-weight: 700;
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

@media (max-width: 900px) {
  .hb-grid { grid-template-columns: 1fr; }
  .hb-side { flex-direction: row; }
  .hb-card { flex: 1; }
}
@media (max-width: 600px) {
  .hb-section { margin: 10px 10px; padding: 32px 16px 28px; }
  .hb-title { font-size: 1.7rem; }
  .hb-side { flex-direction: column; }
}
</style>
