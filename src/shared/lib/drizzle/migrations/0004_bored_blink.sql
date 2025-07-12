ALTER TABLE "notification_translation" DROP CONSTRAINT "notification_translation_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "notification_translation" DROP COLUMN "user_id";