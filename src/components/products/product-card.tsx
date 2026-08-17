"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import type { ProductItem } from "@/services/product.service";

interface ProductCardProps {
  product: ProductItem;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
}) => {
  const imageUrl =
    typeof product.thumbnail === "object" && product.thumbnail?.url
      ? product.thumbnail.url
      : typeof product.thumbnail === "string"
        ? product.thumbnail
        : "/PersisQuartz-Red.png";

  const isDefaultLogo = imageUrl === "/PersisQuartz-Red.png";

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group relative flex flex-col bg-card border border-border/50 hover:border-primary/60 transition-all duration-500 overflow-hidden select-none h-full ${className}`}
    >
      {/* قاب تصویر عمودی اسلب (نسبت ۳:۴) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/40 flex items-center justify-center p-6">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          className={`${
            isDefaultLogo
              ? "object-contain p-8 opacity-70 group-hover:opacity-100 group-hover:scale-105"
              : "object-cover group-hover:scale-105"
          } transition-all duration-700 ease-out`}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
      </div>

      {/* اطلاعات متنی سنگ بدون برچسب‌های فروشگاهی */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-t border-border/30 flex-1 bg-card">
        <div className="space-y-0.5">
          <span className="text-xs text-muted-foreground tracking-wider block">
            کد {product.code}
          </span>
          <h4 className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
            {product.title}
          </h4>
        </div>

        <div className="hidden sm:flex shrink-0 h-8 w-8 sm:h-9 sm:w-9 border border-primary bg-primary text-primary-foreground items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
