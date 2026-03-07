# ✅ Deploy Checklist - v2.0.0

## Pre-Deploy

### 1. Código

- [x] Commit feito: `76ebf93`
- [x] Tag criada: `v2.0.0`
- [x] Push para GitHub: ✅
- [ ] Testes locais passando
- [ ] Build sem erros: `npm run build`

### 2. Supabase Setup

#### Database

- [ ] Migrations aplicadas:
  - [ ] `20260307000000_add_personality_appearance.sql`
  - [ ] `20260307000001_add_background_data.sql`
  - [ ] `MIGRATION_REST_SYSTEM.sql`

#### Storage

- [ ] Bucket `character-assets` criado
- [ ] Bucket configurado como público
- [ ] Políticas RLS criadas:
  - [ ] Public read access
  - [ ] Authenticated users can upload
  - [ ] Users can update own files
  - [ ] Users can delete own files

#### Verificação

```sql
-- Verificar bucket
SELECT * FROM storage.buckets WHERE id = 'character-assets';

-- Verificar políticas
SELECT * FROM storage.policies WHERE bucket_id = 'character-assets';

-- Verificar migrations
SELECT * FROM characters LIMIT 1;
```

### 3. Environment Variables

#### Produção (.env.production ou Vercel)

```bash
# Supabase (OBRIGATÓRIO)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App (OBRIGATÓRIO)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# OpenAI (OPCIONAL - para IA features)
OPENAI_API_KEY=
```

- [ ] Variáveis configuradas na Vercel
- [ ] Supabase URL correto
- [ ] Keys válidas
- [ ] APP_URL com domínio de produção

## Deploy (Vercel)

### Opção 1: Via Dashboard

1. [ ] Acesse https://vercel.com
2. [ ] Import repository: `vsmendess-hub/orelhas-do-dragao`
3. [ ] Configure framework: Next.js
4. [ ] Adicione environment variables
5. [ ] Click em "Deploy"
6. [ ] Aguarde build completar

### Opção 2: Via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Build Settings

- [ ] Framework: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Install Command: `npm install`
- [ ] Node Version: 18.x ou 20.x

## Post-Deploy

### 1. Verificação Funcional

#### Básico

- [ ] Site abre sem erros
- [ ] Login funciona
- [ ] Criar personagem funciona
- [ ] Ver personagem funciona
- [ ] Editar personagem funciona

#### PWA

- [ ] Manifest.json carrega: `https://your-domain.com/manifest.json`
- [ ] Service Worker registra: DevTools → Application → Service Workers
- [ ] Install prompt aparece (após 30s em mobile)
- [ ] Offline page funciona: DevTools → Network → Offline

#### Upload

- [ ] Avatar upload funciona
- [ ] Imagem aparece corretamente
- [ ] URL do Supabase Storage correto
- [ ] Next/Image carrega imagem sem erro

#### Features

- [ ] Wizard de criação completo funciona
- [ ] Sistema de descanso funciona
- [ ] Level up funciona
- [ ] Compartilhamento funciona
- [ ] Dados funcionam

### 2. Performance Check

#### Lighthouse Audit

```bash
lighthouse https://your-domain.com --view
```

Mínimos Esperados:

- [ ] Performance: 90+
- [ ] PWA: 100
- [ ] Accessibility: 95+
- [ ] Best Practices: 100
- [ ] SEO: 100

#### Console Errors

- [ ] Sem erros no console
- [ ] Sem warnings críticos
- [ ] Service Worker registrado sem erros

### 3. Mobile Test

#### Android (Chrome)

- [ ] App carrega corretamente
- [ ] Install prompt funciona
- [ ] Bottom navigation aparece
- [ ] Touch gestures funcionam
- [ ] Swipe funciona

#### iOS (Safari)

- [ ] App carrega corretamente
- [ ] "Adicionar à Tela Inicial" funciona
- [ ] Safe areas respeitadas
- [ ] Touch gestures funcionam

### 4. Cross-Browser

- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Edge Desktop
- [ ] Chrome Mobile
- [ ] Safari Mobile

## Monitoring Setup

### Analytics (Opcional)

- [ ] Vercel Analytics ativado
- [ ] Google Analytics configurado
- [ ] Error tracking (Sentry) configurado

### Alerts

- [ ] Build failure notifications
- [ ] Error rate monitoring
- [ ] Performance degradation alerts

## DNS & Domain

Se usando domínio customizado:

- [ ] Domínio configurado na Vercel
- [ ] DNS records atualizados
- [ ] SSL certificate ativo (automático)
- [ ] Propagação DNS completa (pode levar 24-48h)

```bash
# Verificar DNS
dig your-domain.com

# Verificar SSL
curl -I https://your-domain.com
```

## Rollback Plan

Se algo der errado:

### Via Vercel Dashboard:

1. Deployments → Encontre último deploy estável
2. Click nos três pontos (...)
3. "Promote to Production"

### Via CLI:

```bash
# Listar deployments
vercel ls

# Rollback para deployment específico
vercel rollback [deployment-url]
```

## Documentation

- [ ] README.md atualizado
- [ ] RELEASE_v2.0.0.md criado
- [ ] MOBILE_FEATURES.md revisado
- [ ] Changelog atualizado

## Communication

- [ ] Notificar usuários sobre nova versão
- [ ] Postar release notes
- [ ] Atualizar status page (se houver)

## Final Checks

- [ ] Backup do banco de dados feito
- [ ] Backup das environment variables
- [ ] Equipe notificada
- [ ] Documentação atualizada
- [ ] Monitoring ativo

---

## Quick Commands

```bash
# Build local test
npm run build && npm start

# Check service worker
chrome://inspect/#service-workers

# View production logs
vercel logs

# Check deployment status
vercel inspect [deployment-url]

# Run Lighthouse
lighthouse https://your-domain.com --view
```

## Troubleshooting

### Build fails

1. Check build logs na Vercel
2. Reproduzir localmente: `npm run build`
3. Verificar environment variables
4. Check Node version compatibility

### Service Worker não registra

1. Verificar HTTPS ativo
2. Check console para erros
3. Limpar cache do navegador
4. Hard reload (Ctrl+Shift+R)

### Images não carregam

1. Verificar next.config.ts tem domínio Supabase
2. Check CORS no Supabase Storage
3. Verificar bucket é público
4. Testar URL diretamente no browser

### Database errors

1. Verificar migrations aplicadas
2. Check RLS policies
3. Verificar API keys válidas
4. Test connection no Supabase Dashboard

---

**Status:** Ready for Production ✅

**Deploy Command:** `vercel --prod`

**Version:** v2.0.0

**Date:** March 7, 2026
