import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = 'https://velazco-backend-develop.up.railway.app/api';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  constructor(private http: HttpClient) {}

  // Obtener órdenes pendientes del día
  getDailyProduction(): Observable<any> {
    return this.http.get(`${BASE_URL}/productions/pending`);
  }

  // Obtener órdenes en proceso
  getProduccionesEnProceso(): Observable<any> {
    return this.http.get(`${BASE_URL}/productions/in-process`);
  }

  // Cambiar el estado de una orden de producción (PENDIENTE -> EN_PROCESO, o EN_PROCESO -> COMPLETO)
  cambiarEstadoProduccion(id: number, nuevoEstado: string): Observable<any> {
    return this.http.patch(`${BASE_URL}/productions/${id}/status`, {
      nuevoEstado: nuevoEstado
    });
  }

  // Finalizar producción como INCOMPLETA o COMPLETA
  finalizarProduccion(id: number, body: any): Observable<any> {
  return this.http.patch(`${BASE_URL}/productions/${id}/finalizar`, body);
}

}
