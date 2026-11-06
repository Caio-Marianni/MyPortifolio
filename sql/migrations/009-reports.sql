-- Relatório mensal de um plano: os números do Google Analytics congelados no dia em que você gera,
-- o recado do mês e quais seções o cliente vê. Um por plano por mês. Depois de enviado, os números
-- não mudam mais — o cliente vê sempre o que recebeu.
create table if not exists reports (
  id         serial primary key,
  plan_id    int         not null references plans (id) on delete cascade,
  month      text        not null check (month ~ '^\d{4}-\d{2}$'),  -- "YYYY-MM", o mês coberto
  data       jsonb,                                               -- vazio = plano sem GA4
  sections   text[]      not null default '{}',
  note       text,
  sent_on    date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_id, month)
);
