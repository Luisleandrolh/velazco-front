import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-entregas-vista',
  templateUrl: './entregas-vista.component.html',
  styleUrls: ['./entregas-vista.component.css'],
  providers: [MessageService]
})
export class EntregasVistaComponent implements OnInit {
onTabChange($event: Event) {
throw new Error('Method not implemented.');
}
  @ViewChild('op') op!: OverlayPanel;

  // Estado de los componentes
  showOrderDetails = false;
  showDeliveryConfirmation = false;
  deliveryDateTime = '';
  activeTabIndex = 0;
  searchTerm = '';

  // Datos de los pedidos
  allOrders: any[] = [
    {
      id: 'PED-1019',
      status: 'Pagado',
      customer: { 
        name: 'Laura Fernández',
        phone: '555-123-4567',
        email: 'laura@example.com' 
      },
      date: '22/04/2023 - 16:45',
      paymentMethod: 'Tarjeta',
      products: [
        { name: 'Cheesecake', quantity: 1, price: 28.50 },
        { name: 'Brownies', quantity: 2, price: 2.75 }
      ],
      total: 34.00,
      notes: 'Entregar en recepción'
    },
    {
      id: 'PED-1018',
      status: 'Pagado',
      customer: { 
        name: 'Roberto Gómez',
        phone: '555-234-5678',
        email: 'roberto@example.com' 
      },
      date: '22/04/2023 - 15:30',
      paymentMethod: 'Efectivo',
      products: [
        { name: 'Torta de Chocolate', quantity: 2, price: 20.00 },
        { name: 'Cupcakes', quantity: 6, price: 2.00 }
      ],
      total: 52.00,
      notes: 'Llamar antes de llegar'
    },
    {
      id: 'PED-1017',
      status: 'Pagado',
      customer: { 
        name: 'Sofía López',
        phone: '555-345-6789',
        email: 'sofia@example.com' 
      },
      date: '22/04/2023 - 14:15',
      paymentMethod: 'Yape',
      products: [
        { name: 'Torta de Chocolate', quantity: 1, price: 25.99 },
        { name: 'Galletas de Avena', quantity: 12, price: 1.50 }
      ],
      total: 43.99,
      notes: 'Dejar con el portero'
    },
    {
      id: 'PED-1016',
      status: 'Pagado',
      customer: { 
        name: 'Miguel Torres',
        phone: '555-456-7890',
        email: 'miguel@example.com' 
      },
      date: '22/04/2023 - 11:30',
      paymentMethod: 'Transferencia',
      products: [
        { name: 'Cheesecake', quantity: 2, price: 28.50 },
        { name: 'Alfajores', quantity: 4, price: 2.00 }
      ],
      total: 65.00,
      notes: 'Horario de oficina'
    }
  ];

  deliveredOrders: any[] = [
    {
      id: 'PED-1015',
      status: 'Entregado',
      customer: { 
        name: 'Carmen Rodríguez',
        phone: '555-567-8901',
        email: 'carmen@example.com' 
      },
      date: '21/04/2023 - 17:45',
      deliveryDate: '21/04/2023 - 18:30',
      paymentMethod: 'Tarjeta',
      products: [
        { name: 'Torta de Chocolate', quantity: 1, price: 28.50 },
        { name: 'Cupcakes', quantity: 6, price: 2.00 }
      ],
      total: 45.49,
      notes: 'Entregado satisfactoriamente'
    },
    {
      id: 'PED-1014',
      status: 'Entregado',
      customer: { 
        name: 'Javier Méndez',
        phone: '555-678-9012',
        email: 'javier@example.com' 
      },
      date: '21/04/2023 - 15:20',
      deliveryDate: '21/04/2023 - 16:15',
      paymentMethod: 'Efectivo',
      products: [
        { name: 'Cheesecake', quantity: 2, price: 28.50 },
        { name: 'Galletas', quantity: 8, price: 1.50 }
      ],
      total: 69.00,
      notes: 'Cliente contento con el pedido'
    }
  ];

  filteredOrders: any[] = [];
  selectedOrder: any = {};

  // Configuración de filtros
  paymentMethods = [
    { name: 'Efectivo', selected: false },
    { name: 'Yape', selected: false },
    { name: 'Transferencia', selected: false },
    { name: 'Tarjeta', selected: false }
  ];

  amountOptions = [
    { label: 'Todos', value: '' },
    { label: 'S/. 0 - 50', value: '0-50' },
    { label: 'S/. 50 - 100', value: '50-100' },
    { label: 'Mayor a S/. 100', value: '100+' }
  ];

  filters = {
    startDate: '',
    endDate: '',
    amountRange: '',
    paymentMethods: [] as string[]
  };

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.filteredOrders = [...this.allOrders];
    // Inicializar selectedOrder con un pedido por defecto
    this.selectedOrder = this.allOrders[0];
  }

  // Métodos de búsqueda y filtrado
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

  toggleFilterMenu(event: Event): void {
    this.op.toggle(event);
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filters.startDate || 
      this.filters.endDate || 
      this.filters.amountRange || 
      this.paymentMethods.some(m => m.selected)
    );
  }

  applyFilters(): void {
    // Actualizar métodos de pago seleccionados
    this.filters.paymentMethods = this.paymentMethods
      .filter(m => m.selected)
      .map(m => m.name);

    this.filteredOrders = this.allOrders.filter(order => {
      const dateMatch = this.filterByDate(order.date);
      const amountMatch = this.filterByAmount(order.total);
      const paymentMatch = this.filterByPayment(order.paymentMethod);
      
      return dateMatch && amountMatch && paymentMatch;
    });

    this.op.hide();
    this.messageService.add({
      severity: 'success',
      summary: 'Filtros aplicados',
      detail: 'Se han aplicado los filtros seleccionados'
    });
  }

  private filterByDate(orderDate: string): boolean {
    if (!this.filters.startDate && !this.filters.endDate) return true;
    
    try {
      const [datePart, timePart] = orderDate.split(' - ');
      const [day, month, year] = datePart.split('/');
      const date = new Date(`${year}-${month}-${day}`);
      
      const start = this.filters.startDate ? new Date(this.filters.startDate) : null;
      const end = this.filters.endDate ? new Date(this.filters.endDate) : null;
      
      return (!start || date >= start) && (!end || date <= end);
    } catch (e) {
      console.error('Error al parsear fecha:', e);
      return true;
    }
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
    this.op.hide();
    this.messageService.add({
      severity: 'info',
      summary: 'Filtros limpiados',
      detail: 'Todos los filtros han sido restablecidos'
    });
  }

  // Métodos para manejo de pedidos
  openOrderDetails(orderId: string): void {
    const order = this.allOrders.find(o => o.id === orderId) || 
                 this.deliveredOrders.find(o => o.id === orderId);
    
    if (order) {
      this.selectedOrder = { ...order };
      this.showOrderDetails = true;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontró el pedido solicitado'
      });
    }
  }

  closeDetails(): void {
    this.showOrderDetails = false;
  }

  prepareDeliveryConfirmation(): void {
    const now = new Date();
    this.deliveryDateTime = this.formatDate(now);
    this.showDeliveryConfirmation = true;
    this.showOrderDetails = false;
  }

  confirmDelivery(): void {
    // Aquí iría la lógica para actualizar el estado del pedido
    const index = this.allOrders.findIndex(o => o.id === this.selectedOrder.id);
    if (index !== -1) {
      const deliveredOrder = { 
        ...this.allOrders[index], 
        status: 'Entregado',
        deliveryDate: this.deliveryDateTime
      };
      
      this.deliveredOrders.unshift(deliveredOrder);
      this.allOrders.splice(index, 1);
      this.filteredOrders = this.filteredOrders.filter(o => o.id !== this.selectedOrder.id);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Entrega confirmada',
        detail: `El pedido ${this.selectedOrder.id} ha sido marcado como entregado`
      });
    }

    this.showDeliveryConfirmation = false;
  }

  cancelDeliveryConfirmation(): void {
    this.showDeliveryConfirmation = false;
    this.showOrderDetails = true;
  }

  updateNotes(event: Event): void {
    this.selectedOrder.notes = (event.target as HTMLTextAreaElement).value;
  }

  // Métodos auxiliares
  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('es-PE', options);
  }

  getTabOrders(): any[] {
    switch (this.activeTabIndex) {
      case 0: return this.filteredOrders;
      case 1: return this.deliveredOrders;
      case 2: return [...this.allOrders, ...this.deliveredOrders];
      default: return [];
    }
  }
}