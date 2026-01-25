"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/ui/page-container";
import { PageHeader } from "@/components/ui/page-header";
import { ThumbnailCard } from "@/components/thumbnails/thumbnail-card";
import { FilterTabs } from "@/components/thumbnails/filter-tabs";
import { useLanguage } from "@/contexts/language-context";
import { thumbnails, THUMBNAIL_CATEGORIES } from "@/data/thumbnails";

export default function ThumbnailsPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(t("thumbnails.all"));

  const categories = useMemo(() => [t("thumbnails.all"), ...THUMBNAIL_CATEGORIES], [t]);

  const filteredThumbnails = useMemo(() => {
    if (selectedCategory === t("thumbnails.all")) {
      return thumbnails;
    }
    return thumbnails.filter((thumb) => thumb.tags.includes(selectedCategory));
  }, [selectedCategory, t]);

  return (
    <PageContainer showToggles={false} className="no-scrollbar">
      {/* Grid Background with Mask */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 [mask-image:radial-gradient(100%_100%_at_50%_50%,#000_10%,transparent_70%)]"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
        }}
      />

      <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        {t("thumbnails.back")}
      </Link>

      <PageHeader title={t("thumbnails.title")} description={t("thumbnails.description")} />

      <FilterTabs categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredThumbnails.map((thumbnail, index) => (
          <ThumbnailCard key={thumbnail.id} thumbnail={thumbnail} priority={index < 3} />
        ))}
      </div>

      {filteredThumbnails.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">{t("thumbnails.empty")}</p>
        </div>
      )}
    </PageContainer>
  );
}
