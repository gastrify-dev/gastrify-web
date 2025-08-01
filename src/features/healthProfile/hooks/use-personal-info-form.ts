import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/hooks/use-session";

import { usePersonalInfoMutation } from "@/features/healthProfile/hooks/use-personal-info-mutation";
import { personalInfo } from "@/features/healthProfile/schemas/personal-info";
import type { PersonalInfoVariables } from "@/features/healthProfile/types";
import { useStepperContext } from "../context/stepper-context";
import { getPersonalInfo } from "../actions/get-personal-info";
import { useEffect } from "react";

interface Props {
  patiendId: string;
}

export const usePersonalInfoForm = () => {
  const { nextStep } = useStepperContext();

  const { data: session } = useSession();

  const { data: personalInfoData, isLoading } = useQuery({
    enabled: !!session?.user.id,
    queryFn: async () => {
      const { data, error } = await getPersonalInfo(session!.user.id);

      if (error) return Promise.reject(error);

      return data;
    },
    queryKey: ["personalInfo", "details"],
  });

  const form = useForm<PersonalInfoVariables>({
    resolver: zodResolver(personalInfo),
    defaultValues: {
      age: 0,
      profession: "",
      occupation: "",
      maritalStatus: "single",
      hasChildren: false,
      numMale: 0,
      numFemale: 0,
      cSections: false,
      abortions: false,
      placeOfResidence: "",
      city: "",
      homePhoneNumber: "",
      celularPhoneNumber: "",
      workPhoneNumber: "",
    },
    values: personalInfoData,
  });

  const { mutate, isPending } = usePersonalInfoMutation({
    form,
  });

  const { isDirty } = form.formState;

  const onSubmit = (variables: PersonalInfoVariables) => {
    if (isDirty) mutate(variables, { onSuccess: () => nextStep() });
    else nextStep();
  };

  const hasChildren = form.watch("hasChildren");

  return {
    form,
    onSubmit,
    hasChildren,
    isLoading,
    isPending,
  };
};
