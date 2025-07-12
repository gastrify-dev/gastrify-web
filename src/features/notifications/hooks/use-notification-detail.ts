import { useState } from "react";
import { Notification } from "../types";

export function useNotificationDetail(notifications: Notification[]) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = notifications.find((n) => n.id === selectedId) || null;
  return { selected, setSelectedId };
}
