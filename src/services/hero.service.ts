import { cache } from "react";
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

export const getHeroBannersService = cache(async (locale: string = "fa") => {
  try {
    const payload = await getPayload({ config: configPromise });

    const response = await payload.find({
      collection: "hero-banners",
      locale: locale as "fa" | "en" | "ar",
      depth: 1,
      where: {
        status: {
          equals: "published",
        },
      },
      sort: "-updatedAt",
      limit: 1,
    });

    return response.docs;
  } catch (error) {
    console.error("Error fetching Hero Banners from Payload:", error);
    return [];
  }
});
