import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

import ElementPlus from "unplugin-element-plus/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss(), ElementPlus({})],
});
