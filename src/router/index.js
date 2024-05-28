import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";

const routes = [
  {
    component: App,
    redirect: '/1',
    children: [
      {
        path: "/:events",
        component: App,
        name: 'mainPage',
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
