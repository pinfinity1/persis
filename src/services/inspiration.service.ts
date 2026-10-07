// src/services/inspiration.service.ts
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { unstable_cache } from "next/cache";
import type { Locale } from "./product.service";
import type { Inspiration, Product } from "@/payload-types";

export interface HotspotDTO {
  id: string;
  xPercent: number;
  yPercent: number;
  label: string;
  productSlug?: string;
  productTitle?: string;
  productCode?: string;
}

export interface PairingMaterialDTO {
  id: string;
  title: string;
  colorHex?: string;
}

export interface InspirationItemDTO {
  id: string;
  title: string;
  spaceType: string;
  style: string;
  description: string;
  image: string;
  hotspots: HotspotDTO[];
  pairings: PairingMaterialDTO[];
}

export const getInspirationsService = (locale: Locale) =>
  unstable_cache(
    async (): Promise<InspirationItemDTO[]> => {
      try {
        const payload = await getPayload({ config: configPromise });
        const res = await payload.find({
          collection: "inspirations",
          locale,
          depth: 2,
          limit: 100,
          sort: "-createdAt",
        });

        return res.docs.map((doc: Inspiration) => {
          const imageUrl =
            doc.image &&
            typeof doc.image === "object" &&
            "url" in doc.image &&
            doc.image.url
              ? doc.image.url
              : "/PersisQuartz-Red.png";

          const hotspots: HotspotDTO[] = Array.isArray(doc.hotspots)
            ? doc.hotspots.map((h) => {
                const prod =
                  typeof h.product === "object" ? (h.product as Product) : null;
                return {
                  id: String(h.id),
                  xPercent: h.x_percent ?? 50,
                  yPercent: h.y_percent ?? 50,
                  label: h.application_label || "",
                  productSlug: prod?.slug || undefined,
                  productTitle: prod?.title || undefined,
                  productCode: prod?.code || undefined,
                };
              })
            : [];

          const pairings: PairingMaterialDTO[] = Array.isArray(doc.pairings)
            ? doc.pairings.map((m) => ({
                id: String(m.id),
                title: m.title || "",
                colorHex: m.color_hex || undefined,
              }))
            : [];

          return {
            id: String(doc.id),
            title: doc.title || "",
            spaceType: doc.space_type,
            style: doc.style,
            description: doc.description || "",
            image: imageUrl,
            hotspots,
            pairings,
          };
        });
      } catch (err) {
        console.error("Error fetching inspirations:", err);
        return [];
      }
    },
    ["inspirations-list-cache", locale],
    { revalidate: 3600, tags: ["inspirations"] },
  )();
