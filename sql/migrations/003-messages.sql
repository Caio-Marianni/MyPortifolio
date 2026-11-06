-- Mensagens do formulário de contato. Antes o formulário só abria o programa de e-mail (mailto)
-- e quem não tinha um configurado perdia a mensagem. Agora ela fica aqui e aparece no /admin.
create table if not exists messages (
  id         serial primary key,
  name       text        not null,
  email      text        not null,
  message    text        not null,
  -- só pro limite de envios por IP, nunca aparece no painel
  ip         text        not null,
  created_at timestamptz not null default now()
);
