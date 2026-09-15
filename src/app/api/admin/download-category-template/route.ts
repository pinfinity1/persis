// src/app/api/admin/download-category-template/route.ts
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const sampleData = [
    {
      slug: "mono-color",
      order: 1,
      title_fa: "مونو کالر",
      title_en: "Mono Color",
      title_ar: "مونو كولور",
    },
    {
      slug: "vein-effect",
      order: 2,
      title_fa: "وین افکت",
      title_en: "Vein Effect",
      title_ar: "فين إفكت",
    },
    {
      slug: "calacatta",
      order: 3,
      title_fa: "کالاکاتا",
      title_en: "Calacatta",
      title_ar: "كلاكاتا",
    },
  ];

  const guideData = [
    {
      "نام ستون (Header)": "slug",
      وضعیت: "اجباری",
      توضیح:
        "شناسه انگلیسی دسته‌بندی برای URL و فیلتر سایت (فقط حروف کوچک و خط تیره).",
      "نمونه مقدار مجاز": "mono-color یا vein-effect یا calacatta",
    },
    {
      "نام ستون (Header)": "order",
      وضعیت: "اختیاری",
      توضیح:
        "ترتیب اولویت نمایش در تب‌ها و منوها (عدد ۱ اولویت اول، عدد ۲ اولویت دوم و...).",
      "نمونه مقدار مجاز": "1 یا 2 یا 3",
    },
    {
      "نام ستون (Header)": "title_fa / title_en / title_ar",
      وضعیت: "اجباری",
      توضیح: "نام دسته‌بندی به تفکیک زبان‌های فارسی، انگلیسی و عربی.",
      "نمونه مقدار مجاز": "مونو کالر / Mono Color / مونو كولور",
    },
  ];

  const workbook = XLSX.utils.book_new();

  const worksheetData = XLSX.utils.json_to_sheet(sampleData);
  XLSX.utils.book_append_sheet(workbook, worksheetData, "Categories Template");

  const worksheetGuide = XLSX.utils.json_to_sheet(guideData);
  XLSX.utils.book_append_sheet(
    workbook,
    worksheetGuide,
    "راهنمای تکمیل (Guide)",
  );

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="PersisQuartz_Categories_Template.xlsx"',
    },
  });
}
