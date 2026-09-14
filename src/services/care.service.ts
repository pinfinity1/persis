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
        const rawData = (await payload.findGlobal({
          slug: "care-page",
          locale,
          depth: 1,
        })) as unknown as Record<string, unknown>;

        const mediaObj = rawData?.media as { url?: string } | null;
        const mediaSrc = mediaObj?.url || null;

        const rawSteps = Array.isArray(rawData?.steps) ? rawData.steps : [];
        const steps: CareStepDTO[] = rawSteps.map(
          (item: Record<string, unknown>, idx: number) => ({
            id: (item.id as string) || `step-${idx + 1}`,
            stepNumber: (item.stepNumber as string) || `0${idx + 1}`,
            title: (item.title as string) || "",
            desc: (item.desc as string) || "",
            iconName: (item.iconName as string) || "dot",
          }),
        );

        const rawRules = Array.isArray(rawData?.rules) ? rawData.rules : [];
        const rules: CareRuleDTO[] = rawRules.map(
          (item: Record<string, unknown>, idx: number) => ({
            id: (item.id as string) || `rule-${idx + 1}`,
            title: (item.title as string) || "",
            desc: (item.desc as string) || "",
            iconType: (item.iconType as string) || "dot",
          }),
        );

        return { mediaSrc, steps, rules };
      } catch (error: unknown) {
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
