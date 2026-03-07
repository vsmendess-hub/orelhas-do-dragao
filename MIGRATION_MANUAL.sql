-- ========================================
-- MIGRATION MANUAL
-- Execute este SQL no Supabase Dashboard
-- ========================================
--
-- Como aplicar:
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Selecione seu projeto
-- 3. Vá em: SQL Editor (no menu lateral)
-- 4. Cole este SQL e clique em "Run"
--
-- ========================================

-- Adicionar campos JSONB para personality e appearance
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS personality JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS appearance JSONB DEFAULT NULL;

-- Criar índices para melhor performance nas queries JSONB
CREATE INDEX IF NOT EXISTS idx_characters_personality ON characters USING GIN (personality);
CREATE INDEX IF NOT EXISTS idx_characters_appearance ON characters USING GIN (appearance);

-- Verificar se as colunas foram criadas
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name IN ('personality', 'appearance');
