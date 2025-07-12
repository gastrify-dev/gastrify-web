"use client";

import { useTranslations } from "next-intl";

export default function NotificationEmpty() {
  const t = useTranslations("features.notifications");
  return <div>{t("empty")}</div>;
}
