// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
    srcDir: './', // Allow flexible src paths
    integrations: [svelte()],
    vite: {
        resolve: {
            alias: {
                '@shared': new URL('./shared', import.meta.url).pathname,
            },
        },
        build: {
            rollupOptions: {
                input: {
                    article: "theme/provided-article-theme.css",
                },
            }
        }
    },
});
