"use client";

import { memo } from "react";
import { MessageSquare } from "lucide-react";

interface ContactSuccessProps {
  successTitle: string;
  successMessage: string;
}

export const ContactSuccess = memo(function ContactSuccess({
  successTitle,
  successMessage,
}: ContactSuccessProps) {
  return (
    <div className="p-6 rounded-lg text-center bg-green-500/10 border border-green-500/30">
      <MessageSquare size={32} className="mx-auto mb-3 text-green-400" />
      <h3 className="font-semibold text-green-400 mb-1">{successTitle}</h3>
      <p className="text-sm text-[var(--text-secondary)]">{successMessage}</p>
    </div>
  );
});
