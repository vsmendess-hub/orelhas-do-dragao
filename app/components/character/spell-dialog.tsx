'use client';

import { useState, useEffect, useMemo } from 'react';
import { Save, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type Spell,
  type SpellSchool,
  type SpellLevel,
  type CastingTime,
  type SpellDuration,
  COMMON_SPELLS,
} from '@/lib/data/spells';

interface SpellDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (spell: Spell) => void;
  editingSpell?: Spell | null;
}

const SPELL_SCHOOLS: SpellSchool[] = [
  'Abjuração',
  'Adivinhação',
  'Conjuração',
  'Encantamento',
  'Evocação',
  'Ilusão',
  'Necromancia',
  'Transmutação',
];

const CASTING_TIMES: CastingTime[] = [
  '1 ação',
  '1 ação bônus',
  '1 reação',
  '1 minuto',
  '10 minutos',
  '1 hora',
  '8 horas',
  '12 horas',
  '24 horas',
];

const DURATIONS: SpellDuration[] = [
  'Instantânea',
  '1 rodada',
  '1 minuto',
  '10 minutos',
  '1 hora',
  '8 horas',
  '24 horas',
  '7 dias',
  '10 dias',
  '30 dias',
  'Até ser dissipada',
  'Especial',
];

export function SpellDialog({ open, onOpenChange, onSave, editingSpell }: SpellDialogProps) {
  // Estado inicial vazio (memoizado)
  const emptySpell: Omit<Spell, 'id'> = useMemo(
    () => ({
      name: '',
      level: 0 as SpellLevel,
      school: 'Evocação' as SpellSchool,
      castingTime: '1 ação' as CastingTime,
      range: '',
      components: { verbal: false, somatic: false, material: false },
      duration: 'Instantânea' as SpellDuration,
      concentration: 'Não' as const,
      ritual: 'Não' as const,
      description: '',
      higherLevels: '',
      prepared: false,
      source: 'Homebrew',
    }),
    []
  );

  const [spell, setSpell] = useState<Omit<Spell, 'id'>>(emptySpell);
  const [selectedCommonSpell, setSelectedCommonSpell] = useState<string>('');

  // Resetar ou carregar spell ao abrir
  useEffect(() => {
    if (open) {
      if (editingSpell) {
        // Modo edição
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...spellWithoutId } = editingSpell;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSpell(spellWithoutId);
        setSelectedCommonSpell('');
      } else {
        // Modo criação

        setSpell(emptySpell);
        setSelectedCommonSpell('');
      }
    }
  }, [open, editingSpell, emptySpell]);

  // Carregar magia comum selecionada
  const handleSelectCommonSpell = (spellName: string) => {
    if (spellName === 'custom') {
      setSpell(emptySpell);
      setSelectedCommonSpell('custom');
      return;
    }

    const commonSpell = COMMON_SPELLS.find((s) => s.name === spellName);
    if (commonSpell) {
      setSpell(commonSpell);
      setSelectedCommonSpell(spellName);
    }
  };

  // Atualizar campo
  const updateField = <K extends keyof Omit<Spell, 'id'>>(
    field: K,
    value: Omit<Spell, 'id'>[K]
  ) => {
    setSpell((prev) => ({ ...prev, [field]: value }));
  };

  // Salvar
  const handleSave = () => {
    // Validação básica
    if (!spell.name.trim()) {
      alert('Nome da magia é obrigatório');
      return;
    }
    if (!spell.description.trim()) {
      alert('Descrição da magia é obrigatória');
      return;
    }

    // Criar spell com ID
    const spellToSave: Spell = {
      ...spell,
      id: editingSpell?.id || crypto.randomUUID(),
    };

    onSave(spellToSave);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingSpell ? 'Editar Magia' : 'Adicionar Nova Magia'}</DialogTitle>
          <DialogDescription>
            {editingSpell
              ? 'Edite as informações da magia abaixo'
              : 'Escolha uma magia do SRD ou crie uma personalizada'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Seleção de magia comum (só no modo criar) */}
          {!editingSpell && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Usar Magia do SRD</label>
              <Select value={selectedCommonSpell} onValueChange={handleSelectCommonSpell}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma magia ou crie personalizada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Criar Magia Personalizada
                    </div>
                  </SelectItem>
                  {COMMON_SPELLS.map((commonSpell) => (
                    <SelectItem key={commonSpell.name} value={commonSpell.name}>
                      {commonSpell.name} -{' '}
                      {commonSpell.level === 0 ? 'Truque' : `Nível ${commonSpell.level}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Nome */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nome da Magia *
            </label>
            <Input
              id="name"
              value={spell.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ex: Bola de Fogo"
            />
          </div>

          {/* Grid: Nível, Escola, Fonte */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nível</label>
              <Select
                value={spell.level.toString()}
                onValueChange={(v) => updateField('level', parseInt(v) as SpellLevel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Truque</SelectItem>
                  <SelectItem value="1">1º Nível</SelectItem>
                  <SelectItem value="2">2º Nível</SelectItem>
                  <SelectItem value="3">3º Nível</SelectItem>
                  <SelectItem value="4">4º Nível</SelectItem>
                  <SelectItem value="5">5º Nível</SelectItem>
                  <SelectItem value="6">6º Nível</SelectItem>
                  <SelectItem value="7">7º Nível</SelectItem>
                  <SelectItem value="8">8º Nível</SelectItem>
                  <SelectItem value="9">9º Nível</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Escola</label>
              <Select
                value={spell.school}
                onValueChange={(v) => updateField('school', v as SpellSchool)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPELL_SCHOOLS.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="source" className="text-sm font-medium">
                Fonte
              </label>
              <Input
                id="source"
                value={spell.source || ''}
                onChange={(e) => updateField('source', e.target.value)}
                placeholder="Ex: PHB, Xanathar"
              />
            </div>
          </div>

          {/* Grid: Tempo, Alcance, Duração */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tempo de Conjuração</label>
              <Select
                value={spell.castingTime}
                onValueChange={(v) => updateField('castingTime', v as CastingTime)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CASTING_TIMES.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="range" className="text-sm font-medium">
                Alcance
              </label>
              <Input
                id="range"
                value={spell.range}
                onChange={(e) => updateField('range', e.target.value)}
                placeholder="Ex: 9 metros, Toque"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Duração</label>
              <Select
                value={spell.duration}
                onValueChange={(v) => updateField('duration', v as SpellDuration)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((duration) => (
                    <SelectItem key={duration} value={duration}>
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Componentes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Componentes</label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verbal"
                  checked={spell.components.verbal}
                  onCheckedChange={(checked) =>
                    updateField('components', { ...spell.components, verbal: !!checked })
                  }
                />
                <label htmlFor="verbal" className="text-sm">
                  Verbal (V)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="somatic"
                  checked={spell.components.somatic}
                  onCheckedChange={(checked) =>
                    updateField('components', { ...spell.components, somatic: !!checked })
                  }
                />
                <label htmlFor="somatic" className="text-sm">
                  Somático (S)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="material"
                  checked={spell.components.material}
                  onCheckedChange={(checked) =>
                    updateField('components', { ...spell.components, material: !!checked })
                  }
                />
                <label htmlFor="material" className="text-sm">
                  Material (M)
                </label>
              </div>
            </div>
            {spell.components.material && (
              <Input
                placeholder="Descrição do componente material"
                value={spell.components.materialDescription || ''}
                onChange={(e) =>
                  updateField('components', {
                    ...spell.components,
                    materialDescription: e.target.value,
                  })
                }
              />
            )}
          </div>

          {/* Concentração e Ritual */}
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="concentration"
                checked={spell.concentration === 'Sim'}
                onCheckedChange={(checked) => updateField('concentration', checked ? 'Sim' : 'Não')}
              />
              <label htmlFor="concentration" className="text-sm">
                Requer Concentração
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ritual"
                checked={spell.ritual === 'Sim'}
                onCheckedChange={(checked) => updateField('ritual', checked ? 'Sim' : 'Não')}
              />
              <label htmlFor="ritual" className="text-sm">
                Pode ser Ritual
              </label>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição *
            </label>
            <Textarea
              id="description"
              value={spell.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Descreva o efeito da magia..."
              className="min-h-[120px]"
            />
          </div>

          {/* Níveis Superiores */}
          <div className="space-y-2">
            <label htmlFor="higherLevels" className="text-sm font-medium">
              Em Níveis Superiores
            </label>
            <Textarea
              id="higherLevels"
              value={spell.higherLevels || ''}
              onChange={(e) => updateField('higherLevels', e.target.value)}
              placeholder="Descreva o efeito ao conjurar em níveis superiores..."
              className="min-h-[80px]"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {editingSpell ? 'Salvar Alterações' : 'Adicionar Magia'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
