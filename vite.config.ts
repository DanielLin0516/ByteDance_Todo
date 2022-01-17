import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import pxtovw from 'postcss-px-to-viewport'
const loder_pxtovw = pxtovw({
  viewportWidth: 1920,
  viewportHeight: 1080,
  viewportUnit: 'vw'
})

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [loder_pxtovw]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // "apis": path.resolve(__dirname, "src/apis"),//具体需要哪些，请按需添加
      // "models": path.resolve(__dirname, "src/model"),
      // "utils": path.resolve(__dirname, "src/utils"),
      // "comps": path.resolve(__dirname, "src/components"),
      // "router": path.resolve(__dirname, "src/router"),
      // "views": path.resolve(__dirname, "src/views"),
      // "layout": path.resolve(__dirname, "src/layout"),
    },
  },
  plugins: [vue()],

})
