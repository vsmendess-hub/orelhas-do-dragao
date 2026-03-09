# 🐉 Orelhas do Dragão

## Character Builder PWA - D&D 5e pt-BR

**Mais Risadas & Menos Regras**

App PWA para criação e gerenciamento de fichas de personagens D&D 5ª Edição em português brasileiro, com geração de background via IA.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x ou superior
- npm 10.x ou superior

### Installation

\`\`\`bash

# Clone o repositório

git clone https://github.com/seu-usuario/orelhas-do-dragao.git
cd orelhas-do-dragao

# Instalar dependências

npm install

# Configurar variáveis de ambiente

cp .env.local.example .env.local

# Edite .env.local com suas credenciais

# Rodar em desenvolvimento

npm run dev
\`\`\`

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Configuração Inicial

1. **Supabase**: Veja `supabase/README.md` para instruções de setup do database
2. **Environment Variables**: Configure `.env.local` com suas credenciais
3. **Deploy**: Consulte `DEPLOYMENT.md` para instruções completas de deploy na Vercel

---

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4.x + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **IA**: Google Gemini Flash 2.0
- **Hosting**: Vercel + Supabase

---

## 📜 Scripts Disponíveis

\`\`\`bash
npm run dev # Desenvolvimento
npm run build # Build produção
npm run lint # ESLint
npm run format # Prettier
\`\`\`

---

## 📚 Documentação

### Documentação Completa

Acesse **[docs/index.md](./docs/index.md)** para o índice completo da documentação técnica.

#### Documentação Técnica Principal

- **[Arquitetura](./docs/ARCHITECTURE.md)** - Arquitetura completa do sistema
- **[Database](./docs/DATABASE.md)** - Schema, RLS, queries e migrações
- **[Componentes](./docs/COMPONENTS.md)** - Documentação de todos os componentes React

#### Guias de Deploy

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guia completo de deploy
- **[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)** - Checklist pré-deploy
- **[SUPABASE_SETUP_PRODUCTION.md](./SUPABASE_SETUP_PRODUCTION.md)** - Setup do Supabase

#### Release Notes

- **[RELEASE_v2.0.0.md](./RELEASE_v2.0.0.md)** - Glass Morphism & Mobile Experience

---

## 🌿 Estrutura de Branches

Este projeto utiliza uma estratégia de branches para proteger o código em produção:

```
production  → Código em produção (protegida, apenas merges via PR)
    ↑
  main      → Branch estável, testada antes de ir para produção
    ↑
development → Desenvolvimento ativo de novas features
    ↑
feature/*   → Branches de features individuais
```

### Workflow

1. **Desenvolver**: Criar branch `feature/nome-feature` a partir de `development`
2. **Testar**: Fazer PR para `development`
3. **Validar**: Testar em `development`, depois PR para `main`
4. **Deploy**: PR de `main` para `production` quando pronto

### Branches Atuais

- **`production`** - v2.0.0 em produção
- **`main`** - Sincronizado com production
- **`development`** - Desenvolvimento ativo (inclui documentação completa)

---

**Desenvolvido com ❤️ e 🎲 pela comunidade D&D Brasil**
