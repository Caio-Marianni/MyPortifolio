-- Propostas e contratos. O modelo é o texto que você escreve uma vez, com {campos}; o documento
-- é o modelo preenchido com os dados de um cliente, editável até ser assinado. Os dois moram no
-- banco e não no repositório: o repositório é público, e as cláusulas são suas.
create table if not exists document_templates (
  id         serial primary key,
  kind       text        not null check (kind in ('proposal', 'contract')),
  name       text        not null,
  body       text        not null,
  updated_at timestamptz not null default now()
);

-- Sem `on delete cascade` vindo do cliente: documento enviado ou assinado é histórico e não some
-- com um clique. Projeto e plano podem sair — o documento fica, só perde o vínculo.
create table if not exists documents (
  id         serial primary key,
  client_id  int         not null references clients (id),
  project_id int         references projects (id) on delete set null,
  plan_id    int         references plans (id) on delete set null,
  kind       text        not null check (kind in ('proposal', 'contract')),
  title      text        not null,
  body       text        not null,
  status     text        not null default 'draft' check (status in ('draft', 'sent', 'signed')),
  signed_on  date,
  signed_url text,                 -- onde está o PDF assinado (Drive, por exemplo)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
