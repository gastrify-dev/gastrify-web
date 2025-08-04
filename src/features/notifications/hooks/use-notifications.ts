import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "@/features/notifications/actions/get-notifications";

export function useNotifications() {
  return useQuery({
    queryKey: ["notification", "list"],
    queryFn: async () => {
      const { data, error } = await getNotifications();

      if (error) return Promise.reject(error);

      return data;
    },
  });
}
