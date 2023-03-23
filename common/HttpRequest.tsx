import { message } from "antd";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { authService } from "./AuthService";
import { BASE_URL } from "../config/Production";
import { isNilOrEmpty } from "../utils/CommonUtil";

class HttpRequest {
  axiosInstance: AxiosInstance;
  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          message.error("Your session has expired. Please login again.");
          authService.logout();
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

const httpRequest = new HttpRequest(`${BASE_URL}/api`);
export default httpRequest;
