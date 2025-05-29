import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Pedido {
  id: number;
  date: string;
  clientName: string;
  status: string;
  attendedBy: {
    id: number;
    name: string;
  };
  details: any[]; // Puedes tipar mejor según estructura de detalles
}

export interface RespuestaPedidos {
  content: Pedido[];    // asumo que la API devuelve paginación estilo Spring Data
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;       // página actual
}

@Injectable({
  providedIn: 'root'
})
export class OrdersModuleService {
  private dominio: string = environment.baseUrlApi;
  private apiUrl: string = `${this.dominio}/api/orders`;

  constructor(private http: HttpClient) { }

  obtenerPedidosPorEstado(
    estado: string, 
    pagina: number = 0, 
    tamanio: number = 10
  ): Observable<RespuestaPedidos> {
    const url = `${this.apiUrl}/status/${estado}`;
    const params = {
      page: pagina.toString(),
      size: tamanio.toString()
    };

    return this.http.get<RespuestaPedidos>(url, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo de nuevo más tarde.'));
  }
}
