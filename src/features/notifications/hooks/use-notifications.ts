import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "../actions/get-notifications";
import type {
  Notification,
  NotificationErrorCode,
} from "../types/notification";
import { GetNotificationsVariables } from "../schemas/get-notifications";

export function useNotifications(variables: GetNotificationsVariables) {
  return useQuery<{
    data: Notification[];
    error: NotificationErrorCode | null;
  }>({
    queryKey: ["notifications", variables],
    queryFn: async ({ queryKey }) => {
      const [, vars] = queryKey as [string, GetNotificationsVariables];
      const result = await getNotifications(vars);
      return {
        data: result.data ?? [],
        error: result.error?.code ?? null,
      };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchInterval: 5000,
  });
}
