import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../components/login.vue"),
  },
  {
    path: "/home",
    name: "home",
    meta: {
      title: "主页",
    },
    component: () =>
      import(/* webpackChunkName: "login" */ "../components/home.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
