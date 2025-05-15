import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioServiceService {

  private dominio: string = environment.baseUrlApi;
  private apiUrl: string = `${this.dominio}/api/products`;

  constructor(private http: HttpClient) { 
  }


  //get
  obtenerProductos(): Observable<any> {  //get
    return this.http.get(`${this.apiUrl}`).pipe( 
      catchError(this.handleError)
    );
  }

  //post
  agregarProducto(producto: any): Observable<any> {
    return this.http.post(this.apiUrl, producto).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo de nuevo más tarde.'));
  }

}
