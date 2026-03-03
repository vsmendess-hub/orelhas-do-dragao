/**
 * Sistema de Import/Export de Personagens D&D 5e
 */

export interface ExportMetadata {
  version: string; // Versão do schema de export
  exportedAt: string; // Data/hora do export
  exportedBy: string; // ID do usuário que exportou
  appVersion: string; // Versão do app
}

export interface CharacterExport {
  metadata: ExportMetadata;
  character: any; // Character completo
}

export interface ImportValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  version?: string;
}

export interface ImportOptions {
  overwriteExisting?: boolean;
  generateNewId?: boolean;
  preserveUser?: boolean;
}

/**
 * Versão atual do schema de export
 */
export const CURRENT_EXPORT_VERSION = '1.0.0';

/**
 * Exporta personagem para JSON
 */
export function exportCharacter(
  character: any,
  userId: string,
  appVersion: string = '1.0.0'
): CharacterExport {
  const metadata: ExportMetadata = {
    version: CURRENT_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    exportedBy: userId,
    appVersion,
  };

  // Limpar campos sensíveis
  const cleanCharacter = { ...character };
  delete cleanCharacter.created_at;
  delete cleanCharacter.updated_at;

  return {
    metadata,
    character: cleanCharacter,
  };
}

/**
 * Converte export para JSON string formatado
 */
export function exportToJSON(characterExport: CharacterExport): string {
  return JSON.stringify(characterExport, null, 2);
}

/**
 * Faz download do JSON
 */
export function downloadJSON(json: string, filename: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Valida JSON de import
 */
export function validateImport(jsonString: string): ImportValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const data = JSON.parse(jsonString);

    // Verificar estrutura básica
    if (!data.metadata || !data.character) {
      errors.push('Formato inválido: faltam campos obrigatórios (metadata, character)');
      return { valid: false, errors, warnings };
    }

    // Verificar metadata
    if (!data.metadata.version) {
      errors.push('Versão do export não especificada');
    }

    if (!data.metadata.exportedAt) {
      warnings.push('Data de export não especificada');
    }

    // Verificar campos essenciais do personagem
    const requiredFields = ['name', 'race', 'class', 'level', 'attributes'];
    for (const field of requiredFields) {
      if (!data.character[field]) {
        errors.push(`Campo obrigatório ausente: ${field}`);
      }
    }

    // Verificar atributos
    if (data.character.attributes) {
      const requiredAttributes = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
      for (const attr of requiredAttributes) {
        if (typeof data.character.attributes[attr] !== 'number') {
          errors.push(`Atributo inválido: ${attr}`);
        }
      }
    }

    // Verificar nível
    if (data.character.level) {
      const level = data.character.level;
      if (typeof level !== 'number' || level < 1 || level > 20) {
        errors.push('Nível deve ser um número entre 1 e 20');
      }
    }

    // Avisos sobre versão
    if (data.metadata.version !== CURRENT_EXPORT_VERSION) {
      warnings.push(
        `Versão diferente (${data.metadata.version} vs ${CURRENT_EXPORT_VERSION}). Pode haver incompatibilidades.`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      version: data.metadata.version,
    };
  } catch (err) {
    errors.push('JSON inválido: ' + (err as Error).message);
    return { valid: false, errors, warnings };
  }
}

/**
 * Parse e prepara personagem para import
 */
export function parseImport(
  jsonString: string,
  userId: string,
  options: ImportOptions = {}
): any | null {
  try {
    const data: CharacterExport = JSON.parse(jsonString);

    let character = { ...data.character };

    // Gerar novo ID se solicitado
    if (options.generateNewId) {
      character.id = crypto.randomUUID();
    }

    // Definir user_id
    if (!options.preserveUser) {
      character.user_id = userId;
    }

    // Remover campos que não devem ser importados
    delete character.created_at;
    delete character.updated_at;
    delete character.character_share; // Não importar compartilhamento

    // Adicionar timestamps
    const now = new Date().toISOString();
    character.created_at = now;
    character.updated_at = now;

    return character;
  } catch (err) {
    console.error('Erro ao fazer parse do import:', err);
    return null;
  }
}

/**
 * Gera nome de arquivo para export
 */
export function generateExportFilename(characterName: string): string {
  const safeName = characterName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const timestamp = new Date().toISOString().split('T')[0];
  return `${safeName}-${timestamp}.json`;
}

/**
 * Estatísticas do export
 */
export interface ExportStats {
  characterName: string;
  level: number;
  class: string;
  totalSpells: number;
  totalFeats: number;
  totalItems: number;
  exportSize: string; // Em KB
}

export function calculateExportStats(characterExport: CharacterExport): ExportStats {
  const character = characterExport.character;
  const jsonSize = new Blob([JSON.stringify(characterExport)]).size;

  return {
    characterName: character.name || 'Unknown',
    level: character.level || 0,
    class: character.class || 'Unknown',
    totalSpells: (character.spells || []).length,
    totalFeats: (character.feats || []).length,
    totalItems: (character.inventory || []).length,
    exportSize: `${(jsonSize / 1024).toFixed(2)} KB`,
  };
}

/**
 * Formatos de export suportados
 */
export type ExportFormat = 'json' | 'json-compact';

export interface ExportFormatOption {
  id: ExportFormat;
  name: string;
  description: string;
  extension: string;
}

export const EXPORT_FORMATS: ExportFormatOption[] = [
  {
    id: 'json',
    name: 'JSON (Formatado)',
    description: 'Arquivo JSON legível com indentação',
    extension: 'json',
  },
  {
    id: 'json-compact',
    name: 'JSON (Compacto)',
    description: 'Arquivo JSON compacto sem espaços (menor tamanho)',
    extension: 'json',
  },
];

/**
 * Exporta com formato específico
 */
export function exportWithFormat(
  characterExport: CharacterExport,
  format: ExportFormat
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(characterExport, null, 2);
    case 'json-compact':
      return JSON.stringify(characterExport);
    default:
      return JSON.stringify(characterExport, null, 2);
  }
}

/**
 * Clona personagem (export + import com novo ID)
 */
export function cloneCharacter(character: any, userId: string): any {
  const exported = exportCharacter(character, userId);
  const cloned = parseImport(JSON.stringify(exported), userId, {
    generateNewId: true,
    preserveUser: false,
  });

  if (cloned) {
    cloned.name = `${cloned.name} (Cópia)`;
  }

  return cloned;
}

/**
 * Backup automático (export simplificado)
 */
export function createBackup(character: any, userId: string): string {
  const exported = exportCharacter(character, userId);
  return exportWithFormat(exported, 'json-compact');
}

/**
 * Restore de backup
 */
export function restoreFromBackup(
  backupString: string,
  userId: string,
  characterId: string
): any | null {
  const validation = validateImport(backupString);
  if (!validation.valid) {
    return null;
  }

  const character = parseImport(backupString, userId, {
    generateNewId: false,
    preserveUser: false,
  });

  if (character) {
    character.id = characterId; // Manter o mesmo ID para atualização
  }

  return character;
}

/**
 * Compara duas versões de personagem
 */
export interface CharacterDiff {
  field: string;
  oldValue: any;
  newValue: any;
  type: 'added' | 'removed' | 'changed';
}

export function compareCharacters(oldChar: any, newChar: any): CharacterDiff[] {
  const diffs: CharacterDiff[] = [];
  const allKeys = new Set([...Object.keys(oldChar), ...Object.keys(newChar)]);

  for (const key of allKeys) {
    // Ignorar timestamps e IDs
    if (['created_at', 'updated_at', 'user_id'].includes(key)) continue;

    const oldValue = oldChar[key];
    const newValue = newChar[key];

    if (oldValue === undefined && newValue !== undefined) {
      diffs.push({ field: key, oldValue: null, newValue, type: 'added' });
    } else if (oldValue !== undefined && newValue === undefined) {
      diffs.push({ field: key, oldValue, newValue: null, type: 'removed' });
    } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      diffs.push({ field: key, oldValue, newValue, type: 'changed' });
    }
  }

  return diffs;
}
