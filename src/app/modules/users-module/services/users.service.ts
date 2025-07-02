import { Injectable } from '@angular/core'; // Decorador para crear servicios
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // HTTP client y manejo de errores
import { Observable, throwError } from 'rxjs'; // Observables y manejo de errores
import { catchError } from 'rxjs/operators'; // Operadores para pipes de RxJS
import { User } from '../models/user.interface'; // Interfaz de usuario
import { environment } from 'src/environments/environment'; // Variables de entorno

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la app
})
export class UsersService {
  private apiUrl = `${environment.baseUrlApi}/api/users`; // URL base de la API

  constructor(private http: HttpClient) {} // Inyección del HttpClient

  // Obtiene todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejo de errores
        console.error('Error fetching users:', error);
        return throwError(() => error); // Relanza el error
      })
    );
  }

  // Crea un nuevo usuario
  // Definición del método createUser que recibe un objeto User y retorna un Observable de User
  createUser(user: User): Observable<User> {
    // Realiza una petición HTTP POST al endpoint this.apiUrl con el objeto user como body
    // El tipo genérico <User> indica que se espera una respuesta con formato User
    return (
      this.http
        .post<User>(this.apiUrl, user)

        // Pipe permite encadenar operadores RxJS para manipular el Observable
        .pipe(
          // Operador catchError para interceptar y manejar errores
          catchError((error: HttpErrorResponse) => {
            // Registra el error en la consola para debugging
            console.error('Error creating user:', error);

            // Retorna un nuevo Observable que emite el error usando throwError
            // Se usa una función factory (() => error) para creación lazy del error
            return throwError(() => error);
          })
        )
    );
  }

  // Actualiza un usuario existente
  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    // Realiza una petición HTTP DELETE al endpoint específico para el usuario
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }
}
