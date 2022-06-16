// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   esbuild: {
//     // jsxInject: `import React from 'react'`
//   },
//   base: "./",
//   server: {
//     open: true,
//     watch: {
//       usePolling: true,
//     },
//   },
// });

import { rmSync } from "fs";
import { join } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron/renderer";
import pkg from "./package.json";
import svgr from "@honkhonk/vite-plugin-svgr";

rmSync(join(__dirname, "dist"), { recursive: true, force: true }); // v14.14.0

// https://vitejs.dev/config/
export default defineConfig((command, mode) => {
  return {
    resolve: {
      alias: {
        "@": join(__dirname, "src"),
        styles: join(__dirname, "src/assets/styles"),
      },
    },
    base: "./",
    plugins: [
      react({
        include: "**/*.jsx",
      }),
      svgr(),
      electron({
        main: {
          entry: join(__dirname, "electron/main/index.js"),
          vite: {
            build: {
              sourcemap: true,
              outDir: join(__dirname, "dist/electron/main"),
              string: true,
            },
          },
        },
        // preload: {
        //   input: {
        //     // You can configure multiple preload scripts here
        //     splash: join(__dirname, "electron/preload/splash.js"),
        //   },
        //   vite: {
        //     build: {
        //       // For debug
        //       sourcemap: "inline",
        //       outDir: join(__dirname, "dist/electron/preload"),
        //     },
        //   },
        // },
      }),
      // Enables use of Node.js API in the Renderer-process
      renderer(),
    ],
    server: {
      host: pkg.env.VITE_DEV_SERVER_HOST,
      port: pkg.env.VITE_DEV_SERVER_PORT,
    },
  };
});
