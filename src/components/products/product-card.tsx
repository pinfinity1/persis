"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ProductItem } from "@/services/product.service";

interface ProductCardProps {
  product: ProductItem;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
}) => {
  const t = useTranslations("ProductsGrid");

  const imageUrl =
    typeof product.thumbnail === "object" && product.thumbnail?.url
      ? product.thumbnail.url
      : typeof product.thumbnail === "string"
        ? product.thumbnail
        : "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop";

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group relative flex flex-col bg-card border border-border/50 hover:border-primary/60 transition-all duration-500 overflow-hidden select-none h-full ${className}`}
    >
      {/* ۱. قاب تصویر عمودی اسلب (نسبت 3:4) با زوم آرام در هاور */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* وضعیت تولید سفارشی */}
        {product.is_in_stock === "on_demand" && (
          <div className="absolute top-3 start-3 bg-background/90 backdrop-blur-md px-2.5 py-1 border border-border/50 text-[10px] font-mono tracking-widest uppercase text-amber-600 dark:text-amber-400 z-10">
            {t("onDemand")}
          </div>
        )}

        {/* لایه محو تیرگی هاور */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
      </div>

      {/* ۲. اطلاعات متنی و دکمه اکشن (فقط هنگام هاور ظاهر می‌شود) */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-t border-border/30 flex-1 bg-card">
        <div className="space-y-0.5">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium text-muted-foreground tracking-wider block">
            {product.code}
          </span>
          <h4 className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
            {product.title}
          </h4>
        </div>

        {/* دکمه اکشن: مخفی تا زمان هاور در دسکتاپ */}
        <div className="hidden sm:flex shrink-0 h-8 w-8 sm:h-9 sm:w-9 border border-primary bg-primary text-primary-foreground items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
