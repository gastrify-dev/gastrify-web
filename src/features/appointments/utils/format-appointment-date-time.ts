export function formatAppointmentDateTime(
  date: Date,
  language: "en" | "es",
): {
  date: string;
  time: string;
} {
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const locale = language === "es" ? "es-ES" : "en-US";

  return {
    date: date.toLocaleDateString(locale, dateOptions),
    time: date.toLocaleTimeString(locale, timeOptions),
  };
}
