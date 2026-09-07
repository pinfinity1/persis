import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import path from "path";
import { s3Storage } from "@payloadcms/storage-s3";
import { fileURLToPath } from "url";
import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Products } from "./payload/collections/Products";
import { Categories } from "./payload/collections/Categories";
import { Colors } from "./payload/collections/Colors";
import { VeinPatterns } from "./payload/collections/VeinPatterns";
import { Dimensions } from "./payload/collections/Dimensions";
import { Thicknesses } from "./payload/collections/Thicknesses";
import { Finishes } from "./payload/collections/Finishes";
import { Catalogs } from "./payload/collections/Catalogs";
import { AboutPage } from "./payload/globals/AboutPage";
import { Dealers } from "./payload/collections/Dealers";
import { Inquiries } from "./payload/collections/Inquiries";
import { HomePage } from "./payload/globals/HomePage";
import { CarePage } from "./payload/globals/CarePage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  sharp,
  collections: [
    Users,
    Media,
    Categories,
    Colors,
    VeinPatterns,
    Dimensions,
    Thicknesses,
    Finishes,
    Products,
    Catalogs,
    Dealers,
    Inquiries,
  ],
  globals: [AboutPage, HomePage, CarePage],

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

  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media", // پوشه‌بندی مرتب داخل باکت
        },
      },
      bucket: process.env.S3_BUCKET || "persisquartz-media",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || "",
          secretAccessKey: process.env.S3_SECRET_KEY || "",
        },
        region: process.env.S3_REGION || "default",
        endpoint: process.env.S3_ENDPOINT || "http://127.0.0.1:9000",
        forcePathStyle: true, // برای MinIO و S3 داخلی الزامی است
      },
    }),
  ],
});
