"use client";

import { useState, useEffect, useMemo } from "react";
import { useModal } from "@/contexts/modal-context";
import { useUVMode } from "@/contexts/uv-mode-context";
import { useLanguage } from "@/contexts/language-context";
import { useAudioContext } from "@/contexts/audio-context";
import { InfoPhoto } from "./info/info-photo";
import { InfoDetails } from "./info/info-details";
import { InfoFooter } from "./info/info-footer";

export function InfoModalContent() {
  const { isUV } = useUVMode();
  const { translations } = useLanguage();
  const { openModal } = useModal();
  const { play } = useAudioContext();
  const [imageKey, setImageKey] = useState(0);

  // Atualizar key da imagem quando o tema mudar para forçar transição
  useEffect(() => {
    setImageKey((prev) => prev + 1);
  }, [isUV]);

  // Obter dados traduzidos do modo atual
  const data = useMemo(() => {
    const mode = isUV ? "design" : "programming";
    const basePath = `modal.info.data.${mode}`;

    // Helper function to safely get translation value
    const getValue = (key: string, fallback: any = "") => {
      const fullPath = `${basePath}.${key}`;
      const keys = fullPath.split(".");
      let value: any = translations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return fallback;
        }
      }

      return value || fallback;
    };

    return {
      name: getValue("name", "Caio Marianni"),
      headline: getValue("headline", ""),
      services: getValue("services", []),
      stack: getValue("stack", []),
      lastCrimeLabel: getValue("lastCrimeLabel", "ÚLTIMO CRIME"),
      lastCrimeTitle: getValue("lastCrimeTitle", ""),
      lastCrimeUrl: "#",
      victimsLabel: getValue("victimsLabel", "VÍTIMAS"),
      victimsCount: getValue("victimsCount", ""),
      arsenalLabel: getValue("arsenalLabel", "ARSENAL"),
      servicesLabel: getValue("servicesLabel", "SERVIÇOS"),
      statusLabel: getValue("statusLabel", "STATUS"),
      nameLabel: getValue("nameLabel", "NOME"),
      contactButton: getValue("contactButton", "Entrar em Contato"),
      image: isUV
        ? "/assets/images/profileUv.Jpg"
        : "/assets/images/profileNormal.jpg",
    };
  }, [translations, isUV]);

  const handleContact = () => {
    play("navbar");
    openModal("contact");
  };

  return (
    <div className="space-y-6">
      {/* Seção superior: Foto + Info básica */}
      <div className="flex flex-col md:flex-row gap-8">
        <InfoPhoto imageSrc={data.image} name={data.name} imageKey={imageKey} />

        <InfoDetails
          imageKey={imageKey}
          nameLabel={data.nameLabel}
          name={data.name}
          statusLabel={data.statusLabel}
          headline={data.headline}
          servicesLabel={data.servicesLabel}
          services={data.services}
          arsenalLabel={data.arsenalLabel}
          stack={data.stack}
        />
      </div>

      <InfoFooter
        imageKey={imageKey}
        lastCrimeLabel={data.lastCrimeLabel}
        lastCrimeTitle={data.lastCrimeTitle}
        lastCrimeUrl={data.lastCrimeUrl}
        victimsLabel={data.victimsLabel}
        victimsCount={data.victimsCount}
        contactButton={data.contactButton}
        onContactClick={handleContact}
      />
    </div>
  );
}
