'use client';

import { useState } from 'react';
import { Settings, Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  type VariantRulesState,
  type VariantRule,
  type VariantRuleId,
  getAllVariantRules,
  getVariantRulesByCategory,
  getEnabledVariantRules,
  toggleVariantRule,
  countEnabledRules,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
} from '@/lib/data/variant-rules';

interface VariantRulesManagerProps {
  characterId: string;
  initialRules: VariantRulesState;
}

export function VariantRulesManager({ characterId, initialRules }: VariantRulesManagerProps) {
  const [rulesState, setRulesState] = useState<VariantRulesState>(initialRules);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<VariantRule | null>(null);

  const allRules = getAllVariantRules(rulesState);
  const enabledRules = getEnabledVariantRules(rulesState);
  const enabledCount = countEnabledRules(rulesState);

  // Salvar no Supabase
  const saveRules = async (newState: VariantRulesState) => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      const { error } = await supabase
        .from('characters')
        .update({ variant_rules: newState })
        .eq('id', characterId);

      if (error) throw error;

      setRulesState(newState);
    } catch (err) {
      console.error('Erro ao salvar regras variantes:', err);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle regra
  const handleToggle = (ruleId: VariantRuleId) => {
    const newState = toggleVariantRule(rulesState, ruleId);
    saveRules(newState);
  };

  // Ver detalhes de uma regra
  const handleViewDetails = (rule: VariantRule) => {
    setSelectedRule(rule);
    setIsDialogOpen(true);
  };

  // Renderizar regras por categoria
  const renderRulesList = (category: VariantRule['category']) => {
    const categoryRules = getVariantRulesByCategory(rulesState, category);

    return (
      <div className="space-y-3">
        {categoryRules.map((rule) => (
          <Card key={rule.id} className={rule.enabled ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20' : ''}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{rule.name}</h4>
                    {rule.enabled && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                        Ativo
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{rule.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Fonte: {rule.source}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => handleToggle(rule.id)}
                    disabled={isSaving}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(rule)}
                    className="h-auto p-1"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Regras Variantes
            </CardTitle>
            <CardDescription>
              Regras opcionais do D&D 5e que podem ser ativadas
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-lg">
            {enabledCount} ativas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Regras Ativas (Summary) */}
        {enabledRules.length > 0 && (
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="mb-2 text-sm font-medium">Regras Ativas:</p>
            <div className="flex flex-wrap gap-2">
              {enabledRules.map((rule) => (
                <Badge key={rule.id} variant="outline" className="bg-green-500/10 border-green-500/20">
                  {CATEGORY_ICONS[rule.category]} {rule.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tabs por Categoria */}
        <Tabs defaultValue="combat">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="combat">
              {CATEGORY_ICONS.combat} Combate
            </TabsTrigger>
            <TabsTrigger value="character">
              {CATEGORY_ICONS.character} Personagem
            </TabsTrigger>
            <TabsTrigger value="exploration">
              {CATEGORY_ICONS.exploration} Exploração
            </TabsTrigger>
            <TabsTrigger value="healing">
              {CATEGORY_ICONS.healing} Cura
            </TabsTrigger>
          </TabsList>

          <TabsContent value="combat" className="mt-4">
            {renderRulesList('combat')}
          </TabsContent>

          <TabsContent value="character" className="mt-4">
            {renderRulesList('character')}
          </TabsContent>

          <TabsContent value="exploration" className="mt-4">
            {renderRulesList('exploration')}
          </TabsContent>

          <TabsContent value="healing" className="mt-4">
            {renderRulesList('healing')}
          </TabsContent>
        </Tabs>

        {/* Info */}
        <div className="rounded-lg border bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950/20 dark:text-blue-100">
          <p className="font-medium">💡 Sobre Regras Variantes</p>
          <p className="mt-1 text-xs">
            Estas são regras opcionais sugeridas pelo Dungeon Master&apos;s Guide e homebrew populares.
            Algumas mudam significativamente o jogo. Sempre consulte seu DM antes de ativar.
          </p>
        </div>
      </CardContent>

      {/* Dialog de Detalhes */}
      {selectedRule && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {CATEGORY_ICONS[selectedRule.category]} {selectedRule.name}
                {selectedRule.enabled && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                    Ativo
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>{selectedRule.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Detalhes */}
              <div>
                <Label className="text-base">Como Funciona:</Label>
                <ul className="mt-2 space-y-2">
                  {selectedRule.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fonte */}
              <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                <p className="font-medium">Fonte:</p>
                <p className="text-muted-foreground">{selectedRule.source}</p>
              </div>

              {/* Categoria */}
              <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                <p className="font-medium">Categoria:</p>
                <Badge variant="outline" className="mt-1">
                  {CATEGORY_ICONS[selectedRule.category]} {CATEGORY_LABELS[selectedRule.category]}
                </Badge>
              </div>

              {/* Toggle */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor={`rule-${selectedRule.id}`} className="text-base">
                  Ativar esta regra
                </Label>
                <Switch
                  id={`rule-${selectedRule.id}`}
                  checked={selectedRule.enabled}
                  onCheckedChange={() => {
                    handleToggle(selectedRule.id);
                    setIsDialogOpen(false);
                  }}
                  disabled={isSaving}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
