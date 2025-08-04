import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { EmergencyContactsVariables } from "@/features/healthProfile/types";
import { setEmergencyContacts } from "../actions/set-emergency-contacts";

interface Props {
  patientId: string;
}

export const useEmergencyContactsMutation = ({ patientId }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: EmergencyContactsVariables) => {
      const { error } = await setEmergencyContacts(variables);

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success("Emergency contacts was submitted succesfully", {
        duration: 10_000,
      });
    },
    onError: () => {},
    onSettled: () => {
      queryClient.cancelQueries({
        queryKey: ["profile", "emergencyContacts", "detail", patientId],
      });
    },
  });
};
