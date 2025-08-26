// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    srcDir: './', // Allow flexible src paths
    integrations: [],
    vite: {
        resolve: {
            alias: {
                '@shared': new URL('./shared', import.meta.url).pathname,
            },
        },
    },
});
