# 🏗️ Arquitetura do Sistema - Orelhas do Dragão

**Versão:** 2.0.0
**Última Atualização:** 9 de Março de 2026

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitetura da Aplicação](#arquitetura-da-aplicação)
4. [Estrutura de Diretórios](#estrutura-de-diretórios)
5. [Fluxo de Dados](#fluxo-de-dados)
6. [Componentes Principais](#componentes-principais)
7. [Sistema de Rotas](#sistema-de-rotas)
8. [Integrações Externas](#integrações-externas)
9. [Segurança](#segurança)
10. [Performance](#performance)

---

## 🎯 Visão Geral

**Orelhas do Dragão** é um Progressive Web App (PWA) para criação e gerenciamento de fichas de personagens de D&D 5ª Edição em português brasileiro.

### Proposta de Valor

- ✨ Criação guiada de personagens com wizard de 7 etapas
- 🤖 Geração de background e personalidade via IA (Google Gemini)
- 📱 Suporte completo PWA com offline mode
- 🎲 Sistema de rolagem de dados integrado
- 👥 Compartilhamento e biblioteca comunitária
- 🎨 Design glass morphism responsivo

### Público-Alvo

- Jogadores de D&D 5e (iniciantes e veteranos)
- Mestres de jogo (DM Tools)
- Comunidade D&D brasileira

---

## 🛠️ Stack Tecnológico

### Frontend

```
├── Next.js 16.1.6 (App Router + Turbopack)
├── React 19.2.3 (Server & Client Components)
├── TypeScript 5
├── Tailwind CSS 4.x
└── shadcn/ui (Radix UI + Tailwind)
```

### Backend & Serviços

```
├── Supabase
│   ├── PostgreSQL (Database)
│   ├── Auth (Google OAuth)
│   ├── Storage (Character Assets)
│   └── Realtime (subscriptions)
├── Google Gemini 2.5 Flash (AI)
├── Hugging Face (Image Generation)
└── Vercel (Hosting)
```

### PWA & Mobile

```
├── Service Workers (Offline Support)
├── Web Manifest
├── Touch Gestures
└── Bottom Navigation
```

### DevOps

```
├── Git (Version Control)
├── GitHub Actions (CI/CD)
├── Husky (Git Hooks)
├── ESLint + Prettier
└── Vercel CLI
```

---

## 🏛️ Arquitetura da Aplicação

### Arquitetura em Camadas

```
┌─────────────────────────────────────────────┐
│          PRESENTATION LAYER                 │
│  (React Components + UI + Routes)           │
│  - Pages (App Router)                       │
│  - Components (Character, Combat, Dice)     │
│  - Layouts & Templates                      │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          BUSINESS LOGIC LAYER               │
│  (Data Processing + Validation)             │
│  - Character Creation Wizard                │
│  - Combat System                            │
│  - Dice Rolling Engine                      │
│  - Level Up Logic                           │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          DATA ACCESS LAYER                  │
│  (Supabase Client + API Routes)             │
│  - CRUD Operations                          │
│  - Authentication                           │
│  - File Upload/Download                     │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          PERSISTENCE LAYER                  │
│  (Supabase Backend)                         │
│  - PostgreSQL Database                      │
│  - Storage Buckets                          │
│  - Row Level Security (RLS)                 │
└─────────────────────────────────────────────┘
```

### Arquitetura de Componentes

```
App Router (Next.js 15)
├── Server Components (default)
│   ├── Data Fetching
│   ├── Initial Render
│   └── SEO Optimization
├── Client Components ("use client")
│   ├── Interactivity
│   ├── State Management
│   ├── Event Handlers
│   └── Browser APIs
└── API Routes
    ├── AI Generation
    ├── Authentication
    └── Data Mutations
```

---

## 📁 Estrutura de Diretórios

### Visão Geral

```
orelhas-do-dragao/
├── app/                    # Next.js App Router
│   ├── api/                # API Routes
│   ├── components/         # React Components
│   ├── personagens/        # Character Routes
│   ├── party/              # Party Management
│   ├── library/            # Community Library
│   ├── dm-tools/           # DM Utilities
│   ├── login/              # Authentication
│   ├── shared/             # Public Sharing
│   ├── offline/            # PWA Offline Page
│   ├── layout.tsx          # Root Layout
│   ├── page.tsx            # Dashboard
│   └── globals.css         # Global Styles
├── lib/                    # Shared Libraries
│   ├── data/               # D&D 5e Data (36 files)
│   ├── hooks/              # React Hooks
│   ├── supabase/           # Database Integration
│   └── utils.ts            # Utilities
├── components/             # Global UI Components
│   └── ui/                 # shadcn/ui
├── public/                 # Static Assets
│   ├── manifest.json       # PWA Manifest
│   ├── sw.js               # Service Worker
│   └── icons/              # PWA Icons
├── supabase/               # Database
│   ├── migrations/         # SQL Migrations
│   └── README.md
├── scripts/                # Utility Scripts
├── docs/                   # Documentation (NEW)
└── [config files]
```

### Detalhamento: `/app/components`

```
components/
├── character/              # 47 componentes (gestão de personagem)
│   ├── spell-manager.tsx
│   ├── hp-manager.tsx
│   ├── inventory-manager.tsx
│   ├── level-up-wizard.tsx
│   ├── rest-manager.tsx
│   ├── avatar-uploader.tsx
│   └── [41+ more...]
├── combat/                 # 2 componentes (combate)
│   ├── initiative-tracker.tsx
│   └── quick-actions.tsx
├── dice/                   # 8 componentes (dados)
│   ├── dice-roller.tsx
│   ├── roll-history.tsx
│   └── [6 more...]
├── dm-tools/               # 4 componentes (mestre)
│   ├── name-generator.tsx
│   ├── treasure-generator.tsx
│   └── [2 more...]
├── mobile/                 # 3 componentes (mobile)
│   ├── bottom-navigation.tsx
│   ├── mobile-sheet.tsx
│   └── pull-to-refresh.tsx
├── pwa/                    # 2 componentes (PWA)
│   ├── install-prompt.tsx
│   └── service-worker-register.tsx
├── library/                # 2 componentes (biblioteca)
├── party/                  # 1 componente (party)
└── ui/                     # 14 componentes (shadcn)
```

### Detalhamento: `/lib/data`

```
data/ (36 arquivos - Referência D&D 5e)
├── Core Game Data
│   ├── races.ts            # Raças e sub-raças
│   ├── classes.ts          # 12 classes + arquétipos
│   ├── skills.ts           # 14 perícias
│   ├── alignments.ts       # 9 alinhamentos
│   ├── spells.ts           # Sistema de magias
│   ├── common-spells.ts    # Banco de magias comuns
│   ├── items.ts            # Equipamentos
│   ├── feats.ts            # Talentos
│   └── [more...]
├── Progression
│   ├── experience.ts       # Tabela de XP
│   ├── point-buy.ts        # Sistema de atributos
│   ├── level-up.ts         # Lógica de level up
│   ├── multiclass.ts       # Multiclasse
│   └── spell-progression.ts
├── Combat
│   ├── initiative.ts
│   ├── combat-actions.ts
│   ├── conditions.ts
│   ├── death-saves.ts
│   └── concentration.ts
├── Character Features
│   ├── personality.ts
│   ├── companions.ts
│   ├── journal.ts
│   └── goals.ts
└── Utilities
    ├── character-sharing.ts
    ├── character-import-export.ts
    └── dm-tools.ts
```

---

## 🔄 Fluxo de Dados

### 1. Autenticação

```mermaid
User → Login Page → Supabase Auth (Google OAuth)
                        ↓
                   Callback Handler
                        ↓
                 Set Session Cookie
                        ↓
                 Redirect to Dashboard
```

**Arquivos Envolvidos:**

- `/app/login/page.tsx`
- `/app/auth/callback/route.ts`
- `/lib/supabase/middleware.ts`
- `middleware.ts`

### 2. Criação de Personagem

```mermaid
Dashboard → Wizard (7 Steps) → Form State (Context)
                                      ↓
                            Validation & Calculation
                                      ↓
                              API Route (opcional)
                                      ↓
                            Supabase Insert Character
                                      ↓
                           Redirect to Character Sheet
```

**Fluxo Detalhado:**

1. **Step 1 - Race:** Seleção de raça → atualiza context
2. **Step 2 - Subrace:** Seleção de sub-raça (se aplicável)
3. **Step 3 - Class:** Seleção de classe + arquétipo
4. **Step 4 - Abilities:** Point Buy (27 pontos)
5. **Step 5 - Skills:** Seleção de perícias
6. **Step 6 - Identity:** Nome, alinhamento, background
7. **Step 7 - Summary:** Revisão + confirmação
8. **Submit:** Inserção no banco de dados

**Arquivos Envolvidos:**

- `/app/personagens/novo/page.tsx`
- `/app/personagens/novo/wizard-context.tsx`
- `/app/personagens/novo/components/steps/*.tsx`
- `/lib/data/point-buy.ts`
- `/lib/supabase/client.ts`

### 3. Visualização de Personagem

```mermaid
Character Route → Fetch from Supabase → Server Component Render
                                               ↓
                                    Hydrate Client Components
                                               ↓
                                         User Interaction
                                               ↓
                                    Optimistic UI Update
                                               ↓
                                      Mutation to Database
                                               ↓
                                          Revalidate
```

**Arquivos Envolvidos:**

- `/app/personagens/[id]/page.tsx`
- `/app/components/character/*.tsx`
- `/lib/supabase/server.ts`

### 4. Geração de Background (IA)

```mermaid
User Click → API Route → Google Gemini API
                              ↓
                      Generate Background
                              ↓
                       Return JSON Response
                              ↓
                    Update Character in DB
                              ↓
                        UI Update (Toast)
```

**Arquivos Envolvidos:**

- `/app/api/generate-background/route.ts`
- `/app/components/character/backstory-editor.tsx`

### 5. Sistema de Dados (Dice Rolling)

```mermaid
User Action → Dice Manager Component → Calculate Result
                                            ↓
                                     Add to History
                                            ↓
                                    Display Result (Animation)
                                            ↓
                                 Optional: Save to Character
```

**Arquivos Envolvidos:**

- `/app/components/dice/*.tsx`
- `/lib/data/dice.ts`

---

## 🧩 Componentes Principais

### Hierarquia de Componentes (Exemplo: Character Sheet)

```
CharacterSheetPage (Server Component)
├── Layout
│   └── Tabs Navigation
├── CharacterPortrait (Client)
│   └── AvatarUploader
├── AttributesSection (Client)
│   ├── HPManager
│   ├── ArmorClass
│   └── Initiative
├── SkillsSection (Client)
│   └── SkillRollButton (per skill)
├── SpellsTab (Client)
│   ├── SpellManager
│   ├── SpellSlotTracker
│   └── SpellList
├── InventoryTab (Client)
│   ├── InventoryManager
│   └── EquipmentSlots
├── CombatTab (Client)
│   ├── InitiativeTracker
│   ├── ConditionsManager
│   └── DeathSavesManager
└── NotesTab (Client)
    ├── JournalManager
    └── GoalsManager
```

### Componentes Reutilizáveis

#### GlassCard

```tsx
// Componente base para design glass morphism
<GlassCard variant="white" | "gray" | "purple">
  {children}
</GlassCard>
```

#### DiceRoller

```tsx
// Sistema de rolagem de dados
<DiceRoller diceType="d20" modifier={+5} onRoll={(result) => handleRoll(result)} />
```

#### SpellManager

```tsx
// Gerenciamento completo de magias
<SpellManager characterId={id} characterLevel={level} spellcastingClass="wizard" />
```

---

## 🗺️ Sistema de Rotas

### Rotas Públicas

| Rota              | Descrição                          | Tipo   |
| ----------------- | ---------------------------------- | ------ |
| `/login`          | Página de login (Google OAuth)     | Public |
| `/shared/[token]` | Visualização pública de personagem | Public |
| `/offline`        | Página offline (PWA)               | Public |

### Rotas Protegidas (Autenticadas)

| Rota                        | Descrição                        | Tipo      |
| --------------------------- | -------------------------------- | --------- |
| `/`                         | Dashboard (lista de personagens) | Protected |
| `/personagens/novo`         | Wizard de criação                | Protected |
| `/personagens/[id]`         | Ficha de personagem              | Protected |
| `/personagens/[id]/editar`  | Editar personagem                | Protected |
| `/personagens/[id]/magias`  | Página de magias                 | Protected |
| `/personagens/[id]/combate` | Visão de combate                 | Protected |
| `/party`                    | Dashboard de party               | Protected |
| `/library`                  | Biblioteca comunitária           | Protected |
| `/dm-tools`                 | Ferramentas do mestre            | Protected |

### API Routes

| Rota                            | Método | Descrição                  |
| ------------------------------- | ------ | -------------------------- |
| `/api/generate-background`      | POST   | Gerar background com IA    |
| `/api/generate-personality`     | POST   | Gerar personalidade com IA |
| `/api/generate-character-image` | POST   | Gerar imagem de personagem |
| `/auth/callback`                | GET    | OAuth callback             |
| `/auth/logout`                  | POST   | Logout                     |
| `/api/admin/migrate`            | POST   | Migrações admin            |

---

## 🔌 Integrações Externas

### 1. Supabase

**Serviços Utilizados:**

- **Auth:** Google OAuth
- **Database:** PostgreSQL com RLS
- **Storage:** Bucket `character-assets`
- **Realtime:** Subscriptions (preparado)

**Configuração:**

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 2. Google Gemini API

**Uso:** Geração de conteúdo via IA

- Background de personagem
- Personalidade (traits, ideals, bonds, flaws)

**Configuração:**

```typescript
// app/api/generate-personality/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
```

### 3. Hugging Face

**Uso:** Geração de imagens de personagem

**Endpoint:** Inference API (modelo específico)

### 4. Vercel

**Deploy Automático:**

- Push to `main` → Deploy automático
- Preview deploys para PRs
- Environment variables configuradas

---

## 🔐 Segurança

### Autenticação & Autorização

1. **Supabase Auth (Google OAuth)**
   - Login via Google
   - Session cookies (httpOnly)
   - Refresh token rotation

2. **Row Level Security (RLS)**

   ```sql
   -- Usuário vê apenas seus personagens
   CREATE POLICY "Users can view own characters"
   ON characters FOR SELECT
   USING (auth.uid() = user_id);

   -- Usuário vê personagens públicos
   CREATE POLICY "Users can view public characters"
   ON characters FOR SELECT
   USING (is_public = true);
   ```

3. **Middleware Protection**
   ```typescript
   // middleware.ts
   export async function middleware(request: NextRequest) {
     const { supabase, response } = createServerClient(request);
     await supabase.auth.getSession();
     return response;
   }
   ```

### Proteção de Dados

- **Variáveis de Ambiente:** Secrets não commitados (.env.local)
- **API Keys:** Server-side only
- **CORS:** Configurado no Vercel
- **HTTPS:** Obrigatório (Vercel + Supabase)

### Validação

- **Client-side:** Zod schemas (opcional)
- **Server-side:** Validação em API routes
- **Database:** CHECK constraints + triggers

---

## ⚡ Performance

### Otimizações Implementadas

1. **Next.js App Router**
   - Server Components (default)
   - Streaming SSR
   - Route prefetching
   - Image optimization

2. **Caching Strategy**
   - Service Worker cache (PWA)
   - Static assets cached agressivamente
   - API responses com stale-while-revalidate

3. **Code Splitting**
   - Lazy loading de componentes
   - Dynamic imports
   - Route-based splitting

4. **Database**
   - Indexes otimizados
   - JSONB para dados flexíveis
   - Connection pooling (Supabase)

### Métricas Esperadas

| Métrica                  | Target | Atual  |
| ------------------------ | ------ | ------ |
| Lighthouse Performance   | 90+    | TBD    |
| First Load JS            | <150KB | ~150KB |
| Time to Interactive      | <3s    | TBD    |
| Largest Contentful Paint | <2.5s  | TBD    |
| PWA Score                | 100    | 100    |

---

## 📊 Diagramas

### Fluxo de Autenticação

```
┌─────────┐       ┌──────────┐       ┌─────────────┐
│ Browser │──────▶│  /login  │──────▶│  Supabase   │
└─────────┘       └──────────┘       │    Auth     │
     ▲                                └──────┬──────┘
     │                                       │
     │         ┌──────────────────┐          │
     └─────────│  Set Session     │◀─────────┘
               │  Redirect Home   │
               └──────────────────┘
```

### Arquitetura de Deploy

```
┌──────────────────────────────────────────┐
│          GitHub Repository               │
└──────────────┬───────────────────────────┘
               │ (push to main)
               ▼
┌──────────────────────────────────────────┐
│          Vercel (Build & Deploy)         │
│  - Next.js Build                         │
│  - Static Generation                     │
│  - Edge Functions                        │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│      Production Environment              │
│  ┌────────────────┐  ┌────────────────┐ │
│  │  Vercel CDN    │  │   Supabase     │ │
│  │  (Static)      │  │  (Database +   │ │
│  │  (SSR)         │  │   Storage +    │ │
│  │  (API Routes)  │  │   Auth)        │ │
│  └────────────────┘  └────────────────┘ │
└──────────────────────────────────────────┘
```

---

## 🔮 Próximos Passos

### Planejado

- [ ] Melhorias de performance (lazy loading)
- [ ] Testes automatizados (Jest + React Testing Library)
- [ ] Storybook para componentes
- [ ] Analytics (Vercel Analytics)
- [ ] Sentry para error tracking
- [ ] Notificações push
- [ ] Sincronização offline robusta

---

## 📚 Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [D&D 5e SRD](https://dnd.wizards.com/resources/systems-reference-document)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Documentado por:** Claude Opus 4.6
**Data:** 9 de Março de 2026
