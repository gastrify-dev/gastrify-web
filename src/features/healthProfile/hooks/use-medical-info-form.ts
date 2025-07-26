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
      allergies: false,
      allergyDetails: "",
      allowsTransfusions: false,
      alcohol: false,
      drugs: false,
      chronicIllnessMedication: "",
      chronicIlnessDetails: "",
      hasHealthInsurance: undefined,
      healthInsuranceProvider: "",
    },
  });

  const onSubmit = (variables: MedicalInfoVariables) => console.log(variables);

  return {
    form,
    onSubmit,
  };
};
