import axios from "axios";
import { clearAuth } from "./auth";
import { env } from "./env";

function isAuthRequest(url) {
  return /\/auth\/(login|register)/.test(String(url || ""));
}

function getRedirectParamValue() {
  const { pathname = "/", search = "", hash = "" } = globalThis.location ?? {};
  if (pathname === "/login") return "/app";
  return `${pathname}${search}${hash}`;
}

function getLoginRedirectUrl() {
  const redirect = encodeURIComponent(getRedirectParamValue());
  return `/login?redirect=${redirect}`;
}

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
      if (!isAuthRequest(error?.config?.url)) {
        const target = getLoginRedirectUrl();
        const current = `${globalThis.location?.pathname ?? ""}${globalThis.location?.search ?? ""}`;
        if (current !== target) {
          globalThis.location.replace(target);
        }
      }
    }
    return Promise.reject(error);
  },
);
