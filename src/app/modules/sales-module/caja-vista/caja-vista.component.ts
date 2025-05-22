import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { DetallePedidoDialogComponent } from './detalle-pedido-dialog/detalle-pedido-dialog.component';
import { OrdersModuleService } from "../../orders-module/services/orders-module.service";


export interface Pedido {   // Define una interfaz para los pedidos
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
export class CajaVistaComponent {  // Clase del componente
  filtro = ''; // Cadena para almacenar el filtro de búsqueda
  tabIndex = 0; // Índice de la pestaña activa (0 = Pendiente, 1 = Pagado, 2 = Cancelado, 3 = Todos)

  pedidos: Pedido[] = [ // Lista de pedidos simulada
    ];



  pedidosPendientes: any = [];

  constructor(private dialog: MatDialog, private orderService: OrdersModuleService) { } // Inyección del servicio MatDialog para abrir modales


  ngOnInit(): void {
    this.getPedidosPendiente();
    
  }

  getPedidosFiltrados(): Pedido[] {
    const estados = ['Pendiente', 'Pagado', 'Cancelado'];
    const estadoFiltro = this.tabIndex === 3 ? estados : [estados[this.tabIndex]]; // Si está en "Todos", muestra todos; si no, filtra por el estado de la pestaña
    return this.pedidos.filter(p => //devuelve la lista de pedidos filtrados
      estadoFiltro.includes(p.estado) && //con el estado que se selecciono
      p.codigo.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  getPedidosPendiente(){
    this.orderService.obtenerPedidosPorEstado('PENDIENTE',0,10).subscribe({
      next: (data) => {
        this.pedidosPendientes = data;
      },
      error: (err) => console.error('Error al obtener pedidos:', err)
    }); 
  }



  abrirDialogo(pedido: Pedido): void { //metodo para abrir el metodo con el detalle de pedido
    this.dialog.open(DetallePedidoDialogComponent, {
      width: '400px',
      data: pedido
    });
  }

  imprimirBoleta(pedido: Pedido): void { // Simula la impresión de una boleta (alerta)
    console.log('Imprimiendo boleta para pedido:', pedido);
    const detalle = ` 
      Pedido: ${pedido.codigo}\n
      Cliente: ${pedido.cliente}\n
      Total: $${pedido.total.toFixed(2)}\n
      Fecha: ${pedido.fecha} ${pedido.hora}
    `;  // Crea un texto con los datos del pedido
    alert(detalle);
  }

  pagarPedido(pedido: Pedido): void { // Método para marcar un pedido como pagado
    pedido.estado = 'Pagado'; // Cambia el estado
    console.log(`Pedido ${pedido.codigo} marcado como Pagado.`);
  }

  cancelarPedido(pedido: Pedido): void { // Método para marcar un pedido como cancelado
    pedido.estado = 'Cancelado'; // Cambia el estado
    console.log(`Pedido ${pedido.codigo} marcado como Cancelado.`);
  }
}
