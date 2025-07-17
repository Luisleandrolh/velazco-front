import { Component, type OnInit } from '@angular/core';
import { DashboardService } from '../serivce/dashboard.service';
import { ChartData, ChartOptions } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // ========== CHART DATA & OPTIONS ==========
  salesChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  salesChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Ventas Diarias Totales',
        font: { size: 18 },
      },
      legend: { display: true, position: 'top' },
    },
    scales: {
      x: { title: { display: true, text: 'Fecha' } },
      y: {
        title: { display: true, text: 'Total de Ventas (S/)' },
        beginAtZero: true,
      },
    },
  };

  productPieData: ChartData<'pie'> = { labels: [], datasets: [] };
  productPieOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Top Productos Vendidos por Cantidad',
        font: { size: 18 },
      },
      legend: { position: 'right' },
    },
  };

  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Comparativa Semanal', font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  salesByWeekdayChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  salesByWeekdayChartOptions: ChartOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      title: {
        display: true,
        text: 'Total de Ventas por Día de la Semana (S/)',
        font: { size: 18 },
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const index = ctx.dataIndex;
            const detail = this.salesByDayDetails?.[index];
            if (!detail) return '';
            return [
              `Fecha: ${detail.date}`,
              `Cantidad de Ventas: ${detail.salesCount}`,
              `Total Vendido: S/ ${detail.totalSales.toFixed(2)}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        title: { display: true },
        grid: {
          display: true,
          drawBorder: true,
          drawTicks: true,
          color: 'transparent',
        },
      },
      x: {
        title: { display: true, text: 'Total en Ventas (S/)' },
        beginAtZero: true,
        min: 0,
        max: 1600,
        ticks: { stepSize: 200 },
        grid: {
          display: true,
          drawBorder: true,
          drawTicks: true,
          color: 'transparent',
        },
      },
    },
  };

  weeklyChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  weeklyChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Ventas Semanales (último mes)',
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const d = this.weeklyTooltipData[ctx.dataIndex];
            return [
              `Semana: ${d.weekLabel}`,
              `Total vendido: S/ ${d.totalSales.toFixed(2)}`,
              `Día más activo: ${d.topDay} (S/ ${d.topDayTotal.toFixed(2)})`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Semanas' },
        grid: {
          display: true,
          drawBorder: true,
          drawTicks: true,
          color: 'transparent',
        },
      },
      y: {
        title: { display: true, text: 'Total vendido (S/)' },
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: true,
          drawTicks: true,
          color: 'transparent',
        },
      },
    },
  };

  // ======== PAYMENT SUMMARY BAR CHART ========
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Pagos por método' }] };
  barChartOptions: ChartOptions<'bar'> = { responsive: true, plugins: { title: { display: true, text: 'Resumen de Pagos por Método' }, legend: { position: 'top' } } };


  // ========== DATA PROPERTIES ==========
  weeklyTooltipData: WeeklyTooltip[] = [];
  resumenProductos: TopProduct[] = [];
  salesByDayDetails: {
    date: string;
    salesCount: number;
    totalSales: number;
  }[] = [];
  lowStockProducts: LowStockProduct[] = [];
  lowStockLoading = true;

  // Propiedades adicionales para cálculos locales
  localProductSummary: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDailySales();
    this.loadWeeklySales();
    this.loadTopProducts();
    this.loadLowStockProducts();
        this.loadPaymentSummary(); // load payment summary

  }


  // ======== PAYMENT SUMMARY PIE CHART ========
// ======== PAYMENT SUMMARY PIE CHART ========
paymentPieData: ChartData<'pie'> = {
  labels: [],
  datasets: [{
    data: [],
    label: 'Pagos por Método',
    backgroundColor: ['#FFD600','#F4511E','#2196F3'] // uno por método
  }]
};

paymentPieOptions: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Resumen de Pagos por Método'
    },
    legend: {
      position: 'bottom'    // leyenda abajo
    },
    tooltip: {
      callbacks: {
        label: ctx => {
          const v = ctx.parsed as number;
          const total = (ctx.chart.data.datasets[0].data as number[])
            .reduce((sum,n) => sum + n, 0);
          const pct = ((v/total)*100).toFixed(1);
          return `${ctx.label}: S/ ${v} (${pct}%)`;
        }
      }
    }
  }
};

    // ========== NEW METHOD: Load Payment Summary ==========
private loadPaymentSummary(): void {
  this.dashboardService.getPaymentSummary().subscribe({
    next: data => {
      data.sort((a, b) => b.totalSales - a.totalSales);
      this.paymentPieData.labels = data.map(d => d.paymentMethod);
      this.paymentPieData.datasets[0].data = data.map(d => d.totalSales);
    },
    error: err => console.error(err)
  });
}
  // ========== MÉTODOS DE CARGA DE DATOS ==========
  private loadDailySales(): void {
    this.dashboardService.getDailySales().subscribe((data) => {
      const labels: string[] = [];
      const totals: number[] = [];
      const pieMap: { [product: string]: number } = {};
      const resumenMap: {
        [product: string]: { quantity: number; subtotal: number };
      } = {};

      // Configurar arrays para días de la semana
      const dayLabels = [
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo',
      ];
      const salesByDay: number[] = [0, 0, 0, 0, 0, 0, 0];
      this.salesByDayDetails = [];

      data.forEach((sale) => {
        labels.push(sale.date);
        totals.push(sale.totalSales);

        // Procesar productos para el pie chart y resumen
        sale.products.forEach((p) => {
          pieMap[p.productName] = (pieMap[p.productName] || 0) + p.quantitySold;
          if (!resumenMap[p.productName]) {
            resumenMap[p.productName] = { quantity: 0, subtotal: 0 };
          }
          resumenMap[p.productName].quantity += p.quantitySold;
          resumenMap[p.productName].subtotal += p.subtotal;
        });

        // Procesar ventas por día de la semana
        const date = new Date(sale.date);
        const index = date.getDay() === 0 ? 6 : date.getDay() - 1;
        salesByDay[index] += sale.totalSales;
        this.salesByDayDetails[index] = {
          date: sale.date,
          salesCount: (sale as LocalDailySalesResponse).salesCount || 0,
          totalSales: sale.totalSales,
        };
      });

      // Configurar gráfico de barras de ventas diarias
      this.salesChartData = {
        labels,
        datasets: [
          {
            label: 'Total vendido por día',
            data: totals,
            backgroundColor: '#4CAF50',
          },
        ],
      };

      // Configurar gráfico de líneas
      this.lineChartData = {
        labels,
        datasets: [
          {
            label: 'Ventas semanales',
            data: totals,
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66,165,245,0.2)',
            fill: true,
            tension: 0.3,
          },
        ],
      };

      // Configurar pie chart con top 5 productos (cálculo local)
      const top5 = Object.entries(pieMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      this.productPieData = {
        labels: top5.map(([product]) => product),
        datasets: [
          {
            data: top5.map(([, quantity]) => quantity),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#81C784',
              '#9575CD',
            ],
          },
        ],
      };

      // Configurar resumen local de productos
      this.localProductSummary = Object.entries(resumenMap).map(
        ([productName, info]) => ({
          productName,
          ...info,
        })
      );

      // Configurar gráfico de ventas por día de la semana
      this.salesByWeekdayChartData = {
        labels: dayLabels,
        datasets: [
          {
            label: 'Total de Ventas (S/)',
            data: salesByDay,
            backgroundColor: '#FF9800',
          },
        ],
      };
    });
  }

  private loadWeeklySales(): void {
    this.dashboardService.getWeeklySalesDetails().subscribe((weeks) => {
      const diasSemanaES: Record<string, string> = {
        MONDAY: 'Lunes',
        TUESDAY: 'Martes',
        WEDNESDAY: 'Miércoles',
        THURSDAY: 'Jueves',
        FRIDAY: 'Viernes',
        SATURDAY: 'Sábado',
        SUNDAY: 'Domingo',
      };

      const labels = weeks.map((_, i) => `Semana ${i + 1}`);
      const totals = weeks.map((w) => w.totalSales);

      // Configurar datos para tooltips detallados
      this.weeklyTooltipData = weeks.map((w, i) => {
        const daySums: Record<string, number> = {};
        w.orders.forEach((o) => {
          daySums[o.dayOfWeek] = (daySums[o.dayOfWeek] || 0) + o.orderTotal;
        });
        const [topDay, topSum] = Object.entries(daySums).sort(
          (a, b) => b[1] - a[1]
        )[0] || ['-', 0];

        return {
          weekLabel: `Semana ${i + 1}`,
          totalSales: w.totalSales,
          topDay: diasSemanaES[topDay] || topDay,
          topDayTotal: topSum,
        };
      });

      // Configurar gráfico semanal
      this.weeklyChartData = {
        labels,
        datasets: [
          {
            label: 'Ventas semanales',
            data: totals,
            backgroundColor: '#42A5F5',
          },
        ],
      };
    });
  }

  private loadTopProducts(): void {
    this.dashboardService.getTopProducts().subscribe({
      next: (topProducts) => {
        // Usar datos del endpoint si están disponibles
        this.resumenProductos = topProducts;

        const labels = topProducts.map((p) => p.productName);
        const quantities = topProducts.map((p) => p.totalQuantitySold);

        this.productPieData = {
          labels,
          datasets: [
            {
              data: quantities,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#81C784',
                '#9575CD',
                '#4DD0E1',
                '#F06292',
                '#BA68C8',
                '#FFD54F',
                '#4DB6AC',
              ],
            },
          ],
        };
      },
      error: (error) => {
        console.warn(
          'Error loading top products from endpoint, using local calculation:',
          error
        );
        // Fallback: usar cálculo local si el endpoint falla
        this.resumenProductos = this.localProductSummary.map((item) => ({
          productName: item.productName,
          totalQuantitySold: item.quantity,
          totalRevenue: item.subtotal,
        }));
      },
    });
  }

  private loadLowStockProducts(): void {
    this.dashboardService.getLowStockProducts().subscribe({
      next: (products) => {
this.lowStockProducts = products.products;
        this.lowStockLoading = false;
      },
      error: (error) => {
        console.error('Error loading low stock products:', error);
        this.lowStockLoading = false;
      },
    });
  }

  // ========== GENERACIÓN DE PDF ==========
  generateDailySalesPDF(): void {
    this.dashboardService.getDailySales().subscribe((data) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Reporte Diario de Ventas', 14, 15);

      let startY = 25;

      data.forEach((sale) => {
        doc.setFontSize(12);
        doc.text(`Fecha: ${sale.date}`, 14, startY);
        doc.text(
          `Total Vendido: S/ ${sale.totalSales.toFixed(2)}`,
          14,
          startY + 7
        );

        const productData = sale.products.map((p) => [
          p.productName,
          p.quantitySold,
          `S/ ${p.unitPrice.toFixed(2)}`,
          `S/ ${p.subtotal.toFixed(2)}`,
        ]);

        autoTable(doc, {
          startY: startY + 12,
          head: [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
          body: productData,
          theme: 'striped',
          styles: { fontSize: 10 },
          headStyles: { fillColor: [100, 100, 255] },
        });

        startY = (doc as any).lastAutoTable.finalY + 10;

        if (startY > 250) {
          doc.addPage();
          startY = 25;
        }
      });

      doc.save('reporte-diario-ventas.pdf');
    });
  }

  // ========== MÉTODOS AUXILIARES ==========
  getProductSummary(): any[] {
    return this.resumenProductos.length > 0
      ? this.resumenProductos
      : this.localProductSummary;
  }
}

// ========== INTERFACES ==========
interface LocalDailySalesResponse {
  date: string;
  totalSales: number;
  salesCount: number;
  products: {
    productName: string;
    quantitySold: number;
    unitPrice: number;
    subtotal: number;
  }[];
}

interface WeeklyTooltip {
  weekLabel: string;
  totalSales: number;
  topDay: string;
  topDayTotal: number;
}

interface WeeklySalesResponse {
  startDate: string;
  endDate: string;
  totalSales: number;
  salesCount: number;
  orders: {
    orderId: number;
    deliveryDate: string;
    dayOfWeek: string;
    orderTotal: number;
    products: any[];
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

interface PaymentSummary { // Add PaymentSummary interface here
  paymentMethod: string;
  totalSales: number;
  percentage: number;
}
