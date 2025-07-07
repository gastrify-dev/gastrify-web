"use client";

import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { cn } from "@/shared/utils/cn";

import { useSignInForm } from "@/features/auth/hooks/use-sign-in-form";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, toggleSignInMethod, toggleSignInMethodButtonContent, t } =
    useSignInForm();

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
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={toggleSignInMethod}
            >
              {toggleSignInMethodButtonContent}
            </Button>
          </div>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              {t("continue-with")}
            </span>
          </div>

          {form}

          <div className="text-center text-sm">
            {t("sign-up-prompt")}{" "}
            <Link
              prefetch
              href="/sign-up"
              className="font-bold hover:underline hover:underline-offset-4"
            >
              {t("sign-up-link")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
