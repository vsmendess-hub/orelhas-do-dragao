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
  BookOpen,
} from 'lucide-react';
import { ThemeToggle } from '@/app/components/theme-toggle';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
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
import { getAllCharacterFeatures } from '@/lib/data/character-features';
import { getAllProficiencies } from '@/lib/data/proficiencies';
import { SavingThrows } from '@/app/components/character/saving-throws';
import { PassivePerception } from '@/app/components/character/passive-perception';
import { AttributesSection } from '@/app/components/character/attributes-section';
import { CombatStats } from '@/app/components/character/combat-stats';
import { CharacterStats } from '@/app/components/character/character-stats';

const ABILITY_ABBREVIATIONS = {
  str: 'FOR',
  dex: 'DES',
  con: 'CON',
  int: 'INT',
  wis: 'SAB',
  cha: 'CAR',
} as const;

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

  // Calcular Iniciativa com bônus de Alerta (+5)
  const hasAlertFeat = characterFeats.some((feat: { featId: string }) => feat.featId === 'alert');
  const initiativeBonus = hasAlertFeat ? 5 : 0;
  const totalInitiative = character.initiative + initiativeBonus;

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

  // Obter características automaticamente baseadas em raça, sub-raça, classe e nível
  const characterFeatures = getAllCharacterFeatures(
    character.race,
    character.subrace,
    character.class,
    character.level,
    character.archetype
  );

  // Obter proficiências automaticamente
  const backgroundName = character.background_data?.name || 'none';
  const domain = character.archetype; // Para clérigos, archetype é o domínio
  const characterProficiencies = getAllProficiencies(
    character.race,
    character.subrace,
    character.class,
    backgroundName,
    domain
  );

  // Verificar se é proficiente em Percepção
  const isProficientInPerception =
    character.skills?.some(
      (skill: { name: string; proficient: boolean }) =>
        skill.name === 'Percepção' && skill.proficient
    ) || false;

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

              {/* Combat Stats Destacados - Iniciativa e CA */}
              <CombatStats
                characterId={id}
                armorClass={character.armor_class}
                initiative={character.initiative}
                hasAlertFeat={hasAlertFeat}
              />

              {/* Attributes Section */}
              <AttributesSection
                characterId={id}
                attributes={character.attributes}
                modifiers={modifiers}
                currentHP={character.hit_points}
                characterLevel={character.level}
                proficiencyBonus={character.proficiency_bonus}
                weaponProficiencies={characterProficiencies.weapons}
                armorProficiencies={characterProficiencies.armor}
                feats={characterFeats}
              />

              {/* Proficiência e Deslocamento */}
              <div className="mt-6">
                <CharacterStats
                  characterId={id}
                  proficiencyBonus={character.proficiency_bonus}
                  speed={character.speed}
                />
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
                characterId={id}
                skills={character.skills}
                features={characterFeatures}
                modifiers={modifiers}
                proficiencyBonus={character.proficiency_bonus}
                abilityAbbreviations={ABILITY_ABBREVIATIONS}
                skillOverrides={character.skill_overrides || {}}
              />
            </GlassCard>
          </div>

          {/* RIGHT COLUMN - XP, Saving Throws, Passive Perception & Proficiencies */}
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

            {/* Saving Throws */}
            <SavingThrows
              characterId={id}
              modifiers={modifiers}
              proficiencyBonus={character.proficiency_bonus}
              savingThrowProficiencies={characterProficiencies.savingThrows || []}
              savingThrowsOverride={character.saving_throws_override || {}}
            />

            {/* Passive Perception */}
            <PassivePerception
              wisdomModifier={modifiers.wis}
              proficiencyBonus={character.proficiency_bonus}
              isProficientInPerception={isProficientInPerception}
            />

            {/* Proficiencies - Automaticamente geradas */}
            <GlassCard variant="default">
              <h3 className="text-lg font-semibold text-white mb-4">Proficiências</h3>
              <div className="space-y-4">
                {/* Testes de Resistência */}
                {characterProficiencies.savingThrows &&
                  characterProficiencies.savingThrows.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-amber-300 uppercase tracking-wide">
                        Testes de Resistência
                      </p>
                      <p className="text-sm text-gray-300">
                        {characterProficiencies.savingThrows.join(', ')}
                      </p>
                    </div>
                  )}
                {/* Perícias */}
                {characterProficiencies.skills && characterProficiencies.skills.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-green-300 uppercase tracking-wide">
                      Perícias
                    </p>
                    <p className="text-sm text-gray-300">
                      {characterProficiencies.skills.join(', ')}
                    </p>
                  </div>
                )}
                {/* Armas */}
                {characterProficiencies.weapons.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-purple-300 uppercase tracking-wide">
                      Armas
                    </p>
                    <p className="text-sm text-gray-300">
                      {characterProficiencies.weapons.join(', ')}
                    </p>
                  </div>
                )}
                {/* Armaduras */}
                {characterProficiencies.armor.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-blue-300 uppercase tracking-wide">
                      Armaduras
                    </p>
                    <p className="text-sm text-gray-300">
                      {characterProficiencies.armor.join(', ')}
                    </p>
                  </div>
                )}
                {/* Ferramentas */}
                {characterProficiencies.tools.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-orange-300 uppercase tracking-wide">
                      Ferramentas
                    </p>
                    <p className="text-sm text-gray-300">
                      {characterProficiencies.tools.join(', ')}
                    </p>
                  </div>
                )}
                {/* Idiomas */}
                {characterProficiencies.languages.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-cyan-300 uppercase tracking-wide">
                      Idiomas
                    </p>
                    <p className="text-sm text-gray-300">
                      {characterProficiencies.languages.join(', ')}
                    </p>
                  </div>
                )}
                {/* Caso não tenha nada */}
                {characterProficiencies.weapons.length === 0 &&
                  characterProficiencies.armor.length === 0 &&
                  characterProficiencies.tools.length === 0 &&
                  characterProficiencies.languages.length === 0 &&
                  (!characterProficiencies.savingThrows ||
                    characterProficiencies.savingThrows.length === 0) &&
                  (!characterProficiencies.skills ||
                    characterProficiencies.skills.length === 0) && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Nenhuma proficiência adicional
                    </p>
                  )}
              </div>
            </GlassCard>
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
            <ClassResourcesManager
              characterId={id}
              initialResources={classResources}
              characterClass={character.class}
              characterLevel={character.level}
            />

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
            <CharacterImportExport characterId={id} character={character} userId={user.id} />

            {/* Conditions */}
            <ConditionsManager
              key={`conditions-${id}`}
              characterId={id}
              initialConditions={characterConditions}
            />

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
            proficiencyBonus={character.proficiency_bonus}
            weaponProficiencies={characterProficiencies.weapons}
            armorProficiencies={characterProficiencies.armor}
            attributes={character.attributes}
            optionalFeatures={optionalFeatures}
          />
        </div>
      </main>
    </div>
  );
}
