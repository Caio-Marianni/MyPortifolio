-- Ficha do cliente: contas e acessos, planos mensais, projetos e o histórico de pagamentos.

-- Onde as coisas do cliente moram e qual acesso você tem. Senha nunca: ela fica no gerenciador.
create table if not exists client_accounts (
  id         serial primary key,
  client_id  int         not null references clients (id) on delete cascade,
  service    text        not null,  -- "Domínio (Registro.br)", "Google Analytics"…
  owner      text        not null default 'client' check (owner in ('client', 'me')),
  access     text,                  -- "admin pelo meu Gmail"
  expires_on date,                  -- renovação de domínio, hospedagem
  notes      text,
  created_at timestamptz not null default now()
);

-- Plano mensal: manutenção e relatório. O dia de `first_due` é o dia de vencimento de todo mês,
-- por isso até 28 — fevereiro não tem 29, 30 e 31.
create table if not exists plans (
  id          serial primary key,
  client_id   int         not null references clients (id) on delete cascade,
  name        text        not null,
  monthly_fee int         not null check (monthly_fee > 0),  -- centavos
  first_due   date        not null check (extract(day from first_due) <= 28),
  status      text        not null default 'active' check (status in ('active', 'paused', 'ended')),
  includes    text,                                           -- o que o plano cobre
  reports     boolean     not null default true,              -- manda relatório mensal?
  ga_property text,                                           -- id numérico da propriedade do GA4
  created_at  timestamptz not null default now()
);

-- Projeto de entrega única.
create table if not exists projects (
  id         serial primary key,
  client_id  int         not null references clients (id) on delete cascade,
  title      text        not null,
  scope      text,
  total      int         not null default 0 check (total >= 0),  -- centavos, 0 = a combinar
  deadline   date,
  status     text        not null default 'proposal'
             check (status in ('proposal', 'approved', 'in_progress', 'delivered', 'canceled')),
  notes      text,
  created_at timestamptz not null default now()
);

-- Pagamentos de plano (um por mês, gravado no "Recebi") e parcelas de projeto (combinadas antes,
-- recebidas depois). Sem `on delete cascade` de propósito: plano ou projeto com dinheiro
-- registrado não some por um clique — encerra ou cancela.
create table if not exists payments (
  id          serial primary key,
  plan_id     int         references plans (id),
  project_id  int         references projects (id),
  description text,
  amount      int         not null check (amount > 0),  -- centavos
  due_on      date        not null,
  paid_on     date,                                       -- vazio = a receber
  created_at  timestamptz not null default now(),
  check ((plan_id is null) <> (project_id is null))
);
