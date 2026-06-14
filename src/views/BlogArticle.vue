<template>
  <div class="article-wrap" v-if="article">

    <div class="article-breadcrumb">
      <router-link to="/">Inicio</router-link>
      <span class="sep">/</span>
      <router-link to="/blog">Blog</router-link>
      <span class="sep">/</span>
      <span class="breadcrumb-current">{{ article.title }}</span>
    </div>

    <article class="article-body">
      <header class="article-header">
        <div class="article-meta">
          <span class="article-season-badge" :style="{ color: article.color, background: article.colorPale, border: `1px solid ${article.color}33` }">
            <font-awesome-icon :icon="article.icon" class="me-1" /> {{ article.season }}
          </span>
          <span class="article-date">{{ article.dateLabel }}</span>
          <span class="article-read-time">{{ readTime }} min de lectura</span>
        </div>
        <h1 class="article-title">{{ article.title }}</h1>
        <p class="article-excerpt">{{ article.excerpt }}</p>
      </header>

      <div class="article-hero-img" v-if="article.image">
        <img :src="article.image" :alt="article.title" loading="eager" />
      </div>

      <div class="article-content" v-html="purify(article.content)"></div>

      <div class="article-share">
        <span class="share-label">Compartir</span>
        <a :href="`https://wa.me/?text=${encodeURIComponent(article.title + ' — ' + pageUrl)}`"
           target="_blank" rel="noopener noreferrer" class="share-btn share-btn--wa" aria-label="Compartir en WhatsApp">
          <font-awesome-icon :icon="['fab', 'whatsapp']" />
        </a>
        <a :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`"
           target="_blank" rel="noopener noreferrer" class="share-btn share-btn--fb" aria-label="Compartir en Facebook">
          <font-awesome-icon :icon="['fab', 'facebook']" />
        </a>
        <a :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(pageUrl)}`"
           target="_blank" rel="noopener noreferrer" class="share-btn share-btn--x" aria-label="Compartir en X">
          <font-awesome-icon :icon="['fab', 'x-twitter']" />
        </a>
        <a :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`"
           target="_blank" rel="noopener noreferrer" class="share-btn share-btn--li" aria-label="Compartir en LinkedIn">
          <font-awesome-icon :icon="['fab', 'linkedin']" />
        </a>
        <button class="share-btn share-btn--copy" @click="copyLink" :aria-label="copied ? 'Enlace copiado' : 'Copiar enlace'">
          <font-awesome-icon :icon="['fas', copied ? 'check' : 'link']" />
        </button>
      </div>

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

      <div class="article-related" v-if="related.length">
        <h3 class="related-title">Más artículos</h3>
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
            <div class="related-text">
              <span class="related-season" :style="{ color: a.color }">{{ a.season }}</span>
              <p class="related-card-title">{{ a.title }}</p>
              <span class="related-arrow" :style="{ color: a.color }">
                Leer <font-awesome-icon :icon="['fas', 'arrow-right']" class="ms-1" />
              </span>
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
import { computed, onMounted, onUnmounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { articles, getArticleBySlug } from '../data/blog.js';
import DOMPurify from 'dompurify';

const purify = (html) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

const pageUrl = computed(() => `https://royallclean.es/blog/${route.params.slug}`);
const copied = ref(false);
const copyLink = async () => {
  await navigator.clipboard.writeText(pageUrl.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
};

const route = useRoute();
const article = computed(() => getArticleBySlug(route.params.slug));
const related = computed(() => articles.filter(a => a.slug !== route.params.slug).slice(0, 3));

const readTime = computed(() => {
  if (!article.value?.content) return 3;
  const words = article.value.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 200));
});

let schemaEl = null;

function injectSchema(a) {
  if (schemaEl) { schemaEl.remove(); schemaEl = null; }
  if (!a) return;
  schemaEl = document.createElement('script');
  schemaEl.type = 'application/ld+json';
  schemaEl.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: a.title,
        description: a.metaDescription,
        datePublished: a.date,
        dateModified: a.date,
        image: window.location.origin + a.image,
        author: { '@type': 'Organization', name: 'Royall Clean' },
        publisher: { '@type': 'Organization', name: 'Royall Clean', url: 'https://royallclean.es' },
        url: 'https://royallclean.es/blog/' + a.slug,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://royallclean.es/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://royallclean.es/blog' },
          { '@type': 'ListItem', position: 3, name: a.title, item: 'https://royallclean.es/blog/' + a.slug },
        ],
      },
    ],
  });
  document.head.appendChild(schemaEl);
}

onMounted(() => injectSchema(article.value));
watch(article, injectSchema);
onUnmounted(() => { if (schemaEl) { schemaEl.remove(); schemaEl = null; } });
</script>

<style scoped>
.article-wrap {
  max-width: 780px;
  margin: 0 auto;
  padding: 24px 20px 60px;
  color: var(--text);
  min-height: 100vh;
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
  flex-wrap: wrap;
}
.article-breadcrumb a { color: var(--blue); text-decoration: none; white-space: nowrap; }
.article-breadcrumb a:hover { text-decoration: underline; }
.sep { color: var(--border); }
.breadcrumb-current {
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 260px;
}

/* ── Article body ── */
.article-body {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
}

/* ── Header ── */
.article-header {
  padding: 36px 40px 0;
}
.article-meta {
  display: flex;
  align-items: center;
  gap: 10px;
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
.article-read-time {
  font-family: 'Raleway', sans-serif;
  font-size: 0.8rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}
.article-read-time::before {
  content: '·';
  margin-right: 2px;
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
  margin: 0 0 32px;
  border-left: 3px solid var(--blue);
  padding-left: 16px;
}

/* ── Hero image ── */
.article-hero-img {
  overflow: hidden;
  aspect-ratio: 16 / 7;
  margin-bottom: 0;
}
.article-hero-img img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* ── Content ── */
.article-content {
  font-family: 'Raleway', sans-serif;
  font-size: 0.97rem;
  color: var(--text);
  line-height: 1.85;
  padding: 36px 40px;
}
:deep(.article-content h2) {
  font-family: 'Anton', sans-serif;
  font-size: 1.5rem;
  color: var(--text);
  margin: 40px 0 14px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--border);
}
:deep(.article-content h2:first-child) { margin-top: 0; }
:deep(.article-content h3) {
  font-family: 'Raleway', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
  margin: 28px 0 10px;
}
:deep(.article-content p) { margin: 0 0 16px; }
:deep(.article-content strong) { color: var(--text); font-weight: 700; }
:deep(.article-content ul) {
  list-style: none;
  padding: 0;
  margin: 0 0 18px;
}
:deep(.article-content ul li) {
  position: relative;
  padding: 7px 0 7px 22px;
  border-bottom: 1px solid var(--border);
  font-size: 0.93rem;
  color: var(--text-muted);
}
:deep(.article-content ul li:last-child) { border-bottom: none; }
:deep(.article-content ul li::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--blue);
}
:deep(.article-content ul li strong) { color: var(--text); }
:deep(.article-content img) {
  display: block;
  margin: 24px auto;
  max-width: 100%;
  border-radius: 12px;
}

/* ── CTA ── */
.article-cta {
  margin: 0;
  background: var(--blue-pale);
  border-top: 1px solid rgba(37,99,235,0.12);
  padding: 32px 40px;
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
.article-related {
  padding: 32px 40px 36px;
  border-top: 1px solid var(--border);
}
.related-title {
  font-family: 'Anton', sans-serif;
  font-size: 1.2rem;
  color: var(--text);
  margin: 0 0 16px;
}
.related-grid { display: flex; flex-direction: column; gap: 10px; }
.related-card {
  display: flex; align-items: flex-start; gap: 14px;
  background: var(--slate); border: 1px solid var(--border);
  border-radius: var(--r-md); padding: 14px 16px;
  text-decoration: none; transition: box-shadow 0.2s, transform 0.2s;
}
.related-card:hover { box-shadow: 0 4px 18px rgba(0,0,0,0.07); transform: translateY(-2px); }
.related-icon {
  width: 38px; height: 38px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.95rem; flex-shrink: 0; margin-top: 2px;
}
.related-text { display: flex; flex-direction: column; gap: 3px; }
.related-season {
  font-family: 'Raleway', sans-serif;
  font-size: 0.7rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
}
.related-card-title {
  font-family: 'Raleway', sans-serif;
  font-size: 0.86rem; font-weight: 700;
  color: var(--text); margin: 0;
  line-height: 1.4;
}
.related-arrow {
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem; font-weight: 700;
  margin-top: 2px;
}

/* ── Share ── */
.article-share {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 40px;
  border-top: 1px solid var(--border);
}
.share-label {
  font-family: 'Raleway', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-right: 4px;
}
.share-btn {
  width: 36px; height: 36px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem;
  text-decoration: none;
  border: none; cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  color: #fff;
}
.share-btn:hover { transform: translateY(-2px); opacity: 0.88; }
.share-btn--wa  { background: #25d366; }
.share-btn--fb  { background: #1877f2; }
.share-btn--x   { background: #000; }
.share-btn--li  { background: #0a66c2; }
.share-btn--copy { background: var(--blue-pale); color: var(--blue); }

.article-notfound {
  text-align: center; padding: 80px 20px;
  font-family: 'Raleway', sans-serif; color: var(--text-muted);
}
.article-notfound a { color: var(--blue); }

@media (max-width: 768px) {
  .article-header { padding: 24px 20px 0; }
  .article-title { font-size: 1.65rem; }
  .article-content { padding: 28px 20px; }
  .article-cta { padding: 24px 20px; }
  .article-related { padding: 24px 20px 28px; }
  .article-btn { flex: 1; justify-content: center; }
  .article-share { padding: 16px 20px; }
  .breadcrumb-current { max-width: 160px; }
}
</style>
