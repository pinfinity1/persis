import type { ImportMap } from "payload";
import { ExcelProductImportControl } from "@/components/admin/ExcelProductImportControl";
import { ExcelCategoryImportControl } from "@/components/admin/ExcelCategoryImportControl";
import { ExcelDealerImportControl } from "@/components/admin/ExcelDealerImportControl";
import { CollectionCards } from "@payloadcms/next/rsc";

export const importMap: ImportMap = {
  "@/components/admin/ExcelProductImportControl#ExcelProductImportControl":
    ExcelProductImportControl,
  "@/components/admin/ExcelCategoryImportControl#ExcelCategoryImportControl":
    ExcelCategoryImportControl,
  "@/components/admin/ExcelDealerImportControl#ExcelDealerImportControl":
    ExcelDealerImportControl,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards,
};
