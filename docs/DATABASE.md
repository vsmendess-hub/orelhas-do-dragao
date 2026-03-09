# 🗄️ Documentação de Database - Orelhas do Dragão

**Versão:** 2.0.0
**Database:** PostgreSQL (Supabase)
**Última Atualização:** 9 de Março de 2026

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Schema de Tabelas](#schema-de-tabelas)
3. [Índices](#índices)
4. [Row Level Security (RLS)](#row-level-security-rls)
5. [Triggers e Functions](#triggers-e-functions)
6. [Storage Buckets](#storage-buckets)
7. [Migrações](#migrações)
8. [Queries Comuns](#queries-comuns)

---

## 🎯 Visão Geral

### Tecnologia

- **Database:** PostgreSQL 15+
- **Hosting:** Supabase
- **Extensions:** uuid-ossp
- **Features:** RLS, JSONB, Triggers, Storage

### Estrutura

```
Database: orelhas-do-dragao
├── Tables
│   ├── characters          # Personagens de D&D
│   └── user_preferences    # Preferências de usuário
├── Storage Buckets
│   └── character-assets    # Avatares e imagens
├── Auth
│   └── users (Supabase)    # Autenticação
└── Extensions
    └── uuid-ossp           # UUID generation
```

---

## 📊 Schema de Tabelas

### Tabela: `characters`

Armazena todos os dados dos personagens de D&D 5e.

```sql
CREATE TABLE characters (
  -- Identificadores
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
  background TEXT,                    -- Backstory (texto simples)
  background_data JSONB,              -- Background estruturado (v2.0+)
  personality_traits TEXT,            -- Deprecated: usar personality JSONB
  ideals TEXT,                        -- Deprecated: usar personality JSONB
  bonds TEXT,                         -- Deprecated: usar personality JSONB
  flaws TEXT,                         -- Deprecated: usar personality JSONB
  personality JSONB,                  -- Personalidade estruturada (v2.0+)
  appearance JSONB,                   -- Aparência estruturada (v2.0+)

  -- Atributos e Mecânicas (JSONB)
  attributes JSONB NOT NULL,          -- {str, dex, con, int, wis, cha}
  skills JSONB NOT NULL,              -- Array de perícias
  proficiencies JSONB NOT NULL,       -- Proficiências
  equipment JSONB NOT NULL,           -- Equipamento/Inventário
  spells JSONB,                       -- Magias (nullable)
  features JSONB NOT NULL,            -- Features de raça/classe

  -- Estatísticas de Combate
  hit_points JSONB NOT NULL,          -- {current, max, temporary}
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
```

#### Estrutura dos Campos JSONB

##### `attributes` (JSONB)

```json
{
  "str": 16,
  "dex": 14,
  "con": 13,
  "int": 10,
  "wis": 12,
  "cha": 8
}
```

##### `skills` (JSONB Array)

```json
[
  {
    "name": "Atletismo",
    "attribute": "str",
    "proficient": true,
    "expertise": false
  },
  {
    "name": "Furtividade",
    "attribute": "dex",
    "proficient": true,
    "expertise": true
  }
]
```

##### `proficiencies` (JSONB)

```json
{
  "weapons": ["simples", "marciais", "arcos"],
  "armor": ["leve", "média", "escudos"],
  "tools": ["ferramentas de ladrão"],
  "languages": ["Comum", "Élfico", "Anão"],
  "saving_throws": ["str", "con"]
}
```

##### `equipment` (JSONB Array)

```json
[
  {
    "id": "longsword",
    "name": "Espada Longa",
    "type": "weapon",
    "quantity": 1,
    "weight": 3,
    "equipped": true,
    "damage": "1d8",
    "properties": ["versátil"]
  },
  {
    "id": "chainmail",
    "name": "Cota de Malha",
    "type": "armor",
    "ac": 16,
    "equipped": true
  }
]
```

##### `spells` (JSONB Array - nullable)

```json
[
  {
    "id": "fireball",
    "name": "Bola de Fogo",
    "level": 3,
    "school": "Evocação",
    "prepared": true,
    "ritual": false,
    "concentration": false,
    "favorite": true
  }
]
```

##### `features` (JSONB Array)

```json
[
  {
    "name": "Visão no Escuro",
    "source": "race",
    "description": "Você enxerga 60 pés no escuro"
  },
  {
    "name": "Action Surge",
    "source": "class",
    "uses": 1,
    "maxUses": 1,
    "resetOn": "short_rest"
  }
]
```

##### `hit_points` (JSONB)

```json
{
  "current": 38,
  "max": 45,
  "temporary": 5
}
```

##### `personality` (JSONB - v2.0+)

```json
{
  "traits": ["Corajoso", "Teimoso"],
  "ideals": ["Honra acima de tudo"],
  "bonds": ["Proteger minha família"],
  "flaws": ["Nunca recuso um desafio"]
}
```

##### `appearance` (JSONB - v2.0+)

```json
{
  "age": 28,
  "height": "1.85m",
  "weight": "85kg",
  "eyes": "Castanhos",
  "hair": "Negro curto",
  "skin": "Morena",
  "distinguishingMarks": "Cicatriz no rosto"
}
```

##### `background_data` (JSONB - v2.0+)

```json
{
  "name": "Soldado",
  "feature": "Posto Militar",
  "specialty": "Oficial",
  "backstory": "Era capitão da guarda...",
  "generatedBy": "ai",
  "generatedAt": "2026-03-07T10:30:00Z"
}
```

---

### Tabela: `user_preferences`

Preferências e configurações do usuário.

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

  theme VARCHAR(20) NOT NULL DEFAULT 'dark',
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  default_dice_skin VARCHAR(50),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Campos

| Campo                   | Tipo        | Descrição                      | Default |
| ----------------------- | ----------- | ------------------------------ | ------- |
| `id`                    | UUID        | Identificador único            | auto    |
| `user_id`               | UUID        | Referência ao usuário (UNIQUE) | -       |
| `theme`                 | VARCHAR(20) | Tema (dark/light)              | 'dark'  |
| `notifications_enabled` | BOOLEAN     | Notificações ativas            | true    |
| `default_dice_skin`     | VARCHAR(50) | Skin padrão dos dados          | null    |

---

## 🔍 Índices

### Tabela `characters`

```sql
-- Lookup por usuário (muito usado)
CREATE INDEX idx_characters_user_id ON characters(user_id);

-- Ordenação por data de criação
CREATE INDEX idx_characters_created_at ON characters(created_at DESC);

-- Filtro de personagens públicos
CREATE INDEX idx_characters_is_public ON characters(is_public) WHERE is_public = TRUE;

-- Busca por nome
CREATE INDEX idx_characters_name ON characters(name);

-- Busca em JSONB (GIN indexes)
CREATE INDEX idx_characters_personality ON characters USING GIN (personality);
CREATE INDEX idx_characters_appearance ON characters USING GIN (appearance);
CREATE INDEX idx_characters_background_data ON characters USING GIN (background_data);
```

### Performance Notes

- **GIN indexes** permitem buscas eficientes em campos JSONB
- **Partial index** em `is_public` economiza espaço
- **DESC** em `created_at` otimiza queries de "personagens recentes"

---

## 🔒 Row Level Security (RLS)

### Tabela `characters`

#### Habilitação

```sql
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
```

#### Policies

**1. Usuários podem ver seus próprios personagens**

```sql
CREATE POLICY "Users can view own characters"
  ON characters FOR SELECT
  USING (auth.uid() = user_id);
```

**2. Usuários podem inserir seus próprios personagens**

```sql
CREATE POLICY "Users can insert own characters"
  ON characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**3. Usuários podem atualizar seus próprios personagens**

```sql
CREATE POLICY "Users can update own characters"
  ON characters FOR UPDATE
  USING (auth.uid() = user_id);
```

**4. Usuários podem deletar seus próprios personagens**

```sql
CREATE POLICY "Users can delete own characters"
  ON characters FOR DELETE
  USING (auth.uid() = user_id);
```

**5. Todos podem ver personagens públicos**

```sql
CREATE POLICY "Anyone can view public characters"
  ON characters FOR SELECT
  USING (is_public = TRUE);
```

### Tabela `user_preferences`

```sql
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies idênticas: own view/insert/update/delete
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);
```

---

## ⚙️ Triggers e Functions

### Function: `update_updated_at_column()`

Atualiza automaticamente o campo `updated_at` quando um registro é modificado.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### Triggers

```sql
-- Para characters
CREATE TRIGGER update_characters_updated_at
  BEFORE UPDATE ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Para user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Function: `handle_new_user()`

Cria automaticamente preferências padrão quando um novo usuário é criado.

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### Trigger

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

---

## 📦 Storage Buckets

### Bucket: `character-assets`

Armazena avatares e imagens de personagens.

#### Configuração

```
Name: character-assets
Public: ✅ Yes
File Size Limit: 5MB
Allowed MIME Types: image/jpeg, image/png, image/webp, image/gif
```

#### Estrutura de Pastas

```
character-assets/
├── avatars/
│   └── {user_id}/
│       └── {character_id}.{ext}
└── images/
    └── {user_id}/
        └── {character_id}_*.{ext}
```

#### Políticas RLS

**1. Upload (apenas o dono)**

```sql
CREATE POLICY "Users can upload own character assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'character-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

**2. Update (apenas o dono)**

```sql
CREATE POLICY "Users can update own character assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'character-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

**3. Delete (apenas o dono)**

```sql
CREATE POLICY "Users can delete own character assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'character-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

**4. Read (público)**

```sql
CREATE POLICY "Anyone can view character assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'character-assets');
```

---

## 🔄 Migrações

### Lista de Migrações

| Arquivo                                             | Data       | Descrição                                      |
| --------------------------------------------------- | ---------- | ---------------------------------------------- |
| `20260228000000_initial_schema.sql`                 | 28/02/2026 | Schema inicial (characters, user_preferences)  |
| `20260302225951_create_character_assets_bucket.sql` | 02/03/2026 | Criação do bucket de storage                   |
| `20260307000000_add_personality_appearance.sql`     | 07/03/2026 | Adiciona campos JSONB personality e appearance |
| `20260307000001_add_background_data.sql`            | 07/03/2026 | Adiciona campo JSONB background_data           |

### Como Aplicar Migrações

#### No Supabase Dashboard

1. Acesse **SQL Editor**
2. Cole o conteúdo do arquivo de migração
3. Execute (Run)

#### Via Supabase CLI

```bash
# Aplicar todas as migrações pendentes
supabase db push

# Aplicar migração específica
supabase db push --file supabase/migrations/20260228000000_initial_schema.sql
```

---

## 🔎 Queries Comuns

### Selects Básicos

#### Listar personagens do usuário

```sql
SELECT id, name, race, class, level, avatar_url
FROM characters
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

#### Buscar personagem por ID (com RLS)

```sql
SELECT *
FROM characters
WHERE id = 'uuid-do-personagem';
-- RLS garante que apenas o dono ou personagens públicos sejam retornados
```

#### Listar personagens públicos para biblioteca

```sql
SELECT id, name, race, class, level, avatar_url, user_id
FROM characters
WHERE is_public = TRUE
ORDER BY created_at DESC
LIMIT 50;
```

### Queries JSONB

#### Buscar personagens por atributo (ex: STR >= 16)

```sql
SELECT name, race, class, attributes->>'str' as strength
FROM characters
WHERE (attributes->>'str')::int >= 16;
```

#### Buscar personagens com perícia específica

```sql
SELECT name, class
FROM characters
WHERE skills @> '[{"name": "Furtividade", "proficient": true}]';
```

#### Buscar por personalidade

```sql
SELECT name, personality->>'traits' as traits
FROM characters
WHERE personality ? 'traits'
  AND personality->'traits' @> '["Corajoso"]';
```

### Updates

#### Atualizar HP atual

```sql
UPDATE characters
SET hit_points = jsonb_set(
  hit_points,
  '{current}',
  '25'::jsonb
)
WHERE id = 'uuid-do-personagem';
```

#### Adicionar item ao inventário

```sql
UPDATE characters
SET equipment = equipment || '[{
  "id": "potion-healing",
  "name": "Poção de Cura",
  "type": "potion",
  "quantity": 1
}]'::jsonb
WHERE id = 'uuid-do-personagem';
```

#### Marcar magia como preparada

```sql
UPDATE characters
SET spells = jsonb_set(
  spells,
  '{0,prepared}',  -- índice da magia
  'true'::jsonb
)
WHERE id = 'uuid-do-personagem';
```

### Aggregations & Analytics

#### Distribuição de classes

```sql
SELECT class, COUNT(*) as count
FROM characters
GROUP BY class
ORDER BY count DESC;
```

#### Nível médio por raça

```sql
SELECT race, AVG(level) as avg_level
FROM characters
GROUP BY race
ORDER BY avg_level DESC;
```

#### Personagens mais populares (públicos)

```sql
SELECT id, name, race, class, level
FROM characters
WHERE is_public = TRUE
ORDER BY created_at DESC
LIMIT 10;
```

---

## 📈 Performance Tips

### Otimizações JSONB

1. **Use GIN indexes** para buscas em JSONB
2. **Use `@>` operator** para containment checks (mais rápido)
3. **Use `->` vs `->>`**: `->` retorna JSONB, `->>` retorna TEXT

### Exemplos

```sql
-- ✅ Rápido (usa index GIN)
WHERE personality @> '{"traits": ["Corajoso"]}'

-- ❌ Lento (não usa index)
WHERE personality::text LIKE '%Corajoso%'

-- ✅ Rápido (type casting correto)
WHERE (attributes->>'str')::int > 15

-- ❌ Lento (comparação de strings)
WHERE attributes->>'str' > '15'
```

### Monitoring

```sql
-- Ver tamanho das tabelas
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Ver índices e seus tamanhos
SELECT
  indexname,
  tablename,
  pg_size_pretty(pg_relation_size(indexname::regclass)) AS size
FROM pg_indexes
WHERE schemaname = 'public';
```

---

## 🔧 Manutenção

### Backup

```bash
# Via Supabase Dashboard
# Settings > Database > Backups

# Via pg_dump (se self-hosted)
pg_dump -h localhost -U postgres -d orelhas_do_dragao > backup.sql
```

### Restore

```bash
# Via Supabase Dashboard
# Settings > Database > Restore

# Via psql
psql -h localhost -U postgres -d orelhas_do_dragao < backup.sql
```

---

## 📚 Referências

- [PostgreSQL JSONB Documentation](https://www.postgresql.org/docs/current/datatype-json.html)
- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)

---

**Documentado por:** Claude Opus 4.6
**Data:** 9 de Março de 2026
