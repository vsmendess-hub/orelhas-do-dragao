/**
 * TESTE RÁPIDO DE CONDIÇÕES - PRODUÇÃO
 *
 * Como usar:
 * 1. Abra o app em PRODUÇÃO (https://seu-dominio.vercel.app)
 * 2. Faça login
 * 3. Abra um personagem
 * 4. Abra DevTools (F12) → Console
 * 5. Cole TODO este código e aperte Enter
 * 6. Siga as instruções que aparecerem
 */

(async function testConditions() {
  console.log('🧪 INICIANDO TESTE DE CONDIÇÕES\n');

  // 1. Verificar se está logado
  const supabaseUrl = document.querySelector('meta[name="supabase-url"]')?.content;
  if (!supabaseUrl) {
    console.error('❌ Supabase URL não encontrada');
    console.log('💡 Certifique-se que está no app correto');
    return;
  }

  console.log('✅ App carregado:', window.location.href);

  // 2. Pegar character ID da URL
  const urlMatch = window.location.pathname.match(/\/personagens\/([a-f0-9-]+)/);
  if (!urlMatch) {
    console.error('❌ Não está na página de um personagem');
    console.log('💡 Abra um personagem primeiro');
    return;
  }

  const characterId = urlMatch[1];
  console.log('✅ Character ID:', characterId);

  // 3. Tentar buscar o personagem
  try {
    console.log('\n📡 Buscando personagem...');

    // Usando fetch direto para Supabase
    const response = await fetch(
      `${supabaseUrl}/rest/v1/characters?id=eq.${characterId}&select=*`,
      {
        headers: {
          apikey: 'ANON_KEY_AQUI', // Será substituído
          Authorization: `Bearer ${localStorage.getItem('supabase.auth.token') || ''}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('❌ Erro ao buscar personagem:', response.status);
      console.log('💡 Tente fazer logout e login novamente');
      return;
    }

    const characters = await response.json();
    if (!characters || characters.length === 0) {
      console.error('❌ Personagem não encontrado');
      return;
    }

    const character = characters[0];
    console.log('✅ Personagem encontrado:', character.name);
    console.log('📊 Condições atuais:', character.conditions);

    // 4. Verificar se o campo existe
    if (character.conditions === undefined) {
      console.error('\n❌ PROBLEMA IDENTIFICADO: Campo "conditions" não existe no banco!');
      console.log('\n🔧 SOLUÇÃO:');
      console.log('Execute este SQL no Supabase Dashboard → SQL Editor:');
      console.log(`
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS conditions JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_characters_conditions
ON characters USING GIN (conditions);
      `);
      return;
    }

    console.log('✅ Campo "conditions" existe');

    // 5. Testar salvamento
    console.log('\n🧪 Testando salvamento...');

    const testConditions = [
      {
        type: 'poisoned',
        active: true,
        notes: 'TESTE - ' + new Date().toISOString(),
        appliedAt: new Date().toISOString(),
      },
    ];

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/characters?id=eq.${characterId}`, {
      method: 'PATCH',
      headers: {
        apikey: 'ANON_KEY_AQUI',
        Authorization: `Bearer ${localStorage.getItem('supabase.auth.token') || ''}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ conditions: testConditions }),
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      console.error('❌ Erro ao salvar:', error);

      if (error.includes('permission denied')) {
        console.log('\n🔧 SOLUÇÃO: Problema de RLS (Row Level Security)');
        console.log('Execute no Supabase SQL Editor:');
        console.log(`
SELECT * FROM pg_policies WHERE tablename = 'characters';

-- Se não houver policy de UPDATE, criar:
CREATE POLICY "Users can update own characters"
  ON characters FOR UPDATE
  USING (auth.uid() = user_id);
        `);
      }
      return;
    }

    const updated = await updateResponse.json();
    console.log('✅ Salvamento realizado!');
    console.log('📊 Dados salvos:', updated[0]?.conditions);

    // 6. Verificar se persiste
    console.log('\n🔄 Verificando persistência...');

    setTimeout(async () => {
      const verifyResponse = await fetch(
        `${supabaseUrl}/rest/v1/characters?id=eq.${characterId}&select=conditions`,
        {
          headers: {
            apikey: 'ANON_KEY_AQUI',
            Authorization: `Bearer ${localStorage.getItem('supabase.auth.token') || ''}`,
          },
        }
      );

      const verify = await verifyResponse.json();
      console.log('📊 Dados após 2s:', verify[0]?.conditions);

      if (JSON.stringify(verify[0]?.conditions) === JSON.stringify(testConditions)) {
        console.log('\n✅✅✅ TESTE PASSOU! Condições estão persistindo!');
        console.log('\n💡 Se ainda não funciona na UI:');
        console.log('1. Limpe o cache do navegador');
        console.log('2. Faça logout e login');
        console.log('3. Verifique se o código está atualizado');
      } else {
        console.error('\n❌ FALHOU: Dados não persistiram!');
        console.log('Esperado:', testConditions);
        console.log('Recebido:', verify[0]?.conditions);
      }
    }, 2000);
  } catch (error) {
    console.error('❌ Erro durante teste:', error);
    console.log('\n💡 Problemas comuns:');
    console.log('- Não está logado');
    console.log('- Session expirou');
    console.log('- Campo não existe no banco');
    console.log('- RLS bloqueando');
  }
})();

console.log('\n📝 NOTAS:');
console.log('- Este script testa apenas a persistência');
console.log('- Se passar, o problema é no componente UI');
console.log('- Se falhar, o problema é no banco/permissões');
console.log('- Limpe as condições de teste depois!');
