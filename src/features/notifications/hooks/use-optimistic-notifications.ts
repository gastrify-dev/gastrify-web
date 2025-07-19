import { useQueryClient } from "@tanstack/react-query";

type OptimisticNotification = {
  id: string;
  userId: string;
  title: string;
  preview: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export function useOptimisticNotifications() {
  const queryClient = useQueryClient();

  const addOptimisticNotification = (notification: OptimisticNotification) => {
    const activeKey = ["notifications", { limit: 99, offset: 0 }];

    queryClient.cancelQueries({ queryKey: activeKey });

    const previousData = queryClient.getQueryData<{
      data: OptimisticNotification[];
    }>(activeKey);

    if (previousData?.data) {
      const updatedData = {
        ...previousData,
        data: [notification, ...previousData.data],
      };

      queryClient.setQueryData(activeKey, updatedData);
    }

    queryClient.invalidateQueries({
      queryKey: activeKey,
      refetchType: "none",
    });
  };

  return {
    addOptimisticNotification,
  };
}
