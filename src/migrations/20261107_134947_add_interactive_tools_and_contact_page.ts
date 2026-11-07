import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "contact_page_additional_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"phone" varchar,
  	"email" varchar
  );
  
  CREATE TABLE "contact_page_additional_offices_locales" (
  	"title" varchar NOT NULL,
  	"address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"watermark" varchar DEFAULT 'CONTACT',
  	"phone_number" varchar DEFAULT '+98 38 3228 1752',
  	"email_address" varchar DEFAULT 'info@persisquartz.com',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_locales" (
  	"title" varchar DEFAULT 'تماس با ما',
  	"info_title" varchar DEFAULT 'دفتر مرکزی و کارخانه',
  	"info_desc" varchar DEFAULT 'برای هماهنگی جلسات حضوری، بازدید از شوروم کارخانه و یا دریافت مشاوره‌های تخصصی معماری، از طریق راه‌های زیر با ما در ارتباط باشید.',
  	"factory_title" varchar DEFAULT 'آدرس کارخانه',
  	"factory_address" varchar DEFAULT 'شهرکرد، قطب صنعتی، فاز ۳، اندیشه ۶، پلاک ۳۶۹',
  	"phone_title" varchar DEFAULT 'تلفن تماس مستقیم',
  	"email_title" varchar DEFAULT 'پست الکترونیک سازمانی',
  	"tab_general" varchar DEFAULT 'تماس عمومی',
  	"tab_sample" varchar DEFAULT 'درخواست سمپل',
  	"tab_project" varchar DEFAULT 'استعلام پروژه',
  	"tab_dealer" varchar DEFAULT 'اخذ عاملیت',
  	"success_title" varchar DEFAULT 'با تشکر از پیام شما',
  	"submit_another_btn" varchar DEFAULT 'ثبت درخواست دیگر',
  	"success_message" varchar DEFAULT 'درخواست شما دریافت شد و پس از بررسی توسط دپارتمان مربوطه، در اسرع وقت با شما تماس خواهیم گرفت.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "home_page" ADD COLUMN "dealer_card_btn_link" varchar DEFAULT '/dealers';
  ALTER TABLE "home_page" ADD COLUMN "dealer_card_image_id" integer;
  ALTER TABLE "home_page_locales" ADD COLUMN "tools_tagline" varchar DEFAULT 'ابزارهای تعاملی';
  ALTER TABLE "home_page_locales" ADD COLUMN "tools_title" varchar DEFAULT 'شروع یک همکاری و خلق ارزش مشترک';
  ALTER TABLE "home_page_locales" ADD COLUMN "dealer_card_title" varchar DEFAULT 'شبکه نمایندگان و عاملیت‌های مجاز';
  ALTER TABLE "home_page_locales" ADD COLUMN "dealer_card_btn_text" varchar DEFAULT 'مشاهده نمایندگی‌ها';
  ALTER TABLE "home_page_locales" ADD COLUMN "dealer_card_desc" varchar DEFAULT 'برای مشاهده لیست عاملین فروش، مجریان مجاز و شوروم‌های Persis Quartz در سراسر کشور، به بخش شبکه فروش مراجعه کنید.';
  ALTER TABLE "home_page_locales" ADD COLUMN "inquiry_card_title" varchar DEFAULT 'درخواست مشاوره یا ثبت پروژه';
  ALTER TABLE "home_page_locales" ADD COLUMN "inquiry_card_desc" varchar DEFAULT 'برای استعلام متراژ، دریافت مشاوره فنی یا ثبت پروژه‌های ساختمانی خود، فرم زیر را تکمیل نمایید.';
  ALTER TABLE "contact_page_additional_offices" ADD CONSTRAINT "contact_page_additional_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_additional_offices_locales" ADD CONSTRAINT "contact_page_additional_offices_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page_additional_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contact_page_additional_offices_order_idx" ON "contact_page_additional_offices" USING btree ("_order");
  CREATE INDEX "contact_page_additional_offices_parent_id_idx" ON "contact_page_additional_offices" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "contact_page_additional_offices_locales_locale_parent_id_uni" ON "contact_page_additional_offices_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_page_locales_locale_parent_id_unique" ON "contact_page_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_dealer_card_image_id_media_id_fk" FOREIGN KEY ("dealer_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_dealer_card_image_idx" ON "home_page" USING btree ("dealer_card_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_page_additional_offices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_additional_offices_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "contact_page_additional_offices" CASCADE;
  DROP TABLE "contact_page_additional_offices_locales" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "contact_page_locales" CASCADE;
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_dealer_card_image_id_media_id_fk";
  
  DROP INDEX "home_page_dealer_card_image_idx";
  ALTER TABLE "home_page" DROP COLUMN "dealer_card_btn_link";
  ALTER TABLE "home_page" DROP COLUMN "dealer_card_image_id";
  ALTER TABLE "home_page_locales" DROP COLUMN "tools_tagline";
  ALTER TABLE "home_page_locales" DROP COLUMN "tools_title";
  ALTER TABLE "home_page_locales" DROP COLUMN "dealer_card_title";
  ALTER TABLE "home_page_locales" DROP COLUMN "dealer_card_btn_text";
  ALTER TABLE "home_page_locales" DROP COLUMN "dealer_card_desc";
  ALTER TABLE "home_page_locales" DROP COLUMN "inquiry_card_title";
  ALTER TABLE "home_page_locales" DROP COLUMN "inquiry_card_desc";`)
}
