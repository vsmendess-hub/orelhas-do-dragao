# 📚 Índice de Documentação - Orelhas do Dragão

**Versão:** 2.0.0
**Última Atualização:** 9 de Março de 2026

---

## 🎯 Início Rápido

- **[README.md](../README.md)** - Visão geral do projeto e quick start
- **[RELEASE_v2.0.0.md](../RELEASE_v2.0.0.md)** - Notas da versão atual

---

## 📖 Documentação Técnica

### Arquitetura e Design

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura completa do sistema
  - Stack tecnológico
  - Estrutura de diretórios
  - Fluxo de dados
  - Componentes principais
  - Sistema de rotas
  - Integrações externas
  - Segurança e performance

### Database

- **[DATABASE.md](./DATABASE.md)** - Documentação completa do banco de dados
  - Schema de tabelas
  - Índices e otimizações
  - Row Level Security (RLS)
  - Triggers e functions
  - Storage buckets
  - Queries comuns
  - Migrações

- **[MISSING_FIELDS_CHECK.md](./MISSING_FIELDS_CHECK.md)** - Verificação de campos DEV vs PROD
  - Campos que faltavam no DEV
  - Checklist de aplicação
  - Comparação de versões
  - Erros conhecidos
  - Auditoria completa

### Componentes

- **[COMPONENTS.md](./COMPONENTS.md)** - Documentação de todos os componentes React
  - Componentes de personagem (47)
  - Componentes de combate (2)
  - Componentes de dados (8)
  - DM Tools (4)
  - Mobile (3)
  - PWA (2)
  - UI Base (14)
  - Wizard de criação

---

## 🚀 Deploy e Configuração

### Deploy em Produção

- **[DEPLOYMENT.md](../DEPLOYMENT.md)** - Guia completo de deploy
- **[DEPLOY_CHECKLIST.md](../DEPLOY_CHECKLIST.md)** - Checklist pré-deploy
- **[DEPLOY_VERCEL_DASHBOARD.md](../DEPLOY_VERCEL_DASHBOARD.md)** - Deploy via Vercel Dashboard
- **[VERCEL_ENV_VARS.txt](../VERCEL_ENV_VARS.txt)** - Variáveis de ambiente para Vercel

### Supabase Setup

- **[SUPABASE_SETUP_PRODUCTION.md](../SUPABASE_SETUP_PRODUCTION.md)** - Configuração do Supabase em produção
- **[SUPABASE_STORAGE_SETUP.md](../SUPABASE_STORAGE_SETUP.md)** - Setup do Storage bucket

---

## 🔧 Features e Implementações

### Mobile e PWA

- **[MOBILE_FEATURES.md](../MOBILE_FEATURES.md)** - Features mobile e PWA implementadas
  - PWA Install Prompts
  - Offline Mode
  - Touch Gestures
  - Mobile-Optimized Layouts

### Recursos de Imagens

- **[IMAGENS_DND.md](../IMAGENS_DND.md)** - Recursos e referências de imagens D&D

### Sistema de Características

- **[FEATURES_AUTO_FILL.md](../FEATURES_AUTO_FILL.md)** - Sistema de preenchimento automático de características
  - Características de raças e sub-raças
  - Características de classes por nível
  - Referências de livros (PHB) e páginas
  - Implementação e expansões futuras

### Sistema de Proficiências

- **[PROFICIENCIES_AUTO_FILL.md](../PROFICIENCIES_AUTO_FILL.md)** - Sistema de preenchimento automático de proficiências
  - Proficiências por raça e sub-raça
  - Proficiências por classe (12 classes)
  - Proficiências por domínio (Clérigos)
  - Proficiências por background (13 backgrounds)
  - Armas, armaduras, ferramentas, idiomas, testes de resistência e perícias

### Testes de Resistência e Percepção Passiva

- **[SAVING_THROWS_PASSIVE_PERCEPTION.md](../SAVING_THROWS_PASSIVE_PERCEPTION.md)** - Cálculo automático de salvaguardas e percepção
  - 6 testes de resistência calculados automaticamente
  - Proficiências por classe destacadas visualmente
  - Percepção passiva com breakdown do cálculo
  - Baseado no PHB (fórmulas oficiais)
  - Explicações de quando e como usar

### Sprints Anteriores

- **[SPRINT-8-FEATURES.md](../SPRINT-8-FEATURES.md)** - Features implementadas na Sprint 8

---

## 🐛 Correções e Manutenção

### Logs e Correções

- **[CORRECOES.md](../CORRECOES.md)** - Log de correções de bugs

### Debugging em Produção

- **[DEBUG_CONDITIONS_PROD.md](../DEBUG_CONDITIONS_PROD.md)** - Guia de debug para condições em produção
- **[FIX_CONDITIONS_PROD.sql](../FIX_CONDITIONS_PROD.sql)** - Fix específico para campo conditions em produção
- **[QUICK_TEST_PROD.sql](../QUICK_TEST_PROD.sql)** - Testes rápidos SQL para produção
- **[TEST_CONDITIONS_BROWSER.js](../TEST_CONDITIONS_BROWSER.js)** - Script de teste browser para condições

---

## 🗄️ Migrations SQL

### Configuração de Ambiente

- **[COMPLETE_DEV_SETUP.sql](../COMPLETE_DEV_SETUP.sql)** - Setup completo do ambiente DEV
- **[APPLY_GAMEPLAY_MIGRATION.md](../APPLY_GAMEPLAY_MIGRATION.md)** - Guia para aplicar migration de gameplay

### Migrações por Feature

- **[MIGRATION_HISTORIA_FIX.sql](../MIGRATION_HISTORIA_FIX.sql)** - Correção de histórico
- **[MIGRATION_MANUAL.sql](../MIGRATION_MANUAL.sql)** - Migrações manuais
- **[MIGRATION_REST_SYSTEM.sql](../MIGRATION_REST_SYSTEM.sql)** - Sistema de descanso

### Migrações do Supabase

Migrações principais em `supabase/migrations/`:

- `20260228000000_initial_schema.sql` - Schema inicial
- `20260302225951_create_character_assets_bucket.sql` - Bucket de assets
- `20260307000000_add_personality_appearance.sql` - Campos de personalidade
- `20260307000001_add_background_data.sql` - Dados de background
- `20260309000000_add_rest_system_fields.sql` - Campos do sistema de descanso
- `20260309000001_add_character_gameplay_fields.sql` - Campos de gameplay persistente

---

## 📂 Estrutura da Documentação

```
orelhas-do-dragao/
├── docs/                          # Documentação técnica (NOVA)
│   ├── index.md                   # Este arquivo
│   ├── ARCHITECTURE.md            # Arquitetura do sistema
│   ├── DATABASE.md                # Database e schema
│   ├── COMPONENTS.md              # Componentes React
│   └── MISSING_FIELDS_CHECK.md    # Verificação DEV vs PROD
│
├── Raiz do Projeto               # Documentação de features e deploy
│   ├── README.md                  # Quick start
│   ├── RELEASE_v2.0.0.md          # Release notes
│   ├── DEPLOYMENT.md              # Deploy guide
│   ├── DEPLOY_CHECKLIST.md        # Deploy checklist
│   ├── DEPLOY_VERCEL_DASHBOARD.md # Vercel setup
│   ├── SUPABASE_SETUP_PRODUCTION.md # Supabase setup
│   ├── SUPABASE_STORAGE_SETUP.md  # Storage setup
│   ├── MOBILE_FEATURES.md         # Features mobile/PWA
│   ├── IMAGENS_DND.md             # Recursos de imagens
│   ├── SPRINT-8-FEATURES.md       # Sprint 8
│   ├── CORRECOES.md               # Bug fixes log
│   └── MIGRATION_*.sql            # SQL migrations
│
└── supabase/migrations/          # Migrações do Supabase
    └── *.sql                      # Arquivos de migração
```

---

## 🎓 Guias por Tipo de Usuário

### Para Desenvolvedores Novos no Projeto

1. Leia [README.md](../README.md) - Entenda o projeto
2. Leia [ARCHITECTURE.md](./ARCHITECTURE.md) - Entenda a arquitetura
3. Leia [DATABASE.md](./DATABASE.md) - Entenda o banco de dados
4. Leia [COMPONENTS.md](./COMPONENTS.md) - Explore os componentes
5. Configure o ambiente local (ver README.md)

### Para Deploy em Produção

1. [DEPLOY_CHECKLIST.md](../DEPLOY_CHECKLIST.md) - Checklist completo
2. [SUPABASE_SETUP_PRODUCTION.md](../SUPABASE_SETUP_PRODUCTION.md) - Setup do banco
3. [DEPLOYMENT.md](../DEPLOYMENT.md) - Deploy na Vercel
4. [DEPLOY_VERCEL_DASHBOARD.md](../DEPLOY_VERCEL_DASHBOARD.md) - Via dashboard
5. Verificar [VERCEL_ENV_VARS.txt](../VERCEL_ENV_VARS.txt) - Env vars

### Para Trabalhar com Database

1. [DATABASE.md](./DATABASE.md) - Schema completo
2. [MISSING_FIELDS_CHECK.md](./MISSING_FIELDS_CHECK.md) - Verificação de campos
3. Arquivos em `supabase/migrations/` - Migrações aplicadas
4. [SUPABASE_STORAGE_SETUP.md](../SUPABASE_STORAGE_SETUP.md) - Storage
5. `MIGRATION_*.sql` na raiz - Migrações adicionais

### Para Desenvolver Features

1. [ARCHITECTURE.md](./ARCHITECTURE.md) - Entenda o sistema
2. [COMPONENTS.md](./COMPONENTS.md) - Componentes disponíveis
3. [MOBILE_FEATURES.md](../MOBILE_FEATURES.md) - Features mobile/PWA
4. [RELEASE_v2.0.0.md](../RELEASE_v2.0.0.md) - Features atuais

---

## 🔍 Busca Rápida

### Quero saber sobre...

- **Autenticação?** → [ARCHITECTURE.md](./ARCHITECTURE.md) (seção Segurança)
- **Como fazer deploy?** → [DEPLOYMENT.md](../DEPLOYMENT.md)
- **Estrutura do banco?** → [DATABASE.md](./DATABASE.md)
- **Componentes disponíveis?** → [COMPONENTS.md](./COMPONENTS.md)
- **Features mobile?** → [MOBILE_FEATURES.md](../MOBILE_FEATURES.md)
- **PWA?** → [MOBILE_FEATURES.md](../MOBILE_FEATURES.md)
- **Configurar Supabase?** → [SUPABASE_SETUP_PRODUCTION.md](../SUPABASE_SETUP_PRODUCTION.md)
- **Configurar Storage?** → [SUPABASE_STORAGE_SETUP.md](../SUPABASE_STORAGE_SETUP.md)
- **Migrações SQL?** → [DATABASE.md](./DATABASE.md) (seção Migrações) ou [APPLY_GAMEPLAY_MIGRATION.md](../APPLY_GAMEPLAY_MIGRATION.md)
- **Stack tecnológico?** → [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Fluxo de dados?** → [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Sistema de rotas?** → [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Wizard de criação?** → [COMPONENTS.md](./COMPONENTS.md) (seção Wizard)
- **Glass morphism design?** → [RELEASE_v2.0.0.md](../RELEASE_v2.0.0.md)
- **Debugar produção?** → [DEBUG_CONDITIONS_PROD.md](../DEBUG_CONDITIONS_PROD.md)
- **Setup ambiente DEV?** → [COMPLETE_DEV_SETUP.sql](../COMPLETE_DEV_SETUP.sql)
- **Testar condições?** → [TEST_CONDITIONS_BROWSER.js](../TEST_CONDITIONS_BROWSER.js)
- **Verificar campos faltando?** → [MISSING_FIELDS_CHECK.md](./MISSING_FIELDS_CHECK.md)
- **Comparar DEV vs PROD?** → [MISSING_FIELDS_CHECK.md](./MISSING_FIELDS_CHECK.md)

---

## 📊 Diagramas e Referências Visuais

Para diagramas e fluxos detalhados, consulte:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Diagramas de arquitetura e fluxos

---

## 🆕 Últimas Atualizações

### 9 de Março de 2026 (Atualização 2)

- ✅ Adicionados guias de debugging para produção
- ✅ [DEBUG_CONDITIONS_PROD.md](../DEBUG_CONDITIONS_PROD.md) - Debug de condições
- ✅ [APPLY_GAMEPLAY_MIGRATION.md](../APPLY_GAMEPLAY_MIGRATION.md) - Guia de migration
- ✅ Scripts de teste e fix para produção
- ✅ Documentação atualizada com novos arquivos

### 9 de Março de 2026 (Atualização 1)

- ✅ Criada documentação técnica completa em `/docs`
- ✅ [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura do sistema
- ✅ [DATABASE.md](./DATABASE.md) - Database schema e queries
- ✅ [COMPONENTS.md](./COMPONENTS.md) - Todos os componentes React
- ✅ Criado índice unificado (este arquivo)

### 7 de Março de 2026

- ✅ Release v2.0.0 - Glass Morphism & Mobile Experience
- ✅ PWA features implementadas
- ✅ Sistema de descanso (rest system)
- ✅ Background gerado por IA

---

## 📞 Suporte e Contribuição

### Reportar Issues

GitHub Issues: https://github.com/vsmendess-hub/orelhas-do-dragao/issues

### Documentação Desatualizada?

Se encontrar informações desatualizadas, por favor abra uma issue ou PR.

---

## 🎯 Branches

### Estrutura de Branches

- **`production`** - Código em produção (branch protegida)
- **`main`** - Branch principal de desenvolvimento
- **`development`** - Branch de desenvolvimento ativo
- **`feature/*`** - Branches de features (criar a partir de development)

### Workflow

```
development → main → production
```

---

**Documentação mantida por:** Claude Opus 4.6 + Time de Desenvolvimento
**Contato:** [GitHub Issues](https://github.com/vsmendess-hub/orelhas-do-dragao/issues)
