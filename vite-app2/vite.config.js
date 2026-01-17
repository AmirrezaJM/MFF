import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: "vite_app2",
            remotes: {
                vite_app1: "http://localhost:5001/assets/remoteEntry.js",
                vue_remote: "http://localhost:5005/assets/remoteEntry.js",
            },
            shared: ["react", "react-dom", "vue"],
        }),
    ],
    build: {
        modulePreload: false,
        target: "esnext",
        minify: false,
        cssCodeSplit: false,
    },
});
