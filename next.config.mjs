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
    ];
  },
};

export default nextConfig;
