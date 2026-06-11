import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Medicine {
  id: string;
  petId: string;
  petName?: string;
  name: string;
  dose: string;
  frequency: string;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  vetName?: string | null;
  notes?: string | null;
}

export interface CreateMedicineDto {
  name: string;
  dose: string;
  frequency: string;
  active: boolean;
  startDate?: string | null;
  endDate?: string | null;
  vetName?: string | null;
  notes?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MedicacionService {
  private baseUrl = 'http://localhost:8080/api/v1/pet';

  constructor(private http: HttpClient) {}

  getMedicacionesByPetId(petId: string): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.baseUrl}/${petId}/medicine`);
  }

  createMedicacion(
    petId: string,
    medicacion: CreateMedicineDto
  ): Observable<Medicine> {
    return this.http.post<Medicine>(
      `${this.baseUrl}/${petId}/medicine`,
      medicacion
    );
  }

updateMedicacion(medicineId: string, medicacion: any): Observable<Medicine> {
  return this.http.put<Medicine>(
    `${this.baseUrl}/medicine/${medicineId}`,
    medicacion
  );
}

endMedicine(medicineId: string): Observable<Medicine> {
  return this.http.put<Medicine>(
    `${this.baseUrl}/medicine/${medicineId}/end`,
    {}
  );
}

reactivateMedicine(medicineId: string): Observable<Medicine> {
  return this.http.put<Medicine>(
    `${this.baseUrl}/medicine/${medicineId}/reactivate`,
    {}
  );
}

  deleteMedicine(medicineId: string): Observable<void> {
  return this.http.delete<void>(
    `${this.baseUrl}/medicine/${medicineId}`
  );
}

}
