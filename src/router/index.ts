import { createRouter, createWebHashHistory } from "vue-router";
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name:'board',
      component: () => import("../components/card/MainCard.vue"),
      children:[
        {
          path:'task/:id',
          name:'task',
          component: () => import("../components/card/Task.vue")
        }
      ]
    },
  ],
});
export default router;
