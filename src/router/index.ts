import { Message } from "@arco-design/web-vue";
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
      path: "/Forget",
      name: "Forget",
      component: () => import("../view/Forget.vue"),
    },
    {
      path: "/Register",
      name: "Register",
      component: () => import("../view/Register.vue"),
    },
    {
      path: "/Invite/:productId/:link",
      name: "Invite",
      component: () => import("../view/Invite.vue"),
    },
    {
      path: "/Layout",
      name: "Layout",
      component: () => import("../components/layout/Layout.vue"),
      children: [
        {
          path: "Board/:productId",
          name: "Board",
          component: () => import("../components/layout/Board.vue"),
        },
        {
          path: "WorkPlace",
          name: "WorkPlace",
          component: () => import("../components/project/WorkPlace.vue")
        }
      ],
    },

  ],

});
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token');
  if (token || to.path == "/" || to.path == "/Login" || to.path == "/Register" || (to.params.productId && to.params.link) || to.path == "/Forget") {
    next();
  } else {
    Message.error({ content: "请先登录！" })
    next("/Login")
  }
})
export default router;
