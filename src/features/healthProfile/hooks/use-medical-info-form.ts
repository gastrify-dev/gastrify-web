import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/hooks/use-session";

import { useMedicalInfoMutation } from "./use-medical-info-mutation";
import { medicalInfo } from "@/features/healthProfile/schemas/medical-info";
import type { MedicalInfoVariables } from "@/features/healthProfile/types";
import { useStepperContext } from "../context/stepper-context";
import { getMedicalInfo } from "../actions/get-medical-info";

interface Props {
  patientId: string;
}

export const useMedicalInfoForm = ({ patientId }: Props) => {
  const { nextStep } = useStepperContext();

  const { data, isLoading } = useQuery({
    queryKey: ["profile", "medicalInfo", "detail", patientId],
    queryFn: async () => {
      const { data, error } = await getMedicalInfo(patientId);

      if (error) return Promise.reject(error);

      return data;
    },
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
    values: data,
  });

  const { mutate, isPending } = useMedicalInfoMutation({ patientId });

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
