import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './firebaseConfig'; 

// Importación de VueApexCharts
import VueApexCharts from "vue3-apexcharts"; // <-- ¡Añade esta línea!

// Importaciones de Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGoogleDrive, faWaze } from "@fortawesome/free-brands-svg-icons";
import {
    faTrashCan,
    faEye,
    faFilePen,
    faCheck,
    faMagnifyingGlass,
    faArrowUpRightFromSquare,
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
    faComment, // Añadí faComment que estaba en tu código de iconos aunque no en library.add
    faBroom,
    faHandHoldingDollar,
    faChevronDown,
    faArrowDown,
    faXmark,
    faSolarPanel,
    faCalendarDays,
    faBell,
    faPlus,
    faFilePdf,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Importación de Vue3Signature
import Vue3Signature from "vue3-signature";

// Importación del userStore (que contiene initAuthListener y currentUser)
import { useUserStore } from './stores/user';

// 1. Configuración de Font Awesome Library
library.add(
    faTrashCan,
    faFilePen,
    faEye,
    faGoogleDrive,
    faWaze,
    faFilePdf,
    faMagnifyingGlass,
    faCheck,
    faXmark,
    faArrowUpRightFromSquare,
    faUser,
    faRightFromBracket,
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
    faComment, // Asegúrate de añadirlo si lo usas
    faBroom,
    faHandHoldingDollar,
    faChevronDown,
    faArrowDown,
    faSolarPanel,
    faCalendarDays,
    faBell,
    faPlus
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
app.use(Vue3Signature); // Usa Vue3Signature
app.component("font-awesome-icon", FontAwesomeIcon); // Registra el componente de Font Awesome
app.use(VueApexCharts); // <-- ¡Añade esta línea para registrar ApexCharts globalmente!

// 6. ESPERAR a que el estado de autenticación inicial de Firebase esté disponible
// antes de montar el router y la aplicación.
userStore.currentUser().then(() => {
    // 7. Usar el router con la aplicación una vez que el estado de autenticación es conocido
    app.use(router);

    // 8. Montar la aplicación en el DOM
    app.mount('#app');
});
