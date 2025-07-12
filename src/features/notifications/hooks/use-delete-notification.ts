import { useMutation, useQueryClient } from "@tanstack/react-query";

type Notification = {
  id: string;
  [key: string]: unknown;
};

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      queryClient.setQueryData(
        ["notifications"],
        (old: Notification[] | undefined) => {
          if (!old) return old;
          return old.filter(
            (notification: Notification) => notification.id !== id,
          );
        },
      );
      queryClient.setQueryData(
        ["notifications", "unread-count"],
        (old: number | undefined) => {
          if (typeof old === "number") return Math.max(0, old - 1);
          return old;
        },
      );
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error deleting notification");
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
