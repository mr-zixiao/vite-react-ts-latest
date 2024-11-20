/// <reference types="vite/client" />
interface ImportMetaEnv {
  // 项目环境
  readonly VITE_APP_ENV: "development" | "production" | "test";
  // 代理名称
  readonly VITE_BASE_API: string;
  // 代理地址
  readonly VITE_BASE_URL: string;
  // 开发或生产环境服务的公共基础路径。
  readonly VITE_PUBLIC_PATH?: string;
  // 是否在打包时开启压缩
  readonly VITE_BUILD_COMPRESS?: "none" | "gzip" | "brotli";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// App全局配置
interface GlobalAppConfig {
  // 页面标题
  readonly title: string;
}

declare global {
  interface Window {
    __APP_CONFIG__: GlobalAppConfig;
  }
}
