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

export function Step1Form({ form }: any) {
  return (
    <Form {...form}>
      <form>
        <FormField
          name="age" // Aquí se enlaza con el nombre del campo
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="age">Edad</FormLabel>
              <FormControl>
                <Input
                  {...form.register("age", { required: "Edad es requerida" })} // Usamos `register` para conectar el campo con `React Hook Form`
                  id="age"
                  placeholder="Edad"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
