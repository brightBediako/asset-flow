import { apiClient } from "../../lib/apiClient";

export async function getBookings({ organizationId } = {}) {
  const { data } = await apiClient.get("/bookings", {
    params: organizationId ? { organizationId } : {},
  });
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

export async function searchBookings({ organizationId, query, page = 0, size = 20 } = {}) {
  const { data } = await apiClient.get("/bookings/search", {
    params: {
      ...(organizationId ? { organizationId } : {}),
      ...(query ? { q: query } : {}),
      page,
      size,
    },
  });
  return data;
}
