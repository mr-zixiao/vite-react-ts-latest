import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { ApiDataResponse, ApiRowsResponse } from "@/types/axios";
import { emitter } from "@/hooks/useEmitter.ts";
import { errorHandles, errorMessage } from "@/services/axios/error.ts";
import { store } from "@/store";

class Request {
  private readonly instance: AxiosInstance;

  constructor(baseConfig: AxiosRequestConfig) {
    this.instance = axios.create(baseConfig);
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = store.getState().auth.token;
        if (token) config.headers.Authorization = `Bearer ${token}`;
        config.url =
          config.url!.indexOf("?") >= 0
            ? `${config.url}&_t=${new Date().getTime()}`
            : `${config.url}?_t=${new Date().getTime()}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    this.instance.interceptors.response.use(
      async (response: AxiosResponse) => {
        const {
          data: { code, msg },
        } = response;
        if (code != 200) {
          this.onError(msg, code);
        }
        return response.data;
      },
      (error) => {
        const msg = error.toString();
        if (msg.includes("Network")) {
          this.onError("请求失败，请检查网络连接或稍后重试。");
        } else if (msg.includes("timeout")) {
          this.onError("请求超时，请检查网络连接或稍后重试。");
        } else {
          const status = error.response ? error.response.status : 0;
          this.onError(msg, status);
        }
        return error;
      },
    );
  }

  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public async data<T>(
    config: AxiosRequestConfig,
  ): Promise<ApiDataResponse<T>> {
    return await this.instance(config);
  }

  public async rows<T>(
    config: AxiosRequestConfig,
  ): Promise<ApiRowsResponse<T>> {
    return await this.instance(config);
  }

  private onError(msg: string, code?: keyof typeof errorMessage) {
    let handle, resultMessage;
    if (code != undefined) {
      handle = errorHandles[code];
      resultMessage = msg || errorMessage[code] || errorMessage[0];
    } else {
      resultMessage = msg || errorMessage[0];
    }
    emitter.emit("message", {
      type: "error",
      content: resultMessage,
    });
    handle?.();
  }
}

const request = new Request({
  timeout: 5000,
  baseURL: import.meta.env.VITE_BASE_API,
});

export default request;
