import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DeliveriesModuleService } from './service/deliveries-module.service';

export interface DeliveryOrder {  //interfaz de pedido de entrega
  id: string;
  idNumber: number;
  status: 'Pagado' | 'Entregado';
  date: string;
  originalDate: string;
  total: number;
  products: { name: string; quantity: number; price: number }[];
  customer: { name: string; phone?: string; email?: string };
  dispatch?: { id: number };
}

@Component({
  selector: 'app-entregas-vista',
  templateUrl: './entregas-vista.component.html',
  styleUrls: ['./entregas-vista.component.css']
})
export class EntregasVistaComponent implements OnInit { //componente de entregas vista
  activeTab: 'pendientes' | 'entregados' = 'pendientes';
  activeTabItem: any;
  tabItems = [
    { label: 'Pendientes de Entrega', id: 'pendientes' },
    { label: 'Entregados', id: 'entregados' }
  ];

  showOrderDetails = false;
  showDeliveryConfirmation = false;

  searchTerm = '';

  pendientes: DeliveryOrder[] = [];
  entregados: DeliveryOrder[] = [];
  filteredOrders: DeliveryOrder[] = [];

  selectedOrder!: DeliveryOrder;
  deliveryDateTime = '';

  userId = 1;
  userName = 'Mateo';

  constructor(private deliveryService: DeliveriesModuleService) {} //constructor que inyecta el servicio de entregas

  ngOnInit(): void {  //metodo que carga los pedidos al iniciar el componente
    this.cargarPedidos();
    this.activeTabItem = this.tabItems[0];
  }

  onTabChange(item: any): void { //metodo que cambia la pestaña activa
    this.activeTab = item.id;
    this.searchTerm = '';

    this.filteredOrders =
      this.activeTab === 'pendientes' ? [...this.pendientes] :
      this.activeTab === 'entregados' ? [...this.entregados] :
      [];
  }

  private cargarPedidos(): void { //metodo privado que carga los pedidos desde el servicio
    this.deliveryService.obtenerPedidosPorEstado('PAGADO', 0, 50).subscribe({ //llama al servicio para obtener los pedidos pagados
      next: ({ content }) => { 
        this.pendientes = this.mapeoBackend(content, 'Pagado');
        if (this.activeTab === 'pendientes') {
          this.filteredOrders = [...this.pendientes];
        }
      },
      error: err => console.error('Error PAGADO', err)
    });

    this.deliveryService.obtenerPedidosPorEstado('ENTREGADO', 0, 50).subscribe({ //llama al servicio para obtener los pedidos entregados
      next: ({ content }) => {
        this.entregados = this.mapeoBackend(content, 'Entregado');
        if (this.activeTab === 'entregados') {
          this.filteredOrders = [...this.entregados];
        }
      },
      error: err => console.error('Error ENTREGADO', err)
    });
  }

  private mapeoBackend(data: any[], estadoFront: 'Pagado' | 'Entregado'): DeliveryOrder[] { //metodo privado que mapea los datos del backend a la interfaz DeliveryOrder
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
      products: p.details?.map((d: any) => ({
        name: d.product?.name,
        quantity: d.quantity,
        price: d.unitPrice
      })) || [],
      customer: {
        name: p.clientName,
        phone: p.clientPhone,
        email: p.clientEmail
      },
      dispatch: p.dispatch
    }));
  }

  searchOrders(): void { //metodo que busca los pedidos por el termino de busqueda
    const term = this.searchTerm.toLowerCase();
    const origen = this.activeTab === 'pendientes' ? this.pendientes : this.entregados;

    this.filteredOrders = origen.filter(o =>
      o.id.toLowerCase().includes(term) ||
      o.customer.name.toLowerCase().includes(term)
    );
  }

  openOrderDetails(orderId: string): void { //metodo que abre los detalles del pedido
    const found = (this.activeTab === 'pendientes' ? this.pendientes : this.entregados)
      .find(o => o.id === orderId);

    if (!found) {
      console.warn('Pedido no encontrado:', orderId);
      return;
    }

    this.selectedOrder = found;
    this.showOrderDetails = true;
  }

  closeDetails(): void { //metodo que cierra los detalles del pedido
    this.showOrderDetails = false;
  }

  prepareDeliveryConfirmation(): void {   //metodo que prepara la confirmacion de entrega
    if (!this.selectedOrder) return;

    this.showOrderDetails = false;
    this.deliveryDateTime = new Date().toLocaleString('es-PE');
    this.showDeliveryConfirmation = true;
  }

  cancelDeliveryConfirmation(): void { //metodo que cancela la confirmacion de entrega
    this.showDeliveryConfirmation = false;
  }

  confirmDelivery(): void { //metodo que confirma la entrega
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

    this.deliveryService.confirmDelivery(this.selectedOrder.idNumber, deliveryPayload).subscribe({ //llama al servicio para confirmar la entrega
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

}
