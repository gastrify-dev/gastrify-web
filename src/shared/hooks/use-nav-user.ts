import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { useIsMobile } from "@/shared/hooks/use-mobile";
import { authClient } from "@/shared/lib/better-auth/client";

export const useNavUser = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = useCallback(
    async (event?: Event) => {
      event?.preventDefault();

      if (isSigningOut) return;

      setIsSigningOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        setIsSigningOut(false);
        toast.error("Failed to sign out. Please try again later.");
        return;
      }

      router.push("/sign-in");
    },
    [isSigningOut, router],
  );

  const handleThemeChange = useCallback(
    (event?: Event) => {
      event?.preventDefault();

      if (theme === "dark") {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    },
    [setTheme, theme],
  );

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.shiftKey && event.key === "T") {
          event.preventDefault();
          handleThemeChange();
        }

        if (event.key === "o") {
          event.preventDefault();
          handleSignOut();
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [handleSignOut, handleThemeChange]);

  const t = useTranslations("shared.nav-user");

  return {
    isMobile,
    isSigningOut,
    handleSignOut,
    handleThemeChange,
    theme,
    t,
  };
};
