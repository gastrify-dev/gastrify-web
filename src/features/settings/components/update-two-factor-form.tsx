"use client";

import { LoaderIcon, RotateCcwIcon } from "lucide-react";

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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Switch } from "@/shared/components/ui/switch";
import { TypographyH4 } from "@/shared/components/ui/typography";

import { QRCodeDialog } from "@/features/settings/components/qr-code-dialog";
import { useUpdateTwoFactorForm } from "@/features/settings/hooks/use-update-two-factor-form";

export const UpdateTwoFactorForm = () => {
  const {
    form,
    onSubmit,
    isPending,
    isError,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
    totpURI,
    setTotpURI,
    backupCodes,
    setBackupCodes,
    dialogTriggerRef,
    t,
  } = useUpdateTwoFactorForm();

  return (
    <>
      <QRCodeDialog
        URI={totpURI}
        setTotpURI={setTotpURI}
        isOpen={!!totpURI}
        backupCodes={backupCodes}
        setBackupCodes={setBackupCodes}
        dialogTriggerRef={dialogTriggerRef}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <TypographyH4>{t("title")}</TypographyH4>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="enable2FA"
              render={({ field }) => (
                <FormItem className="flex w-fit flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t("label")}</FormLabel>
                    <FormDescription>{t("description")}</FormDescription>
                  </div>

                  {isSessionLoading && (
                    <Skeleton className="h-5 w-10 rounded-full" />
                  )}

                  {isSessionError && (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => refetchSession()}
                    >
                      {t("retry-button")}{" "}
                      {isSessionRefetching ? (
                        <LoaderIcon className="animate-spin" />
                      ) : (
                        <RotateCcwIcon />
                      )}
                    </Button>
                  )}

                  {isSessionSuccess && (
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  )}
                </FormItem>
              )}
            />
          </div>

          {form.formState.isDirty && (
            <FormField
              disabled={isPending}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="bg-destructive/10 flex w-fit flex-col items-start gap-4 rounded-lg p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("password-label")}
                    </FormLabel>

                    <FormDescription>
                      {t("password-description", {
                        action: form.getValues("enable2FA")
                          ? t("enable")
                          : t("disable"),
                      })}
                    </FormDescription>
                  </div>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("password-placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />

                  <Button
                    variant={isError ? "destructive" : "default"}
                    disabled={isPending}
                    type="submit"
                  >
                    {isPending && <LoaderIcon className="animate-spin" />}
                    {isError && <RotateCcwIcon />}
                    {t("submit-button", {
                      action: form.getValues("enable2FA")
                        ? t("enable")
                        : t("disable"),
                    })}
                  </Button>
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>
    </>
  );
};
