// src/components/catalogs/catalog-card.tsx
"use client";

import React, { useState } from "react";
import type { CatalogItem } from "@/services/catalog.service";
import { CatalogEditorialCard } from "./catalog-editorial-card";
import { CatalogLookbookModal } from "./catalog-lookbook-modal";

export const CatalogCard: React.FC<{ catalog: CatalogItem }> = ({ catalog }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CatalogEditorialCard
        catalog={catalog}
        onOpenLookbook={() => setIsOpen(true)}
      />
      <CatalogLookbookModal
        catalog={catalog}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
