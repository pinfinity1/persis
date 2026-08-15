import { ExcelProductImportControl } from "@/components/admin/ExcelProductImportControl";
import { ExcelCategoryImportControl } from "@/components/admin/ExcelCategoryImportControl";
import { CollectionCards } from "@payloadcms/next/rsc";

export const importMap: Record<string, any> = {
  "@/components/admin/ExcelProductImportControl#ExcelProductImportControl":
    ExcelProductImportControl,
  "@/components/admin/ExcelCategoryImportControl#ExcelCategoryImportControl":
    ExcelCategoryImportControl,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards,
};
