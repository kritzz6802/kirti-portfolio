import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    // Relative base so assets work when hosted under /project-2.0/dist/ (or any subpath)
    base: './',
    plugins: [react()],
    build: {
        target: 'es2020',
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    motion: ['framer-motion'],
                },
            },
        },
    },
});
