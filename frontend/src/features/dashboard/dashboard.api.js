import { apiClient } from "../../lib/apiClient";

async function getCountOrZero(path) {
  try {
    const response = await apiClient.get(path);
    return response.data?.length ?? 0;
  } catch (error) {
    if (error?.response?.status === 403) {
      return 0;
    }
    throw error;
  }
}

export async function getDashboardSummary() {
  const [organizations, users, assets, bookings] = await Promise.all([
    getCountOrZero("/organizations"),
    getCountOrZero("/users"),
    getCountOrZero("/assets"),
    getCountOrZero("/bookings"),
  ]);

  return {
    organizations,
    users,
    assets,
    bookings,
  };
}
