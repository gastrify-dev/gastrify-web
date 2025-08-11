import {
  Form,
  FormControl,
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
import { TypographyH2, TypographyH3 } from "@/shared/components/ui/typography";

import { usePersonalInfoForm } from "@/features/healthProfile/hooks/use-personal-info-form";
import { useStepperContext } from "@/features/healthProfile/context/stepper-context";

interface Props {
  userId: string;
}

export function PersonalInfoForm({ userId }: Props) {
  const { form, onSubmit, hasChildren, isLoading, isPending, t } =
    usePersonalInfoForm({ patientId: userId });

  const { step, prevStep, totalSteps } = useStepperContext();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative flex items-center gap-4">
          <Button
            className="hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full p-0 shadow-lg lg:flex"
            onClick={prevStep}
            disabled={step === 1 || isLoading || isPending}
            aria-label="Previous Step"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Button>

          <ScrollArea className="h-[calc(100vh-18rem)] max-h-full w-full rounded-md border p-6">
            <div className="space-y-8">
              <TypographyH2>{t("title")}</TypographyH2>
              <div className="space-y-6 rounded-md border p-2 md:p-6">
                <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("age-label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t("age-placeholder")}
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
                        <FormLabel>{t("marital-status-label")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isLoading || isPending}
                        >
                          <FormControl>
                            <SelectTrigger className="min-w-[150px]">
                              <SelectValue
                                placeholder={t("marital-status-placeholder")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>
                                {t("marital-status-label")}
                              </SelectLabel>
                              <SelectItem value="single">
                                {t("marital-status-single")}
                              </SelectItem>
                              <SelectItem value="married">
                                {t("marital-status-married")}
                              </SelectItem>
                              <SelectItem value="separated">
                                {t("marital-status-separated")}
                              </SelectItem>
                              <SelectItem value="divorced">
                                {t("marital-status-divorced")}
                              </SelectItem>
                              <SelectItem value="widowed">
                                {t("marital-status-widowed")}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="homeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("home-address-label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("home-address-placeholder")}
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
                      <FormItem>
                        <FormLabel>{t("city-label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("city-placeholder")}
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
                    name="cSections"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("c-sections-label")}</FormLabel>
                        <div className="flex items-center gap-4">
                          <p>{t("no")}</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(bool) => {
                                field.onChange(bool);
                              }}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p>{t("yes")}</p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="abortions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("abortions-label")}</FormLabel>
                        <div className="flex items-center gap-4">
                          <p>{t("no")}</p>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(bool) => {
                                field.onChange(bool);
                              }}
                              disabled={isLoading || isPending}
                            />
                          </FormControl>
                          <p>{t("yes")}</p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6 rounded-md border p-2 md:p-6">
                <TypographyH3>{t("professional-info-title")}</TypographyH3>
                <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("profession-label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("profession-placeholder")}
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
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("occupation-label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("occupation-placeholder")}
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

              <div className="space-y-6 rounded-md border p-2 md:p-6">
                <TypographyH3>{t("children-info-title")}</TypographyH3>
                <FormField
                  control={form.control}
                  name="hasChildren"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("has-children-label")}</FormLabel>
                      <div className="flex items-center gap-4">
                        <p>{t("no")}</p>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(bool) => {
                              field.onChange(bool);
                            }}
                            disabled={isLoading || isPending}
                          />
                        </FormControl>
                        <p>{t("yes")}</p>
                      </div>
                    </FormItem>
                  )}
                />

                {hasChildren && (
                  <div className="flex flex-col items-start gap-4 lg:flex-row lg:gap-6">
                    <FormField
                      control={form.control}
                      name="numMale"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t("num-sons-label")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={t("num-sons-placeholder")}
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
                        <FormItem className="flex-1">
                          <FormLabel>{t("num-daughters-label")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={t("num-daughters-placeholder")}
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
              </div>

              <div className="space-y-6 rounded-md border p-2 md:p-6">
                <TypographyH3>{t("contact-info-title")}</TypographyH3>
                <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="homePhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("home-phone-label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("home-phone-placeholder")}
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
                    name="mobilePhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("mobile-phone-label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("mobile-phone-placeholder")}
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
                      <FormItem>
                        <FormLabel>{t("work-phone-label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("work-phone-placeholder")}
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
            className="hidden h-12 w-12 cursor-pointer items-center justify-center rounded-full p-0 shadow-lg lg:flex"
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
