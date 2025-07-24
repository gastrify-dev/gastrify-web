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

import { useMedicalInfoForm } from "../hooks/use-medical-info-form";

export function MedicalInfoForm() {
  const { form, onSubmit } = useMedicalInfoForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      className="flex flex-col md:flex-row"
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
                      className="flex flex-col md:flex-row"
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
            name="allergies"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Do you have any allergies?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} className="">
                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel>Yes</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center gap-3">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel>No</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  />
                </FormControl>
                <FormDescription>
                  Describe all your allergies and if you consume any medicine
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="religion"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Religious Creed</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} className="">
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="cristiano evangelico" />
                        </FormControl>
                        <FormLabel>Evangelical Christian</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="catolico" />
                        </FormControl>
                        <FormLabel>Catholic</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="otro" />
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
                <FormItem className="space-y-3">
                  <FormLabel>
                    In case you need a blood transfusion or its derivatives,
                    your creed allows it?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} className="">
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel>Yes</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel>No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* </div> */}

            {/* <div className="flex flex-col gap-4 md:flex-row md:gap-6"> */}
            <FormField
              control={form.control}
              name="alcohol"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Alcohol</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} className="">
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel>Yes</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel>No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="drugs"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Drugs</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} className="">
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel>Yes</FormLabel>
                      </FormItem>

                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel>No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
