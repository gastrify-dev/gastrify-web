import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MedicalInfoVariables } from "@/features/healthProfile/types";
import { toast } from "sonner";
import { setMedicalInfo } from "../actions/set-medical-info";

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
        duration: 10_000,
      });
    },
    onError: (error) => {
      console.log(error);

      toast.error("An error has ocurred, please try again", {
        duration: 10_000,
      });
    },
    onSettled: () => {
      queryClient.cancelQueries({
        queryKey: ["profile", "medicalInfo", "detail", patientId],
      });
    },
  });
};
