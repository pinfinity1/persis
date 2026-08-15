import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
    group: "Catalog",
    defaultColumns: ["title", "code", "category", "is_in_stock", "updatedAt"],
    components: {
      beforeListTable: [
        "@/components/admin/ExcelProductImportControl#ExcelProductImportControl",
      ],
    },
  },
  access: { read: () => true },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true, // نام مدل چندزبانه (فارسی و انگلیسی)
      admin: {
        description: "نام مدل سنگ (مثلاً: مه البرز / Alborz Mist)",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "اسلاگ سئو برای URL (مثلاً: alborz-mist)",
      },
    },
    {
      name: "code",
      type: "text",
      required: true,
      index: true,
      admin: {
        description: "کد اختصاصی سنگ (مثلاً: PQ-202)",
      },
    },
    // ۱. دسته‌بندی اصلی (سری‌ها)
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      admin: { description: "سری/دسته‌بندی سنگ (تک‌رنگ، رگه‌دار، کالاکاتا)" },
    },
    // ۲. طیف رنگی (دینامیک)
    {
      name: "color_family",
      type: "relationship",
      relationTo: "colors",
      required: true,
      admin: { description: "طیف رنگی اصلی سنگ" },
    },
    // ۳. الگوی رگه (دینامیک - اختیاری برای سنگ‌های رگه‌دار)
    {
      name: "vein_pattern",
      type: "relationship",
      relationTo: "vein-patterns",
      admin: {
        description: "الگوی رگه (مثلاً رگه نازک، رگه ضخیم، ابر و بادی)",
      },
    },
    // ۴. وضعیت تأمین B2B
    {
      name: "is_in_stock",
      type: "select",
      defaultValue: "in_stock",
      options: [
        { label: "موجود در انبار / تحویل فوری (In Stock)", value: "in_stock" },
        {
          label: "تولید سفارشی / استعلام زمان (On Demand)",
          value: "on_demand",
        },
        { label: "توقف تولید / آرشیو (Discontinued)", value: "discontinued" },
      ],
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      required: false,
      admin: { description: "تصویر اصلی و تمام‌قد اسلب (Full Slab Scan)" },
    },
    {
      name: "gallery",
      type: "array",
      admin: {
        description: "گالری اسلایدر تصاویر (بافت نزدیک و اجرا در محیط)",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          type: "text",
          localized: true,
          admin: { description: "توضیح تصویر (مثلاً: اجرا در کانتر آشپزخانه)" },
        },
      ],
    },
    // ۵. ضخامت‌های استاندارد با گام‌های ۱ میلی‌متری (۱۰mm تا ۳۰mm)
    {
      name: "available_thicknesses",
      type: "select",
      hasMany: true,
      options: [
        { label: "10mm (1.0 cm)", value: "10mm" },
        { label: "11mm (1.1 cm)", value: "11mm" },
        { label: "12mm (1.2 cm)", value: "12mm" },
        { label: "13mm (1.3 cm)", value: "13mm" },
        { label: "14mm (1.4 cm)", value: "14mm" },
        { label: "15mm (1.5 cm)", value: "15mm" },
        { label: "16mm (1.6 cm)", value: "16mm" },
        { label: "17mm (1.7 cm)", value: "17mm" },
        { label: "18mm (1.8 cm)", value: "18mm" },
        { label: "19mm (1.9 cm)", value: "19mm" },
        { label: "20mm (2.0 cm)", value: "20mm" },
        { label: "21mm (2.1 cm)", value: "21mm" },
        { label: "22mm (2.2 cm)", value: "22mm" },
        { label: "23mm (2.3 cm)", value: "23mm" },
        { label: "24mm (2.4 cm)", value: "24mm" },
        { label: "25mm (2.5 cm)", value: "25mm" },
        { label: "26mm (2.6 cm)", value: "26mm" },
        { label: "27mm (2.7 cm)", value: "27mm" },
        { label: "28mm (2.8 cm)", value: "28mm" },
        { label: "29mm (2.9 cm)", value: "29mm" },
        { label: "30mm (3.0 cm)", value: "30mm" },
      ],
      defaultValue: ["12mm", "20mm"],
    },
    {
      name: "custom_thickness_available",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "امکان سفارش تولید با ضخامت خاص سفارشی" },
    },
    // ۶. پرداخت‌های سطح پیش‌بینی‌شده برای آینده
    {
      name: "finishes",
      type: "select",
      hasMany: true,
      options: [
        { label: "براق (Polished)", value: "polished" },
        { label: "مات (Honed / Matt)", value: "honed" },
        { label: "بافت‌دار (Textured / Suede)", value: "textured" },
        { label: "چرمی (Leathered)", value: "leathered" },
      ],
      defaultValue: ["polished"],
    },
    // ۷. ابعاد اسلب (ارتباط دینامیک با کلکشن Dimensions)
    {
      name: "dimensions",
      type: "relationship",
      relationTo: "dimensions",
      hasMany: true,
      admin: {
        description: "ابعاد قابل عرضه اسلب (امکان انتخاب ابعاد جدید در آینده)",
      },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      admin: { description: "توضیحات معمارانه و سئومحور سنگ" },
    },
  ],
};
