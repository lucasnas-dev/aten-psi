CREATE TABLE "user_settings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"name" text,
	"email" text,
	"phone" text,
	"crp" text,
	"specialization" text,
	"default_duration" integer DEFAULT 50,
	"buffer_time" integer DEFAULT 10,
	"max_advance_booking" integer DEFAULT 30,
	"allow_same_day_booking" boolean DEFAULT false,
	"email_notifications" boolean DEFAULT true,
	"sms_notifications" boolean DEFAULT false,
	"reminder_time" integer DEFAULT 60,
	"week_starts_on" varchar(1) DEFAULT '1',
	"time_format" varchar(2) DEFAULT '24',
	"timezone" text DEFAULT 'America/Sao_Paulo',
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "working_hours" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"day_of_week" integer NOT NULL,
	"enabled" boolean DEFAULT true,
	"time_slots" json DEFAULT '[]'::json,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;