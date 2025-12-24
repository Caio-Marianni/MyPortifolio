import { useState, useMemo } from "react";
import type { VideoCover, VideoTag } from "@/types/video-cover";

export function useCoverFilter(covers: VideoCover[], tags: VideoTag[]) {
  const [activeTag, setActiveTag] = useState<string>("all");

  const filteredCovers = useMemo(() => {
    if (activeTag === "all") return covers;
    return covers.filter((cover) => cover.tags.includes(activeTag));
  }, [covers, activeTag]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tags.forEach((tag) => {
      counts[tag.id] = covers.filter((cover) =>
        cover.tags.includes(tag.id)
      ).length;
    });
    return counts;
  }, [covers, tags]);

  return {
    activeTag,
    setActiveTag,
    filteredCovers,
    tagCounts,
    totalCount: covers.length,
  };
}
