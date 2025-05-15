import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioServiceService {

  private dominio: string = environment.baseUrlApi;
  private apiUrl: string = `${this.dominio}/api/products`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // del lado del cliente
  ) {}


  //get
  obtenerProductos(): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get(this.apiUrl);
    } else {
      // SSR: evitar hacer llamada HTTP y retornar datos vacíos o mock
      return of([]);
    }}

  //post
  /*agregarProducto(producto: any): Observable<any> {
    return this.http.post(this.apiUrl, producto).pipe(
      catchError(this.handleError)
    );
  }*/

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo de nuevo más tarde.'));
  }

}
