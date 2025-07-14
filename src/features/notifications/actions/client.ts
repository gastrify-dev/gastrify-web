export async function fetchUnreadNotificationCount(userId: string) {
  const res = await fetch("/actions/notifications/unread-count", {
    method: "POST",
    body: JSON.stringify({ userId }),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch unread notifications count");
  const { count } = await res.json();
  return count ?? 0;
}

export async function fetchNotificationList(
  userId: string,
  locale: string,
): Promise<import("../types").Notification[]> {
  const res = await fetch("/actions/notifications/list", {
    method: "POST",
    body: JSON.stringify({ userId, locale }),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch notification list");
  const { notifications } = await res.json();
  return notifications ?? [];
}
