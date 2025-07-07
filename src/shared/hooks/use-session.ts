import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/shared/lib/better-auth/client";

export const useSession = () =>
  useQuery({
    queryKey: ["session", "details"],
    queryFn: async () => {
      const { data, error } = await authClient.getSession();

      if (error) return Promise.reject(error);

      return data;
    },
  });
