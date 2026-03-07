-- Adicionar campo JSONB para background complexo
-- O campo "background" TEXT existente continua para compatibilidade (apenas backstory)
-- O novo campo "background_data" JSONB armazena o objeto Background completo

ALTER TABLE characters
ADD COLUMN IF NOT EXISTS background_data JSONB DEFAULT NULL;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_characters_background_data ON characters USING GIN (background_data);
