import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "inspirations_locales" 
    ALTER COLUMN "description" 
    SET DATA TYPE jsonb 
    USING CASE 
      WHEN "description" IS NULL THEN NULL
      WHEN "description" = '' THEN NULL
      ELSE json_build_object(
        'root', json_build_object(
          'type', 'root',
          'format', '',
          'indent', 0,
          'version', 1,
          'children', json_build_array(
            json_build_object(
              'type', 'paragraph',
              'format', '',
              'indent', 0,
              'version', 1,
              'children', json_build_array(
                json_build_object(
                  'type', 'text',
                  'text', "description",
                  'format', 0,
                  'mode', 'normal',
                  'style', '',
                  'version', 1
                )
              )
            )
          )
        )
      )::jsonb
    END;
  `);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "inspirations_locales" 
    ALTER COLUMN "description" 
    SET DATA TYPE varchar 
    USING "description"::text;
  `);
}
