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
