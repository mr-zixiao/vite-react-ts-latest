import { Plugin as importToCDN } from "vite-plugin-cdn-import";

const createCdnImport = () => {
  return importToCDN({
    modules: [
      {
        name: "axios",
        var: "axios",
        path: "https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/axios/0.26.0/axios.min.js",
      },
      {
        name: "echarts",
        var: "echarts",
        path: "https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/echarts/5.3.0-rc.1/echarts.min.js",
      },
      {
        name: "lodash",
        var: "_",
        path: "https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/lodash.js/4.17.21/lodash.min.js",
      },
    ],
  });
};
export default createCdnImport;
