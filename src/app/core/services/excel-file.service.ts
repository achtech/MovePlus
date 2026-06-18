import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface ExcelImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

@Injectable({ providedIn: 'root' })
export class ExcelFileService {
  constructor(private http: HttpClient) {}

  download(url: string, filename: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      tap((blob) => this.triggerSave(blob, filename))
    );
  }

  import(url: string, file: File): Observable<ExcelImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ExcelImportResult>(url, formData);
  }

  private triggerSave(blob: Blob, filename: string): void {
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  }
}
