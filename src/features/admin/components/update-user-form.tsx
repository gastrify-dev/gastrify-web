"use client";

import { PaginationState } from "@tanstack/react-table";
import {
  LoaderIcon,
  MailIcon,
  SaveIcon,
  ShieldIcon,
  User2Icon,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { DrawerClose } from "@/shared/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { User } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

import { useUpdateUserForm } from "@/features/admin/hooks/use-update-user-form";

interface Props extends React.ComponentProps<"div"> {
  user: User;
  pagination: PaginationState;
}

export function UpdateUserForm({
  user,
  pagination,
  className,
  ...props
}: Props) {
  const { form, onSubmit, isPending, updateUserDrawerCloseRef } =
    useUpdateUserForm({
      user,
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
              name="userId"
              render={({ field }) => (
                <FormControl>
                  <input type="hidden" {...field} />
                </FormControl>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <div className="relative">
                    <FormControl>
                      <Input
                        className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                        disabled={isPending}
                        placeholder={
                          fieldState.invalid ? undefined : "David Aragundy"
                        }
                        {...field}
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
                      <User2Icon size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <div className="relative">
                    <FormControl>
                      <Input
                        className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                        type="email"
                        disabled={isPending}
                        placeholder={
                          fieldState.invalid ? undefined : "david@aragundy.com"
                        }
                        {...field}
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
                      <MailIcon size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>

                  <div className="relative">
                    <FormControl>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          className={cn(
                            "peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none",
                            fieldState.invalid && "aria-invalid:true",
                          )}
                        >
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <ShieldIcon size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <SaveIcon />
              )}
              Update User
            </Button>

            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                ref={updateUserDrawerCloseRef}
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
