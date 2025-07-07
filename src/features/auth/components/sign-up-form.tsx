"use client";

import Link from "next/link";
import {
  IdCardIcon,
  LoaderIcon,
  LockIcon,
  MailIcon,
  User2Icon,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { cn } from "@/shared/utils/cn";

import { useSignUpForm } from "@/features/auth/hooks/use-sign-up-form";
import { PasswordStrengthIndicator } from "@/shared/components/password-strength-indicator";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending, t } = useSignUpForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-background border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <TypographyH1>{t("title")}</TypographyH1>
          </CardTitle>

          <CardDescription>
            <TypographyP className="leading-normal">
              {t("description")}
            </TypographyP>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* <div className="flex items-start gap-4"> */}
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t("full-name-label")}</FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                          disabled={isPending}
                          placeholder={
                            fieldState.invalid
                              ? undefined
                              : t("full-name-placeholder")
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
                name="identificationNumber"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t("identification-number-label")}</FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                          disabled={isPending}
                          placeholder={
                            fieldState.invalid
                              ? undefined
                              : t("identification-number-placeholder")
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
                        <IdCardIcon size={16} aria-hidden="true" />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* </div> */}

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
                            fieldState.invalid
                              ? undefined
                              : t("email-placeholder")
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
                    <FormLabel>{t("password-label")}</FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          className="peer aria-invalid:text-destructive-foreground ps-9 shadow-none not-aria-invalid:border-none"
                          disabled={isPending}
                          type="password"
                          placeholder={
                            fieldState.invalid
                              ? undefined
                              : t("password-placeholder")
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

                    {fieldState.isDirty && (
                      <PasswordStrengthIndicator password={field.value} />
                    )}
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <LoaderIcon className="animate-spin" />}
                {t("submit-button")}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            {t("sign-in-prompt")}{" "}
            <Link
              href="/sign-in"
              className="font-bold hover:underline hover:underline-offset-4"
            >
              {t("sign-in-link")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
