/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 31536000,
  },
  /* Cabeçalho que o servidor manda de graça e nada mais — o Next não assina o que está em
     /public, então cada visita revalidava o grão e as capas dos projetos. São arquivos que
     só mudam por commit; quando mudar, muda o nome. */
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        /* Versões da galeria, servidas direto pelo loader de app/thumbnails. Sem isto o padrão
           de /public é revalidar a cada visita — dezenas de idas ao servidor por página. Não é
           `immutable` porque uma peça pode ser trocada mantendo o nome: um dia fresco, e depois
           o navegador mostra a guardada enquanto confere em segundo plano. */
        source: "/thumbnail/:width(640|1280)/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=2592000" }],
      },
    ];
  },
};

export default nextConfig;
