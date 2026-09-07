// src/services/care.service.ts
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { unstable_cache } from "next/cache";

export interface CareStepDTO {
  id: string;
  stepNumber?: string;
  title: string;
  desc: string;
  iconName?: string;
}

export interface CareRuleDTO {
  id: string;
  title: string;
  desc: string;
  iconType?: string;
}

export interface CarePageDataDTO {
  mediaSrc: string | null;
  steps: CareStepDTO[];
  rules: CareRuleDTO[];
}

export async function getCarePageDataService(
  locale: "fa" | "en" | "ar" = "fa",
): Promise<CarePageDataDTO> {
  return unstable_cache(
    async (): Promise<CarePageDataDTO> => {
      try {
        const payload = await getPayload({ config: configPromise });
        const rawData: any = await payload.findGlobal({
          slug: "care-page",
          locale,
          depth: 1,
        });

        const mediaSrc =
          typeof rawData?.media === "object" && rawData?.media?.url
            ? rawData.media.url
            : null;

        const steps: CareStepDTO[] = Array.isArray(rawData?.steps)
          ? rawData.steps.map((item: any, idx: number) => ({
              id: item.id || `step-${idx + 1}`,
              stepNumber: item.stepNumber || `0${idx + 1}`,
              title: item.title || "",
              desc: item.desc || "",
              iconName: item.iconName || "dot",
            }))
          : [];

        const rules: CareRuleDTO[] = Array.isArray(rawData?.rules)
          ? rawData.rules.map((item: any, idx: number) => ({
              id: item.id || `rule-${idx + 1}`,
              title: item.title || "",
              desc: item.desc || "",
              iconType: item.iconType || "dot",
            }))
          : [];

        return { mediaSrc, steps, rules };
      } catch (error) {
        console.error("Error fetching CarePage data:", error);
        return {
          mediaSrc: null,
          steps: [],
          rules: [],
        };
      }
    },
    ["care-page-cache", locale],
    {
      revalidate: 86400,
      tags: ["care-page"],
    },
  )();
}
