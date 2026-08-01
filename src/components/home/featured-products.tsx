// src/components/home/featured-products.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export interface Product {
  id: string;
  title: string;
  code: string;
  category: string;
  color: string;
  imageUrl: string;
  slug: string;
}

interface FeaturedProductsProps {
  products: Product[];
}

const CATEGORIES = [
  { key: "all", label: "همه محصولات" },
  { key: "classic", label: "کلاسیک" },
  { key: "modern", label: "مدرن" },
  { key: "calacatta", label: "کالاکاتا" },
];

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
}) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = (
    activeFilter === "all"
      ? products
      : products.filter((p) => p.category === activeFilter)
  ).slice(0, 8); // محدودیت حداکثر ۸ محصول برای حفظ کارایی[cite: 1]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 sm:px-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              PERSIS COLLECTION
            </h2>
            <h3 className="text-3xl font-light text-foreground sm:text-4xl">
              محصولات منتخب
            </h3>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.key}
                variant={activeFilter === cat.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter(cat.key)}
                className="rounded-none text-xs tracking-wider"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative flex flex-col bg-card overflow-hidden border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      asChild
                      variant="secondary"
                      size="sm"
                      className="rounded-none"
                    >
                      <Link href={`/products/${product.slug}`}>
                        مشاهده جزئیات
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {product.code}
                    </span>
                    <h4 className="text-lg font-medium text-foreground mt-1">
                      {product.title}
                    </h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Action Button */}
        <div className="mt-16 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-none px-10 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Link href="/products">مشاهده تمام محصولات</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
