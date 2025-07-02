import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = 'https://velazco-backend-develop.up.railway.app/api';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  constructor(private http: HttpClient) {}

  // Obtener órdenes pendientes (del día)
  getDailyProduction(): Observable<any> {
    return this.http.get(`${BASE_URL}/productions/pending`);
  }

  // Cambiar el estado de una orden de producción individual
  cambiarEstadoProduccion(id: number, nuevoEstado: string): Observable<any> {
  return this.http.patch(`${BASE_URL}/productions/${id}/status`, { nuevoEstado });
}

  // Obtener historial completo de producción
  getProductionHistory(): Observable<any> {
    return this.http.get(`${BASE_URL}/productions/history`);
  }

}
