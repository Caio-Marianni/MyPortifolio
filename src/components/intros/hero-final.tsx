import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { LogoMark } from "@/components/ui/brand-marks";

/* O quadro onde todas as intros terminam: tarja preta com a assinatura à esquerda, as duas
   trilhas no creme à direita. Os `view-transition-name` são as peças que as cenas fazem voar
   até aqui (tarja, wordmark, thumb, monitor) — sem par na fase anterior, só aparecem. */

export const THUMB_SRC = "/thumbnail/1280/AlanZOKASUPWORK.avif";
export const WEB_SRC = "/projects/cover/ana2.webp";

const CARD = "group relative flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-surface-raised p-3 transition-colors hover:border-ink/30";
const CARD_LABEL = "flex items-center justify-between px-1 pt-3 text-ui font-bold";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex flex-col [view-transition-name:wordmark] ${className}`}>
      <span className="font-makaio text-[clamp(64px,8vw,132px)] leading-[0.85] tracking-display">CAIO</span>
      <span className="mt-2 flex justify-between font-mono text-[clamp(10px,1vw,14px)] uppercase">
        {"MARIANNI".split("").map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </span>
    </div>
  );
}

export function HeroFinal({ className = "" }: { className?: string }) {
  return (
    <div className={`grid h-full min-h-0 grid-rows-[auto_1fr] md:grid-cols-[38%_1fr] md:grid-rows-1 [view-transition-name:monitor] ${className}`}>
      <aside className="flex flex-col justify-between gap-8 bg-chrome p-6 text-chrome-ink [view-transition-name:tarja] md:p-10 lg:p-14">
        <div className="rise i1 flex items-center justify-between font-mono text-meta uppercase tracking-[0.14em] text-chrome-ink/60">
          <span className="h-7 w-7">
            <LogoMark />
          </span>
          <span>Goiás · desde 2022</span>
        </div>
        <div className="flex flex-col gap-6">
          <Wordmark />
          <p className="rise i2 max-w-[30ch] text-body text-chrome-ink/75">
            Sites que vendem e thumbnails que fazem clicar. Do código ao clique, feito por uma pessoa só.
          </p>
        </div>
        <a
          href="#"
          className="rise i3 inline-flex min-h-[52px] w-fit items-center gap-2 rounded-lg bg-accent px-7 text-ui font-bold text-accent-ink [box-shadow:0_6px_0_0_rgb(var(--accent-hover))]"
        >
          Fale comigo <ArrowUpRight className="h-[1.1em] w-[1.1em]" />
        </a>
      </aside>

      <section className="grain-cream flex min-h-0 flex-col gap-5 p-6 md:p-10 lg:p-14">
        <p className="rise i2 font-mono text-meta uppercase tracking-[0.14em] text-ink/60">Escolha por onde começar</p>
        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-2">
          <a href="#" className={`rise i3 ${CARD}`}>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-surface-sunken lg:aspect-auto lg:flex-1">
              <div className="absolute inset-x-0 top-0 z-10 flex h-6 items-center gap-1.5 bg-ink/85 px-2.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-surface/40" />
                ))}
              </div>
              <Image src={WEB_SRC} alt="" fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover object-top pt-6" />
            </div>
            <span className={CARD_LABEL}>
              Sites & sistemas <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </a>
          <a href="#" className={`rise i4 ${CARD}`}>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-surface-sunken [view-transition-name:thumb] lg:aspect-auto lg:flex-1">
              <Image src={THUMB_SRC} alt="" fill sizes="(min-width: 1024px) 30vw, 90vw" className="object-cover" />
            </div>
            <span className={CARD_LABEL}>
              Thumbnails <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}
