-- ========================================
-- CORREÇÃO: Adicionar campo para História
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

-- Adicionar campo JSONB para background complexo (História)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS background_data JSONB DEFAULT NULL;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_characters_background_data ON characters USING GIN (background_data);

-- Verificar se a coluna foi criada
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name = 'background_data';
