import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Overview from "../views/Overview.vue";
import Status from "../views/Status.vue";
import Analysis from "../views/Analysis.vue";
import StatusTrend from "@/views/StatusTrend.vue";
import PumpHistoryData from "@/views/PumpHistoryData.vue";
import PumpGroupHisData1 from "@/views/PumpGroupHisData1.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    redirect: "/overview",
    children: [
      {
        path: "/overview",
        name: "overview",
        component: Overview,
      },
      {
        path: "/pumpOverview",
        name: "pumpOverview",
        component: PumpHistoryData,
      },
      {
        path: "/groupHis1",
        name: "groupHis1",
        component: PumpGroupHisData1,
      },
      {
        path: "/status",
        name: "status",
        component: Status,
      },
      {
        path: "/trend",
        name: "trend",
        component: StatusTrend,
      },
      {
        path: "/analysis",
        name: "analysis",
        component: Analysis,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
  } else {
    let token = localStorage.getItem("Authorization");
    if (token === null || token === "") {
      next("/login");
    } else {
      next();
    }
  }
});

export default router;
