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
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { useMedicalInfoForm } from "@/features/healthProfile/hooks/use-medical-info-form";
import { useStepperContext } from "@/features/healthProfile/context/stepper-context";
import { TypographyH2, TypographyH3 } from "@/shared/components/ui/typography";

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

          <ScrollArea className="h-[550px] w-full rounded-md border p-6">
            <TypographyH2 className="mb-4">Medical Information</TypographyH2>

            <div className="space-y-8">
              <div className="space-y-6 rounded-md border p-3 md:p-6">
                <TypographyH3>Blood Group</TypographyH3>
                <div className="grid items-start gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="bloodType"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>ABO type</FormLabel>
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
                <TypographyH3>Beliefs & transfusions</TypographyH3>
                <div className="grid items-start gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="religion"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Religious creed</FormLabel>
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
                              <FormLabel>Evangelical Christian</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="catholic" />
                              </FormControl>
                              <FormLabel>Catholic</FormLabel>
                            </FormItem>

                            <FormItem className="flex items-center gap-3">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel>Other</FormLabel>
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
                          If a blood transfusion is needed, does your creed
                          allow it?
                        </FormLabel>
                        <div className="mt-2 flex flex-row items-center gap-4">
                          <p className="text-sm">No</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p className="text-sm">Yes</p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6 rounded-md border p-3 md:p-6">
                <TypographyH3>Allergies</TypographyH3>
                <div className="mt-4 space-y-6">
                  <FormField
                    control={form.control}
                    name="hasAllergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block">
                          Do you have any allergies?
                        </FormLabel>
                        <div className="mt-2 flex flex-row items-center gap-4">
                          <p className="text-sm">No</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p className="text-sm">Yes</p>
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
                          <FormLabel>Allergy details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your allergies and any medication you take..."
                              className="resize-none"
                              {...field}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <FormDescription>
                            Include triggers, severity, and current treatments
                            if any.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-6 rounded-md border p-2 md:p-6">
                <TypographyH3>Lifestyle</TypographyH3>
                <div className="mt-4 grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="alcohol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block">Alcohol</FormLabel>
                        <div className="mt-2 flex flex-row items-center gap-4">
                          <p className="text-sm">No</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p className="text-sm">Yes</p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="drugs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block">Drugs</FormLabel>
                        <div className="mt-2 flex flex-row items-center gap-4">
                          <p className="text-sm">No</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p className="text-sm">Yes</p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6 rounded-md border p-2 md:p-6">
                <TypographyH3>Chronic Conditions</TypographyH3>
                <div className="mt-4 space-y-6">
                  <FormField
                    control={form.control}
                    name="hasChronicIllness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block">
                          Do you have any chronic illnesses?
                        </FormLabel>
                        <div className="mt-2 flex flex-row items-center gap-4">
                          <p className="text-sm">No</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p className="text-sm">Yes</p>
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
                          <FormLabel>Chronic illness details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List your conditions and current medications..."
                              className="resize-none"
                              {...field}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <FormDescription>
                            Include diagnosis names, dates, and treatments if
                            possible.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-6 rounded-md border p-2 md:p-6">
                <TypographyH3>Health Insurance</TypographyH3>
                <div className="mt-4 space-y-6">
                  <FormField
                    control={form.control}
                    name="hasHealthInsurance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block">
                          Do you have health insurance?
                        </FormLabel>
                        <div className="mt-2 flex flex-row items-center gap-4">
                          <p className="text-sm">No</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p className="text-sm">Yes</p>
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
                          <FormLabel>Health insurance provider</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your health insurance provider"
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
