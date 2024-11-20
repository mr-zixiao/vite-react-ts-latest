import { PluginOption } from "vite";
import compression from "vite-plugin-compression";

export default function createCompression(env: Record<string, string>) {
  const { VITE_BUILD_COMPRESS } = env;
  const plugin: PluginOption[] = [];
  if (VITE_BUILD_COMPRESS) {
    const compressList = VITE_BUILD_COMPRESS.split(",");

    if (compressList.indexOf("gzip") !== -1) {
      // http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
      plugin.push(
        compression({
          ext: ".gz",
          deleteOriginFile: false,
        }),
      );
    }
    if (compressList.indexOf("brotli") !== -1) {
      plugin.push(
        compression({
          ext: ".br",
          algorithm: "brotliCompress",
          deleteOriginFile: false,
        }),
      );
    }
  }
  return plugin;
}
