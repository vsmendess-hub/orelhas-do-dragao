'use client';

import { useState } from 'react';
import { Download, Upload, FileJson, Copy, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  exportCharacter,
  exportWithFormat,
  downloadJSON,
  generateExportFilename,
  calculateExportStats,
  validateImport,
  parseImport,
  cloneCharacter,
  EXPORT_FORMATS,
  type ExportFormat,
  type ImportValidation,
  type ExportStats,
} from '@/lib/data/character-import-export';
import type { Character } from '@/lib/supabase/types';

interface CharacterImportExportProps {
  characterId: string;
  character: Character;
  userId: string;
}

export function CharacterImportExport({
  characterId,
  character,
  userId,
}: CharacterImportExportProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importJSON, setImportJSON] = useState('');
  const [validation, setValidation] = useState<ImportValidation | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [exportStats, setExportStats] = useState<ExportStats | null>(null);

  // Export
  const handleExport = () => {
    const exported = exportCharacter(character, userId);
    const stats = calculateExportStats(exported);
    setExportStats(stats);
  };

  const handleDownload = () => {
    const exported = exportCharacter(character, userId);
    const json = exportWithFormat(exported, exportFormat);
    const filename = generateExportFilename(character.name);
    downloadJSON(json, filename);
    alert('Personagem exportado com sucesso!');
  };

  const handleCopyJSON = async () => {
    const exported = exportCharacter(character, userId);
    const json = exportWithFormat(exported, exportFormat);
    await navigator.clipboard.writeText(json);
    alert('JSON copiado para a área de transferência!');
  };

  // Import
  const handleValidateImport = () => {
    if (!importJSON.trim()) {
      setValidation({
        valid: false,
        errors: ['Cole um JSON válido'],
        warnings: [],
      });
      return;
    }

    const result = validateImport(importJSON);
    setValidation(result);
  };

  const handleImport = async () => {
    if (!validation?.valid) return;

    try {
      setIsImporting(true);
      const supabase = createClient();

      const importedCharacter = parseImport(importJSON, userId, {
        generateNewId: false,
        preserveUser: false,
      });

      if (!importedCharacter) {
        throw new Error('Erro ao processar import');
      }

      // Manter o ID do personagem atual
      importedCharacter.id = characterId;

      const { error } = await supabase
        .from('characters')
        .update(importedCharacter)
        .eq('id', characterId);

      if (error) throw error;

      alert('Personagem importado com sucesso!');
      setIsImportOpen(false);
      setImportJSON('');
      setValidation(null);

      // Recarregar página para atualizar dados
      window.location.reload();
    } catch (err) {
      console.error('Erro ao importar:', err);
      alert('Erro ao importar personagem. Verifique o JSON e tente novamente.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportJSON(content);
      // Auto-validar
      const result = validateImport(content);
      setValidation(result);
    };
    reader.readAsText(file);
  };

  // Clone
  const handleClone = async () => {
    try {
      const supabase = createClient();
      const cloned = cloneCharacter(character, userId);

      if (!cloned) {
        throw new Error('Erro ao clonar personagem');
      }

      const { error } = await supabase.from('characters').insert(cloned);

      if (error) throw error;

      alert('Personagem clonado com sucesso!');
      window.location.href = '/';
    } catch (err) {
      console.error('Erro ao clonar:', err);
      alert('Erro ao clonar personagem.');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileJson className="h-5 w-5 text-green-500" />
          Import / Export
        </h3>
        <p className="text-sm text-gray-400">Exporte, importe ou clone seu personagem</p>
      </div>

      <div className="space-y-3">
        {/* Export */}
        <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Personagem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Exportar Personagem</DialogTitle>
              <DialogDescription>
                Baixe seu personagem em formato JSON para backup ou transferência
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Stats */}
              {exportStats && (
                <div className="glass-card-light rounded-xl border border-white/10 p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Nome:</span>
                      <p className="font-semibold text-white">{exportStats.characterName}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Classe/Nível:</span>
                      <p className="font-semibold text-white">
                        {exportStats.class} {exportStats.level}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Magias:</span>
                      <p className="font-semibold text-white">{exportStats.totalSpells}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Tamanho:</span>
                      <p className="font-semibold text-white">{exportStats.exportSize}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Format */}
              <div className="space-y-2">
                <Label htmlFor="format">Formato</Label>
                <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as ExportFormat)}>
                  <SelectTrigger id="format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPORT_FORMATS.map((format) => (
                      <SelectItem key={format.id} value={format.id}>
                        <div>
                          <p className="font-medium">{format.name}</p>
                          <p className="text-xs text-muted-foreground">{format.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Info */}
              <div className="glass-card-light rounded-xl border border-blue-400/50 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-white">Como usar o export</p>
                    <ul className="mt-1 space-y-1 text-gray-400">
                      <li>• Faça backup do seu personagem regularmente</li>
                      <li>• Use para transferir entre contas</li>
                      <li>• Compartilhe com amigos (remova informações sensíveis)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleCopyJSON} variant="outline" className="flex-1">
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar JSON
                </Button>
                <Button onClick={handleDownload} className="flex-1 tab-purple">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Arquivo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Import */}
        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Importar Personagem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Importar Personagem</DialogTitle>
              <DialogDescription>
                Cole o JSON ou carregue um arquivo para substituir este personagem
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Warning */}
              <div className="glass-card-light rounded-xl border border-amber-400/50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-white">Atenção</p>
                    <p className="text-gray-400">
                      Esta ação substituirá completamente os dados atuais do personagem. Faça um
                      backup antes de continuar.
                    </p>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file">Carregar Arquivo</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>

              {/* JSON Input */}
              <div className="space-y-2">
                <Label htmlFor="json">Ou Cole o JSON</Label>
                <Textarea
                  id="json"
                  value={importJSON}
                  onChange={(e) => setImportJSON(e.target.value)}
                  placeholder='{"metadata": {...}, "character": {...}}'
                  rows={8}
                  className="font-mono text-xs"
                />
              </div>

              {/* Validation */}
              {validation && (
                <div className="space-y-2">
                  {validation.valid ? (
                    <div className="glass-card-light rounded-xl border border-green-400/50 p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        <p className="font-medium text-white">JSON Válido</p>
                      </div>
                      {validation.warnings.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm text-gray-400">
                          {validation.warnings.map((warning, i) => (
                            <li key={i}>⚠️ {warning}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="glass-card-light rounded-xl border border-red-400/50 p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <p className="font-medium text-white">JSON Inválido</p>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-gray-400">
                        {validation.errors.map((error, i) => (
                          <li key={i}>❌ {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleValidateImport} variant="outline" className="flex-1">
                  Validar
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!validation?.valid || isImporting}
                  className="flex-1 tab-purple"
                >
                  {isImporting ? 'Importando...' : 'Importar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Clone */}
        <Button variant="outline" className="w-full" onClick={handleClone}>
          <Copy className="mr-2 h-4 w-4" />
          Clonar Personagem
        </Button>
      </div>
    </div>
  );
}

// Componente Input (caso não exista)
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className}`}
    />
  );
}
