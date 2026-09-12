// src/components/products/product-card.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import type { ProductItemDTO } from "@/services/product.service";

interface ProductCardProps {
  product: ProductItemDTO;
  className?: string;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
  priority = false,
}) => {
  const imageUrl = product.thumbnail || "/PersisQuartz-Red.png";
  const isDefaultLogo = imageUrl === "/PersisQuartz-Red.png";

  return (
    <Link
      href={`/products/${product.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col bg-card border border-border/50 hover:border-primary/60 transition-colors duration-300 overflow-hidden select-none h-full ${className}`}
    >
      {/* قاب نمایش اسلب */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/20 flex items-center justify-center p-3 sm:p-5">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`${
            isDefaultLogo
              ? "object-contain p-4 opacity-70 group-hover:opacity-100"
              : "object-cover group-hover:scale-[1.03]"
          } transition-transform duration-500 ease-out`}
        />
      </div>

      {/* اطلاعات محصول */}
      <div className="p-3 sm:p-4 flex items-center justify-between gap-2 border-t border-border/30 flex-1 bg-card">
        <div className="space-y-0.5 min-w-0">
          <span className="text-[10px] sm:text-xs text-muted-foreground tracking-wider block font-mono">
            {product.code}
          </span>
          <h4 className="text-xs sm:text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
            {product.title}
          </h4>
        </div>

        {/* دکمه اکشن گوشه: در حالت عادی مخفی و در هاور پدیدار می‌شود */}
        <div className="hidden sm:flex shrink-0 size-7 lg:size-8 border border-primary bg-primary text-primary-foreground items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <ArrowUpRight className="size-3.5" />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
