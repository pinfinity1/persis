import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Acquire an advisory transaction lock to prevent race conditions during parallel Next.js builds
  SELECT pg_advisory_xact_lock(2026112002);

  CREATE TABLE IF NOT EXISTS "email_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enable_contact_auto_reply" boolean DEFAULT true,
  	"contact_reply_subject" varchar DEFAULT 'پیام شما در پرسیس کوارتز دریافت شد' NOT NULL,
  	"contact_reply_heading" varchar DEFAULT 'درخواست شما با موفقیت ثبت شد' NOT NULL,
  	"contact_reply_message" varchar DEFAULT 'با سپاس از ارتباط شما با شرکت پرسیس کوارتز. درخواست شما با موفقیت به دپارتمان مربوطه ارجاع گردید و کارشناسان فنی و بازرگانی ما در اسرع وقت جهت هماهنگی با شما تماس خواهند گرفت.' NOT NULL,
  	"contact_reply_footer" varchar DEFAULT 'پرسیس کوارتز • تولیدکننده سطوح مهندسی‌شده سنگ کوارتز
تلفن: ۰۳۸-۳۲۲۸۱۷۵۲ | وب‌سایت: persisquartz.com',
  	"enable_inbound_auto_reply" boolean DEFAULT false,
  	"inbound_reply_subject" varchar DEFAULT 'ایمیل شما دریافت شد | شرکت پرسیس کوارتز',
  	"inbound_reply_message" varchar DEFAULT 'با سلام و احترام،

ایمیل شما با موفقیت دریافت شد و در دست بررسی دپارتمان مربوطه قرار گرفت. کارشناسان ما به زودی پاسخگوی شما خواهند بود.

با تشکر
تیم پشتیبانی پرسیس کوارتز',
  	"admin_notification_emails" varchar DEFAULT 'sales@persisquartz.com, info@persisquartz.com',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "mailboxes" ADD COLUMN IF NOT EXISTS "forward_to" varchar;
  ALTER TABLE "mailboxes" ADD COLUMN IF NOT EXISTS "enable_auto_reply" boolean DEFAULT false;
  ALTER TABLE "mailboxes" ADD COLUMN IF NOT EXISTS "auto_reply_subject" varchar;
  ALTER TABLE "mailboxes" ADD COLUMN IF NOT EXISTS "auto_reply_body" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  SELECT pg_advisory_xact_lock(2026112002);

  DROP TABLE IF EXISTS "email_settings" CASCADE;
  ALTER TABLE "mailboxes" DROP COLUMN IF EXISTS "forward_to";
  ALTER TABLE "mailboxes" DROP COLUMN IF EXISTS "enable_auto_reply";
  ALTER TABLE "mailboxes" DROP COLUMN IF EXISTS "auto_reply_subject";
  ALTER TABLE "mailboxes" DROP COLUMN IF EXISTS "auto_reply_body";
  `)
}
