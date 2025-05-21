import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { DetallePedidoDialogComponent } from './detalle-pedido-dialog/detalle-pedido-dialog.component';

export interface Pedido {
  codigo: string;
  cliente: string;
  total: number;
  fecha: string;
  hora: string;
  estado: 'Pendiente' | 'Pagado' | 'Cancelado';
}

@Component({
  selector: 'app-caja-vista',
  templateUrl: './caja-vista.component.html',
  styleUrls: ['./caja-vista.component.css']
})
export class CajaVistaComponent {
  filtro = '';
  tabIndex = 0;

  pedidos: Pedido[] = [
    { codigo: 'PED-1023', cliente: 'María González', total: 49.49, fecha: '23/04/2023', hora: '14:30', estado: 'Pendiente' },
    { codigo: 'PED-1022', cliente: 'Carlos Rodríguez', total: 35.75, fecha: '23/04/2023', hora: '12:15', estado: 'Pagado' },
    { codigo: 'PED-1021', cliente: 'Luis Pérez', total: 62.30, fecha: '22/04/2023', hora: '17:45', estado: 'Cancelado' },
    { codigo: 'PED-1020', cliente: 'Ana Martínez', total: 28.10, fecha: '22/04/2023', hora: '10:05', estado: 'Pendiente' },
    { codigo: 'PED-1019', cliente: 'Pedro López', total: 75.99, fecha: '21/04/2023', hora: '13:20', estado: 'Pagado' },
    { codigo: 'PED-1018', cliente: 'Lucía Ramírez', total: 19.50, fecha: '21/04/2023', hora: '15:50', estado: 'Cancelado' },
    { codigo: 'PED-1017', cliente: 'Jorge Salazar', total: 88.00, fecha: '20/04/2023', hora: '11:10', estado: 'Pagado' },
    { codigo: 'PED-1016', cliente: 'Isabel Torres', total: 42.25, fecha: '20/04/2023', hora: '09:35', estado: 'Pendiente' },
    { codigo: 'PED-1015', cliente: 'Gabriela Castro', total: 53.40, fecha: '19/04/2023', hora: '14:45', estado: 'Cancelado' },
    { codigo: 'PED-1014', cliente: 'Héctor Fernández', total: 37.60, fecha: '19/04/2023', hora: '16:30', estado: 'Pagado' },
    { codigo: 'PED-1013', cliente: 'Verónica Ríos', total: 61.10, fecha: '18/04/2023', hora: '12:00', estado: 'Pendiente' },
    { codigo: 'PED-1012', cliente: 'Mario Aguilar', total: 25.30, fecha: '18/04/2023', hora: '17:20', estado: 'Pagado' },
    { codigo: 'PED-1011', cliente: 'Rosa Delgado', total: 33.90, fecha: '17/04/2023', hora: '15:00', estado: 'Cancelado' }
  ];

  constructor(private dialog: MatDialog) {}

  getPedidosFiltrados(): Pedido[] {
    const estados = ['Pendiente', 'Pagado', 'Cancelado'];
    const estadoFiltro = this.tabIndex === 3 ? estados : [estados[this.tabIndex]];
    return this.pedidos.filter(p =>
      estadoFiltro.includes(p.estado) &&
      p.codigo.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  abrirDialogo(pedido: Pedido): void {
    this.dialog.open(DetallePedidoDialogComponent, {
      width: '400px',
      data: pedido
    });
  }

  imprimirBoleta(pedido: Pedido): void {
    console.log('Imprimiendo boleta para pedido:', pedido);
    const detalle = `
      Pedido: ${pedido.codigo}\n
      Cliente: ${pedido.cliente}\n
      Total: $${pedido.total.toFixed(2)}\n
      Fecha: ${pedido.fecha} ${pedido.hora}
    `;
    alert(detalle);
  }

  pagarPedido(pedido: Pedido): void {
    pedido.estado = 'Pagado';
    console.log(`Pedido ${pedido.codigo} marcado como Pagado.`);
  }

  cancelarPedido(pedido: Pedido): void {
    pedido.estado = 'Cancelado';
    console.log(`Pedido ${pedido.codigo} marcado como Cancelado.`);
  }
}
