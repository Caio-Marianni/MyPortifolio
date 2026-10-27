import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

/* O `next lint` saiu no Next 16: o eslint roda direto, com o mesmo conjunto de antes. */
export default defineConfig([
  ...nextVitals,
  {
    /* Regra nova do react-hooks 7. Os quatro casos daqui (tema, idioma, relógio, âncora da
       URL) leem algo que só existe no navegador e de propósito só depois de hidratar — ler no
       render quebraria a hidratação. Reescrever com useSyncExternalStore se um dia ligar o
       React Compiler. */
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts"]),
]);
