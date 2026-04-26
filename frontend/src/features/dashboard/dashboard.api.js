import { apiClient } from "../../lib/apiClient";

export async function getDashboardSummary() {
  const [organizations, users, assets, bookings] = await Promise.all([
    apiClient.get("/organizations"),
    apiClient.get("/users"),
    apiClient.get("/assets"),
    apiClient.get("/bookings"),
  ]);

  return {
    organizations: organizations.data?.length ?? 0,
    users: users.data?.length ?? 0,
    assets: assets.data?.length ?? 0,
    bookings: bookings.data?.length ?? 0,
  };
}
