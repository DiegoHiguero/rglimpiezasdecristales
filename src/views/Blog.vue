<template>
  <div class="blog-wrap">

    <div class="blog-hero">
      <span class="blog-label">Blog</span>
      <h1 class="blog-title">Consejos de <span class="blog-accent">limpieza de cristales</span></h1>
      <p class="blog-sub">Guías prácticas para mantener tus cristales y escaparates en perfecto estado durante todo el año.</p>
    </div>

    <div class="blog-grid">
      <router-link
        v-for="article in articles"
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

    <div class="blog-cta">
      <p class="blog-cta-text">¿Prefieres que nos encarguemos nosotros?</p>
      <div class="blog-cta-btns">
        <a href="tel:+34696169435" class="blog-cta-btn blog-cta-btn--primary">
          <font-awesome-icon :icon="['fas', 'phone']" class="me-2" />Llamar ahora
        </a>
        <router-link to="/contacto" class="blog-cta-btn blog-cta-btn--outline">
          Pedir presupuesto gratis
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { articles } from '../data/blog.js';
</script>

<style scoped>
.blog-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px 60px;
  background: var(--slate);
  color: var(--text);
  min-height: 100vh;
}

/* ── Hero ── */
.blog-hero {
  text-align: center;
  padding: 48px 20px 44px;
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
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.65;
}

/* ── Grid ── */
.blog-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  margin-bottom: 48px;
}

/* ── Card ── */
.blog-card {
  width: 300px;
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

/* ── CTA ── */
.blog-cta {
  background: var(--blue-pale);
  border: 1px solid rgba(37,99,235,0.15);
  border-radius: var(--r-lg);
  padding: 32px 28px;
  text-align: center;
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
.blog-cta-btn--outline { background: var(--white); color: var(--blue); border: 1.5px solid var(--blue); }
.blog-cta-btn--outline:hover { background: var(--blue); color: #fff; transform: translateY(-2px); }

@media (max-width: 768px) {
  .blog-title { font-size: 1.9rem; }
  .blog-hero { padding: 32px 0 28px; }
  .blog-cta { padding: 24px 16px; }
  .blog-cta-btn { flex: 1; justify-content: center; }
}
</style>
