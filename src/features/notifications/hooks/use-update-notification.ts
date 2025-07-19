import { useCallback } from "react";
import { updateNotificationStatus } from "@/features/notifications/actions/update-notification";
import type { UpdateNotificationVariables } from "@/features/notifications/schemas/update-notification";

export function useUpdateNotification() {
  return useCallback(async (variables: UpdateNotificationVariables) => {
    return await updateNotificationStatus(variables);
  }, []);
}
