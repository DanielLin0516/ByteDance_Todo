import { nextTick } from "process";
import { createRouter, createWebHashHistory } from "vue-router";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../view/Home.vue"),
    },
    {
      path: "/Login",
      name: "Login",
      component: () => import("../view/Login.vue"),
    },
    {
      path: "/Register",
      name: "Register",
      component: () => import("../view/Register.vue"),
    },
    {
      path: "/Layout",
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

  ],

});
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token');
  if (token || to.path == "/" || to.path == "/Login" || to.path == "/Register") {
    next();
  } else {
    next("/Login")
  }
})
export default router;
