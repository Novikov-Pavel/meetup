import { createRouter, createWebHistory } from "vue-router";
import App from "@/App.vue";

const routes = [
  {
    component: App,
    children: [
      {
        path: "/:events",
        component: App,
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
