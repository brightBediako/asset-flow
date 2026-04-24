import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAsset, deleteAsset, getAssetById, getAssets, updateAsset } from "./assets.api";

export function useAssetsQuery() {
  return useQuery({
    queryKey: ["assets"],
    queryFn: getAssets,
  });
}

export function useAssetQuery(id) {
  return useQuery({
    queryKey: ["assets", id],
    queryFn: () => getAssetById(id),
    enabled: Boolean(id),
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
