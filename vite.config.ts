import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        // React core
                        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                        // Animation library
                        'vendor-motion': ['framer-motion'],
                        // Rich text editor (heavy, admin-only)
                        'vendor-tiptap': [
                            '@tiptap/react',
                            '@tiptap/starter-kit',
                            '@tiptap/extension-color',
                            '@tiptap/extension-heading',
                            '@tiptap/extension-image',
                            '@tiptap/extension-link',
                            '@tiptap/extension-placeholder',
                            '@tiptap/extension-text-align',
                            '@tiptap/extension-text-style',
                            '@tiptap/extension-underline',
                        ],
                        // i18n
                        'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
                        // Icons
                        'vendor-icons': ['lucide-react', 'react-icons'],
                        // Utilities
                        'vendor-utils': ['axios', 'react-hot-toast', 'react-toastify'],
                        // Excel export (admin-only, heavy)
                        'vendor-xlsx': ['xlsx'],
                    },
                },
            },
        },
    }
})
