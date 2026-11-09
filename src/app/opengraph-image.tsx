import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ratingMark } from "@/data/reviews";
import { getSummary } from "@/services/reviews";

/* A capa do link compartilhado (WhatsApp, LinkedIn, X...), na linguagem da home: a tarja preta com o
   retrato, o monograma queimado atrás da cabeça, o nome na Makaio e a nota das avaliações.

   Roda em Node, não no edge, para ler os arquivos de src/assets/og — gerados uma vez a partir dos do
   site, porque o desenhista do next/og (satori) não lê .woff2 nem .webp:
   - makaio.ttf e inter-600.ttf: os .woff2 de src/fonts convertidos (fontTools), a Inter fixada no
     peso 600 porque fonte variável o satori não interpola;
   - portrait.png: public/caio-portrait.webp em 800px, com o mesmo `brightness(0.85)` do site.
   Sem parâmetro dinâmico, a imagem sai pronta no build: a nota é a do dia do deploy. */

export const alt = "Caio Marianni — Fullstack · Design · Thumbnails";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* tinta da tarja no tema claro, que é o que a home usa: --chrome, --chrome-ink e --accent */
const CHROME = "#111111";
const INK = "#F1ECE5";
const ACCENT = "#D24A00";

const MONOGRAM = "M105 1L211 139L213 1L500 379L446 378L255 130L255 197L392 380L339 378L148 130L147 195L158 210L289 380L238 380L235 377L42 130L42 373L126 266L153 302L0 499L0 2L105 139Z";
const STAR = "M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.5l7.1-.6z";

const svg = (markup: string) => `data:image/svg+xml;utf8,${encodeURIComponent(markup)}`;

const LOGO = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 512 512"><path fill="${ACCENT}" d="${MONOGRAM}"/></svg>`);
const STAR_ICON = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${ACCENT}" d="${STAR}"/></svg>`);

/* O monograma marcado a ferro, a mesma receita do BrandedMark (tarja.tsx): chamuscado em volta,
   quina pegando luz, queimado e o carvão no miolo. */
const BRANDED = svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 580 580">
<defs>
<filter id="r" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter>
<filter id="c" x="-10%" y="-10%" width="120%" height="120%"><feMorphology operator="erode" radius="6" result="k"/><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="k" in2="n" scale="10" result="g"/><feGaussianBlur in="g" stdDeviation="2.5"/></filter>
<filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="22" result="w"/><feGaussianBlur in="w" stdDeviation="10"/></filter>
</defs>
<path d="${MONOGRAM}" fill="#2b170c" stroke="#2b170c" stroke-width="24" stroke-linejoin="round" opacity="0.55" filter="url(#s)"/>
<g filter="url(#r)"><path d="${MONOGRAM}" fill="${INK}" opacity="0.06" transform="translate(0 2.5)"/><path d="${MONOGRAM}" fill="#0b0705"/></g>
<path d="${MONOGRAM}" fill="#000" opacity="0.7" filter="url(#c)"/>
</svg>`);


const asset = (file: string) => readFile(join(process.cwd(), "src/assets/og", file));

export default async function Image() {
  const [makaio, inter, portrait, summary] = await Promise.all([asset("makaio.ttf"), asset("inter-600.ttf"), asset("portrait.png"), getSummary()]);
  /* sem avaliação publicada (ou banco fora do ar no build), a linha da nota simplesmente não sai */
  const rating = ratingMark(summary.overall);
  const happy = summary.overall.happy;

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", overflow: "hidden", backgroundColor: CHROME, fontFamily: "Inter" }}>
        {/* eslint-disable @next/next/no-img-element -- o satori desenha `img`, não `next/image` */}
        {/* luz rasante do canto de baixo, como na tarja */}
        <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "radial-gradient(70% 60% at 0% 100%, rgba(241,236,229,0.10), transparent 70%)" }} />

        {/* monograma atrás da cabeça e o retrato por cima, sangrando pela direita */}
        <img src={BRANDED} width={560} height={560} alt="" style={{ position: "absolute", top: 20, left: 520 }} />
        <img src={`data:image/png;base64,${portrait.toString("base64")}`} width={800} height={640} alt="" style={{ position: "absolute", top: 34, left: 470 }} />
        {/* o fim da camiseta some no preto */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 230, display: "flex", backgroundImage: `linear-gradient(to bottom, rgba(17,17,17,0), ${CHROME} 85%)` }} />
        {/* Vinheta. Sem o grão e a hachura do site: textura fina não comprime em PNG e levava a capa
            a ~800KB; sem as duas fica em ~275KB. O WhatsApp deixa de mostrar a prévia acima de
            ~300KB — mexer na composição, medir de novo. */}
        <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(0,0,0,0.75))" }} />

        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 64px" }}>
          <img src={LOGO} width={72} height={72} alt="" />

          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* A Makaio tem um peso só e no site o `font-black` faz o navegador engrossá-la; o satori
                não sintetiza negrito, então o contorno na própria cor faz esse papel. */}
            <div style={{ display: "flex", flexDirection: "column", fontFamily: "Makaio", fontSize: 156, lineHeight: 0.92, letterSpacing: "0.08em", color: INK, WebkitTextStroke: `4px ${INK}` }}>
              <span>CAIO</span>
              <span>MARIANNI</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", marginTop: 30, fontSize: 26, color: INK }}>
              {rating && (
                <div style={{ display: "flex", alignItems: "center", marginRight: 28 }}>
                  <span style={{ marginRight: 12 }}>{rating.value}</span>
                  {Array.from({ length: rating.stars }, (_, i) => (
                    <img key={i} src={STAR_ICON} width={26} height={26} alt="" style={{ marginRight: 4 }} />
                  ))}
                  {happy > 0 && <span style={{ marginLeft: 16, color: "rgba(241,236,229,0.65)" }}>{`${happy} ${happy === 1 ? "cliente feliz" : "clientes felizes"}`}</span>}
                </div>
              )}
            </div>
            <div style={{ display: "flex", marginTop: 14, fontSize: 18, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(241,236,229,0.5)" }}>
              Fullstack · Design · Thumbnails
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Makaio", data: makaio, weight: 400, style: "normal" },
        { name: "Inter", data: inter, weight: 600, style: "normal" },
      ],
    },
  );
}
