"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  IdCardIcon,
  LoaderIcon,
  RotateCcwIcon,
  TrashIcon,
} from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

import { getAppointment } from "@/features/appointments/actions/get-appointment";
import { EndHour, StartHour } from "@/features/appointments/constants";
import { updateAppointmentSchema } from "@/features/appointments/schemas/update-appointment";
import type {
  CalendarEvent,
  UpdateAppointmentVariables,
} from "@/features/appointments/types";
import { useUpdateAppointmentMutation } from "@/features/appointments/hooks/use-update-appointment-mutation";
import { formatTimeForInput } from "@/features/appointments/utils/format-time-for-input";
import { useDeleteAppointmentMutation } from "../hooks/use-delete-appointment-mutation";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface Props {
  event: CalendarEvent;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateEventDialog({ event, isOpen, onClose }: Props) {
  const t = useTranslations("features.appointments.update-event-dialog");

  const { data, isFetching } = useQuery({
    queryKey: ["appointment", "details", event.id],
    queryFn: async () => {
      const { data, error } = await getAppointment(event.id);

      if (error) return Promise.reject(error);

      return data;
    },
  });

  const form = useForm<UpdateAppointmentVariables>({
    resolver: zodResolver(updateAppointmentSchema),
    defaultValues: {
      id: event.id,
      start: event.start,
      end: event.end,
    },
    values: {
      id: event.id,
      start: data?.start ?? event.start,
      end: data?.end ?? event.end,
      status: data?.status ?? "available",
      patientIdentificationNumber: data?.patientIdentificationNumber ?? "",
      type: data?.type ?? "in-person",
    },
  });

  const timeOptions = useMemo(() => {
    const options = [];

    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const value = `${formattedHour}:${formattedMinute}`;
        // Use a fixed date to avoid unnecessary date object creations
        const date = new Date(2000, 0, 1, hour, minute);
        const label = format(date, "h:mm a");
        options.push({ value, label });
      }
    }
    return options;
  }, []);

  const { mutate, isPending } = useUpdateAppointmentMutation({ form });

  const onSubmit = (variables: UpdateAppointmentVariables) => {
    mutate(variables, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const {
    mutate: deleteAppointment,
    isPending: isDeleting,
    isError: isDeleteError,
  } = useDeleteAppointmentMutation();

  const onDelete = () => {
    deleteAppointment({
      appointmentId: event.id,
    });
    onClose();
  };

  return (
    <Form {...form}>
      <form id="event-dialog-form" onSubmit={form.handleSubmit(onSubmit)}>
        <Dialog modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("title")}</DialogTitle>

              <DialogDescription className="sr-only">
                {t("description")}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="start"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                      <FormItem className="flex flex-1 flex-col">
                        <FormLabel>{t("start-date-label")}</FormLabel>

                        <Popover>
                          <PopoverTrigger
                            disabled={isPending || isFetching}
                            asChild
                          >
                            <FormControl>
                              <Button
                                type="button"
                                variant={"outline"}
                                className={cn(
                                  "w-fit pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>{t("pick-date-placeholder")}</span>
                                )}

                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>

                      <div className="flex flex-1 flex-col gap-2">
                        <FormLabel>{t("start-time-label")}</FormLabel>

                        <Select
                          disabled={isPending || isFetching}
                          onValueChange={(value) => {
                            const [startHours = 0, startMinutes = 0] = value
                              .split(":")
                              .map(Number);

                            const updatedStartDate = new Date(field.value);
                            updatedStartDate.setHours(
                              startHours,
                              startMinutes,
                              0,
                            );

                            field.onChange(updatedStartDate);
                          }}
                          defaultValue={formatTimeForInput(event.start)}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue
                              placeholder={t("select-time-placeholder")}
                            />
                          </SelectTrigger>

                          <SelectContent>
                            {timeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="end"
                render={({ field, fieldState }) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                      <FormItem className="flex flex-1 flex-col">
                        <FormLabel>{t("end-date-label")}</FormLabel>

                        <Popover>
                          <PopoverTrigger
                            disabled={isPending || isFetching}
                            asChild
                          >
                            <FormControl>
                              <Button
                                type="button"
                                variant={"outline"}
                                className={cn(
                                  "w-fit pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>{t("pick-date-placeholder")}</span>
                                )}

                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                      </FormItem>

                      <div className="flex flex-1 flex-col gap-2">
                        <FormLabel>{t("end-time-label")}</FormLabel>

                        <Select
                          disabled={isPending || isFetching}
                          onValueChange={(value) => {
                            const [endHours = 0, endMinutes = 0] = value
                              .split(":")
                              .map(Number);

                            const updatedEndDate = new Date(field.value);
                            updatedEndDate.setHours(endHours, endMinutes, 0);

                            field.onChange(updatedEndDate);
                          }}
                          defaultValue={formatTimeForInput(event.end)}
                        >
                          <SelectTrigger aria-invalid={fieldState.invalid}>
                            <SelectValue
                              placeholder={t("select-time-placeholder")}
                            />
                          </SelectTrigger>

                          <SelectContent>
                            {timeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <FormMessage />
                  </div>
                )}
              />

              {!isFetching && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-4">
                      <FormLabel>{t("status-label")}</FormLabel>

                      <FormControl>
                        <RadioGroup
                          disabled={isPending || isFetching}
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex"
                        >
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <RadioGroupItem value="available" />
                            </FormControl>

                            <FormLabel className="font-normal">
                              {t("status-available")}
                            </FormLabel>
                          </FormItem>

                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <RadioGroupItem value="booked" />
                            </FormControl>

                            <FormLabel className="font-normal">
                              {t("status-booked")}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isFetching && (
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-8 w-[50%]" />
                  <Skeleton className="h-8 w-[80%]" />
                  <Skeleton className="h-8 w-[60%]" />
                </div>
              )}

              {form.watch("status") === "booked" && !isFetching && (
                <>
                  <FormField
                    control={form.control}
                    name="patientIdentificationNumber"
                    render={({ field, fieldState }) => (
                      <FormItem className="flex flex-col gap-4">
                        <FormLabel>
                          {t("patient-identification-number-label")}
                        </FormLabel>

                        <div className="relative">
                          <FormControl>
                            <Input
                              disabled={isPending || isFetching}
                              maxLength={10}
                              minLength={10}
                              className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                              placeholder={
                                fieldState.invalid ? undefined : "1234567890"
                              }
                              {...field}
                            />
                          </FormControl>

                          <div
                            className={cn(
                              "text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50",
                              fieldState.invalid &&
                                "text-destructive-foreground",
                              fieldState.isDirty &&
                                !fieldState.invalid &&
                                "text-foreground",
                            )}
                          >
                            <IdCardIcon size={16} aria-hidden="true" />
                          </div>
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-4">
                        <FormLabel>{t("type-label")}</FormLabel>

                        <FormControl>
                          <RadioGroup
                            disabled={isPending || isFetching}
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex"
                          >
                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="in-person" />
                              </FormControl>

                              <FormLabel className="font-normal">
                                {t("type-in-person")}
                              </FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="virtual" />
                              </FormControl>

                              <FormLabel className="font-normal">
                                {t("type-virtual")}
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <DialogFooter className="flex-row sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={isDeleting || isFetching}
              >
                {isDeleting && <LoaderIcon className="animate-spin" />}
                {isDeleteError && <RotateCcwIcon />}
                <TrashIcon />
              </Button>

              <div className="flex flex-1 justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  {t("cancel-button")}
                </Button>

                <Button
                  type="submit"
                  form="event-dialog-form"
                  disabled={isPending || isFetching}
                >
                  {isPending && <LoaderIcon className="animate-spin" />}
                  {t("submit-button")}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
