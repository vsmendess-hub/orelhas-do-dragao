# 🎒 Sistema de Inventário Aprimorado - Implementação Parcial

**Data:** 10 de Março de 2026
**Status:** ⚠️ EM PROGRESSO

---

## 🎯 Objetivo

Aprimorar o sistema de inventário com:

1. ✅ **Biblioteca de itens do PHB** (armas, armaduras, equipamentos)
2. ✅ **Seletor de itens pré-definidos**
3. ⏳ **Cálculos automáticos** ao equipar itens
4. ⏳ **Atualização de CA** ao equipar armadura
5. ⏳ **Cálculo de bônus de ataque/dano** para armas
6. ⏳ **Persistência no banco de dados**

---

## ✅ O que Foi Implementado

### 1. **Biblioteca de Armas** (`/lib/data/weapons.ts`)

**58 armas do PHB implementadas:**

- 10 Armas Simples Corpo a Corpo
- 4 Armas Simples à Distância
- 18 Armas Marciais Corpo a Corpo
- 5 Armas Marciais à Distância

**Dados incluídos para cada arma:**

```typescript
interface Weapon {
  id: string;
  name: string;
  category: WeaponCategory;
  damage: string; // Ex: "1d8"
  damageType: DamageType; // Cortante, Perfurante, Contundente
  properties: WeaponProperty[]; // Leve, Versátil, Alcance, etc.
  versatileDamage?: string; // Para armas versáteis
  range?: string; // Para armas à distância
  cost: { gold: number };
  weight: number;
  source: string; // PHB
  page: number;
}
```

**Exemplos:**

- Espada Longa: 1d8 cortante, Versátil (1d10), 15 po
- Arco Longo: 1d8 perfurante, Alcance 150/600, 50 po
- Adaga: 1d4 perfurante, Sutil/Leve/Arremesso, 2 po

**Funções Implementadas:**

- `calculateAttackBonus()` - Calcula bônus de ataque (PHB p.194)
- `formatWeaponDamage()` - Formata dano com modificador
- `getWeaponById()` - Busca arma por ID
- `searchWeapons()` - Busca armas por nome/categoria

### 2. **Biblioteca de Armaduras** (`/lib/data/armors.ts`)

**14 armaduras + escudos do PHB implementados:**

- 3 Armaduras Leves (CA 11-12 + DEX)
- 5 Armaduras Médias (CA 12-15 + DEX máx +2)
- 4 Armaduras Pesadas (CA 14-18 fixa)
- 1 Escudo (+2 CA)

**Dados incluídos para cada armadura:**

```typescript
interface Armor {
  id: string;
  name: string;
  category: ArmorCategory;
  baseAC: number | string; // "12 + DEX" ou 16 (fixo)
  maxDexBonus?: number; // null = sem limite, 2 = armadura média
  strengthRequired?: number; // FOR mínima
  stealthDisadvantage: boolean;
  cost: { gold: number };
  weight: number;
  source: string;
  page: number;
}
```

**Exemplos:**

- Couro Batido: CA 12 + DEX, 45 po, sem desvantagem
- Cota de Malha: CA 16, FOR 13+, desvantagem, 75 po
- Placas: CA 18, FOR 15+, desvantagem, 1500 po

**Funções Implementadas:**

- `calculateArmorClass()` - Calcula CA total (PHB p.144-145)
- `canUseArmor()` - Verifica se pode usar (FOR, proficiência)
- `getArmorPenalties()` - Retorna penalidades sem proficiência

### 3. **Biblioteca de Equipamentos** (`/lib/data/equipment.ts`)

**40+ itens diversos do PHB:**

- Equipamento de Aventura (mochila, corda, tocha, etc.)
- Kits de Ferramentas (ladrão, herbalismo, disfarce, etc.)
- Instrumentos Musicais (flauta, alaúde, tambor, etc.)
- Munição (flechas, virotes, balas)
- Poções (cura, antitoxina)

**Dados incluídos:**

```typescript
interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  cost: { gold: number; silver?: number; copper?: number };
  weight: number;
  description?: string;
  source: string;
  page: number;
}
```

**Exemplos:**

- Ferramentas de Ladrão: 25 po, 1 lb
- Kit de Curandeiro: 5 po, 3 lb, 10 usos
- Poção de Cura: 50 po, recupera 2d4+2 PV

### 4. **Seletor de Itens Pré-definidos** (`predefined-item-selector.tsx`)

**Componente React com:**

- ✅ 3 tabs (Armas, Armaduras, Equipamentos)
- ✅ Busca global por nome/categoria
- ✅ Lista completa de todos os itens
- ✅ Informações detalhadas (dano, CA, propriedades)
- ✅ Custo e peso exibidos
- ✅ Referência PHB (source + página)
- ✅ Click para selecionar item

---

## ⏳ O que Falta Implementar

### 1. **Integração com item-dialog.tsx**

- [ ] Adicionar tab "Itens do Livro" no dialog
- [ ] Converter item selecionado para formato Item
- [ ] Manter opção de inserção manual

### 2. **Cálculos Automáticos de CA**

- [ ] Detectar armadura equipada
- [ ] Calcular CA baseado na armadura + DEX
- [ ] Adicionar bônus de escudo (+2)
- [ ] Atualizar campo armor_class no banco
- [ ] Atualizar exibição de CA na ficha

**Exemplo de Cálculo:**

```typescript
// Sem armadura: 10 + DEX
// Couro: 11 + DEX
// Cota de Malha: 16 (armadura pesada, sem DEX)
// Com Escudo: +2

// Guerreiro com DES 14 (+2)
// - Sem armadura: 10 + 2 = 12
// - Couro Batido: 12 + 2 = 14
// - Couro Batido + Escudo: 12 + 2 + 2 = 16
// - Cota de Malha: 16
// - Cota de Malha + Escudo: 16 + 2 = 18
```

### 3. **Cálculos Automáticos de Ataque/Dano**

- [ ] Calcular bônus de ataque ao equipar arma
- [ ] Considerar proficiência com a arma
- [ ] Usar STR ou DEX conforme tipo de arma
- [ ] Armas Sutil = melhor entre STR/DEX
- [ ] Armas à distância = DEX
- [ ] Armas corpo a corpo = STR
- [ ] Exibir na lista de inventário

**Exemplo de Cálculo:**

```typescript
// Bônus de Ataque = Mod Atributo + Bônus Proficiência (se proficiente)

// Guerreiro nível 5 (prof +3)
// FOR 16 (+3), DEX 14 (+2)

// Espada Longa (marcial):
// - Proficiente (guerreiro) ✓
// - Corpo a corpo = usa FOR
// - Ataque: +3 (FOR) + +3 (prof) = +6
// - Dano: 1d8 + 3 (FOR)

// Arco Longo (marcial):
// - Proficiente (guerreiro) ✓
// - À distância = usa DEX
// - Ataque: +2 (DEX) + +3 (prof) = +5
// - Dano: 1d8 + 2 (DEX)

// Rapier (marcial, Sutil):
// - Proficiente ✓
// - Sutil = usa melhor (DEX > FOR? DEX : FOR)
// - Ataque: +3 (FOR) + +3 (prof) = +6
// - Dano: 1d8 + 3 (FOR)
```

### 4. **Exibição de Armas Equipadas**

- [ ] Seção "Armas Equipadas" no inventário
- [ ] Mostrar arma 1 (mão principal)
- [ ] Mostrar arma 2 (mão secundária, se aplicável)
- [ ] Exibir bônus calculados
- [ ] Botão de ataque rápido

**Mockup:**

```
⚔️ ARMAS EQUIPADAS

┌─────────────────────────────────────┐
│ 🗡️ MÃO PRINCIPAL: Espada Longa     │
│                                      │
│ Ataque: +6                          │
│ Dano: 1d8+3 cortante               │
│ Versátil (2 mãos): 1d10+3          │
│                                      │
│ [Atacar] [Desequipar]              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🛡️ MÃO SECUNDÁRIA: Escudo          │
│                                      │
│ +2 CA                               │
│                                      │
│ [Desequipar]                        │
└─────────────────────────────────────┘
```

### 5. **Persistência e Sincronização**

- [ ] Salvar CA calculada no banco
- [ ] Salvar dados completos do item no equipment
- [ ] Incluir itemSourceId (referência ao PHB)
- [ ] Sincronizar automaticamente ao equipar/desequipar

---

## 🔧 Arquitetura Proposta

### Schema do Banco (character.equipment)

```typescript
interface StoredItem extends Item {
  // Campos existentes
  id: string;
  name: string;
  quantity: number;
  weight: number;
  value: number;
  category: ItemCategory;
  equipped: boolean;

  // Novos campos
  itemSourceId?: string; // 'longsword', 'chain-mail', etc.
  itemSourceType?: 'weapon' | 'armor' | 'equipment' | 'custom';

  // Propriedades expandidas
  properties?: {
    // Armas
    damage?: string;
    damageType?: string;
    weaponProperties?: string[];
    range?: string;
    calculatedAttackBonus?: number; // Calculado ao equipar
    calculatedDamage?: string; // "1d8+3"

    // Armaduras
    armorClass?: number | string;
    armorType?: 'light' | 'medium' | 'heavy' | 'shield';
    maxDexBonus?: number;
    stealthDisadvantage?: boolean;
    strengthRequirement?: number;
    calculatedAC?: number; // CA final calculada
  };
}
```

### Fluxo de Equipar Item

```
1. Usuário seleciona item do PHB
   ↓
2. Converter para formato Item
   - Incluir itemSourceId
   - Copiar todas as propriedades
   ↓
3. Adicionar ao inventário
   - Salvar no banco
   ↓
4. Usuário clica "Equipar"
   ↓
5. Executar cálculos
   - Se arma: calcular bônus ataque/dano
   - Se armadura: calcular CA
   ↓
6. Atualizar item com valores calculados
   ↓
7. Salvar no banco
   ↓
8. Se armadura: atualizar armor_class do personagem
   ↓
9. Revalidar página para refletir mudanças
```

---

## 📚 Referências PHB

### Armas

- **Lista Completa:** PHB p.149
- **Propriedades:** PHB p.147-148
- **Regras de Ataque:** PHB p.194-195

### Armaduras

- **Lista Completa:** PHB p.145
- **Regras de CA:** PHB p.144-145
- **Proficiência:** PHB p.144

### Equipamentos

- **Lista Completa:** PHB p.150-153
- **Ferramentas:** PHB p.154
- **Kits:** PHB p.151

---

## 🎯 Próximos Passos

### Prioridade Alta

1. ✅ Criar bibliotecas de dados (FEITO)
2. ✅ Criar seletor de itens (FEITO)
3. ⏳ Integrar com dialog existente
4. ⏳ Implementar cálculos automáticos

### Prioridade Média

5. ⏳ Criar seção "Armas Equipadas"
6. ⏳ Atualizar CA automaticamente
7. ⏳ Adicionar validações (proficiência, FOR mínima)

### Prioridade Baixa

8. ⏳ Adicionar tooltips explicativos
9. ⏳ Criar guia de propriedades de armas
10. ⏳ Exportar/importar inventário

---

## 💡 Notas de Implementação

### Cálculo de CA

```typescript
function updateArmorClass(characterId: string) {
  // 1. Buscar armadura equipada
  const equippedArmor = items.find(
    (i) => i.equipped && i.category === 'armor' && i.properties?.armorType !== 'shield'
  );

  // 2. Verificar se tem escudo
  const hasShield = items.some((i) => i.equipped && i.properties?.armorType === 'shield');

  // 3. Buscar armadura no PHB
  const armorData = equippedArmor?.itemSourceId ? getArmorById(equippedArmor.itemSourceId) : null;

  // 4. Calcular CA
  const newAC = calculateArmorClass(armorData, hasShield, dexModifier);

  // 5. Salvar no banco
  await supabase.from('characters').update({ armor_class: newAC }).eq('id', characterId);
}
```

### Cálculo de Ataque

```typescript
function calculateWeaponStats(weapon: Weapon, character: Character) {
  const strMod = calculateModifier(character.attributes.str);
  const dexMod = calculateModifier(character.attributes.dex);
  const profBonus = character.proficiency_bonus;

  // Verificar proficiência
  const isProficient = character.proficiencies.weapons.some(
    (prof) => weapon.category.includes(prof) || prof === 'Todas as Armas'
  );

  // Calcular bônus
  const { bonus, attribute } = calculateAttackBonus(
    weapon,
    strMod,
    dexMod,
    profBonus,
    isProficient
  );

  // Formatar dano
  const damage = formatWeaponDamage(weapon, strMod, dexMod);

  return {
    attackBonus: bonus,
    attribute,
    damage,
    isProficient,
  };
}
```

---

## ✅ Testes Necessários

### Teste 1: Seleção de Item

- [ ] Abrir dialog de adicionar item
- [ ] Ir para tab "Itens do Livro"
- [ ] Buscar "espada"
- [ ] Selecionar "Espada Longa"
- [ ] Verificar que foi adicionada ao inventário

### Teste 2: Equipar Armadura

- [ ] Adicionar "Couro Batido" ao inventário
- [ ] Equipar armadura
- [ ] Verificar que CA foi atualizada para 12 + DEX
- [ ] Adicionar "Escudo"
- [ ] Equipar escudo
- [ ] Verificar que CA aumentou +2

### Teste 3: Equipar Arma

- [ ] Adicionar "Espada Longa" ao inventário
- [ ] Equipar arma
- [ ] Verificar cálculo de ataque (+FOR + prof)
- [ ] Verificar cálculo de dano (1d8 + FOR)
- [ ] Exibir na lista de armas equipadas

---

**Status:** ⚠️ 40% Completo (Bibliotecas criadas, falta integração)
**Próximo:** Integrar seletor com dialog e implementar cálculos
