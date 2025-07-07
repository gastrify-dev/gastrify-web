"use client";

import Link from "next/link";
import { LoaderIcon, LockIcon, MailIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

import { useCredentialsForm } from "@/features/auth/hooks/use-credentials-form";

export function CredentialsForm() {
  const { form, onSubmit, isPending, t } = useCredentialsForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("email-label")}</FormLabel>

              <div className="relative">
                <FormControl>
                  <Input
                    className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                    type="email"
                    disabled={isPending}
                    placeholder={
                      fieldState.invalid ? undefined : t("email-placeholder")
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
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                {t("password-label")}
                <Link
                  prefetch
                  href="/forgot-password"
                  className="text-foreground text-xs underline-offset-4 hover:underline"
                >
                  {t("forgot-password-link")}
                </Link>
              </FormLabel>

              <div className="relative">
                <FormControl>
                  <Input
                    className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                    disabled={isPending}
                    type="password"
                    placeholder={
                      fieldState.invalid ? undefined : t("password-placeholder")
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
                  <LockIcon size={16} aria-hidden="true" />
                </div>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit">
          {isPending && <LoaderIcon className="animate-spin" />}
          {t("submit-button")}
        </Button>
      </form>
    </Form>
  );
}
