/**
 * 可以获取请求进度的fetch
 * @param options
 * @returns {Promise<unknown>}
 */
type ResponseProgress = (progress: { loaded: number; total: number }) => void;

interface FetchOptions {
  url: string;
  method: string;
  onProgress?: ResponseProgress;
  data?: never;
}

export const fetchWithProcess = (options: FetchOptions) => {
  const { url, method = "GET", onProgress, data = null } = options;
  return new Promise((resolve) => {
    fetch(url, {
      method,
      body: data,
    }).then(async (resp) => {
      const total = Number(resp.headers.get("content-length"));
      const reader = resp.body!.getReader();
      let loaded = 0;
      let body = "";
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        loaded += value.length;
        body += decoder.decode(value);
        if (onProgress) {
          onProgress({
            loaded,
            total,
          });
        }
      }
      resolve(body);
    });
  });
};
