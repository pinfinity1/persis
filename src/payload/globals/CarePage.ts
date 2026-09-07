// src/payload/globals/CarePage.ts
import type { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

const ICON_OPTIONS = [
  { label: "● نقطه مینیمال لوکس (پیش‌فرض)", value: "dot" },

  // نگهداری و متریال
  { label: "قطره آب / شستشو (Droplets)", value: "droplets" },
  { label: "تأیید و نظافت اولیه (CheckCheck)", value: "checkCheck" },
  { label: "شیلد و ایمنی (Shield)", value: "shieldCheck" },
  { label: "درخشش و جلای سطح (Sparkles)", value: "sparkles" },
  { label: "اسپری شوینده (Spray)", value: "spray" },
  { label: "برس نظافت (Brush)", value: "brush" },
  { label: "حرارت مستقیم / شعله (Flame)", value: "flame" },
  { label: "دماسنج و شوک حرارتی (Heat)", value: "heat" },
  { label: "ظروف داغ و قابلمه (Cooking Pot)", value: "cookingPot" },
  { label: "چاقو و تخته برش (Utensils)", value: "utensils" },
  { label: "آشپزی و سرآشپز (Chef Hat)", value: "chefHat" },
  { label: "محافظت در برابر خط و خش (Scratch)", value: "scratch" },
  { label: "مواد شیمیایی و اسیدها (Chemical)", value: "chemical" },
  { label: "ضربه فیزیکی به لبه‌ها (Impact)", value: "impact" },
  { label: "ضربه فیزیکی و چکش (Hammer)", value: "hammer" },
  { label: "ممنوعیت و اخطار (Ban)", value: "ban" },

  // ایموجی‌های تاییدشده
  { label: "بادکنک (Balloon)", value: "balloon" },
  { label: "قدرت و استحکام (Bicep)", value: "bicep" },
  { label: "ربات هوشمند (Bot)", value: "bot" },
  { label: "تاج (Crown)", value: "crown" },
  { label: "قلعه و رخ (Castle)", value: "castle" },
  { label: "ماسک تئاتر (Drama)", value: "drama" },
  { label: "روح (Ghost)", value: "ghost" },
  { label: "ناراحت (Frown)", value: "frown" },
  { label: "خنثی (Meh)", value: "meh" },
  { label: "خنده (Laugh)", value: "laugh" },
  { label: "لبخند (Smile)", value: "smile" },
  { label: "کلافه (Annoyed)", value: "annoyed" },
  { label: "لبخند پلاس (Smile Plus)", value: "smilePlus" },
  { label: "دست (Hand)", value: "hand" },
  { label: "یاری و کمک (Hand Helping)", value: "handHelping" },
  { label: "قلب (Heart)", value: "heart" },
  { label: "قلب شکسته (Heart Crack)", value: "heartCrack" },
  { label: "ضربان قلب (Heart Pulse)", value: "heartPulse" },
  { label: "برگ سبز / طبیعی (Leaf)", value: "leaf" },
  { label: "جشن و تکمیل (Party Popper)", value: "partyPopper" },
  { label: "روبان (Ribbon)", value: "ribbon" },
  { label: "سالاد و سبزیجات (Salad)", value: "salad" },
  { label: "ستاره (Star)", value: "star" },
  { label: "نیم ستاره (Star Half)", value: "starHalf" },
  { label: "بدون ستاره (Star Off)", value: "starOff" },
  { label: "دیس‌لایک (Thumbs Down)", value: "thumbsDown" },
  { label: "لایک و تایید (Thumbs Up)", value: "thumbsUp" },
  { label: "امواج دریا (Waves)", value: "waves" },
];

export const CarePage: GlobalConfig = {
  slug: "care-page",
  label: "صفحه نگهداری و مراقبت (Care & Maintenance)",
  admin: {
    group: "Pages",
    description: "مدیریت تصویر، مراحل آکاردئون و هشدارهای مراقبتی",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        try {
          revalidateTag("care-page");
        } catch (err) {
          console.warn("Revalidate error on CarePage:", err);
        }
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "دستورالعمل‌ها (Routine Care)",
          fields: [
            {
              name: "media",
              type: "upload",
              relationTo: "media",
              label:
                "تصویر کنار آکاردئون (در صورت خالی بودن، لوگو نشان داده می‌شود)",
            },
            {
              name: "steps",
              type: "array",
              label: "مراحل نظافت و نگهداری",
              minRows: 1,
              defaultValue: [
                {
                  stepNumber: "مرحله اول • پس از نصب",
                  iconName: "checkCheck",
                  title: "اولین نظافت پس از نصب",
                  desc: "پس از اتمام نصب، تمام سطح را با آب گرم، شوینده ملایم و یک دستمال مایکروفایبر یا اسفنج غیرساینده تمیز کرده و سپس کاملاً خشک نمایید تا ذرات و گردوغبار نصبی پاک شوند.",
                },
                {
                  stepNumber: "مرحله دوم • نگهداری روزمره",
                  iconName: "droplets",
                  title: "نظافت و شستشوی روزمره",
                  desc: "برای پاکسازی روزانه تنها مقداری آب گرم و چند قطره مایع شوینده ملایم (فاقد چربی یا روغن‌های گیاهی) کافی است. جهت جلوگیری از تشکیل رسوبات آهکی آب، سطح را پس از شستشو با دستمال خشک کنید.",
                },
                {
                  stepNumber: "مرحله سوم • رفع لکه‌ها",
                  iconName: "shieldCheck",
                  title: "مقابله با لکه‌های سخت و خشک‌شده",
                  desc: "لکه‌های چای، قهوه، سرکه یا روغن را در سریع‌ترین زمان پاک کنید. برای لکه‌های سرسخت، از یک شوینده استاندارد غیرساینده با حرکات ملایم دایره‌ای استفاده نموده و سپس سطح را آبکشی و خشک نمایید.",
                },
              ],
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "stepNumber",
                      type: "text",
                      label: "شماره یا برچسب مرحله (اختیاری - مثل STEP 01)",
                      localized: true,
                      admin: { width: "50%" },
                    },
                    {
                      name: "iconName",
                      type: "select",
                      label: "آیکون مرحله",
                      defaultValue: "dot",
                      options: ICON_OPTIONS,
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  name: "title",
                  type: "text",
                  label: "عنوان مرحله",
                  localized: true,
                  required: true,
                },
                {
                  name: "desc",
                  type: "textarea",
                  label: "شرح و توضیحات مرحله",
                  localized: true,
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "هشدارهای مراقبتی (Preventive Rules)",
          fields: [
            {
              name: "rules",
              type: "array",
              label: "کارت‌های هشدار و مراقبت",
              minRows: 1,
              defaultValue: [
                {
                  iconType: "scratch",
                  title: "محافظت در برابر سایش و خط",
                  desc: "اگرچه کوارتز با درجه سختی ۷ موهس از سخت‌ترین کانی‌هاست، همواره از تخته برش آشپزخانه استفاده کنید و از کشیدن مستقیم تیغه‌ها و وسایل بسیار سنگین و تیز روی آن بپرهیزید.",
                },
                {
                  iconType: "heat",
                  title: "محافظت در برابر شوک حرارتی",
                  desc: "از قرار دادن مستقیم قابلمه، ماهیتابه یا ظروف داغی که از روی شعله یا فر برداشته شده‌اند خودداری فرمایید. همواره از زیرقابلمه‌ای یا پدهای محافظ حرارتی استفاده کنید.",
                },
                {
                  iconType: "chemical",
                  title: "مواد شیمیایی آسیب‌رسان و حلال‌ها",
                  desc: "از تماس سطح با حلال‌های صنعتی قوی، تینر، استون غلیظ، رنگ‌برها، اسید هیدروفلوئوریک و ترکیبات تری‌کلرواتان و جوهر نمک غلیظ خودداری کنید. در صورت تماس تصادفی، فوراً با آب فراوان شستشو دهید.",
                },
                {
                  iconType: "impact",
                  title: "مراقبت از سلامت لبه‌ها و گوشه‌ها",
                  desc: "از وارد آوردن ضربه‌های ناگهانی و سنگین با اجسام فلزی یا ابزار سنگین به لبه‌های ابزارخورده، پخ‌ها و گوشه‌های برش‌خورده دور سینک و کانترتاپ پرهیز نمایید.",
                },
              ],
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "title",
                      type: "text",
                      label: "عنوان هشدار",
                      localized: true,
                      required: true,
                      admin: { width: "50%" },
                    },
                    {
                      name: "iconType",
                      type: "select",
                      label: "آیکون هشدار",
                      defaultValue: "dot",
                      options: ICON_OPTIONS,
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  name: "desc",
                  type: "textarea",
                  label: "شرح هشدار",
                  localized: true,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
