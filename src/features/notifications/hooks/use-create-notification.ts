import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateNotificationInput } from "@/features/notifications/actions/create-notification";
import type { Notification } from "@/features/notifications/types";

export function useCreateNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateNotificationInput) => {
      const res = await fetch("/actions/notifications/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Error creating notification");
      const result = await res.json();
      await queryClient.invalidateQueries({
        queryKey: ["notifications", input.userId, input.locale ?? "es"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count", input.userId],
      });
      window.dispatchEvent(new Event("notification-created"));
      return result;
    },
    onMutate: async (input: CreateNotificationInput) => {
      const previousNotifications = queryClient.getQueryData<Notification[]>([
        "notifications",
        input.userId,
        input.locale ?? "es",
      ]);
      const newNotification = {
        ...input,
        id: Math.random().toString(36).slice(2), // id temporal
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      };
      queryClient.setQueryData(
        ["notifications", input.userId, input.locale ?? "es"],
        (old: Notification[] = []) => [newNotification, ...old],
      );
      queryClient.setQueryData(
        ["notifications", "unread-count", input.userId],
        (old: number = 0) => old + 1,
      );
      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications && variables?.userId) {
        queryClient.setQueryData(
          ["notifications", variables.userId, variables.locale ?? "es"],
          context.previousNotifications,
        );
      }
      if (variables?.userId) {
        queryClient.invalidateQueries({
          queryKey: [
            "notifications",
            variables.userId,
            variables.locale ?? "es",
          ],
        });
        queryClient.invalidateQueries({
          queryKey: ["notifications", "unread-count", variables.userId],
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
}
