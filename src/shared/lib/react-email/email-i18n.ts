import en from "@/shared/lib/next-intl/messages/en.json";
import es from "@/shared/lib/next-intl/messages/es.json";

const messages = { en, es };

export function getEmailMessage(
  key: string,
  language: "en" | "es",
  vars?: Record<string, string>,
) {
  const value = key.split(".").reduce((o: unknown, i) => {
    if (o && typeof o === "object" && o !== null && i in o) {
      return (o as Record<string, unknown>)[i];
    }
    return undefined;
  }, messages[language] as unknown);
  let text = typeof value === "string" ? value : `[MISSING: ${key}]`;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
  }
  // Logging para depuración
  if (text.startsWith("[MISSING")) {
    console.warn(`i18n missing: key='${key}', language='${language}'`);
  }
  return text;
}
