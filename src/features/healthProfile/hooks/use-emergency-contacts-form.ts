"use client";

import { useForm, useFieldArray } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import { useEmergencyContactsMutation } from "./use-emergency-contacts-mutation";
import { emergencyContacts } from "@/features/healthProfile/schemas/emergency-contacts";
import type { EmergencyContactsVariables } from "@/features/healthProfile/types";
import { getEmergencyContacts } from "@/features/healthProfile/actions/get-emergency-contacts";
import { useDeleteEmergencyContactMutation } from "./use-delete-emergency-contact-mutation";

interface Props {
  patientId: string;
}

export const useEmergencyContactsForm = ({ patientId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile", "emergencyContacts", "detail", patientId],
    queryFn: async () => {
      const { data, error } = await getEmergencyContacts(patientId);

      if (error) return Promise.reject(error);

      return data;
    },
  });

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
    values: data,
  });

  const { mutate: setMutate, isPending: isPendingSet } =
    useEmergencyContactsMutation({ patientId });

  const { mutate: deleteMutate, isPending: isPendingDelete } =
    useDeleteEmergencyContactMutation({ patientId });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const { isDirty } = form.formState;

  const onSubmit = (variables: EmergencyContactsVariables) => {
    if (isDirty) setMutate(variables, { onSuccess: () => console.log("YAY") });
  };

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
    const id = form.getValues(`contacts.${index}.id`);

    if (id) deleteMutate(id, { onSuccess: () => remove(index) });
    else remove(index);
  };

  const contactsCount = fields.length;

  return {
    form,
    fields,
    appendContact,
    removeContact,
    onSubmit,
    contactsCount,
    isLoading,
    isPendingSet,
    isPendingDelete,
  };
};
