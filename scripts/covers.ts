/* Gera as capas dos projetos numa receita só, em vez de um mockup diferente por projeto:
   - capa (4:3): fundo liso na cor `brand`, a janela do desktop e o celular por cima, à direita.
     Sai em public/projects/cover/p<id>.webp.
   - tile (3:2): a logo do projeto centrada sobre a mesma cor, para as linhas pequenas do índice,
     onde um mockup vira mancha. Sai em public/projects/tile/p<id>.webp. Sem `logo`, não tem tile.
   - telas cruas (desktop 16:10 e celular), sem moldura, para os destaques da home, que desenham
     a moldura em CSS. Saem em public/projects/screen/p<id>-desktop.webp e -mobile.webp.
   As telas são capturadas do site no ar (`demo`) pelo Edge em modo headless — o caminho dele pode
   vir de EDGE_PATH. Só entram projetos com `brand` e `demo`.

   Rodar quando o site de um projeto mudar ou um projeto novo entrar: `npm run covers`. Depois
   apontar `cover` e `tile` do projeto em data/projects.ts para os arquivos gerados. */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { projects, screens } from "../src/data/projects.ts";

const PUBLIC = fileURLToPath(new URL("../public", import.meta.url));
const EDGE = process.env.EDGE_PATH ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const CANVAS = { w: 1600, h: 1200 };
const TILE = { w: 480, h: 320 };
/* a janela do desktop: captura em 1440×900, desenhada com 1180 de largura e a barra do navegador */
const DESKTOP = { x: 120, y: 170, w: 1180, h: 738, bar: 34, r: 14 };
/* O celular: captura em 492×1065 a 2x, com a moldura preta em volta da tela. 492 e não 390 porque
   é a menor viewport que o Edge headless aceita — pedindo 390 ele desenha o site em 492 e a
   captura corta a direita. Ainda é layout mobile; a altura segue a proporção da tela (290×628). */
const PHONE = { x: 1166, y: 438, w: 290, h: 628, bezel: 12, r: 36 };

function capture(url: string, out: string, size: string, scale: number) {
  for (let attempt = 0; attempt < 2 && !existsSync(out); attempt++) {
    /* Um perfil novo por captura: com um perfil em uso — o Edge aberto, ou a instância da captura
       anterior ainda fechando — o comando é repassado a ela e sai sem gravar nada. */
    const profile = `${out}.profile${attempt}`;
    const args = ["--headless=new", `--user-data-dir=${profile}`, "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=6000", `--force-device-scale-factor=${scale}`, `--window-size=${size}`, `--screenshot=${out}`, url];
    /* No Windows o msedge.exe é só o lançador: sai na hora e quem grava a captura é outro
       processo, segundos depois. Então espera o arquivo aparecer e parar de crescer, até 60 s. */
    spawnSync(EDGE, args, { timeout: 60_000, stdio: "ignore" });
    let bytes = -1;
    for (let waited = 0; waited < 60_000; waited += 500) {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
      if (!existsSync(out)) continue;
      const now = statSync(out).size;
      if (now > 0 && now === bytes) break;
      bytes = now;
    }
  }
  if (!existsSync(out)) throw new Error(`Não consegui capturar ${url} (${size}). Confira o EDGE_PATH e se o site está no ar.`);
}

const roundMask = (w: number, h: number, r: number) => Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}"/></svg>`);

async function rounded(input: Buffer, w: number, h: number, r: number) {
  return sharp(input).resize(w, h).composite([{ input: roundMask(w, h, r), blend: "dest-in" }]).png().toBuffer();
}

/** sombra de verdade embaixo da peça: o mesmo retângulo arredondado, preto e desfocado */
async function shadow(w: number, h: number, r: number) {
  const pad = 60;
  const svg = `<svg width="${w + pad * 2}" height="${h + pad * 2}"><rect x="${pad}" y="${pad}" width="${w}" height="${h}" rx="${r}" fill="black" fill-opacity="0.45"/></svg>`;
  return { input: await sharp(Buffer.from(svg)).blur(28).png().toBuffer(), pad };
}

async function desktopWindow(shot: string) {
  const { w, h, bar, r } = DESKTOP;
  const dots = [0, 1, 2].map((i) => `<circle cx="${22 + i * 20}" cy="${bar / 2}" r="6" fill="#cfcfcf"/>`).join("");
  const frame = Buffer.from(`<svg width="${w}" height="${h + bar}"><rect width="${w}" height="${h + bar}" fill="#f4f4f4"/>${dots}</svg>`);
  const screen = await sharp(shot).resize(w, h).png().toBuffer();
  const window = await sharp(frame).composite([{ input: screen, top: bar, left: 0 }]).png().toBuffer();
  return rounded(window, w, h + bar, r);
}

async function phone(shot: string) {
  const { w, h, bezel, r } = PHONE;
  const body = Buffer.from(`<svg width="${w + bezel * 2}" height="${h + bezel * 2}"><rect width="${w + bezel * 2}" height="${h + bezel * 2}" rx="${r + bezel}" fill="#0d0d0d"/></svg>`);
  const screen = await rounded(await sharp(shot).resize(w, h, { position: "top" }).png().toBuffer(), w, h, r);
  return sharp(body).composite([{ input: screen, top: bezel, left: bezel }]).png().toBuffer();
}

async function cover(brand: string, desktopShot: string, phoneShot: string, out: string) {
  const d = DESKTOP;
  const p = PHONE;
  const dShadow = await shadow(d.w, d.h + d.bar, d.r);
  const pShadow = await shadow(p.w + p.bezel * 2, p.h + p.bezel * 2, p.r + p.bezel);

  await sharp({ create: { width: CANVAS.w, height: CANVAS.h, channels: 3, background: brand } })
    .composite([
      { input: dShadow.input, left: d.x - dShadow.pad, top: d.y - dShadow.pad + 24 },
      { input: await desktopWindow(desktopShot), left: d.x, top: d.y },
      { input: pShadow.input, left: p.x - pShadow.pad, top: p.y - pShadow.pad + 24 },
      { input: await phone(phoneShot), left: p.x, top: p.y },
    ])
    .webp({ quality: 82 })
    .toFile(out);
}

async function tile(brand: string, logo: string, out: string) {
  /* a logo cabe numa caixa de 62% × 46% do tile: a wordmark larga do USD e o símbolo quadrado
     da GoPack terminam com o mesmo peso visual */
  const mark = await sharp(join(PUBLIC, logo), { density: 300 })
    .resize(Math.round(TILE.w * 0.62), Math.round(TILE.h * 0.46), { fit: "inside" })
    .png()
    .toBuffer();
  const { width = 0, height = 0 } = await sharp(mark).metadata();

  await sharp({ create: { width: TILE.w, height: TILE.h, channels: 3, background: brand } })
    .composite([{ input: mark, left: Math.round((TILE.w - width) / 2), top: Math.round((TILE.h - height) / 2) }])
    .webp({ quality: 88 })
    .toFile(out);
}

async function main() {
  const tmp = mkdtempSync(join(tmpdir(), "covers-"));
  mkdirSync(join(PUBLIC, "projects/cover"), { recursive: true });
  mkdirSync(join(PUBLIC, "projects/tile"), { recursive: true });
  mkdirSync(join(PUBLIC, "projects/screen"), { recursive: true });

  for (const project of projects) {
    if (!project.brand || !project.demo) continue;
    const desktopShot = join(tmp, `${project.id}-d.png`);
    const phoneShot = join(tmp, `${project.id}-m.png`);
    capture(project.demo, desktopShot, "1440,900", 1);
    capture(project.demo, phoneShot, "492,1065", 2);

    await cover(project.brand, desktopShot, phoneShot, join(PUBLIC, `projects/cover/p${project.id}.webp`));
    /* as telas cruas, para as molduras em CSS dos destaques da home (site/device-showcase) */
    const screen = screens(project);
    if (screen) {
      await sharp(desktopShot).resize(1200).webp({ quality: 80 }).toFile(join(PUBLIC, screen.desktop));
      await sharp(phoneShot).resize(492).webp({ quality: 80 }).toFile(join(PUBLIC, screen.mobile));
    }
    if (project.logo) await tile(project.brand, project.logo, join(PUBLIC, `projects/tile/p${project.id}.webp`));
    process.stdout.write(`${project.title}: ok\n`);
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
