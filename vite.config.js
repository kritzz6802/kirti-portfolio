import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// The invitations (public/invitation/, public/invitation2/ … invitation7/) and the
// gallery that links them (public/invite/) are standalone static pages. Vite's SPA
// fallback would otherwise answer them with the portfolio's index.html.
var STATIC_PAGE = /^\/(invite|invitation\d*)$/;
function invitationRoute() {
    // Typed loosely: this project has no @types/node, so Connect's request type has no `url`
    var route = function (rawReq, res, next) {
        var _a;
        var req = rawReq;
        var _b = ((_a = req.url) !== null && _a !== void 0 ? _a : '').split('?'), path = _b[0], _c = _b[1], query = _c === void 0 ? '' : _c;
        var suffix = query ? "?".concat(query) : '';
        if (STATIC_PAGE.test(path)) {
            res.statusCode = 301;
            res.setHeader('Location', "".concat(path, "/").concat(suffix));
            res.end();
            return;
        }
        if (path.slice(-1) === '/' && STATIC_PAGE.test(path.slice(0, -1)))
            req.url = "".concat(path, "index.html").concat(suffix);
        next();
    };
    return {
        name: 'invitation-route',
        configureServer: function (server) { return void server.middlewares.use(route); },
        configurePreviewServer: function (server) { return void server.middlewares.use(route); },
    };
}
// https://vitejs.dev/config/
export default defineConfig({
    // Absolute base for Netlify / root-domain hosting
    base: '/',
    plugins: [react(), invitationRoute()],
    build: {
        target: 'es2020',
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                // Keep hashed .js extensions so CDNs/MIME detection stay correct
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',
                manualChunks: {
                    motion: ['framer-motion'],
                },
            },
        },
    },
});
