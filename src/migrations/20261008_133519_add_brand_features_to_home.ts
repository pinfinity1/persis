import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_locales" ADD COLUMN "intro_title" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "intro_description" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "feat1_tag" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "feat1_title" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "feat1_desc" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "feat2_tag" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "feat2_title" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "feat2_desc" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "feat3_tag" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "feat3_title" varchar;
  ALTER TABLE "home_page_locales" ADD COLUMN "feat3_desc" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_locales" DROP COLUMN "intro_title";
  ALTER TABLE "home_page_locales" DROP COLUMN "intro_description";
  ALTER TABLE "home_page_locales" DROP COLUMN "feat1_tag";
  ALTER TABLE "home_page_locales" DROP COLUMN "feat1_title";
  ALTER TABLE "home_page_locales" DROP COLUMN "feat1_desc";
  ALTER TABLE "home_page_locales" DROP COLUMN "feat2_tag";
  ALTER TABLE "home_page_locales" DROP COLUMN "feat2_title";
  ALTER TABLE "home_page_locales" DROP COLUMN "feat2_desc";
  ALTER TABLE "home_page_locales" DROP COLUMN "feat3_tag";
  ALTER TABLE "home_page_locales" DROP COLUMN "feat3_title";
  ALTER TABLE "home_page_locales" DROP COLUMN "feat3_desc";`)
}
