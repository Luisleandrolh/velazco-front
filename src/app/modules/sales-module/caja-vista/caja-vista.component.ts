import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog'; //importa la clase MatDialog para abrir los modales
import { DetallePedidoDialogComponent } from './detalle-pedido-dialog/detalle-pedido-dialog.component'; //importa el componenten que seria el modal
import { OrdersModuleService } from "../../orders-module/services/orders-module.service";
import Swal from 'sweetalert2';

export interface Pedido {
  codigo: string;
  cliente: string;
  total: number;
  fecha: string;
  hora: string;
  estado: 'Pendiente' | 'Pagado' | 'Cancelado';
  details?: DetallePedido[];
}

export interface DetallePedido {
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    name: string;
  };
}

@Component({
  selector: 'app-caja-vista',
  templateUrl: './caja-vista.component.html',
  styleUrls: ['./caja-vista.component.css']
})
export class CajaVistaComponent {
  filtro = '';
  tabIndex = 0;

  pedidosPendientes: Pedido[] = [];

  constructor(
    private dialog: MatDialog,
    private orderService: OrdersModuleService,
  ) { }

  ngOnInit(): void {
    this.cargarPedidosPorEstado();
  }

  cargarPedidosPorEstado() {
    const estadosMap = ['PENDIENTE', 'PAGADO', 'CANCELADO'];

    if (this.tabIndex === 3) {
      this.obtenerTodosPedidos();
    } else {
      this.orderService.obtenerPedidosPorEstado(estadosMap[this.tabIndex], 0, 10).subscribe({
        next: (data) => {
          this.pedidosPendientes = data.content.map((pedido: any) => ({
            codigo: pedido.id.toString(),
            cliente: pedido.clientName,
            total: pedido.details?.reduce((acc: number, det: any) => acc + ((det.unitPrice || 0) * (det.quantity || 0)), 0 ) || 0,
            fecha: new Date(pedido.date).toLocaleDateString(),
            hora: new Date(pedido.date).toLocaleTimeString(),
            estado: pedido.status === 'PENDIENTE' ? 'Pendiente' : pedido.status === 'PAGADO' ? 'Pagado' : 'Cancelado',
            details: pedido.details || [] // Necesario para mostrar detalles
          }));
        },
        error: (err) => console.error('Error al obtener pedidos:', err)
      });
    }
  }

  obtenerTodosPedidos() {
    const estados = ['PENDIENTE', 'PAGADO', 'CANCELADO'];
    const pedidosAcumulados: Pedido[] = [];
    let llamadasCompletadas = 0;

    estados.forEach(estado => {
      this.orderService.obtenerPedidosPorEstado(estado, 0, 10).subscribe({
        next: (data) => {
          const pedidosMapeados = data.content.map((pedido: any) => ({
            codigo: pedido.id.toString(),
            cliente: pedido.clientName,
            total: pedido.details?.reduce((acc: number, det: any) => acc + ((det.unitPrice || 0) * (det.quantity || 0)), 0 ) || 0,
            fecha: new Date(pedido.date).toLocaleDateString(),
            hora: new Date(pedido.date).toLocaleTimeString(),
            estado: pedido.status === 'PENDIENTE' ? 'Pendiente' :
              pedido.status === 'PAGADO' ? 'Pagado' : 'Cancelado',
            details: pedido.details || []
          }));

          pedidosAcumulados.push(...pedidosMapeados);
          llamadasCompletadas++;
          if (llamadasCompletadas === estados.length) {
            this.pedidosPendientes = pedidosAcumulados;
          }
        },
        error: (err) => console.error('Error al obtener pedidos:', err)
      });
    });
  }

  onTabChange(index: number) {
    this.tabIndex = index;
    this.cargarPedidosPorEstado();
  }

  abrirDialogo(pedido: Pedido): void {
    this.dialog.open(DetallePedidoDialogComponent, {
      width: '400px',
      data: pedido
    });
  }

  imprimirBoleta(pedido: Pedido): void {
    const detalle = ` 
      Pedido: ${pedido.codigo}\n
      Cliente: ${pedido.cliente}\n
      Total: $${pedido.total.toFixed(2)}\n
      Fecha: ${pedido.fecha} ${pedido.hora}
    `;
    alert(detalle);
  }

  calcularTotal(pedido: any) {
    let acum = 0;
    for (let detalle of pedido.details) {
      acum += detalle.unitPrice * detalle.quantity;
    }
    return acum;
  }

pagarPedido(pedido: Pedido): void {
  const datosPago = { //se crea los datos del objeto pago
    paymentMethod: 'efectivo', //metodo de pago
    totalAmount: pedido.total,
    cashier: { //datos del cajero
      id: 1,
      name: ''
    }
  };

  this.orderService.confirmarVenta(pedido.codigo, datosPago).subscribe({ //llama al backend usando el metodo de confirmarventa
    next: (response: any) => { //retorna un observable (rpta del backend)
      pedido.estado = 'Pagado';
      this.mostrarAlerta(`Pedido ${pedido.codigo} marcado como Pagado.`);
      this.cargarPedidosPorEstado();
    },
    error: (err: any) => {
      console.error(`Error al pagar pedido ${pedido.codigo}:`, err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al procesar el pago. Intenta nuevamente.',
        confirmButtonText: 'Aceptar'
      });
    }
  });
}

cancelarPedido(pedido: Pedido): void {
  Swal.fire({
    title: `¿Cancelar el pedido ${pedido.codigo}?`,
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cancelar',
    cancelButtonText: 'No, mantener'
  }).then((result) => {
    if (result.isConfirmed) {
      this.orderService.cancelarVenta(pedido.codigo).subscribe({
        next: () => {
          pedido.estado = 'Cancelado';
          this.mostrarAlerta(`Pedido ${pedido.codigo} cancelado correctamente.`);
          this.cargarPedidosPorEstado();
        },
        error: (err) => {
          console.error(`Error al cancelar pedido ${pedido.codigo}:`, err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cancelar el pedido. Intenta nuevamente.',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } 
  });
}


mostrarAlerta(mensaje: string) {
  Swal.fire({
    icon: 'success',
    title: '¡Éxito!',
    text: mensaje,
    confirmButtonText: 'Aceptar',
    timer: 3000,
    timerProgressBar: true,
  });
}

}
