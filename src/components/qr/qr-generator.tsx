"use client";

import { useRef, useState, useCallback } from "react";
import QRCode from "qrcode";
import { Download, QrCode, Loader2 } from "lucide-react";

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
    <div className="flex flex-col items-center gap-7 w-full max-w-sm mx-auto">
      <div className="w-full space-y-2">
        <div className="relative">
          <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F1ECE5]/40 pointer-events-none" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="https://exemplo.com"
            className="w-full bg-[#F1ECE5]/[0.04] border border-[#F1ECE5]/20 hover:border-[#F1ECE5]/35 focus:border-[#FF5500] rounded-lg pl-10 pr-4 py-3 text-[#F1ECE5] placeholder-[#F1ECE5]/30 outline-none transition-colors text-sm"
          />
        </div>
        {error && <p className="text-[#FF5500] text-sm">{error}</p>}
        {logoWarning && (
          <p className="text-[#F1ECE5]/55 text-xs">
            Favicon não encontrado para este domínio.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-center gap-8">
          <Toggle label="Inverter cores" checked={inverted} onChange={handleInverted} />
          <Toggle label="Logo no centro" checked={showLogo} onChange={handleLogo} />
        </div>
        {showLogo && (
          <div className="flex justify-center">
            <Toggle label="Logo em P&B" checked={logoGrayscale} onChange={handleLogoGrayscale} />
          </div>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={!url.trim() || loading}
        className="w-full flex items-center justify-center gap-2 bg-[#FF5500] hover:bg-[#E64D00] text-white font-medium py-3 rounded-lg transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <QrCode className="w-4 h-4" />
        )}
        {loading ? "Gerando..." : "Gerar QR Code"}
      </button>

      <canvas
        ref={canvasRef}
        className={`rounded-xl w-full border border-[#F1ECE5]/15 ${!generated ? "hidden" : "block"}`}
        style={{ imageRendering: "pixelated" }}
      />

      {generated && (
        <div className="grid grid-cols-3 gap-2 w-full">
          {(["png", "jpeg", "webp"] as Format[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleDownload(fmt)}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-[#F1ECE5]/20 hover:border-[#F1ECE5]/45 text-[#F1ECE5]/60 hover:text-[#F1ECE5] text-xs font-medium transition-colors hover:bg-[#F1ECE5]/5"
            >
              <Download className="w-3.5 h-3.5" />
              .{fmt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full flex-shrink-0 transition-colors duration-200 ${
          checked ? "bg-[#FF5500]" : "bg-[#F1ECE5]/20 hover:bg-[#F1ECE5]/30"
        }`}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
          style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
        />
      </button>
      <span className="text-sm text-[#F1ECE5]/75">{label}</span>
    </label>
  );
}
