import { createRouter, createWebHashHistory } from "vue-router";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Layout",
      component: () => import("../components/layout/Layout.vue"),
      children: [
        {
          path: "task/:cid/:id",
          name: "task",
          component: () => import("../components/card/Task.vue"),
        },
      ],
    },
    {
      path: "/Login",
      name: "Login",
      component: () => import("../view/Login.vue"),
    },
  ],
});
export default router;
