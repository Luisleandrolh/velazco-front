import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DailySalesResponse {
  date: string;
  totalSales: number;
  salesCount?: number;
  products: {
    productName: string;
    quantitySold: number;
    unitPrice: number;
    subtotal: number;
  }[];
}

interface WeeklySalesDetailResponse {
  startDate: string;
  endDate: string;
  totalSales: number;
  salesCount: number;
  orders: {
    orderId: number;
    deliveryDate: string;
    dayOfWeek: string;
    orderTotal: number;
    products: {
      productName: string;
      quantitySold: number;
      unitPrice: number;
      subtotal: number;
    }[];
  }[];
}

interface TopProduct {
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private dailySalesUrl =
    'https://velazco-backend-develop.up.railway.app/api/orders/daily-sales/details';
  private weeklySalesUrl =
    'https://velazco-backend-develop.up.railway.app/api/orders/weekly-sales/details';
  private topProductsUrl =
    'https://velazco-backend-develop.up.railway.app/api/orders/top-products/month';

  private lowStockUrl =
    'https://velazco-backend-develop.up.railway.app/api/products/low-stock';

  constructor(private http: HttpClient) {}

  getDailySales(): Observable<DailySalesResponse[]> {
    return this.http.get<DailySalesResponse[]>(this.dailySalesUrl);
  }

  getWeeklySalesDetails(): Observable<WeeklySalesDetailResponse[]> {
    return this.http.get<WeeklySalesDetailResponse[]>(this.weeklySalesUrl);
  }

  getTopProducts(): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(this.topProductsUrl);
  }

  getLowStockProducts(): Observable<LowStockProduct[]> {
    return this.http.get<LowStockProduct[]>(this.lowStockUrl);
  }
}
