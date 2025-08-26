import baseConfig from '../../astro.config.mjs';
import { defineConfig } from 'astro/config';

export default defineConfig({
    ...baseConfig,
    root: './sites/snhg',
    outDir: '../../dist/snhg',
});
