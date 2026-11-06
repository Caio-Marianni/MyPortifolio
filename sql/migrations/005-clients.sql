-- Clientes e o "pago até" do plano mensal (/admin/clientes). O repositório é público e o banco
-- não: aqui entra onde o site do cliente mora, nunca a senha dele — senha fica no gerenciador.
create table if not exists clients (
  id           serial primary key,
  name         text        not null,
  contact      text,                  -- WhatsApp ou e-mail
  track        text        not null check (track in ('web', 'thumbs')),
  site         text,                  -- domínio do cliente
  hosting      text,                  -- "Cloudflare", "VPS Hostinger"… o lugar, não o acesso
  domain_until date,                  -- vencimento do domínio
  monthly_fee  int         not null default 0 check (monthly_fee >= 0), -- centavos, 0 = sem plano
  paid_until   date,                  -- vencido = atrasado
  notes        text,
  created_at   timestamptz not null default now()
);
