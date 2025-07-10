import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DailySalesResponse {
  date: string;
  totalSales: number;
  products: {
    productName: string;
    quantitySold: number;
    unitPrice: number;
    subtotal: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://velazco-backend-develop.up.railway.app/api/orders/daily-sales/details';

  constructor(private http: HttpClient) {}

  getDailySales(): Observable<DailySalesResponse[]> {
    return this.http.get<DailySalesResponse[]>(this.apiUrl);
  }
}
