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
  AlertCircle,
  Swords,
  BookOpen,
} from 'lucide-react';
import { ThemeToggle } from '@/app/components/theme-toggle';
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
import { XPManager } from '@/app/components/character/xp-manager';
import { CharacterPortrait } from '@/app/components/character/character-portrait';
import { FeatsManager } from '@/app/components/character/feats-manager';
import { GoalsManager } from '@/app/components/character/goals-manager';
import { MulticlassManager } from '@/app/components/character/multiclass-manager';
import { OptionalFeaturesManager } from '@/app/components/character/optional-features-manager';
import { CharacterShareManager } from '@/app/components/character/character-share-manager';
import { CharacterImportExport } from '@/app/components/character/character-import-export';
import { generateClassResources, type ClassResource } from '@/lib/data/class-resources';
import type { ClassLevel } from '@/lib/data/multiclass';
import { EMPTY_DEATH_SAVES, type DeathSaves } from '@/lib/data/death-saves';
import { EMPTY_CONDITIONS, type Condition } from '@/lib/data/conditions';
import { type Companion } from '@/lib/data/companions';
import { type JournalEntry } from '@/lib/data/journal';
import type { CharacterShare } from '@/lib/data/character-sharing';
import { GlassCard } from '@/app/components/character/glass-card';
import { SkillsFeaturesTabs } from '@/app/components/character/skills-features-tabs';

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

  // Character Share
  const characterShare: CharacterShare | null = character.character_share || null;

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

  // Optional Features
  const optionalFeatures = character.optional_features || [];

  // Count active features
  const activeConditionsCount = characterConditions.filter((c) => c.active).length;
  const activeCompanionsCount = characterCompanions.filter((c) => c.active).length;
  const hasClassResources = classResources.length > 0;

  return (
    <div className="min-h-screen relative">
      {/* Fantasy Background */}
      <div className="fantasy-bg" />
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            'url(https://i.pinimg.com/originals/a1/5d/0e/a15d0e8c4f4f8b8c4f4f8b8c4f4f8b8c.jpg)',
          filter: 'blur(3px)',
        }}
      />

      {/* Minimalist Header */}
      <header className="glass-card border-0 rounded-none backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Icon-only Navigation */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              title="Combate"
            >
              <Link href={`/personagens/${id}/combate`}>
                <Swords className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              title="Dados"
            >
              <Link href={`/personagens/${id}/dados`}>
                <Dices className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              title="Magias"
            >
              <Link href={`/personagens/${id}/magias`}>
                <Wand2 className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              title="Personalizar"
            >
              <Link href={`/personagens/${id}/personalizar`}>
                <Sparkles className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              title="Editar"
            >
              <Link href={`/personagens/${id}/editar`}>
                <Edit className="h-5 w-5" />
              </Link>
            </Button>
            <div className="h-8 w-px bg-white/20" />
            <ThemeToggle />
            <DeleteCharacterDialog characterId={id} characterName={character.name} />
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN - General Info */}
          <div className="lg:col-span-3 space-y-6">
            <GlassCard variant="default">
              {/* Character Avatar */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full blur-xl opacity-50 animate-pulse" />
                  <CharacterPortrait
                    name={character.name}
                    avatarUrl={character.avatar_url}
                    size="xl"
                    className="relative"
                  />
                </div>
              </div>

              {/* Character Info */}
              <div className="text-center space-y-3 mb-6">
                <h1 className="text-2xl font-bold text-white">{character.name}</h1>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">
                    {character.race}
                    {character.subrace && ` (${character.subrace})`}
                  </p>
                  <p className="text-gray-300">
                    {character.class}
                    {character.archetype && ` - ${character.archetype}`}
                  </p>
                  <div className="flex justify-center gap-2 mt-3">
                    <span className="tab-purple px-3 py-1 rounded-lg text-sm">
                      Nível {character.level}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{character.alignment}</p>
                </div>
              </div>

              {/* Attributes Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Atributos</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(character.attributes) as Array<keyof typeof modifiers>).map(
                    (attr) => (
                      <div key={attr} className="attribute-card">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                          {ABILITY_ABBREVIATIONS[attr]}
                        </p>
                        <p className="mt-2 text-3xl font-bold text-white">
                          {character.attributes[attr]}
                        </p>
                        <p className="text-sm text-purple-300 font-semibold">
                          {formatModifier(modifiers[attr])}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Combat Stats Compact */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-card-light rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Shield className="h-4 w-4 text-purple-400" />
                      <p className="text-xs text-gray-400 uppercase">CA</p>
                    </div>
                    <p className="text-2xl font-bold text-white">{character.armor_class}</p>
                  </div>
                  <div className="glass-card-light rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Zap className="h-4 w-4 text-purple-400" />
                      <p className="text-xs text-gray-400 uppercase">Init</p>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {formatModifier(character.initiative)}
                    </p>
                  </div>
                </div>
                <div className="glass-card-light rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Dices className="h-4 w-4 text-purple-400" />
                    <p className="text-xs text-gray-400 uppercase">Proficiência</p>
                  </div>
                  <p className="text-2xl font-bold text-white">+{character.proficiency_bonus}</p>
                </div>
              </div>

              {/* Speed */}
              <div className="glass-card-light rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 uppercase mb-2">Deslocamento</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(character.speed * 0.3048 * 10) / 10} m
                </p>
                <p className="text-xs text-gray-500">por turno</p>
              </div>
            </GlassCard>
          </div>

          {/* CENTER COLUMN - Skills, HP, Features */}
          <div className="lg:col-span-6 space-y-6">
            {/* HP Manager */}
            <HPManager
              characterId={id}
              hitPoints={character.hit_points}
              characterClass={character.class}
              characterLevel={character.level}
              constitutionModifier={modifiers.con}
              hitDiceUsed={character.hit_dice_used || 0}
              spellSlots={character.spell_slots || []}
              classResources={classResources}
              deathSaves={deathSaves}
            />

            {/* Skills & Features with Tabs */}
            <GlassCard variant="default">
              <SkillsFeaturesTabs
                skills={character.skills}
                features={character.features || []}
                modifiers={modifiers}
                proficiencyBonus={character.proficiency_bonus}
                abilityAbbreviations={ABILITY_ABBREVIATIONS}
              />
            </GlassCard>
          </div>

          {/* RIGHT COLUMN - XP & Proficiencies */}
          <div className="lg:col-span-3 space-y-6">
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

            {/* Proficiencies */}
            {character.proficiencies && (
              <GlassCard variant="default">
                <h3 className="text-lg font-semibold text-white mb-4">Proficiências</h3>
                <div className="space-y-4">
                  {character.proficiencies.weapons?.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-purple-300 uppercase tracking-wide">
                        Armas
                      </p>
                      <p className="text-sm text-gray-300">
                        {character.proficiencies.weapons.join(', ')}
                      </p>
                    </div>
                  )}
                  {character.proficiencies.armor?.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-purple-300 uppercase tracking-wide">
                        Armaduras
                      </p>
                      <p className="text-sm text-gray-300">
                        {character.proficiencies.armor.join(', ')}
                      </p>
                    </div>
                  )}
                  {character.proficiencies.tools?.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-purple-300 uppercase tracking-wide">
                        Ferramentas
                      </p>
                      <p className="text-sm text-gray-300">
                        {character.proficiencies.tools.join(', ')}
                      </p>
                    </div>
                  )}
                  {character.proficiencies.languages?.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-purple-300 uppercase tracking-wide">
                        Idiomas
                      </p>
                      <p className="text-sm text-gray-300">
                        {character.proficiencies.languages.join(', ')}
                      </p>
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
                      <p className="text-sm text-gray-400 text-center py-4">
                        Nenhuma proficiência adicional
                      </p>
                    )}
                </div>
              </GlassCard>
            )}
          </div>
        </div>


        {/* Advanced Resources Section */}
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Recursos Avançados</h2>
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
