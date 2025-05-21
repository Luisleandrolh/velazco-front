import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface Pedido {
  codigo: string;
  cliente: string;
  total: number;
  fecha: string;
  hora: string;
  estado: string;
}

@Component({
  selector: 'app-detalle-pedido-dialog',
  templateUrl: './detalle-pedido-dialog.component.html',
  styleUrls: ['./detalle-pedido-dialog.component.css']
})
export class DetallePedidoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DetallePedidoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public pedido: Pedido
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }

  imprimir(): void {
    window.print(); // O lógica personalizada
  }
}
