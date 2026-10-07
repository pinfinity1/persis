import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_inspirations_space_type" AS ENUM('kitchen', 'bathroom', 'commercial', 'furniture');
  CREATE TYPE "public"."enum_inspirations_style" AS ENUM('minimal', 'modern', 'classic', 'industrial');
  CREATE TABLE "inspirations_hotspots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"x_percent" numeric DEFAULT 50 NOT NULL,
  	"y_percent" numeric DEFAULT 50 NOT NULL
  );
  
  CREATE TABLE "inspirations_hotspots_locales" (
  	"application_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "inspirations_pairings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color_hex" varchar
  );
  
  CREATE TABLE "inspirations_pairings_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "inspirations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"space_type" "enum_inspirations_space_type" NOT NULL,
  	"style" "enum_inspirations_style" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inspirations_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  ALTER TABLE "inspirations_hotspots" ADD CONSTRAINT "inspirations_hotspots_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inspirations_hotspots" ADD CONSTRAINT "inspirations_hotspots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inspirations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inspirations_hotspots_locales" ADD CONSTRAINT "inspirations_hotspots_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inspirations_hotspots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inspirations_pairings" ADD CONSTRAINT "inspirations_pairings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inspirations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inspirations_pairings_locales" ADD CONSTRAINT "inspirations_pairings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inspirations_pairings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "inspirations" ADD CONSTRAINT "inspirations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inspirations_locales" ADD CONSTRAINT "inspirations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."inspirations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "inspirations_hotspots_order_idx" ON "inspirations_hotspots" USING btree ("_order");
  CREATE INDEX "inspirations_hotspots_parent_id_idx" ON "inspirations_hotspots" USING btree ("_parent_id");
  CREATE INDEX "inspirations_hotspots_product_idx" ON "inspirations_hotspots" USING btree ("product_id");
  CREATE UNIQUE INDEX "inspirations_hotspots_locales_locale_parent_id_unique" ON "inspirations_hotspots_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inspirations_pairings_order_idx" ON "inspirations_pairings" USING btree ("_order");
  CREATE INDEX "inspirations_pairings_parent_id_idx" ON "inspirations_pairings" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "inspirations_pairings_locales_locale_parent_id_unique" ON "inspirations_pairings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inspirations_image_idx" ON "inspirations" USING btree ("image_id");
  CREATE INDEX "inspirations_updated_at_idx" ON "inspirations" USING btree ("updated_at");
  CREATE INDEX "inspirations_created_at_idx" ON "inspirations" USING btree ("created_at");
  CREATE UNIQUE INDEX "inspirations_locales_locale_parent_id_unique" ON "inspirations_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "inspirations_hotspots" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "inspirations_hotspots_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "inspirations_pairings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "inspirations_pairings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "inspirations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "inspirations_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "inspirations_hotspots" CASCADE;
  DROP TABLE "inspirations_hotspots_locales" CASCADE;
  DROP TABLE "inspirations_pairings" CASCADE;
  DROP TABLE "inspirations_pairings_locales" CASCADE;
  DROP TABLE "inspirations" CASCADE;
  DROP TABLE "inspirations_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  DROP TYPE "public"."enum_inspirations_space_type";
  DROP TYPE "public"."enum_inspirations_style";`)
}
