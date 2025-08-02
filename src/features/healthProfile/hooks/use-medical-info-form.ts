import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/hooks/use-session";

import { useMedicalInfoMutation } from "./use-medical-info-mutation";
import { medicalInfo } from "@/features/healthProfile/schemas/medical-info";
import type { MedicalInfoVariables } from "@/features/healthProfile/types";
import { useStepperContext } from "../context/stepper-context";
import { getMedicalInfo } from "../actions/get-medical-info";

export const useMedicalInfoForm = () => {
  const { nextStep } = useStepperContext();

  const { data: session } = useSession();

  const { data: medicalInfoData, isLoading } = useQuery({
    enabled: !!session?.user.id,
    queryFn: async () => {
      const { data, error } = await getMedicalInfo(session!.user.id);

      if (error) return Promise.reject(error);

      return data;
    },
    queryKey: ["medicalInfo", "details"],
  });

  const form = useForm<MedicalInfoVariables>({
    resolver: zodResolver(medicalInfo),
    defaultValues: {
      bloodType: undefined,
      rhFactor: undefined,
      religion: undefined,
      hasAllergies: false,
      allergyDetails: "",
      allowsTransfusions: false,
      alcohol: false,
      drugs: false,
      hasChronicIllness: false,
      chronicIllnessDetails: "",
      hasHealthInsurance: false,
      healthInsuranceProvider: "",
    },
    values: medicalInfoData,
  });

  const { mutate, isPending } = useMedicalInfoMutation();

  const { isDirty } = form.formState;

  const onSubmit = (variables: MedicalInfoVariables) => {
    if (isDirty) mutate(variables, { onSuccess: () => nextStep() });
    else nextStep();
  };

  const hasAllergies = form.watch("hasAllergies");
  const hasChronicIllness = form.watch("hasChronicIllness");
  const hasHealthInsurance = form.watch("hasHealthInsurance");

  return {
    form,
    onSubmit,
    hasAllergies,
    hasChronicIllness,
    hasHealthInsurance,
    isPending,
    isLoading,
  };
};
