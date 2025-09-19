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
// ¡NUEVA IMPORTACIÓN AQUÍ!
import MensajesAdmin from "./views/MensajesAdmin.vue"; // Asumiendo que lo guardaste en la carpeta 'views'

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

const routes = [
    {path:'/', component:Home,},
    {path:'/login', component:Login},
    {path:'/Register', component:Register, beforeEnter:requiereAuth2}, // Ruta protegida
    {path:'/registro', component:LimpiezasMensuales, beforeEnter:requiereAuth2}, // Ruta protegida
    // {path:'/editar/:id', component:Editar,beforeEnter:requiereAuth},
    {path:'/misClientes', component:MisClientes, beforeEnter:requiereAuth2}, // Ruta protegida
    {path:'/misFacturas', component:MisFacturas, beforeEnter:requiereAuth}, // Ruta protegida
    {path:'/contacto', component:Contacto},
    {path:'/servicios', component:Servicios},
    {path:'/confidentialite', component:Confidentialite},
    {path:'/mentionslegales', component:MentionsLegales},
    // ¡NUEVA RUTA AQUÍ!
    {path:'/admin/mensajes', component:MensajesAdmin, beforeEnter:requiereAuth2}, // Protegida para administradores
];

const router = createRouter({
    routes,
    history:createWebHistory()
});

export default router;