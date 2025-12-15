"use client";

import { useModal, ModalSection } from "@/contexts/modal-context";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useLanguage } from "@/contexts/language-context";
import { ModalBase } from "./modal-base";

export function ModalManager() {
  const { activeModal } = useModal();
  const { isUV } = useUVMode();
  const { t } = useLanguage();

  if (!activeModal) return null;

  const mode = isUV ? "uv" : "normal";
  const title = t(`modal.${activeModal}.title.${mode}`);
  const content = t(`modal.${activeModal}.content.${mode}`);

  return (
    <ModalBase title={title}>
      <div className="text-[var(--text-secondary)]">
        <p>{content}</p>

        {/* Placeholder para conteúdo real */}
        <div className="mt-6 p-4 border border-[var(--frame-color)]/20 rounded-lg">
          <p className="text-sm opacity-60">
            [{t(`nav.${activeModal}`)} - {isUV ? t("modes.design") : t("modes.programming")}]
          </p>
        </div>
      </div>
    </ModalBase>
  );
}
