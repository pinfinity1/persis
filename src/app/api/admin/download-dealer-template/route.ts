import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const sampleData = [
    {
      province: "تهران",
      city_fa: "تهران",
      city_en: "Tehran",
      city_ar: "طهران",
      title_fa: "شوروم مرکزی پرسیس (فرمانیه)",
      title_en: "Persis Central Showroom (Farmanieh)",
      title_ar: "صالة عرض برسيس المركزية (فرمانية)",
      address_fa: "تهران، خیابان فرمانیه، نرسیده به دیباجی، پلاک ۲۰",
      address_en: "No. 20, Farmanieh Ave, Before Dibaji St, Tehran, Iran",
      address_ar: "طهران، شارع فرمانية، قبل شارع ديباجي، رقم ۲۰",
      phone: "021-22889900",
      order: 1,
    },
    {
      province: "اصفهان",
      city_fa: "اصفهان",
      city_en: "Isfahan",
      city_ar: "أصفهان",
      title_fa: "عاملیت مجاز اصفهان (سنگ سپاهان)",
      title_en: "Isfahan Authorized Center (Sepahan Stone)",
      title_ar: "وكالة أصفهان المعتمدة (حجر سباهان)",
      address_fa: "اصفهان، خیابان شیخ کلینی، مجتمع مروارید، واحد ۴",
      address_en: "Unit 4, Morvarid Complex, Sheikh Koleini St, Isfahan, Iran",
      address_ar: "أصفهان، شارع الشيخ كليني، مجمع مرواريد، شقة ۴",
      phone: "031-36654321",
      order: 2,
    },
  ];

  const guideData = [
    {
      "نام ستون (Header)": "province",
      وضعیت: "اجباری",
      توضیح: "نام استان یا اسلاگ استان (مثلاً: تهران یا اصفهان).",
    },
    {
      "نام ستون (Header)": "city_fa / city_en / city_ar",
      وضعیت: "اجباری",
      توضیح: "نام شهر به ۳ زبان.",
    },
    {
      "نام ستون (Header)": "title_fa / title_en / title_ar",
      وضعیت: "اجباری",
      توضیح: "نام عاملیت یا شوروم به ۳ زبان.",
    },
    {
      "نام ستون (Header)": "address_fa / address_en / address_ar",
      وضعیت: "اجباری",
      توضیح: "آدرس کامل فیزیکی به ۳ زبان.",
    },
    {
      "نام ستون (Header)": "phone",
      وضعیت: "اجباری",
      توضیح: "شماره تماس دفتر یا عاملیت.",
    },
    {
      "نام ستون (Header)": "order",
      وضعیت: "اختیاری",
      توضیح: "ترتیب اولویت نمایش.",
    },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(sampleData),
    "Dealers Template",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(guideData),
    "راهنمای تکمیل (Guide)",
  );

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="PersisQuartz_Dealers_Template.xlsx"',
    },
  });
}
