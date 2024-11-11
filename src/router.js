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
// import Editar from "./views/Editar.vue";

import {useUserStore}from './stores/user';

const requiereAuth = async(to,from,next) => {
    const userStore = useUserStore()
    userStore.loadingSesion = true
    const user = await userStore.currentUser()

        if(user){
            next()
        }else{
            next('/')
        }
        userStore.loadingSesion = false
}

const requiereAuth2 = async(to,from,next) => {
    const userStore = useUserStore()
    userStore.loadingSesion = true
    const user = await userStore.currentUser()

        if(user.email==="roys.abreu@gmail.com"){
            next()
        }else{
            next('/')
        }
        userStore.loadingSesion = false
}



const routes = [
    {path:'/', component:Home,},
    {path:'/login', component:Login},
    {path:'/Register', component:Register,beforeEnter:requiereAuth2},
    // {path:'/editar/:id', component:Editar,beforeEnter:requiereAuth},
    {path:'/misClientes', component:MisClientes,beforeEnter:requiereAuth2},
    {path:'/misFacturas', component:MisFacturas,beforeEnter:requiereAuth},
    {path:'/contacto', component:Contacto},
    {path:'/servicios', component:Servicios},
    {path:'/confidentialite', component:Confidentialite},
    {path:'/mentionslegales', component:MentionsLegales},
]


const router = createRouter({
    routes,
    history:createWebHistory()//elimina el '#'
})

export default router;
//despues inicializamos en main.js
