// src/payload.config.ts
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { fileURLToPath } from "url";
import { Users } from "./payload/collections/Users";
import { HeroBanner } from "./payload/collections/HeroBanner";
import { Media } from "./payload/collections/Media"; // <-- اضافه شد

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  // معرفی کالکشن Media در کنار بقیه
  collections: [HeroBanner, Users, Media], // <-- Media اضافه شد

  editor: lexicalEditor({}),

  localization: {
    locales: ["fa", "en", "ar"],
    defaultLocale: "fa",
    fallback: true,
  },

  secret: process.env.PAYLOAD_SECRET || "",

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
});
