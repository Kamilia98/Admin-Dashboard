import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import { router } from './router';
import VueApexCharts from 'vue3-apexcharts';
import 'jsvectormap/dist/jsvectormap.css';
import { useAuthStore } from './stores/authStore';

const app = createApp(App);

app.use(router);
app.use(createPinia());

const store = useAuthStore();
store.initAuth();

app.use(VueApexCharts).mount('#app');
