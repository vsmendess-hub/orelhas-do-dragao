-- ========================================
-- MIGRATION: Character Gameplay Fields
-- Adiciona campos para gameplay persistente
-- ========================================
-- Data: 2026-03-09
-- Versão: 2.1.0
--
-- Campos adicionados:
-- - feats: Talentos do personagem
-- - companions: Companheiros e familiares
-- - journal: Diário de aventuras
-- - goals: Objetivos e quests
-- - conditions: Condições de combate ativas
-- ========================================

-- 1. Talentos (Feats)
-- Estrutura: Array de objetos {featId, featName, level}
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS feats JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN characters.feats IS 'Talentos do personagem. Ex: [{"featId": "alert", "featName": "Alerta", "level": 4}]';

-- 2. Companheiros (Companions)
-- Estrutura: Array de objetos {id, name, type, ac, hp, maxHp, notes}
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS companions JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN characters.companions IS 'Companheiros, familiares e montarias. Ex: [{"id": "1", "name": "Fang", "type": "Lobo", "ac": 13, "hp": 15, "maxHp": 15, "notes": "Fiel companheiro"}]';

-- 3. Diário de Aventura (Journal)
-- Estrutura: Array de objetos {id, date, title, content}
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS journal JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN characters.journal IS 'Diário de aventuras. Ex: [{"id": "1", "date": "2026-03-09", "title": "A Caverna Sombria", "content": "Exploramos uma caverna..."}]';

-- 4. Objetivos (Goals)
-- Estrutura: Array de objetos {id, title, description, completed}
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS goals JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN characters.goals IS 'Objetivos e quests. Ex: [{"id": "1", "title": "Derrotar o Dragão", "description": "Encontrar e derrotar o dragão vermelho", "completed": false}]';

-- 5. Condições (Conditions)
-- Estrutura: Array de strings com IDs das condições ativas
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS conditions JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN characters.conditions IS 'Condições de combate ativas. Ex: ["poisoned", "frightened", "exhausted-1"]';

-- ========================================
-- ÍNDICES para Performance
-- ========================================

-- Índice GIN para buscas em JSONB
CREATE INDEX IF NOT EXISTS idx_characters_feats ON characters USING GIN (feats);
CREATE INDEX IF NOT EXISTS idx_characters_companions ON characters USING GIN (companions);
CREATE INDEX IF NOT EXISTS idx_characters_journal ON characters USING GIN (journal);
CREATE INDEX IF NOT EXISTS idx_characters_goals ON characters USING GIN (goals);
CREATE INDEX IF NOT EXISTS idx_characters_conditions ON characters USING GIN (conditions);

-- ========================================
-- VERIFICAÇÃO
-- ========================================

SELECT
    column_name,
    data_type,
    column_default,
    col_description('characters'::regclass, ordinal_position) as description
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name IN ('feats', 'companions', 'journal', 'goals', 'conditions')
ORDER BY column_name;

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- Deve retornar 5 linhas:
-- 1. companions  | jsonb | '[]'::jsonb | Companheiros, familiares e montarias...
-- 2. conditions  | jsonb | '[]'::jsonb | Condições de combate ativas...
-- 3. feats       | jsonb | '[]'::jsonb | Talentos do personagem...
-- 4. goals       | jsonb | '[]'::jsonb | Objetivos e quests...
-- 5. journal     | jsonb | '[]'::jsonb | Diário de aventuras...
-- ========================================
