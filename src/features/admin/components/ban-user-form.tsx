"use client";

import { PaginationState } from "@tanstack/react-table";
import {
  CalendarIcon,
  LoaderIcon,
  MessageSquareIcon,
  UserXIcon,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/utils/cn";

import { useBanUserForm } from "@/features/admin/hooks/use-ban-user-form";
import { DrawerClose } from "@/shared/components/ui/drawer";

interface BanUserFormProps extends React.ComponentProps<"div"> {
  userId: string;
  pagination: PaginationState;
}

export function BanUserForm({
  userId,
  pagination,
  className,
  ...props
}: BanUserFormProps) {
  const { form, onSubmit, isPending, banUserDrawerCloseRef } = useBanUserForm({
    userId,
    pagination,
  });

  return (
    <div
      className={cn("flex h-full w-full flex-col gap-6", className)}
      {...props}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-col justify-between"
        >
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="banReason"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Ban Reason</FormLabel>

                  <div className="relative flex">
                    <FormControl>
                      <Textarea
                        className="peer aria-invalid:text-destructive-foreground w-1 flex-1 ps-9 shadow-none not-aria-invalid:border-none"
                        disabled={isPending}
                        placeholder={
                          fieldState.invalid
                            ? undefined
                            : "Enter the reason for banning this user..."
                        }
                        {...field}
                      />
                    </FormControl>

                    <div
                      className={cn(
                        "text-muted-foreground/80 pointer-events-none absolute start-0 top-3 flex items-center justify-center ps-3 peer-disabled:opacity-50",
                        fieldState.invalid && "text-destructive-foreground",
                        fieldState.isDirty &&
                          !fieldState.invalid &&
                          "text-foreground",
                      )}
                    >
                      <MessageSquareIcon size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="banExpiresIn"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Ban Duration (seconds)</FormLabel>

                  <FormDescription>
                    Leave empty for permanent ban
                  </FormDescription>

                  <div className="relative w-full">
                    <FormControl>
                      <Input
                        className="peer aria-invalid:text-destructive-foreground w-full ps-9 shadow-none not-aria-invalid:border-none"
                        type="number"
                        min="1"
                        disabled={isPending}
                        placeholder={fieldState.invalid ? undefined : "60"}
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
                        value={field.value || ""}
                      />
                    </FormControl>

                    <div
                      className={cn(
                        "text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50",
                        fieldState.invalid && "text-destructive-foreground",
                        fieldState.isDirty &&
                          !fieldState.invalid &&
                          "text-foreground",
                      )}
                    >
                      <CalendarIcon size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              disabled={isPending}
              type="submit"
              variant="destructive"
              className="w-full"
            >
              {isPending ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <UserXIcon />
              )}
              Ban User
            </Button>

            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                ref={banUserDrawerCloseRef}
              >
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </form>
      </Form>
    </div>
  );
}
