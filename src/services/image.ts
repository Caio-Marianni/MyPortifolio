/* Redimensionamento no navegador do cliente, antes de sair do celular. O formulário de
   avaliação é usado de telefone, onde a câmera entrega 4 ou 5 MB por foto — subir isso cru
   seria minutos de espera no 4G e um banco cheio de pixel que ninguém vê. O que sai daqui é
   base64 cru, sem o prefixo `data:`: é assim que a imagem viaja no POST e é assim que ela
   fica guardada, então não há mime pra confiar nem prefixo pra reparsear do outro lado.

   ponytail: canvas puro, sem biblioteca de imagem. A orientação EXIF do celular vem de graça —
   o navegador já entrega a <img> na posição certa, e o canvas desenha o que a <img> mostra. */

/** avatar: quadrado, do tamanho que o card mostra em tela retina */
export const PHOTO_SIZE = 256;
/** foto do projeto: maior lado, o bastante pra abrir em tela cheia sem pesar */
export const SHOT_SIZE = 1280;

/* Vai baixando a qualidade até caber no teto do campo. Foto de celular normal passa na
   primeira; panorama e print de tela cheia é que precisam das outras duas. */
const QUALITIES = [0.72, 0.6, 0.45];

function load(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("arquivo não é uma imagem"));
    };
    img.src = url;
  });
}

/**
 * Redimensiona e devolve base64 cru de JPEG.
 * @param max maior lado do resultado (ou o lado do quadrado, quando `square`)
 * @param limit teto em caracteres de base64 — o mesmo que a rota confere
 * @param square recorta pelo centro num quadrado, para a foto do cliente
 */
export async function shrink(file: File, max: number, limit: number, square = false): Promise<string> {
  const img = await load(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas indisponível");

  if (square) {
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    canvas.width = canvas.height = Math.min(side, max);
    const left = (img.naturalWidth - side) / 2;
    const top = (img.naturalHeight - side) / 2;
    ctx.drawImage(img, left, top, side, side, 0, 0, canvas.width, canvas.height);
  } else {
    /* nunca aumenta: foto pequena continua do tamanho que veio */
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  let data = "";
  for (const quality of QUALITIES) {
    data = canvas.toDataURL("image/jpeg", quality).split(",")[1];
    if (data.length <= limit) break;
  }
  return data;
}

/** Volta pra data URL só na hora de mostrar a prévia — o que trafega e o que grava é o cru. */
export const preview = (base64: string): string => `data:image/jpeg;base64,${base64}`;
