import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.interface';
import { Role } from '../models/role.interface'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.baseUrlApi}/api/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating user:', error);
        return throwError(() => error);
      })
    );
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }

getRoles(): Observable<Role[]> {
  return this.http.get<Role[]>(`${environment.baseUrlApi}/api/roles`).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error al obtener roles:', error);
      return throwError(() => error);
    })
  );
}


  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }
}
