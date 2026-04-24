import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "./dashboard.api";

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
  });
}
