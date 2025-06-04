import {createRouter, createWebHistory} from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import UploadPage from "@/views/UploadPage.vue";
import UserPage from "@/views/UserPage.vue";

const routes = [
    {path: '/', redirect: '/home'},
    {
        path: '/home',
        name: 'Home',
        component: HomePage,
        // PROTEGIM
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('token');
            if (token) {
                next(); // Permetem l'accés
            } else {
                next('/login'); // redireect al login
            }
        }
    },
    {
        path: '/upload',
        name: 'Upload',
        component: UploadPage,
        // Aquí protegemos la ruta
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('token');
            if (token) {
                next();
            } else {
                next('/login'); // redirect login
            }
        }
    },
    {
        path: '/user',
        name: 'User',
        component: UserPage,
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('token');
            if (token) {
                next();
            } else {
                next('/login');
            }
        }
    },
    {path: '/login', name: 'Login', component: LoginPage},
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;
