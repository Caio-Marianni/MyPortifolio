"use client";

import { memo } from "react";
import { FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AboutHeaderProps {
  caseNumberLabel: string;
  caseNumber: string;
}

export const AboutHeader = memo(function AboutHeader({ caseNumberLabel, caseNumber }: AboutHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-4 glow-uv">
        <FileText size={24} className="text-text-dark" />
        <div>
          <p className="text-xs text-text-muted">{caseNumberLabel}</p>
          <p className="text-lg font-mono font-semibold text-text-dark">{caseNumber}</p>
        </div>
      </div>
      <Separator />
    </div>
  );
});
