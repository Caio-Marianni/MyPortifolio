/* Enquanto a tela do painel consulta o banco (a ficha faz oito consultas), o esqueleto dela no
   lugar: o clique responde na hora, em vez de a tela velha ficar parada parecendo que nada
   aconteceu. Parado de propósito — sem pulsar. O formato é o das telas — título, quatro números, coluna principal e lateral. */

const BLOCK = "bg-paper";

export default function PainelLoading() {
  return (
    <div role="status" >
      <span className="sr-only">Carregando…</span>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-7 w-40 max-w-full rounded-md bg-ink/10" />
        <div className="h-9 w-72 max-w-full rounded-lg bg-ink/10 max-sm:hidden" />
      </div>
      <div className="mb-8 grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${BLOCK} h-28`} />
        ))}
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <div className={`${BLOCK} h-56`} />
          <div className={`${BLOCK} h-32`} />
        </div>
        <div className={`${BLOCK} h-40`} />
      </div>
    </div>
  );
}
