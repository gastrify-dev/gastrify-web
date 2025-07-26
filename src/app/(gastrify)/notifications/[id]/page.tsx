import { Notification } from "@/features/notifications/components/notification";

export default async function NotificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <Notification id={id} />;
}
