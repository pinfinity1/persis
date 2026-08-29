export interface ProvinceDefinition {
  slug: string;
  fa: string;
  en: string;
  ar: string;
}

export const IRAN_PROVINCES: ProvinceDefinition[] = [
  { slug: "alborz", fa: "البرز", en: "Alborz", ar: "ألبرز" },
  { slug: "ardabil", fa: "اردبیل", en: "Ardabil", ar: "أردبيل" },
  {
    slug: "azerbaijan-east",
    fa: "آذربایجان شرقی",
    en: "East Azerbaijan",
    ar: "أذربيجان الشرقية",
  },
  {
    slug: "azerbaijan-west",
    fa: "آذربایجان غربی",
    en: "West Azerbaijan",
    ar: "أذربيجان الغربية",
  },
  { slug: "bushehr", fa: "بوشهر", en: "Bushehr", ar: "بوشهر" },
  {
    slug: "chaharmahal-and-bakhtiari",
    fa: "چهارمحال و بختیاری",
    en: "Chaharmahal and Bakhtiari",
    ar: "تشهارمحال وبختياري",
  },
  { slug: "fars", fa: "فارس", en: "Fars", ar: "فارس" },
  { slug: "gilan", fa: "گیلان", en: "Gilan", ar: "جيلان" },
  { slug: "golestan", fa: "گلستان", en: "Golestan", ar: "جلستان" },
  { slug: "hamadan", fa: "همدان", en: "Hamadan", ar: "همدان" },
  { slug: "hormozgan", fa: "هرمزگان", en: "Hormozgan", ar: "هرمزغان" },
  { slug: "ilam", fa: "ایلام", en: "Ilam", ar: "إيلام" },
  { slug: "isfahan", fa: "اصفهان", en: "Isfahan", ar: "أصفهان" },
  { slug: "kerman", fa: "کرمان", en: "Kerman", ar: "كرمان" },
  { slug: "kermanshah", fa: "کرمانشاه", en: "Kermanshah", ar: "كرمانشاه" },
  {
    slug: "khorasan-north",
    fa: "خراسان شمالی",
    en: "North Khorasan",
    ar: "خراسان الشمالية",
  },
  {
    slug: "khorasan-razavi",
    fa: "خراسان رضوی",
    en: "Razavi Khorasan",
    ar: "خراسان الرضوية",
  },
  {
    slug: "khorasan-south",
    fa: "خراسان جنوبی",
    en: "South Khorasan",
    ar: "خراسان الجنوبية",
  },
  { slug: "khuzestan", fa: "خوزستان", en: "Khuzestan", ar: "خوزستان" },
  {
    slug: "kohgiluyeh-and-boyer-ahmad",
    fa: "کهگیلویه و بویراحمد",
    en: "Kohgiluyeh and Boyer-Ahmad",
    ar: "كهكيلويه وبوير أحمد",
  },
  { slug: "kurdistan", fa: "کردستان", en: "Kurdistan", ar: "كردستان" },
  { slug: "lorestan", fa: "لرستان", en: "Lorestan", ar: "لرستان" },
  { slug: "markazi", fa: "مرکزی", en: "Markazi", ar: "مركزي" },
  { slug: "mazandaran", fa: "مازندران", en: "Mazandaran", ar: "مازندران" },
  { slug: "qazvin", fa: "قزوین", en: "Qazvin", ar: "قزوين" },
  { slug: "qom", fa: "قم", en: "Qom", ar: "قم" },
  { slug: "semnan", fa: "سمنان", en: "Semnan", ar: "سمنان" },
  {
    slug: "sistan-and-baluchestan",
    fa: "سیستان و بلوچستان",
    en: "Sistan and Baluchestan",
    ar: "سيستان وبلوشستان",
  },
  { slug: "tehran", fa: "تهران", en: "Tehran", ar: "طهران" },
  { slug: "yazd", fa: "یزد", en: "Yazd", ar: "يزد" },
  { slug: "zanjan", fa: "زنجان", en: "Zanjan", ar: "زنجان" },
];

export function normalizeProvinceToSlug(input: string): string {
  const clean = input.trim().toLowerCase();
  const match = IRAN_PROVINCES.find(
    (p) =>
      p.slug === clean ||
      p.fa === input.trim() ||
      p.en.toLowerCase() === clean ||
      p.ar === input.trim(),
  );
  return match ? match.slug : clean;
}

export function getProvinceLabel(
  slug: string,
  locale: "fa" | "en" | "ar",
): string {
  const match = IRAN_PROVINCES.find((p) => p.slug === slug);
  return match ? match[locale] || match.fa : slug;
}
