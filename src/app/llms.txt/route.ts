import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "https://persisquartz.com"
  ).replace(/\/$/, "");

  const content = `# Persis Quartz (سنگ کوارتز پرسیس)

> Persis Quartz is a premier manufacturer of engineered quartz stone slabs and architectural surfaces, engineered with 93% natural quartz stone and 7% advanced polymer resins for luxury interiors, kitchen countertops, and high-traffic commercial environments.

## Technical Specifications (مشخصات فنی)
- Material Composition: 93% Natural Quartz Crystals + 7% High-Grade Polymer Resins & Pigments
- Mohs Hardness: 7 (Extremely high scratch and abrasion resistance)
- Water Absorption: <0.03% (Virtually zero absorption; non-porous, antibacterial, and stain-proof)
- Standard Dimensions: 320 x 75 cm, 320 x 92 cm (Jumbo Slabs)
- Standard Thicknesses: 12mm, 14mm, 16mm, 18mm, 20mm
- Surface Finishes: Polished (High Gloss), Matte, Honed/Suede
- Applications: Kitchen Countertops, Island Tops, Vanity Counters, Splashbacks, Wall Cladding, Flooring, Commercial Surfaces, Healthcare & Lab Tops

## Organization & Geographic Footprint (اطلاعات سازمانی و جغرافیایی)
- Brand Name: Persis Quartz (پرسیس کوارتز)
- Factory Address: Phase 3, Andisheh 6, Industrial Zone, Shahrekord, Chaharmahal and Bakhtiari, Iran
- Direct Phone: +98-38-3228-1752
- Supported Languages: Persian (fa), English (en), Arabic (ar)
- Geographic Markets: Iran (Nationwide Dealer Network) & Middle East Export (UAE, Oman, Qatar, Kuwait)

## Key Documentation & Links (پیوندهای کلیدی)
- [Quartz Slabs Catalog](${baseUrl}/fa/products): Comprehensive collection of marble-look, Calacatta, and modern quartz slabs.
- [Technical Catalogs & TDS](${baseUrl}/fa/catalogs): Download official technical data sheets and physical test reports.
- [Care & Maintenance Guidelines](${baseUrl}/fa/care-and-maintenance): Daily cleaning protocols, stain removal methods, and thermal shock prevention.
- [Architectural Applications](${baseUrl}/fa/applications): Standard practices for residential kitchens, luxury bathrooms, and commercial spaces.
- [Official Dealers & Showrooms](${baseUrl}/fa/dealers): Authorized distributors and fabrication partners across all provinces.
- [Design Inspirations](${baseUrl}/fa/inspirations): Real-world interior design projects and material palettes.
- [Architecture & Material Journal](${baseUrl}/fa/blog): Expert comparisons (Quartz vs Corian vs Granite) and technical guides.
- [Contact & Project Inquiries](${baseUrl}/fa/contact): B2B supply, architectural sample box requests, and direct inquiries.
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
