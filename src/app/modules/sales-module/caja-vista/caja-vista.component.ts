import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog'; //importa la clase MatDialog para abrir los modales
import { DetallePedidoDialogComponent } from './detalle-pedido-dialog/detalle-pedido-dialog.component'; //importa el componenten que seria el modal
import { OrdersModuleService } from "../../orders-module/services/orders-module.service";
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';

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

  ngOnInit(): void { //iniciar la carga de pedidos
    this.cargarPedidosPorEstado();
  }

  cargarPedidosPorEstado() {
    const estadosMap = ['PENDIENTE', 'PAGADO', 'CANCELADO', 'TODOS'];

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

  onTabChange(index: number) { //cambio de pestaña
    this.tabIndex = index;
    this.cargarPedidosPorEstado();
  }

  abrirDialogo(pedido: Pedido): void { //abrir los dealles de modal
    this.dialog.open(DetallePedidoDialogComponent, {
      width: '400px',
      data: pedido
    });
  }

  imprimirBoleta(pedido: Pedido): void {
    const doc = new jsPDF();

    // Agregar título de la empresa
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Pastelería y Repostería Velazo', 10, 10);

    // Agregar línea debajo del título
    doc.setLineWidth(0.5);
    doc.line(10, 12, 200, 12);  // Línea horizontal

    // Título de la boleta
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Boleta de Pedido', 10, 20);

    // Detalles del pedido
    const detalle = `
      Pedido: ${pedido.codigo}
      Cliente: ${pedido.cliente}
      Fecha: ${pedido.fecha} ${pedido.hora}
    `;
    doc.text(detalle, 10, 30);

    // Espacio para separar el encabezado de la tabla
    doc.text('', 10, 40);

    // Agregar encabezado de la tabla (unidades, productos, precio)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Unidades', 10, 50);
    doc.text('Producto', 50, 50);
    doc.text('Precio Unitario (S/.)', 120, 50);
    doc.text('Precio Total (S/.)', 170, 50);

    // Líneas de la tabla
    doc.line(10, 52, 200, 52);  // Línea horizontal debajo del encabezado

    // Añadir los productos a la tabla
    let startY = 60;
    pedido.details?.forEach((item: DetallePedido) => {
      doc.setFont('helvetica', 'normal');
      doc.text(item.quantity.toString(), 10, startY);
      doc.text(item.product.name, 50, startY);
      doc.text(`S/. ${item.unitPrice.toFixed(2)}`, 120, startY);
      doc.text(`S/. ${(item.quantity * item.unitPrice).toFixed(2)}`, 170, startY);
      startY += 10;
    });

    // Línea horizontal después de la tabla
    doc.line(10, startY + 2, 200, startY + 2);

    // Calcular y mostrar el total
    const total = pedido.details?.reduce((acc, det) => acc + (det.unitPrice * det.quantity), 0) || 0;
    doc.setFont('helvetica', 'bold');
    doc.text('Total: S/. ' + total.toFixed(2), 10, startY + 15);

    // Espacio y agregar información adicional (si es necesario)
    doc.text('Gracias por su compra', 10, startY + 25);

    // Descargar el PDF
    doc.save(`boleta_pedido_${pedido.codigo}.pdf`);
  }

  calcularTotal(pedido: any) {
    let acum = 0;
    for (let detalle of pedido.details) {
      acum += detalle.unitPrice * detalle.quantity;
    }
    return acum;
  }

pagarPedido(pedido: Pedido): void {
  const datosPago = {
    paymentMethod: 'efectivo',
    totalAmount: pedido.total,
    cashier: { //datos del cajero
      id: 1,
      name: ''
    }
  };

  // Llamada al backend usando el método de confirmarVenta
  this.orderService.confirmarVenta(pedido.codigo, datosPago).subscribe({
    next: (response: any) => { //respuesta del backend
      pedido.estado = 'Pagado'; //actualiza el estado del pedido
      this.mostrarAlerta(`Pedido ${pedido.codigo} marcado como Pagado.`);
      this.cargarPedidosPorEstado(); //recarga los pedidos por estado
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
