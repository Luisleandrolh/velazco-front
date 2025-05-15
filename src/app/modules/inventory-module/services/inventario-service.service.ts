import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioServiceService {

  private dominio: string = environment.baseUrlApi;
  private apiUrl: string = `${this.dominio}/api/products`;

  constructor(private http: HttpClient) { 
  }


  //get
  obtenerProductos(): Observable<any> {  //get
    return this.http.get(`${this.apiUrl}`).pipe( 
      catchError(this.handleError));
  }

  //post
  agregarProducto(producto: any): Observable<any> {
    return this.http.post(this.apiUrl, producto).pipe(
      catchError(this.handleError)
    );
  }

  
  // PUT: Actualizar producto por ID
actualizarProducto(id: number, producto: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, producto).pipe(
    catchError(this.handleError)
  );
}

// DELETE: Eliminar producto por ID
eliminarProducto(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`).pipe(
    catchError(this.handleError)
  );
}

// PATCH: Cambiar estado "active" del producto por ID
actualizarEstadoActivo(id: number, activo: boolean): Observable<any> {
  return this.http.patch(`${this.apiUrl}/${id}/active`, { active: activo }).pipe(
    catchError(this.handleError)
  );
}

// GET: Obtener productos disponibles
obtenerProductosDisponibles(): Observable<any> {
  return this.http.get(`${this.apiUrl}/available`).pipe(
    catchError(this.handleError)
  );}

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Hubo un problema con la solicitud. Inténtelo de nuevo más tarde.'));
  }

}
