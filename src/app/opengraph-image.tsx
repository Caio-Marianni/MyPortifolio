import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Caio Marianni — Fullstack · Design · Thumbmaker";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const CREAM = "#F1ECE5";
const INK = "#101010";

/* Monograma como data URI: o satori desenha `img`, não SVG inline. Mesmo path do LogoMark. */
const LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 512 512"><path fill="#FF5500" d="M105 1L211 139L213 1L500 379L446 378L255 130L255 197L392 380L339 378L148 130L147 195L158 210L289 380L238 380L235 377L42 130L42 373L126 266L153 302L0 499L0 2L105 139Z"/></svg>'
)}`;

/* ponytail: sem Makaio/Ricko no card — carregar .ttf local aqui exige `fetch(new URL(…))`,
   que o runtime edge não resolve para arquivo. Paleta e composição já identificam a marca;
   para a fonte real seria preciso embutir o ttf em base64 ou servir por URL absoluta. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: CREAM,
          color: INK,
        }}
      >
        {/* faixa preta do topo, igual à navbar do site */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#111111",
            color: CREAM,
            padding: "22px 64px",
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <img src={LOGO} width={34} height={34} alt="" />
          <div style={{ display: "flex" }}>caiomarianni.com.br</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "0 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontStyle: "italic",
              color: "#B4ADA3",
              marginLeft: 6,
            }}
          >
            Fullstack
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 190,
              fontWeight: 900,
              lineHeight: 0.86,
              letterSpacing: 6,
            }}
          >
            CAIO
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "monospace",
              fontSize: 26,
              letterSpacing: 14,
              textTransform: "uppercase",
              color: "rgba(16,16,16,0.6)",
              marginTop: 26,
            }}
          >
            Marianni
          </div>
        </div>

        {/* faixa de metadados do rodapé, mesma micro-tipografia do rail */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#111111",
            color: "rgba(255,255,255,0.7)",
            padding: "20px 64px",
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex", gap: 40 }}>
            <div style={{ display: "flex" }}>Fullstack</div>
            <div style={{ display: "flex" }}>Design</div>
            <div style={{ display: "flex" }}>Thumbmaker</div>
          </div>
          <div style={{ display: "flex", gap: 40 }}>
            <div style={{ display: "flex" }}>Goiânia, BR</div>
            <div style={{ display: "flex" }}>Desde 2022</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
