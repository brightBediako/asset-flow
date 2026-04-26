import { apiClient } from "../../lib/apiClient";

export async function getBookings() {
  const { data } = await apiClient.get("/bookings");
  return data;
}

export async function getBookingById(id) {
  const { data } = await apiClient.get(`/bookings/${id}`);
  return data;
}

export async function createBooking(payload) {
  const { data } = await apiClient.post("/bookings", payload);
  return data;
}

export async function updateBooking(id, payload) {
  const { data } = await apiClient.put(`/bookings/${id}`, payload);
  return data;
}

export async function deleteBooking(id) {
  await apiClient.delete(`/bookings/${id}`);
}
