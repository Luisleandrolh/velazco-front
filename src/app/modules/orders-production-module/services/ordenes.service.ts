import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = 'https://velazco-backend-develop.up.railway.app/api';

@Injectable({ providedIn: 'root' })
export class OrdenProduccionService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token'); 
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  
  // Órdenes
  getPendingProductions(): Observable<any> {
    return this.http.get(`${BASE_URL}/productions/pending`, this.getAuthHeaders());
  }

  getHistorialProductions(): Observable<any> {
    return this.http.get(`${BASE_URL}/productions/historial`, this.getAuthHeaders());
  }

  createProduction(production: any): Observable<any> {
    return this.http.post(`${BASE_URL}/productions`, production, this.getAuthHeaders());
  }

  updateProduction(id: number, production: any): Observable<any> {
    return this.http.put(`${BASE_URL}/productions/${id}`, production, this.getAuthHeaders());
  }


  deleteProduction(id: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/productions/${id}`, this.getAuthHeaders());
  }

  // Productos
  getProducts(): Observable<any> {
    return this.http.get(`${BASE_URL}/products`, this.getAuthHeaders());
  }
  // Detalles de la producción
   finalizeProduction(id: number): Observable<any> {
    return this.http.patch(`${BASE_URL}/productions/${id}/finalizar`, this.getAuthHeaders());
  }
  // Usuarios
  getUsers(): Observable<any> {
    return this.http.get(`${BASE_URL}/users`, this.getAuthHeaders());
  }
}