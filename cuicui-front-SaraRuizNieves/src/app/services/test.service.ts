import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Test {
  id?: string;

  petId: string;
  petName?: string;

  name: string;
  type?: string;

  testDate?: string;

  result?: string;
  vetName?: string;
  notes?: string;

  fileName?: string;

  filePath?: string;

  fileType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl = 'http://localhost:8080/api/v1/test';

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Test[]> {

    return this.http.get<Test[]>(
      this.apiUrl,
      {
        withCredentials: true
      }
    );
  }

  getById(id: string): Observable<Test> {

    return this.http.get<Test>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true
      }
    );
  }

  getByPet(petId: string): Observable<Test[]> {

    return this.http.get<Test[]>(
      `${this.apiUrl}/pet/${petId}`,
      {
        withCredentials: true
      }
    );
  }

  create(test: Test): Observable<Test> {

    return this.http.post<Test>(
      this.apiUrl,
      test,
      {
        withCredentials: true
      }
    );
  }

  update(
    id: string,
    test: Test
  ): Observable<Test> {

    return this.http.put<Test>(
      `${this.apiUrl}/${id}`,
      test,
      {
        withCredentials: true
      }
    );
  }

  delete(id: string): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true
      }
    );
  }

createWithFile(formData: FormData) {
  return this.http.post<Test>(
    `${this.apiUrl}/upload`,
    formData,
    { withCredentials: true }
  );
}

updateWithFile(
  id: string,
  formData: FormData
) {
  return this.http.put<Test>(
    `${this.apiUrl}/${id}/upload`,
    formData,
    { withCredentials: true }
  );
}

getFileUrl(filePath?: string): string {
  return filePath ? `http://localhost:8080/tests/${filePath}` : '';
}

}