import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 ALTER TABLE "users" ADD COLUMN "sub" varchar;
ALTER TABLE "users" ADD COLUMN "line_login_id" varchar;
CREATE INDEX IF NOT EXISTS "users_sub_idx" ON "users" ("sub");
CREATE INDEX IF NOT EXISTS "users_line_login_id_idx" ON "users" ("line_login_id");`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DROP INDEX IF EXISTS "users_sub_idx";
DROP INDEX IF EXISTS "users_line_login_id_idx";
ALTER TABLE "users" DROP COLUMN IF EXISTS "sub";
ALTER TABLE "users" DROP COLUMN IF EXISTS "line_login_id";`)
};
