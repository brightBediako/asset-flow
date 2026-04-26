import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, getUserById, getUsers, searchUsers, updateUser } from "./users.api";

export function useUsersQuery() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}

export function useUserQuery(id) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  });
}

export function useUserSearchQuery({ organizationId, query, page = 0, size = 20 } = {}) {
  const normalizedOrg = organizationId ? String(organizationId) : "";
  const normalizedQuery = query?.trim() ?? "";
  return useQuery({
    queryKey: ["users", "search", { organizationId: normalizedOrg, query: normalizedQuery, page, size }],
    queryFn: () =>
      searchUsers({
        organizationId: normalizedOrg || undefined,
        query: normalizedQuery || undefined,
        page,
        size,
      }),
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
}
