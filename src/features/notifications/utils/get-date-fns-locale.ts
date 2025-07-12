import { enUS, es } from "date-fns/locale";

export function getDateFnsLocale(locale: string) {
  switch (locale) {
    case "es":
      return es;
    case "en":
    default:
      return enUS;
  }
}
