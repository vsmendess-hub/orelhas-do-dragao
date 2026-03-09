-- ========================================
-- SETUP COMPLETO - BANCO DE DESENVOLVIMENTO
-- ========================================
-- Este arquivo contém TODAS as migrations necessárias
-- para deixar o banco de DEV igual ao de produção
--
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- ========================================

-- 1. Campos de personalidade e aparência (v2.0+)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS personality JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS appearance JSONB DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_characters_personality ON characters USING GIN (personality);
CREATE INDEX IF NOT EXISTS idx_characters_appearance ON characters USING GIN (appearance);

-- 2. Campo de background estruturado (v2.0+)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS background_data JSONB DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_characters_background_data ON characters USING GIN (background_data);

-- 3. Campos do Rest System (Descanso)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS hit_dice_used INTEGER DEFAULT 0;

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS spell_slots JSONB DEFAULT '[]'::jsonb;

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS class_resources JSONB DEFAULT '[]'::jsonb;

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS death_saves JSONB DEFAULT '{"successes": 0, "failures": 0}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_characters_hit_dice_used ON characters(hit_dice_used);

-- 4. Campos de Gameplay (v2.1+)
-- Talentos, Companheiros, Diário, Objetivos, Condições
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS feats JSONB DEFAULT '[]'::jsonb;

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS companions JSONB DEFAULT '[]'::jsonb;

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS journal JSONB DEFAULT '[]'::jsonb;

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]'::jsonb;

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS conditions JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_characters_feats ON characters USING GIN (feats);
CREATE INDEX IF NOT EXISTS idx_characters_companions ON characters USING GIN (companions);
CREATE INDEX IF NOT EXISTS idx_characters_journal ON characters USING GIN (journal);
CREATE INDEX IF NOT EXISTS idx_characters_goals ON characters USING GIN (goals);
CREATE INDEX IF NOT EXISTS idx_characters_conditions ON characters USING GIN (conditions);

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================
-- Este SELECT mostra todos os campos adicionados
-- Se algum campo não aparecer, significa que não foi criado

SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name IN (
    'personality',
    'appearance',
    'background_data',
    'hit_dice_used',
    'spell_slots',
    'class_resources',
    'death_saves',
    'feats',
    'companions',
    'journal',
    'goals',
    'conditions'
)
ORDER BY column_name;

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- Você deve ver 12 linhas retornadas:
-- 1. appearance         | jsonb   | NULL
-- 2. background_data    | jsonb   | NULL
-- 3. class_resources    | jsonb   | '[]'::jsonb
-- 4. companions         | jsonb   | '[]'::jsonb
-- 5. conditions         | jsonb   | '[]'::jsonb
-- 6. death_saves        | jsonb   | '{"successes": 0, "failures": 0}'::jsonb
-- 7. feats              | jsonb   | '[]'::jsonb
-- 8. goals              | jsonb   | '[]'::jsonb
-- 9. hit_dice_used      | integer | 0
-- 10. journal           | jsonb   | '[]'::jsonb
-- 11. personality       | jsonb   | NULL
-- 12. spell_slots       | jsonb   | '[]'::jsonb
-- ========================================
