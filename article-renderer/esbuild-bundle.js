import esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";

esbuild
  .build({
    entryPoints: ["./components"],
    bundle: true,
    outfile: "dist/web-components.js",
    plugins: [
      sveltePlugin({
        compilerOptions: {
        customElement: true,
       },
      }),
    ],
    logLevel: "info",
  })
  .catch(() => process.exit(1));