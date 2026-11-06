-- Edição de avaliação pelo painel. A versão sobe a cada edição e entra na URL das imagens: a
-- rota serve foto com cache de um ano, então sem ela a foto trocada continuaria a antiga na tela.
alter table reviews add column if not exists version int not null default 1;
