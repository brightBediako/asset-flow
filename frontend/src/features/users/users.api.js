import { apiClient } from "../../lib/apiClient";

export async function getUsers() {
  const { data } = await apiClient.get("/users");
  return data;
}

export async function getUserById(id) {
  const { data } = await apiClient.get(`/users/${id}`);
  return data;
}

export async function createUser(payload) {
  const { data } = await apiClient.post("/users", payload);
  return data;
}

export async function updateUser(id, payload) {
  const { data } = await apiClient.put(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id) {
  await apiClient.delete(`/users/${id}`);
}
