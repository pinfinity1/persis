import { ImageResponse } from "next/og";
import {
  getProductBySlugService,
  type Locale,
} from "@/services/product.service";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProductBySlugService(slug, locale as Locale);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://persisquartz.com";
  const productImageUrl = product?.thumbnail
    ? product.thumbnail.startsWith("http")
      ? product.thumbnail
      : `${siteUrl}${product.thumbnail}`
    : `${siteUrl}/PersisQuartz-Red.png`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#0d0d0e",
        color: "#ffffff",
        padding: "40px 60px",
        alignItems: "center",
        justifyContent: "space-between",
        border: "2px solid #27272a",
        fontFamily: "sans-serif",
      }}
    >
      {/* ستون مشخصات اسلب */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          maxWidth: "550px",
        }}
      >
        {/* لوگوی بالای کارت */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: "#9b0737",
              borderRadius: "2px",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#e4e4e7",
            }}
          >
            PERSIS QUARTZ
          </span>
        </div>

        {/* عنوان و کد اسلب */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span
            style={{
              fontSize: "18px",
              color: "#9b0737",
              fontFamily: "monospace",
              letterSpacing: "2px",
            }}
          >
            CODE: {product?.code || "—"}
          </span>
          <span
            style={{
              fontSize: "48px",
              fontWeight: "300",
              lineHeight: "1.2",
              color: "#ffffff",
            }}
          >
            {product?.title || "Engineered Quartz"}
          </span>
          <span
            style={{
              fontSize: "18px",
              color: "#a1a1aa",
              fontWeight: "300",
            }}
          >
            Premium Architectural Slab Surfaces
          </span>
        </div>

        <div
          style={{
            fontSize: "14px",
            color: "#71717a",
            letterSpacing: "1px",
          }}
        >
          persisquartz.com
        </div>
      </div>

      {/* قاب سنگ با نسبت کامل و بدون برش‌خوردگی */}
      <div
        style={{
          display: "flex",
          width: "480px",
          height: "530px",
          backgroundColor: "#18181b",
          border: "1px solid #3f3f46",
          padding: "16px",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={productImageUrl}
          alt={product?.title || "Slab"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    </div>,
    {
      ...size,
    },
  );
}
