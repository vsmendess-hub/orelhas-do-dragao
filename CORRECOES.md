# 🔧 Correções Implementadas

## 1. ✅ Botão Duplicado Removido

### Problema:
No último passo da criação de personagem (Step 7 - Resumo), apareciam **2 botões de "Salvar Personagem"**:
- Um no conteúdo do step
- Outro na barra de navegação inferior

### Solução:
**Arquivo:** `wizard-navigation.tsx`

Ocultamos o botão da navegação no Step 7, pois há um botão customizado no próprio conteúdo do step com melhor UX (mostra o estado de loading, erros, etc.).

---

## 2. ⚠️ Menu Personalizar Não Salvava (REQUER AÇÃO MANUAL)

### Problema:
Nenhuma alteração nas abas do menu Personalizar estava sendo salva:
- ❌ Aparência
- ❌ Personalidade
- ❌ História

### Causa:
O schema original do banco tinha campos separados (`personality_traits`, `ideals`, `bonds`, `flaws`), mas o código atual salva objetos JSONB completos nos campos `personality` e `appearance`, que **não existiam no banco**.

### Solução:
Criamos uma migration para adicionar os campos necessários.

---

## 🚨 AÇÃO NECESSÁRIA: Aplicar Migration no Supabase

### Passo 1: Acesse o Supabase Dashboard

1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto: **Orelhas do Dragão**
3. No menu lateral, clique em: **SQL Editor**

### Passo 2: Execute a Migration

Copie e cole o SQL abaixo no editor:

\`\`\`sql
-- Adicionar campos JSONB para personality e appearance
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS personality JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS appearance JSONB DEFAULT NULL;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_characters_personality ON characters USING GIN (personality);
CREATE INDEX IF NOT EXISTS idx_characters_appearance ON characters USING GIN (appearance);
\`\`\`

### Passo 3: Clique em "Run"

### Passo 4: Verifique

Execute este SQL para confirmar que as colunas foram criadas:

\`\`\`sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'characters'
AND column_name IN ('personality', 'appearance');
\`\`\`

Deve retornar:
```
column_name  | data_type
-------------|----------
personality  | jsonb
appearance   | jsonb
```

---

## ✅ Após aplicar a migration

Todas as funcionalidades do menu Personalizar funcionarão:

1. **Aparência**: Salvar idade, altura, olhos, cabelo, etc.
2. **Personalidade**: Salvar traits, ideals, bonds, flaws (inclusive com IA)
3. **História**: Salvar background, aliados, inimigos, organizações

---

## 📂 Arquivos Criados/Modificados

### Modificados:
- `wizard-navigation.tsx` - Removido botão duplicado

### Criados:
- `supabase/migrations/20260307000000_add_personality_appearance.sql` - Migration SQL
- `MIGRATION_MANUAL.sql` - Cópia da migration para referência
- `CORRECOES.md` - Este arquivo

---

## 🎯 Como Testar Após a Migration

1. Faça login na aplicação
2. Vá em um personagem
3. Clique em **Personalizar**
4. Em cada aba:
   - **Avatar**: Upload de imagem (já funcionava)
   - **Aparência**: Preencha os campos → Salvar
   - **Personalidade**: Adicione traits → Salvar (ou use "Gerar com IA")
   - **História**: Preencha a história → Salvar
5. Recarregue a página ou volte
6. ✅ As informações devem estar salvas

---

## 🆘 Se houver problemas

Se após aplicar a migration ainda não funcionar:

1. Verifique o console do navegador (F12) por erros
2. Verifique os logs do servidor Next.js
3. Confirme que as colunas foram criadas no banco (query acima)
