export interface RequestConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: unknown;
  params?: object;
  header?: Record<string, string>;
  timeout?: number;
  skipAuth?: boolean;
}

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
  msg: string;
}

class ApiRequest {
  readonly baseURL: string;
  private defaultTimeout: number;

  constructor(baseUrl: string, timeout: number = 10000) {
    this.baseURL = baseUrl;
    this.defaultTimeout = timeout;
  }

  async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      config.timeout || this.defaultTimeout,
    );

    try {
      const isFormData = config.data instanceof FormData;
      const headers: Record<string, string> = {
        ...config.header,
      };

      if (!isFormData) {
        headers["Content-Type"] = "application/json;charset=UTF-8";
      }

      if (!config.skipAuth && !config.url.includes("/auth/")) {
        const token = this.getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      let url = this.baseURL + config.url;

      // 处理 URL 参数
      if (config.params) {
        const params = config.params as Record<string, unknown>;
        const queryString = Object.keys(params)
          .filter((key) => {
            const value = params[key];
            return value !== undefined && value !== null && value !== "";
          })
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`,
          )
          .join("&");
        if (queryString) {
          url += (url.includes("?") ? "&" : "?") + queryString;
        }
      }

      // 配置 fetch 选项
      const fetchOptions: RequestInit = {
        method: config.method,
        headers,
        signal: controller.signal,
      };

      // 添加请求体（POST/PUT 请求）
      if (
        config.data !== undefined &&
        (config.method === "POST" || config.method === "PUT")
      ) {
        fetchOptions.body = isFormData
          ? (config.data as FormData)
          : JSON.stringify(config.data);
      }

      // 发送请求
      const response = await fetch(url, fetchOptions);
      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const message = response.ok ? "success" : response.statusText;
        return { code: response.status, message, msg: message, data: null as T };
      }

      const result = (await response.json()) as Omit<ApiResponse<T>, "msg"> & {
        msg?: string;
      };

      return {
        ...result,
        message: result.message || result.msg || "",
        msg: result.msg || result.message || "",
      };
    } catch (error) {
      console.error("API Request Error", error);
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // 显示错误消息
  showError(message: string): void {
    // 这里可以替换为你项目中的消息提示组件
    console.error("API Error:", message);
    // 如果有 UI 组件库，可以使用类似下面的方式
    // Message.error(message);
  }

  // GET 请求
  get<T>(
    url: string,
    params?: object,
    config?: Partial<RequestConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: "GET", params, ...config });
  }

  // POST 请求
  post<T>(
    url: string,
    data?: unknown,
    config?: Partial<RequestConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: "POST", data, ...config });
  }

  // PUT 请求
  put<T>(
    url: string,
    data?: unknown,
    config?: Partial<RequestConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: "PUT", data, ...config });
  }

  // DELETE 请求
  delete<T>(
    url: string,
    config?: Partial<RequestConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: "DELETE", ...config });
  }
}

const DEFAULT_BASE_URL = "http://121.40.61.253/api";

// 创建 API 实例
export const apiClient = new ApiRequest(
  import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL,
);

// 导出便捷方法
export const request = <T>(config: RequestConfig) =>
  apiClient.request<T>(config);

export const get = <T>(
  url: string,
  params?: object,
  config?: Partial<RequestConfig>,
) => {
  return apiClient.get<T>(url, params, config);
};

export const post = <T>(
  url: string,
  data?: unknown,
  config?: Partial<RequestConfig>,
) => {
  return apiClient.post<T>(url, data, config);
};

export const put = <T>(
  url: string,
  data?: unknown,
  config?: Partial<RequestConfig>,
) => {
  return apiClient.put<T>(url, data, config);
};

export const del = <T>(url: string, config?: Partial<RequestConfig>) => {
  return apiClient.delete<T>(url, config);
};
