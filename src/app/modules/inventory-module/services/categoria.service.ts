import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private dominio: string = environment.baseUrlApi;
  private apiUrl: string = `${this.dominio}/api/categories`;


  constructor(private http: HttpClient) { }

  obtenerCategorias(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  agregarCategoria(categoria: any): Observable<any> {
    return this.http.post(this.apiUrl, categoria).pipe(
      catchError(this.handleError)
    );
  }


  actualizarCategoria(id: number, categoria: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria).pipe(
      catchError(this.handleError)
    );
  }


  eliminarCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );


  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo de nuevo más tarde.'));
  }


}
