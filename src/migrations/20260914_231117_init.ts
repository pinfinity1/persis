import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fa', 'en', 'ar');
  CREATE TYPE "public"."enum_products_is_in_stock" AS ENUM('active', 'discontinued');
  CREATE TYPE "public"."enum_catalogs_catalog_type" AS ENUM('full_catalog', 'technical', 'collection', 'guide');
  CREATE TYPE "public"."enum_catalogs_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_dealers_province" AS ENUM('alborz', 'ardabil', 'azerbaijan-east', 'azerbaijan-west', 'bushehr', 'chaharmahal-and-bakhtiari', 'fars', 'gilan', 'golestan', 'hamadan', 'hormozgan', 'ilam', 'isfahan', 'kerman', 'kermanshah', 'khorasan-north', 'khorasan-razavi', 'khorasan-south', 'khuzestan', 'kohgiluyeh-and-boyer-ahmad', 'kurdistan', 'lorestan', 'markazi', 'mazandaran', 'qazvin', 'qom', 'semnan', 'sistan-and-baluchestan', 'tehran', 'yazd', 'zanjan');
  CREATE TYPE "public"."enum_dealers_status" AS ENUM('published', 'draft');
  CREATE TYPE "public"."enum_inquiries_type" AS ENUM('general', 'sample', 'project', 'dealer');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'in_progress', 'resolved', 'archived');
  CREATE TYPE "public"."enum_care_page_steps_icon_name" AS ENUM('dot', 'droplets', 'checkCheck', 'shieldCheck', 'sparkles', 'spray', 'brush', 'flame', 'heat', 'cookingPot', 'utensils', 'chefHat', 'scratch', 'chemical', 'impact', 'hammer', 'ban', 'balloon', 'bicep', 'bot', 'crown', 'castle', 'drama', 'ghost', 'frown', 'meh', 'laugh', 'smile', 'annoyed', 'smilePlus', 'hand', 'handHelping', 'heart', 'heartCrack', 'heartPulse', 'leaf', 'partyPopper', 'ribbon', 'salad', 'star', 'starHalf', 'starOff', 'thumbsDown', 'thumbsUp', 'waves');
  CREATE TYPE "public"."enum_care_page_rules_icon_type" AS ENUM('dot', 'droplets', 'checkCheck', 'shieldCheck', 'sparkles', 'spray', 'brush', 'flame', 'heat', 'cookingPot', 'utensils', 'chefHat', 'scratch', 'chemical', 'impact', 'hammer', 'ban', 'balloon', 'bicep', 'bot', 'crown', 'castle', 'drama', 'ghost', 'frown', 'meh', 'laugh', 'smile', 'annoyed', 'smilePlus', 'hand', 'handHelping', 'heart', 'heartCrack', 'heartPulse', 'leaf', 'partyPopper', 'ribbon', 'salad', 'star', 'starHalf', 'starOff', 'thumbsDown', 'thumbsUp', 'waves');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_desktop_url" varchar,
  	"sizes_desktop_width" numeric,
  	"sizes_desktop_height" numeric,
  	"sizes_desktop_mime_type" varchar,
  	"sizes_desktop_filesize" numeric,
  	"sizes_desktop_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "colors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "colors_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "vein_patterns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vein_patterns_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "dimensions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "thicknesses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "finishes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "finishes_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "products_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"category_id" integer NOT NULL,
  	"color_family_id" integer NOT NULL,
  	"vein_pattern_id" integer,
  	"is_in_stock" "enum_products_is_in_stock" DEFAULT 'active',
  	"is_featured" boolean DEFAULT false,
  	"thumbnail_id" integer,
  	"custom_thickness_available" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"thicknesses_id" integer,
  	"finishes_id" integer,
  	"dimensions_id" integer
  );
  
  CREATE TABLE "catalogs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"year" numeric DEFAULT 2026 NOT NULL,
  	"catalog_type" "enum_catalogs_catalog_type" DEFAULT 'full_catalog' NOT NULL,
  	"cover_image_id" integer NOT NULL,
  	"pdf_file_id" integer NOT NULL,
  	"file_size_mb" numeric NOT NULL,
  	"page_count" numeric,
  	"status" "enum_catalogs_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "catalogs_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "dealers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"province" "enum_dealers_province" NOT NULL,
  	"phone" varchar NOT NULL,
  	"order" numeric DEFAULT 0,
  	"status" "enum_dealers_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "dealers_locales" (
  	"title" varchar NOT NULL,
  	"city" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_inquiries_type" NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new' NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar,
  	"phone" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"company" varchar,
  	"city" varchar,
  	"postal_code" varchar,
  	"address" varchar,
  	"product_codes" varchar,
  	"project_size" varchar,
  	"thickness" varchar,
  	"finish" varchar,
  	"message" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"colors_id" integer,
  	"vein_patterns_id" integer,
  	"dimensions_id" integer,
  	"thicknesses_id" integer,
  	"finishes_id" integer,
  	"products_id" integer,
  	"catalogs_id" integer,
  	"dealers_id" integer,
  	"inquiries_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"vision_image_id" integer,
  	"craftsmanship_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_locales" (
  	"vision_tag" varchar DEFAULT 'چشم‌انداز و اصالت',
  	"vision_title" varchar DEFAULT 'تلفیق دانش، نوآوری و زیبایی‌شناسی',
  	"vision_desc1" varchar DEFAULT 'ما در تلاشیم تا به شرکتی پیشرو تبدیل شویم که همراه با مشتریان خود و با نگاهی مسئولانه، آینده‌ای نوآورانه و باارزش را در دنیای معماری و طراحی خلق می‌کند. موفقیت ما در گرو استعداد، تخصص و هم‌افزایی اعضای تیم است.',
  	"vision_desc2" varchar DEFAULT 'مسیر خود را در شهرکرد آغاز کردیم تا با بهره‌گیری از دانش مهندسی و متخصصان مجرب، سطوحی با کیفیت تولید کنیم. برند ما با تلفیق هنر و صنعت شکل گرفته است تا هارمونی ظریفی از استحکام بی‌نظیر و زیبایی چشم‌نواز را به فضای دکوراسیون شما هدیه دهد.',
  	"gallery_tag" varchar DEFAULT 'نمایشگاه متریال',
  	"gallery_title" varchar DEFAULT 'روایت بافت، نور و جزئیات مهندسی',
  	"craftsmanship_tag" varchar DEFAULT 'طراحی و مهندسی',
  	"craftsmanship_title" varchar DEFAULT 'الهام‌گرفته از طبیعت، ساخته‌شده برای زندگی',
  	"craftsmanship_desc" varchar DEFAULT 'هر اسلب پرسیس کوارتز، بازتابی از شکوه طبیعت است که با دقت مهندسی بازآفرینی شده است. از رگه‌های ظریف و باشکوه کالاکاتا تا عمق رنگ‌های یکدست و مینیمال، محصولات ما با هدف پاسخگویی به پیچیده‌ترین نیازهای معماری داخلی و ارتقای سطح کیفی فضاهای مسکونی و تجاری طراحی می‌شوند. ما سنگ را نه به عنوان یک مصالح، بلکه به عنوان بوم نقاشی معماری می‌بینیم.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"desktop_poster_id" integer,
  	"desktop_video_id" integer,
  	"mobile_poster_id" integer,
  	"mobile_video_id" integer,
  	"info_cards_images_features_image_id" integer,
  	"info_cards_images_maintenance_image_id" integer,
  	"info_cards_images_catalogs_image_id" integer,
  	"info_cards_images_sample_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_locales" (
  	"tagline" varchar DEFAULT 'PERSIS QUARTZ',
  	"title" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "care_page_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_name" "enum_care_page_steps_icon_name" DEFAULT 'dot'
  );
  
  CREATE TABLE "care_page_steps_locales" (
  	"step_number" varchar,
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "care_page_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_type" "enum_care_page_rules_icon_type" DEFAULT 'dot'
  );
  
  CREATE TABLE "care_page_rules_locales" (
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "care_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "applications_page_showcase_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL,
  	"desktop_image_id" integer,
  	"mobile_image_id" integer
  );
  
  CREATE TABLE "applications_page_sections_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"val" varchar
  );
  
  CREATE TABLE "applications_page_sections_specs_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "applications_page_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"num" varchar NOT NULL,
  	"en_tag" varchar NOT NULL
  );
  
  CREATE TABLE "applications_page_sections_locales" (
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "applications_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_tag" varchar DEFAULT 'SPATIAL INTEGRATION',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "applications_page_locales" (
  	"header_title" varchar DEFAULT 'سطوحی فراتر از یک پوشش؛ خلق هارمونی در معماری معاصر' NOT NULL,
  	"header_desc" varchar DEFAULT 'تلفیق زیبایی بصری با مقاومت ساختاری؛ امکان خلق فضاهایی منحصربه‌فرد و هماهنگ با سبک‌های متنوع، از محیط‌های خانگی تا فضاهای عمومی و بهداشتی.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "applications_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "colors_locales" ADD CONSTRAINT "colors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."colors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vein_patterns_locales" ADD CONSTRAINT "vein_patterns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vein_patterns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "finishes_locales" ADD CONSTRAINT "finishes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."finishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_gallery_locales" ADD CONSTRAINT "products_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_color_family_id_colors_id_fk" FOREIGN KEY ("color_family_id") REFERENCES "public"."colors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_vein_pattern_id_vein_patterns_id_fk" FOREIGN KEY ("vein_pattern_id") REFERENCES "public"."vein_patterns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_thicknesses_fk" FOREIGN KEY ("thicknesses_id") REFERENCES "public"."thicknesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_finishes_fk" FOREIGN KEY ("finishes_id") REFERENCES "public"."finishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_dimensions_fk" FOREIGN KEY ("dimensions_id") REFERENCES "public"."dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "catalogs" ADD CONSTRAINT "catalogs_pdf_file_id_media_id_fk" FOREIGN KEY ("pdf_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "catalogs_locales" ADD CONSTRAINT "catalogs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."catalogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "dealers_locales" ADD CONSTRAINT "dealers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."dealers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_colors_fk" FOREIGN KEY ("colors_id") REFERENCES "public"."colors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vein_patterns_fk" FOREIGN KEY ("vein_patterns_id") REFERENCES "public"."vein_patterns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dimensions_fk" FOREIGN KEY ("dimensions_id") REFERENCES "public"."dimensions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_thicknesses_fk" FOREIGN KEY ("thicknesses_id") REFERENCES "public"."thicknesses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_finishes_fk" FOREIGN KEY ("finishes_id") REFERENCES "public"."finishes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_catalogs_fk" FOREIGN KEY ("catalogs_id") REFERENCES "public"."catalogs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dealers_fk" FOREIGN KEY ("dealers_id") REFERENCES "public"."dealers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_vision_image_id_media_id_fk" FOREIGN KEY ("vision_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_craftsmanship_image_id_media_id_fk" FOREIGN KEY ("craftsmanship_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_rels" ADD CONSTRAINT "about_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_rels" ADD CONSTRAINT "about_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_desktop_poster_id_media_id_fk" FOREIGN KEY ("desktop_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_desktop_video_id_media_id_fk" FOREIGN KEY ("desktop_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_mobile_poster_id_media_id_fk" FOREIGN KEY ("mobile_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_mobile_video_id_media_id_fk" FOREIGN KEY ("mobile_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_info_cards_images_features_image_id_media_id_fk" FOREIGN KEY ("info_cards_images_features_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_info_cards_images_maintenance_image_id_media_id_fk" FOREIGN KEY ("info_cards_images_maintenance_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_info_cards_images_catalogs_image_id_media_id_fk" FOREIGN KEY ("info_cards_images_catalogs_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_info_cards_images_sample_image_id_media_id_fk" FOREIGN KEY ("info_cards_images_sample_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "care_page_steps" ADD CONSTRAINT "care_page_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."care_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "care_page_steps_locales" ADD CONSTRAINT "care_page_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."care_page_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "care_page_rules" ADD CONSTRAINT "care_page_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."care_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "care_page_rules_locales" ADD CONSTRAINT "care_page_rules_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."care_page_rules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "care_page" ADD CONSTRAINT "care_page_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications_page_showcase_items" ADD CONSTRAINT "applications_page_showcase_items_desktop_image_id_media_id_fk" FOREIGN KEY ("desktop_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications_page_showcase_items" ADD CONSTRAINT "applications_page_showcase_items_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications_page_showcase_items" ADD CONSTRAINT "applications_page_showcase_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_page_sections_specs" ADD CONSTRAINT "applications_page_sections_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications_page_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_page_sections_specs_locales" ADD CONSTRAINT "applications_page_sections_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications_page_sections_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_page_sections" ADD CONSTRAINT "applications_page_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_page_sections_locales" ADD CONSTRAINT "applications_page_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications_page_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_page_locales" ADD CONSTRAINT "applications_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."applications_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_page_rels" ADD CONSTRAINT "applications_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."applications_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "applications_page_rels" ADD CONSTRAINT "applications_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_desktop_sizes_desktop_filename_idx" ON "media" USING btree ("sizes_desktop_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "colors_slug_idx" ON "colors" USING btree ("slug");
  CREATE INDEX "colors_updated_at_idx" ON "colors" USING btree ("updated_at");
  CREATE INDEX "colors_created_at_idx" ON "colors" USING btree ("created_at");
  CREATE UNIQUE INDEX "colors_locales_locale_parent_id_unique" ON "colors_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "vein_patterns_slug_idx" ON "vein_patterns" USING btree ("slug");
  CREATE INDEX "vein_patterns_updated_at_idx" ON "vein_patterns" USING btree ("updated_at");
  CREATE INDEX "vein_patterns_created_at_idx" ON "vein_patterns" USING btree ("created_at");
  CREATE UNIQUE INDEX "vein_patterns_locales_locale_parent_id_unique" ON "vein_patterns_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "dimensions_slug_idx" ON "dimensions" USING btree ("slug");
  CREATE INDEX "dimensions_updated_at_idx" ON "dimensions" USING btree ("updated_at");
  CREATE INDEX "dimensions_created_at_idx" ON "dimensions" USING btree ("created_at");
  CREATE UNIQUE INDEX "thicknesses_slug_idx" ON "thicknesses" USING btree ("slug");
  CREATE INDEX "thicknesses_updated_at_idx" ON "thicknesses" USING btree ("updated_at");
  CREATE INDEX "thicknesses_created_at_idx" ON "thicknesses" USING btree ("created_at");
  CREATE UNIQUE INDEX "finishes_slug_idx" ON "finishes" USING btree ("slug");
  CREATE INDEX "finishes_updated_at_idx" ON "finishes" USING btree ("updated_at");
  CREATE INDEX "finishes_created_at_idx" ON "finishes" USING btree ("created_at");
  CREATE UNIQUE INDEX "finishes_locales_locale_parent_id_unique" ON "finishes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_gallery_order_idx" ON "products_gallery" USING btree ("_order");
  CREATE INDEX "products_gallery_parent_id_idx" ON "products_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_image_idx" ON "products_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "products_gallery_locales_locale_parent_id_unique" ON "products_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_code_idx" ON "products" USING btree ("code");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_color_family_idx" ON "products" USING btree ("color_family_id");
  CREATE INDEX "products_vein_pattern_idx" ON "products" USING btree ("vein_pattern_id");
  CREATE INDEX "products_thumbnail_idx" ON "products" USING btree ("thumbnail_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_thicknesses_id_idx" ON "products_rels" USING btree ("thicknesses_id");
  CREATE INDEX "products_rels_finishes_id_idx" ON "products_rels" USING btree ("finishes_id");
  CREATE INDEX "products_rels_dimensions_id_idx" ON "products_rels" USING btree ("dimensions_id");
  CREATE UNIQUE INDEX "catalogs_slug_idx" ON "catalogs" USING btree ("slug");
  CREATE INDEX "catalogs_cover_image_idx" ON "catalogs" USING btree ("cover_image_id");
  CREATE INDEX "catalogs_pdf_file_idx" ON "catalogs" USING btree ("pdf_file_id");
  CREATE INDEX "catalogs_updated_at_idx" ON "catalogs" USING btree ("updated_at");
  CREATE INDEX "catalogs_created_at_idx" ON "catalogs" USING btree ("created_at");
  CREATE UNIQUE INDEX "catalogs_locales_locale_parent_id_unique" ON "catalogs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "dealers_province_idx" ON "dealers" USING btree ("province");
  CREATE INDEX "dealers_updated_at_idx" ON "dealers" USING btree ("updated_at");
  CREATE INDEX "dealers_created_at_idx" ON "dealers" USING btree ("created_at");
  CREATE UNIQUE INDEX "dealers_locales_locale_parent_id_unique" ON "dealers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_colors_id_idx" ON "payload_locked_documents_rels" USING btree ("colors_id");
  CREATE INDEX "payload_locked_documents_rels_vein_patterns_id_idx" ON "payload_locked_documents_rels" USING btree ("vein_patterns_id");
  CREATE INDEX "payload_locked_documents_rels_dimensions_id_idx" ON "payload_locked_documents_rels" USING btree ("dimensions_id");
  CREATE INDEX "payload_locked_documents_rels_thicknesses_id_idx" ON "payload_locked_documents_rels" USING btree ("thicknesses_id");
  CREATE INDEX "payload_locked_documents_rels_finishes_id_idx" ON "payload_locked_documents_rels" USING btree ("finishes_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_catalogs_id_idx" ON "payload_locked_documents_rels" USING btree ("catalogs_id");
  CREATE INDEX "payload_locked_documents_rels_dealers_id_idx" ON "payload_locked_documents_rels" USING btree ("dealers_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "about_page_vision_image_idx" ON "about_page" USING btree ("vision_image_id");
  CREATE INDEX "about_page_craftsmanship_image_idx" ON "about_page" USING btree ("craftsmanship_image_id");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_rels_order_idx" ON "about_page_rels" USING btree ("order");
  CREATE INDEX "about_page_rels_parent_idx" ON "about_page_rels" USING btree ("parent_id");
  CREATE INDEX "about_page_rels_path_idx" ON "about_page_rels" USING btree ("path");
  CREATE INDEX "about_page_rels_media_id_idx" ON "about_page_rels" USING btree ("media_id");
  CREATE INDEX "home_page_desktop_poster_idx" ON "home_page" USING btree ("desktop_poster_id");
  CREATE INDEX "home_page_desktop_video_idx" ON "home_page" USING btree ("desktop_video_id");
  CREATE INDEX "home_page_mobile_poster_idx" ON "home_page" USING btree ("mobile_poster_id");
  CREATE INDEX "home_page_mobile_video_idx" ON "home_page" USING btree ("mobile_video_id");
  CREATE INDEX "home_page_info_cards_images_info_cards_images_features_i_idx" ON "home_page" USING btree ("info_cards_images_features_image_id");
  CREATE INDEX "home_page_info_cards_images_info_cards_images_maintenanc_idx" ON "home_page" USING btree ("info_cards_images_maintenance_image_id");
  CREATE INDEX "home_page_info_cards_images_info_cards_images_catalogs_i_idx" ON "home_page" USING btree ("info_cards_images_catalogs_image_id");
  CREATE INDEX "home_page_info_cards_images_info_cards_images_sample_ima_idx" ON "home_page" USING btree ("info_cards_images_sample_image_id");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "care_page_steps_order_idx" ON "care_page_steps" USING btree ("_order");
  CREATE INDEX "care_page_steps_parent_id_idx" ON "care_page_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "care_page_steps_locales_locale_parent_id_unique" ON "care_page_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "care_page_rules_order_idx" ON "care_page_rules" USING btree ("_order");
  CREATE INDEX "care_page_rules_parent_id_idx" ON "care_page_rules" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "care_page_rules_locales_locale_parent_id_unique" ON "care_page_rules_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "care_page_media_idx" ON "care_page" USING btree ("media_id");
  CREATE INDEX "applications_page_showcase_items_order_idx" ON "applications_page_showcase_items" USING btree ("_order");
  CREATE INDEX "applications_page_showcase_items_parent_id_idx" ON "applications_page_showcase_items" USING btree ("_parent_id");
  CREATE INDEX "applications_page_showcase_items_desktop_image_idx" ON "applications_page_showcase_items" USING btree ("desktop_image_id");
  CREATE INDEX "applications_page_showcase_items_mobile_image_idx" ON "applications_page_showcase_items" USING btree ("mobile_image_id");
  CREATE INDEX "applications_page_sections_specs_order_idx" ON "applications_page_sections_specs" USING btree ("_order");
  CREATE INDEX "applications_page_sections_specs_parent_id_idx" ON "applications_page_sections_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "applications_page_sections_specs_locales_locale_parent_id_un" ON "applications_page_sections_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "applications_page_sections_order_idx" ON "applications_page_sections" USING btree ("_order");
  CREATE INDEX "applications_page_sections_parent_id_idx" ON "applications_page_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "applications_page_sections_locales_locale_parent_id_unique" ON "applications_page_sections_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "applications_page_locales_locale_parent_id_unique" ON "applications_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "applications_page_rels_order_idx" ON "applications_page_rels" USING btree ("order");
  CREATE INDEX "applications_page_rels_parent_idx" ON "applications_page_rels" USING btree ("parent_id");
  CREATE INDEX "applications_page_rels_path_idx" ON "applications_page_rels" USING btree ("path");
  CREATE INDEX "applications_page_rels_media_id_idx" ON "applications_page_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "colors" CASCADE;
  DROP TABLE "colors_locales" CASCADE;
  DROP TABLE "vein_patterns" CASCADE;
  DROP TABLE "vein_patterns_locales" CASCADE;
  DROP TABLE "dimensions" CASCADE;
  DROP TABLE "thicknesses" CASCADE;
  DROP TABLE "finishes" CASCADE;
  DROP TABLE "finishes_locales" CASCADE;
  DROP TABLE "products_gallery" CASCADE;
  DROP TABLE "products_gallery_locales" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "catalogs" CASCADE;
  DROP TABLE "catalogs_locales" CASCADE;
  DROP TABLE "dealers" CASCADE;
  DROP TABLE "dealers_locales" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP TABLE "about_page_rels" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "care_page_steps" CASCADE;
  DROP TABLE "care_page_steps_locales" CASCADE;
  DROP TABLE "care_page_rules" CASCADE;
  DROP TABLE "care_page_rules_locales" CASCADE;
  DROP TABLE "care_page" CASCADE;
  DROP TABLE "applications_page_showcase_items" CASCADE;
  DROP TABLE "applications_page_sections_specs" CASCADE;
  DROP TABLE "applications_page_sections_specs_locales" CASCADE;
  DROP TABLE "applications_page_sections" CASCADE;
  DROP TABLE "applications_page_sections_locales" CASCADE;
  DROP TABLE "applications_page" CASCADE;
  DROP TABLE "applications_page_locales" CASCADE;
  DROP TABLE "applications_page_rels" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_products_is_in_stock";
  DROP TYPE "public"."enum_catalogs_catalog_type";
  DROP TYPE "public"."enum_catalogs_status";
  DROP TYPE "public"."enum_dealers_province";
  DROP TYPE "public"."enum_dealers_status";
  DROP TYPE "public"."enum_inquiries_type";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_care_page_steps_icon_name";
  DROP TYPE "public"."enum_care_page_rules_icon_type";`)
}
