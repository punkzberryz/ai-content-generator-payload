import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 CREATE TABLE IF NOT EXISTS "ai_output" (
	"id" serial PRIMARY KEY NOT NULL,
	"prompt" varchar NOT NULL,
	"output" jsonb,
	"template_slug" varchar NOT NULL,
	"created_by_id" integer,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "ai_output_created_at_idx" ON "ai_output" ("created_at");
DO $$ BEGIN
 ALTER TABLE "ai_output" ADD CONSTRAINT "ai_output_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DROP TABLE "ai_output";`)
};
