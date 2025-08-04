import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEmergencyContact } from "../actions/delete-emergency-contact";

interface Props {
  patientId: string;
}

export const useDeleteEmergencyContactMutation = ({ patientId }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emergencyContactId: string) => {
      const { error } = await deleteEmergencyContact(emergencyContactId);

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success("Emergency contacts was deleted succesfully", {
        duration: 5_000,
      });
    },
    onError: (error) => {
      console.log(error);

      toast.error("An error has ocurred, please try again", {
        duration: 5_000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", "emergencyContacts", "detail", patientId],
      });
    },
  });
};
