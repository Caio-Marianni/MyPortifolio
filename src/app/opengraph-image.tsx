import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Caio Marianni — Fullstack · Design · Thumbmaker";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/* Tema escuro do site: mesma tinta de `--surface`, `--ink` e `--accent` da classe .dark. */
const SURFACE = "#121110";
const INK = "#EDE7DE";
const ACCENT = "#FF6A1F";

const MARK = "M105 1L211 139L213 1L500 379L446 378L255 130L255 197L392 380L339 378L148 130L147 195L158 210L289 380L238 380L235 377L42 130L42 373L126 266L153 302L0 499L0 2L105 139Z";

const svg = (markup: string) => `data:image/svg+xml;utf8,${encodeURIComponent(markup)}`;

/* O satori desenha `img`, não SVG inline — daí os data URIs. */
const LOGO = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 512 512"><path fill="${ACCENT}" d="${MARK}"/></svg>`);

/* Mesmo contorno do LogoWatermark, cortado pela borda. O traço vai fino (o Logo-outline.svg
   usa 10, que ampliado a ~1000px viraria um risco gordo) — o gesto é a linha, não a massa. */
const OUTLINE = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 512 512"><path fill="none" stroke="#CFCBDD" stroke-width="1.6" stroke-linejoin="miter" stroke-miterlimit="10" d="${MARK}"/></svg>`
);

/* Grão do .grain-cream sem o webp: o noise.webp mora em /public e o runtime edge não lê
   arquivo — feTurbulence dá a mesma poeira sem depender de rede. */
const GRAIN = svg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="1200" height="630" filter="url(#g)"/></svg>`
);

/* ponytail: sem Makaio/Ricko no card — carregar .ttf local aqui exige `fetch(new URL(…))`,
   que o runtime edge não resolve para arquivo. Paleta e composição já identificam a marca;
   para a fonte real seria preciso embutir o ttf em base64 ou servir por URL absoluta. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          backgroundColor: SURFACE,
          color: INK,
          padding: "56px 64px",
        }}
      >
        {/* eslint-disable @next/next/no-img-element -- o satori desenha `img`, não `next/image` */}
        <img src={OUTLINE} width={900} height={900} alt="" style={{ position: "absolute", top: -220, right: -404, opacity: 0.45 }} />
        <img src={GRAIN} width={size.width} height={size.height} alt="" style={{ position: "absolute", top: 0, left: 0, opacity: 0.16 }} />

        {/* Sem a URL no topo: as plataformas já imprimem o domínio embaixo do card, e o canto
            direito é justamente onde o contorno é mais denso. */}
        <img src={LOGO} width={104} height={104} alt="" />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1, letterSpacing: 1 }}>CAIO MARIANNI</div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontFamily: "monospace",
              fontSize: 20,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "rgba(237,231,222,0.45)",
            }}
          >
            Fullstack · Design · Thumbmaker
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
