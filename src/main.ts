import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import VueApexCharts from "vue3-apexcharts";
import { useAuth } from "./composables/useAuth";

const app = createApp(App);


const { initAuth } = useAuth();
initAuth();

app.use(router).use(VueApexCharts).mount("#app");
