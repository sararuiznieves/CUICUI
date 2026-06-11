import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  sessionId: string;
  name: string;
  email: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = '/api/v1/users';

  constructor(private http: HttpClient) {}

login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post(`${this.baseUrl}/loginProcess`, credentials, {
    withCredentials: true
  });
}

createUser(user: { email: string; password: string; name: string }): Observable<any> {
  return this.http.post(`${this.baseUrl}/create`, user, {
    withCredentials: true
  });
}
  updateUser(data: { name: string; email: string; avatar: string }) {
  return this.http.put<{ name: string; email: string; avatar: string }>(
    '/api/v1/users/update',
    data
  );
}

changePassword(data: { newPassword: string }) {
  return this.http.put('/api/v1/users/changePassword', data, {
    responseType: 'text'
  });
}

deleteUser() {
  return this.http.delete('/api/v1/users/delete', {
    responseType: 'text'
  });
}
}