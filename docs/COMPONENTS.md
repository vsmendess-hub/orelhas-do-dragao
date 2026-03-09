# 🧩 Documentação de Componentes - Orelhas do Dragão

**Versão:** 2.0.0
**Última Atualização:** 9 de Março de 2026

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Componentes de Personagem](#componentes-de-personagem)
3. [Componentes de Combate](#componentes-de-combate)
4. [Componentes de Dados](#componentes-de-dados)
5. [Componentes de DM Tools](#componentes-de-dm-tools)
6. [Componentes Mobile](#componentes-mobile)
7. [Componentes PWA](#componentes-pwa)
8. [Componentes UI Base](#componentes-ui-base)
9. [Wizard de Criação](#wizard-de-criação)

---

## 🎯 Visão Geral

### Organização

```
app/components/
├── character/     # 47 componentes - Gestão de personagem
├── combat/        # 2 componentes - Sistema de combate
├── dice/          # 8 componentes - Rolagem de dados
├── dm-tools/      # 4 componentes - Ferramentas do mestre
├── mobile/        # 3 componentes - Otimizações mobile
├── pwa/           # 2 componentes - PWA features
├── library/       # 2 componentes - Biblioteca comunitária
├── party/         # 1 componente - Party dashboard
└── ui/            # 14 componentes - shadcn/ui base
```

### Convenções

- **"use client"**: Componentes interativos com estado
- **Server Components**: Default (data fetching)
- **Props TypeScript**: Sempre tipadas
- **Glass Morphism**: Design system padrão

---

## 👤 Componentes de Personagem

### 1. **spell-manager.tsx**

Gerenciador completo de magias do personagem.

```tsx
"use client"

interface SpellManagerProps {
  characterId: string
  characterLevel: number
  spellcastingClass: string
  spellcastingAbility: string
}

export function SpellManager({ ... }: SpellManagerProps) {
  // Features:
  // - Listagem de magias conhecidas/preparadas
  // - Spell slots tracker por nível
  // - Adicionar/remover magias
  // - Marcar como preparada/favorita
  // - Filtros por escola/nível
  // - Upcast calculator
}
```

**Uso:**

```tsx
<SpellManager
  characterId={character.id}
  characterLevel={character.level}
  spellcastingClass="wizard"
  spellcastingAbility="int"
/>
```

**Dependências:**

- `/lib/data/spells.ts`
- `/lib/data/spell-progression.ts`
- `spell-slot-tracker.tsx`
- `spell-list.tsx`

---

### 2. **hp-manager.tsx**

Gerenciamento de pontos de vida.

```tsx
"use client"

interface HPManagerProps {
  characterId: string
  currentHP: number
  maxHP: number
  temporaryHP: number
  onUpdate: (hp: { current: number; max: number; temporary: number }) => void
}

export function HPManager({ ... }: HPManagerProps) {
  // Features:
  // - Adicionar/remover HP
  // - HP temporário
  // - Visual bar
  // - Quick heal/damage buttons
  // - Death save trigger
}
```

**Uso:**

```tsx
<HPManager
  characterId={character.id}
  currentHP={character.hit_points.current}
  maxHP={character.hit_points.max}
  temporaryHP={character.hit_points.temporary}
  onUpdate={handleHPUpdate}
/>
```

---

### 3. **inventory-manager.tsx**

Gerenciamento de inventário e equipamentos.

```tsx
"use client"

interface InventoryManagerProps {
  characterId: string
  equipment: Item[]
  currency: Currency
  carryingCapacity: number
}

export function InventoryManager({ ... }: InventoryManagerProps) {
  // Features:
  // - Lista de itens com filtros
  // - Adicionar/remover itens
  // - Equipar/desequipar
  // - Peso total / capacidade
  // - Currency tracker (GP, SP, CP)
  // - Item detail modal
}
```

---

### 4. **level-up-wizard.tsx**

Wizard interativo de level up.

```tsx
"use client"

interface LevelUpWizardProps {
  characterId: string
  currentLevel: number
  characterClass: string
  onComplete: () => void
}

export function LevelUpWizard({ ... }: LevelUpWizardProps) {
  // Features:
  // - Roll HP (ou média)
  // - ASI (Ability Score Improvement) selection
  // - Feat selection (se aplicável)
  // - Nova feature de classe
  // - Novas magias (se caster)
  // - Summary & confirm
}
```

**Uso:**

```tsx
<LevelUpWizard
  characterId={character.id}
  currentLevel={character.level}
  characterClass={character.class}
  onComplete={() => router.refresh()}
/>
```

---

### 5. **rest-manager.tsx**

Sistema de descanso (short/long rest).

```tsx
"use client"

interface RestManagerProps {
  characterId: string
  currentHP: number
  maxHP: number
  hitDice: HitDice
  spellSlots: SpellSlots
  classResources: ClassResources
}

export function RestManager({ ... }: RestManagerProps) {
  // Features:
  // - Short Rest: spend hit dice, recover some resources
  // - Long Rest: full HP, half hit dice, all spell slots
  // - Auto-update character
  // - Confirmation dialog
}
```

**Mechanics:**

- **Short Rest:** 1 hora, gasta Hit Dice para recuperar HP
- **Long Rest:** 8 horas, recupera tudo exceto metade dos Hit Dice

---

### 6. **avatar-uploader.tsx**

Upload de avatar do personagem.

```tsx
"use client"

interface AvatarUploaderProps {
  characterId: string
  currentAvatarUrl?: string
  onUploadComplete: (url: string) => void
}

export function AvatarUploader({ ... }: AvatarUploaderProps) {
  // Features:
  // - Drag & drop / file select
  // - Preview antes do upload
  // - Validação (tipo, tamanho max 5MB)
  // - Upload para Supabase Storage
  // - Remover avatar
  // - Loading states
}
```

**Storage Path:**

```
character-assets/avatars/{user_id}/{character_id}.{ext}
```

---

### 7. **personality-editor.tsx**

Editor de personalidade (Traits, Ideals, Bonds, Flaws).

```tsx
"use client"

interface PersonalityEditorProps {
  characterId: string
  personality: Personality
  onSave: (personality: Personality) => void
}

export function PersonalityEditor({ ... }: PersonalityEditorProps) {
  // Features:
  // - Inputs para traits, ideals, bonds, flaws
  // - AI generation button (Gemini)
  // - Suggestions baseadas em background
  // - Auto-save
}
```

---

### 8. **multiclass-manager.tsx**

Gerenciamento de multiclasse.

```tsx
"use client"

interface MulticlassManagerProps {
  characterId: string
  classes: ClassLevel[]
  attributes: Attributes
}

export function MulticlassManager({ ... }: MulticlassManagerProps) {
  // Features:
  // - Adicionar classe
  // - Validação de requisitos (13+ em atributo)
  // - Distribuição de níveis
  // - Proficiência recalculada
  // - Spell slot calculation (multiclass caster)
}
```

**Regras:**

- Atributo mínimo 13+ na classe original e nova
- Proficiências limitadas na segunda classe
- Spell slots combinados para casters

---

### 9. **death-saves-manager.tsx**

Gerenciamento de Death Saving Throws.

```tsx
"use client"

interface DeathSavesManagerProps {
  characterId: string
  deathSaves: { successes: number; failures: number }
  isStabilized: boolean
}

export function DeathSavesManager({ ... }: DeathSavesManagerProps) {
  // Features:
  // - 3 sucessos / 3 falhas UI
  // - Marcar sucesso/falha
  // - Estabilizar
  // - Reset ao recuperar HP
  // - Critical hit = 2 failures
}
```

---

### 10. **conditions-manager.tsx**

Rastreamento de condições de combate.

```tsx
"use client"

interface ConditionsManagerProps {
  characterId: string
  activeConditions: Condition[]
}

export function ConditionsManager({ ... }: ConditionsManagerProps) {
  // Features:
  // - Lista de 20+ condições D&D
  // - Toggle on/off
  // - Description tooltip
  // - Duration tracking
  // - Visual indicators
}
```

**Condições Disponíveis:**

- Cego (Blinded)
- Enfeitiçado (Charmed)
- Ensurdecido (Deafened)
- Envenenado (Poisoned)
- Amedrontado (Frightened)
- Agarrado (Grappled)
- Incapacitado (Incapacitated)
- Invisível (Invisible)
- Paralisado (Paralyzed)
- Petrificado (Petrified)
- Caído (Prone)
- Contido (Restrained)
- Atordoado (Stunned)
- Inconsciente (Unconscious)
- Exausto (Exhausted) - 6 níveis

---

### 11-20. Outros Componentes de Personagem

| Componente                      | Descrição                              |
| ------------------------------- | -------------------------------------- |
| `concentration-tracker.tsx`     | Rastreamento de concentração em magias |
| `companions-manager.tsx`        | Gerenciar animal companions/familiares |
| `journal-manager.tsx`           | Diário de aventuras                    |
| `feats-manager.tsx`             | Seleção e gerenciamento de feats       |
| `goals-manager.tsx`             | Objetivos e quests do personagem       |
| `appearance-editor.tsx`         | Aparência física detalhada             |
| `backstory-editor.tsx`          | Editor de backstory com AI             |
| `character-share-manager.tsx`   | Sistema de compartilhamento            |
| `character-import-export.tsx`   | Import/export JSON                     |
| `optional-features-manager.tsx` | Features opcionais de D&D              |
| `variant-rules-manager.tsx`     | House rules customizáveis              |
| `xp-manager.tsx`                | Gestão de XP e level up                |
| `milestone-manager.tsx`         | Leveling por milestones                |
| `currency-manager.tsx`          | Moedas (GP, SP, CP, PP, EP)            |
| `equipment-slots.tsx`           | Slots de equipamento visual            |
| `class-resources-manager.tsx`   | Ki, Sorcery Points, Bardic Inspiration |
| `skill-roll-button.tsx`         | Botão de rolagem de perícia            |
| `spell-slot-tracker.tsx`        | Tracker visual de spell slots          |
| `spell-favorites-panel.tsx`     | Painel de magias favoritas             |
| `spell-upcast-calculator.tsx`   | Calculadora de upcast                  |

---

## ⚔️ Componentes de Combate

### 1. **initiative-tracker.tsx**

Rastreador de iniciativa para combate.

```tsx
"use client"

interface InitiativeTrackerProps {
  characters: Character[]
  monsters?: Monster[]
}

export function InitiativeTracker({ ... }: InitiativeTrackerProps) {
  // Features:
  // - Roll initiative para todos
  // - Ordenação automática
  // - Current turn indicator
  // - Adicionar/remover participantes
  // - HP tracking inline
  // - Conditions icons
  // - Next/Previous turn buttons
}
```

---

### 2. **quick-actions.tsx**

Ações rápidas de combate.

```tsx
"use client"

interface QuickActionsProps {
  characterId: string
}

export function QuickActions({ ... }: QuickActionsProps) {
  // Features:
  // - Attack (weapon rolls)
  // - Cast Spell (quick cast)
  // - Dodge/Dash/Disengage
  // - Help/Hide
  // - Ready Action
  // - Use Object
}
```

---

## 🎲 Componentes de Dados

### 1. **dice-roller.tsx**

Interface principal de rolagem de dados.

```tsx
"use client"

interface DiceRollerProps {
  characterId?: string
  inline?: boolean
}

export function DiceRoller({ ... }: DiceRollerProps) {
  // Features:
  // - Botões para d4, d6, d8, d10, d12, d20, d100
  // - Quantidade e modificador
  // - Roll animation
  // - Result display com breakdown
  // - Critical hit/fail detection
  // - History tracking
}
```

---

### 2. **roll-history.tsx**

Histórico de rolagens.

```tsx
'use client';

export function RollHistory() {
  // Features:
  // - Lista de últimas 20 rolagens
  // - Filtro por tipo (attack, skill, damage)
  // - Re-roll button
  // - Clear history
  // - Timestamps
}
```

---

### 3. **skill-roll-button.tsx**

Botão de rolagem de perícia.

```tsx
"use client"

interface SkillRollButtonProps {
  skillName: string
  modifier: number
  proficient: boolean
  expertise: boolean
}

export function SkillRollButton({ ... }: SkillRollButtonProps) {
  // Features:
  // - d20 + modifier
  // - Advantage/Disadvantage toggle
  // - Roll animation
  // - Result toast
}
```

---

### 4-8. Outros Componentes de Dados

| Componente                 | Descrição                   |
| -------------------------- | --------------------------- |
| `dice-manager.tsx`         | State management para dados |
| `quick-roll-button.tsx`    | Botão de roll rápido        |
| `dice-button.tsx`          | Botão de dado individual    |
| `saving-throw-buttons.tsx` | Botões de saving throws     |
| `weapon-roll-button.tsx`   | Roll de ataque com arma     |

---

## 🎭 Componentes de DM Tools

### 1. **name-generator.tsx**

Gerador de nomes para NPCs.

```tsx
'use client';

interface NameGeneratorProps {
  race?: string;
}

export function NameGenerator({ race }: NameGeneratorProps) {
  // Features:
  // - Seleção de raça
  // - Gerar nome masculino/feminino
  // - Lista de sugestões
  // - Copy to clipboard
  // - Favoritos
}
```

---

### 2. **treasure-generator.tsx**

Gerador de tesouros e loot.

```tsx
"use client"

interface TreasureGeneratorProps {
  partyLevel: number
}

export function TreasureGenerator({ ... }: TreasureGeneratorProps) {
  // Features:
  // - Hoard vs Individual treasure
  // - Challenge Rating selector
  // - Random loot generation
  // - Magic item tables
  // - Currency amounts
}
```

---

### 3-4. Outros Componentes DM

| Componente          | Descrição                                     |
| ------------------- | --------------------------------------------- |
| `random-tables.tsx` | Tabelas aleatórias (encounters, weather, etc) |
| `dice-roller.tsx`   | Versão DM do roller (sem character context)   |

---

## 📱 Componentes Mobile

### 1. **bottom-navigation.tsx**

Navegação inferior para mobile.

```tsx
'use client';

export function BottomNavigation() {
  // Features:
  // - 5 botões principais (Home, Characters, Dice, Library, Tools)
  // - Active state
  // - Icons (Lucide)
  // - Safe area insets (iOS)
  // - Fixed position
}
```

---

### 2. **mobile-sheet.tsx**

Bottom sheet modal para mobile.

```tsx
"use client"

interface MobileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  snapPoints?: number[]
}

export function MobileSheet({ ... }: MobileSheetProps) {
  // Features:
  // - Snap points (25%, 50%, 100%)
  // - Drag handle
  // - Backdrop blur
  // - Smooth animations
  // - Close on swipe down
}
```

---

### 3. **pull-to-refresh.tsx**

Gesto de pull-to-refresh.

```tsx
'use client';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
}

export function PullToRefresh({ onRefresh }: PullToRefreshProps) {
  // Features:
  // - Touch gesture detection
  // - Pull indicator
  // - Loading spinner
  // - Haptic feedback (se disponível)
}
```

---

## 🔔 Componentes PWA

### 1. **install-prompt.tsx**

Prompt de instalação do PWA.

```tsx
'use client';

export function InstallPrompt() {
  // Features:
  // - Detect beforeinstallprompt event
  // - Custom UI (glass morphism)
  // - "Lembre-me depois" (7 dias)
  // - Instruções específicas iOS
  // - Não mostrar se já instalado
}
```

---

### 2. **service-worker-register.tsx**

Registro do service worker.

```tsx
'use client';

export function ServiceWorkerRegister() {
  // Features:
  // - Register /sw.js
  // - Update detection
  // - Toast para "Nova versão disponível"
  // - Auto-reload on update
}
```

---

## 🎨 Componentes UI Base (shadcn/ui)

### Lista Completa

| Componente        | Descrição                | Base             |
| ----------------- | ------------------------ | ---------------- |
| `button.tsx`      | Botões com variants      | Radix UI         |
| `card.tsx`        | Cards com glass morphism | HTML div         |
| `tabs.tsx`        | Sistema de tabs          | Radix Tabs       |
| `dialog.tsx`      | Modal dialogs            | Radix Dialog     |
| `sheet.tsx`       | Side/bottom sheets       | Radix Dialog     |
| `input.tsx`       | Input fields             | HTML input       |
| `textarea.tsx`    | Text areas               | HTML textarea    |
| `label.tsx`       | Labels                   | HTML label       |
| `badge.tsx`       | Badges/chips             | HTML span        |
| `checkbox.tsx`    | Checkboxes               | Radix Checkbox   |
| `radio-group.tsx` | Radio buttons            | Radix RadioGroup |
| `select.tsx`      | Dropdowns                | Radix Select     |
| `alert.tsx`       | Alert messages           | HTML div         |
| `switch.tsx`      | Toggle switches          | Radix Switch     |

### Exemplo de Uso

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

<Card className="glass-card">
  <Button variant="purple" size="lg">
    Level Up
  </Button>
</Card>;
```

---

## 🧙 Wizard de Criação

### Estrutura

```
app/personagens/novo/
├── page.tsx                  # Wizard container
├── wizard-context.tsx        # State management
└── components/
    ├── wizard-layout.tsx     # Layout wrapper
    ├── wizard-navigation.tsx # Prev/Next buttons
    ├── wizard-stepper.tsx    # Progress indicator
    └── steps/
        ├── step-1-race.tsx        # Seleção de raça
        ├── step-2-subrace.tsx     # Seleção de sub-raça
        ├── step-3-class.tsx       # Seleção de classe
        ├── step-4-abilities.tsx   # Point Buy
        ├── step-5-skills.tsx      # Seleção de perícias
        ├── step-6-identity.tsx    # Nome, alinhamento
        └── step-7-summary.tsx     # Revisão final
```

### Wizard Context

```tsx
// wizard-context.tsx
"use client"

interface WizardState {
  currentStep: number
  characterData: Partial<Character>
  setCurrentStep: (step: number) => void
  updateCharacterData: (data: Partial<Character>) => void
  validateStep: (step: number) => boolean
  submitCharacter: () => Promise<void>
}

export const WizardContext = createContext<WizardState>(...)
```

### Step Example

```tsx
// step-4-abilities.tsx
'use client';

export function Step4Abilities() {
  const { characterData, updateCharacterData } = useWizard();
  const [points, setPoints] = useState(27);

  const attributes = {
    str: 8,
    dex: 8,
    con: 8,
    int: 8,
    wis: 8,
    cha: 8,
  };

  // Point Buy logic
  // ...

  return (
    <div className="space-y-6">
      <h2>Distribua seus Atributos</h2>
      <p>Você tem {points} pontos disponíveis</p>

      {Object.entries(attributes).map(([key, value]) => (
        <AttributeSlider key={key} attribute={key} value={value} onValueChange={handleChange} />
      ))}
    </div>
  );
}
```

---

## 🔧 Componentes Utilitários

### glass-card.tsx

Componente base para o design system.

```tsx
interface GlassCardProps {
  variant?: 'white' | 'gray' | 'purple';
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ variant = 'white', ...props }: GlassCardProps) {
  const variants = {
    white: 'bg-white/70 border-white/20',
    gray: 'bg-gray-800/50 border-gray-700/30',
    purple: 'bg-purple-600/20 border-purple-500/30',
  };

  return (
    <div
      className={cn(
        'backdrop-blur-md rounded-lg border p-6',
        'shadow-lg hover:shadow-xl transition-all',
        variants[variant],
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
```

---

## 📊 Padrões de Componentes

### Server vs Client

**Server Component (default):**

```tsx
// Sem "use client"
// Para data fetching e render inicial
export default async function CharacterSheet({ params }) {
  const character = await getCharacter(params.id);
  return <CharacterView character={character} />;
}
```

**Client Component:**

```tsx
'use client';

// Para interatividade e estado
export function HPManager({ currentHP, maxHP }) {
  const [hp, setHP] = useState(currentHP);
  // ...
}
```

### Props Typing

```tsx
interface ComponentProps {
  required: string;
  optional?: number;
  callback: (value: string) => void;
  children?: React.ReactNode;
}

export function Component({ required, optional = 10, ...props }: ComponentProps) {
  // ...
}
```

### Error Handling

```tsx
'use client';

export function Component() {
  const [error, setError] = useState<string | null>(null);

  try {
    // logic
  } catch (err) {
    setError(err.message);
    toast.error('Erro ao salvar personagem');
  }

  if (error) return <Alert variant="destructive">{error}</Alert>;

  return; // component
}
```

---

## 📚 Referências

- [React 19 Documentation](https://react.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

---

**Documentado por:** Claude Opus 4.6
**Data:** 9 de Março de 2026
