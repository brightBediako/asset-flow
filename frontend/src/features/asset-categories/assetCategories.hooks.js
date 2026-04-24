import { useQuery } from "@tanstack/react-query";
import { getAssetCategories } from "./assetCategories.api";

export function useAssetCategoriesQuery() {
  return useQuery({
    queryKey: ["asset-categories"],
    queryFn: getAssetCategories,
  });
}
