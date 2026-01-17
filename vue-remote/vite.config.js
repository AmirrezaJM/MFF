import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
    plugins: [
        vue(),
        cssInjectedByJsPlugin(),
        federation({
            name: "vue_remote",
            filename: "remoteEntry2.js",
            exposes: {
                "./Accordion": "./src/components/Accordion.vue",
            },
            shared: ["vue"],
        }),
    ],
    build: {
        target: "esnext",
        minify: false,
        cssCodeSplit: false,
    },
});
