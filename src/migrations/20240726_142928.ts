import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "users" RENAME COLUMN "sub" TO "github_id";
DROP INDEX IF EXISTS "users_sub_idx";
ALTER TABLE "users" ADD COLUMN "google_id" varchar;
CREATE INDEX IF NOT EXISTS "users_github_id_idx" ON "users" ("github_id");
CREATE INDEX IF NOT EXISTS "users_google_id_idx" ON "users" ("google_id");`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DROP INDEX IF EXISTS "users_github_id_idx";
DROP INDEX IF EXISTS "users_google_id_idx";
ALTER TABLE "users" ADD COLUMN "sub" varchar;
CREATE INDEX IF NOT EXISTS "users_sub_idx" ON "users" ("sub");
ALTER TABLE "users" DROP COLUMN IF EXISTS "github_id";
ALTER TABLE "users" DROP COLUMN IF EXISTS "google_id";`)
};
