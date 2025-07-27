import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { usePersonalInfoMutation } from "@/features/healthProfile/hooks/use-personal-info-mutation";
import { personalInfo } from "@/features/healthProfile/schemas/personal-info";
import type { PersonalInfoVariables } from "@/features/healthProfile/types";

export const usePersonalInfoForm = () => {
  const form = useForm<PersonalInfoVariables>({
    resolver: zodResolver(personalInfo),
    defaultValues: {
      age: 0,
      profession: "",
      occupation: "",
      maritalStatus: undefined,
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
  });

  const { mutate, isPending } = usePersonalInfoMutation({
    form,
  });

  const onSubmit = (variables: PersonalInfoVariables) => console.log(variables);

  const hasChildren = form.watch("hasChildren");

  return {
    form,
    onSubmit,
    hasChildren,
  };
};
