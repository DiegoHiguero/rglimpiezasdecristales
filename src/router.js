// router/index.js

import { createRouter,createWebHistory } from "vue-router";

import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import MisClientes from "./views/MisClientes.vue";
import MisFacturas from "./views/MisFacturas.vue";
import Contacto from "./views/Contacto.vue";
import Servicios from "./views/Servicios.vue";
import Confidentialite from "./views/Confidentialite.vue";
import MentionsLegales from "./views/MentionsLegales.vue";
import LimpiezasMensuales from "./views/LimpiezasMensuales.vue";
import Dashboard from "./views/Dashboard.vue";
// ¡NUEVA IMPORTACIÓN AQUÍ!
import MensajesAdmin from "./views/MensajesAdmin.vue";
import Blog from "./views/Blog.vue";
import BlogArticle from "./views/BlogArticle.vue";
import { articles } from "./data/blog.js";

// import Editar from "./views/Editar.vue";

import { useUserStore } from './stores/user';

// Guarda para rutas que requieren autenticación
const requiereAuth = async(to,from,next) => {
    const userStore = useUserStore();
    const user = await userStore.currentUser(); // Esperamos a que el estado del usuario esté definido

    if(user){
        next(); // Usuario autenticado, permite el acceso
    }else{
        next('/'); // No autenticado, redirige a la página de inicio/login
    }
};

// Guarda para rutas que requieren autenticación Y ser 'higuerodiego@gmail.com' o 'familiahiguero@gmail.com'
const requiereAuth2 = async(to,from,next) => {
    const userStore = useUserStore();
    const user = await userStore.currentUser(); // Esperamos a que el estado del usuario esté definido

    // **MODIFICACIÓN CLAVE:**
    // Aseguramos que 'user' no sea null/undefined antes de intentar acceder a 'user.email'.
    // Los paréntesis son cruciales para que el 'OR' se evalúe correctamente dentro del 'AND'.
    const isAllowedAdmin = user && (
        user.email === "higuerodiego@gmail.com" ||
        user.email === "roys.abreu@gmail.com"
    );

    if(isAllowedAdmin){
        next(); // Usuario es un administrador permitido, permite el acceso
    }else{
        // No es el usuario correcto o no autenticado, redirige a la página de inicio/login
        // Podrías también redirigir a una página de "Acceso Denegado"
        next('/');
    }
};

const BASE_TITLE = 'Royall Clean — Limpiacristales en Madrid';
const BASE_DESC  = 'Empresa de limpiacristales en Madrid para hogares, comunidades y locales. Cristales y ventanas impecables garantizados. ¡Presupuesto gratis en 24 h! ☎ 696 169 435';

const routes = [
    {
        path: '/',
        component: Home,
        meta: {
            title: 'Limpiacristales en Madrid | Royall Clean — Presupuesto Gratis',
            description: BASE_DESC,
        },
    },
    { path: '/login', component: Login },
    { path: '/Register', component: Register, beforeEnter: requiereAuth2 },
    { path: '/registro', component: LimpiezasMensuales, beforeEnter: requiereAuth2 },
    { path: '/misClientes', component: MisClientes, beforeEnter: requiereAuth2 },
    { path: '/misFacturas', component: MisFacturas, beforeEnter: requiereAuth },
    {
        path: '/contacto',
        component: Contacto,
        meta: {
            title: 'Contacto | Royall Clean — Limpiacristales Madrid',
            description: 'Contacta con Royall Clean para solicitar presupuesto de limpieza de cristales en Madrid. Respondemos en menos de 24 horas. ☎ 696 169 435',
        },
    },
    {
        path: '/servicios',
        component: Servicios,
        meta: {
            title: 'Servicios de Limpiacristales | Royall Clean Madrid',
            description: 'Limpieza profesional de cristales para hogares, comunidades de vecinos y locales comerciales en Madrid y alrededores. Solicita tu presupuesto.',
        },
    },
    {
        path: '/politica-privacidad',
        component: Confidentialite,
        meta: {
            title: 'Política de Privacidad | Royall Clean',
            description: 'Consulta la política de privacidad de Royall Clean. Información sobre el tratamiento de tus datos personales conforme al RGPD.',
        },
    },
    {
        path: '/aviso-legal',
        component: MentionsLegales,
        meta: {
            title: 'Aviso Legal | Royall Clean',
            description: 'Aviso legal de Royall Clean. Información sobre el titular del sitio web, condiciones de uso y propiedad intelectual.',
        },
    },
    { path: '/dashboard', component: Dashboard, beforeEnter: requiereAuth2 },
    { path: '/admin/mensajes', component: MensajesAdmin, beforeEnter: requiereAuth2 },
    {
        path: '/blog',
        component: Blog,
        meta: {
            title: 'Blog de limpieza de cristales | Royall Clean Madrid',
            description: 'Consejos y guías profesionales para mantener tus cristales limpios en cada época del año. Blog de Royall Clean, limpiacristales en Madrid.',
        },
    },
    {
        path: '/blog/:slug',
        component: BlogArticle,
        meta: { dynamic: true },
    },
];

const router = createRouter({
    routes,
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition;
        if (to.hash) {
            return new Promise(resolve => {
                setTimeout(() => resolve({ el: to.hash, behavior: 'smooth' }), 350);
            });
        }
        return { top: 0 };
    },
});

router.afterEach((to) => {
    let title = to.meta?.title || BASE_TITLE;
    let desc  = to.meta?.description || BASE_DESC;

    if (to.meta?.dynamic && to.params?.slug) {
        const article = articles.find(a => a.slug === to.params.slug);
        if (article) {
            title = `${article.title} | Royall Clean`;
            desc  = article.metaDescription;
        }
    }

    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://royallclean.es' + to.path);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://royallclean.es' + to.path);
});

export default router;