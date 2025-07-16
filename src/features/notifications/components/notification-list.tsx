"use client";

import { NotificationItem } from "./notification-item";
import { Notification } from "../types";
import { useTranslations } from "next-intl";

type Props = {
  notifications: Notification[];
  selectedId?: string;
  onSelect: (n: Notification) => void;
  loading?: boolean;
  error?: string | null;
  deletingIds?: Set<string>;
};

export function NotificationList({
  notifications,
  selectedId,
  onSelect,
  loading,
  error,
  deletingIds = new Set(),
}: Props) {
  const t = useTranslations("features.notifications");
  const handleClick = (n: Notification) => {
    if (deletingIds.has(n.id)) return;

    onSelect(n);
  };
  let content: React.ReactNode = null;
  if (loading) {
    content = <li className="p-4 text-gray-400">{t("loading")}</li>;
  } else if (error && !loading) {
    content = <li className="p-4 text-red-500">{t("error")}</li>;
  } else if (notifications.length === 0) {
    content = <li className="p-4 text-gray-400">{t("empty")}</li>;
  } else {
    content = notifications.map((n, idx) => (
      <li
        key={`notif-${n.id}`}
        role="option"
        aria-selected={n.id === selectedId}
      >
        <NotificationItem
          notification={n}
          selected={n.id === selectedId}
          onClick={() => handleClick(n)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (deletingIds.has(n.id)) return;
            if (e.key === "Enter" || e.key === " ") handleClick(n);
            if (e.key === "ArrowDown") {
              const next = document.querySelector(
                `[data-notification-idx='${idx + 1}']`,
              );
              if (next) (next as HTMLElement).focus();
            }
            if (e.key === "ArrowUp") {
              const prev = document.querySelector(
                `[data-notification-idx='${idx - 1}']`,
              );
              if (prev) (prev as HTMLElement).focus();
            }
          }}
          data-notification-idx={idx}
          isDeleting={deletingIds.has(n.id)}
        />
      </li>
    ));
  }
  return (
    <ul
      className="divide-y"
      role="listbox"
      aria-label="Lista de notificaciones"
      tabIndex={0}
    >
      {content}
    </ul>
  );
}
