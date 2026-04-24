import { apiClient } from "../../lib/apiClient";
import { env } from "../../lib/env";
import { mockApi } from "../../lib/mockApi";

export async function getUsers() {
  if (env.useMockData) return mockApi.users.list();
  const { data } = await apiClient.get("/users");
  return data;
}

export async function getUserById(id) {
  if (env.useMockData) return mockApi.users.get(id);
  const { data } = await apiClient.get(`/users/${id}`);
  return data;
}

export async function createUser(payload) {
  if (env.useMockData) return mockApi.users.create(payload);
  const { data } = await apiClient.post("/users", payload);
  return data;
}

export async function updateUser(id, payload) {
  if (env.useMockData) return mockApi.users.update(id, payload);
  const { data } = await apiClient.put(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id) {
  if (env.useMockData) return mockApi.users.remove(id);
  await apiClient.delete(`/users/${id}`);
}
