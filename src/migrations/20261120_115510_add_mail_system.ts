import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- Acquire an advisory transaction lock to prevent race conditions during parallel Next.js builds
  SELECT pg_advisory_xact_lock(2026112001);

  DO $$ BEGIN
    CREATE TYPE "public"."enum_emails_direction" AS ENUM('inbound', 'outbound');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_emails_status" AS ENUM('delivered', 'sent', 'pending', 'failed', 'draft');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "mailboxes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"is_catch_all" boolean DEFAULT false,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "mailboxes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "emails" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"mailbox_id" integer NOT NULL,
  	"direction" "enum_emails_direction" DEFAULT 'inbound' NOT NULL,
  	"status" "enum_emails_status" DEFAULT 'delivered' NOT NULL,
  	"subject" varchar DEFAULT '(بدون موضوع)' NOT NULL,
  	"from" varchar NOT NULL,
  	"from_name" varchar,
  	"to" varchar NOT NULL,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"body_text" varchar,
  	"body_html" varchar,
  	"message_id" varchar,
  	"in_reply_to" varchar,
  	"thread_id" varchar,
  	"is_read" boolean DEFAULT false,
  	"is_starred" boolean DEFAULT false,
  	"is_archived" boolean DEFAULT false,
  	"is_trash" boolean DEFAULT false,
  	"error_message" varchar,
  	"sent_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "emails_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"email_attachments_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "email_attachments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"original_name" varchar,
  	"content_id" varchar,
  	"prefix" varchar DEFAULT 'email-attachments',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "mailboxes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "emails_id" integer;

  DO $$ BEGIN
    ALTER TABLE "mailboxes_rels" ADD CONSTRAINT "mailboxes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."mailboxes"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "mailboxes_rels" ADD CONSTRAINT "mailboxes_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "emails" ADD CONSTRAINT "emails_mailbox_id_mailboxes_id_fk" FOREIGN KEY ("mailbox_id") REFERENCES "public"."mailboxes"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "emails_rels" ADD CONSTRAINT "emails_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."emails"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "emails_rels" ADD CONSTRAINT "emails_rels_email_attachments_fk" FOREIGN KEY ("email_attachments_id") REFERENCES "public"."email_attachments"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  CREATE UNIQUE INDEX IF NOT EXISTS "mailboxes_address_idx" ON "mailboxes" USING btree ("address");
  CREATE INDEX IF NOT EXISTS "mailboxes_updated_at_idx" ON "mailboxes" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "mailboxes_created_at_idx" ON "mailboxes" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "mailboxes_rels_order_idx" ON "mailboxes_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "mailboxes_rels_parent_idx" ON "mailboxes_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "mailboxes_rels_path_idx" ON "mailboxes_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "mailboxes_rels_users_id_idx" ON "mailboxes_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "emails_mailbox_idx" ON "emails" USING btree ("mailbox_id");
  CREATE INDEX IF NOT EXISTS "emails_direction_idx" ON "emails" USING btree ("direction");
  CREATE INDEX IF NOT EXISTS "emails_status_idx" ON "emails" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "emails_from_idx" ON "emails" USING btree ("from");
  CREATE INDEX IF NOT EXISTS "emails_to_idx" ON "emails" USING btree ("to");
  CREATE INDEX IF NOT EXISTS "emails_message_id_idx" ON "emails" USING btree ("message_id");
  CREATE INDEX IF NOT EXISTS "emails_in_reply_to_idx" ON "emails" USING btree ("in_reply_to");
  CREATE INDEX IF NOT EXISTS "emails_thread_id_idx" ON "emails" USING btree ("thread_id");
  CREATE INDEX IF NOT EXISTS "emails_is_read_idx" ON "emails" USING btree ("is_read");
  CREATE INDEX IF NOT EXISTS "emails_is_starred_idx" ON "emails" USING btree ("is_starred");
  CREATE INDEX IF NOT EXISTS "emails_is_archived_idx" ON "emails" USING btree ("is_archived");
  CREATE INDEX IF NOT EXISTS "emails_is_trash_idx" ON "emails" USING btree ("is_trash");
  CREATE INDEX IF NOT EXISTS "emails_sent_at_idx" ON "emails" USING btree ("sent_at");
  CREATE INDEX IF NOT EXISTS "emails_updated_at_idx" ON "emails" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "emails_created_at_idx" ON "emails" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "emails_rels_order_idx" ON "emails_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "emails_rels_parent_idx" ON "emails_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "emails_rels_path_idx" ON "emails_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "emails_rels_email_attachments_id_idx" ON "emails_rels" USING btree ("email_attachments_id");
  CREATE INDEX IF NOT EXISTS "email_attachments_updated_at_idx" ON "email_attachments" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "email_attachments_created_at_idx" ON "email_attachments" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "email_attachments_filename_idx" ON "email_attachments" USING btree ("filename");

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mailboxes_fk" FOREIGN KEY ("mailboxes_id") REFERENCES "public"."mailboxes"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_emails_fk" FOREIGN KEY ("emails_id") REFERENCES "public"."emails"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_mailboxes_id_idx" ON "payload_locked_documents_rels" USING btree ("mailboxes_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_emails_id_idx" ON "payload_locked_documents_rels" USING btree ("emails_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  SELECT pg_advisory_xact_lock(2026112001);

  ALTER TABLE IF EXISTS "mailboxes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "mailboxes_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "emails" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "emails_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "email_attachments" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "mailboxes" CASCADE;
  DROP TABLE IF EXISTS "mailboxes_rels" CASCADE;
  DROP TABLE IF EXISTS "emails" CASCADE;
  DROP TABLE IF EXISTS "emails_rels" CASCADE;
  DROP TABLE IF EXISTS "email_attachments" CASCADE;
  
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_mailboxes_fk";
  EXCEPTION WHEN undefined_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_emails_fk";
  EXCEPTION WHEN undefined_object THEN null;
  END $$;

  DROP INDEX IF EXISTS "payload_locked_documents_rels_mailboxes_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_emails_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "mailboxes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "emails_id";
  DROP TYPE IF EXISTS "public"."enum_emails_direction";
  DROP TYPE IF EXISTS "public"."enum_emails_status";
  `)
}
