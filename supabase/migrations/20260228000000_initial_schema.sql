-- ========================================
-- ORELHAS DO DRAGÃO - Schema Inicial
-- D&D 5e Character Builder Database
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABELA: characters
-- Armazena dados completos dos personagens
-- ========================================
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Informações Básicas
  name VARCHAR(255) NOT NULL,
  race VARCHAR(100) NOT NULL,
  subrace VARCHAR(100),
  class VARCHAR(100) NOT NULL,
  archetype VARCHAR(100),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 20),
  alignment VARCHAR(50) NOT NULL,

  -- Background e Personalidade
  background TEXT,
  personality_traits TEXT,
  ideals TEXT,
  bonds TEXT,
  flaws TEXT,

  -- Atributos e Mecânicas (JSON)
  attributes JSONB NOT NULL, -- {str, dex, con, int, wis, cha}
  skills JSONB NOT NULL, -- Array de {name, attribute, proficient, expertise}
  proficiencies JSONB NOT NULL, -- {weapons, armor, tools, languages}
  equipment JSONB NOT NULL, -- Array de itens
  spells JSONB, -- Array de magias (null para classes não-casters)
  features JSONB NOT NULL, -- Array de características de raça/classe

  -- Estatísticas de Combate
  hit_points JSONB NOT NULL, -- {current, max, temporary}
  armor_class INTEGER NOT NULL DEFAULT 10,
  speed INTEGER NOT NULL DEFAULT 30,
  initiative INTEGER NOT NULL DEFAULT 0,
  proficiency_bonus INTEGER NOT NULL DEFAULT 2,
  inspiration BOOLEAN NOT NULL DEFAULT FALSE,
  experience_points INTEGER NOT NULL DEFAULT 0,

  -- Extras
  notes TEXT,
  avatar_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- TABELA: user_preferences
-- Preferências do usuário
-- ========================================
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  theme VARCHAR(20) NOT NULL DEFAULT 'dark',
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  default_dice_skin VARCHAR(50),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- ÍNDICES
-- ========================================
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_created_at ON characters(created_at DESC);
CREATE INDEX idx_characters_is_public ON characters(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_characters_name ON characters(name);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilita RLS
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies para characters
-- 1. Usuários podem ver seus próprios personagens
CREATE POLICY "Users can view own characters"
  ON characters FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Usuários podem inserir seus próprios personagens
CREATE POLICY "Users can insert own characters"
  ON characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Usuários podem atualizar seus próprios personagens
CREATE POLICY "Users can update own characters"
  ON characters FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Usuários podem deletar seus próprios personagens
CREATE POLICY "Users can delete own characters"
  ON characters FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Todos podem ver personagens públicos
CREATE POLICY "Anyone can view public characters"
  ON characters FOR SELECT
  USING (is_public = TRUE);

-- Policies para user_preferences
-- 1. Usuários podem ver suas próprias preferências
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- 2. Usuários podem inserir suas próprias preferências
CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Usuários podem atualizar suas próprias preferências
CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Usuários podem deletar suas próprias preferências
CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- TRIGGERS
-- ========================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para characters
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- FUNÇÃO: Criar preferências padrão ao criar usuário
-- ========================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger na tabela auth.users (executa quando novo usuário é criado)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
