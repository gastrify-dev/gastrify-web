"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { updateNotificationsSchema } from "@/features/settings/schemas/update-notifications";
import type { UpdateNotificationsVariables } from "@/features/settings/types";

// This can come from your database or API.
const defaultValues: Partial<UpdateNotificationsVariables> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
};

export const useNotificationsForm = () => {
  const form = useForm<UpdateNotificationsVariables>({
    resolver: zodResolver(updateNotificationsSchema),
    defaultValues,
  });

  function onSubmit(data: UpdateNotificationsVariables) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return { form, onSubmit };
};
