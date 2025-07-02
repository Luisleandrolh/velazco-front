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
export class OrdenProduccionService {
  constructor(private http: HttpClient) {}

  getAllProductions(): Observable<any> {
    return this.http.get(`${BASE_URL}/productions`, AUTH_HEADER);
  }

  getProducts(): Observable<any> {
    return this.http.get(`${BASE_URL}/products`, AUTH_HEADER);
  }

  createProduction(production: any): Observable<any> {
    return this.http.post(`${BASE_URL}/productions`, production, AUTH_HEADER);
  }

  updateProduction(id: number, production: any): Observable<any> {
    return this.http.put(`${BASE_URL}/productions/${id}`, production, AUTH_HEADER);
  }

  deleteProduction(id: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/productions/${id}`, AUTH_HEADER);
  }

  getHistorialProductions(): Observable<any> {
    return this.http.get(`${BASE_URL}/productions/historial`, AUTH_HEADER);
  }
}
