import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductionService } from '../service/production.service';

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
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarOrdenDelDia();
    this.cargarenProceso();
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
        console.error(`Error al finalizar producción con ID ${orden.id}:`, err);
      }
    });
  }

  marcarIncompletoUI(orden: any, detalle: any): void {
    this.ordenSeleccionada = orden;
    this.detalleSeleccionado = detalle;
    this.motivoIncompleto = '';
    this.cantidadProducida = 0;
    this.mostrarFormularioIncompleto = true;
  }

  cerrarModal(): void {
    this.mostrarFormularioIncompleto = false;
    this.motivoIncompleto = '';
    this.cantidadProducida = 0;
    this.ordenSeleccionada = null;
    this.detalleSeleccionado = null;
  }

  marcarIncompleto(orden: any, detalle: any): void {
    if (!this.motivoIncompleto || this.cantidadProducida == null) {
      alert('Debes completar todos los campos');
      return;
    }

    const existeProducto = orden.details.some(
      (d: any) => d.product.id === detalle.product.id
    );

    if (!existeProducto) {
      alert(" El producto seleccionado no pertenece a esta orden de producción.");
      return;
    }

    if (this.cantidadProducida > detalle.requestedQuantity) {
      alert('La cantidad producida no puede ser mayor que la solicitada.');
      return;
    }

    const body = {
      productos: [
        {
          productId: detalle.product.id,
          producedQuantity: this.cantidadProducida,
          motivoIncompleto: this.motivoIncompleto
        }
      ]
    };

    this.productionService.finalizarProduccion(orden.id, body).subscribe({
      next: () => {
        this.cargarenProceso();
        this.cerrarModal();
      },
      error: (err) => {
        console.error(` Error al marcar incompleto producción ${orden.id}:`, err);
      }
    });
  }
}
