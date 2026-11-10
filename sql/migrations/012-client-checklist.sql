-- Checklist do projeto na ficha do cliente: só os passos marcados entram aqui, com o dia em que
-- foram feitos. Os passos em si moram em src/data/client-checklist.ts (o `item` é o id de lá).
-- Excluir o cliente leva o checklist junto.
create table if not exists client_checklist (
  client_id integer     not null references clients(id) on delete cascade,
  item      text        not null,
  done_at   timestamptz not null default now(),
  primary key (client_id, item)
);
