"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["profile", "emergencyContacts", "detail", patientId],
    queryFn: async () => {
      const { data, error } = await getEmergencyContacts(patientId);

      if (error) return Promise.reject(error);

      return data;
    },
    refetchOnWindowFocus: false,
  });

  const form = useForm<EmergencyContactsVariables>({
    resolver: zodResolver(emergencyContacts),
    defaultValues: {
      patientId: patientId,
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
    if (isDirty)
      setMutate(variables, { onSuccess: () => router.push("/profile") });
    else
      toast.info("No changes made", {
        description: "There are no changes to submit",
        duration: 3_000,
        closeButton: true,
        position: "top-center",
      });
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

    if (id) {
      const toastWarning = toast.warning(
        "Are you sure you want to delete this contact?",
        {
          description: "This action cannot be undone.",
          duration: 10_000,
          closeButton: true,
          position: "top-center",
          action: {
            label: "Confirm",
            onClick: () => {
              if (id) {
                deleteMutate(id, {
                  onSuccess: () => {
                    remove(index);
                    toast.dismiss(toastWarning);
                  },
                });
              }
            },
          },
        },
      );
    } else {
      remove(index);
    }
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
