import { NextRequest, NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, race, subrace, class: className, alignment, background } = body;

    console.log('🎨 Gerando imagem para:', { name, race, subrace, className, alignment });

    // Validação
    if (!name || !race || !className) {
      console.error('❌ Validação falhou:', { name, race, className });
      return NextResponse.json(
        { error: 'Nome, raça e classe são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se a API key está configurada
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error('❌ HUGGINGFACE_API_KEY não configurada');
      return NextResponse.json(
        { error: 'Configuração da IA para imagens não encontrada. Contate o administrador.' },
        { status: 500 }
      );
    }

    // Inicializar cliente Hugging Face
    const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

    // Montar prompt para geração de imagem
    const imagePrompt = buildImagePrompt({ name, race, subrace, className, alignment, background });

    console.log('🤖 Chamando Hugging Face FLUX.1-schnell...');
    console.log('📝 Prompt:', imagePrompt);

    // Chamar API do Hugging Face usando o SDK oficial
    // Usando FLUX.1-schnell que é rápido e gratuito
    const imageUrl = await client.textToImage(
      {
        model: 'black-forest-labs/FLUX.1-schnell',
        inputs: imagePrompt,
      },
      {
        outputType: 'dataUrl', // Retorna diretamente como data URL
      }
    );

    console.log('✅ Imagem gerada com sucesso!');
    return NextResponse.json({ imageUrl });
  } catch (error: unknown) {
    console.error('❌ Erro ao gerar imagem:', error);

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('Detalhes do erro:', errorMessage);

    return NextResponse.json(
      {
        error: 'Erro ao gerar imagem. Tente novamente.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Constrói o prompt otimizado para DALL-E 3 baseado nos dados do personagem
 */
function buildImagePrompt(data: {
  name: string;
  race: string;
  subrace?: string;
  className: string;
  alignment?: string;
  background?: string;
}): string {
  const { name, race, subrace, className, alignment, background } = data;

  // Extrair características físicas da raça
  const raceDescription = getRaceDescription(race, subrace);

  // Extrair equipamento/estilo da classe
  const classDescription = getClassDescription(className);

  // Extrair tom/personalidade do alinhamento
  const alignmentTone = getAlignmentTone(alignment);

  // Prompt otimizado para DALL-E 3
  let prompt = `Epic fantasy character portrait in the style of Dungeons & Dragons official artwork. `;
  prompt += `${name}, a ${subrace ? subrace + ' ' : ''}${race} ${className}. `;
  prompt += `${raceDescription} ${classDescription} `;

  if (alignmentTone) {
    prompt += `${alignmentTone} `;
  }

  // Adicionar contexto do background se disponível (resumido)
  if (background && background.length > 50) {
    const backgroundSummary = background.substring(0, 200).trim();
    prompt += `Background: ${backgroundSummary}... `;
  }

  prompt += `Highly detailed, professional fantasy art, dramatic lighting, heroic pose, digital painting style. `;
  prompt += `Full body or portrait view, cinematic composition, vibrant colors.`;

  return prompt;
}

/**
 * Retorna descrição física baseada na raça
 */
function getRaceDescription(race: string, subrace?: string): string {
  const descriptions: Record<string, string> = {
    'human': 'Medium build human with varied features.',
    'elf': 'Graceful elf with pointed ears and slender features.',
    'high-elf': 'Elegant high elf with fair skin and refined features.',
    'wood-elf': 'Athletic wood elf with tanned skin and keen eyes.',
    'dark-elf': 'Dark elf with ebony skin and white hair.',
    'dwarf': 'Sturdy dwarf with broad shoulders and thick beard.',
    'mountain-dwarf': 'Robust mountain dwarf with strong build.',
    'hill-dwarf': 'Hardy hill dwarf with weathered features.',
    'halfling': 'Small halfling with cheerful demeanor and nimble build.',
    'lightfoot': 'Agile lightfoot halfling.',
    'stout': 'Resilient stout halfling with sturdy frame.',
    'dragonborn': 'Draconic humanoid with scaled skin and dragon-like head.',
    'gnome': 'Small gnome with bright eyes and inventive expression.',
    'half-elf': 'Half-elf blending human and elven features.',
    'half-orc': 'Half-orc with green-tinged skin and prominent tusks.',
    'tiefling': 'Tiefling with horns, tail, and infernal heritage features.',
  };

  const key = subrace?.toLowerCase() || race.toLowerCase();
  return descriptions[key] || descriptions[race.toLowerCase()] || 'Fantasy character.';
}

/**
 * Retorna descrição de equipamento/estilo baseada na classe
 */
function getClassDescription(className: string): string {
  const descriptions: Record<string, string> = {
    'fighter': 'Wearing heavy armor and wielding martial weapons.',
    'wizard': 'In flowing robes, holding a spellbook or staff.',
    'rogue': 'In leather armor with daggers and stealth equipment.',
    'cleric': 'Wearing holy symbols and plate armor with divine aura.',
    'ranger': 'In rugged armor with bow and natural elements.',
    'paladin': 'In shining plate armor with holy weapon radiating light.',
    'barbarian': 'Muscular warrior in minimal armor with great weapon.',
    'bard': 'Charismatic performer with musical instrument and light armor.',
    'druid': 'In natural garb with staff and connection to nature.',
    'monk': 'In simple robes with martial arts stance.',
    'sorcerer': 'With arcane energy swirling around, in elegant attire.',
    'warlock': 'With eldritch powers manifesting, dark mystical appearance.',
  };

  return descriptions[className.toLowerCase()] || 'Equipped for adventure.';
}

/**
 * Retorna tom/expressão baseada no alinhamento
 */
function getAlignmentTone(alignment?: string): string {
  if (!alignment) return '';

  const tones: Record<string, string> = {
    'lawful-good': 'Noble and righteous expression, heroic and honorable.',
    'neutral-good': 'Kind and compassionate expression, warm demeanor.',
    'chaotic-good': 'Free-spirited and rebellious look, passionate and brave.',
    'lawful-neutral': 'Disciplined and orderly appearance, stern expression.',
    'true-neutral': 'Balanced and calm demeanor, observant look.',
    'chaotic-neutral': 'Unpredictable and wild expression, free spirit.',
    'lawful-evil': 'Calculating and tyrannical presence, commanding aura.',
    'neutral-evil': 'Selfish and cruel demeanor, menacing look.',
    'chaotic-evil': 'Destructive and malevolent expression, dangerous aura.',
  };

  return tones[alignment] || '';
}
