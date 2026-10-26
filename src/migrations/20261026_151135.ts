import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_order_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "products_order_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  ALTER TABLE "inspirations_pairings" ALTER COLUMN "color_hex" SET DEFAULT '#c5a059';
  ALTER TABLE "products_order_settings_rels" ADD CONSTRAINT "products_order_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products_order_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_order_settings_rels" ADD CONSTRAINT "products_order_settings_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_order_settings_rels_order_idx" ON "products_order_settings_rels" USING btree ("order");
  CREATE INDEX "products_order_settings_rels_parent_idx" ON "products_order_settings_rels" USING btree ("parent_id");
  CREATE INDEX "products_order_settings_rels_path_idx" ON "products_order_settings_rels" USING btree ("path");
  CREATE INDEX "products_order_settings_rels_categories_id_idx" ON "products_order_settings_rels" USING btree ("categories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_order_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_order_settings_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_order_settings" CASCADE;
  DROP TABLE "products_order_settings_rels" CASCADE;
  ALTER TABLE "inspirations_pairings" ALTER COLUMN "color_hex" DROP DEFAULT;`)
}
