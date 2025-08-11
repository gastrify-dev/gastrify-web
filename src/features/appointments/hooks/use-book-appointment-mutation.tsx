import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRef } from "react";

import { Button } from "@/shared/components/ui/button";
import { ActionError } from "@/shared/types";

import {
  bookAppointment,
  BookAppointmentErrorCode,
} from "@/features/appointments/actions/book-appointment";
import type { BookAppointmentVariables } from "@/features/appointments/types";

export const useBookAppointmentMutation = () => {
  const queryClient = useQueryClient();

  const t = useTranslations(
    "features.appointments.use-book-appointment-mutation",
  );

  const toastID = useRef<string | number | undefined>(undefined);

  return useMutation({
    mutationFn: async (variables: BookAppointmentVariables) => {
      const { error } = await bookAppointment(variables);

      if (error) return Promise.reject(error);
    },
    onMutate: async () => {
      toastID.current = toast.loading(t("loading-toast"));
    },
    onSuccess: () => {
      toast.success(t("success-toast"), {
        id: toastID.current,
      });
    },
    onError: (error: ActionError<BookAppointmentErrorCode>) => {
      const description =
        error.code === "PROFILE_INCOMPLETE"
          ? t("profile-incomplete-description")
          : t("error-toast-description");

      toast.error(
        error.code === "PROFILE_INCOMPLETE"
          ? t("profile-incomplete-title")
          : t("error-toast"),
        {
          id: toastID.current,
          description,
          action: (
            <Button variant="secondary" size="sm" asChild>
              <Link href="/profile">{t("go-to-profile")}</Link>
            </Button>
          ),
        },
      );
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointment", "list", "user", variables.patientId],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointment", "list", "calendar"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notification", "list"],
      });
    },
  });
};
