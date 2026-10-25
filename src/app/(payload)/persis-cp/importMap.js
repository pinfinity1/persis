import { ExcelCategoryImportControl as ExcelCategoryImportControl_4382766527adc79553646109e995ca58 } from '@/components/admin/ExcelCategoryImportControl'
import { RscEntryLexicalCell as RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { RscEntryLexicalField as RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { LexicalDiffComponent as LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { LinkFeatureClient as LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { BoldFeatureClient as BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ItalicFeatureClient as ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ParagraphFeatureClient as ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { InlineToolbarFeatureClient as InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ExcelProductImportControl as ExcelProductImportControl_9c4b4526906d26e64e9447c8643cce10 } from '@/components/admin/ExcelProductImportControl'
import { ExcelDealerImportControl as ExcelDealerImportControl_592f1cf1c8df4c52c1c1fc611404db98 } from '@/components/admin/ExcelDealerImportControl'
import { UploadFeatureClient as UploadFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { HorizontalRuleFeatureClient as HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { BlockquoteFeatureClient as BlockquoteFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { UnorderedListFeatureClient as UnorderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { OrderedListFeatureClient as OrderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { UnderlineFeatureClient as UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { HeadingFeatureClient as HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ColorPickerField as ColorPickerField_d572ded1c017fe858839e8cdc754e090 } from '@/components/admin/ColorPickerField'
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from '@payloadcms/storage-s3/client'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'

/** @type import('payload').ImportMap */
export const importMap = {
  "@/components/admin/ExcelCategoryImportControl#ExcelCategoryImportControl": ExcelCategoryImportControl_4382766527adc79553646109e995ca58,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell": RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalField": RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/rsc#LexicalDiffComponent": LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/client#LinkFeatureClient": LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#BoldFeatureClient": BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ItalicFeatureClient": ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ParagraphFeatureClient": ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient": InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@/components/admin/ExcelProductImportControl#ExcelProductImportControl": ExcelProductImportControl_9c4b4526906d26e64e9447c8643cce10,
  "@/components/admin/ExcelDealerImportControl#ExcelDealerImportControl": ExcelDealerImportControl_592f1cf1c8df4c52c1c1fc611404db98,
  "@payloadcms/richtext-lexical/client#UploadFeatureClient": UploadFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient": HorizontalRuleFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#BlockquoteFeatureClient": BlockquoteFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#UnorderedListFeatureClient": UnorderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#OrderedListFeatureClient": OrderedListFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#UnderlineFeatureClient": UnderlineFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#HeadingFeatureClient": HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@/components/admin/ColorPickerField#ColorPickerField": ColorPickerField_d572ded1c017fe858839e8cdc754e090,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler": S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1
}
