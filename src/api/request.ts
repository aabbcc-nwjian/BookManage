export interface RequestConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  params?: any;
  header?: Record<string, string>;
  timeout?: number;
  skipAuth?: boolean;
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

class ApiRequest {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseUrl: string, timeout: number = 10000) {
    this.baseURL = baseUrl;
    this.defaultTimeout = timeout;
  }

  async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json;charset=UTF-8",
        ...config.header,
      };

      if (!config.skipAuth && !config.url.includes("/user/login")) {
        const token = this.getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      let url = this.baseURL + config.url;

      // 处理 URL 参数
      if (config.params) {
        const queryString = Object.keys(config.params)
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(config.params[key])}`,
          )
          .join("&");
        url += (url.includes("?") ? "&" : "?") + queryString;
      }

      // 配置 fetch 选项
      const fetchOptions: RequestInit = {
        method: config.method,
        headers,
      };

      // 添加请求体（POST/PUT 请求）
      if (
        config.data &&
        (config.method === "POST" || config.method === "PUT")
      ) {
        fetchOptions.body = JSON.stringify(config.data);
      }

      // 发送请求
      const response = await fetch(url, fetchOptions);

      // 处理超时
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("请求超时")),
          config.timeout || this.defaultTimeout,
        );
      });

      const raceResult = await Promise.race([response, timeoutPromise]);
      const result = (raceResult as Response).json() as Promise<ApiResponse<T>>;

      return result;
    } catch (error: any) {
      console.error("API Request Error", error);
      throw error;
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
    params?: any,
    config?: Partial<RequestConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: "GET", params, ...config });
  }

  // POST 请求
  post<T>(
    url: string,
    data?: any,
    config?: Partial<RequestConfig>,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: "POST", data, ...config });
  }

  // PUT 请求
  put<T>(
    url: string,
    data?: any,
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

// 创建 API 实例（请替换为你的实际 API 地址）
export const apiClient = new ApiRequest("http://121.40.61.253/api");

// 导出便捷方法
export const request = <T>(config: RequestConfig) =>
  apiClient.request<T>(config);

export const get = <T>(
  url: string,
  params?: any,
  config?: Partial<RequestConfig>,
) => {
  return apiClient.get<T>(url, params, config);
};

export const post = <T>(
  url: string,
  data?: any,
  config?: Partial<RequestConfig>,
) => {
  return apiClient.post<T>(url, data, config);
};

export const put = <T>(
  url: string,
  data?: any,
  config?: Partial<RequestConfig>,
) => {
  return apiClient.put<T>(url, data, config);
};

export const del = <T>(url: string, config?: Partial<RequestConfig>) => {
  return apiClient.delete<T>(url, config);
};
