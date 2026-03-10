# 🛡️ Testes de Resistência e Percepção Passiva

**Data:** 9 de Março de 2026
**Versão:** v2.1.0

---

## 🎯 Objetivo

Implementar o cálculo automático e visualização de:

1. **Testes de Resistência (Saving Throws)** - 6 testes, um para cada atributo
2. **Percepção Passiva (Passive Perception)** - Detecção automática de ameaças

Ambos calculados automaticamente baseados no **Player's Handbook (PHB)**.

---

## 🛡️ Testes de Resistência

### Como Funciona (PHB p.179)

**Fórmula:**

```
Teste de Resistência = Modificador do Atributo + Bônus de Proficiência (se proficiente)
```

**Proficiências:**

- Cada classe tem proficiência em **2 testes de resistência**
- Exemplo: Guerreiro é proficiente em Força e Constituição

**Exemplo de Cálculo:**

- Guerreiro nível 5 (proficiência +3)
- Força 16 (+3 modificador)
- **Salvaguarda de Força:** +3 (mod) + +3 (prof) = **+6**
- **Salvaguarda de Destreza (sem prof):** apenas +1 (mod) = **+1**

### Proficiências por Classe

| Classe      | Teste 1      | Teste 2      |
| ----------- | ------------ | ------------ |
| Bárbaro     | Força        | Constituição |
| Bardo       | Destreza     | Carisma      |
| Bruxo       | Sabedoria    | Carisma      |
| Clérigo     | Sabedoria    | Carisma      |
| Druida      | Inteligência | Sabedoria    |
| Feiticeiro  | Constituição | Carisma      |
| Guerreiro   | Força        | Constituição |
| Ladino      | Destreza     | Inteligência |
| Mago        | Inteligência | Sabedoria    |
| Monge       | Força        | Destreza     |
| Paladino    | Sabedoria    | Carisma      |
| Patrulheiro | Força        | Destreza     |

### Quando Usar (PHB p.179-181)

**Teste de Resistência de Força:**

- Resistir a ser empurrado, puxado ou derrubado
- Evitar ser agarrado ou contido fisicamente

**Teste de Resistência de Destreza:**

- Esquivar de magias de área (Bola de Fogo, Relâmpago)
- Evitar armadilhas (flechas, redes, buracos)

**Teste de Resistência de Constituição:**

- Resistir a venenos e doenças
- Manter concentração em magias quando recebe dano
- Suportar ambientes extremos

**Teste de Resistência de Inteligência:**

- Resistir a ilusões e manipulação mental
- Identificar magias de Ilusão

**Teste de Resistência de Sabedoria:**

- Resistir a encantamentos (Enfeitiçar Pessoa, Sugestão)
- Evitar medo mágico
- Perceber ilusões

**Teste de Resistência de Carisma:**

- Resistir a banimento ou possessão
- Evitar ser teleportado contra sua vontade

---

## 👁️ Percepção Passiva

### Como Funciona (PHB p.177-178)

**Fórmula:**

```
Percepção Passiva = 10 + Modificador de Sabedoria + Bônus de Proficiência (se proficiente)
```

**Vantagem/Desvantagem:**

- Com vantagem: +5
- Com desvantagem: -5

**Exemplo de Cálculo:**

- Sabedoria 14 (+2 modificador)
- Proficiente em Percepção (+3 proficiência, nível 5)
- **Percepção Passiva:** 10 + 2 + 3 = **15**

### Quando o Mestre Usa (PHB p.177)

**O Mestre compara a Percepção Passiva contra:**

1. **CD de Furtividade** de criaturas escondidas
   - Se PP ≥ CD de Furtividade → você percebe a criatura
   - Se PP < CD de Furtividade → você não percebe

2. **Portas e passagens secretas**
   - PP 15+ geralmente detecta portas secretas óbvias
   - PP 20+ detecta as muito bem escondidas

3. **Emboscadas**
   - Inimigos fazem teste de Furtividade
   - Compare contra sua PP

4. **Objetos escondidos**
   - Armadilhas, alçapões, tesouros ocultos

**Importante:** O jogador **não precisa declarar** que está procurando. A PP está sempre "ligada"!

### Raças com Bônus Especiais

**Elfo (Sentidos Aguçados):**

- Proficiência automática em Percepção
- PP base mais alta que outras raças

**Meio-Orc:**

- Proficiência automática em Intimidação (não afeta PP)

---

## 🎨 Visualização na Ficha

### Testes de Resistência

```
🛡️ TESTES DE RESISTÊNCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────┬────────────┐
│ ✓ FOR      │    DES     │
│ Força      │ Destreza   │
│    +6      │    +1      │
│ +3 + 3     │            │
└────────────┴────────────┘

┌────────────┬────────────┐
│ ✓ CON      │    INT     │
│ Constitui. │ Inteligên. │
│    +5      │    +0      │
│ +2 + 3     │            │
└────────────┴────────────┘

┌────────────┬────────────┐
│    SAB     │    CAR     │
│ Sabedoria  │ Carisma    │
│    +2      │    -1      │
│            │            │
└────────────┴────────────┘

ℹ️ Testes marcados com ✓ adicionam
   o bônus de proficiência (+3).
```

**Destaque Visual:**

- Testes proficientes: Borda azul brilhante + ícone ✓
- Testes não proficientes: Borda simples
- Cor azul para valores proficientes
- Breakdown do cálculo exibido

### Percepção Passiva

```
👁️ PERCEPÇÃO PASSIVA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        ┌─────────┐
        │   👁️   │
        └─────────┘

           15

        10 (base)
        +2 (Sabedoria)
        +3 (proficiência)

ℹ️ A Percepção Passiva representa o quão
   alerta você está do ambiente sem precisar
   fazer um teste.
```

**Destaque Visual:**

- Número grande e destacado
- Cor esmeralda (verde)
- Breakdown do cálculo
- Explicação de como funciona
- Dica se não for proficiente

---

## 📊 Exemplos por Classe

### Exemplo 1: Guerreiro Nível 5

**Atributos:**

- FOR 16 (+3), DES 14 (+2), CON 15 (+2)
- INT 10 (+0), WIS 12 (+1), CHA 8 (-1)
- Proficiência: +3

**Testes de Resistência:**

- ✅ **Força:** +3 + 3 = **+6** (proficiente)
- **Destreza:** +2 = **+2**
- ✅ **Constituição:** +2 + 3 = **+5** (proficiente)
- **Inteligência:** +0 = **+0**
- **Sabedoria:** +1 = **+1**
- **Carisma:** -1 = **-1**

**Percepção Passiva:**

- Não proficiente em Percepção
- 10 + 1 = **11**

### Exemplo 2: Ladino Elfo Nível 5

**Atributos:**

- FOR 10 (+0), DES 18 (+4), CON 12 (+1)
- INT 14 (+2), WIS 13 (+1), CHA 10 (+0)
- Proficiência: +3

**Testes de Resistência:**

- **Força:** +0 = **+0**
- ✅ **Destreza:** +4 + 3 = **+7** (proficiente)
- **Constituição:** +1 = **+1**
- ✅ **Inteligência:** +2 + 3 = **+5** (proficiente)
- **Sabedoria:** +1 = **+1**
- **Carisma:** +0 = **+0**

**Percepção Passiva:**

- ✅ Proficiente (racial)
- 10 + 1 + 3 = **14**

### Exemplo 3: Clérigo Nível 10

**Atributos:**

- FOR 12 (+1), DES 10 (+0), CON 14 (+2)
- INT 13 (+1), WIS 18 (+4), CHA 16 (+3)
- Proficiência: +4

**Testes de Resistência:**

- **Força:** +1 = **+1**
- **Destreza:** +0 = **+0**
- **Constituição:** +2 = **+2**
- **Inteligência:** +1 = **+1**
- ✅ **Sabedoria:** +4 + 4 = **+8** (proficiente)
- ✅ **Carisma:** +3 + 4 = **+7** (proficiente)

**Percepção Passiva:**

- ✅ Proficiente em Percepção
- 10 + 4 + 4 = **18**

---

## 🔧 Implementação Técnica

### Componentes Criados

#### 1. `saving-throws.tsx`

```typescript
<SavingThrows
  modifiers={modifiers}
  proficiencyBonus={character.proficiency_bonus}
  savingThrowProficiencies={characterProficiencies.savingThrows}
/>
```

**Props:**

- `modifiers`: Modificadores de atributos calculados
- `proficiencyBonus`: Bônus de proficiência do nível
- `savingThrowProficiencies`: Array com nomes dos atributos proficientes

**Recursos:**

- Cálculo automático para todos os 6 atributos
- Destaque visual para proficiências
- Breakdown do cálculo (mod + prof)
- Tooltip explicativo

#### 2. `passive-perception.tsx`

```typescript
<PassivePerception
  wisdomModifier={modifiers.wis}
  proficiencyBonus={character.proficiency_bonus}
  isProficientInPerception={isProficientInPerception}
/>
```

**Props:**

- `wisdomModifier`: Modificador de Sabedoria
- `proficiencyBonus`: Bônus de proficiência
- `isProficientInPerception`: Boolean se é proficiente

**Recursos:**

- Cálculo automático (10 + WIS + prof)
- Breakdown visual do cálculo
- Explicação de uso
- Dica se não for proficiente

---

## ✅ Benefícios

### Para Jogadores

- ✨ **Automático**: Calculado automaticamente
- 🎯 **Visual**: Fácil identificar proficiências
- 📖 **Educativo**: Explica como funciona
- ⚡ **Rápido**: Não precisa calcular manualmente

### Para Mestres

- 🎲 **Confiável**: Sempre correto
- 👀 **Transparente**: Pode ver o breakdown
- ⏱️ **Eficiente**: Economia de tempo na mesa

### Para o Sistema

- 🔄 **Integrado**: Usa proficiências já implementadas
- 🧩 **Modular**: Componentes reutilizáveis
- 🎯 **Preciso**: Baseado exatamente no PHB

---

## 📖 Referências PHB

### Testes de Resistência

- **Regras Gerais:** PHB p.179
- **Quando Usar:** PHB p.179-181
- **CD de Salvaguarda:** PHB p.179
- **Proficiências:** Cada descrição de classe

### Percepção Passiva

- **Regras:** PHB p.177-178
- **Perícia Percepção:** PHB p.178
- **Sentidos Aguçados (Elfo):** PHB p.23
- **Usando Percepção Passiva:** DMG p.238-239

### Fórmulas Oficiais

```
Saving Throw = d20 + Ability Modifier + Proficiency Bonus (if proficient)

Passive Perception = 10 + Wisdom Modifier + Proficiency Bonus (if proficient)
  + 5 (if advantage)
  - 5 (if disadvantage)
```

---

## 🎮 Como Usar na Mesa

### Para o Jogador

**Testes de Resistência:**

1. Mestre pede um teste de resistência
2. Role 1d20
3. Some o bônus correspondente da sua ficha
4. Proficiências são marcadas com ✓ (mais fácil!)

**Percepção Passiva:**

1. Não faça nada! Está sempre ativa
2. Mestre compara com CDs secretamente
3. Se sua PP for alta o suficiente, você percebe

### Para o Mestre

**Usando Testes de Resistência:**

```
"Todos façam um teste de resistência de Destreza CD 15"
Jogadores rolam d20 + seus bônus de DES
```

**Usando Percepção Passiva:**

```
Goblin escondido (Furtividade 13)
vs
Ranger (PP 16) → Percebe!
Fighter (PP 9) → Não percebe
```

---

## 🧪 Testando

### Teste Manual

1. Crie um personagem ou abra um existente
2. Veja a coluna da direita
3. Verifique "Testes de Resistência"
   - Deve ter 6 testes (todos os atributos)
   - 2 devem ter ✓ (proficiências da classe)
4. Verifique "Percepção Passiva"
   - Deve mostrar número grande
   - Breakdown do cálculo

### Validação

- ✅ Guerreiro deve ter ✓ em FOR e CON
- ✅ Mago deve ter ✓ em INT e SAB
- ✅ Elfo deve ter PP mais alta (proficiente)
- ✅ Valores devem mudar com nível (proficiência)

---

## 📊 Estatísticas

**Implementado:**

- ✅ 6 testes de resistência calculados
- ✅ 12 classes com proficiências corretas
- ✅ Percepção passiva automática
- ✅ Integração com sistema de perícias
- ✅ Visual melhorado com destaque

**Build:** ✓ Compilado com sucesso em 4.9s

---

**Desenvolvido por:** Claude Opus 4.6
**Integrado com:** Orelhas do Dragão v2.1.0
**Baseado em:** D&D 5e Player's Handbook (2014)
