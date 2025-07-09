

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OrdenProduccionService } from '../services/ordenes.service';
import Swal from 'sweetalert2';

interface OrdenHistorial {
  id: string;
  productionDate: string;
  status: string;
  assignedTo?: string;
  comments?: string;
  details: {
    product: { 
      name: string;
      id?: string;
    };
    requestedQuantity: number;
    producedQuantity: number;
    comments?: string;
  }[];
}
interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-production',
  templateUrl: './ordenesproduccion.component.html',
  styleUrls: ['./ordenesproduccion.component.css']
})
export class ProductionComponent implements OnInit {
  productions: any[] = [];
  historial: any[] = [];
  products: any[] = [];
  activeTabIndex: number = 0;
  users: User[] = [];  
  modalVisible = false;
  detailModalVisible = false;
  isEditing = false;
  ordenEditando: any = null;
  selectedOrder: any = null;
  
  // Propiedades detalles
  completedProducts: number = 0;
  incompleteProducts: number = 0;
  totalRequested: number = 0;
  totalProduced: number = 0;
  efficiency: string = '0';
  
  productionForm: FormGroup = this.fb.group({
    productionDate: ['', Validators.required],
    assignedToId: [null],
    status: ['PENDIENTE'],
    comments: [''],
    details: this.fb.array([]),
  });

  constructor(
    private service: OrdenProduccionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProductions();
    this.loadHistorial();
    this.loadProducts();
  }

  loadProductions(): void {
    this.service.getPendingProductions().subscribe({
      next: (data) => this.productions = data,
      error: (err) => console.error('Error:', err)
    });
  }

 loadHistorial(): void {
  this.service.getHistorialProductions().subscribe(data => {
    this.historial = data
      .filter((orden: any) => orden.status?.toUpperCase() !== 'PENDIENTE')
      .map((orden: any) => ({
        id: orden.orderNumber,
        productionDate: orden.date,
        status: orden.status,
        assignedTo: { name: orden.responsible },
        
        details: orden.products.map((p: any) => ({
          product: { name: p.productName },
          requestedQuantity: p.requestedQuantity,
          producedQuantity: p.producedQuantity,
          comments: p.comments || ''
        })),
      }));
  });
}

  loadUsers(): void {
  this.service.getUSers().subscribe( 
    (data: User[]) => {
      this.users = data;
    },
    (error: any) => {  
      console.error('Error al cargar usuarios', error);
    }
  );
}
  loadProducts(): void {
    this.service.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  initForm(): void {
    this.productionForm = this.fb.group({
      productionDate: ['', Validators.required],
      assignedToId: [null],
      status: ['PENDIENTE'],
      comments: [''],
      details: this.fb.array([])
    });
  }

  get details(): FormArray {
    return this.productionForm.get('details') as FormArray;
  }

  createDetail(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      requestedQuantity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  addDetail(): void {
    this.details.push(this.createDetail());
  }

  removeDetail(index: number): void {
    this.details.removeAt(index);
  }

  patchForm(): void {
    if (!this.ordenEditando) return;
    
    this.productionForm.patchValue({
      productionDate: this.ordenEditando.productionDate,
      assignedToId: this.ordenEditando.assignedTo?.id || null,
      status: this.ordenEditando.status,
      comments: this.ordenEditando.comments || ''
    });

    this.details.clear();
    this.ordenEditando.details.forEach((d: any) => {
      this.details.push(this.fb.group({
        productId: [d.product.id, Validators.required],
        requestedQuantity: [Number(d.requestedQuantity), [Validators.required, Validators.min(1)]]
      }));
    });
  }


  abrirModalNuevaOrden(): void {
    this.isEditing = false;
    this.ordenEditando = null;
    this.initForm();
    this.addDetail();
    this.modalVisible = true;
    this.loadUsers(); 
  }

  editarOrden(order: any): void {
    this.isEditing = true;
    this.ordenEditando = order;
    this.initForm();
    this.patchForm();
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.ordenEditando = null;
  }

   verDetalles(order: any): void {
    this.selectedOrder = {
  ...order,
  id: order.id || order.orderNumber,
  productionDate: order.productionDate || order.date,
  responsible: order.responsible || order.assignedTo?.name,
  comments: order.comments || '', 
  details: order.details || order.products?.map((p: any) => ({
    product: {
      name: p.product?.name || p.productName
    },
    requestedQuantity: p.requestedQuantity,
    producedQuantity: p.producedQuantity || 0
  })) || []
};
console.log('Detalles seleccionados:', this.selectedOrder);
    
    this.calculateSummary(this.selectedOrder);
    this.detailModalVisible = true;
  }

 

  calculateSummary(order: any): void {
    const details = order.details || [];
    const completedProducts = details.filter((product: any) => 
      product.producedQuantity === product.requestedQuantity).length;
    const incompleteProducts = details.filter((product: any) => 
      product.producedQuantity < product.requestedQuantity).length;

    const totalRequested = details.reduce((sum: number, product: any) => 
      sum + product.requestedQuantity, 0);
    const totalProduced = details.reduce((sum: number, product: any) => 
      sum + (product.producedQuantity || 0), 0);
    const efficiency = totalRequested > 0 ? 
      ((totalProduced / totalRequested) * 100).toFixed(2) : '0';

    this.completedProducts = completedProducts;
    this.incompleteProducts = incompleteProducts;
    this.totalRequested = totalRequested;
    this.totalProduced = totalProduced;
    this.efficiency = efficiency;
  }

  getStatusClass(status: string): string {
    const statusUpper = status?.toUpperCase() || '';
    if (statusUpper.includes('COMPLETAD')) return 'status-completed';
    if (statusUpper.includes('CANCELAD')) return 'status-danger';
    if (statusUpper.includes('PROCESO')) return 'status-info';
    if (statusUpper.includes('PENDIENTE')) return 'status-warning';
    return 'status-secondary';
  }


  //  MÉTODOS CRUD 
  guardarOrden(): void {
    if (this.productionForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos obligatorios.', 'warning');
      return;
    }

    const formValue = this.productionForm.value;
    const requestData = {
      productionDate: formValue.productionDate,
      assignedToId: formValue.assignedToId || null,
      status: 'PENDIENTE',
      comments: formValue.comments || '',
      details: formValue.details.map((detail: any) => ({
        productId: Number(detail.productId),
        requestedQuantity: Number(detail.requestedQuantity)
      }))
    };

    const observable = this.isEditing && this.ordenEditando?.id
      ? this.service.updateProduction(this.ordenEditando.id, requestData)
      : this.service.createProduction(requestData);

    observable.subscribe({
      next: () => {
        Swal.fire('Éxito', `Orden ${this.isEditing ? 'actualizada' : 'creada'} correctamente.`, 'success');
        this.loadProductions();
        this.loadHistorial();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error:', err);
        let errorMessage = `No se pudo ${this.isEditing ? 'actualizar' : 'crear'} la orden.`;
        if (err.error?.message) {
          errorMessage += ` Error: ${err.error.message}`;
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  onDelete(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la orden de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteProduction(id).subscribe(() => {
          this.loadProductions();
          Swal.fire('Eliminado', 'La orden ha sido eliminada correctamente.', 'success');
        });
      }
    });
  }


  getStatusSeverity(status: string): string {
    const statusUpper = status.toUpperCase();
    if (statusUpper.includes('PENDIENTE')) return 'warning';
    if (statusUpper.includes('COMPLETAD')) return 'success';
    if (statusUpper.includes('CANCELAD')) return 'danger';
    if (statusUpper.includes('PROCESO')) return 'info';
    return 'secondary';
  }

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
  }
}


