import { message } from "antd";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { authService } from "@/common/AuthService";
import { isNilOrEmpty } from "@/utils/BooleanUtil";
import debounce, { debounceErrorMessage } from "@/utils/Debounce";

class HttpRequest {
  axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });

    const logout = debounce(() => {
      debounceErrorMessage("Sesi Anda Telah Berakhir. Mohon Login Kembali");
      authService.logout();
    }, 500);

    const unauthorized = debounce(() => {
      authService.unauthorized();
    }, 500);

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          logout();
        }
        if (error.response?.status === 403) {
          unauthorized();
        }

        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = localStorage.getItem("token");

        if (!isNilOrEmpty(token)) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      }
    );
  }

  get(url: string, config: AxiosRequestConfig = {}) {
    return this.axiosInstance.get(url, config).then((response) => response);
  }

  post(url: string, data: any, config: AxiosRequestConfig = {}) {
    return this.axiosInstance
      .post(url, data, config)
      .then((response) => response);
  }

  put(url: string, data: any, config: AxiosRequestConfig = {}) {
    return this.axiosInstance
      .put(url, data, config)
      .then((response) => response);
  }

  patch(url: string, data: any, config: AxiosRequestConfig = {}) {
    return this.axiosInstance
      .patch(url, data, config)
      .then((response) => response);
  }

  delete(url: string, config: AxiosRequestConfig = {}) {
    return this.axiosInstance.delete(url, config).then((response) => response);
  }
}

const httpRequest = new HttpRequest(
  `${process.env.NEXT_PUBLIC_BACK_END_URL}/api`
);

export default httpRequest;
