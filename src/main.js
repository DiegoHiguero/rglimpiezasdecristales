import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'

import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faTrashCan,
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
    faComment,
    faBroom,
    faHandHoldingDollar,
    faChevronDown,
    faArrowDown,
    faXmark,
    faSolarPanel,
    faCalendarDays,
    faBell,
} from "@fortawesome/free-solid-svg-icons"

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Vue3Signature from "vue3-signature"
library.add(faTrashCan,
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
    faBroom,
    faHandHoldingDollar, 
    faChevronDown,
   faArrowDown,
   faSolarPanel,
   faCalendarDays,faBell


);


createApp(App).use(router).use(Vue3Signature).use(createPinia()).component("font-awesome-icon", FontAwesomeIcon).mount('#app')