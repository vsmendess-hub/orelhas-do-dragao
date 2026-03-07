# Imagens de D&D para Raças e Classes

Este arquivo documenta onde buscar e como substituir as imagens de raças e classes.

## Como Substituir as Imagens

1. Acesse o Pinterest e busque por cada raça/classe
2. Encontre uma imagem de arte conceitual de D&D
3. Clique com botão direito > "Copiar endereço da imagem"
4. Cole a URL no arquivo correspondente

## URLs para buscar no Pinterest

### Raças

**Humano** - `lib/data/races.ts` linha ~39
- Buscar: "D&D human warrior", "D&D human character art"
- Substituir URL em: `image: 'SUA_URL_AQUI'`

**Anão** - `lib/data/races.ts` linha ~47
- Buscar: "D&D dwarf warrior", "dwarf fantasy art"
- Anão da Colina: "D&D hill dwarf"
- Anão da Montanha: "D&D mountain dwarf"

**Elfo** - `lib/data/races.ts` linha ~68
- Buscar: "D&D elf", "high elf fantasy art"
- Elfo Alto: "D&D high elf mage"
- Elfo da Floresta: "D&D wood elf ranger"
- Elfo Negro (Drow): "D&D drow", "dark elf"

**Halfling** - `lib/data/races.ts` linha ~97
- Buscar: "D&D halfling", "hobbit fantasy"
- Halfling Pés-Leves: "D&D lightfoot halfling"
- Halfling Robusto: "D&D stout halfling"

**Draconato** - `lib/data/races.ts` linha ~120
- Buscar: "D&D dragonborn", "dragonborn warrior"

**Gnomo** - `lib/data/races.ts` linha ~128
- Buscar: "D&D gnome", "forest gnome"
- Gnomo da Floresta: "D&D forest gnome"
- Gnomo das Rochas: "D&D rock gnome tinker"

**Meio-Elfo** - `lib/data/races.ts` linha ~151
- Buscar: "D&D half elf", "half-elf bard"

**Meio-Orc** - `lib/data/races.ts` linha ~159
- Buscar: "D&D half orc", "half-orc barbarian"

**Tiefling** - `lib/data/races.ts` linha ~167
- Buscar: "D&D tiefling", "tiefling warlock"

### Classes

**Bárbaro** - `lib/data/classes.ts` linha ~32
- Buscar: "D&D barbarian", "barbarian rage art"

**Bardo** - `lib/data/classes.ts` linha ~61
- Buscar: "D&D bard", "bard lute fantasy"

**Bruxo** - `lib/data/classes.ts` linha ~100
- Buscar: "D&D warlock", "warlock pact magic"

**Clérigo** - `lib/data/classes.ts` linha ~139
- Buscar: "D&D cleric", "cleric holy symbol"

**Druida** - `lib/data/classes.ts` linha ~186
- Buscar: "D&D druid", "druid wildshape"

**Feiticeiro** - `lib/data/classes.ts` linha ~217
- Buscar: "D&D sorcerer", "sorcerer magic"

**Guerreiro** - `lib/data/classes.ts` linha ~239
- Buscar: "D&D fighter", "fighter sword shield"

**Ladino** - `lib/data/classes.ts` linha ~275
- Buscar: "D&D rogue", "rogue thief dagger"

**Mago** - `lib/data/classes.ts` linha ~314
- Buscar: "D&D wizard", "wizard spellbook"

**Monge** - `lib/data/classes.ts` linha ~366
- Buscar: "D&D monk", "monk martial arts"

**Paladino** - `lib/data/classes.ts` linha ~393
- Buscar: "D&D paladin", "paladin holy warrior"

**Patrulheiro** - `lib/data/classes.ts` linha ~420
- Buscar: "D&D ranger", "ranger bow arrow"

## Formato das URLs do Pinterest

As URLs do Pinterest geralmente têm este formato:
```
https://i.pinimg.com/236x/[ID]/[imagem].jpg
https://i.pinimg.com/564x/[ID]/[imagem].jpg
https://i.pinimg.com/originals/[ID]/[imagem].jpg
```

Use o tamanho `236x` ou `564x` para melhor performance.

## Exemplo de Substituição

```typescript
// ANTES
image: 'https://images.unsplash.com/photo-xxx',

// DEPOIS (com URL real do Pinterest)
image: 'https://i.pinimg.com/236x/8a/7b/3c/8a7b3c123456789.jpg',
```

## Sites Alternativos

Se não encontrar no Pinterest, pode buscar em:
- ArtStation: https://www.artstation.com/
- DeviantArt: https://www.deviantart.com/
- D&D Beyond: https://www.dndbeyond.com/
