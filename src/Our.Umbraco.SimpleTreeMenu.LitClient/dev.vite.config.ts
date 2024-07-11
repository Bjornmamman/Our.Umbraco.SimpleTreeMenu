import { defineConfig } from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: ["src/index.ts"],
            formats: ["es"],
        },
        outDir: "../WebsiteV14/wwwroot/App_Plugins/SimpleTreeMenu/",
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            external: [/^@umbraco/],
            output: {
                chunkFileNames: '[name].js',
            }
        },
    },
    base: "/App_Plugins/SimpleTreeMenu/",
});