/**
 * API Endpoint para adicionar campo currency
 * Acesso: /api/admin/add-currency-field
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Verificar se o usuário está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // SQL para adicionar o campo currency
    const migrationSQL = `
      -- Adicionar campo currency se não existir
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'characters' AND column_name = 'currency'
        ) THEN
          ALTER TABLE characters
          ADD COLUMN currency JSONB NOT NULL DEFAULT '{"copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0}'::jsonb;

          COMMENT ON COLUMN characters.currency IS 'Moedas do personagem: {copper, silver, electrum, gold, platinum}. PHB p.143';
        END IF;
      END $$;

      -- Atualizar personagens existentes que possam ter currency NULL
      UPDATE characters
      SET currency = '{"copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0}'::jsonb
      WHERE currency IS NULL;
    `;

    // Executar migration
    const { error: migrationError } = await supabase.rpc('exec_sql', {
      sql: migrationSQL,
    });

    if (migrationError) {
      console.error('Erro ao executar migration:', migrationError);

      // Se não tiver a função exec_sql, retornar instruções
      return NextResponse.json(
        {
          error: 'Migration precisa ser executada manualmente',
          instructions: `
            1. Acesse o Supabase Dashboard
            2. Vá em SQL Editor
            3. Execute o script: MIGRATION_ADD_CURRENCY.sql
          `,
          sql: `
            ALTER TABLE characters
            ADD COLUMN IF NOT EXISTS currency JSONB NOT NULL DEFAULT '{"copper": 0, "silver": 0, "electrum": 0, "gold": 0, "platinum": 0}'::jsonb;
          `,
        },
        { status: 500 }
      );
    }

    // Verificar quantos personagens foram atualizados
    const { data: stats, error: statsError } = await supabase
      .from('characters')
      .select('id, currency')
      .limit(1);

    if (statsError) {
      throw statsError;
    }

    return NextResponse.json({
      success: true,
      message: 'Campo currency adicionado com sucesso',
      sample: stats?.[0],
    });
  } catch (error: unknown) {
    console.error('Erro na migration:', error);
    return NextResponse.json(
      {
        error: 'Erro ao executar migration',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        instructions: `
          Execute manualmente o arquivo: MIGRATION_ADD_CURRENCY.sql
          Localize em: /Users/vagner.mendes/Desktop/Estudos/orelhas-do-dragao/MIGRATION_ADD_CURRENCY.sql
        `,
      },
      { status: 500 }
    );
  }
}
