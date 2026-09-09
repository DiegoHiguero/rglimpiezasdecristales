import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './firebaseConfig';

// Importaciones de Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { faWaze, faWhatsapp, faFacebook, faInstagram, faLinkedin, faXTwitter, faGoogle } from "@fortawesome/free-brands-svg-icons";
import {
    faTrashCan,
    faEye,
    faFilePen,
    faCheck,
    faMagnifyingGlass,
    faMagnifyingGlassPlus,
    faArrowUpRightFromSquare,
    faArrowRight,
    faArrowUpFromWaterPump,
    faUser, faRightFromBracket,
    faFileInvoice,
    faAddressCard,
    faRectangleList,
    faEnvelopeOpenText,
    faFileArrowDown,
    faPhone,
    faEnvelope,
    faSeedling,
    faUserTie,
    faHandSparkles,
    faClock,
    faPumpSoap,
    faComments,
    faComment,
    faBroom,
    faHandHoldingDollar,
    faChevronDown,
    faChevronUp,
    faChevronLeft,
    faChevronRight,
    faArrowDown,
    faXmark,
    faSolarPanel,
    faCalendarDays,
    faBell,
    faPlus,
    faFilePdf,
    faHouse,
    faBuilding,
    faStore,
    faTag,
    faPaperPlane,
    faLock,
    faLocationDot,
    faCirclePlay,
    faPlay,
    faStar,
    faHeart,
    faDroplet,
    faShieldHalved,
    faBolt,
    faImages,
    faImage,
    faVideo,
    faCamera,
    faSun,
    faMoon,
    faSnowflake,
    faLeaf,
    faCompass,
    faCity,
    faBookOpen,
    faCircleInfo,
    faSprayCan,
    faScissors,
    faBars,
    faReply,
    faCopy,
    faCheckDouble,
    faInbox,
    faRotateLeft,
    faEnvelopeOpen,
    faTableCells,
    faArrowsRotate,
    faRotate,
    faUpload,
    faDownload,
    faDatabase,
    faTriangleExclamation,
    faKey,
    faWandMagicSparkles,
    faBuildingColumns,
    faShop,
    faLink,
    faTrophy,
    faRoute,
    faPaintbrush,
    faNewspaper,
    faGaugeHigh,
    faSignature,
    faChartLine,
    faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Importación del userStore (que contiene initAuthListener y currentUser)
import { useUserStore } from './stores/user';

// 1. Configuración de Font Awesome Library
library.add(
    faTrashCan, faFilePen, faEye,
    faWaze, faWhatsapp, faFacebook, faInstagram, faLinkedin, faXTwitter, faGoogle,
    faFilePdf, faMagnifyingGlass, faMagnifyingGlassPlus,
    faCheck, faXmark,
    faArrowUpRightFromSquare, faArrowRight, faArrowUpFromWaterPump, faArrowDown,
    faUser, faRightFromBracket,
    faFileInvoice, faAddressCard, faRectangleList, faEnvelopeOpenText, faFileArrowDown,
    faPhone, faEnvelope, faLocationDot,
    faSeedling, faUserTie, faHandSparkles, faClock, faPumpSoap,
    faComments, faComment, faBroom, faHandHoldingDollar,
    faChevronDown, faChevronUp, faChevronLeft, faChevronRight,
    faSolarPanel, faCalendarDays, faBell, faPlus,
    faHouse, faBuilding, faBuildingColumns, faStore, faShop,
    faTag, faPaperPlane, faLock,
    faCirclePlay, faPlay,
    faStar, faHeart, faDroplet, faShieldHalved, faBolt,
    faImages, faImage, faVideo, faCamera,
    faSun, faMoon,
    faSnowflake, faLeaf, faCompass, faCity, faBookOpen, faCircleInfo,
    faSprayCan, faScissors,
    faBars,
    faReply, faCopy, faCheckDouble, faInbox, faRotateLeft, faEnvelopeOpen,
    faTableCells, faArrowsRotate, faRotate, faUpload, faDownload,
    faDatabase, faTriangleExclamation, faKey, faWandMagicSparkles,
    faLink, faTrophy,
    faRoute, faPaintbrush, faNewspaper, faGaugeHigh, faSignature,
    faChartLine, faMapLocationDot,
);

// 2. Crear la instancia de la aplicación Vue
const app = createApp(App);

// 3. Crear la instancia de Pinia y usarla con la aplicación
const pinia = createPinia();
app.use(pinia);

// 4. Obtener el userStore y llamar a initAuthListener
// Esto inicia la observación del estado de autenticación de Firebase
const userStore = useUserStore();
userStore.initAuthListener();

// 5. Configurar otros plugins y componentes globales en la instancia 'app'
app.component("font-awesome-icon", FontAwesomeIcon); // Registra el componente de Font Awesome

// 6. ESPERAR a que el estado de autenticación inicial de Firebase esté disponible
// antes de montar el router y la aplicación.
userStore.currentUser().then(() => {
    // 7. Usar el router con la aplicación una vez que el estado de autenticación es conocido
    app.use(router);

    // 8. Montar la aplicación en el DOM
    app.mount('#app');
});
