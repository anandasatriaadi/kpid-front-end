import { message } from "antd";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { authService } from "@/common/AuthService";
import { isNilOrEmpty } from "@/utils/CommonUtil";
import debounce from "@/utils/Debounce";

class HttpRequest {
  axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });

    const logout = debounce(() => {
      message.error("Your session has expired. Please login again.");
      authService.logout();
    }, 500);

    const unauthorized = debounce(() => {
      message.error("You are not authorized to access this page");
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

  async get(url: string, config: AxiosRequestConfig = {}) {
    const response = await this.axiosInstance.get(url, config);
    return response;
  }

  async post(url: string, data: any, config: AxiosRequestConfig = {}) {
    const response = await this.axiosInstance.post(url, data, config);
    return response;
  }

  async put(url: string, data: any, config: AxiosRequestConfig = {}) {
    const response = await this.axiosInstance.put(url, data, config);
    return response;
  }

  async patch(url: string, data: any, config: AxiosRequestConfig = {}) {
    const response = await this.axiosInstance.patch(url, data, config);
    return response;
  }

  async delete(url: string, config: AxiosRequestConfig = {}) {
    const response = await this.axiosInstance.delete(url, config);
    return response;
  }
}

const httpRequest = new HttpRequest(`${process.env.NEXT_PUBLIC_BASE_URL}/api`);

export default httpRequest;
