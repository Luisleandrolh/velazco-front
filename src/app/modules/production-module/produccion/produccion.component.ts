import { Component, OnInit } from '@angular/core';
import { ProductionService } from '../service/production.service';

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.css']
})
export class ProduccionComponent implements OnInit {
  producciones: any[] = [];
  enProceso: any[] = [];

  mostrarFormularioIncompleto: boolean = false;
  motivoIncompleto: string = '';
  cantidadProducida: number = 0;
  ordenSeleccionada: any = null;
  detalleSeleccionado: any = null;

  constructor(private productionService: ProductionService) { }

  ngOnInit(): void {
    this.cargarProduccionPendiente();
    this.cargarenProceso();
  }

  cargarProduccionPendiente(): void {
    this.productionService.getDailyProduction().subscribe({
      next: (data) => {
        this.producciones = data.map((orden: any) => ({
          ...orden,
          orderNumber: `OP-${orden.id}`
        }));
      },
      error: (err) => {
        console.error('Error al cargar órdenes pendientes:', err);
      }
    });
  }

  iniciarOrdenProduccion(id: number): void {
    this.productionService.cambiarEstadoProduccion(id, 'EN_PROCESO').subscribe({
      next: () => {
        this.cargarProduccionPendiente();
        this.cargarenProceso();
      },
      error: (err) => {
        console.error(`Error al iniciar producción con ID ${id}:`, err);
      }
    });
  }

  OrdenesEnProceso(): boolean {
    return this.enProceso.some(o => o.status === 'EN_PROCESO');
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

  finalizarProduccion(orden: any): void {
    if (!orden || !orden.details || orden.details.length === 0) {
      alert("La orden no tiene detalles válidos.");
      return;
    }

    const productos: any[] = [];

    for (const detalle of orden.details) {
      const producto = detalle.product;
      const cantidadSolicitada = detalle.requestedQuantity;

      if (!producto || !producto.id) {
        alert(`Producto inválido en la orden ${orden.id}`);
        return;
      }

      if (cantidadSolicitada <= 0) {
        alert(`Cantidad solicitada inválida para el producto ${producto.name}`);
        return;
      }

      productos.push({
        productId: producto.id,
        producedQuantity: cantidadSolicitada,
        motivoIncompleto: "Terminado"
      });
    }

    const body = { productos };

    this.productionService.finalizarProduccion(orden.id, body).subscribe({
      next: () => {
        this.cargarenProceso();
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
