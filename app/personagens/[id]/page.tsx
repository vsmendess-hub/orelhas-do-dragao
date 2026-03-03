import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Shield,
  Zap,
  Dices,
  Sparkles,
  Wand2,
  Users,
  BookOpen,
  AlertCircle,
  Swords,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateModifier, formatModifier } from '@/lib/data/point-buy';
import { HPManager } from '@/app/components/character/hp-manager';
import { DeleteCharacterDialog } from '@/app/components/character/delete-character-dialog';
import { InventoryManager } from '@/app/components/character/inventory-manager';
import { ClassResourcesManager } from '@/app/components/character/class-resources-manager';
import { DeathSavesManager } from '@/app/components/character/death-saves-manager';
import { ConditionsManager } from '@/app/components/character/conditions-manager';
import { CompanionsManager } from '@/app/components/character/companions-manager';
import { JournalManager } from '@/app/components/character/journal-manager';
import { ConcentrationTracker } from '@/app/components/character/concentration-tracker';
import { XPManager } from '@/app/components/character/xp-manager';
import { MilestoneManager } from '@/app/components/character/milestone-manager';
import { RestManager } from '@/app/components/character/rest-manager';
import { CharacterPortrait } from '@/app/components/character/character-portrait';
import { FeatsManager } from '@/app/components/character/feats-manager';
import { GoalsManager } from '@/app/components/character/goals-manager';
import { MulticlassManager } from '@/app/components/character/multiclass-manager';
import { VariantRulesManager } from '@/app/components/character/variant-rules-manager';
import { OptionalFeaturesManager } from '@/app/components/character/optional-features-manager';
import { CharacterShareManager } from '@/app/components/character/character-share-manager';
import { CharacterImportExport } from '@/app/components/character/character-import-export';
import { generateClassResources, type ClassResource } from '@/lib/data/class-resources';
import type { ClassLevel } from '@/lib/data/multiclass';
import { DEFAULT_VARIANT_RULES, type VariantRulesState } from '@/lib/data/variant-rules';
import { EMPTY_DEATH_SAVES, type DeathSaves } from '@/lib/data/death-saves';
import { EMPTY_CONDITIONS, type Condition } from '@/lib/data/conditions';
import { type Companion } from '@/lib/data/companions';
import { type JournalEntry } from '@/lib/data/journal';
import { type ConcentrationSpell } from '@/lib/data/concentration';
import type { CharacterShare } from '@/lib/data/character-sharing';

const ABILITY_NAMES = {
  str: 'Força',
  dex: 'Destreza',
  con: 'Constituição',
  int: 'Inteligência',
  wis: 'Sabedoria',
  cha: 'Carisma',
} as const;

const ABILITY_ABBREVIATIONS = {
  str: 'FOR',
  dex: 'DES',
  con: 'CON',
  int: 'INT',
  wis: 'SAB',
  cha: 'CAR',
} as const;

interface CharacterSkill {
  name: string;
  attribute: string;
  proficient: boolean;
  expertise: boolean;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CharacterPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Buscar personagem
  const { data: character, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single();

  // Se não encontrou ou erro, retornar 404
  if (error || !character) {
    notFound();
  }

  // Verificar ownership
  if (character.user_id !== user.id) {
    notFound();
  }

  // Calcular modificadores
  const modifiers = {
    str: calculateModifier(character.attributes.str),
    dex: calculateModifier(character.attributes.dex),
    con: calculateModifier(character.attributes.con),
    int: calculateModifier(character.attributes.int),
    wis: calculateModifier(character.attributes.wis),
    cha: calculateModifier(character.attributes.cha),
  };

  // Gerar recursos de classe se não existirem
  const classResources: ClassResource[] =
    character.class_resources || generateClassResources(character.class, character.level);

  // Death saves
  const deathSaves: DeathSaves = character.death_saves || EMPTY_DEATH_SAVES;

  // Conditions
  const characterConditions: Condition[] = character.conditions || EMPTY_CONDITIONS;

  // Companions
  const characterCompanions: Companion[] = character.companions || [];

  // Journal
  const characterJournal: JournalEntry[] = character.journal || [];

  // Concentration
  const concentration: ConcentrationSpell | null = character.concentration || null;

  // Check if character has Constitution save proficiency
  const hasConcentrationProficiency =
    character.proficiencies?.savingThrows?.includes('con') || false;

  // Character Share
  const characterShare: CharacterShare | null = character.character_share || null;

  // Milestones
  const characterMilestones = character.milestones || [];

  // Feats
  const characterFeats = character.feats || [];

  // Goals
  const characterGoals = character.goals || [];

  // Multiclass
  const characterMulticlass: ClassLevel[] = character.multiclass || [
    {
      className: character.class,
      level: character.level,
      hitDie: 'd8',
      subclass: character.archetype,
    },
  ];

  // Variant Rules
  const variantRules: VariantRulesState = character.variant_rules || DEFAULT_VARIANT_RULES;

  // Optional Features
  const optionalFeatures = character.optional_features || [];

  // Count active features
  const activeConditionsCount = characterConditions.filter((c) => c.active).length;
  const activeCompanionsCount = characterCompanions.filter((c) => c.active).length;
  const hasClassResources = classResources.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/personagens/${id}/combate`}>
                <Swords className="mr-2 h-4 w-4" />
                Combate
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/personagens/${id}/dados`}>
                <Dices className="mr-2 h-4 w-4" />
                Dados
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/personagens/${id}/magias`}>
                <Wand2 className="mr-2 h-4 w-4" />
                Magias
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/personagens/${id}/personalizar`}>
                <Sparkles className="mr-2 h-4 w-4" />
                Personalizar
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/personagens/${id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <DeleteCharacterDialog characterId={id} characterName={character.name} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Character Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            {/* Character Portrait */}
            <CharacterPortrait
              name={character.name}
              avatarUrl={character.avatar_url}
              size="xl"
              className="flex-shrink-0"
            />

            {/* Character Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold">{character.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {character.race}
                {character.subrace && ` (${character.subrace})`} • {character.class}
                {character.archetype && ` - ${character.archetype}`}
              </p>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="rounded-md bg-deep-purple/10 px-2 py-1 font-medium text-deep-purple">
                  Nível {character.level}
                </span>
                <span className="text-muted-foreground">{character.alignment}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Combat Stats */}
          <div className="space-y-6 lg:col-span-2">
            {/* Combat Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              {/* HP Manager - Ocupa 2 colunas */}
              <div className="md:col-span-2">
                <HPManager characterId={id} hitPoints={character.hit_points} />
              </div>

              {/* Outros stats - 1 coluna cada */}
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Shield className="h-4 w-4" />
                    Classe de Armadura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{character.armor_class}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Zap className="h-4 w-4" />
                    Iniciativa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{formatModifier(character.initiative)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Segunda linha com proficiency bonus centralizado */}
            <div className="grid gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Dices className="h-4 w-4" />
                    Bônus Proficiência
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">+{character.proficiency_bonus}</p>
                </CardContent>
              </Card>
            </div>

            {/* Attributes */}
            <Card>
              <CardHeader>
                <CardTitle>Atributos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {(Object.keys(character.attributes) as Array<keyof typeof modifiers>).map(
                    (attr) => (
                      <div key={attr} className="rounded-lg border bg-muted/50 p-4 text-center">
                        <p className="text-xs font-medium text-muted-foreground">
                          {ABILITY_NAMES[attr]}
                        </p>
                        <p className="mt-2 text-3xl font-bold">{character.attributes[attr]}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatModifier(modifiers[attr])}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Perícias</CardTitle>
                <CardDescription>
                  Proficiências e bônus aplicados ({character.skills.length} perícias)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  {character.skills.map((skill: CharacterSkill, index: number) => {
                    const attrMod = modifiers[skill.attribute as keyof typeof modifiers] || 0;
                    const bonus = attrMod + character.proficiency_bonus;

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border bg-card p-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-deep-purple/10 text-xs font-medium text-deep-purple">
                            ✓
                          </div>
                          <div>
                            <p className="text-sm font-medium">{skill.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {
                                ABILITY_ABBREVIATIONS[
                                  skill.attribute as keyof typeof ABILITY_ABBREVIATIONS
                                ]
                              }
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold">{formatModifier(bonus)}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Speed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deslocamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{character.speed} pés</p>
                <p className="text-xs text-muted-foreground">por turno</p>
              </CardContent>
            </Card>

            {/* XP Manager */}
            <XPManager
              characterId={id}
              characterName={character.name}
              characterClass={character.class}
              currentXP={character.experience_points}
              currentLevel={character.level}
              currentHP={character.hit_points}
              currentAttributes={character.attributes}
            />

            {/* Milestone Manager */}
            <MilestoneManager
              characterId={id}
              characterName={character.name}
              characterClass={character.class}
              currentLevel={character.level}
              currentHP={character.hit_points}
              currentAttributes={character.attributes}
              initialMilestones={characterMilestones}
            />

            {/* Inspiration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inspiração</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {character.inspiration ? '⭐ Ativo' : '○ Inativo'}
                </p>
              </CardContent>
            </Card>

            {/* Proficiencies */}
            {character.proficiencies && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Proficiências</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {character.proficiencies.weapons?.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Armas</p>
                      <p className="text-sm">{character.proficiencies.weapons.join(', ')}</p>
                    </div>
                  )}
                  {character.proficiencies.armor?.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Armaduras</p>
                      <p className="text-sm">{character.proficiencies.armor.join(', ')}</p>
                    </div>
                  )}
                  {character.proficiencies.tools?.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Ferramentas</p>
                      <p className="text-sm">{character.proficiencies.tools.join(', ')}</p>
                    </div>
                  )}
                  {character.proficiencies.languages?.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Idiomas</p>
                      <p className="text-sm">{character.proficiencies.languages.join(', ')}</p>
                    </div>
                  )}
                  {(!character.proficiencies.weapons ||
                    character.proficiencies.weapons.length === 0) &&
                    (!character.proficiencies.armor ||
                      character.proficiencies.armor.length === 0) &&
                    (!character.proficiencies.tools ||
                      character.proficiencies.tools.length === 0) &&
                    (!character.proficiencies.languages ||
                      character.proficiencies.languages.length === 0) && (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma proficiência adicional
                      </p>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {character.features && character.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Características</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {character.features.map((feature: string, index: number) => (
                      <div key={index} className="rounded-md bg-muted/50 p-2 text-sm">
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Combat Section */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Combate</h2>
            <p className="mt-1 text-muted-foreground">Recursos e ferramentas para combate</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Combat Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Swords className="h-5 w-5 text-red-600" />
                  Ferramentas de Combate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full" size="lg">
                  <Link href={`/personagens/${id}/combate`}>
                    <Swords className="mr-2 h-5 w-5" />
                    Abrir Gerenciador de Combate
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-md border bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Iniciativa</p>
                    <p className="mt-1 text-xl font-bold">{formatModifier(modifiers.dex)}</p>
                  </div>
                  <div className="rounded-md border bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">Velocidade</p>
                    <p className="mt-1 text-xl font-bold">{character.speed} pés</p>
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">💡 Recursos de Combate:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Initiative Tracker - Rastreie ordem de turnos</li>
                    <li>• Quick Actions - Ações rápidas de combate</li>
                    <li>• HP temporário já integrado no HP Manager</li>
                    {concentration && <li>• Concentração ativa em magia</li>}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Concentration Tracker (if active) */}
            <ConcentrationTracker
              characterId={id}
              concentration={concentration}
              constitutionModifier={modifiers.con}
              proficiencyBonus={character.proficiency_bonus}
              hasConcentrationProficiency={hasConcentrationProficiency}
            />
          </div>
        </div>

        {/* Features Extras Section */}
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recursos Avançados</h2>
            {/* Quick Stats */}
            <div className="flex gap-4 text-sm text-muted-foreground">
              {hasClassResources && (
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  <span>Recursos</span>
                </div>
              )}
              {activeConditionsCount > 0 && (
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span>{activeConditionsCount} condições</span>
                </div>
              )}
              {activeCompanionsCount > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{activeCompanionsCount} ativos</span>
                </div>
              )}
              {characterJournal.length > 0 && (
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{characterJournal.length} entradas</span>
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Rest Manager */}
            <RestManager
              characterId={id}
              characterClass={character.class}
              characterLevel={character.level}
              constitutionModifier={modifiers.con}
              currentHP={character.hit_points.current}
              maxHP={character.hit_points.max}
              hitDiceUsed={character.hit_dice_used || 0}
              spellSlots={character.spell_slots || []}
              classResources={classResources}
              deathSaves={deathSaves}
            />

            {/* Death Saves - Only show if HP is 0 */}
            {character.hit_points.current === 0 && (
              <div className="lg:col-span-2">
                <DeathSavesManager
                  characterId={id}
                  currentHP={character.hit_points.current}
                  initialDeathSaves={deathSaves}
                />
              </div>
            )}

            {/* Class Resources */}
            <ClassResourcesManager characterId={id} initialResources={classResources} />

            {/* Multiclass */}
            <MulticlassManager
              characterId={id}
              initialClasses={characterMulticlass}
              attributes={character.attributes}
            />

            {/* Feats */}
            <FeatsManager
              characterId={id}
              characterClass={character.class}
              currentLevel={character.level}
              initialFeats={characterFeats}
            />

            {/* Optional Features */}
            <OptionalFeaturesManager
              characterId={id}
              characterClass={character.class}
              characterLevel={character.level}
              initialFeatures={optionalFeatures}
            />

            {/* Character Sharing */}
            <CharacterShareManager
              characterId={id}
              characterName={character.name}
              ownerId={user.id}
              ownerName={user.email || 'Jogador'}
              initialShare={characterShare}
            />

            {/* Import/Export */}
            <CharacterImportExport
              characterId={id}
              character={character}
              userId={user.id}
              onImportSuccess={() => window.location.reload()}
            />

            {/* Conditions */}
            <ConditionsManager characterId={id} initialConditions={characterConditions} />

            {/* Companions */}
            <div className="lg:col-span-2">
              <CompanionsManager characterId={id} initialCompanions={characterCompanions} />
            </div>

            {/* Journal */}
            <div className="lg:col-span-2">
              <JournalManager characterId={id} initialEntries={characterJournal} />
            </div>

            {/* Goals */}
            <div className="lg:col-span-2">
              <GoalsManager characterId={id} initialGoals={characterGoals} />
            </div>

            {/* Variant Rules */}
            <div className="lg:col-span-2">
              <VariantRulesManager characterId={id} initialRules={variantRules} />
            </div>
          </div>
        </div>

        {/* Inventário */}
        <div className="mt-8">
          <InventoryManager
            characterId={id}
            initialItems={character.equipment || []}
            initialCurrency={
              character.currency || {
                copper: 0,
                silver: 0,
                electrum: 0,
                gold: 0,
                platinum: 0,
              }
            }
            strengthScore={character.attributes.str}
            dexModifier={modifiers.dex}
          />
        </div>
      </main>
    </div>
  );
}
