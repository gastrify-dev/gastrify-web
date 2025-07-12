"use client";

import { NotificationItem } from "./notification-item";
import { Notification } from "../types";
import { useMarkNotificationRead } from "../hooks/use-mark-notification-read";

type Props = {
  notifications: Notification[];
  selectedId?: string;
  onSelect: (n: Notification) => void;
};

export function NotificationList({
  notifications,
  selectedId,
  onSelect,
}: Props) {
  const markRead = useMarkNotificationRead();
  const handleClick = (n: Notification) => {
    if (!n.read) {
      markRead.mutate({ id: n.id, read: true });
    }
    onSelect(n);
  };
  return (
    <ul className="divide-y">
      {notifications.map((n) => (
        <li key={n.id}>
          <NotificationItem
            notification={n}
            selected={n.id === selectedId}
            onClick={() => handleClick(n)}
          />
        </li>
      ))}
    </ul>
  );
}
