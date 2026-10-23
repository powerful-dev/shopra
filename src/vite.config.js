import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const filesIn = (directory) => readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
        const path = join(directory, entry.name);

        return entry.isDirectory() ? filesIn(path) : [path];
    });

const shopThemeStyles = filesIn('layout/shop/css/themes')
    .filter((path) => path.endsWith('.css'))
    .sort();

const shopUmdBrowserGlobals = {
    name: 'shop-umd-browser-globals',
    enforce: 'pre',
    transform(code, id) {
        if (!/[\\/]layout[\\/]shop[\\/]js[\\/]uikit(?:-icons)?\.min\.js$/.test(id.split('?')[0])) {
            return null;
        }

        // The original page loads these UMD files as browser scripts. Force
        // that same branch under Vite so UIkit and UIkitIcons remain globals.
        const commonJsBranch = 'typeof exports=="object"&&typeof module<"u"?module.exports=';

        if (!code.includes(commonJsBranch)) {
            throw new Error(`Unexpected UIkit UMD wrapper in ${id}`);
        }

        return {
            code: code.replace(commonJsBranch, 'false?globalThis.__shopraUmdExport='),
            map: null,
        };
    },
};

export default defineConfig({
    publicDir: 'layout/shop/assets',

    plugins: [
        shopUmdBrowserGlobals,
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/admin.jsx',
                'resources/js/sites/shop.js',
                'resources/js/sites/shop-catalog.js',
                'layout/shop/css/uikit.min.css',
                'layout/shop/css/shopra-gradients.css',
                'layout/shop/css/themes/shopra-theme-core.css',
                'layout/shop/css/shopra-spacing.css',
                ...shopThemeStyles,
            ],
            refresh: true,
        }),

        react(),

        tailwindcss(),
    ],

    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,

        hmr: {
            host: 'localhost',
            port: 5173,
        },

        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
