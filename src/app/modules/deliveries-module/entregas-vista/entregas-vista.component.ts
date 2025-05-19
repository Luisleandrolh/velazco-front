import { Component } from '@angular/core';

@Component({
  selector: 'app-entregas-vista',
  templateUrl: './entregas-vista.component.html',
  styleUrls: ['./entregas-vista.component.css']
})
export class EntregasVistaComponent {
  showOrderDetails = false;
  showDeliveryConfirmation = false;
  deliveryDateTime = '';

  selectedOrder: any = {
    id: 'PED-1019',
    status: 'Pagado',
    customer: {
      name: 'Laura Fernández',
      phone: '555-123-4567',
      email: 'laura@example.com'
    },
    date: '22/04/2023 - 16:45',
    paymentMethod: 'Tarjeta de Crédito',
    total: 28.50,
    products: [
      { name: 'Cheesecake', quantity: 1, price: 28.50 },
      { name: 'Brownies', quantity: 2, price: 2.75 }
    ],
    notes: 'No hay notas o instrucciones especiales para la entrega...'
  };

  activeTab: string = 'pendientes';

  // Método para abrir los detalles del pedido
  openOrderDetails(orderId: string): void {
    this.showOrderDetails = true;
  }

  // Método para cerrar el modal de detalles
  closeDetails(): void {
    this.showOrderDetails = false;
  }

  // Método para preparar la confirmación de entrega
  prepareDeliveryConfirmation(): void {
    const now = new Date();
    this.deliveryDateTime = this.formatDate(now);
    this.showDeliveryConfirmation = true;
  }

  // Método para confirmar la entrega
  confirmDelivery(): void {
    // Aquí iría la lógica para actualizar el estado en tu backend
    console.log(`Pedido ${this.selectedOrder.id} marcado como entregado el ${this.deliveryDateTime}`);

    // Cerrar ambos modales
    this.showDeliveryConfirmation = false;
    this.closeDetails();

    // Aquí deberías actualizar la lista de pedidos
    // this.loadOrders();
  }

  // Método para cancelar la confirmación
  cancelDeliveryConfirmation(): void {
    this.showDeliveryConfirmation = false;
  }

  // Método para formatear la fecha
  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };

    return date.toLocaleString('es-ES', options);
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }
  updateNotes(event: Event): void {
    this.selectedOrder.notes = (event.target as HTMLTextAreaElement).value;
  }
}


// ULTIMOS CAMBIOS  ULTIMOS CAMBIOS  ULTIMOS CAMBIOS  ULTIMOS CAMBIOS 
