import { apiClient } from "../../lib/apiClient";
import { env } from "../../lib/env";
import { mockApi } from "../../lib/mockApi";

export async function getDashboardSummary() {
  if (env.useMockData) return mockApi.dashboard.summary();

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
