"use client";

import { format, formatDuration, intervalToDuration, isBefore } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { TypographyP } from "@/shared/components/ui/typography";
import { useSession } from "@/shared/hooks/use-session";

import { useBookAppointmentMutation } from "@/features/appointments/hooks/use-book-appointment-mutation";
import { bookAppointmentSchema } from "@/features/appointments/schemas/book-appointment";
import type {
  BookAppointmentVariables,
  CalendarEvent,
} from "@/features/appointments/types";

interface BookingDialogProps {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDialog({ event, isOpen, onClose }: BookingDialogProps) {
  const t = useTranslations("features.appointments.booking-dialog");
  const { data: session } = useSession();

  const form = useForm<BookAppointmentVariables>({
    resolver: zodResolver(bookAppointmentSchema),
    values: {
      appointmentId: event.id,
      patientId: session?.user.id ?? "",
      appointmentType: "in-person",
    },
  });

  const { mutate, isPending } = useBookAppointmentMutation();

  const onSubmit = (variables: BookAppointmentVariables) => {
    mutate(variables);
    onClose();
  };

  const isPast = isBefore(new Date(event.start), new Date());

  return (
    <Form {...form}>
      <form id="event-dialog-form" onSubmit={form.handleSubmit(onSubmit)}>
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("title")}</DialogTitle>
              <DialogDescription className="sr-only">
                {t("description")}
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <span className="text-sm font-medium">{t("date")}</span>
                <TypographyP className="!m-0 text-sm leading-normal font-normal">
                  {format(event.start, "PPp")}
                </TypographyP>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <span className="text-sm font-medium">{t("duration")}</span>
                <TypographyP className="!m-0 text-sm leading-normal font-normal">
                  {formatDuration(
                    intervalToDuration({
                      start: event.start,
                      end: event.end,
                    }),
                  )}
                </TypographyP>
              </div>
            </div>

            <FormField
              control={form.control}
              name="appointmentType"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-4">
                  <FormLabel>{t("appointment-method")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex"
                    >
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="in-person" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t("in-person")}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="virtual" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t("virtual")}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex-row sm:justify-between">
              <div className="flex flex-1 justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  {t("cancel-button")}
                </Button>
                {!isPast && (
                  <Button
                    type="submit"
                    form="event-dialog-form"
                    disabled={isPending}
                  >
                    {isPending && <LoaderIcon className="animate-spin" />}
                    {t("submit-button")}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
