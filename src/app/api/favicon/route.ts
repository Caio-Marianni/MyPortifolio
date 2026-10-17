import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  /* só hostname: sem isto o valor entrava cru na query do Google e dava pra injetar parâmetros */
  if (!domain || !/^[a-z0-9.-]{1,253}$/i.test(domain)) return new NextResponse(null, { status: 400 });

  try {
    const res = await fetch(
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return new NextResponse(null, { status: 404 });

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/png";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
