-- ========================================
-- FIX: Adicionar campo CONDITIONS em PRODUÇÃO
-- ========================================
-- Execute no Supabase Dashboard de PRODUÇÃO
-- URL: https://xjywmhdvdltrbufuuhsx.supabase.co
-- ========================================

-- 1. Verificar se o campo já existe
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name = 'conditions';

-- Se retornar 0 linhas, execute o bloco abaixo:

-- 2. Criar o campo conditions
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS conditions JSONB DEFAULT '[]'::jsonb;

-- 3. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_characters_conditions
ON characters USING GIN (conditions);

-- 4. Verificar se foi criado (deve retornar 1 linha)
SELECT
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name = 'conditions';

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- column_name | data_type | column_default
-- conditions  | jsonb     | '[]'::jsonb
-- ========================================

-- 5. Verificar outros campos (para comparar)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name IN ('feats', 'companions', 'journal', 'goals', 'conditions')
ORDER BY column_name;

-- Deve retornar 5 linhas (todos os campos de gameplay)
