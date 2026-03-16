# Changelog - Orelhas do Dragão

Todas as mudanças importantes do projeto serão documentadas neste arquivo.

## [v2.1.0] - 2026-03-16

### ✨ Sistema de Magias Completo

#### Banco de Dados de Magias

- **35+ magias** implementadas (cantrips até 9º círculo)
- Arquivo: `lib/data/all-spells.ts`
- Descrições completas em português
- Referências do Player's Handbook (PHB) com número de páginas
- Componentes verbais, somáticos e materiais
- Informações de alcance, duração, tempo de conjuração
- Descrições de uso em níveis superiores (upcasting)

#### Interface de Magias

- **Diálogo de adicionar magias** (`add-spell-dialog.tsx`)
  - Busca por nome
  - Filtros por círculo e escola
  - Design mobile-first com navegação por views
  - Vista de lista → Vista de detalhes (mobile)
  - Layout de duas colunas (desktop)
- **Sistema de favoritos**
  - Marcar magias favoritas
  - Aba "Favoritas" para acesso rápido
  - Migração: `20260310000002_add_spell_favorites.sql`
- **Simplificação de spell slots**
  - Remove círculos individuais clicáveis
  - Exibe apenas totais com botões +/-
  - Interface mais limpa e rápida
- **Remover magias**
  - Botão para remover magias da lista
- **Descrições expansíveis**
  - Click para expandir/recolher descrição completa
  - Referência do livro (PHB + página)

### ⚔️ Sistema de Optional Features

#### Cálculo Automático de Bônus

- **Fighting Styles** implementados:
  - Archery: +2 ataque com armas de longo alcance
  - Defense: +1 CA ao usar armadura
  - Dueling: +2 dano com arma de uma mão
  - Great Weapon Fighting: relança 1 ou 2 no dano
  - Two-Weapon Fighting: adiciona mod em ataque da mão off
- **Arquivo de efeitos**: `lib/data/optional-features-effects.ts`
- **Recálculo automático**: `app/actions/recalculate-equipment-with-features.ts`
- **Migração**: `20260310000001_add_optional_features.sql`

#### Integração com Equipamentos

- Bônus aplicados automaticamente ao equipar armas/armaduras
- Valores calculados exibidos na ficha (attack bonus, damage, AC)
- Recalcula ao equipar/desequipar itens
- Respeita condições (ex: Archery só em armas de longo alcance)

### 📏 Conversão para Sistema Métrico

#### Medidas de Distância (pés → metros)

- 5 pés → 1,5 metros
- 10 pés → 3 metros
- 30 pés → 9 metros
- 60 pés → 18 metros
- 120 pés → 36 metros
- 150 pés → 45 metros
- 300 pés → 90 metros
- 1 milha → 1,5 km

#### Medidas de Peso (libras → kg)

- **Moedas**: 50 moedas = 1 libra → **110 moedas = 1 kg**
- **Capacidade de carga**: STR × 15 libras → **STR × 7 kg**
- **Constantes atualizadas**:
  - `COINS_PER_POUND` → `COINS_PER_KG`
  - `calculateCurrencyWeight()` usa nova constante
  - `calculateCarryingCapacity()` usa nova fórmula

#### Arquivos Atualizados

- `lib/data/items.ts`
- `lib/data/equipment.ts`
- `lib/data/all-spells.ts`
- `lib/data/weapons.ts`
- `lib/data/armors.ts`
- `lib/data/race-features.ts`
- `lib/data/variant-rules.ts`
- `lib/data/class-features.ts`
- `lib/data/combat-actions.ts`
- `lib/data/companions.ts`
- `lib/data/conditions.ts`
- `lib/data/feats.ts`
- E vários outros...

### 🎨 Editor de Atributos

#### Nova Interface

- **Editor inline** na ficha do personagem
- Componente: `app/components/character/attributes-editor.tsx`
- Seção: `app/components/character/attributes-section.tsx`

#### Recálculo Automático

- Action: `app/actions/recalculate-character-stats.ts`
- Recalcula ao salvar atributos:
  - Modificadores
  - HP máximo (se mudou CON)
  - CA (se mudou DEX)
  - Iniciativa (se mudou DEX)
  - Bônus de ataque de armas
  - Bônus de dano de armas
  - Testes de resistência
  - Perícias
- Mantém HP atual proporcional ao novo máximo

### 🎯 Melhorias de UX

#### Descansos

- **Remove botões duplicados** de descanso em Class Resources
- **Centraliza** todos os descansos no HP Manager
- **Dicas** informam onde encontrar os botões de descanso
- Descanso curto/longo recupera:
  - HP
  - Spell slots
  - Class resources
  - Dados de vida (long rest)
  - Death saves (long rest)

#### Mobile

- Navegação melhorada no diálogo de adicionar magias
- Melhor responsividade em vários componentes
- Layout adaptativo (mobile vs desktop)

### 📝 Documentação

#### Guias de Migração

- `MIGRATION_ADD_OPTIONAL_FEATURES.md`
  - Como aplicar migração de optional features
  - Explicação da estrutura de dados
  - Verificação de sucesso
- `MIGRATION_SPELL_FAVORITES.md`
  - Como aplicar migração de spell favorites
  - Estrutura JSONB do campo
  - Comandos SQL

#### Atualizações

- `docs/DATABASE.md` atualizado
- Novas colunas documentadas:
  - `optional_features` (JSONB)
  - `spell_favorites` (JSONB)

---

## [v2.0.0] - 2026-03-09

### 🎉 Lançamento Inicial

- Sistema completo de criação de personagens D&D 5e
- 12 classes base implementadas
- Sistema de raças e sub-raças
- Cálculo automático de atributos, CA, HP
- Sistema de inventário e equipamentos
- Spell slots e gerenciamento de magias
- Sistema de descansos (curto e longo)
- Death saves
- PWA com funcionalidade offline
- Integração com Supabase
- Deploy no Vercel

---

**Formato:** [Tipo] descrição

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **refactor**: Refatoração de código
- **style**: Mudanças de estilo/formatação
- **test**: Testes
- **chore**: Tarefas de manutenção
