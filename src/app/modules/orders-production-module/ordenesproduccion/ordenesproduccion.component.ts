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

  modalVisible = false;
  isEditing = false;
  ordenEditando: any = null;
  productionForm!: FormGroup;

  constructor(
    private service: OrdenProduccionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadProductions();
    this.loadHistorial();
    this.loadProducts();
  }

  loadProductions(): void {
    this.service.getAllProductions().subscribe(data => {
      this.productions = data;
    });
  }

  loadHistorial(): void {
    this.service.getHistorialProductions().subscribe(data => {
      this.historial = data.filter((orden: any) => orden.status?.toUpperCase() !== 'PENDIENTE');
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
      assignedToId: [null],
      status: ['PENDIENTE'],
      details: this.fb.array([])
    });
  }

  patchForm(): void {
    if (!this.ordenEditando) return;

    this.productionForm.patchValue({
      productionDate: this.ordenEditando.productionDate,
      assignedToId: this.ordenEditando.assignedTo?.id || null,
      status: this.ordenEditando.status
    });

    this.details.clear();

    this.ordenEditando.details.forEach((d: any) => {
      this.details.push(this.fb.group({
        productId: [d.product.id, Validators.required],
        requestedQuantity: [Number(d.requestedQuantity), [Validators.required, Validators.min(1)]],
        comments: [d.comments || '']
      }));
    });
  }

  get details(): FormArray {
    return this.productionForm.get('details') as FormArray;
  }

  createDetail(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      requestedQuantity: [null, [Validators.required, Validators.min(1)]],
      comments: ['']
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

    const value = this.productionForm.value;

    console.log('Enviando datos al backend:', value); // Depuración

    if (this.isEditing && this.ordenEditando?.id) {
      this.service.updateProduction(this.ordenEditando.id, value).subscribe({
        next: () => {
          this.loadProductions();
          Swal.fire('Actualizado', 'La orden ha sido actualizada.', 'success');
          this.cerrarModal();
        },
        error: err => {
          console.error('Error al actualizar:', err);
          Swal.fire('Error', 'No se pudo actualizar la orden.', 'error');
        }
      });
    } else {
      this.service.createProduction(value).subscribe({
        next: () => {
          this.loadProductions();
          Swal.fire('Creado', 'La orden ha sido creada.', 'success');
          this.cerrarModal();
        },
        error: err => {
          console.error('Error al crear:', err);
          Swal.fire('Error', 'No se pudo crear la orden.', 'error');
        }
      });
    }
  }

  verDetalles(orden: any): void {
    Swal.fire({
      title: `Orden #${orden.id}`,
      html: `
        <p><strong>Fecha:</strong> ${new Date(orden.productionDate).toLocaleDateString()}</p>
        <p><strong>Estado:</strong> ${orden.status}</p>
        <p><strong>Productos:</strong></p>
        <ul style="text-align: left">
          ${orden.details.map((d: any) =>
            `<li><strong>${d.product.name}</strong> (${d.requestedQuantity})<br><small>📝 ${d.comments || 'Sin comentario'}</small></li>`).join('')}
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
}
