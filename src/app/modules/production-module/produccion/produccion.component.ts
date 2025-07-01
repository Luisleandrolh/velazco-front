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
  productosDelDia: any[] = [];

  mostrarModal: boolean = false;

  constructor(private productionService: ProductionService) {}

  ngOnInit(): void {
    this.cargarProduccionDelDia();
    this.cargarHistorial(); // borrar posiblemente ya que no muestra nada
  }

  cargarProduccionDelDia(): void {
    this.productionService.getDailyProduction().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.producciones = data.map((p: any) => ({
            ...p,
            orderNumber: `OP-${p.id}`
          }));

          // Extraer todos los productos del día para mostrar en el modal
          this.productosDelDia = this.producciones.flatMap((orden: any) =>
            orden.details.map((detalle: any) => ({
              nombre: detalle.product.name,
              cantidad: detalle.requestedQuantity,
              orden: `OP-${orden.id}`
            }))
          );
        } else {
          this.producciones = [];
          this.productosDelDia = [];
        }
      },
      error: (err) => {
        console.error('❌ Error al cargar producción del día:', err);
      }
    });
  }

  cargarHistorial(): void {
  this.productionService.getProductionHistory().subscribe({
    next: (data) => {
      // Asegura que cada orden tenga el número de orden formateado
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


  abrirModalIniciar(): void {
    this.mostrarModal = true;
  }

  cerrarModalIniciar(): void {
    this.mostrarModal = false;
  }

  iniciarProduccion(): void {
  const idsPendientes = this.producciones
    .filter(p => p.status === 'PENDIENTE')
    .map(p => p.id);

  let completadas = 0;

  idsPendientes.forEach(id => {
    this.productionService.iniciarProduccion(id).subscribe({
      next: () => {
        completadas++;
        // Cuando todos los PUT terminen, recargar listas
        if (completadas === idsPendientes.length) {
          this.cargarProduccionDelDia();  // recargar producciones del día
          this.cargarHistorial();         // recargar historial con los nuevos EN_PROCESO
        }
      },
      error: (err) => {
        console.error(`❌ Error al iniciar producción con ID ${id}`, err);
      }
    });
  });

  this.cerrarModalIniciar(); // cerrar modal inmediatamente
}

tieneOrdenesEnProceso(): boolean {
  return this.historial?.some(o => o.status === 'EN_PROCESO');
}

}
