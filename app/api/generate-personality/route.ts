import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { characterName, background, race, characterClass } = body;

    console.log('🎭 Gerando personalidade para:', { characterName, race, characterClass });

    // Validação
    if (!characterName || !background) {
      console.error('❌ Validação falhou:', { characterName, background });
      return NextResponse.json(
        { error: 'Nome e história são obrigatórios' },
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

    // Montar prompt para geração de personalidade
    const prompt = `Você é um mestre de D&D 5e experiente. Com base na história abaixo, crie uma personalidade completa para o personagem seguindo as regras de D&D 5e.

**Personagem:** ${characterName}
**Raça:** ${race || 'Desconhecida'}
**Classe:** ${characterClass || 'Desconhecida'}

**História:**
${background}

**IMPORTANTE:**
- Retorne APENAS um objeto JSON válido, sem texto adicional
- Siga exatamente o formato abaixo
- Traços: 2 características comportamentais marcantes
- Ideais: 1 princípio que guia as ações
- Vínculos: 1 conexão importante (pessoa, lugar ou objeto)
- Defeitos: 1 fraqueza ou vício

**Formato da resposta (JSON):**
{
  "traits": ["traço 1", "traço 2"],
  "ideals": ["ideal"],
  "bonds": ["vínculo"],
  "flaws": ["defeito"]
}`;

    console.log('🤖 Chamando Gemini AI...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Erro da API Gemini:', errorData);
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro ao gerar personalidade.';

    console.log('📝 Resposta recebida:', responseText);

    // Extrair JSON da resposta
    let personality;
    try {
      // Remove markdown code blocks se existirem
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      personality = JSON.parse(cleanedText);

      // Validar estrutura
      if (
        !personality.traits ||
        !personality.ideals ||
        !personality.bonds ||
        !personality.flaws ||
        !Array.isArray(personality.traits) ||
        !Array.isArray(personality.ideals) ||
        !Array.isArray(personality.bonds) ||
        !Array.isArray(personality.flaws)
      ) {
        throw new Error('Estrutura de personalidade inválida');
      }
    } catch (parseError) {
      console.error('❌ Erro ao parsear JSON:', parseError);
      console.error('Resposta original:', responseText);
      return NextResponse.json(
        { error: 'Erro ao processar resposta da IA. Tente novamente.' },
        { status: 500 }
      );
    }

    console.log('✅ Personalidade gerada com sucesso!');
    return NextResponse.json({ personality });
  } catch (error: unknown) {
    console.error('❌ Erro ao gerar personalidade:', error);

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Detalhes do erro:', errorMessage);

    return NextResponse.json(
      {
        error: 'Erro ao gerar personalidade. Tente novamente.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
