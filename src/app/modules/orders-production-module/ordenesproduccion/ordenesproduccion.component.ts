import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OrdenProduccionService } from '../services/ordenes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-production',
  templateUrl: './ordenesproduccion.component.html',
  styleUrls: ['./ordenesproduccion.component.css']
})
export class ProductionComponent implements OnInit {
  productions: any[] = [];
  historial: any[] = [];
  products: any[] = [];
  activeTab: 'pendientes' | 'historial' = 'pendientes';
   activeTabIndex: number = 0;

  modalVisible = false;
  isEditing = false;
  ordenEditando: any = null;
  productionForm: FormGroup = this.fb.group({
    productionDate: ['', Validators.required],
    assignedToId: [null],
    status: ['PENDIENTE'],
    comments: [''], 
    details: this.fb.array([])
  });
  
  constructor(
    private service: OrdenProduccionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
  this.initForm();  // Inicializa primero el formulario
  this.loadProductions();
  this.loadHistorial();
  this.loadProducts();
}

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
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
        id: orden.orderNumber,                     // Lo que muestras en tu tabla como id
        productionDate: orden.date,               // Lo que muestras como productionDate
        status: orden.status,
        assignedTo: { name: orden.responsible },  // Asignado, por si lo usas
        details: orden.products.map((p: any) => ({
          product: { name: p.productName },
          requestedQuantity: p.requestedQuantity,
          producedQuantity: p.producedQuantity,
          comments: p.comments || ''
        }))
      }));
  });
}

  loadProducts(): void {
    this.service.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  abrirModalNuevaOrden(): void {
    this.isEditing = false;
    this.ordenEditando = null;
    this.initForm();
    this.details.push(this.createDetail()); // Agrega al menos un detalle por defecto
    this.modalVisible = true;
  }

  editarOrden(order: any): void {
    this.isEditing = true;
    this.ordenEditando = order;
    this.initForm();
    this.patchForm(); // Se aplica después de inicializar el formulario
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.ordenEditando = null;
  }

  initForm(): void {
    this.productionForm = this.fb.group({
      productionDate: ['', Validators.required],
      assignedToId: [null],  // Este campo puede quedarse vacío si no tienes usuarios
      status: ['PENDIENTE'],
      comments: [''],
      details: this.fb.array([])  // Inicializar la lista de detalles
    });
  }

  patchForm(): void {
    if (!this.ordenEditando) return;

    this.productionForm.patchValue({
      productionDate: this.ordenEditando.productionDate,
      assignedToId: this.ordenEditando.assignedTo?.id || null,
      status: this.ordenEditando.status,
      comments: this.ordenEditando.comments || '' // Comentario general
    });

    this.details.clear();

    this.ordenEditando.details.forEach((d: any) => {
      // Solo enviar productId y cantidad, sin comentarios en detalles
      this.details.push(this.fb.group({
        productId: [d.product.id, Validators.required],
        requestedQuantity: [Number(d.requestedQuantity), [Validators.required, Validators.min(1)]]
      }));
    });
  }

  get details(): FormArray {
  if (!this.productionForm) {
    this.initForm();
  }
  return this.productionForm?.get('details') as FormArray || this.fb.array([]);
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
      comments: formValue.comments || '', // Comentario general
      details: formValue.details.map((detail: any) => ({
        productId: Number(detail.productId),
        requestedQuantity: Number(detail.requestedQuantity)
      }))
    };

    console.log('Datos a enviar:', JSON.stringify(requestData, null, 2));

  // Manejar creación/actualización
  const observable = this.isEditing && this.ordenEditando?.id
    ? this.service.updateProduction(this.ordenEditando.id, requestData)
    : this.service.createProduction(requestData);

  observable.subscribe({
    next: () => {
      Swal.fire('Éxito', `Orden ${this.isEditing ? 'actualizada' : 'creada'} correctamente.`, 'success');
      this.loadProductions();
      this.loadHistorial(); // Actualizar ambos listados
      this.cerrarModal();
    },
    error: (err) => {
      console.error('Error completo:', err);
      let errorMessage = `No se pudo ${this.isEditing ? 'actualizar' : 'crear'} la orden.`;
      
      if (err.error?.message) {
        errorMessage += ` Error: ${err.error.message}`;
      } else if (err.status === 500) {
        errorMessage += ' Error interno del servidor.';
      }

      Swal.fire('Error', errorMessage, 'error');
    }
  });
}

verDetalles(orden: any): void {
  Swal.fire({
    title: `Orden ${orden.id}`,
    html: `
      <p><strong>Fecha:</strong> ${new Date(orden.productionDate).toLocaleDateString()}</p>
      <p><strong>Estado:</strong> ${orden.status}</p>
      ${orden.comments ? `<p><strong>Comentarios:</strong> ${orden.comments}</p>` : ''}
      <p><strong>Productos:</strong></p>
      <ul style="text-align: left">
        ${orden.details.map((d: any) =>
          `<li><strong>${d.product.name}</strong> - Solicitados: ${d.requestedQuantity}, 
           Producidos: ${d.producedQuantity || 0}
           ${d.comments ? ` | Comentario: ${d.comments}` : ''}</li>`
        ).join('')}
      </ul>
    `,
    confirmButtonText: 'Cerrar',
    width: 600
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
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'La orden ha sido eliminada correctamente.',
            confirmButtonColor: '#3085d6'
          });
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
}
