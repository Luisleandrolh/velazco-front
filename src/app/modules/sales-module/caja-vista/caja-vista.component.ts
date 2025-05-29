import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { DetallePedidoDialogComponent } from './detalle-pedido-dialog/detalle-pedido-dialog.component';
import { OrdersModuleService } from "../../orders-module/services/orders-module.service";

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

  constructor(private dialog: MatDialog, private orderService: OrdersModuleService) { }

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
          total: pedido.details?.reduce(
            (acc: number, det: any) => acc + ((det.unitPrice || 0) * (det.quantity || 0)),
            0
          ) || 0,
          fecha: new Date(pedido.date).toLocaleDateString(),
          hora: new Date(pedido.date).toLocaleTimeString(),
          estado: pedido.status === 'PENDIENTE' ? 'Pendiente' :
                  pedido.status === 'PAGADO' ? 'Pagado' : 'Cancelado',
          details: pedido.details || [] // ← NECESARIO
        }));
        
      },
      error: (err) => console.error('Error al obtener pedidos:', err)
    });
  }
}

  obtenerTodosPedidos() {
    // Ejemplo simple: hacer 3 llamadas y concatenar resultados, o ajustar según API
    const estados = ['PENDIENTE', 'PAGADO', 'CANCELADO'];
    const pedidosAcumulados: Pedido[] = [];
    let llamadasCompletadas = 0;

    estados.forEach(estado => {
      this.orderService.obtenerPedidosPorEstado(estado, 0, 10).subscribe({
        next: (data) => {
          const pedidosMapeados = data.content.map((pedido: any) => ({
            codigo: pedido.id.toString(),
            cliente: pedido.clientName,
            total: pedido.details?.reduce(
              (acc: number, det: any) => acc + ((det.unitPrice || 0) * (det.quantity || 0)),
              0
            ) || 0,
            fecha: new Date(pedido.date).toLocaleDateString(),
            hora: new Date(pedido.date).toLocaleTimeString(),
            estado: pedido.status === 'PENDIENTE' ? 'Pendiente' :
                    pedido.status === 'PAGADO' ? 'Pagado' : 'Cancelado',
            details: pedido.details || [] // ← NECESARIO
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

  // Escuchar cambios de tab para recargar pedidos
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

  calcularTotal(pedido: any){
    let acum = 0;
    for(let detalle of pedido.details){
      acum += detalle.unitPrice * detalle.quantity;
    }
    return acum;
  }

  pagarPedido(pedido: Pedido): void {
    // Aquí podrías llamar al backend para actualizar estado
    pedido.estado = 'Pagado';
    console.log(`Pedido ${pedido.codigo} marcado como Pagado.`);
    console.log(this.pedidosPendientes);
  }

  cancelarPedido(pedido: Pedido): void {
    // Aquí podrías llamar al backend para actualizar estado
    pedido.estado = 'Cancelado';
    console.log(`Pedido ${pedido.codigo} marcado como Cancelado.`);
  }
}
