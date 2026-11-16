-- Duas tabelas que nada mais lê nem grava. `messages`: o formulário de contato saiu do site (o
-- contato é direto, WhatsApp e e-mail) e ela estava vazia. `client_checklist`: o checklist do
-- projeto saiu do painel em 2026-11-11 e mora no atlas; as 3 marcações dela ficaram no backup.
drop table if exists messages;
drop table if exists client_checklist;
