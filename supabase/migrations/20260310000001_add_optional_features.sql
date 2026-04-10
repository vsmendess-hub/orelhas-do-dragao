-- ========================================
-- MIGRATION: Adicionar campo optional_features
-- Data: 10 de Março de 2026
-- ========================================

-- Adicionar campo optional_features à tabela characters
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS optional_features JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Comentário explicativo
COMMENT ON COLUMN characters.optional_features IS 'Optional class features: Fighting Styles, Eldritch Invocations, Metamagic, etc. Array de {featureId, featureName, category, level}';

-- Atualizar personagens existentes com array vazio
UPDATE characters
SET optional_features = '[]'::jsonb
WHERE optional_features IS NULL;

-- Verificar sucesso
SELECT
  'optional_features' as campo_adicionado,
  count(*) as total_personagens,
  count(optional_features) as personagens_com_optional_features
FROM characters;
