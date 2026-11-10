-- Contas e acessos ganham o endereço do painel (registro.br, hospedagem…) e o login usado — nunca
-- a senha, que mora no gerenciador de senhas. Rodar ANTES do deploy: o código novo lê as colunas.
alter table client_accounts add column if not exists url text;
alter table client_accounts add column if not exists login text;
