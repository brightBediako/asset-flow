import { apiClient } from "../../lib/apiClient";
import { env } from "../../lib/env";
import { mockApi } from "../../lib/mockApi";

export async function getBookings() {
  if (env.useMockData) return mockApi.bookings.list();
  const { data } = await apiClient.get("/bookings");
  return data;
}

export async function getBookingById(id) {
  if (env.useMockData) return mockApi.bookings.get(id);
  const { data } = await apiClient.get(`/bookings/${id}`);
  return data;
}

export async function createBooking(payload) {
  if (env.useMockData) return mockApi.bookings.create(payload);
  const { data } = await apiClient.post("/bookings", payload);
  return data;
}

export async function updateBooking(id, payload) {
  if (env.useMockData) return mockApi.bookings.update(id, payload);
  const { data } = await apiClient.put(`/bookings/${id}`, payload);
  return data;
}

export async function deleteBooking(id) {
  if (env.useMockData) return mockApi.bookings.remove(id);
  await apiClient.delete(`/bookings/${id}`);
}
