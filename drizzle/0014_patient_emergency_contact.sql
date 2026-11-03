ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "social_name" varchar(255);--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "responsible_name" varchar(255);--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "emergency_contact_name" varchar(255);--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "emergency_contact_phone" varchar(20);
