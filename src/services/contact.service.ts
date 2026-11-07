// src/services/contact.service.ts
import "server-only";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { unstable_cache } from "next/cache";

export interface AdditionalOfficeDTO {
  id: string;
  title: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface ContactPageFormTextsDTO {
  tabGeneral: string;
  tabSample: string;
  tabProject: string;
  tabDealer: string;
  successTitle: string;
  submitAnotherBtn: string;
  successMessage: string;
}

export interface ContactPageDTO {
  watermark: string;
  title: string;
  infoTitle: string;
  infoDesc: string;
  factoryTitle: string;
  factoryAddress: string;
  phoneTitle: string;
  phoneNumber: string;
  emailTitle: string;
  emailAddress: string;
  additionalOffices: AdditionalOfficeDTO[];
  formTexts: ContactPageFormTextsDTO;
}

const defaultContactData: ContactPageDTO = {
  watermark: "CONTACT",
  title: "تماس با ما",
  infoTitle: "دفتر مرکزی و کارخانه",
  infoDesc:
    "برای هماهنگی جلسات حضوری، بازدید از شوروم کارخانه و یا دریافت مشاوره‌های تخصصی معماری، از طریق راه‌های زیر با ما در ارتباط باشید.",
  factoryTitle: "آدرس کارخانه",
  factoryAddress: "شهرکرد، قطب صنعتی، فاز ۳، اندیشه ۶، پلاک ۳۶۹",
  phoneTitle: "تلفن تماس مستقیم",
  phoneNumber: "+98 38 3228 1752",
  emailTitle: "پست الکترونیک سازمانی",
  emailAddress: "info@persisquartz.com",
  additionalOffices: [],
  formTexts: {
    tabGeneral: "تماس عمومی",
    tabSample: "درخواست سمپل",
    tabProject: "استعلام پروژه",
    tabDealer: "اخذ عاملیت",
    successTitle: "با تشکر از پیام شما",
    submitAnotherBtn: "ثبت درخواست دیگر",
    successMessage:
      "درخواست شما دریافت شد و پس از بررسی توسط دپارتمان مربوطه، در اسرع وقت با شما تماس خواهیم گرفت.",
  },
};

export const getContactPageDataService = (locale: "fa" | "en" | "ar" = "fa") =>
  unstable_cache(
    async (): Promise<ContactPageDTO> => {
      try {
        const payload = await getPayload({ config: configPromise });
        const res = (await payload.findGlobal({
          slug: "contact-page",
          locale,
          depth: 1,
        })) as unknown as Record<string, unknown>;

        if (!res) {
          return defaultContactData;
        }

        const rawOffices = Array.isArray(res.additionalOffices)
          ? (res.additionalOffices as Array<Record<string, unknown>>)
          : [];

        const additionalOffices: AdditionalOfficeDTO[] = rawOffices.map(
          (office, idx) => ({
            id: (office.id as string) || `office-${idx + 1}`,
            title: (office.title as string) || "",
            address: (office.address as string) || undefined,
            phone: (office.phone as string) || undefined,
            email: (office.email as string) || undefined,
          }),
        );

        return {
          watermark:
            (res.watermark as string) || defaultContactData.watermark,
          title: (res.title as string) || defaultContactData.title,
          infoTitle:
            (res.infoTitle as string) || defaultContactData.infoTitle,
          infoDesc: (res.infoDesc as string) || defaultContactData.infoDesc,
          factoryTitle:
            (res.factoryTitle as string) || defaultContactData.factoryTitle,
          factoryAddress:
            (res.factoryAddress as string) ||
            defaultContactData.factoryAddress,
          phoneTitle:
            (res.phoneTitle as string) || defaultContactData.phoneTitle,
          phoneNumber:
            (res.phoneNumber as string) || defaultContactData.phoneNumber,
          emailTitle:
            (res.emailTitle as string) || defaultContactData.emailTitle,
          emailAddress:
            (res.emailAddress as string) || defaultContactData.emailAddress,
          additionalOffices,
          formTexts: {
            tabGeneral:
              (res.tabGeneral as string) ||
              defaultContactData.formTexts.tabGeneral,
            tabSample:
              (res.tabSample as string) ||
              defaultContactData.formTexts.tabSample,
            tabProject:
              (res.tabProject as string) ||
              defaultContactData.formTexts.tabProject,
            tabDealer:
              (res.tabDealer as string) ||
              defaultContactData.formTexts.tabDealer,
            successTitle:
              (res.successTitle as string) ||
              defaultContactData.formTexts.successTitle,
            submitAnotherBtn:
              (res.submitAnotherBtn as string) ||
              defaultContactData.formTexts.submitAnotherBtn,
            successMessage:
              (res.successMessage as string) ||
              defaultContactData.formTexts.successMessage,
          },
        };
      } catch (error: unknown) {
        console.error("Error fetching ContactPage data:", error);
        return defaultContactData;
      }
    },
    ["contact-page-data-cache", locale],
    {
      revalidate: 86400,
      tags: ["contact-page"],
    },
  )();
