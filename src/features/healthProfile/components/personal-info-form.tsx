import { useForm, FormProvider } from "react-hook-form";

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
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { usePersonalInfoForm } from "../hooks/use-personal-info-form";
import { Button } from "@/shared/components/ui/button";

export function PersonalInfoForm() {
  const { form, onSubmit } = usePersonalInfoForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Age"
                    value={field.value}
                    onChange={field.onChange}
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
                  defaultValue={field.value}
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
              <FormItem className="space-y-3">
                <FormLabel>Do you have any children?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} className="">
                    <FormItem className="flex flex-row items-center gap-3">
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

          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
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
                      onChange={field.onChange}
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
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem className="flex-1/2">
                  <FormLabel>Profession</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your profession"
                      value={field.value}
                      onChange={field.onChange}
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
                      type="number"
                      placeholder="Enter your occupation"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>Your work occupation</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cSections"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Have you had any cesarean section?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} className="">
                    <FormItem className="flex flex-row items-center gap-3">
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
            name="hasChildren"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Do you have any children?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} className="">
                    <FormItem className="flex flex-row items-center gap-3">
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

          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
