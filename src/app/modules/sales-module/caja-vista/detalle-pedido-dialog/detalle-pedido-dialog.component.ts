import { Component, Inject } from '@angular/core'; // Importa decorador y función para inyectar datos en el constructor
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; // Importa constantes para acceder a los datos del diálogo

export interface Pedido { // Interfaz que representa la estructura de un pedido
  codigo: string; // Código del pedido
  cliente: string; // Cliente que hizo el pedido
  total: number; // Total a pagar
  fecha: string; // Fecha del pedido
  hora: string; // Hora del pedido
  estado: string; // Estado actual del pedido (Pendiente, Pagado, Cancelado)
  details?: PedidoDetalle[];

}

export interface PedidoDetalle {
  product: {
    name: string;
  };
  quantity: number;
  unitPrice: number;
}

@Component({
  selector: 'app-detalle-pedido-dialog', // Nombre del componente
  templateUrl: './detalle-pedido-dialog.component.html', // Ruta del HTML asociado
  styleUrls: ['./detalle-pedido-dialog.component.css'] // Ruta del CSS asociado
})
export class DetallePedidoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DetallePedidoDialogComponent>, // Referencia al diálogo actual para poder cerrarlo
    @Inject(MAT_DIALOG_DATA) public pedido: Pedido // Inyecta los datos pasados al diálogo (el pedido)
  ) {}

  cerrar(): void { // Método que cierra el diálogo
    this.dialogRef.close(); // Cierra el modal (equivale a cerrar el popup)
  }

  imprimir(): void { // Método que simula la impresión
    window.print(); // Abre el diálogo de impresión del navegador
  }
}
