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
  details: any[]; // Mejor tipar según estructura real
}

export interface RespuestaPedidos { //define como llega la rpta de la API con un arreglo de pedidos
  content: Pedido[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({  //marcar una clase como servicio
  providedIn: 'root'
})

export class OrdersModuleService { // servicio para manejar las solicitudes http relacionado con pedidos.
  private dominio: string = environment.baseUrlApi; //Define el dominio o la URL base del backend.
  private apiUrl: string = `${this.dominio}/api/orders`; //Define la ruta completa que incluye la URL base y el endpoint de la API de pedidos.

  constructor(private http: HttpClient) { } //inyecta un objeto del servicio httpclient en la clase

  obtenerPedidosPorEstado(estado: string, pagina: number = 0, tamanio: number = 10): Observable<RespuestaPedidos> { 
    const url = `${this.apiUrl}/status/${estado}`; //es la url en donde se hace la solicitud de la api
    const params = { page: pagina.toString(), size: tamanio.toString() }; //muestra 10 pedidos por pagina

    return this.http.get<RespuestaPedidos>(url, { params }).pipe( //emitirá la respuesta con los pedidos y los datos de paginación cuando esté disponible
      catchError(this.handleError)
    );
  }



  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo de nuevo más tarde.'));
  }
confirmarVenta(id: string, datosPago: any): Observable<any> {
  const url = `${this.apiUrl}/${id}/confirm-sale`;
  return this.http.post(url, datosPago).pipe(
    catchError(this.handleError)
  );
}

  
}
