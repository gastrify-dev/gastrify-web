import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MedicalInfoVariables } from "@/features/healthProfile/types";
import { setMedicalInfo } from "@/features/healthProfile/actions/set-medical-info";

interface Props {
  patientId: string;
}

export const useMedicalInfoMutation = ({ patientId }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: MedicalInfoVariables) => {
      const { error } = await setMedicalInfo(variables);

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success("Medical information was submitted succesfully", {
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
        queryKey: ["profile", "medicalInfo", "detail", patientId],
      });
    },
  });
};
