import { apiClient } from "../../lib/apiClient";
import { env } from "../../lib/env";
import { mockApi } from "../../lib/mockApi";

export async function login(payload) {
  if (env.useMockData) return mockApi.auth.login(payload);
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
}

export async function registerUser(payload) {
  if (env.useMockData) return mockApi.auth.register(payload);
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
}

export async function getMe() {
  if (env.useMockData) return mockApi.auth.me();
  const { data } = await apiClient.get("/auth/me");
  return data;
}
