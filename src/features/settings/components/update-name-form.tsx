"use client";

import { CheckIcon, LoaderIcon, RotateCcwIcon } from "lucide-react";

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

import { useUpdateNameForm } from "@/features/settings/hooks/use-update-name-form";

export function UpdateNameForm() {
  const {
    form,
    canSubmit,
    onSubmit,
    isPending,
    isError,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
    t,
  } = useUpdateNameForm();

  return (
    <Form {...form}>
      <form
        onKeyDown={(event) => {
          if (event.key === "Enter" && !canSubmit) event.preventDefault();
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          disabled={isPending}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-wrap items-center justify-start gap-2">
                <FormLabel>{t("label")}</FormLabel>

                {isSessionLoading && <Skeleton className="h-8 w-[200px]" />}

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
                  <FormControl className="flex-1 sm:w-fit sm:flex-none">
                    <Input placeholder={t("placeholder")} {...field} />
                  </FormControl>
                )}

                {canSubmit && (
                  <Button
                    variant={isError ? "destructive" : "ghost"}
                    className="rounded-full"
                    size="icon"
                    disabled={isPending}
                    type="submit"
                  >
                    {isPending && <LoaderIcon className="animate-spin" />}
                    {isError && <RotateCcwIcon />}
                    {!isPending && !isError && <CheckIcon />}
                  </Button>
                )}
              </div>

              <FormDescription className="text-muted-foreground text-sm">
                {t("description")}
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
