// src/lib/data/products.ts

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
  description: {
    fa: string;
    en: string;
  };
  imageUrl: string;
  slug: string;
  isFeatured: boolean;
}

export const MOCK_PRODUCTS: Product[] = [
  // --- Monocolor (ساده) ---
  {
    id: "1",
    title: { fa: "میکونوس", en: "Mykonos" },
    code: "PQ-101",
    category: "monocolor",
    color: "white",
    description: {
      fa: "سفید ساده - الهام‌گرفته از خانه‌های سفید میکونوس",
      en: "Pure White - Inspired by the whitewashed homes of Mykonos",
    },
    imageUrl: "/images/products/mykonos.jpg",
    slug: "mykonos",
    isFeatured: true,
  },
  {
    id: "2",
    title: { fa: "اکلیپس", en: "Eclipse" },
    code: "PQ-102",
    category: "monocolor",
    color: "black",
    description: {
      fa: "مشکی ساده - لحظه‌ای که نور تسلیم سیاهی مطلق می‌شود",
      en: "Pure Black - The moment light surrenders to darkness",
    },
    imageUrl: "/images/products/eclipse.jpg",
    slug: "eclipse",
    isFeatured: true,
  },

  // --- Veined Effect (ابر و بادی) ---
  {
    id: "3",
    title: { fa: "وایت سند", en: "White Sand" },
    code: "PQ-201",
    category: "veined-effect",
    color: "white",
    description: {
      fa: "سفید ابر و بادی - موج‌های سپیدی خالص بر شن‌های کویر",
      en: "Soft White Mist - Waves of pure white carved into sand",
    },
    imageUrl: "/images/products/white-sand.jpg",
    slug: "white-sand",
    isFeatured: true,
  },
  {
    id: "4",
    title: { fa: "مه البرز", en: "Alborz Mist" },
    code: "PQ-202",
    category: "veined-effect",
    color: "grey",
    description: {
      fa: "سفید و طوسی ابر و بادی - الهام‌گرفته از مه صبحگاهی قله‌های البرز",
      en: "Grey & White Mist - Inspired by morning mist over Alborz peaks",
    },
    imageUrl: "/images/products/alborz-mist.jpg",
    slug: "alborz-mist",
    isFeatured: true,
  },
  {
    id: "5",
    title: { fa: "ویک", en: "Vik" },
    code: "PQ-203",
    category: "veined-effect",
    color: "black",
    description: {
      fa: "مشکی ابر و بادی - سواحل آتشفشانی و رازآلود ایسلند",
      en: "Black Mist - Inspired by the black sand shores of Vik, Iceland",
    },
    imageUrl: "/images/products/vik.jpg",
    slug: "vik",
    isFeatured: true,
  },

  // --- Calacatta (رگه‌دار) ---
  {
    id: "6",
    title: { fa: "آرکتیک", en: "Arctic" },
    code: "PQ-301",
    category: "calacatta",
    color: "white",
    veinColor: "grey",
    description: {
      fa: "سفید با رگه طوسی/مشکی - ترک‌های ظریف نقره‌ای بر پهنه قطب",
      en: "White with Grey Veins - Delicate cracks carved through endless ice",
    },
    imageUrl: "/images/products/arctic.jpg",
    slug: "arctic",
    isFeatured: true,
  },
  {
    id: "7",
    title: { fa: "زرشوران", en: "Zarshouran" },
    code: "PQ-302",
    category: "calacatta",
    color: "white",
    veinColor: "gold",
    description: {
      fa: "سفید با رگه‌های طلایی - رگه‌های درخشان متولد شده در دل طبیعت",
      en: "White with Gold Veins - Golden veins born upon pure white",
    },
    imageUrl: "/images/products/zarshouran.jpg",
    slug: "zarshouran",
    isFeatured: true,
  },
  {
    id: "8",
    title: { fa: "طوفان زاگرس", en: "Zagros Storm" },
    code: "PQ-303",
    category: "calacatta",
    color: "black",
    veinColor: "white",
    description: {
      fa: "مشکی با رگه سفید - درخشش آذرخش بر سیاهی شب در کوهستان",
      en: "Black with White Veins - Silver veins flashing across dark night",
    },
    imageUrl: "/images/products/zagros-storm.jpg",
    slug: "zagros-storm",
    isFeatured: true,
  },
  {
    id: "9",
    title: { fa: "بایکال", en: "Baikal" },
    code: "PQ-304",
    category: "calacatta",
    color: "grey",
    veinColor: "white",
    description: {
      fa: "طوسی با رگه سفید - ترک‌های کریستالی یخ روی دریاچه بایکال",
      en: "Grey with White Veins - Delicate ice fracture veins on cold grey",
    },
    imageUrl: "/images/products/baikal.jpg",
    slug: "baikal",
    isFeatured: true,
  },
];
