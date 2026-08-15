import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { Users } from "./payload/collections/Users";
import { HeroBanner } from "./payload/collections/HeroBanner";
import { Media } from "./payload/collections/Media";
import { Products } from "./payload/collections/Products";
import { Categories } from "./payload/collections/Categories";
import { Colors } from "./payload/collections/Colors";
import { VeinPatterns } from "./payload/collections/VeinPatterns";
import { Dimensions } from "./payload/collections/Dimensions";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  sharp,
  collections: [
    HeroBanner,
    Users,
    Media,
    Categories,
    Colors,
    VeinPatterns,
    Dimensions,
    Products,
  ],

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
