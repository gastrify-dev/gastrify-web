import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { PersonalInfoVariables } from "@/features/healthProfile/types";
import { setPersonalInfo } from "@/features/healthProfile/actions/set-personal-info";

interface Props {
  patientId: string;
}

export const usePersonalInfoMutation = ({ patientId }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: PersonalInfoVariables) => {
      const { error } = await setPersonalInfo(variables);

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success("Personal information form was submitted succesfully", {
        duration: 5_000,
      });
    },
    onError: () => {
      toast.error("An error has ocurred, please try again", {
        duration: 5_000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", "personalInfo", "detail", patientId],
      });
    },
  });
};
