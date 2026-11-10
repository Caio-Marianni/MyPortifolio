"use client";

import { useRef, useState, useCallback } from "react";
import QRCode from "qrcode";
import { Download, QrCode, Loader2 } from "lucide-react";
import { BUTTON, BUTTON_SOLID, CARD, CARD_TITLE, FIELD, LABEL } from "@/components/ui/styles";

const SIZE = 400;
type Format = "png" | "jpeg" | "webp";

function getFaviconUrl(url: string): string {
  try {
    const { hostname } = new URL(url);
    return `/api/favicon?domain=${hostname}`;
  } catch {
    return "";
  }
}

async function loadLogoFromUrl(url: string): Promise<HTMLImageElement | null> {
  const faviconUrl = getFaviconUrl(url);
  if (!faviconUrl) return null;

  try {
    const res = await fetch(faviconUrl);
    if (!res.ok) return null;

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    return await new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(null); };
      img.src = objectUrl;
    });
  } catch {
    return null;
  }
}

async function buildQrCanvas(
  url: string,
  inverted: boolean,
  showLogo: boolean,
  logoGrayscale: boolean
): Promise<{ canvas: HTMLCanvasElement; logoFailed: boolean }> {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;

  await QRCode.toCanvas(canvas, url, {
    width: SIZE,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: "#000000", light: "#ffffff" },
  });

  const ctx = canvas.getContext("2d")!;

  if (inverted) {
    const data = ctx.getImageData(0, 0, SIZE, SIZE);
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i] = 255 - data.data[i];
      data.data[i + 1] = 255 - data.data[i + 1];
      data.data[i + 2] = 255 - data.data[i + 2];
    }
    ctx.putImageData(data, 0, 0);
  }

  let logoFailed = false;

  if (showLogo) {
    const img = await loadLogoFromUrl(url);
    if (img) {
      const logoSize = SIZE * 0.22;
      const x = (SIZE - logoSize) / 2;
      const y = (SIZE - logoSize) / 2;
      const pad = 10;

      ctx.fillStyle = inverted ? "#000000" : "#ffffff";
      ctx.fillRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2);

      ctx.filter = logoGrayscale ? "grayscale(1)" : "none";
      ctx.drawImage(img, x, y, logoSize, logoSize);
      ctx.filter = "none";

      URL.revokeObjectURL(img.src);
    } else {
      logoFailed = true;
    }
  }

  return { canvas, logoFailed };
}

export function QrGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState("");
  const [inverted, setInverted] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [logoGrayscale, setLogoGrayscale] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");
  const [logoWarning, setLogoWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const applyToCanvas = useCallback(
    async (u: string, inv: boolean, logo: boolean, grayscale: boolean) => {
      if (!u.trim()) return;
      const display = canvasRef.current;
      if (!display) return;

      setLoading(true);
      setError("");
      setLogoWarning(false);

      try {
        const { canvas: built, logoFailed } = await buildQrCanvas(u, inv, logo, grayscale);
        display.width = SIZE;
        display.height = SIZE;
        display.getContext("2d")!.drawImage(built, 0, 0);
        setGenerated(true);
        if (logo && logoFailed) setLogoWarning(true);
      } catch {
        setError("URL inválida ou erro ao gerar o QR code.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleGenerate = () => applyToCanvas(url, inverted, showLogo, logoGrayscale);

  const handleInverted = (val: boolean) => {
    setInverted(val);
    if (generated) applyToCanvas(url, val, showLogo, logoGrayscale);
  };

  const handleLogo = (val: boolean) => {
    setShowLogo(val);
    if (generated) applyToCanvas(url, inverted, val, logoGrayscale);
  };

  const handleLogoGrayscale = (val: boolean) => {
    setLogoGrayscale(val);
    if (generated) applyToCanvas(url, inverted, showLogo, val);
  };

  const handleDownload = (format: Format) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `qrcode.${format}`;
    a.href = canvas.toDataURL(`image/${format}`, 0.95);
    a.click();
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <section className={`${CARD} flex flex-col gap-6`}>
        <div>
          <label htmlFor="qr-url" className={LABEL}>
            Endereço
          </label>
          <input
            id="qr-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="https://exemplo.com"
            className={FIELD}
          />
        </div>

        {/* checkbox nativo: teclado, foco e leitor de tela de graça; a cor vem do `accent-` */}
        <fieldset className="flex flex-col gap-3">
          <legend className={`${LABEL} pb-1.5`}>Opções</legend>
          <Check label="Inverter cores" checked={inverted} onChange={handleInverted} />
          <Check label="Ícone do site no centro" checked={showLogo} onChange={handleLogo} />
          {showLogo && <Check label="Ícone em preto e branco" checked={logoGrayscale} onChange={handleLogoGrayscale} />}
        </fieldset>

        {error && (
          <p role="alert" className="text-ui text-danger">
            {error}
          </p>
        )}
        {logoWarning && <p className="text-meta text-ink/60">Não achei o ícone deste domínio — o QR saiu sem ele.</p>}

        <button type="button" onClick={handleGenerate} disabled={!url.trim() || loading} className={`self-start ${BUTTON_SOLID}`}>
          {loading ? <Loader2 className="h-[1.1em] w-[1.1em] animate-spin" aria-hidden /> : <QrCode className="h-[1.1em] w-[1.1em]" aria-hidden />}
          {loading ? "Gerando…" : "Gerar QR code"}
        </button>
      </section>

      <section className={`${CARD} flex flex-col gap-5`}>
        <h2 className={CARD_TITLE}>Prévia</h2>
        {/* o canvas fica sempre montado: é nele que applyToCanvas desenha */}
        <div className="flex aspect-square items-center justify-center bg-surface-sunken">
          <canvas
            ref={canvasRef}
            className={`w-full [image-rendering:pixelated] ${generated ? "block" : "hidden"}`}
          />
          {!generated && <QrCode className="h-12 w-12 text-ink/20" strokeWidth={1.5} aria-hidden />}
        </div>

        {generated && (
          <div className="flex flex-wrap gap-2">
            {(["png", "jpeg", "webp"] as Format[]).map((fmt) => (
              <button key={fmt} type="button" onClick={() => handleDownload(fmt)} className={BUTTON}>
                <Download className="h-[1.1em] w-[1.1em]" aria-hidden />.{fmt}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-ui">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-accent"
      />
      {label}
    </label>
  );
}
