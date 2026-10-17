/* Gera as versões que a galeria de thumbnails serve: AVIF em 640 e 1280 px de largura, em
   public/thumbnail/<largura>/<nome>.avif. Feito uma vez aqui em vez de a cada pedido no
   otimizador do Next — lá o AVIF levava ~1s por imagem e por largura no primeiro acesso, e a
   galeria tem dezenas delas.

   Rodar depois de adicionar ou trocar uma thumbnail: `npm run thumbs`. Pula o que já está
   em dia, então repetir é barato. */

import { mkdirSync, readdirSync, statSync } from "node:fs";
import { join, parse } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/* fileURLToPath e não `.pathname`: o caminho do projeto tem acento, que a URL codifica */
const DIR = fileURLToPath(new URL("../public/thumbnail/", import.meta.url));
/* as mesmas larguras do `loader` em app/thumbnails/page.tsx */
const WIDTHS = [640, 1280];

/* função e não await solto no topo: o tsconfig do projeto (que também confere scripts/) não
   aceita top-level await */
async function main() {
  const sources = readdirSync(DIR).filter((file) => /\.(webp|avif|jpe?g|png)$/i.test(file));
  let made = 0;

  for (const width of WIDTHS) {
    mkdirSync(join(DIR, String(width)), { recursive: true });

    for (const file of sources) {
      const src = join(DIR, file);
      const out = join(DIR, String(width), `${parse(file).name}.avif`);
      try {
        if (statSync(out).mtimeMs >= statSync(src).mtimeMs) continue;
      } catch {
        /* ainda não existe: gera */
      }
      await sharp(src).resize({ width, withoutEnlargement: true }).avif({ quality: 65, effort: 6 }).toFile(out);
      made++;
    }
  }

  console.log(`thumbs: ${made} gerada(s), ${sources.length * WIDTHS.length - made} já em dia`);
}

main().catch((error) => {
  console.error("thumbs: falhou —", error);
  process.exit(1);
});
