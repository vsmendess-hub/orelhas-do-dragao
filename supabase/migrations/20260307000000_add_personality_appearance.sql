-- Adicionar campos JSONB para personality e appearance
-- Esses campos são usados pelo sistema de personalização

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS personality JSONB,
ADD COLUMN IF NOT EXISTS appearance JSONB;

-- Criar índices para melhor performance nas queries JSONB
CREATE INDEX IF NOT EXISTS idx_characters_personality ON characters USING GIN (personality);
CREATE INDEX IF NOT EXISTS idx_characters_appearance ON characters USING GIN (appearance);
