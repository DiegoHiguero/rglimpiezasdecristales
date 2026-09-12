// router/index.js

import { createRouter,createWebHistory } from "vue-router";

import Home from "./views/Home.vue";
import Blog from "./views/Blog.vue";
import BlogArticle from "./views/BlogArticle.vue";
import ServicioDetalle from "./views/ServicioDetalle.vue";
import NotFound from "./views/NotFound.vue";

const Login             = () => import("./views/Login.vue");
const Register          = () => import("./views/Register.vue");
const MisClientes       = () => import("./views/MisClientes.vue");
const MisFacturas       = () => import("./views/MisFacturas.vue");
const Contacto          = () => import("./views/Contacto.vue");
const Confidentialite   = () => import("./views/Confidentialite.vue");
const MentionsLegales   = () => import("./views/MentionsLegales.vue");
const LimpiezasMensuales = () => import("./views/LimpiezasMensuales.vue");
const Dashboard         = () => import("./views/Dashboard.vue");
const MensajesAdmin     = () => import("./views/MensajesAdmin.vue");
const GastosView        = () => import("./views/GastosView.vue");
const Roadmap           = () => import("./views/Roadmap.vue");
const PortalCliente     = () => import("./views/PortalCliente.vue");
const RegistroFirmas    = () => import("./views/RegistroFirmas.vue");
const PagosPendientes   = () => import("./views/PagosPendientes.vue");
const NuevaFactura      = () => import("./views/NuevaFactura.vue");
const EvolucionIngresos = () => import("./views/EvolucionIngresos.vue");
const MapaClientes      = () => import("./views/MapaClientes.vue");
const GenerarArticulo   = () => import("./views/GenerarArticulo.vue");
const SheetView         = () => import("./views/SheetView.vue");
import { articles } from "./data/blog.js";
import { getServicioBySlug } from "./data/servicios.js";

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

// Guarda para rutas que requieren autenticación de administrador
const requiereAuth2 = async(to,from,next) => {
    const userStore = useUserStore();
    const user = await userStore.currentUser(); // Esperamos a que el estado del usuario esté definido

    // **MODIFICACIÓN CLAVE:**
    // Aseguramos que 'user' no sea null/undefined antes de intentar acceder a 'user.email'.
    // Los paréntesis son cruciales para que el 'OR' se evalúe correctamente dentro del 'AND'.
    const isAllowedAdmin = user && user.email === "roys.abreu@gmail.com";

    if(isAllowedAdmin){
        next(); // Usuario es un administrador permitido, permite el acceso
    }else{
        // No es el usuario correcto o no autenticado, redirige a la página de inicio/login
        // Podrías también redirigir a una página de "Acceso Denegado"
        next('/');
    }
};

const BASE_TITLE = 'Limpieza de Cristales en Madrid | Royall Clean';
const BASE_DESC  = 'Limpieza de cristales y ventanas en Madrid para hogares, comunidades y locales. Más de 10 años de experiencia. ¡Presupuesto gratis en 24 h! ☎ 696 169 435';

const routes = [
    {
        path: '/',
        component: Home,
        meta: {
            title: BASE_TITLE,
            description: BASE_DESC,
        },
    },
    { path: '/login', component: Login },
    { path: '/Register', component: Register, beforeEnter: requiereAuth2 },
    { path: '/registro', component: LimpiezasMensuales, beforeEnter: requiereAuth2 },
    { path: '/misClientes', component: MisClientes, beforeEnter: requiereAuth2 },
    { path: '/misFacturas', component: MisFacturas, beforeEnter: requiereAuth2 },
    {
        path: '/contacto',
        component: Contacto,
        meta: {
            title: 'Presupuesto Limpieza de Cristales en Madrid | Royall Clean',
            description: 'Pide tu presupuesto gratuito de limpieza de cristales y ventanas en Madrid. Sin compromiso, respuesta en menos de 24 horas. ☎ 696 169 435',
        },
    },
    { path: '/servicios', redirect: '/' },
    { path: '/limpieza-cristales-hogares', component: ServicioDetalle, meta: { servicio: 'limpieza-cristales-hogares' } },
    { path: '/limpieza-cristales-comunidades', component: ServicioDetalle, meta: { servicio: 'limpieza-cristales-comunidades' } },
    { path: '/limpieza-cristales-locales-comerciales', component: ServicioDetalle, meta: { servicio: 'limpieza-cristales-locales-comerciales' } },
    { path: '/limpieza-cristales-altura', component: ServicioDetalle, meta: { servicio: 'limpieza-cristales-altura' } },
    { path: '/limpieza-placas-solares', component: ServicioDetalle, meta: { servicio: 'limpieza-placas-solares' } },
    { path: '/limpieza-fin-de-obra', component: ServicioDetalle, meta: { servicio: 'limpieza-fin-de-obra' } },
    { path: '/limpieza-grafitis', component: ServicioDetalle, meta: { servicio: 'limpieza-grafitis' } },
    { path: '/retirada-de-vinilos', component: ServicioDetalle, meta: { servicio: 'retirada-de-vinilos' } },
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
    { path: '/admin/generar', component: GenerarArticulo, beforeEnter: requiereAuth2 },
    { path: '/gastos', component: GastosView, beforeEnter: requiereAuth2 },
    { path: '/hoja-de-ruta', component: Roadmap, beforeEnter: requiereAuth2 },
    { path: '/firmas', component: RegistroFirmas, beforeEnter: requiereAuth2 },
    { path: '/pagos-pendientes', component: PagosPendientes, beforeEnter: requiereAuth2 },
    { path: '/nueva-factura', component: NuevaFactura, beforeEnter: requiereAuth2 },
    { path: '/evolucion-ingresos', component: EvolucionIngresos, beforeEnter: requiereAuth2 },
    { path: '/mapa-clientes', component: MapaClientes, beforeEnter: requiereAuth2 },
    {
        path: '/portal/:token?',
        component: PortalCliente,
        meta: {
            title: 'Portal de clientes | Royall Clean',
            description: 'Consulta tus facturas y firmas de servicio de Royall Clean.',
        },
    },
    { path: '/sheet/:tab', component: SheetView, beforeEnter: requiereAuth2 },
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
    {
        path: '/:pathMatch(.*)*',
        component: NotFound,
        meta: {
            notFound: true,
            title: 'Página no encontrada | Royall Clean',
            description: 'La página que buscas no existe. Vuelve al inicio de Royall Clean, empresa de limpieza de cristales en Madrid.',
        },
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
    const article  = (to.meta?.dynamic && to.params?.slug) ? articles.find(a => a.slug === to.params.slug) : null;
    const servicio = to.meta?.servicio ? getServicioBySlug(to.meta.servicio) : null;

    // Un slug de blog/servicio que no existe también es un 404, aunque la
    // ruta en sí coincida (:slug acepta cualquier texto) — sin esto, se
    // mandaba a los buscadores el título/descripción genérico de portada
    // en vez de un 404 real.
    const isNotFound = to.meta?.notFound
        || (to.meta?.dynamic && !article)
        || (to.meta?.servicio && !servicio);

    let title = to.meta?.title || BASE_TITLE;
    let desc  = to.meta?.description || BASE_DESC;
    let keywords = to.meta?.keywords || '';
    let image = 'https://royallclean.es/og-image.webp';

    if (article) {
        title = `${article.title} | Royall Clean`;
        desc  = article.metaDescription;
        keywords = article.keywords || '';
        image = article.image ? window.location.origin + article.image : image;
    } else if (servicio) {
        title = `${servicio.metaTitle} | Royall Clean`;
        desc  = servicio.metaDescription;
        keywords = servicio.keywords || '';
        image = servicio.image ? window.location.origin + servicio.image : image;
    } else if (isNotFound) {
        title = 'Página no encontrada | Royall Clean';
        desc  = 'La página que buscas no existe. Vuelve al inicio de Royall Clean, empresa de limpieza de cristales en Madrid.';
    }

    document.title = title;

    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
        metaRobots.setAttribute('content', isNotFound
            ? 'noindex, follow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://royallclean.es' + to.path);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', image);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', desc);

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', image);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://royallclean.es' + to.path);

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
});

export default router;