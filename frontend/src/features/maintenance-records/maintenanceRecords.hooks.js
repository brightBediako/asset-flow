import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMaintenanceRecord,
  deleteMaintenanceRecord,
  getMaintenanceRecordById,
  getMaintenanceRecords,
  updateMaintenanceRecord,
} from "./maintenanceRecords.api";

export function useMaintenanceRecordsQuery() {
  return useQuery({
    queryKey: ["maintenance-records"],
    queryFn: getMaintenanceRecords,
  });
}

export function useMaintenanceRecordQuery(id) {
  return useQuery({
    queryKey: ["maintenance-records", id],
    queryFn: () => getMaintenanceRecordById(id),
    enabled: Boolean(id),
  });
}

export function useCreateMaintenanceRecordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-records"] });
    },
  });
}

export function useUpdateMaintenanceRecordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateMaintenanceRecord(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-records"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-records", variables.id] });
    },
  });
}

export function useDeleteMaintenanceRecordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-records"] });
    },
  });
}
