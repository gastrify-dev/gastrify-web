import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { TypographyH2, TypographyH3 } from "@/shared/components/ui/typography";

import { useMedicalInfoForm } from "@/features/healthProfile/hooks/use-medical-info-form";
import { useStepperContext } from "@/features/healthProfile/context/stepper-context";

interface Props {
  userId: string;
}

export function MedicalInfoForm({ userId }: Props) {
  const { step, totalSteps, prevStep } = useStepperContext();

  const {
    form,
    onSubmit,
    hasAllergies,
    hasChronicIllness,
    hasHealthInsurance,
    isLoading,
    isPending,
    t,
  } = useMedicalInfoForm({ patientId: userId });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative flex items-center gap-4">
          <Button
            type="button"
            className="hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full p-0 shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 lg:flex"
            onClick={prevStep}
            disabled={step === 1 || isLoading || isPending}
            aria-label="Previous Step"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Button>

          <ScrollArea className="h-[calc(100vh-18rem)] max-h-full w-full rounded-md border p-6">
            <TypographyH2 className="mb-4">{t("title")}</TypographyH2>

            <div className="space-y-8">
              <div className="space-y-6 rounded-md border p-3 md:p-6">
                <TypographyH3>{t("blood-group-title")}</TypographyH3>
                <div className="grid items-start gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="bloodType"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>{t("abo-type-label")}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            className="flex flex-col md:flex-row md:gap-6"
                            disabled={isLoading || isPending}
                          >
                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="O" />
                              </FormControl>
                              <FormLabel>O</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="A" />
                              </FormControl>
                              <FormLabel>A</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="B" />
                              </FormControl>
                              <FormLabel>B</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="AB" />
                              </FormControl>
                              <FormLabel>AB</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rhFactor"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Rh factor</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            className="flex flex-row gap-6"
                            disabled={isLoading || isPending}
                          >
                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="+" />
                              </FormControl>
                              <FormLabel>+</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="-" />
                              </FormControl>
                              <FormLabel>-</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6 rounded-md border p-3 md:p-6">
                <TypographyH3>{t("beliefs-title")}</TypographyH3>
                <div className="grid items-start gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="religion"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>{t("religious-creed-label")}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            disabled={isLoading || isPending}
                          >
                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="evangelical christian" />
                              </FormControl>
                              <FormLabel>{t("religion-evangelical")}</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="catholic" />
                              </FormControl>
                              <FormLabel>{t("religion-catholic")}</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel>{t("religion-other")}</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowsTransfusions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block">
                          {t("allows-transfusions-label")}
                        </FormLabel>
                        <div className="mt-2 flex flex-row items-center gap-4">
                          <p className="text-sm">{t("no")}</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p className="text-sm">{t("yes")}</p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6 rounded-md border p-3 md:p-6">
                <TypographyH3>{t("allergies-title")}</TypographyH3>
                <div className="mt-4 space-y-6">
                  <FormField
                    control={form.control}
                    name="hasAllergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block">
                          {t("has-allergies-label")}
                        </FormLabel>
                        <div className="mt-2 flex flex-row items-center gap-4">
                          <p className="text-sm">{t("no")}</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p className="text-sm">{t("yes")}</p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {hasAllergies && (
                    <FormField
                      control={form.control}
                      name="allergyDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("allergy-details-label")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("allergy-details-placeholder")}
                              className="resize-none"
                              {...field}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <FormDescription>
                            {t("allergy-details-description")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-6 rounded-md border p-2 md:p-6">
                <TypographyH3>{t("lifestyle-title")}</TypographyH3>
                <div className="mt-4 grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="alcohol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block">
                          {t("alcohol-label")}
                        </FormLabel>
                        <div className="mt-2 flex flex-row items-center gap-4">
                          <p className="text-sm">{t("no")}</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p className="text-sm">{t("yes")}</p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="drugs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block">
                          {t("drugs-label")}
                        </FormLabel>
                        <div className="mt-2 flex flex-row items-center gap-4">
                          <p className="text-sm">{t("no")}</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p className="text-sm">{t("yes")}</p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6 rounded-md border p-2 md:p-6">
                <TypographyH3>{t("chronic-conditions-title")}</TypographyH3>
                <div className="mt-4 space-y-6">
                  <FormField
                    control={form.control}
                    name="hasChronicIllness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block">
                          {t("has-chronic-illness-label")}
                        </FormLabel>
                        <div className="mt-2 flex flex-row items-center gap-4">
                          <p className="text-sm">{t("no")}</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p className="text-sm">{t("yes")}</p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {hasChronicIllness && (
                    <FormField
                      control={form.control}
                      name="chronicIllnessDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("chronic-illness-details-label")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t(
                                "chronic-illness-details-placeholder",
                              )}
                              className="resize-none"
                              {...field}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <FormDescription>
                            {t("chronic-illness-details-description")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-6 rounded-md border p-2 md:p-6">
                <TypographyH3>{t("health-insurance-title")}</TypographyH3>
                <div className="mt-4 space-y-6">
                  <FormField
                    control={form.control}
                    name="hasHealthInsurance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block">
                          {t("has-health-insurance-label")}
                        </FormLabel>
                        <div className="mt-2 flex flex-row items-center gap-4">
                          <p className="text-sm">{t("no")}</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p className="text-sm">{t("yes")}</p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {hasHealthInsurance && (
                    <FormField
                      control={form.control}
                      name="healthInsuranceProvider"
                      render={({ field }) => (
                        <FormItem className="md:max-w-md">
                          <FormLabel>
                            {t("health-insurance-provider-label")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder={t(
                                "health-insurance-provider-placeholder",
                              )}
                              value={field.value || ""}
                              onChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" value={field.value || userId} />
                  </FormControl>
                </FormItem>
              )}
            />
          </ScrollArea>

          <Button
            type="submit"
            className="hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full p-0 shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 lg:flex"
            disabled={step === totalSteps || isLoading || isPending}
            aria-label="Next Step"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex items-center justify-between lg:hidden">
          <Button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full p-0 shadow-lg"
            onClick={prevStep}
            disabled={step === 1 || isLoading || isPending}
            aria-label="Previous Step"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Button>

          <Button
            type="submit"
            className="flex h-12 w-12 items-center justify-center rounded-full p-0 shadow-lg"
            disabled={step === totalSteps || isLoading || isPending}
            aria-label="Next Step"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
