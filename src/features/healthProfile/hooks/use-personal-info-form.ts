import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/hooks/use-session";

import { usePersonalInfoMutation } from "@/features/healthProfile/hooks/use-personal-info-mutation";
import { personalInfo } from "@/features/healthProfile/schemas/personal-info";
import type { PersonalInfoVariables } from "@/features/healthProfile/types";
import { useStepperContext } from "../context/stepper-context";
import { getPersonalInfo } from "../actions/get-personal-info";

interface Props {
  patientId: string;
}

export const usePersonalInfoForm = ({ patientId }: Props) => {
  const { nextStep } = useStepperContext();

  const { data, isLoading } = useQuery({
    queryKey: ["profile", "personalInfo", "detail", patientId],
    queryFn: async () => {
      const { data, error } = await getPersonalInfo(patientId);

      if (error) return Promise.reject(error);

      return data;
    },
  });

  const form = useForm<PersonalInfoVariables>({
    resolver: zodResolver(personalInfo),
    defaultValues: {
      age: 0,
      profession: "",
      occupation: "",
      maritalStatus: "married",
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
    values: data,
  });

  const { mutate, isPending } = usePersonalInfoMutation({ patientId });

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
