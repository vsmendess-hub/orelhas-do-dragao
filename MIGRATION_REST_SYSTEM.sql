-- ========================================
-- MIGRATION: Rest System (Descanso)
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

-- Adicionar campo para rastrear dados de vida usados
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS hit_dice_used INTEGER DEFAULT 0;

-- Adicionar campo para spell slots (se ainda não existir)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS spell_slots JSONB DEFAULT '[]'::jsonb;

-- Adicionar campo para recursos de classe (se ainda não existir)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS class_resources JSONB DEFAULT '[]'::jsonb;

-- Adicionar campo para death saves (se ainda não existir)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS death_saves JSONB DEFAULT '{"successes": 0, "failures": 0}'::jsonb;

-- Verificar se as colunas foram criadas
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name IN ('hit_dice_used', 'spell_slots', 'class_resources', 'death_saves')
ORDER BY column_name;
