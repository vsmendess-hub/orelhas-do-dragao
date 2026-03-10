-- ========================================
-- MIGRATION: Adicionar campo currency
-- Data: 10 de Março de 2026
-- ========================================

-- Adicionar campo currency à tabela characters
-- Armazena as moedas do personagem (copper, silver, electrum, gold, platinum)
ALTER TABLE characters
ADD COLUMN currency JSONB NOT NULL DEFAULT '{"copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0}'::jsonb;

-- Comentário explicativo
COMMENT ON COLUMN characters.currency IS 'Moedas do personagem: {copper, silver, electrum, gold, platinum}. PHB p.143';

-- Atualizar personagens existentes com moedas zeradas
UPDATE characters
SET currency = '{"copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0}'::jsonb
WHERE currency IS NULL;
