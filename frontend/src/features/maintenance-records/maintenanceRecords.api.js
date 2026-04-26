import { apiClient } from "../../lib/apiClient";

export async function getMaintenanceRecords() {
  const { data } = await apiClient.get("/maintenance-records");
  return data;
}

export async function getMaintenanceRecordById(id) {
  const { data } = await apiClient.get(`/maintenance-records/${id}`);
  return data;
}

export async function createMaintenanceRecord(payload) {
  const { data } = await apiClient.post("/maintenance-records", payload);
  return data;
}

export async function updateMaintenanceRecord(id, payload) {
  const { data } = await apiClient.put(`/maintenance-records/${id}`, payload);
  return data;
}

export async function deleteMaintenanceRecord(id) {
  await apiClient.delete(`/maintenance-records/${id}`);
}
