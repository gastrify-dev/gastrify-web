CREATE TABLE "notification_translation" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title_en" text NOT NULL,
	"preview_en" text NOT NULL,
	"content_en" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "title_es" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "preview_es" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "content_es" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notification_translation" ADD CONSTRAINT "notification_translation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "preview";--> statement-breakpoint
ALTER TABLE "notification" DROP COLUMN "content";