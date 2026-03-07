import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Verificar se está em desenvolvimento
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Rota disponível apenas em desenvolvimento' }, { status: 403 });
    }

    // Criar cliente com service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log('🔄 Aplicando migration: add_personality_appearance');

    // SQL da migration
    const sql = `
      -- Adicionar campos JSONB para personality e appearance
      ALTER TABLE characters
      ADD COLUMN IF NOT EXISTS personality JSONB,
      ADD COLUMN IF NOT EXISTS appearance JSONB;

      -- Criar índices
      CREATE INDEX IF NOT EXISTS idx_characters_personality ON characters USING GIN (personality);
      CREATE INDEX IF NOT EXISTS idx_characters_appearance ON characters USING GIN (appearance);
    `;

    // Executar cada comando separadamente
    const commands = [
      'ALTER TABLE characters ADD COLUMN IF NOT EXISTS personality JSONB',
      'ALTER TABLE characters ADD COLUMN IF NOT EXISTS appearance JSONB',
      'CREATE INDEX IF NOT EXISTS idx_characters_personality ON characters USING GIN (personality)',
      'CREATE INDEX IF NOT EXISTS idx_characters_appearance ON characters USING GIN (appearance)',
    ];

    for (const cmd of commands) {
      const { error } = await supabase.rpc('exec_sql', { query: cmd });
      if (error) {
        console.error('Erro ao executar comando:', cmd, error);
      }
    }

    console.log('✅ Migration aplicada com sucesso!');

    return NextResponse.json({ success: true, message: 'Migration aplicada' });
  } catch (error) {
    console.error('❌ Erro ao aplicar migration:', error);
    return NextResponse.json(
      { error: 'Erro ao aplicar migration', details: error },
      { status: 500 }
    );
  }
}
