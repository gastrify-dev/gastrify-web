import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getNotifications } from "@/features/notifications/actions/get-notifications";
import Notifications from "@/features/notifications/components/notifications";

export default async function NotificationsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notification", "list", { limit: 99, offset: 0 }],
    queryFn: async () => {
      const { data, error } = await getNotifications({ limit: 99, offset: 0 });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notifications />
    </HydrationBoundary>
  );
}
