import { useMutation } from "@tanstack/react-query";

import { updateNotificationStatus } from "../actions/update-notification";
//import type { NotificationErrorCode } from "../types/notification";

export function useUpdateNotificationMutation() {
  return useMutation({
    mutationFn: async (variables: {
      notificationId: string;
      userId: string;
      read: boolean;
    }) =>
      await updateNotificationStatus(
        variables.notificationId,
        variables.userId,
        variables.read,
      ),
  });
}
