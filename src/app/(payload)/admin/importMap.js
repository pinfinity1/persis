import { ExcelCategoryImportControl as ExcelCategoryImportControl_4382766527adc79553646109e995ca58 } from '@/components/admin/ExcelCategoryImportControl'
import { ExcelProductImportControl as ExcelProductImportControl_9c4b4526906d26e64e9447c8643cce10 } from '@/components/admin/ExcelProductImportControl'
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from '@payloadcms/storage-s3/client'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'

/** @type import('payload').ImportMap */
export const importMap = {
  "@/components/admin/ExcelCategoryImportControl#ExcelCategoryImportControl": ExcelCategoryImportControl_4382766527adc79553646109e995ca58,
  "@/components/admin/ExcelProductImportControl#ExcelProductImportControl": ExcelProductImportControl_9c4b4526906d26e64e9447c8643cce10,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler": S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1
}
