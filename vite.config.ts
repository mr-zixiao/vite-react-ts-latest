import * as path from "path";
import type { UserConfig } from "vite";
import { defineConfig, loadEnv } from "vite";
import postCssPxToRem from "postcss-pxtorem";
import createVitePlugins from "./vite/plugins";
import startupLog from "./vite/startup";

export default ({ command, mode }: { command: string; mode: string }) => {
  const env = loadEnv(mode, process.cwd());

  startupLog({ command, mode, ...env });
  return defineConfig({
    plugins: createVitePlugins(env, command === "build"),
    base: env.VITE_PUBLIC_PATH,
    esbuild: {
      drop: mode === "development" ? [] : ["console", "debugger"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      open: true,
      host: "0.0.0.0",
      port: 3000,
      proxy: {
        [env.VITE_BASE_API]: {
          target: "http://" + env.VITE_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(env.VITE_BASE_API, ""),
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: `@use "@/styles/element/index.scss" as *;`,
        },
      },
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 16,
            unitPrecision: 5,
            propList: ["*"],
            replace: true,
            mediaQuery: false,
          }),
        ],
      },
    },
  } as UserConfig);
};
