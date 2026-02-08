import { defineConfig } from "vite";
import fs from "fs-extra";

export default defineConfig({
    build: {
        lib: {
            entry: ["src/index.ts"],
            formats: ["es"],
        },
        outDir: "./build/",
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
    plugins: [
        {
            name: 'copy-to-multiple-dirs',
            closeBundle: async () => {
                await fs.copy(
                    "./build/",
                    '../WebsiteV16/wwwroot/App_Plugins/SimpleTreeMenu/'
                );
                await fs.copy(
                    "./build/",
                    '../TreeMenu/wwwroot/App_Plugins/SimpleTreeMenu/'
                );
                await fs.copy(
                    "./build/",
                    '../WebsiteV17/wwwroot/App_Plugins/SimpleTreeMenu/',
                );
            }
        }
    ]
});