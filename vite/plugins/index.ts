import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { PluginOption } from "vite";
import createCompression from "./compression.ts";
import createCdnImport from "./cdn-import.ts";

const createVitePlugins = (
  viteEnv: Record<string, string>,
  isBuild = false,
) => {
  const vitePlugins: PluginOption[] = [react(), visualizer()];
  if (isBuild) vitePlugins.push(...createCompression(viteEnv));
  if (isBuild) vitePlugins.push(createCdnImport());
  return vitePlugins;
};

export default createVitePlugins;
