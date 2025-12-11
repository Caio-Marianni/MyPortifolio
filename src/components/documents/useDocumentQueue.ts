"use client";

import { useState, useCallback } from "react";

export type DocumentStatus = "pending" | "approved" | "rejected" | "reviewing";

export type DocumentType = "profile" | "project" | "certificate" | "skill";

export interface Document {
  id: string;
  type: DocumentType;
  data: any;
  status: DocumentStatus;
}

export function useDocumentQueue(initialDocuments: Omit<Document, "status">[]) {
  const [queue] = useState<Document[]>(
    initialDocuments.map((doc) => ({ ...doc, status: "pending" as DocumentStatus }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<Document[]>([]);

  const currentDocument = queue[currentIndex];

  const processDocument = useCallback(
    (status: "approved" | "rejected") => {
      if (!currentDocument) return;

      const processed = { ...currentDocument, status };
      setHistory((prev) => [...prev, processed]);

      if (currentIndex < queue.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentDocument, currentIndex, queue.length]
  );

  const pullNextDocument = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, queue.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  return {
    currentDocument,
    processDocument,
    pullNextDocument,
    goToPrevious,
    hasMore: currentIndex < queue.length - 1,
    hasPrevious: currentIndex > 0,
    progress: queue.length > 0 ? ((currentIndex + 1) / queue.length) * 100 : 0,
    currentIndex,
    totalDocuments: queue.length,
    history,
  };
}
