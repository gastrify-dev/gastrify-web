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
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { ArrowLeftIcon, ArrowRightIcon, CheckCheckIcon } from "lucide-react";

import { useEmergencyContactsForm } from "@/features/healthProfile/hooks/use-emergency-contacts-form";

export function EmergencyContactsForm() {
  const {
    form,
    fields,
    appendContact,
    removeContact,
    onSubmit,
    contactsCount,
  } = useEmergencyContactsForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative flex items-center gap-4">
          <Button
            className="flex h-12 w-12 items-center justify-center rounded-full p-0 shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            // onClick={previousStep}
            // disabled={step === 1}
            aria-label="Previous Step"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Button>

          <ScrollArea className="h-[550px] w-full rounded-md border p-6">
            <div className="flex flex-col gap-6 p-1">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="mb-2 space-y-4 rounded-md border p-4"
                >
                  <FormField
                    control={form.control}
                    name={`contacts.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter the contact's name"
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
                    name={`contacts.${index}.relationship`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col items-start gap-4 lg:flex-row lg:gap-6">
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.homePhoneNumber`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Home phone number</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter the contact's home phone number"
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
                      name={`contacts.${index}.celularPhoneNumber`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Celular phone number</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter the contact's celular phone number"
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
                      name={`contacts.${index}.workPhoneNumber`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Work phone number</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter the contact's work phone number"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`contacts.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter the contact's email"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {contactsCount > 1 && (
                    <Button
                      className="cursor-pointer"
                      type="button"
                      onClick={() => removeContact(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              <Button
                className="cursor-pointer"
                type="button"
                onClick={appendContact}
              >
                Add Contact
              </Button>
            </div>
          </ScrollArea>
          <Button
            className="flex h-12 w-12 items-center justify-center rounded-full p-0 shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            // onClick={nextStep}
            // disabled={step === steps.length}
            aria-label="Next Step"
          >
            <CheckCheckIcon className="h-6 w-6" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
