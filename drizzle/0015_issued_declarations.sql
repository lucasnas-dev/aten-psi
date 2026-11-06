CREATE TABLE IF NOT EXISTS "issued_documents" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"tenant_id" varchar(255) NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"professional_id" text NOT NULL,
	"type" varchar(32) DEFAULT 'declaration' NOT NULL,
	"purpose" text NOT NULL,
	"recipient" varchar(255) NOT NULL,
	"content" jsonb NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"issued_on" date NOT NULL,
	"feedback_status" varchar(32) DEFAULT 'not_applicable' NOT NULL,
	CONSTRAINT "issued_documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE restrict ON UPDATE no action,
	CONSTRAINT "issued_documents_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE restrict ON UPDATE no action,
	CONSTRAINT "issued_documents_professional_id_users_id_fk" FOREIGN KEY ("professional_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "issued_documents_tenant_patient_date_idx" ON "issued_documents" USING btree ("tenant_id","patient_id","issued_at");
