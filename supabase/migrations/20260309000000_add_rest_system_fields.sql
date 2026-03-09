-- ========================================
-- MIGRATION: Rest System Fields
-- Adiciona campos necessários para o sistema de descanso
-- ========================================

-- Adicionar campo para rastrear dados de vida usados
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS hit_dice_used INTEGER DEFAULT 0;

-- Adicionar campo para spell slots
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS spell_slots JSONB DEFAULT '[]'::jsonb;

-- Adicionar campo para recursos de classe (Ki, Sorcery Points, etc)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS class_resources JSONB DEFAULT '[]'::jsonb;

-- Adicionar campo para death saves
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS death_saves JSONB DEFAULT '{"successes": 0, "failures": 0}'::jsonb;

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_characters_hit_dice_used ON characters(hit_dice_used);

-- Verificação
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name IN ('hit_dice_used', 'spell_slots', 'class_resources', 'death_saves')
ORDER BY column_name;
