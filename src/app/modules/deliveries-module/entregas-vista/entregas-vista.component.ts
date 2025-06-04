import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DeliveriesModuleService } from './service/deliveries-module.service';

export interface DeliveryOrder {
  id: string;
  idNumber: number;
  status: 'Pagado' | 'Entregado';
  date: string;
  originalDate: string;
  total: number;
  paymentMethod: string;
  products: { name: string; quantity: number; price: number }[];
  customer: { name: string; phone?: string; email?: string };
  dispatch?: { id: number };
}

@Component({
  selector: 'app-entregas-vista',
  templateUrl: './entregas-vista.component.html',
  styleUrls: ['./entregas-vista.component.css']
})
export class EntregasVistaComponent implements OnInit {
  activeTab: 'pendientes' | 'entregados' = 'pendientes';
  activeTabItem: any;
  tabItems = [
    { label: 'Pendientes de Entrega', id: 'pendientes' },
    { label: 'Entregados', id: 'entregados' }
  ];

  showFilterMenu = false;
  showOrderDetails = false;
  showDeliveryConfirmation = false;

  searchTerm = '';
  filters = { startDate: '', endDate: '', amountRange: '' };
  paymentMethods = [
    { name: 'Efectivo', selected: false },
    { name: 'Tarjeta', selected: false },
    { name: 'Yape/Plin', selected: false },
  ];

  pendientes: DeliveryOrder[] = [];
  entregados: DeliveryOrder[] = [];
  filteredOrders: DeliveryOrder[] = [];

  selectedOrder!: DeliveryOrder;
  deliveryDateTime = '';

  userId = 1;
  userName = 'Mateo';

  constructor(private deliveryService: DeliveriesModuleService) {}

  ngOnInit(): void {
    this.cargarPedidos();
    this.activeTabItem = this.tabItems[0];
  }

  onTabChange(item: any): void {
  this.activeTab = item.id;
  this.searchTerm = '';
  
  if (this.hasActiveFilters()) {
    this.applyFilters(); // aplica los filtros existentes
  } else {
    this.filteredOrders =
      this.activeTab === 'pendientes' ? [...this.pendientes] :
      this.activeTab === 'entregados' ? [...this.entregados] :
      [];
  }
}


  private cargarPedidos(): void {
    this.deliveryService.obtenerPedidosPorEstado('PAGADO', 0, 50).subscribe({
      next: ({ content }) => {
        this.pendientes = this.mapeoBackend(content, 'Pagado');
        if (this.activeTab === 'pendientes') {
          this.filteredOrders = [...this.pendientes];
        }
      },
      error: err => console.error('Error PAGADO', err)
    });

    this.deliveryService.obtenerPedidosPorEstado('ENTREGADO', 0, 50).subscribe({
      next: ({ content }) => {
        this.entregados = this.mapeoBackend(content, 'Entregado');
        if (this.activeTab === 'entregados') {
          this.filteredOrders = [...this.entregados];
        }
      },
      error: err => console.error('Error ENTREGADO', err)
    });
  }

  private mapeoBackend(data: any[], estadoFront: 'Pagado' | 'Entregado'): DeliveryOrder[] {
    return data.map(p => ({
      id: p.id.toString(),
      idNumber: p.id,
      status: estadoFront,
      date: new Date(p.date).toLocaleString('es-PE'),
      originalDate: p.date,
      total: p.details?.reduce(
        (acc: number, d: any) => acc + (d.unitPrice || 0) * (d.quantity || 0),
        0
      ) || 0,
      paymentMethod: p.paymentMethod || '-',
      products: p.details?.map((d: any) => ({
        name: d.product?.name,
        quantity: d.quantity,
        price: d.unitPrice
      })) || [],
      customer: { name: p.clientName, phone: p.clientPhone, email: p.clientEmail },
      dispatch: p.dispatch
    }));
  }

  searchOrders(): void {
    const term = this.searchTerm.toLowerCase();
    const origen = this.activeTab === 'pendientes' ? this.pendientes : this.entregados;

    this.filteredOrders = origen.filter(o =>
      o.id.toLowerCase().includes(term) ||
      o.customer.name.toLowerCase().includes(term)
    );
  }

  openOrderDetails(orderId: string): void {
  const found = (this.activeTab === 'pendientes' ? this.pendientes : this.entregados)
    .find(o => o.id === orderId);

  if (!found) {
    console.warn('Pedido no encontrado:', orderId);
    return;
  }

  this.selectedOrder = found;
  this.showOrderDetails = true;
}


  closeDetails(): void {
    this.showOrderDetails = false;
  }

  prepareDeliveryConfirmation(): void {
  if (!this.selectedOrder) return;
  this.showOrderDetails = false;
  this.deliveryDateTime = new Date().toLocaleString('es-PE');
  this.showDeliveryConfirmation = true;
}

  cancelDeliveryConfirmation(): void {
    this.showDeliveryConfirmation = false;
  }

  confirmDelivery(): void {
    if (!this.selectedOrder) return;

    const deliveryPayload = {
      id: this.selectedOrder.idNumber,
      date: this.selectedOrder.originalDate,
      clientName: this.selectedOrder.customer.name,
      status: 'ENTREGADO' as const,
      dispatch: {
        id: this.selectedOrder.dispatch?.id || 1,
        deliveryDate: this.deliveryDateTime,
        dispatchedBy: {
          id: this.userId,
          name: this.userName
        }
      }
    };

    this.deliveryService.confirmDelivery(this.selectedOrder.idNumber, deliveryPayload).subscribe({
      next: () => {
        this.showDeliveryConfirmation = false;
        this.cargarPedidos();
        Swal.fire('Confirmado', 'Entrega confirmada correctamente.', 'success');
      },
      error: (err) => {
        console.error('Error al confirmar entrega', err);
        Swal.fire('Error', 'No se pudo confirmar la entrega.', 'error');
      }
    });
  }

  toggleFilterMenu() {
    this.showFilterMenu = !this.showFilterMenu;
  }

  hasActiveFilters(): boolean {
    return !!this.filters.startDate || !!this.filters.endDate ||
           !!this.filters.amountRange ||
           this.paymentMethods.some(m => m.selected);
  }

  clearFilters(): void {
    this.filters = { startDate: '', endDate: '', amountRange: '' };
    this.paymentMethods.forEach(m => m.selected = false);
    this.applyFilters();
  }

  applyFilters(): void {
    const { startDate, endDate, amountRange } = this.filters;

    let lista =
      this.activeTab === 'pendientes' ? this.pendientes :
      this.activeTab === 'entregados' ? this.entregados :
      [];

    if (startDate) {
      const inicio = new Date(startDate);
      lista = lista.filter(o => new Date(o.date) >= inicio);
    }
    if (endDate) {
      const fin = new Date(endDate);
      lista = lista.filter(o => new Date(o.date) <= fin);
    }

    if (amountRange) {
      const [min, max] = amountRange === '100+' ? [100, Infinity]
                       : amountRange.split('-').map(Number);
      lista = lista.filter(o => o.total >= min && o.total <= max);
    }

    const métodosSel = this.paymentMethods.filter(m => m.selected).map(m => m.name);
    if (métodosSel.length) {
      lista = lista.filter(o => métodosSel.includes(o.paymentMethod));
    }

    this.filteredOrders = lista;
    this.showFilterMenu = false;
  }
}
