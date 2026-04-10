-- Adicionar coluna spell_favorites à tabela characters
-- Esta coluna armazena as magias favoritas do personagem para acesso rápido

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS spell_favorites JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN characters.spell_favorites IS 'Magias favoritas do personagem. Array de {spellId, spellName, spellLevel}';

-- Atualizar registros existentes que tenham NULL
UPDATE characters
SET spell_favorites = '[]'::jsonb
WHERE spell_favorites IS NULL;
