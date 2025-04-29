import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Datos del dashboard
  dashboardData = {
    dailySales: 4231.89,
    dailySalesChange: 20.1,
    dailyOrders: 42,
    dailyOrdersChange: 12,
    productionRate: 85,
    lowStockItems: 7,
    criticalStockItems: [
      { product: 'Harina de Trigo', current: '5 kg', minimum: '20 kg', status: 'Crítico' },
      { product: 'Azúcar', current: '3 kg', minimum: '15 kg', status: 'Crítico' },
      { product: 'Chocolate en Polvo', current: '2 kg', minimum: '10 kg', status: 'Crítico' }
    ]
  };

  // Configuración gráfico de ventas semanales
  public weeklySalesChartData: ChartConfiguration['data'] = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Ventas Semanales (S/)',
      data: [1500, 2100, 3200, 2800, 4000, 3000, 2500],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      tension: 0.4
    }]
  };

  public weeklySalesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public weeklySalesChartType: ChartType = 'line';

  // Configuración gráfico de métodos de pago
  public paymentMethodsChartData: ChartData<'doughnut'> = {
    labels: ['Efectivo', 'Tarjeta', 'Yape', 'Plin'],
    datasets: [{
      data: [40, 35, 15, 10],
      backgroundColor: [
        '#4CAF50',
        '#2196F3',
        '#FF9800',
        '#9E9E9E'
      ]
    }]
  };

  public paymentMethodsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false, // Esto permite controlar el tamaño
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10, // Hace más pequeños los cuadros de la leyenda
          font: {
            size: 10 // Tamaño de fuente más pequeño
          }
        }
      }
    },
    // Tamaño reducido del gráfico
    layout: {
      padding: {
        top: 10,
        bottom: 10
      }
    }
  };

  public paymentMethodsChartType: ChartType = 'doughnut';

  // Configuración gráfico de productos más vendidos
  public topProductsChartData: ChartConfiguration['data'] = {
    labels: ['Torta Chocolate', 'Pan Francés', 'Cupcake Vainilla', 'Galleta Mantequilla', 'Pastel Tres Leches'],
    datasets: [{
      label: 'Unidades Vendidas',
      data: [120, 90, 85, 75, 65],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  public topProductsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  public topProductsChartType: ChartType = 'bar';

  // Configuración gráfico de producción
  public productionChartData: ChartConfiguration['data'] = {
    labels: ['Tortas', 'Pasteles', 'Galletas', 'Cupcakes', 'Panes'],
    datasets: [{
      label: 'Cumplimiento (%)',
      data: [90, 85, 75, 95, 60],
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1
    }]
  };

  public productionChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  public productionChartType: ChartType = 'bar';

  constructor() { }

  ngOnInit(): void {
  }

  // Métodos auxiliares
  getChangeIcon(change: number): string {
    return change >= 0 ? '↑' : '↓';
  }

  getChangeClass(change: number): string {
    return change >= 0 ? 'positive-change' : 'negative-change';
  }

  getProgressColor(value: number): string {
    if (value < 60) return 'warn';
    if (value < 85) return 'accent';
    return 'primary';
  }
}