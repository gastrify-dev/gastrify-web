import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { EmergencyContactsVariables } from "@/features/healthProfile/types";
import { toast } from "sonner";

export const useEmergencyContactsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: EmergencyContactsVariables) => {},
    onSuccess: () => {},
    onError: () => {},
  });
};
