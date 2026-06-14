<template>
  <div class="blog-wrap">

    <div class="blog-hero">
      <span class="blog-label">Blog</span>
      <h1 class="blog-title">Consejos de <span class="blog-accent">limpieza de cristales</span></h1>
      <p class="blog-sub">{{ articles.length }} artículos con guías prácticas para mantener tus cristales y escaparates en perfecto estado todo el año.</p>
    </div>

    <div class="blog-filters">
      <button
        v-for="cat in categories"
        :key="cat.value"
        class="filter-btn"
        :class="{ active: activeFilter === cat.value }"
        @click="activeFilter = cat.value"
      >
        <font-awesome-icon v-if="cat.icon" :icon="cat.icon" class="me-1" />
        {{ cat.label }}
      </button>
    </div>

    <div v-if="featured">
      <router-link :to="`/blog/${featured.slug}`" class="blog-featured">
        <div class="blog-featured-img">
          <img :src="featured.image" :alt="featured.title" loading="eager" />
          <span class="blog-featured-badge" :style="{ background: featured.color }">
            <font-awesome-icon :icon="featured.icon" class="me-1" />{{ featured.season }}
          </span>
        </div>
        <div class="blog-featured-body">
          <p class="blog-card-date">{{ featured.dateLabel }}</p>
          <h2 class="blog-featured-title">{{ featured.title }}</h2>
          <p class="blog-featured-excerpt">{{ featured.excerpt }}</p>
          <span class="blog-card-link" :style="{ color: featured.color }">
            Leer artículo completo <font-awesome-icon :icon="['fas', 'arrow-right']" class="ms-1" />
          </span>
        </div>
      </router-link>

      <div class="blog-grid" v-if="rest.length">
        <router-link
          v-for="article in rest"
          :key="article.slug"
          :to="`/blog/${article.slug}`"
          class="blog-card"
        >
          <div class="blog-card-top">
            <img :src="article.image" :alt="article.title" loading="lazy" class="blog-card-img" />
            <span class="blog-card-season" :style="{ color: '#fff', background: article.color }">
              <font-awesome-icon :icon="article.icon" class="me-1" />{{ article.season }}
            </span>
          </div>
          <div class="blog-card-body">
            <p class="blog-card-date">{{ article.dateLabel }}</p>
            <h2 class="blog-card-title">{{ article.title }}</h2>
            <p class="blog-card-excerpt">{{ article.excerpt }}</p>
            <span class="blog-card-link" :style="{ color: article.color }">
              Leer artículo <font-awesome-icon :icon="['fas', 'arrow-right']" class="ms-1" />
            </span>
          </div>
        </router-link>
      </div>
    </div>

    <p v-else class="blog-empty">No hay artículos en esta categoría.</p>

    <div class="blog-cta">
      <p class="blog-cta-text">¿Prefieres que nos encarguemos nosotros?</p>
      <div class="blog-cta-btns">
        <a href="tel:+34696169435" class="blog-cta-btn blog-cta-btn--primary">
          <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />696 169 435
        </a>
        <router-link to="/contacto" class="blog-cta-btn blog-cta-btn--outline">
          Pedir presupuesto gratis
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { articles } from '../data/blog.js';

const activeFilter = ref('all');

const categories = computed(() => {
  const seen = new Set();
  const seasons = articles
    .filter(a => { if (seen.has(a.season)) return false; seen.add(a.season); return true; })
    .map(a => ({ value: a.season, label: a.season, icon: a.icon }));
  return [{ value: 'all', label: 'Todos', icon: null }, ...seasons];
});

const filtered = computed(() =>
  activeFilter.value === 'all' ? articles : articles.filter(a => a.season === activeFilter.value)
);

const featured = computed(() => filtered.value[0] || null);
const rest = computed(() => filtered.value.slice(1));
</script>

<style scoped>
.blog-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px 60px;
  color: var(--text);
  min-height: 100vh;
}

/* ── Hero ── */
.blog-hero {
  text-align: left;
  padding: 48px 20px 36px;
}
.blog-label {
  display: inline-block;
  background: var(--blue-pale);
  color: var(--blue);
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 18px;
}
.blog-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.6rem;
  color: var(--text);
  margin: 0 0 14px;
  line-height: 1.1;
}
.blog-accent { color: var(--blue); }
.blog-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 1rem;
  color: var(--text-muted);
  max-width: 560px;
  margin: 0;
  line-height: 1.65;
}

/* ── Filters ── */
.blog-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}
.filter-btn {
  display: inline-flex;
  align-items: center;
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 7px 18px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--white);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn:hover {
  border-color: var(--blue);
  color: var(--blue);
}
.filter-btn.active {
  background: var(--blue);
  border-color: var(--blue);
  color: #fff;
}

/* ── Featured ── */
.blog-featured {
  display: flex;
  gap: 0;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  text-decoration: none;
  margin-bottom: 28px;
  transition: box-shadow 0.25s, transform 0.25s;
}
.blog-featured:hover {
  box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  transform: translateY(-3px);
}
.blog-featured-img {
  position: relative;
  width: 44%;
  flex-shrink: 0;
  overflow: hidden;
}
.blog-featured-img img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.blog-featured:hover .blog-featured-img img { transform: scale(1.05); }
.blog-featured-badge {
  position: absolute;
  bottom: 14px; left: 14px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  padding: 5px 14px;
  border-radius: 20px;
}
.blog-featured-body {
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  flex: 1;
}
.blog-featured-title {
  font-family: 'Anton', sans-serif;
  font-size: 1.75rem;
  color: var(--text);
  margin: 0;
  line-height: 1.2;
}
.blog-featured-excerpt {
  font-family: 'Raleway', sans-serif;
  font-size: 0.94rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Grid ── */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

/* ── Card ── */
.blog-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.25s, transform 0.25s;
}
.blog-card:hover {
  box-shadow: 0 10px 36px rgba(0,0,0,0.1);
  transform: translateY(-4px);
}
.blog-card-top {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}
.blog-card-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}
.blog-card:hover .blog-card-img { transform: scale(1.06); }
.blog-card-season {
  position: absolute;
  bottom: 10px; left: 10px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
}
.blog-card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.blog-card-date {
  font-family: 'Raleway', sans-serif;
  font-size: 0.72rem;
  color: var(--text-muted);
  margin: 0;
}
.blog-card-title {
  font-family: 'Anton', sans-serif;
  font-size: 1.15rem;
  color: var(--text);
  margin: 0;
  line-height: 1.25;
}
.blog-card-excerpt {
  font-family: 'Raleway', sans-serif;
  font-size: 0.84rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.blog-card-link {
  font-family: 'Raleway', sans-serif;
  font-size: 0.83rem;
  font-weight: 700;
  margin-top: 4px;
}

/* ── Empty ── */
.blog-empty {
  text-align: center;
  font-family: 'Raleway', sans-serif;
  color: var(--text-muted);
  padding: 48px 0;
}

/* ── CTA ── */
.blog-cta {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 36px 28px;
  text-align: center;
  margin-top: 16px;
}
.blog-cta-text {
  font-family: 'Anton', sans-serif;
  font-size: 1.4rem;
  color: var(--text);
  margin: 0 0 20px;
}
.blog-cta-btns { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.blog-cta-btn {
  display: inline-flex; align-items: center;
  font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.9rem;
  padding: 12px 24px; border-radius: 11px; text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.blog-cta-btn--primary { background: var(--blue); color: #fff; }
.blog-cta-btn--primary:hover { background: var(--blue-hover); color: #fff; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,0.35); }
.blog-cta-btn--outline { background: transparent; color: var(--blue); border: 1.5px solid var(--blue); }
.blog-cta-btn--outline:hover { background: var(--blue); color: #fff; transform: translateY(-2px); }

@media (max-width: 768px) {
  .blog-title { font-size: 1.9rem; }
  .blog-hero { padding: 32px 0 24px; }
  .blog-featured { flex-direction: column; }
  .blog-featured-img { width: 100%; aspect-ratio: 16 / 8; }
  .blog-featured-body { padding: 22px 20px; }
  .blog-featured-title { font-size: 1.35rem; }
  .blog-grid { grid-template-columns: 1fr; }
  .blog-cta { padding: 24px 16px; }
  .blog-cta-btn { flex: 1; justify-content: center; }
}
</style>
