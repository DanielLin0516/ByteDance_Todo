import { Message } from "@arco-design/web-vue";
import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/view/Home.vue"),
      meta: { transition: 'slide-left' },
    },
    {
      path: "/Login",
      name: "Login",
      component: () => import("@/view/Login.vue"),
      meta: { transition: 'slide-right' },
    },
    {
      path: "/Forget",
      name: "Forget",
      component: () => import("@/view/Forget.vue"),
      meta: { transition: 'slide-right' },
    },
    {
      path: "/Register",
      name: "Register",
      component: () => import("@/view/Register.vue"),
      meta: { transition: 'slide-right' },
    },
    {
      path: "/Invite/:productId/:link",
      name: "Invite",
      component: () => import("@/view/Invite.vue"),
      meta: { transition: 'slide-right' },
    },
    {
      path: "/Layout",
      name: "Layout",
      component: () => import("@/layout/Layout.vue"),
      meta: { transition: 'slide-right' },
      children: [
        {
          path: "Board/:productId",
          name: "Board",
          component: () => import("@/layout/Board.vue"),
          meta: { transition: 'slide-right' },
        },
        {
          path: "WorkPlace",
          name: "WorkPlace",
          component: () => import("@/view/WorkPlace.vue"),
        },
      ],
    },
  ],
});
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("token");
  if (
    token ||
    to.path == "/" ||
    to.path == "/Login" ||
    to.path == "/Register" ||
    (to.params.productId && to.params.link) ||
    to.path == "/Forget"
  ) {
    next();
  } else {
    next("/Login");
  }
});
export default router;
