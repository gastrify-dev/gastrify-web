import { headers } from "next/headers";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { AppSidebar } from "@/shared/components/app-sidebar";
import { auth } from "@/shared/lib/better-auth/server";

export default async function GastrifyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["session", "details"],
    queryFn: async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      return session;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-svh gap-6 overflow-auto px-2 py-4 sm:px-6 sm:py-8 md:p-10">
        <AppSidebar />

        <main className="h-full flex-1">{children}</main>
      </div>
    </HydrationBoundary>
  );
}
