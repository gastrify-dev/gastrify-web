"use client";

import { useTranslations } from "next-intl";

export default function NotificationSkeleton() {
  const t = useTranslations("features.notifications");
  return <div>{t("loading")}</div>;
}
