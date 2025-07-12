import { formatDistanceToNow } from "date-fns";
import { Locale } from "date-fns";

export function formatNotificationDate(date: Date | string, locale?: Locale) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale });
}
