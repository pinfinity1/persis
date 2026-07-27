import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { fileURLToPath } from "url";
import { Users } from "./payload/collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    // می‌توانید مسیر پیش‌فرض پنل ادمین را در آینده تغییر دهید
  },
  // معرفی کالکشن‌ها به صورت ماژولار
  collections: [Users],

  // تنظیم ویرایشگر متن غنی (Lexical Editor)
  editor: lexicalEditor({}),

  // تنظیمات چندزبانه بر اساس معماری پروژه (فارسی، انگلیسی، عربی)
  localization: {
    locales: ["fa", "en", "ar"],
    defaultLocale: "fa",
    fallback: true,
  },

  secret: process.env.PAYLOAD_SECRET || "",

  // تنظیمات تولید تایپ‌های TypeScript به صورت خودکار
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  // اتصال به پایگاه‌داده PostgreSQL
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
});
