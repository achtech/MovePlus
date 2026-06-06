import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pack {
  id?: number;
  nom: string;
  nombreDeSeance: number;
  prixMaison: number;
  prixCabinet: number;
  nombreAbonne: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class PackService {
  private apiUrl = 'http://localhost:8080/api/packs';

  constructor(private http: HttpClient) {}

  getPacks(): Observable<Pack[]> {
    return this.http.get<Pack[]>(this.apiUrl);
  }

  addPack(pack: Pack): Observable<Pack> {
    return this.http.post<Pack>(this.apiUrl, pack);
  }

  updatePack(id: number, pack: Pack): Observable<Pack> {
    return this.http.put<Pack>(`${this.apiUrl}/${id}`, pack);
  }

  deletePack(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPackByNumero(numero: string): Observable<Pack> {
    return this.http.get<Pack>(`${this.apiUrl}/search/numero?numero=${numero}`);
  }
}
