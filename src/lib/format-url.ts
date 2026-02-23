export function formatDisplayUrl(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\.vercel\.app$/, "")
    .replace(/\/$/, "");
}
