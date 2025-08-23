ALTER TABLE "user_settings" DROP COLUMN "week_starts_on";--> statement-breakpoint
ALTER TABLE "user_settings" DROP COLUMN "time_format";--> statement-breakpoint
ALTER TABLE "user_settings" DROP COLUMN "timezone";--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id");