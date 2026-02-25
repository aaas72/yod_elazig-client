import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
    // تحميل متغيرات البيئة حسب الوضع
    const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        define: {
            'process.env': env,
        },
    }
})
