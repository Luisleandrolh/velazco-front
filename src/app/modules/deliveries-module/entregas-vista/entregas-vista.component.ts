import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-entregas-vista',
  templateUrl: './entregas-vista.component.html',
  styleUrls: ['./entregas-vista.component.css']
})
export class EntregasVistaComponent {
  // Propiedades para los modales
  showOrderDetails = false;
  showDeliveryConfirmation = false;
  deliveryDateTime = '';

  // Propiedades para búsqueda y filtrado
  searchTerm: string = '';
  filteredOrders: any[] = [];
  showFilterMenu = false;
  activeTab: string = 'pendientes';

  // Datos de ejemplo
  allOrders: any[] = [
    {
      id: 'PED-1019',
      status: 'Pagado',
      customer: { name: 'Laura Fernández' },
      date: '22/04/2023 - 16:45',
      paymentMethod: 'Tarjeta',
      products: [
        { name: 'Cheesecake', quantity: 1, price: 28.50 },
        { name: 'Brownies', quantity: 2, price: 2.75 }
      ],
      total: 28.50
    },
    {
      id: 'PED-1018',
      status: 'Pagado',
      customer: { name: 'Roberto Gómez' },
      date: '22/04/2023 - 15:30',
      paymentMethod: 'Efectivo',
      products: [
        { name: 'Torta de Chocolate', quantity: 2, price: 20.00 },
        { name: 'Cupcakes', quantity: 6, price: 2.00 }
      ],
      total: 51.98
    },
    {
      id: 'PED-1017',
      status: 'Pagado',
      customer: { name: 'Sofía López' },
      date: '22/04/2023 - 14:15',
      paymentMethod: 'Yape',
      products: [
        { name: 'Torta de Chocolate', quantity: 1, price: 25.99 },
        { name: 'Galletas de Avena', quantity: 12, price: 1.50 }
      ],
      total: 43.99
    },
    {
      id: 'PED-1016',
      status: 'Pagado',
      customer: { name: 'Miguel Torres' },
      date: '22/04/2023 - 11:30',
      paymentMethod: 'Transferencia',
      products: [
        { name: 'Cheesecake', quantity: 2, price: 28.50 },
        { name: 'Alfajores', quantity: 4, price: 2.00 }
      ],
      total: 65.00
    }
  ];

  // Filtros avanzados
  paymentMethods = [
    { name: 'Efectivo', selected: false },
    { name: 'Yape', selected: false },
    { name: 'Transferencia', selected: false },
    { name: 'Tarjeta', selected: false }
  ];

  filters = {
    startDate: '',
    endDate: '',
    amountRange: '',
    paymentMethods: [] as string[]
  };

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

  constructor(private el: ElementRef) {
    this.filteredOrders = [...this.allOrders];
  }

  // Métodos para búsqueda
  searchOrders(): void {
    if (!this.searchTerm) {
      this.filteredOrders = [...this.allOrders];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.allOrders.filter(order => 
      order.id.toLowerCase().includes(term) || 
      order.customer.name.toLowerCase().includes(term)
    );
  }

  // Métodos para filtros avanzados
  toggleFilterMenu() {
    this.showFilterMenu = !this.showFilterMenu;
  }

hasActiveFilters(): boolean {
  return !!(
    this.filters.startDate || 
    this.filters.endDate || 
    this.filters.amountRange || 
    this.filters.paymentMethods.length > 0
  );
}

  applyFilters(): void {
    // Actualiza los métodos de pago seleccionados
    this.filters.paymentMethods = this.paymentMethods
      .filter(m => m.selected)
      .map(m => m.name);

    this.filteredOrders = this.allOrders.filter(order => {
      const dateMatch = this.filterByDate(order.date);
      const amountMatch = this.filterByAmount(order.total);
      const paymentMatch = this.filterByPayment(order.paymentMethod);
      
      return dateMatch && amountMatch && paymentMatch;
    });

    this.showFilterMenu = false;
  }

  private filterByDate(orderDate: string): boolean {
    if (!this.filters.startDate && !this.filters.endDate) return true;
    
    const date = new Date(orderDate.split(' - ')[0].split('/').reverse().join('-'));
    const start = this.filters.startDate ? new Date(this.filters.startDate) : null;
    const end = this.filters.endDate ? new Date(this.filters.endDate) : null;
    
    return (!start || date >= start) && (!end || date <= end);
  }

  private filterByAmount(total: number): boolean {
    if (!this.filters.amountRange) return true;
    
    const [min, max] = this.filters.amountRange.split(/-|\+/);
    if (this.filters.amountRange.endsWith('+')) {
      return total > +min;
    }
    return total >= +min && total <= +(max || min);
  }

  private filterByPayment(method: string): boolean {
    if (this.filters.paymentMethods.length === 0) return true;
    return this.filters.paymentMethods.includes(method);
  }

  clearFilters(): void {
    this.filters = {
      startDate: '',
      endDate: '',
      amountRange: '',
      paymentMethods: []
    };
    this.paymentMethods.forEach(m => m.selected = false);
    this.filteredOrders = [...this.allOrders];
    this.showFilterMenu = false;
  }

  // Métodos para los modales
  openOrderDetails(orderId: string): void {
    this.showOrderDetails = true;
  }

  closeDetails(): void {
    this.showOrderDetails = false;
  }

  prepareDeliveryConfirmation(): void {
    const now = new Date();
    this.deliveryDateTime = this.formatDate(now);
    this.showDeliveryConfirmation = true;
  }

  confirmDelivery(): void {
    console.log(`Pedido ${this.selectedOrder.id} marcado como entregado el ${this.deliveryDateTime}`);
    this.showDeliveryConfirmation = false;
    this.closeDetails();
  }

  cancelDeliveryConfirmation(): void {
    this.showDeliveryConfirmation = false;
  }

  // Métodos auxiliares
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


// --------------------------------------------------------------------------------------