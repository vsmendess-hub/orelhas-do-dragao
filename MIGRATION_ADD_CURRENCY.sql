-- ========================================
-- MIGRATION: Adicionar campo currency
-- Data: 10 de Março de 2026
-- Aplicar em: PRODUÇÃO (Supabase Dashboard)
-- ========================================

-- 1. Adicionar campo currency à tabela characters
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS currency JSONB NOT NULL DEFAULT '{"copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0}'::jsonb;

-- 2. Comentário explicativo
COMMENT ON COLUMN characters.currency IS 'Moedas do personagem: {copper, silver, electrum, gold, platinum}. PHB p.143';

-- 3. Atualizar personagens existentes com moedas zeradas (caso o campo já exista mas esteja NULL)
UPDATE characters
SET currency = '{"copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0}'::jsonb
WHERE currency IS NULL;

-- 4. Verificar sucesso
SELECT
  'currency' as campo_adicionado,
  count(*) as total_personagens,
  count(currency) as personagens_com_currency
FROM characters;

-- ========================================
-- INSTRUÇÕES DE APLICAÇÃO
-- ========================================
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em SQL Editor
-- 3. Copie e cole este script
-- 4. Execute
-- 5. Verifique que a query de verificação retorna os mesmos valores em ambas colunas
-- ========================================
