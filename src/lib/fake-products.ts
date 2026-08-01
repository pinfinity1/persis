// src/lib/fake-products.ts

export interface Product {
  id: string;
  title: {
    fa: string;
    en: string;
  };
  code: string;
  category: "monocolor" | "veined-effect" | "calacatta";
  color: "white" | "black" | "grey";
  veinColor?: "white" | "black" | "gold" | "grey";
  dimensions: string; // مثلا 320x75 cm یا 320x92 cm
  description: {
    fa: string;
    en: string;
  };
  imageUrl: string;
  slug: string;
  isFeatured: boolean;
}

export const MOCK_PRODUCTS: Product[] = [
  // --- Monocolor Series ---
  {
    id: "1",
    title: { fa: "میکونوس", en: "Mykonos" },
    code: "PQ-101",
    category: "monocolor",
    color: "white",
    dimensions: "320 × 75 / 320 × 92 cm",
    description: {
      fa: "سفید یکدست و خالص با ساختار متراکم و بدون خلل و فرج.",
      en: "Pure, seamless white surface with non-porous structure.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
    slug: "mykonos",
    isFeatured: true,
  },
  {
    id: "2",
    title: { fa: "اکلیپس", en: "Eclipse" },
    code: "PQ-102",
    category: "monocolor",
    color: "black",
    dimensions: "320 × 75 / 320 × 92 cm",
    description: {
      fa: "مشکی عمق‌دار و مدرن، مناسب برای فضای آشپزخانه و تجاری.",
      en: "Deep modern black, ideal for kitchens and commercial spaces.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?q=80&w=800&auto=format&fit=crop",
    slug: "eclipse",
    isFeatured: true,
  },

  // --- Veined Effect Series ---
  {
    id: "3",
    title: { fa: "وایت سند", en: "White Sand" },
    code: "PQ-201",
    category: "veined-effect",
    color: "white",
    dimensions: "320 × 75 / 320 × 92 cm",
    description: {
      fa: "سفید ابر و بادی - موج‌های سپیدی خالص و بافت نرم طبیعی.",
      en: "Soft white mist with natural subtle cloud-like textures.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
    slug: "white-sand",
    isFeatured: true,
  },
  {
    id: "4",
    title: { fa: "مه البرز", en: "Alborz Mist" },
    code: "PQ-202",
    category: "veined-effect",
    color: "grey",
    dimensions: "320 × 75 / 320 × 92 cm",
    description: {
      fa: "سفید و طوسی بافت‌دار - الهام‌گرفته از مه صبحگاهی قله‌های البرز.",
      en: "Grey & white mist - Inspired by morning mist over mountain peaks.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
    slug: "alborz-mist",
    isFeatured: true,
  },

  // --- Calacatta Series ---
  {
    id: "5",
    title: { fa: "آرکتیک", en: "Arctic" },
    code: "PQ-301",
    category: "calacatta",
    color: "white",
    veinColor: "grey",
    dimensions: "320 × 75 / 320 × 92 cm",
    description: {
      fa: "سفید با رگه طوسی - ترک‌های ظریف نقره‌ای و بافت کالاکاتا.",
      en: "White with grey veins - Delicate silver cracks in Calacatta style.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800&auto=format&fit=crop",
    slug: "arctic",
    isFeatured: true,
  },
  {
    id: "6",
    title: { fa: "زرشوران", en: "Zarshouran" },
    code: "PQ-302",
    category: "calacatta",
    color: "white",
    veinColor: "gold",
    dimensions: "320 × 75 / 320 × 92 cm",
    description: {
      fa: "سفید با رگه‌های درخشان طلایی - لوکس و چشم‌نواز.",
      en: "White with brilliant golden veins - Luxurious and striking.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop",
    slug: "zarshouran",
    isFeatured: true,
  },
];
