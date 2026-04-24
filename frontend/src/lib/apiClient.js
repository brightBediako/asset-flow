import axios from "axios";
import { clearAuth } from "./auth";
import { env } from "./env";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuth();
      globalThis.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
