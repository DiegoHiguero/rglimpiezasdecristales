<template>
  <div class="article-wrap" v-if="article">

    <div class="article-breadcrumb">
      <router-link to="/">Inicio</router-link>
      <span class="sep">/</span>
      <router-link to="/blog">Blog</router-link>
      <span class="sep">/</span>
      <span>{{ article.season }}</span>
    </div>

    <article class="article-body">
      <header class="article-header">
        <div class="article-meta">
          <span class="article-season-badge" :style="{ color: article.color, background: article.colorPale, border: `1px solid ${article.color}33` }">
            <font-awesome-icon :icon="article.icon" class="me-1" /> {{ article.season }}
          </span>
          <span class="article-date">{{ article.dateLabel }}</span>
        </div>
        <h1 class="article-title">{{ article.title }}</h1>
        <p class="article-excerpt">{{ article.excerpt }}</p>
      </header>

      <div class="article-hero-img" v-if="article.image">
        <img :src="article.image" :alt="article.title" loading="lazy" />
      </div>

      <div class="article-content" v-html="article.content"></div>

      <div class="article-cta">
        <div class="article-cta-inner">
          <h2 class="article-cta-title">¿Necesitas una limpieza profesional?</h2>
          <p class="article-cta-sub">Cubrimos Madrid y toda la Comunidad de Madrid. Presupuesto gratuito en menos de 24 h.</p>
          <div class="article-cta-btns">
            <a href="tel:+34696169435" class="article-btn article-btn--primary">
              <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />696 169 435
            </a>
            <router-link to="/contacto" class="article-btn article-btn--outline">
              Pedir presupuesto gratis
            </router-link>
          </div>
        </div>
      </div>

      <div class="article-related">
        <h3 class="related-title">Otros artículos</h3>
        <div class="related-grid">
          <router-link
            v-for="a in related"
            :key="a.slug"
            :to="`/blog/${a.slug}`"
            class="related-card"
          >
            <span class="related-icon" :style="{ background: a.colorPale, color: a.color }">
              <font-awesome-icon :icon="a.icon" />
            </span>
            <div>
              <span class="related-season" :style="{ color: a.color }">{{ a.season }}</span>
              <p class="related-card-title">{{ a.title }}</p>
            </div>
          </router-link>
        </div>
      </div>

    </article>
  </div>

  <div v-else class="article-notfound">
    <p>Artículo no encontrado.</p>
    <router-link to="/blog">← Volver al blog</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { articles, getArticleBySlug } from '../data/blog.js';

const route = useRoute();
const article = computed(() => getArticleBySlug(route.params.slug));
const related = computed(() => articles.filter(a => a.slug !== route.params.slug).slice(0, 3));
</script>

<style scoped>
.article-wrap {
  max-width: 780px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

/* ── Breadcrumb ── */
.article-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 32px;
}
.article-breadcrumb a { color: var(--blue); text-decoration: none; }
.article-breadcrumb a:hover { text-decoration: underline; }
.sep { color: var(--border); }

/* ── Header ── */
.article-header { margin-bottom: 36px; }
.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.article-season-badge {
  font-family: 'Raleway', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
}
.article-date {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.article-title {
  font-family: 'Anton', sans-serif;
  font-size: 2.2rem;
  color: var(--text);
  line-height: 1.15;
  margin: 0 0 16px;
}
.article-excerpt {
  font-family: 'Raleway', sans-serif;
  font-size: 1.05rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
  border-left: 3px solid var(--blue);
  padding-left: 16px;
}

/* ── Hero image ── */
.article-hero-img {
  border-radius: var(--r-md);
  overflow: hidden;
  aspect-ratio: 16 / 6;
  margin-bottom: 32px;
}
.article-hero-img img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Content ── */
.article-content {
  font-family: 'Raleway', sans-serif;
  font-size: 0.97rem;
  color: var(--text);
  line-height: 1.8;
}
:deep(.article-content h2) {
  font-family: 'Anton', sans-serif;
  font-size: 1.5rem;
  color: var(--text);
  margin: 36px 0 14px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border);
}
:deep(.article-content h3) {
  font-family: 'Raleway', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
  margin: 24px 0 10px;
}
:deep(.article-content p) {
  margin: 0 0 16px;
}
:deep(.article-content ul) {
  padding-left: 20px;
  margin: 0 0 16px;
}
:deep(.article-content li) {
  margin-bottom: 6px;
}

/* ── CTA ── */
.article-cta {
  margin: 44px 0;
  background: var(--blue-pale);
  border: 1px solid rgba(37,99,235,0.15);
  border-radius: var(--r-lg);
  padding: 32px 28px;
}
.article-cta-title {
  font-family: 'Anton', sans-serif;
  font-size: 1.5rem;
  color: var(--text);
  margin: 0 0 8px;
}
.article-cta-sub {
  font-family: 'Raleway', sans-serif;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0 0 20px;
}
.article-cta-btns { display: flex; gap: 12px; flex-wrap: wrap; }
.article-btn {
  display: inline-flex; align-items: center;
  font-family: 'Raleway', sans-serif; font-weight: 700; font-size: 0.88rem;
  padding: 11px 22px; border-radius: 10px; text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.article-btn--primary { background: var(--blue); color: #fff; }
.article-btn--primary:hover { background: var(--blue-hover); color: #fff; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,0.35); }
.article-btn--outline { background: var(--white); color: var(--blue); border: 1.5px solid var(--blue); }
.article-btn--outline:hover { background: var(--blue); color: #fff; transform: translateY(-2px); }

/* ── Related ── */
.related-title {
  font-family: 'Anton', sans-serif;
  font-size: 1.2rem;
  color: var(--text);
  margin: 0 0 16px;
}
.related-grid { display: flex; flex-direction: column; gap: 10px; }
.related-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--r-md); padding: 14px 16px;
  text-decoration: none; transition: box-shadow 0.2s, transform 0.2s;
}
.related-card:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.07); transform: translateY(-2px); }
.related-icon {
  width: 38px; height: 38px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.95rem; flex-shrink: 0;
}
.related-season {
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  display: block; margin-bottom: 3px;
}
.related-card-title {
  font-family: 'Raleway', sans-serif;
  font-size: 0.86rem; font-weight: 700;
  color: var(--text); margin: 0;
}

.article-notfound {
  text-align: center; padding: 80px 20px;
  font-family: 'Raleway', sans-serif; color: var(--text-muted);
}
.article-notfound a { color: var(--blue); }

@media (max-width: 768px) {
  .article-title { font-size: 1.65rem; }
  .article-cta { padding: 22px 16px; }
  .article-btn { flex: 1; justify-content: center; }
}
</style>
