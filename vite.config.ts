import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import pxtovw from "postcss-px-to-viewport";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

const loder_pxtovw = pxtovw({
  viewportWidth: 1920,
  viewportHeight: 1080,
  viewportUnit: "vw",
});

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [loder_pxtovw],
    },
    preprocessorOptions: {
      // 配置全局less
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${path.resolve(
            "src/theme/style.less"
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
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
  plugins: [
    vue(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz",
    }),
    visualizer(),
  ],
  base: "./",
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        manualChunks(id) {
          //静态资源分拆打包
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
