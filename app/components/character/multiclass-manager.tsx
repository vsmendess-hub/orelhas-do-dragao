'use client';

import { useState } from 'react';
import { Users, Plus, Minus, Info, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  type ClassLevel,
  MULTICLASS_PREREQUISITES,
  CLASS_HIT_DICE,
  calculateTotalLevel,
  calculateMulticlassProficiencyBonus,
  calculateMulticlassCasterLevel,
  canMulticlassInto,
  formatMulticlassDescription,
  isMulticlass,
  getPrimaryClass,
  addClassLevel,
  removeClassLevel,
  getMulticlassHitDice,
  validateMulticlass,
} from '@/lib/data/multiclass';

const CLASSES = [
  'Bárbaro',
  'Bardo',
  'Bruxo',
  'Clérigo',
  'Druida',
  'Feiticeiro',
  'Guerreiro',
  'Ladino',
  'Mago',
  'Monge',
  'Paladino',
  'Ranger',
];

interface MulticlassManagerProps {
  characterId: string;
  initialClasses: ClassLevel[];
  attributes: Record<string, number>;
}

export function MulticlassManager({
  characterId,
  initialClasses,
  attributes,
}: MulticlassManagerProps) {
  const [classes, setClasses] = useState<ClassLevel[]>(initialClasses);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('');

  const totalLevel = calculateTotalLevel(classes);
  const proficiencyBonus = calculateMulticlassProficiencyBonus(totalLevel);
  const casterLevel = calculateMulticlassCasterLevel(classes);
  const hitDice = getMulticlassHitDice(classes);
  const validation = validateMulticlass(classes, attributes);
  const multiclass = isMulticlass(classes);
  const primaryClass = getPrimaryClass(classes);

  // Salvar no Supabase
  const saveClasses = async (newClasses: ClassLevel[]) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const newTotal = calculateTotalLevel(newClasses);
      const newProfBonus = calculateMulticlassProficiencyBonus(newTotal);

      const { error } = await supabase
        .from('characters')
        .update({
          multiclass: newClasses,
          level: newTotal,
          proficiency_bonus: newProfBonus,
        })
        .eq('id', characterId);

      if (error) throw error;

      setClasses(newClasses);
      // Recarregar para atualizar tudo
      window.location.reload();
    } catch (err) {
      console.error('Erro ao salvar multiclasse:', err);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Adicionar nova classe
  const handleAddClass = () => {
    if (!selectedClass) return;

    // Verificar pré-requisitos
    const check = canMulticlassInto(selectedClass, attributes);
    if (!check.can) {
      alert(`Não é possível adicionar ${selectedClass}: ${check.reason}`);
      return;
    }

    const newClasses = addClassLevel(classes, selectedClass);
    saveClasses(newClasses);
    setIsDialogOpen(false);
    setSelectedClass('');
  };

  // Aumentar nível de uma classe
  const handleLevelUp = (className: string) => {
    const newClasses = addClassLevel(classes, className);
    saveClasses(newClasses);
  };

  // Diminuir nível de uma classe
  const handleLevelDown = (className: string) => {
    const newClasses = removeClassLevel(classes, className);
    if (newClasses.length === 0) {
      alert('Personagem deve ter pelo menos uma classe');
      return;
    }
    saveClasses(newClasses);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Multiclasse
            </CardTitle>
            <CardDescription>
              {multiclass ? formatMulticlassDescription(classes) : 'Classe única'}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg">
            Nível {totalLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validation Errors */}
        {!validation.valid && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Pré-requisitos não atendidos</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1">
                {validation.errors.map((error, idx) => (
                  <li key={idx}>• {error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Gerais */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Nível Total</p>
            <p className="text-2xl font-bold">{totalLevel}</p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Proficiência</p>
            <p className="text-2xl font-bold">+{proficiencyBonus}</p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Caster Level</p>
            <p className="text-2xl font-bold">{casterLevel}</p>
          </div>
        </div>

        {/* Classes */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Classes Atuais</Label>
          {classes.map((cls) => {
            const isPrimary = primaryClass?.className === cls.className;
            return (
              <Card key={cls.className} className={isPrimary ? 'border-2 border-purple-500' : ''}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{cls.className}</p>
                        {isPrimary && (
                          <Badge variant="outline" className="text-xs">
                            Primária
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Nível {cls.level}</span>
                        <span>Dado de Vida: {cls.hitDie}</span>
                        {cls.subclass && <span>Subclasse: {cls.subclass}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleLevelUp(cls.className)}
                        disabled={isSaving}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleLevelDown(cls.className)}
                        disabled={isSaving || classes.length === 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Hit Dice Summary */}
        {multiclass && (
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="mb-2 text-sm font-medium">Dados de Vida:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(hitDice).map(([die, count]) => (
                <Badge key={die} variant="outline">
                  {count}x {die}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Info sobre Multiclasse */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Regras de Multiclasse</AlertTitle>
          <AlertDescription className="text-xs">
            <ul className="mt-2 space-y-1">
              <li>• Você deve atender os pré-requisitos de atributos de cada classe</li>
              <li>• Proficiency bonus baseado no nível total</li>
              <li>• Spell slots calculados pelo caster level combinado</li>
              <li>• Hit points e hit dice são somados de todas as classes</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Adicionar Classe */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" disabled={isSaving}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Classe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Classe</DialogTitle>
              <DialogDescription>
                Escolha uma classe para fazer multiclasse. Verifique os pré-requisitos.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Classe */}
              <div className="space-y-2">
                <Label htmlFor="class">Classe</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Selecione uma classe..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.filter(
                      (cls) => !classes.find((c) => c.className === cls)
                    ).map((cls) => {
                      const check = canMulticlassInto(cls, attributes);
                      return (
                        <SelectItem key={cls} value={cls} disabled={!check.can}>
                          {cls}
                          {!check.can && ` (${check.reason})`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Pré-requisitos */}
              {selectedClass && MULTICLASS_PREREQUISITES[selectedClass] && (
                <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                  <p className="font-medium">Pré-requisitos:</p>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    {MULTICLASS_PREREQUISITES[selectedClass].map((prereq, idx) => {
                      const hasPrereq = attributes[prereq.attribute] >= prereq.minimum;
                      return (
                        <li key={idx} className={hasPrereq ? 'text-green-600' : 'text-red-600'}>
                          {hasPrereq ? '✓' : '✗'} {prereq.attribute.toUpperCase()}{' '}
                          {prereq.minimum}+ (atual: {attributes[prereq.attribute]})
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <Button onClick={handleAddClass} disabled={!selectedClass || isSaving} className="w-full">
                {isSaving ? 'Salvando...' : 'Adicionar Classe'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
