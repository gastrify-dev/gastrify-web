import { UseFormReturn } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { PersonalInfoVariables } from "@/features/healthProfile/types";
import { setPersonalInfo } from "../actions/set-personal-info";
import { toast } from "sonner";

interface Props {
  form: UseFormReturn<PersonalInfoVariables>;
}

export const usePersonalInfoMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: PersonalInfoVariables) => {
      const { error } = await setPersonalInfo(variables);

      if (error) return Promise.reject(error);
    },
    onSuccess: (_data, variables) => {
      toast.success("Personal information form was submitted succesfully", {
        duration: 10_000,
      });
    },
    onError: (error, variables) => {
      toast.error("An error has ocurred, please try again", {
        duration: 10_000,
      });
    },
    onSettled: () => {
      //Invalidate queries
    },
  });
};
