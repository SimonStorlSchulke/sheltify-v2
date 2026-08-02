import baseConfig from '../../astro.config.mjs';
import { defineConfig } from "astro/config";

const isProduction = process.env.ENVIRONMENT === "production";

export default defineConfig({
    ...baseConfig,
    root: "./sites/snhg",
    outDir: isProduction
        ? "/var/www/sheltify/client-snhg"
        : "../../dist/snhg",
});