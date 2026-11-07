import { useCallback, useRef } from "react";

/** Um "tec" curto e baixo, sintetizado na hora pelo Web Audio — sem arquivo de som para baixar.
    Um tom que cai de agudo para grave em 30ms com volume sumindo em 50ms: soa como tecla, não
    como bipe. O contexto de áudio nasce no primeiro clique, que é quando o navegador deixa. */
export function useKeyClick() {
  const context = useRef<AudioContext | null>(null);

  return useCallback(() => {
    try {
      context.current ??= new AudioContext();
      const audio = context.current;
      const now = audio.currentTime;
      const tone = audio.createOscillator();
      const volume = audio.createGain();

      tone.type = "square";
      tone.frequency.setValueAtTime(1800, now);
      tone.frequency.exponentialRampToValueAtTime(500, now + 0.03);
      volume.gain.setValueAtTime(0.035, now);
      volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      tone.connect(volume).connect(audio.destination);
      tone.start(now);
      tone.stop(now + 0.06);
    } catch {
      /* navegador sem Web Audio ou com áudio bloqueado: o filtro funciona igual, só sem som */
    }
  }, []);
}
