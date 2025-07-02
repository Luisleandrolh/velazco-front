import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = 'https://velazco-backend-develop.up.railway.app/api';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  constructor(private http: HttpClient) {}

  getDailyProduction(): Observable<any> {
    return this.http.get(`${BASE_URL}/productions/pending`);
  }

  getProduccionesEnProceso(): Observable<any> {
    return this.http.get(`${BASE_URL}/productions/in-process`);
  }

  cambiarEstadoProduccion(id: number, nuevoEstado: string): Observable<any> {
    return this.http.patch(`${BASE_URL}/productions/${id}/status`, {
      nuevoEstado: nuevoEstado
    });
  }

  finalizarProduccion(id: number, body: any): Observable<any> {
  return this.http.patch(`${BASE_URL}/productions/${id}/finalizar`, body);
}

}
