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
        // components are rendered once, so capturing only the initial prop value is intended
        filterWarnings: (warning) => warning.code !== "state_referenced_locally",
      }),
    ],
    logLevel: "info",
  })
  .catch(() => process.exit(1));