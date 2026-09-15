// src/app/api/admin/download-product-template/route.ts
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const sampleData = [
    {
      code: "1100",
      slug: "dover",
      title_fa: "داور",
      title_en: "Dover",
      title_ar: "دوفر",
      description_fa:
        "الهام‌گرفته از صخره‌های گچی و افق سپید داور؛ مظهر پاکی مطلق و خلوص هندسی در معماری مدرن. سفیدی یکدست و عمیق بدون کوچک‌ترین تداخل بصری، نور محیط را به زیبایی بازتاب داده و گستره‌ای آرام، دلباز و پیوسته در جزیره و کانترتاپ خلق می‌کند.",
      description_en:
        "Inspired by the timeless White Cliffs of Dover; a manifestation of pure minimalism and architectural purity. Its seamless, uniform white surface reflects light gracefully, evoking a sense of calm, luminous expansion across modern interior spaces.",
      description_ar:
        "مستوحى من منحدرات دوفر البيضاء الخالدة؛ تجسيد للنقاء المطلق والبساطة المعمارية الراقية. يعكس سطحه الأبيض الموحد الضوء بانسيابية فائقة ليمنح المساحات رحابة استثنائية وسكوناً بصرياً ملهماً.",
    },
    {
      code: "1600",
      slug: "eclipse",
      title_fa: "اکلیپس",
      title_en: "Eclipse",
      title_ar: "إكليبس",
      description_fa:
        "روایتی از شکوه کسوف و تلاقی سایه‌های کهکشانی؛ مشکی عمیق، یکدست و مقتدر. این سطح تیره و بی‌نقص، نقطه‌ی کانونی دکوراسیون‌های لوکس است که با تضاد بصری خیره‌کننده در کنار چوب و استیل، حس وقار و جاودانگی را دیکته می‌کند.",
      description_en:
        "An ode to the dramatic cosmic eclipse; deep, velvety, and commanding black. This uninterrupted dark canvas serves as the anchor of luxurious interiors, creating bold contrasts alongside wood and steel.",
      description_ar:
        "تجسيد لمهابة الكسوف الكوني وتلاقي الظلال الساحرة؛ أسود مخملي عميق ينبض بالقوة والأناقة. يمنح التصاميم الفاخرة تبايناً درامياً آسراً يتناغم بفخامة مع الخشب الطبيعي والفولاذ المقاوم للصدأ.",
    },
    {
      code: "2106",
      slug: "aland",
      title_fa: "الند",
      title_en: "Aland",
      title_ar: "ألاند",
      description_fa:
        "بازتابی از نخستین پرتوهای سیمین صبحگاه بر فراز صخره‌های مه‌گرفته؛ تلفیق آرامش‌بخش سپیدی کریستالی با سایه‌روشن‌های ابری و ملایم. بافت سیال الند بدون داشتن خطوط تیز، حسی از نرمی آب و طراوت طبیعت شمالی را به قلب فضا می‌آورد.",
      description_en:
        "Capturing the gentle silver glow of northern dawn over misty archipelagoes; serene crystalline white infused with soft, drifting cloud-like undertones. A harmonious, flowing canvas designed for serene living.",
      description_ar:
        "انعكاس لأولى خيوط الفجر الفضي فوق التموجات الضبابية؛ تمازج هادئ بين البياض البلوري والظلال السحابية الناعمة ليضفي على المكان هدوءاً انسيابياً وسحراً طبيعياً خلاباً.",
    },
    {
      code: "2601",
      slug: "caspian",
      title_fa: "کاسپین",
      title_en: "Caspian",
      title_ar: "كاسبيان",
      description_fa:
        "روایتی زنده از تلاطم آرام امواج در ساحل مه‌آلود کاسپین؛ بازی لطیف سایه‌روشن‌های طوسی و نقره‌ای بر پهنه‌ای خنثی و باوقار. کاسپین به فضا عمق، سکون و جلوه‌ای بی‌انتها می‌بخشد و هارمونی کاملی میان طبیعت سیال و معماری مدرن پدید می‌آورد.",
      description_en:
        "Echoing the gentle surge of misty waters along the serene Caspian shore; a subtle interplay of silvery grays and soft shadowy tones. Caspian brings profound tranquility, depth, and timeless grace to modern architectural spaces.",
      description_ar:
        "تجسيد لانسياب أمواج بحر قزوين الهادئة تحت سماء ضبابية؛ تمازج راقٍ بين التدرجات الرمادية والفضية يضفي على المكان عمقاً وسكينة وأناقة معاصرة خالدة.",
    },
    {
      code: "3103",
      slug: "arctic",
      title_fa: "آرکتیک",
      title_en: "Arctic",
      title_ar: "آركتيك",
      description_fa:
        "تندیسی از پهنه‌های یخ‌بسته قطب شمال؛ زمینه‌ای سپید و درخشان چون بلور برف که رگه‌های مویین، باریک و برنده خاکستری-مشکی از میان آن عبور کرده‌اند. کنتراستی ظریف و مدرن بر مبنای الگوی کالاکاتا برای فضاهایی سرشار از نور و درخشش.",
      description_en:
        "A crystalline homage to polar ice fields; pure luminous white traversed by razor-thin, delicate charcoal fractures. The pinnacle of modern Calacatta aesthetics, infusing architecture with crisp elegance.",
      description_ar:
        "تحفة مستوحاة من الامتدادات الجليدية للقطب الشمالي؛ أرضية بيضاء ساطعة تتقاطع معها شقوق شعرية ناعمة ودقيقة باللون الرمادي الداكن، لتعيد تعريف فخامة الكالاكاتا بلمسة عصرية نقية.",
    },
    {
      code: "3108",
      slug: "zarshouran",
      title_fa: "زرشوران",
      title_en: "Zarshouran",
      title_ar: "زرشوران",
      description_fa:
        "الهام‌گرفته از گنجینه کهن زرشوران؛ پهنه‌ای سفید، درخشان و خالص که رگه‌های اصیل طلایی با ظرافتی شاهانه در سراسر آن تنیده شده‌اند. زرشوران شکوه و درخشش سنگ‌های قیمتی را با دوام مهندسی‌شده کوارتز به فضاهای لوکس پیشکش می‌کند.",
      description_en:
        "Inspired by the legendary treasures of Zarshouran; a pure, radiant white canvas graced with regal veins of authentic gold. Zarshouran infuses luxury interiors with the prestigious majesty of classical marble.",
      description_ar:
        "مستلهم من كنوز زرشوران الأسطورية؛ أرضية بيضاء ناصعة ومشرقة تتوشح بتعريقات ذهبية فاخرة تنبض بالهيبة والجمال، لتهدي المساحات الراقية فخامة ملكية متوارثة.",
    },
    {
      code: "3301",
      slug: "zagos-strom",
      title_fa: "زاگرس استروم",
      title_en: "Zagos Strom",
      title_ar: "زاغروس ستروم",
      description_fa:
        "تصویری نفس‌گیر از غرّش رعد و برق در آسمان تاریک و توفانی کوهستان‌های زاگرس؛ رگه‌های پرصلابت، شکسته و دراماتیک که همچون آذرخش بر بستر ابرهای تیره فرود آمده‌اند. انتخابی جسورانه و پرانرژی برای اسلب‌های بوک‌مچ و دیواره‌های اصلی.",
      description_en:
        "Capturing the raw power of thunder and lightning across the stormy, darkened skies of the Zagros peaks; bold, electric veining cutting dramatically through moody depths. A daring statement engineered for striking bookmatch feature walls.",
      description_ar:
        "لوحة مذهلة تحاكي وميض البرق وهدير الرعد في سماء زاغروس المظلمة والعاصفة؛ تعريقات درامية قوية كالشهب تشق الظلال المهيبة، لتقديم خيار جريء مفعم بالطاقة لتصاميم البوك ماتش والواجهات الفاخرة.",
    },
    {
      code: "3601",
      slug: "baikal",
      title_fa: "بایکال",
      title_en: "Baikal",
      title_ar: "بايكال",
      description_fa:
        "راز کهن عمیق‌ترین و زلال‌ترین پهنه آبی جهان؛ سفیدی عمیق و چندبعدی با شبکه‌ای از رگه‌های دودی و خطوط کریستالی شبیه ترک‌های روی دریاچه یخ‌زده. هر نگاه به بایکال، کشف لایه‌ای نو از عمق، ظرافت و سکوت بی‌پایان است.",
      description_en:
        "Unveiling the mystery of the world's deepest glacial lake; multi-layered crystalline depths embraced by smoky fractures and intricate frozen lattices. An evocative centerpiece of contemplative luxury.",
      description_ar:
        "سر أعمق بحيرات العالم وأنقاها تجلياً في حجر متقن؛ عمق بلوري ساحر تكتنفه تعريقات دخانية وشبكات جليدية متبلورة تدعو إلى التأمل وتمنح المكان فخامة استثنائية هادئة.",
    },
  ];

  const guideData = [
    {
      "نام ستون (Header)": "code",
      وضعیت: "اجباری",
      توضیح:
        "کد اختصاصی سنگ در کارخانه (مانند 1100 یا 2106). کلید اصلی یکتا برای درج یا به‌روزرسانی هوشمند است.",
      "نمونه مقدار مجاز": "1100 یا 2106",
    },
    {
      "نام ستون (Header)": "slug",
      وضعیت: "اجباری",
      توضیح:
        "شناسه انگلیسی سنگ در آدرس وب‌سایت (تنها حروف کوچک انگلیسی و بدون فاصله).",
      "نمونه مقدار مجاز": "dover یا aland",
    },
    {
      "نام ستون (Header)": "title_fa / title_en / title_ar",
      وضعیت: "اجباری",
      توضیح: "نام تجاری طرح به تفکیک زبان‌های فارسی، انگلیسی و عربی.",
      "نمونه مقدار مجاز": "داور / Dover / دوفر",
    },
    {
      "نام ستون (Header)": "description_fa / description_en / description_ar",
      وضعیت: "اختیاری",
      توضیح: "متن کانسپت، روایت بصری و ویژگی‌های معماری سنگ به ۳ زبان.",
      "نمونه مقدار مجاز": "الهام‌گرفته از صخره‌های...",
    },
    {
      "نام ستون (Header)": "دسته‌بندی، رنگ و الگو",
      وضعیت: "در پنل ادمین",
      توضیح:
        "پس از بارگذاری اکسل، وارد ویرایش هر محصول شده و دسته‌بندی، طیف رنگ و الگوی رگه را از منوی کشویی متصل انتخاب فرمایید.",
      "نمونه مقدار مجاز": "داشبورد ادمین",
    },
    {
      "نام ستون (Header)": "ابعاد، ضخامت و فینیش",
      وضعیت: "استاندارد کارخانه",
      توضیح:
        "ابعاد و ضخامت‌های تولیدی به صورت خودکار با استانداردهای خط تولید مقداردهی می‌شوند و نیازی به ورود در اکسل ندارند.",
      "نمونه مقدار مجاز": "-",
    },
  ];

  const workbook = XLSX.utils.book_new();

  const worksheetData = XLSX.utils.json_to_sheet(sampleData);
  XLSX.utils.book_append_sheet(workbook, worksheetData, "Products Template");

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
        'attachment; filename="PersisQuartz_Products_Template.xlsx"',
    },
  });
}
