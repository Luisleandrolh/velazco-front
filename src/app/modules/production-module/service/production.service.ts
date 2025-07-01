import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = 'https://velazco-backend-develop.up.railway.app/api';
const AUTH_HEADER = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzQ3NDI3MDg1LCJleHAiOjE3NTg0MjcwODV9.CX_46TcslLoORPiVkoRw1Ig0uFYNfg6HnNGlMeJohl0'
  })
};

@Injectable({ providedIn: 'root' })
export class ProductionService {
  constructor(private http: HttpClient) {}

  // Producción del día
  getDailyProduction(): Observable<any> {
    return this.http.get(`${BASE_URL}/productions/daily`, AUTH_HEADER);
  }

  // Historial de órdenes de producción
  getProductionHistory(): Observable<any> {
    return this.http.get(`${BASE_URL}/productions/historial`, AUTH_HEADER);
  }

  // Iniciar producción
  iniciarProduccion(id: number): Observable<any> {
    return this.http.put(`${BASE_URL}/productions/${id}/iniciar`, {}, AUTH_HEADER);
  }
}
