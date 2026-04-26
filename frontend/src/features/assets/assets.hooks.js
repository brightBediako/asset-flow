import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAsset,
  deleteAsset,
  getAssetById,
  getAssets,
  searchAssets,
  updateAsset,
} from "./assets.api";

export function useAssetsQuery(filters = {}) {
  const organizationId = filters.organizationId ? String(filters.organizationId) : "";
  return useQuery({
    queryKey: ["assets", { organizationId }],
    queryFn: () => getAssets({ organizationId: organizationId || undefined }),
  });
}

export function useAssetQuery(id) {
  return useQuery({
    queryKey: ["assets", id],
    queryFn: () => getAssetById(id),
    enabled: Boolean(id),
  });
}

export function useAssetSearchQuery({ organizationId, query, page = 0, size = 20 } = {}) {
  const normalizedOrg = organizationId ? String(organizationId) : "";
  const normalizedQuery = query?.trim() ?? "";
  return useQuery({
    queryKey: ["assets", "search", { organizationId: normalizedOrg, query: normalizedQuery, page, size }],
    queryFn: () =>
      searchAssets({
        organizationId: normalizedOrg || undefined,
        query: normalizedQuery || undefined,
        page,
        size,
      }),
  });
}

export function useCreateAssetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}

export function useUpdateAssetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateAsset(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets", variables.id] });
    },
  });
}

export function useDeleteAssetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}
