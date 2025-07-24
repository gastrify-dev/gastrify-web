import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { usePersonalInfoMutation } from "./use-personal-info-mutation";
import { personalInfo } from "../schemas/personal-info";
import type { PersonalInfoVariables } from "../types";

export const usePersonalInfoForm = () => {
  const form = useForm<PersonalInfoVariables>({
    resolver: zodResolver(personalInfo),
    defaultValues: {
      age: 20,
      profession: "",
      occupation: "",
      maritalStatus: undefined,
      hasChildren: undefined,
      numMale: "",
      numFemale: "",
      cSections: undefined,
      abortions: undefined,
      placeOfResidence: "",
      city: "",
      homePhoneNumber: "",
      celularPhoneNumber: "",
      workPhoneNumber: "",
    },
  });

  const { mutate, isPending } = usePersonalInfoMutation({
    form,
  });

  const onSubmit = (variables: PersonalInfoVariables) => console.log(variables);

  return {
    form,
    onSubmit,
  };
};
