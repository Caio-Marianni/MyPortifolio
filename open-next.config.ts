import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import kvTagCache from "@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache";

/* Cache das páginas com revalidate (home, avaliações, thumbnails) e do revalidatePath da moderação,
   os dois no KV: grátis e sem cartão, ao contrário do R2 que a doc recomenda.
   ponytail: KV é eventualmente consistente — aprovar uma avaliação pode levar até ~60s pra aparecer;
   se um dia isso incomodar, R2 (cache) + D1 (tags). `direct` regenera na própria requisição,
   sem fila: com o tráfego daqui, ninguém espera mais que uma consulta ao Neon. */
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: kvTagCache,
  queue: "direct",
});
