import type { DocKind } from "@/services/documents";

/* Ponto de partida dos modelos, oferecido só na hora de criar: daí em diante o texto mora no
   banco e é seu. Aqui fica o esqueleto genérico — os seus dados ([SEU NOME], [SEU DOCUMENTO]) e
   as cláusulas finais entram pelo painel, fora do repositório público. Revisar com um advogado
   antes do primeiro uso. */

export const STARTERS: Record<string, { kind: DocKind; name: string; body: string }> = {
  proposta: {
    kind: "proposal",
    name: "Proposta de projeto",
    body: `# Proposta comercial

**Cliente:** {cliente}
**Data:** {data}

## Projeto

{projeto}

## Escopo

{escopo}

## Fora do escopo

- Produção de textos e fotos — o conteúdo é enviado pelo cliente
- Funcionalidades que não estão no escopo acima

## Investimento

Valor total: **{valor}**

{parcelas}

## Prazo

Entrega prevista para {prazo}, contada a partir do pagamento da entrada e do envio do conteúdo.

## Validade

Esta proposta vale por 15 dias a partir de {data}.

[SEU NOME]
[SEU E-MAIL] · [SEU WHATSAPP]`,
  },

  "contrato-projeto": {
    kind: "contract",
    name: "Contrato de projeto",
    body: `# Contrato de prestação de serviços de desenvolvimento web

**CONTRATANTE:** {cliente}, inscrito no CPF/CNPJ sob o nº {documento}, com endereço em {endereco}.

**CONTRATADO:** [SEU NOME COMPLETO], inscrito no CPF/CNPJ sob o nº [SEU DOCUMENTO], com endereço em [SEU ENDEREÇO].

## Cláusula 1 — Objeto

O CONTRATADO desenvolverá para o CONTRATANTE o projeto **{projeto}**, com o seguinte escopo:

{escopo}

O que não estiver neste escopo será orçado à parte.

## Cláusula 2 — Valor e pagamento

Pelo serviço, o CONTRATANTE pagará **{valor}**, da seguinte forma:

{parcelas}

O atraso no pagamento suspende o andamento do projeto até a regularização.

## Cláusula 3 — Prazo

O projeto será entregue até {prazo}, contado a partir do pagamento da entrada e do envio do conteúdo pelo CONTRATANTE. Atraso no envio de conteúdo ou nas aprovações prorroga o prazo pelo mesmo período.

## Cláusula 4 — Contas, domínio e propriedade

Domínio, hospedagem e contas de serviços (como o Google Analytics) ficam em nome do CONTRATANTE desde o início. Com a quitação integral, o CONTRATANTE passa a ter todos os direitos sobre o site entregue.

## Cláusula 5 — Rescisão

Qualquer das partes pode rescindir este contrato por escrito. Os valores já pagos correspondem ao trabalho realizado até a data da rescisão.

## Cláusula 6 — Foro

Fica eleito o foro da comarca de [SUA CIDADE] para resolver questões deste contrato.

[SUA CIDADE], {data}.`,
  },

  "contrato-plano": {
    kind: "contract",
    name: "Contrato de plano mensal",
    body: `# Contrato de manutenção mensal de site

**CONTRATANTE:** {cliente}, inscrito no CPF/CNPJ sob o nº {documento}, com endereço em {endereco}.

**CONTRATADO:** [SEU NOME COMPLETO], inscrito no CPF/CNPJ sob o nº [SEU DOCUMENTO], com endereço em [SEU ENDEREÇO].

## Cláusula 1 — Objeto

O CONTRATADO prestará ao CONTRATANTE o plano **{plano}** para o site {site}, que inclui:

{inclui}

## Cláusula 2 — Relatório mensal

Até o dia 3 de cada mês, o CONTRATADO envia ao CONTRATANTE um relatório com os acessos e contatos do site no mês anterior.

## Cláusula 3 — Valor e vencimento

O CONTRATANTE pagará **{mensalidade}** por mês, com vencimento {vencimento}, a partir de {inicio}. O atraso superior a 15 dias suspende os serviços até a regularização.

## Cláusula 4 — Contas e acessos

Domínio, hospedagem e contas de serviços ficam em nome do CONTRATANTE. O CONTRATADO acessa com o próprio login e tem o acesso retirado ao fim do contrato.

## Cláusula 5 — Vigência e rescisão

Este contrato vale por prazo indeterminado e pode ser encerrado por qualquer das partes com aviso por escrito de 30 dias.

## Cláusula 6 — Foro

Fica eleito o foro da comarca de [SUA CIDADE] para resolver questões deste contrato.

[SUA CIDADE], {data}.`,
  },

  branco: { kind: "proposal", name: "", body: "" },
};
