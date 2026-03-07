import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, race, class: className, alignment, context } = body;

    console.log('📝 Gerando background para:', { name, race, className, alignment });

    // Validação
    if (!name || !race || !className) {
      console.error('❌ Validação falhou:', { name, race, className });
      return NextResponse.json(
        { error: 'Nome, raça e classe são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se a API key está configurada
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY não configurada');
      return NextResponse.json(
        { error: 'Configuração da IA não encontrada. Contate o administrador.' },
        { status: 500 }
      );
    }

    // Montar prompt para a IA
    const prompt = `Você é um narrador experiente de Dungeons & Dragons 5ª Edição.

Crie uma história de background ÉPICA e ENVOLVENTE com EXATAMENTE 2 parágrafos para o seguinte personagem:

**Nome:** ${name}
**Raça:** ${race}
**Classe:** ${className}
**Alinhamento:** ${alignment || 'Não definido'}
${context ? `**Contexto adicional:** ${context}` : ''}

A história deve:
- Ser escrita em português brasileiro
- Ter EXATAMENTE 2 parágrafos bem desenvolvidos e densos
- Primeiro parágrafo: Origem, passado e evento marcante que definiu o personagem
- Segundo parágrafo: Como se tornou aventureiro, motivação atual e objetivo
- Ser coerente com a raça, classe e alinhamento
- Ter tom épico e dramático, mas adequado para D&D
- Incluir detalhes específicos que conectem com a mecânica da classe
${context ? '- Incorporar o contexto fornecido de forma natural' : '- Criar uma história original e criativa'}

IMPORTANTE: Apenas 2 parágrafos, nem mais nem menos.
NÃO inclua títulos, marcações ou formatações extras. Apenas a história em texto corrido.`;

    // Chamar API do Gemini diretamente via REST
    console.log('🤖 Chamando Gemini AI...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Erro da API Gemini:', errorData);
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const background = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro ao gerar história.';

    console.log('✅ Background gerado com sucesso!');
    return NextResponse.json({ background });
  } catch (error: unknown) {
    console.error('❌ Erro ao gerar background:', error);

    // Melhor tratamento de erro
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Detalhes do erro:', errorMessage);

    return NextResponse.json(
      {
        error: 'Erro ao gerar história. Tente novamente.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
