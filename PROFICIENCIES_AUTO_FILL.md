# 🎯 Sistema de Proficiências Automáticas

**Data:** 9 de Março de 2026
**Versão:** v2.1.0

---

## 🎯 Objetivo

Implementar o preenchimento automático de todas as proficiências do personagem com base em:

- **Raça** (ex: Humano, Elfo, Anão)
- **Sub-raça** (ex: Alto Elfo, Elfo da Floresta, Drow)
- **Classe** (ex: Guerreiro, Mago, Clérigo)
- **Domínio** (para Clérigos - ex: Guerra, Vida, Luz)
- **Background** (ex: Acólito, Soldado, Criminoso)

Cada personagem terá automaticamente calculadas suas proficiências em:

- ⚔️ **Armas** (weapons)
- 🛡️ **Armaduras** (armor)
- 🔧 **Ferramentas** (tools)
- 🌍 **Idiomas** (languages)
- 💪 **Testes de Resistência** (saving throws)
- 🎯 **Perícias** (skills)

---

## 📁 Arquivo Criado

### `/lib/data/proficiencies.ts`

Biblioteca completa de proficiências por raça, classe, domínio e background.

**Estrutura:**

```typescript
interface Proficiencies {
  weapons: string[];
  armor: string[];
  tools: string[];
  languages: string[];
  savingThrows?: string[]; // Apenas classes
  skills?: string[]; // Algumas raças, classes e backgrounds
}
```

---

## 📚 Conteúdo Implementado

### 1. **Proficiências por Raça (9 raças + sub-raças)**

#### Humano

- Idiomas: Comum + 1 à escolha

#### Elfo (+ Alto Elfo, Elfo da Floresta, Drow)

- **Base:** Perícia em Percepção, idiomas Comum e Élfico
- **Alto Elfo:** Armas (Espada Longa, Espada Curta, Arcos), +1 idioma
- **Elfo da Floresta:** Armas (Espada Longa, Espada Curta, Arcos)
- **Drow:** Armas (Rapier, Espada Curta, Besta de Mão)

#### Anão (+ Anão da Montanha, Anão da Colina)

- **Base:** Armas (Machados, Martelos), Ferramentas de Artesão, idiomas Comum e Anão
- **Anão da Montanha:** Armaduras (Leves, Médias)

#### Halfling (+ Pés-Leves, Robusto)

- Idiomas: Comum, Halfling

#### Draconato

- Idiomas: Comum, Dracônico

#### Gnomo (+ Gnomo da Floresta, Gnomo das Rochas)

- **Base:** Idiomas Comum e Gnômico
- **Gnomo das Rochas:** Ferramentas de Engenhoqueiro

#### Meio-Elfo

- Idiomas: Comum, Élfico, +1 à escolha
- Perícias: 2 à escolha (Versatilidade de Perícia)

#### Meio-Orc

- Idiomas: Comum, Orc
- Perícias: Intimidação

#### Tiefling

- Idiomas: Comum, Infernal

---

### 2. **Proficiências por Classe (12 classes)**

#### Bárbaro

- **Armas:** Simples, Marciais
- **Armaduras:** Leves, Médias, Escudos
- **Testes de Resistência:** Força, Constituição
- **Perícias:** Escolha 2 (Adestrar Animais, Atletismo, Intimidação, Natureza, Percepção, Sobrevivência)

#### Bardo

- **Armas:** Simples, Bestas de Mão, Espadas Longas, Rapieres, Espadas Curtas
- **Armaduras:** Leves
- **Ferramentas:** 3 instrumentos musicais
- **Testes de Resistência:** Destreza, Carisma
- **Perícias:** Escolha 3 quaisquer

#### Bruxo

- **Armas:** Simples
- **Armaduras:** Leves
- **Testes de Resistência:** Sabedoria, Carisma
- **Perícias:** Escolha 2 (Arcanismo, Enganação, História, Intimidação, Investigação, Natureza, Religião)

#### Clérigo

- **Armas:** Simples
- **Armaduras:** Leves, Médias, Escudos
- **Testes de Resistência:** Sabedoria, Carisma
- **Perícias:** Escolha 2 (História, Intuição, Medicina, Persuasão, Religião)
- **+ Domínios** (veja seção específica)

#### Druida

- **Armas:** Clavas, Adagas, Dardos, Azagaias, Maças, Bordões, Cimitarras, Foices, Fundas, Lanças
- **Armaduras:** Leves, Médias, Escudos (sem metal)
- **Ferramentas:** Kit de Herbalismo
- **Idiomas:** Druídico
- **Testes de Resistência:** Inteligência, Sabedoria
- **Perícias:** Escolha 2 (Arcanismo, Adestrar Animais, Intuição, Medicina, Natureza, Percepção, Religião, Sobrevivência)

#### Feiticeiro

- **Armas:** Adagas, Dardos, Fundas, Bordões, Bestas Leves
- **Testes de Resistência:** Constituição, Carisma
- **Perícias:** Escolha 2 (Arcanismo, Enganação, Intuição, Intimidação, Persuasão, Religião)

#### Guerreiro

- **Armas:** Simples, Marciais
- **Armaduras:** Todas, Escudos
- **Testes de Resistência:** Força, Constituição
- **Perícias:** Escolha 2 (Acrobacia, Adestrar Animais, Atletismo, História, Intuição, Intimidação, Percepção, Sobrevivência)

#### Ladino

- **Armas:** Simples, Bestas de Mão, Espadas Longas, Rapieres, Espadas Curtas
- **Armaduras:** Leves
- **Ferramentas:** Ferramentas de Ladrão
- **Testes de Resistência:** Destreza, Inteligência
- **Perícias:** Escolha 4 (Acrobacia, Atletismo, Atuação, Enganação, Furtividade, Intimidação, Intuição, Investigação, Percepção, Persuasão, Prestidigitação)

#### Mago

- **Armas:** Adagas, Dardos, Fundas, Bordões, Bestas Leves
- **Testes de Resistência:** Inteligência, Sabedoria
- **Perícias:** Escolha 2 (Arcanismo, História, Intuição, Investigação, Medicina, Religião)

#### Monge

- **Armas:** Simples, Espadas Curtas
- **Ferramentas:** 1 ferramenta de artesão ou instrumento musical
- **Testes de Resistência:** Força, Destreza
- **Perícias:** Escolha 2 (Acrobacia, Atletismo, Furtividade, História, Intuição, Religião)

#### Paladino

- **Armas:** Simples, Marciais
- **Armaduras:** Todas, Escudos
- **Testes de Resistência:** Sabedoria, Carisma
- **Perícias:** Escolha 2 (Atletismo, Intuição, Intimidação, Medicina, Persuasão, Religião)

#### Patrulheiro

- **Armas:** Simples, Marciais
- **Armaduras:** Leves, Médias, Escudos
- **Testes de Resistência:** Força, Destreza
- **Perícias:** Escolha 3 (Adestrar Animais, Atletismo, Furtividade, Intuição, Investigação, Natureza, Percepção, Sobrevivência)

---

### 3. **Proficiências por Domínio (Clérigo)**

#### Conhecimento

- **Idiomas:** 2 à escolha
- **Perícias:** Escolha 2 (Arcanismo, História, Natureza, Religião) com DOBRO do bônus de proficiência

#### Enganação

- **Ferramentas:** Kit de Disfarce, Kit de Envenenador

#### Guerra

- **Armas:** Marciais
- **Armaduras:** Pesadas

#### Luz

- Sem proficiências adicionais

#### Natureza

- **Armaduras:** Pesadas
- **Perícias:** Escolha 1 (Adestrar Animais, Natureza, Sobrevivência) com DOBRO do bônus

#### Tempestade

- **Armas:** Marciais
- **Armaduras:** Pesadas

#### Vida

- **Armaduras:** Pesadas

---

### 4. **Proficiências por Background (13 backgrounds)**

#### Acólito

- **Idiomas:** 2 à escolha
- **Perícias:** Intuição, Religião

#### Artesão de Guilda

- **Ferramentas:** 1 tipo de ferramentas de artesão
- **Idiomas:** 1 à escolha
- **Perícias:** Intuição, Persuasão

#### Artista

- **Ferramentas:** Kit de Disfarce, 1 instrumento musical
- **Perícias:** Acrobacia, Atuação

#### Charlatão

- **Ferramentas:** Kit de Disfarce, Kit de Falsificação
- **Perícias:** Enganação, Prestidigitação

#### Criminoso

- **Ferramentas:** 1 kit de jogo, Ferramentas de Ladrão
- **Perícias:** Enganação, Furtividade

#### Eremita

- **Ferramentas:** Kit de Herbalismo
- **Idiomas:** 1 à escolha
- **Perícias:** Medicina, Religião

#### Forasteiro

- **Ferramentas:** 1 instrumento musical
- **Idiomas:** 1 à escolha
- **Perícias:** Atletismo, Sobrevivência

#### Herói do Povo

- **Ferramentas:** 1 ferramenta de artesão, Veículos (terrestres)
- **Perícias:** Adestrar Animais, Sobrevivência

#### Marinheiro

- **Ferramentas:** Ferramentas de Navegador, Veículos (aquáticos)
- **Perícias:** Atletismo, Percepção

#### Nobre

- **Ferramentas:** 1 kit de jogo
- **Idiomas:** 1 à escolha
- **Perícias:** História, Persuasão

#### Sábio

- **Idiomas:** 2 à escolha
- **Perícias:** Arcanismo, História

#### Soldado

- **Ferramentas:** 1 kit de jogo, Veículos (terrestres)
- **Perícias:** Atletismo, Intimidação

#### Órfão

- **Ferramentas:** Kit de Disfarce, Ferramentas de Ladrão
- **Perícias:** Furtividade, Prestidigitação

---

## 🔧 Como Funciona

### 1. Sistema de Combinação

```typescript
const characterProficiencies = getAllProficiencies(
  character.race, // Ex: 'Elfo'
  character.subrace, // Ex: 'Alto Elfo'
  character.class, // Ex: 'Guerreiro'
  backgroundName, // Ex: 'Soldado'
  domain // Ex: 'Guerra' (apenas para Clérigo)
);
```

### 2. Busca Automática

O sistema busca automaticamente:

1. **Proficiências da Raça Base** (ex: Elfo)
2. **Proficiências da Sub-raça** (ex: Alto Elfo)
3. **Proficiências da Classe** (ex: Guerreiro)
4. **Proficiências do Domínio** (se Clérigo)
5. **Proficiências do Background** (ex: Soldado)

### 3. Remove Duplicatas

Automaticamente remove proficiências duplicadas, garantindo que cada item apareça apenas uma vez.

---

## 🎨 Visualização

### Na Ficha do Personagem:

```
📋 Proficiências
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💪 TESTES DE RESISTÊNCIA
   Força, Constituição

🎯 PERÍCIAS
   Atletismo, Intimidação, Percepção (da raça), Intuição (do background)

⚔️ ARMAS
   Armas Simples, Armas Marciais, Espada Longa (da sub-raça)

🛡️ ARMADURAS
   Todas as Armaduras, Escudos, Armaduras Pesadas (do domínio)

🔧 FERRAMENTAS
   1 kit de jogo (do background)

🌍 IDIOMAS
   Comum, Élfico, 1 à escolha (sub-raça), 1 à escolha (background)
```

---

## 📊 Exemplo Completo

### Elfo Alto, Guerreiro, Domínio N/A, Background Soldado

**Proficiências Totais:**

**Testes de Resistência:** (Classe)

- Força
- Constituição

**Perícias:** (Combinação)

- Percepção (Elfo)
- Atletismo, Intimidação (Guerreiro - escolha 2)
- Atletismo, Intimidação (Soldado)

**Armas:** (Combinação)

- Armas Simples (Guerreiro)
- Armas Marciais (Guerreiro)
- Espada Longa, Espada Curta, Arco Longo, Arco Curto (Alto Elfo)

**Armaduras:** (Combinação)

- Todas as Armaduras (Guerreiro)
- Escudos (Guerreiro)

**Ferramentas:** (Background)

- 1 kit de jogo (Soldado)
- Veículos (terrestres) (Soldado)

**Idiomas:** (Combinação)

- Comum (Elfo)
- Élfico (Elfo)
- 1 idioma à escolha (Alto Elfo)

---

## ✅ Benefícios

### Para Jogadores

- ✨ **Automático**: Todas as proficiências preenchidas automaticamente
- 📖 **Completo**: Inclui raça, classe, domínio e background
- 🎯 **Organizado**: Separado por categoria com cores
- ✅ **Sem duplicatas**: Remove automaticamente entradas repetidas

### Para Mestres

- ⚡ **Rápido**: Criação de NPCs instantânea
- ✅ **Correto**: Baseado 100% no PHB
- 🔍 **Fácil verificação**: Tudo em um só lugar

### Para o Sistema

- 🔄 **Escalável**: Fácil adicionar novos backgrounds
- 🧩 **Modular**: Sistema independente e reutilizável
- 🎯 **Type-safe**: TypeScript garante consistência

---

## 🚀 Futuras Expansões

### Backgrounds Adicionais

- [ ] Marinheiro (Pirata)
- [ ] Agente de Facção
- [ ] Infiltrado
- [ ] Cavaleiro da Ordem
- [ ] Mercenário Veterano
- [ ] Antropólogo (ToA)
- [ ] Arqueólogo (ToA)

### Proficiências de Feats

- [ ] Integrar com sistema de Feats
- [ ] Adicionar proficiências de feats automaticamente
- [ ] Ex: Heavily Armored feat adiciona proficiência em armaduras pesadas

---

## 📖 Referências

### Player's Handbook (PHB)

- **Raças:** Páginas 17-44
- **Classes:** Páginas 45-118
- **Backgrounds:** Páginas 125-141
- **Domínios de Clérigo:** Páginas 58-64

### Sistema Implementado

- 100% baseado no PHB oficial
- TypeScript para type safety
- Sistema modular e extensível

---

## 🎓 Testando

### Teste Manual

1. Crie ou edite um personagem
2. Selecione raça, sub-raça, classe e background
3. Veja a ficha do personagem
4. Verifique a seção "Proficiências"
5. Confirme que todas as proficiências aparecem automaticamente

### Teste de Integração

```typescript
const profs = getAllProficiencies('Elfo', 'Alto Elfo', 'Guerreiro', 'Soldado', null);

console.log(profs);
// Deve incluir:
// - Armas: Simples, Marciais, Espadas élficas, Arcos
// - Armaduras: Todas + Escudos
// - Ferramentas: Kit de jogo, Veículos
// - Idiomas: Comum, Élfico, +1 à escolha
// - Testes: Força, Constituição
// - Perícias: Percepção, Atletismo, Intimidação
```

---

**Desenvolvido por:** Claude Opus 4.6
**Integrado com:** Orelhas do Dragão v2.1.0
**Build:** ✓ Compilado com sucesso
