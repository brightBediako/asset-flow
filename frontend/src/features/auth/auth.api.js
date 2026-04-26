import { apiClient } from "../../lib/apiClient";

export async function login(payload) {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
}

export async function registerUser(payload) {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
}

export async function getMe() {
  const { data } = await apiClient.get("/auth/me");
  return data;
}
