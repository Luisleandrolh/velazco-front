import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductionService } from '../service/production.service';
import { RealtimeService } from 'src/app/services/realtime.service'; // Ajusta la ruta si es necesario


@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.css']
})
export class ProduccionComponent implements OnInit {
  ordenDelDia: any = null;
  enProceso: any[] = [];

  modalIniciarVisible: boolean = false;
  ordenSeleccionada: any = null;
  vistaActiva: number = 0;

  @ViewChild('modalFinalizarProduccion') modalFinalizarProduccion!: TemplateRef<any>;

  constructor(
    private productionService: ProductionService,
    private dialog: MatDialog,
      private realtimeService: RealtimeService // 👈

  ) {}

  ngOnInit(): void {
    this.cargarOrdenDelDia();
    this.cargarenProceso();
      this.escucharEventosProduccionTiempoReal(); // 👈

  }

  escucharEventosProduccionTiempoReal(): void {
  const url = 'https://velazco-realtime-service-develop.up.railway.app/sse/events';

  this.realtimeService.listenToEvent('production.finalized', url).subscribe({
    next: ({ data }) => {
      console.log('✅ Orden finalizada (tiempo real):', data);

      // Recargar datos en pantalla
      this.cargarOrdenDelDia();
      this.cargarenProceso();
    },
    error: (err) => {
      console.error('❌ Error en SSE [production.finalized]:', err);
    }
  });
}


  cambiarPestana(index: number): void {
    this.vistaActiva = index;
  }

  cargarOrdenDelDia(): void {
    this.productionService.getProduccionDelDia().subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          const orden = data[0];
          console.log('Orden del día recibida:', orden);
          this.ordenDelDia = {
            ...orden,
            orderNumber: `OP-${orden.id}`
          };
        } else {
          this.ordenDelDia = null;
          console.warn('No se encontró orden del día.');
        }
      },
      error: (err) => {
        console.error('Error al cargar la orden del día:', err);
      }
    });
  }

  abrirModalIniciarProduccion(): void {
    this.modalIniciarVisible = true;
  }

  cerrarModalIniciar(): void {
    this.modalIniciarVisible = false;
  }

  confirmarInicioProduccion(): void {
    if (!this.ordenDelDia?.id) return;

    this.productionService.cambiarEstadoProduccion(this.ordenDelDia.id, 'EN_PROCESO').subscribe({
      next: () => {
        this.modalIniciarVisible = false;
        this.cargarOrdenDelDia();
        this.cargarenProceso();
      },
      error: (err) => {
        console.error('Error al cambiar estado de la producción:', err);
      }
    });
  }

  cargarenProceso(): void {
    this.productionService.getProduccionesEnProceso().subscribe({
      next: (data) => {
        this.enProceso = data.map((orden: any) => ({
          ...orden,
          orderNumber: `OP-${orden.id}`
        }));
      },
      error: (err) => {
        console.error('Error al cargar órdenes en proceso:', err);
      }
    });
  }

  OrdenesEnProceso(): boolean {
    return this.enProceso.some(o => o.status === 'EN_PROCESO');
  }

  abrirModalFinalizarProduccion(): void {
    const ordenActiva = this.enProceso.find(o => o.status === 'EN_PROCESO');
    if (!ordenActiva) return;

    this.ordenSeleccionada = {
      ...ordenActiva,
      details: ordenActiva.details.map((detalle: any) => ({
        ...detalle,
        estado: 'completado',
        cantidadProducida: detalle.requestedQuantity,
        motivoIncompleto: 'Terminado'
      }))
    };

    this.dialog.open(this.modalFinalizarProduccion, {
      width: '800px',
      data: {}
    });
  }

  confirmarFinalizarProduccion(): void {
    if (!this.ordenSeleccionada) return;

    const productos = this.ordenSeleccionada.details.map((detalle: any) => {
      if (detalle.estado === 'completado') {
        return {
          productId: detalle.product.id,
          producedQuantity: detalle.requestedQuantity,
          motivoIncompleto: 'Terminado'
        };
      } else {
        return {
          productId: detalle.product.id,
          producedQuantity: detalle.cantidadProducida,
          motivoIncompleto: detalle.motivoIncompleto || 'Sin motivo especificado'
        };
      }
    });

    const body = { productos };

    this.productionService.finalizarProduccion(this.ordenSeleccionada.id, body).subscribe({
      next: () => {
        this.dialog.closeAll();
        this.cargarenProceso();
        this.cargarOrdenDelDia();
      },
      error: (err) => {
        console.error('Error al finalizar producción:', err);
      }
    });
  }
}
