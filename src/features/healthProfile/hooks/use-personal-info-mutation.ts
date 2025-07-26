import { UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import type { PersonalInfoVariables } from "@/features/healthProfile/types";

interface Props {
  form: UseFormReturn<PersonalInfoVariables>;
}

export const usePersonalInfoMutation = ({ form }: Props) => {
  return useMutation({
    mutationFn: async (variables: PersonalInfoVariables) => {},
    onSuccess: (_data, variables) => {
      //TODO
      //Toast?
      //Query client???
    },
    onError: (error, variables) => {
      //TODO????
    },
    onSettled: () => {
      //???????????
    },
  });
};
