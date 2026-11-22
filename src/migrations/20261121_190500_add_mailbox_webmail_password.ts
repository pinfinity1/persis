import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Acquire an advisory transaction lock to prevent race conditions during parallel Next.js builds
  SELECT pg_advisory_xact_lock(2026112101);

  ALTER TABLE "mailboxes" ADD COLUMN IF NOT EXISTS "webmail_password" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  SELECT pg_advisory_xact_lock(2026112101);

  ALTER TABLE "mailboxes" DROP COLUMN IF EXISTS "webmail_password";
  `)
}
