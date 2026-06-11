import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PetDto {
  id: string;
  petName: string;
  breed?: string;
  dateBirth?: string;
  gender?: string;
  dateAdoption?: string;
  dateDisable?: string;
  photo?: string;
  user?: string;
  ownerName?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private readonly baseUrl = 'http://localhost:8080/api/v1/pets';

  constructor(private http: HttpClient) {}

  createPet(body: any): Observable<PetDto> {
    return this.http.post<PetDto>(`${this.baseUrl}/create`, body, {
      withCredentials: true
    });
  }

getMyPets(): Observable<PetDto[]> {
  return this.http.get<PetDto[]>(`${this.baseUrl}/mine`, {
    withCredentials: true
  });
}

  getPetById(id: string): Observable<PetDto> {
    return this.http.get<PetDto>(`${this.baseUrl}/${id}`, {
      withCredentials: true
    });
  }

  updatePet(body: any): Observable<PetDto> {
  return this.http.put<PetDto>(`${this.baseUrl}/update`, body, {
    withCredentials: true
  });
}

markPetAsDeceased(id: string, dateDisable: string): Observable<PetDto> {
  return this.http.put<PetDto>(
    `${this.baseUrl}/${id}/decease`,
    { dateDisable },
    { withCredentials: true }
  );
}

deletePet(id: string): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/${id}/hard-delete`, {
    withCredentials: true
  });
}
}