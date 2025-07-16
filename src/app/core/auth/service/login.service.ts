import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

const BASE_URL = 'https://velazco-backend-develop.up.railway.app/api';

interface LoginResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient, private router: Router ) { }

  login(email: string, password: string): Observable<LoginResponse> {
  const url = `${BASE_URL}/auth/login`;
  const body = { email, password };
  
  return this.http.post<LoginResponse>(
    url,
    body,
    { withCredentials: true }  // ¡Clave para manejar cookies!
  ).pipe(
    tap(response => {
      console.log('Login exitoso', response);
      // No necesitas localStorage si la cookie es HttpOnly
    })
  );
}

  logout(): Observable<any> {
  return this.http.post(`${BASE_URL}/auth/logout`, null).pipe(
    catchError(error => {
      console.error('Logout failed:', error);
      return throwError(() => error);
    })
  );
}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

getprofile():Observable<any>{
   return this.http.get(`${BASE_URL}/profile`).pipe(
    );
}

}
