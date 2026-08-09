import { getPayload } from "payload";
import configPromise from "@/payload.config";

export async function getHeroBanners(locale: string = "fa") {
  try {
    const payload = await getPayload({ config: configPromise });

    const response = await payload.find({
      collection: "hero-banners",
      locale: locale as "fa" | "en" | "ar",
      depth: 1, // <-- این خط کلیدی است: باعث می‌شود url ویدیوها و عکس‌ها دریافت شود
      where: {
        status: {
          equals: "published",
        },
      },
      sort: "order",
    });

    return response.docs;
  } catch (error) {
    console.error("Error fetching Hero Banners from Payload:", error);
    return [];
  }
}
