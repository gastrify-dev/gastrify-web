import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { medicalInfo } from "@/features/healthProfile/schemas/medical-info";
import type { MedicalInfoVariables } from "@/features/healthProfile/types";

export const useMedicalInfoForm = () => {
  const form = useForm<MedicalInfoVariables>({
    resolver: zodResolver(medicalInfo),
    defaultValues: {
      bloodType: undefined,
      rhFactor: undefined,
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
  });

  const onSubmit = (variables: MedicalInfoVariables) => console.log(variables);

  const hasAllergies = form.watch("hasAllergies");
  const hasChronicIllness = form.watch("hasChronicIllness");
  const hasHealthInsurance = form.watch("hasHealthInsurance");

  return {
    form,
    onSubmit,
    hasAllergies,
    hasChronicIllness,
    hasHealthInsurance,
  };
};
