import { db } from "@/shared/lib/drizzle/server";
import {
  notification,
  notificationTranslation,
} from "@/shared/lib/drizzle/schema";
import { z } from "zod";
import { randomUUID } from "crypto";

async function translateText(
  text: string,
  from: string,
  to: string,
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey)
    throw new Error("DeepL API key not set in environment variables");
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `DeepL-Auth-Key ${apiKey}`,
    },
    body: `text=${encodeURIComponent(text)}&source_lang=${from.toUpperCase()}&target_lang=${to.toUpperCase()}`,
  });
  if (!res.ok) throw new Error("DeepL API error");
  const data = await res.json();
  return data.translations?.[0]?.text || "";
}

const createNotificationSchema = z.object({
  userId: z.string(),
  titleEs: z.string().max(255),
  previewEs: z.string().max(255),
  contentEs: z.string().max(2000),
  locale: z.string().optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

export async function createNotification(input: CreateNotificationInput) {
  const data = createNotificationSchema.parse(input);
  const id = randomUUID();

  const [created] = await db
    .insert(notification)
    .values({
      id,
      userId: data.userId,
      titleEs: data.titleEs,
      previewEs: data.previewEs,
      contentEs: data.contentEs,
    })
    .returning();

  const [titleEn, previewEn, contentEn] = await Promise.all([
    translateText(data.titleEs, "es", "en"),
    translateText(data.previewEs, "es", "en"),
    translateText(data.contentEs, "es", "en"),
  ]);

  await db.insert(notificationTranslation).values({
    id,
    titleEn,
    previewEn,
    contentEn,
  });

  return created;
}
