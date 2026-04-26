import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  searchBookings,
  updateBooking,
} from "./bookings.api";

export function useBookingsQuery(filters = {}) {
  const organizationId = filters.organizationId ? String(filters.organizationId) : "";
  return useQuery({
    queryKey: ["bookings", { organizationId }],
    queryFn: () => getBookings({ organizationId: organizationId || undefined }),
  });
}

export function useBookingQuery(id) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => getBookingById(id),
    enabled: Boolean(id),
  });
}

export function useBookingSearchQuery({ organizationId, query, page = 0, size = 20 } = {}) {
  const normalizedOrg = organizationId ? String(organizationId) : "";
  const normalizedQuery = query?.trim() ?? "";
  return useQuery({
    queryKey: ["bookings", "search", { organizationId: normalizedOrg, query: normalizedQuery, page, size }],
    queryFn: () =>
      searchBookings({
        organizationId: normalizedOrg || undefined,
        query: normalizedQuery || undefined,
        page,
        size,
      }),
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}

export function useUpdateBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateBooking(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", variables.id] });
    },
  });
}

export function useDeleteBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}
