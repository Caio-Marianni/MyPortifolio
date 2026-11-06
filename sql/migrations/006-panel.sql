-- Painel com menu (/admin). Mensagem respondida fica marcada em vez de sumir da lista, e o
-- cliente passa a ser só de web: ganha o que o contrato pede (documento, endereço) e contato
-- separado — o WhatsApp sozinho é o que abre a conversa direto do painel.
alter table messages add column if not exists answered_at timestamptz;

alter table clients add column if not exists document text;  -- CPF ou CNPJ, pro contrato
alter table clients add column if not exists whatsapp text;
alter table clients add column if not exists email    text;
alter table clients add column if not exists address  text;

-- `track`, `contact`, `hosting`, `domain_until`, `monthly_fee` e `paid_until` ficam até o deploy
-- do painel novo, porque o código no ar ainda grava neles. `track` ganha padrão pra que o código
-- novo, que não sabe dele, consiga inserir. Saem numa migração depois do deploy.
alter table clients alter column track set default 'web';
