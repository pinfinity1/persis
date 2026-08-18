import { cache } from "react";
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";

export const getAboutPageDataService = cache(async () => {
  try {
    const payload = await getPayload({ config: configPromise });
    const response = await payload.findGlobal({
      slug: "about-page",
      depth: 1,
    });
    return response;
  } catch (error) {
    console.error("Error fetching About Page data:", error);
    return null;
  }
});
