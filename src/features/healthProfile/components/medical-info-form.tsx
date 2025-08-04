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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative flex items-center gap-4">
          <Button
            type="button"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full p-0 shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            onClick={prevStep}
            disabled={step === 1 || isLoading || isPending}
            aria-label="Previous Step"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Button>

          <ScrollArea className="h-[550px] w-full rounded-md border p-6">
            <div className="flex flex-col gap-6 p-1">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Choose your blood type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value || ""}
                          className="flex flex-col md:flex-row"
                          disabled={isLoading || isPending}
                        >
                          <FormItem className="flex flex-row items-center gap-3">
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
                              <RadioGroupItem value="AB" />
                            </FormControl>
                            <FormLabel>AB</FormLabel>
                          </FormItem>

                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <RadioGroupItem value="B" />
                            </FormControl>
                            <FormLabel>B</FormLabel>
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
                    <FormItem className="space-y-3">
                      <FormLabel>Choose your rhFactor</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value || ""}
                          className="flex flex-col md:flex-row"
                          disabled={isLoading || isPending}
                        >
                          <FormItem className="flex flex-row items-center gap-3">
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

              <FormField
                control={form.control}
                name="hasAllergies"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="">
                      <FormLabel>Do you have any allergies?</FormLabel>
                    </div>
                    <div className="flex flex-row items-center gap-4">
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
                      <FormLabel>Allergy Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your allergies..."
                          className="resize-none"
                          {...field}
                          disabled={isLoading || isPending}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe all your allergies and if you consume any
                        medicine
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Religious Creed</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
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
                  <FormItem className="">
                    <div className="">
                      <FormLabel>
                        In case you need a blood transfusion or its derivatives,
                        your creed allows it?
                      </FormLabel>
                    </div>
                    <div className="flex flex-row items-center gap-4">
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
                name="alcohol"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="">
                      <FormLabel>Alcohol</FormLabel>
                    </div>
                    <div className="flex flex-row items-center gap-4">
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
                  <FormItem className="">
                    <div className="">
                      <FormLabel>Drugs</FormLabel>
                    </div>
                    <div className="flex flex-row items-center gap-4">
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
                name="hasChronicIllness"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="">
                      <FormLabel>Do you have any chronic illnesses?</FormLabel>
                    </div>
                    <div className="flex flex-row items-center gap-4">
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
                      <FormLabel>Allergy Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your allergies..."
                          className="resize-none"
                          {...field}
                          disabled={isLoading || isPending}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe all the illnesses and medication you are
                        currently taking
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="hasHealthInsurance"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="">
                      <FormLabel>Do you have health insurance?</FormLabel>
                    </div>
                    <div className="flex flex-row items-center gap-4">
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
                    <FormItem className="flex-1/2">
                      <FormLabel>Health insurance provider</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your health insurance provider"
                          value={field.value}
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
          </ScrollArea>
          <Button
            type="submit"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full p-0 shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
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
