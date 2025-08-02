import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEmergencyContactsMutation } from "./use-emergency-contacts-mutation";
import { emergencyContacts } from "@/features/healthProfile/schemas/emergency-contacts";
import type { EmergencyContactsVariables } from "@/features/healthProfile/types";

export const useEmergencyContactsForm = () => {
  const form = useForm<EmergencyContactsVariables>({
    resolver: zodResolver(emergencyContacts),
    defaultValues: {
      contacts: [
        {
          id: "",
          name: "",
          relationship: undefined,
          homePhoneNumber: "",
          celularPhoneNumber: "",
          workPhoneNumber: "",
          email: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const onSubmit = (variables: EmergencyContactsVariables) =>
    console.log(variables);

  const appendContact = () => {
    append({
      id: "",
      name: "",
      relationship: "parent",
      homePhoneNumber: "",
      celularPhoneNumber: "",
      workPhoneNumber: "",
      email: "",
    });
  };

  const removeContact = (index: number) => {
    remove(index);
  };

  const contactsCount = fields.length;

  return {
    form,
    fields,
    appendContact,
    removeContact,
    onSubmit,
    contactsCount,
  };
};
