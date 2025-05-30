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

    // GET - Obtener pedidos por estado con paginación
  obtenerPedidosPorEstado(
    estado: string, 
    pagina: number = 0, 
    tamanio: number = 10
  ): Observable<any> {
    const url = `${this.apiUrl}/status/${estado}`;
    const params = {
      page: pagina.toString(),
      size: tamanio.toString()
    };

    return this.http.get(url, { params }).pipe(
      catchError(this.handleError)
    );
  }


 confirmarVenta(pedidoId: string, datosPago: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/${pedidoId}/confirm-sale`, datosPago).pipe(
    catchError(this.handleError)
  );
}
cancelarVenta(pedidoId: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/${pedidoId}/cancel-sale`, {}).pipe(
    catchError(this.handleError)
  );
}


  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo de nuevo más tarde.'));
  }
}
