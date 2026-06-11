import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface VisitDto {
  id: string;
  petId: string;
  petName: string;
  petPhoto?: string;
  vetName: string;
  date: string;
  time: string;
  notes?: string;
  updatedAt?: string;
  finished?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/visits';

  constructor(private http: HttpClient) {}

  getMyVisits(): Observable<VisitDto[]> {
    return this.http.get<VisitDto[]>(`${this.baseUrl}/mine`, {
      withCredentials: true
    });
  }

createVisit(body: any): Observable<VisitDto> {
  return this.http.post<VisitDto>(`${this.baseUrl}/create`, body, {
    withCredentials: true
  });
}

  getVisitById(id: string): Observable<VisitDto> {
  return this.http.get<VisitDto>(`${this.baseUrl}/${id}`, {
    withCredentials: true
  });
}

updateVisit(body: any): Observable<VisitDto> {
  return this.http.put<VisitDto>(`${this.baseUrl}/update`, body, {
    withCredentials: true
  });
}

finishVisit(id: string): Observable<VisitDto> {
  return this.http.put<VisitDto>(
    `${this.baseUrl}/${id}/finish`,
    {},
    {
      withCredentials: true
    }
  );
}

}