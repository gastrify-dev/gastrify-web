import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { medicalInfo } from "../schemas/medical-info";
import type { MedicalInfoVariables } from "../types";

export const useMedicalInfoForm = () => {
  const form = useForm<MedicalInfoVariables>({
    resolver: zodResolver(medicalInfo),
    defaultValues: {
      bloodType: undefined,
      rhFactor: undefined,
      allergies: undefined,
      allergyDetails: "",
      allowsTransfusions: undefined,
      alcohol: undefined,
      drugs: undefined,
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
