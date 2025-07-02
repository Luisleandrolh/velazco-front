import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface Dispatch {
  id: number;
  deliveryDate: string;
  dispatchedBy: {
    id: number;
    name: string;
  };
}

interface OrderDeliveryPayload {
  id: number;
  date: string;
  clientName: string;
  status: 'ENTREGADO';
  dispatch: Dispatch;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveriesModuleService {
  private dominio: string = environment.baseUrlApi;
  private apiUrl: string = `${this.dominio}/api/orders`;

  constructor(private http: HttpClient) {}

  obtenerPedidosPorEstado(estado: string, page = 0, size = 10): Observable<any> {
    const url = `${this.apiUrl}/status/${estado}?page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }

  confirmDelivery(id: number, body: OrderDeliveryPayload): Observable<any> {
    const url = `${this.apiUrl}/${id}/confirm-dispatch`;
    return this.http.post(url, body);
  }

  filtrarPedidos(
    status: string,
    orderId?: number,
    clientName?: string,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());
  
    if (orderId !== undefined) {
      params = params.set('orderId', orderId.toString());
    }
  
    if (clientName) {
      params = params.set('clientName', clientName);
    }
  
    const url = `${this.apiUrl}/api/orders/filter`;
    return this.http.get(url, { params });
  }
  
}
