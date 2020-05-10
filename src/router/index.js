import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/login.vue";
import Home from "../components/home.vue";
Vue.use(VueRouter);

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/home", component: Home },
];
const router = new VueRouter({
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.path == "/login") return next();
    const token = window.sessionStorage.getItem("token");
    if (!token) return next("/login");
    next();
});
export default router;