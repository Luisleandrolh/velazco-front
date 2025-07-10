import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../serivce/dashboard.service';
import { ChartData, ChartOptions } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Gráfico de barras: Ventas diarias
  salesChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  salesChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Ventas Diarias Totales', font: { size: 18 } },
      legend: { display: true, position: 'top' }
    },
    scales: {
      x: { title: { display: true, text: 'Fecha' } },
      y: { title: { display: true, text: 'Total de Ventas (S/)' }, beginAtZero: true }
    }
  };

  // Gráfico de torta: Top productos por cantidad
  productPieData: ChartData<'pie'> = { labels: [], datasets: [] };
  productPieOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Top Productos Vendidos por Cantidad', font: { size: 18 } },
      legend: { position: 'right' }
    }
  };

  // Gráfico de línea: ventas semanales
  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Comparativa Semanal', font: { size: 18 } }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  // Tabla resumen de productos
  resumenProductos: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDailySales().subscribe(data => {
      const labels: string[] = [];
      const totals: number[] = [];

      const pieMap: { [product: string]: number } = {};
      const resumenMap: { [product: string]: { quantity: number, subtotal: number } } = {};

      data.forEach(sale => {
        labels.push(sale.date);
        totals.push(sale.totalSales);

        sale.products.forEach(p => {
          // Acumulamos para pie chart
          pieMap[p.productName] = (pieMap[p.productName] || 0) + p.quantitySold;

          // Acumulamos para tabla resumen
          if (!resumenMap[p.productName]) {
            resumenMap[p.productName] = { quantity: 0, subtotal: 0 };
          }
          resumenMap[p.productName].quantity += p.quantitySold;
          resumenMap[p.productName].subtotal += p.subtotal;
        });
      });

      // ----------------------------
      // Gráfico de barras: ventas diarias
      // ----------------------------
      this.salesChartData = {
        labels,
        datasets: [
          {
            label: 'Total vendido por día',
            data: totals,
            backgroundColor: '#4CAF50'
          }
        ]
      };

      // ----------------------------
      // Gráfico de línea: evolución semanal
      // ----------------------------
      this.lineChartData = {
        labels,
        datasets: [
          {
            label: 'Ventas semanales',
            data: totals,
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66,165,245,0.2)',
            fill: true,
            tension: 0.3
          }
        ]
      };

      // ----------------------------
      // Gráfico de pie: Top 5 productos
      // ----------------------------
      const top5 = Object.entries(pieMap)
        .sort((a, b) => b[1] - a[1]) // ordenar por cantidad descendente
        .slice(0, 5); // solo los 5 primeros

      this.productPieData = {
        labels: top5.map(([product]) => product),
        datasets: [
          {
            data: top5.map(([, quantity]) => quantity),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#81C784', '#9575CD']
          }
        ]
      };

      // ----------------------------
      // Tabla resumen de productos
      // ----------------------------
      this.resumenProductos = Object.entries(resumenMap).map(([productName, info]) => ({
        productName,
        ...info
      }));
    });
  }

  generateDailySalesPDF(): void {
  this.dashboardService.getDailySales().subscribe(data => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte Diario de Ventas', 14, 15);

    let startY = 25;

    data.forEach(sale => {
      doc.setFontSize(12);
      doc.text(`Fecha: ${sale.date}`, 14, startY);
      doc.text(`Total Vendido: S/ ${sale.totalSales.toFixed(2)}`, 14, startY + 7);

      const productData = sale.products.map(p => [
        p.productName,
        p.quantitySold,
        `S/ ${p.unitPrice.toFixed(2)}`,
        `S/ ${p.subtotal.toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: startY + 12,
        head: [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
        body: productData,
        theme: 'striped',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [100, 100, 255] }
      });

      startY = (doc as any).lastAutoTable.finalY + 10;

      // Evita que el contenido se corte
      if (startY > 250) {
        doc.addPage();
        startY = 25;
      }
    });

    doc.save('reporte-diario-ventas.pdf');
  });
}

}
