import { Component, OnInit } from '@angular/core';
import { ProductionService } from '../service/production.service';

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.css']
})
export class ProduccionComponent implements OnInit {
  producciones: any[] = [];
  historial: any[] = [];

  constructor(private productionService: ProductionService) {}

  ngOnInit(): void {
    this.cargarProduccionPendiente();
    this.cargarHistorial();
  }

  // Cargar órdenes pendientes (usa /api/productions/pending)
  cargarProduccionPendiente(): void {
    this.productionService.getDailyProduction().subscribe({
      next: (data) => {
        this.producciones = data.map((orden: any) => ({
          ...orden,
          orderNumber: `OP-${orden.id}`
        }));
      },
      error: (err) => {
        console.error('❌ Error al cargar órdenes pendientes:', err);
      }
    });
  }

  iniciarOrdenProduccion(id: number): void {
    this.productionService.cambiarEstadoProduccion(id, 'EN_PROCESO').subscribe({
      next: () => {
        console.log(`✅ Producción iniciada para orden ID: ${id}`);
        this.cargarProduccionPendiente();
        this.cargarHistorial();
      },
      error: (err) => {
        console.error(`❌ Error al iniciar producción con ID ${id}:`, err);
      }
    });
  }

  tieneOrdenesEnProceso(): boolean {
    return this.historial.some(o => o.status === 'EN_PROCESO');
  }

  // Cargar historial (incluye órdenes EN_PROCESO)
  cargarHistorial(): void {
  this.productionService.getProductionHistory().subscribe({
    next: (data) => {
      this.historial = data.map((orden: any) => ({
        ...orden,
        orderNumber: `OP-${orden.id}`
      }));
    },
    error: (err) => {
      console.error('Error al cargar historial de producción', err);
    }
  });
}


  // Iniciar producción por orden individual
  
}
