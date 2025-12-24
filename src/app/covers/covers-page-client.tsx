"use client";

import { useLanguage } from "@/contexts/language-context";
import { useCoverFilter } from "@/hooks/use-cover-filter";
import { CoversHeader } from "@/components/covers/covers-header";
import { CoversFilterBar } from "@/components/covers/covers-filter-bar";
import { CoversGrid } from "@/components/covers/covers-grid";
import { EmptyState } from "@/components/covers/empty-state";
import type { VideoCoverData } from "@/types/video-cover";

interface CoversPageClientProps {
  initialData: VideoCoverData;
}

export function CoversPageClient({ initialData }: CoversPageClientProps) {
  const { t } = useLanguage();
  const { tags, covers } = initialData;

  const {
    activeTag,
    setActiveTag,
    filteredCovers,
    tagCounts,
    totalCount,
  } = useCoverFilter(covers, tags);

  return (
    <div className="min-h-screen bg-bg-board theme-transition-800">
      <CoversHeader
        title={t("covers.title")}
        subtitle={t("covers.subtitle")}
        backToHomeLabel={t("covers.backToHome")}
        totalCovers={totalCount}
        totalCategories={tags.length}
        coversCountLabel={t("covers.coversCount")}
        categoriesCountLabel={t("covers.categoriesCount")}
      />

      <CoversFilterBar
        tags={tags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        tagCounts={tagCounts}
        totalCount={totalCount}
        filterAllLabel={t("covers.filterAll")}
      />

      {filteredCovers.length === 0 ? (
        <EmptyState
          title={t("covers.noResults")}
          message={t("covers.noResultsMessage")}
          actionLabel={t("covers.clearFilters")}
          onAction={() => setActiveTag("all")}
        />
      ) : (
        <CoversGrid covers={filteredCovers} />
      )}
    </div>
  );
}
