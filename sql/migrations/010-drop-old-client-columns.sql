-- Colunas da ficha antiga de clientes, que a 006 deixou pro código do ar continuar gravando.
-- Contato virou whatsapp/email, hospedagem e domínio viraram client_accounts, e mensalidade e
-- "pago até" viraram plans e payments. Rodar só DEPOIS do deploy do painel novo.
alter table clients drop column if exists track;
alter table clients drop column if exists contact;
alter table clients drop column if exists hosting;
alter table clients drop column if exists domain_until;
alter table clients drop column if exists monthly_fee;
alter table clients drop column if exists paid_until;
