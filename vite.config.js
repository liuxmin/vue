import {defineConfig, loadEnv} from 'vite'
import createVitePlugins from "./vite/plugins"
import path from 'path'

export default defineConfig(({mode, command}) => {
    const env = loadEnv(mode, process.cwd())
    return {
        base: "/",
        plugins: [createVitePlugins(env, command === "build")],
        resolve: {
            alias: {
                "~": path.resolve(__dirname, "./"),
                "@": path.resolve(__dirname, "./src"),
            },
            extensions: [".ts", ".tsx", ".js", ".jsx", ".vue", ".json", ".mjs"],
        },
        server: {
            port: 90,
            host: true,
            open: true,
            proxy: {
                "/base": {
                    target: "http://127.0.0.1:8080",
                    changeOrigin: true,
                    rewrite: p => p.replace(/^\/base/, "")
                }
            }
        }

    }
})
