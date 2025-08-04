import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { usePersonalInfoForm } from "@/features/healthProfile/hooks/use-personal-info-form";
import { useStepperContext } from "@/features/healthProfile/context/stepper-context";

interface Props {
  userId: string;
}

export function PersonalInfoForm({ userId }: Props) {
  const { form, onSubmit, hasChildren, isLoading, isPending } =
    usePersonalInfoForm({ patientId: userId });

  const { step, prevStep, totalSteps } = useStepperContext();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative flex items-center gap-4">
          <Button
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full p-0 shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            onClick={prevStep}
            disabled={step === 1 || isLoading || isPending}
            aria-label="Previous Step"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Button>

          <ScrollArea className="h-[550px] w-full rounded-md border p-6">
            <div className="flex flex-col gap-6 p-1">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your age"
                        value={field.value}
                        onChange={(event) =>
                          event.target.value
                            ? field.onChange(Number(event.target.value))
                            : field.onChange("")
                        }
                        min={0}
                        max={120}
                        disabled={isLoading || isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading || isPending}
                    >
                      <FormControl>
                        <SelectTrigger className="min-w-[150px]">
                          <SelectValue placeholder="Select a marital state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Marital State</SelectLabel>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="separated">Separated</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasChildren"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="">
                      <FormLabel>Do you have any children?</FormLabel>
                    </div>
                    <div className="flex flex-row items-center gap-4">
                      <p className="text-sm">No</p>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(bool) => {
                            field.onChange(bool);
                          }}
                          disabled={isLoading || isPending}
                        />
                      </FormControl>
                      <p className="text-sm">Yes</p>
                    </div>
                  </FormItem>
                )}
              />

              {hasChildren && (
                <div className="flex flex-col items-start gap-4 md:flex-row md:gap-6">
                  <FormField
                    control={form.control}
                    name="numMale"
                    render={({ field }) => (
                      <FormItem className="flex-1/2">
                        <FormLabel>Number of sons</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter number of sons"
                            value={field.value}
                            onChange={(event) =>
                              event.target.value
                                ? field.onChange(Number(event.target.value))
                                : field.onChange("")
                            }
                            min={0}
                            disabled={isLoading || isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numFemale"
                    render={({ field }) => (
                      <FormItem className="flex-1/2">
                        <FormLabel>Number of daughters</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter number of daughters"
                            value={field.value}
                            onChange={(event) =>
                              event.target.value
                                ? field.onChange(Number(event.target.value))
                                : field.onChange("")
                            }
                            min={0}
                            disabled={isLoading || isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex flex-col items-start gap-4 md:flex-row md:gap-6">
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem className="flex-1/2">
                      <FormLabel>Profession</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your profession"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading || isPending}
                        />
                      </FormControl>
                      <FormDescription>What do you?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem className="flex-1/2">
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your occupation"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading || isPending}
                        />
                      </FormControl>
                      <FormDescription>Your work occupation</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col items-start gap-4 md:flex-row md:gap-6">
                <FormField
                  control={form.control}
                  name="cSections"
                  render={({ field }) => (
                    <FormItem className="">
                      <div className="">
                        <FormLabel>
                          Have you had any Cesarean Sections?
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
                  name="abortions"
                  render={({ field }) => (
                    <FormItem className="">
                      <div className="">
                        <FormLabel>Have you had any abortions?</FormLabel>
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
              </div>

              <div className="flex flex-col items-start gap-4 md:flex-row md:gap-6">
                <FormField
                  control={form.control}
                  name="placeOfResidence"
                  render={({ field }) => (
                    <FormItem className="flex-1/2">
                      <FormLabel>Place of residence</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your place of residence"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading || isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1/2">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter the city you live in"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading || isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col items-start gap-4 lg:flex-row lg:gap-6">
                <FormField
                  control={form.control}
                  name="homePhoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1/3">
                      <FormLabel>Home phone number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your home phone number"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading || isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="celularPhoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1/3">
                      <FormLabel>Celular phone number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your celular phone number"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading || isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workPhoneNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1/3">
                      <FormLabel>Work phone number</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your work phone number"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading || isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
