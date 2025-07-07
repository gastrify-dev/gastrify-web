import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import { Providers } from "@/shared/components/providers";

import "@/shared/styles/globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={GeistSans.className}
    >
      {/* <head>
        <script async src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </head> */}
      <body>
        <Providers>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </Providers>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
