import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_info_cards_list_card_type" AS ENUM('standard', 'features');
  CREATE TYPE "public"."enum_home_page_info_cards_list_link_type" AS ENUM('/care-and-maintenance', '/catalogs', '/contact?type=sample', '/contact?type=project', '/dealers', '/products', '/inspirations', 'custom');
  CREATE TABLE "home_page_info_cards_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"card_type" "enum_home_page_info_cards_list_card_type" DEFAULT 'standard' NOT NULL,
  	"image_id" integer,
  	"link_type" "enum_home_page_info_cards_list_link_type" DEFAULT '/catalogs',
  	"custom_link" varchar
  );
  
  CREATE TABLE "home_page_info_cards_list_locales" (
  	"category" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"cta_label" varchar DEFAULT 'مشاهده بیشتر',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_info_cards_images_features_image_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_info_cards_images_maintenance_image_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_info_cards_images_catalogs_image_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_info_cards_images_sample_image_id_media_id_fk";
  
  DROP INDEX "home_page_info_cards_images_info_cards_images_features_i_idx";
  DROP INDEX "home_page_info_cards_images_info_cards_images_maintenanc_idx";
  DROP INDEX "home_page_info_cards_images_info_cards_images_catalogs_i_idx";
  DROP INDEX "home_page_info_cards_images_info_cards_images_sample_ima_idx";
  ALTER TABLE "home_page_locales" ALTER COLUMN "intro_title" SET DEFAULT 'دقت مهندسی برای آفرینش زیبایی ماندگار';
  ALTER TABLE "home_page_locales" ALTER COLUMN "intro_description" SET DEFAULT 'تلفیق دانش مهندسی، فناوری پیشرفته و زیبایی‌شناسی معاصر برای خلق هارمونی در معماری مدرن.';
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat1_tag" SET DEFAULT '01 / Engineering';
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat1_title" SET DEFAULT 'خلوص و دوام ساختاری';
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat1_desc" SET DEFAULT 'مقاومت بالا در برابر خط، خش و حرارت.';
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat2_tag" SET DEFAULT '02 / Aesthetics';
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat2_title" SET DEFAULT 'زبان طراحی معاصر';
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat2_desc" SET DEFAULT 'خلق هارمونی و عمق بصری در فضا.';
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat3_tag" SET DEFAULT '03 / Trust';
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat3_title" SET DEFAULT 'اصالت و استاندارد جهانی';
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat3_desc" SET DEFAULT 'تضمین بالاترین سطح کیفیت و پایداری.';
  ALTER TABLE "home_page_locales" ADD COLUMN "info_cards_tagline" varchar DEFAULT 'PERSIS QUARTZ INSIGHTS';
  ALTER TABLE "home_page_locales" ADD COLUMN "info_cards_title" varchar DEFAULT 'معماری، کیفیت و خدمات Persis Quartz';
  ALTER TABLE "home_page_info_cards_list" ADD CONSTRAINT "home_page_info_cards_list_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_info_cards_list" ADD CONSTRAINT "home_page_info_cards_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_info_cards_list_locales" ADD CONSTRAINT "home_page_info_cards_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_info_cards_list"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_info_cards_list_order_idx" ON "home_page_info_cards_list" USING btree ("_order");
  CREATE INDEX "home_page_info_cards_list_parent_id_idx" ON "home_page_info_cards_list" USING btree ("_parent_id");
  CREATE INDEX "home_page_info_cards_list_image_idx" ON "home_page_info_cards_list" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_page_info_cards_list_locales_locale_parent_id_unique" ON "home_page_info_cards_list_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "home_page" DROP COLUMN "info_cards_images_features_image_id";
  ALTER TABLE "home_page" DROP COLUMN "info_cards_images_maintenance_image_id";
  ALTER TABLE "home_page" DROP COLUMN "info_cards_images_catalogs_image_id";
  ALTER TABLE "home_page" DROP COLUMN "info_cards_images_sample_image_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_info_cards_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_info_cards_list_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_page_info_cards_list" CASCADE;
  DROP TABLE "home_page_info_cards_list_locales" CASCADE;
  ALTER TABLE "home_page_locales" ALTER COLUMN "intro_title" DROP DEFAULT;
  ALTER TABLE "home_page_locales" ALTER COLUMN "intro_description" DROP DEFAULT;
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat1_tag" DROP DEFAULT;
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat1_title" DROP DEFAULT;
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat1_desc" DROP DEFAULT;
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat2_tag" DROP DEFAULT;
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat2_title" DROP DEFAULT;
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat2_desc" DROP DEFAULT;
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat3_tag" DROP DEFAULT;
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat3_title" DROP DEFAULT;
  ALTER TABLE "home_page_locales" ALTER COLUMN "feat3_desc" DROP DEFAULT;
  ALTER TABLE "home_page" ADD COLUMN "info_cards_images_features_image_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "info_cards_images_maintenance_image_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "info_cards_images_catalogs_image_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "info_cards_images_sample_image_id" integer;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_info_cards_images_features_image_id_media_id_fk" FOREIGN KEY ("info_cards_images_features_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_info_cards_images_maintenance_image_id_media_id_fk" FOREIGN KEY ("info_cards_images_maintenance_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_info_cards_images_catalogs_image_id_media_id_fk" FOREIGN KEY ("info_cards_images_catalogs_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_info_cards_images_sample_image_id_media_id_fk" FOREIGN KEY ("info_cards_images_sample_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_info_cards_images_info_cards_images_features_i_idx" ON "home_page" USING btree ("info_cards_images_features_image_id");
  CREATE INDEX "home_page_info_cards_images_info_cards_images_maintenanc_idx" ON "home_page" USING btree ("info_cards_images_maintenance_image_id");
  CREATE INDEX "home_page_info_cards_images_info_cards_images_catalogs_i_idx" ON "home_page" USING btree ("info_cards_images_catalogs_image_id");
  CREATE INDEX "home_page_info_cards_images_info_cards_images_sample_ima_idx" ON "home_page" USING btree ("info_cards_images_sample_image_id");
  ALTER TABLE "home_page_locales" DROP COLUMN "info_cards_tagline";
  ALTER TABLE "home_page_locales" DROP COLUMN "info_cards_title";
  DROP TYPE "public"."enum_home_page_info_cards_list_card_type";
  DROP TYPE "public"."enum_home_page_info_cards_list_link_type";`)
}
