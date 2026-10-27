-- Rode uma vez no SQL Editor do Neon (precisa de DATABASE_URL definida no projeto).
-- Uma tabela só: o convite é assinado (HMAC), não guardado.
create table if not exists reviews (
  id         serial primary key,
  -- qual link gerou esta avaliação; é o único campo que a assinatura protege
  invite     text        not null,
  name       text        not null,
  company    text,
  track      text        not null check (track in ('web', 'thumbs')),
  rating     smallint    not null check (rating between 1 and 5),
  comment    text        not null,
  email      text,                -- opcional, nunca exibido no site
  status     text        not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- Moderação é pelo painel em /admin. O SQL abaixo só serve de escotilha:
--   select id, invite, name, status from reviews order by created_at desc;
--   update reviews set status = 'approved' where id = 1;

-- Avaliação que chegou por fora do site (WhatsApp, e-mail) entra à mão, já publicada:
--   insert into reviews (invite, name, company, track, rating, comment, status)
--   values ('manual', 'Nome', 'Empresa', 'web', 5, 'Texto.', 'approved');

-- Tentativas de login no painel. Serve só pra travar a porta depois de erros seguidos: a
-- contagem precisa sobreviver ao reciclo da função serverless, então mora aqui e não em RAM.
create table if not exists login_attempts (
  ip text        not null,
  at timestamptz not null default now()
);

-- ── segunda leva: foto do cliente, fotos do projeto e vínculo com projeto publicado ──
-- Rode uma vez; é aditivo e idempotente, dá pra repetir sem medo.
alter table reviews add column if not exists photo   text;    -- base64 cru do avatar 256px (sem prefixo data:)
alter table reviews add column if not exists shots   text[];  -- base64 cru das fotos do projeto, até 3
alter table reviews add column if not exists project smallint;-- id em data/projects.ts; nulo = trabalho fora do site

-- O binário nunca sai daqui num `select` de listagem: as páginas pedem só `photo is not null` e
-- `array_length(shots,1)`, e o byte vem por /api/reviews/[id]/image. Sem isso o HTML de toda
-- página de avaliação carregaria alguns MB de base64.

-- ── terceira leva: mensagens do formulário de contato ──
-- Rode uma vez; idempotente. Antes o formulário só abria o programa de e-mail (mailto) e quem
-- não tinha um configurado perdia a mensagem. Agora ela fica aqui e aparece no /admin.
create table if not exists messages (
  id         serial primary key,
  name       text        not null,
  email      text        not null,
  message    text        not null,
  -- só pro limite de envios por IP; nunca aparece no painel
  ip         text        not null,
  created_at timestamptz not null default now()
);

-- ── quarta leva: edição de avaliação pelo painel ──
-- Rode uma vez; idempotente. A versão sobe a cada edição e entra na URL das imagens: a rota
-- serve foto com cache de um ano, então sem ela a foto trocada continuaria a antiga na tela.
alter table reviews add column if not exists version int not null default 1;

-- ── quinta leva: clientes e o "pago até" do plano mensal (/admin/clientes) ──
-- Rode uma vez; idempotente. O repositório é público e o banco não: aqui entra onde o site do
-- cliente mora, nunca a senha dele — senha fica no gerenciador de senhas.
create table if not exists clients (
  id           serial primary key,
  name         text        not null,
  contact      text,                  -- WhatsApp ou e-mail
  track        text        not null check (track in ('web', 'thumbs')),
  site         text,                  -- domínio do cliente
  hosting      text,                  -- "Vercel", "VPS Hostinger"… o lugar, não o acesso
  domain_until date,                  -- vencimento do domínio
  monthly_fee  int         not null default 0 check (monthly_fee >= 0), -- centavos; 0 = sem plano
  paid_until   date,                  -- vencido = atrasado
  notes        text,
  created_at   timestamptz not null default now()
);
