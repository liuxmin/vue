import vue from '@vitejs/plugin-vue'

export default function createVitePlugins(mode, isBuild = false) {
    const vitePlugins = [vue()]
    vitePlugins.push()
    return vitePlugins
}