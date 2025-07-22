DROP TABLE "notification_translation" CASCADE;--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "preview" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "title_es";--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "preview_es";--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "content_es";