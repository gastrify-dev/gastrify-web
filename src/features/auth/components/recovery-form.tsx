"use client";

import Link from "next/link";
import { LoaderIcon } from "lucide-react";

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
  FormMessage,
} from "@/shared/components/ui/form";
import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

import { useRecoveryForm } from "@/features/auth/hooks/use-recovery-form";

export function RecoveryForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending, t } = useRecoveryForm();

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
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder={t("code-placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
            <Link href="/sign-in" className="underline underline-offset-4">
              {t("sign-in-link")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
