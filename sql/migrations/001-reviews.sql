-- Avaliações e a trava de tentativas do painel. O convite é assinado (HMAC), não guardado.
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

-- Moderação é pelo painel em /admin. No SQL Editor do Neon, só como escotilha:
--   select id, invite, name, status from reviews order by created_at desc
--   update reviews set status = 'approved' where id = 1

-- Tentativas de login no painel. Serve só pra travar a porta depois de erros seguidos: a
-- contagem precisa sobreviver ao reciclo da função serverless, então mora aqui e não em RAM.
create table if not exists login_attempts (
  ip text        not null,
  at timestamptz not null default now()
);
