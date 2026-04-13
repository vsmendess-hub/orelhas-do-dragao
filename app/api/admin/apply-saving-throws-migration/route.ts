/**
 * API Route para aplicar migração de saving_throws_override
 * Acesse: POST /api/admin/apply-saving-throws-migration
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    // Verificar se está em desenvolvimento
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Rota disponível apenas em desenvolvimento' },
        { status: 403 }
      );
    }

    // Criar cliente com service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log('🔄 Aplicando migration: add_saving_throws_override');

    // Executar comando diretamente usando o admin API
    const { error } = await supabase.from('characters').select('id').limit(1);

    if (error) {
      console.error('Erro ao verificar conexão:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Como não temos acesso direto ao SQL via client, vamos usar uma abordagem alternativa
    // O ideal é executar este SQL diretamente no Supabase Dashboard
    const sqlCommand = `
-- Add saving_throws_override field (JSONB)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS saving_throws_override JSONB DEFAULT '{}'::jsonb;

-- Add comment
COMMENT ON COLUMN characters.saving_throws_override IS 'Manual overrides for saving throws (e.g., {"str": 5, "dex": 3}). Empty object means use automatic calculation.';
`;

    console.log('📋 Execute este SQL no Supabase Dashboard:');
    console.log(sqlCommand);

    return NextResponse.json({
      success: true,
      message: 'Por favor, execute o SQL fornecido no Supabase Dashboard (SQL Editor)',
      sql: sqlCommand,
      instructions: [
        '1. Acesse o Supabase Dashboard',
        '2. Vá em "SQL Editor"',
        '3. Copie e cole o SQL acima',
        '4. Execute',
      ],
    });
  } catch (error) {
    console.error('Erro na migração:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const sqlCommand = `-- Add saving_throws_override field (JSONB)
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS saving_throws_override JSONB DEFAULT '{}'::jsonb;

-- Add comment
COMMENT ON COLUMN characters.saving_throws_override IS 'Manual overrides for saving throws (e.g., {"str": 5, "dex": 3}). Empty object means use automatic calculation.';`;

  return NextResponse.json({
    message: 'Migração: add_saving_throws_override',
    description: 'Adiciona campo saving_throws_override à tabela characters',
    sql: sqlCommand,
    instructions: [
      '1. Acesse o Supabase Dashboard',
      '2. Vá em "SQL Editor"',
      '3. Copie e cole o SQL acima',
      '4. Execute',
      '5. Ou use POST nesta rota (apenas em desenvolvimento)',
    ],
  });
}
