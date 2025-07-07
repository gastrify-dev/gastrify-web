import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/shared/lib/better-auth/client";

export const useSessions = () =>
  useQuery({
    queryKey: ["session", "list"],
    queryFn: async () => {
      const { data, error } = await authClient.listSessions();

      if (error) return Promise.reject(error);

      return data;
    },
  });
