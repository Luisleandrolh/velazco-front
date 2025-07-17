import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-metodo-pago-dialog',
  templateUrl: './metodo-pago-dialog.component.html'
})
export class MetodoPagoDialogComponent {
  metodoSeleccionado: string = 'EFECTIVO';

  constructor(
    public dialogRef: MatDialogRef<MetodoPagoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  seleccionarMetodo() {
    this.dialogRef.close(this.metodoSeleccionado);
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
