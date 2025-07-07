import { headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { auth } from "@/shared/lib/better-auth/server";
import messages from "@/shared/lib/next-intl/messages/es.json";

export default getRequestConfig(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const locale = session?.user.language ?? "es";

  return {
    locale,
    messages: (await import(`@/shared/lib/next-intl/messages/${locale}.json`))
      .default,
  };
});

declare module "next-intl" {
  interface AppConfig {
    Messages: typeof messages;
  }
}
