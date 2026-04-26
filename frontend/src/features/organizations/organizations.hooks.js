import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrganization,
  deleteOrganization,
  getOrganizationById,
  getOrganizations,
  searchOrganizations,
  updateOrganization,
} from "./organizations.api";

export function useOrganizationsQuery({ enabled = true } = {}) {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
    enabled,
  });
}

export function useOrganizationQuery(id) {
  return useQuery({
    queryKey: ["organizations", id],
    queryFn: () => getOrganizationById(id),
    enabled: Boolean(id),
  });
}

export function useOrganizationSearchQuery({ query, page = 0, size = 20 } = {}) {
  const normalizedQuery = query?.trim() ?? "";
  return useQuery({
    queryKey: ["organizations", "search", { query: normalizedQuery, page, size }],
    queryFn: () =>
      searchOrganizations({
        query: normalizedQuery || undefined,
        page,
        size,
      }),
  });
}

export function useCreateOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useUpdateOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateOrganization(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organizations", variables.id] });
    },
  });
}

export function useDeleteOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
