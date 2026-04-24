import { useQuery } from "@tanstack/react-query";
import { getRoles } from "./roles.api";

export function useRolesQuery() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
}
