import { useMutation, useQueryClient } from "@tanstack/react-query";

type Notification = {
  id: string;
  read: boolean;
  [key: string]: unknown;
};

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      queryClient.setQueryData(
        ["notifications"],
        (old: Notification[] | undefined) => {
          if (!old) return old;
          return old.map((notification: Notification) =>
            notification.id === id ? { ...notification, read } : notification,
          );
        },
      );
      queryClient.setQueryData(
        ["notifications", "unread-count"],
        (old: number | undefined) => {
          if (typeof old === "number" && read) return Math.max(0, old - 1);
          return old;
        },
      );
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      if (!res.ok) throw new Error("Error updating notification");
      return res.json();
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
}
