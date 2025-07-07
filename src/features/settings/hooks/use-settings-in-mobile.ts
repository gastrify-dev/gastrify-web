import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import { useIsMobile } from "@/shared/hooks/use-mobile";

export const useSettingsInMobile = () => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const isSettingsPage = pathname === "/settings";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const t = useTranslations("features.settings.settings-sidebar");

  return {
    isMounted,
    isMobile,
    isSettingsPage,
    t,
  };
};
