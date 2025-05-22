import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersModuleService {
private dominio: string = environment.baseUrlApi;
  private apiUrl: string = `${this.dominio}/api/orders`;

  constructor(private http: HttpClient) { 
  }

//post
  crearPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/start`, pedido).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo de nuevo más tarde.'));
  }
}
