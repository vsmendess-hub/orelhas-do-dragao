-- ========================================
-- TESTE RÁPIDO - CONDIÇÕES EM PRODUÇÃO
-- ========================================
-- Execute este SQL no Supabase Dashboard de PRODUÇÃO
-- SQL Editor
-- ========================================

-- PASSO 1: Verificar se o campo existe
-- Deve retornar 1 linha
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name = 'conditions';

-- Se retornar 0 linhas, o campo NÃO EXISTE!
-- Execute o bloco abaixo:
/*
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS conditions JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_characters_conditions
ON characters USING GIN (conditions);
*/

-- ========================================

-- PASSO 2: Verificar RLS (Row Level Security)
-- Deve mostrar políticas de UPDATE
SELECT
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'characters'
AND cmd = 'UPDATE';

-- Se não houver nenhuma policy, significa que RLS pode estar bloqueando!

-- ========================================

-- PASSO 3: Pegar ID de um personagem seu
SELECT
    id,
    name,
    conditions,
    user_id
FROM characters
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 3;

-- Copie um ID da lista acima

-- ========================================

-- PASSO 4: Testar update manual (SUBSTITUA o ID)
-- IMPORTANTE: Substitua 'SEU-CHARACTER-ID-AQUI' por um ID real
UPDATE characters
SET conditions = '[
  {
    "type": "poisoned",
    "active": true,
    "notes": "TESTE MANUAL",
    "appliedAt": "2026-03-09T12:00:00Z"
  }
]'::jsonb
WHERE id = 'SEU-CHARACTER-ID-AQUI'
AND user_id = auth.uid();

-- Se retornar "UPDATE 1", funcionou!
-- Se retornar "UPDATE 0", não encontrou ou RLS bloqueou!

-- ========================================

-- PASSO 5: Verificar se salvou
-- Substitua o ID novamente
SELECT
    id,
    name,
    conditions
FROM characters
WHERE id = 'SEU-CHARACTER-ID-AQUI';

-- Deve mostrar o JSON com a condição "poisoned"

-- ========================================

-- PASSO 6: Limpar teste
-- Substitua o ID novamente
UPDATE characters
SET conditions = '[]'::jsonb
WHERE id = 'SEU-CHARACTER-ID-AQUI'
AND user_id = auth.uid();

-- ========================================
-- DIAGNÓSTICO
-- ========================================

-- Se PASSO 1 falhou (0 linhas):
--   → Campo não foi criado
--   → Execute o ALTER TABLE acima

-- Se PASSO 4 retornou UPDATE 0:
--   → RLS está bloqueando
--   → Ou o ID está errado
--   → Verifique se auth.uid() retorna seu ID

-- Se PASSO 5 não mostra a condição:
--   → Update não persistiu
--   → Problema de transação ou trigger?

-- Se tudo passou:
--   → Banco está OK!
--   → Problema é no código frontend
--   → Cache ou versão antiga deployada

-- ========================================
