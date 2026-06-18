import { ExcelImportResult } from '../services/excel-file.service';

export function formatImportResultMessage(result: ExcelImportResult): string {
  let message = `${result.imported} enregistrement(s) importé(s).`;
  if (result.skipped > 0) {
    message += ` ${result.skipped} ligne(s) ignorée(s).`;
  }
  if (result.errors?.length) {
    const details = result.errors.slice(0, 5).join('\n');
    const more = result.errors.length > 5 ? `\n... et ${result.errors.length - 5} autre(s) erreur(s).` : '';
    message += `\n\n${details}${more}`;
  }
  return message;
}
