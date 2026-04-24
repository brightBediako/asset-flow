export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === "true",
};
