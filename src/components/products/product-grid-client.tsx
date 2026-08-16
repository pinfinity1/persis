"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import type { ProductItem, ProductMeta } from "@/services/product.service";
import { fetchMoreProductsAction } from "@/app/actions/product-actions";
import { ProductCard } from "@/components/products/product-card";

interface ProductGridProps {
  initialProducts: ProductItem[];
  initialMeta: ProductMeta;
  category?: string;
  color?: string;
  search?: string;
}

export const ProductGridClient: React.FC<ProductGridProps> = ({
  initialProducts,
  initialMeta,
  category,
  color,
  search,
}) => {
  const t = useTranslations("ProductsGrid");
  const locale = useLocale() as "fa" | "en" | "ar";

  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [meta, setMeta] = useState<ProductMeta>(initialMeta);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
    setMeta(initialMeta);
  }, [initialProducts, initialMeta]);

  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !meta.has_next_page) return;

    setIsLoadingMore(true);
    const nextPage = meta.current_page + 1;

    try {
      const res = await fetchMoreProductsAction({
        locale,
        page: nextPage,
        limit: 9,
        category,
        color,
        search, // <-- ارسال مقدار جستجو در pagination
      });

      setProducts((prev) => [...prev, ...res.data]);
      setMeta(res.meta);
    } catch (error) {
      console.error("Error loading infinite scroll products:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, meta, locale, category, color, search]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el || !meta.has_next_page) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && meta.has_next_page && !isLoadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [meta.has_next_page, isLoadingMore, loadMoreProducts]);

  if (!products || products.length === 0) {
    return (
      <div className="p-12 text-center bg-card border border-border/40 space-y-3">
        <p className="text-sm text-foreground font-medium">
          {t("noProductsFound")}
        </p>
        <p className="text-xs text-muted-foreground font-light">
          {t("tryResettingFilters")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <span className="text-xs font-mono text-muted-foreground uppercase">
          {t("showingCount", {
            count: products.length,
            total: meta.total_items,
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product, idx) => (
          <ProductCard key={`${product.id}-${idx}`} product={product} />
        ))}
      </div>

      <div ref={observerRef} className="pt-6 flex justify-center">
        {isLoadingMore && (
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground py-4">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          </div>
        )}

        {!meta.has_next_page && products.length > 9 && (
          <p className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-widest pt-4">
            — END OF CATALOG —
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductGridClient;
