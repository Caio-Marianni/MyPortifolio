-- Foto do cliente, fotos do projeto e vínculo com projeto publicado.
alter table reviews add column if not exists photo   text;    -- base64 cru do avatar 256px (sem prefixo data:)
alter table reviews add column if not exists shots   text[];  -- base64 cru das fotos do projeto, até 3
alter table reviews add column if not exists project smallint;-- id em data/projects.ts, nulo = trabalho fora do site

-- O binário nunca sai daqui num `select` de listagem: as páginas pedem só `photo is not null` e
-- `array_length(shots,1)`, e o byte vem por /api/reviews/[id]/image. Sem isso o HTML de toda
-- página de avaliação carregaria alguns MB de base64.
