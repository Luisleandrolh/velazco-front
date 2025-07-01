import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { OrdenProduccionService } from '../services/ordenes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-production',
  templateUrl: './ordenesproduccion.component.html',
  styleUrls: ['./ordenesproduccion.component.css']
})
export class ProductionComponent implements OnInit {
  productionForm!: FormGroup;
  productions: any[] = [];
  products: any[] = [];

  isEditing = false;
  editingId: number | null = null;

  constructor(private fb: FormBuilder, private service: OrdenProduccionService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProductions();
    this.loadProducts();
  }

  initForm() {
    this.productionForm = this.fb.group({
      productionDate: [''],
      assignedToId: [''],
      status: ['PENDIENTE'],
      details: this.fb.array([this.createDetail()])
    });
  }

  createDetail(): FormGroup {
    return this.fb.group({
      productId: [''],
      requestedQuantity: [''],
      comments: ['']
    });
  }

  get details(): FormArray {
    return this.productionForm.get('details') as FormArray;
  }

  addDetail(): void {
    this.details.push(this.createDetail());
  }

  removeDetail(index: number): void {
    this.details.removeAt(index);
  }

  loadProductions(): void {
    this.service.getAllProductions().subscribe(data => {
      this.productions = data;
    });
  }

  loadProducts(): void {
    this.service.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  onSubmit(): void {
    const value = this.productionForm.value;
    if (this.isEditing && this.editingId !== null) {
      this.service.updateProduction(this.editingId, value).subscribe(() => {
        this.resetForm();
        this.loadProductions();
        Swal.fire({
          icon: 'success',
          title: 'Orden actualizada',
          text: 'La orden ha sido actualizada correctamente.',
          confirmButtonColor: '#3085d6'
        });
      });
    } else {
      this.service.createProduction(value).subscribe(() => {
        this.resetForm();
        this.loadProductions();
        Swal.fire({
          icon: 'success',
          title: 'Orden creada',
          text: 'La orden ha sido registrada exitosamente.',
          confirmButtonColor: '#3085d6'
        });
      });
    }
  }

  onEdit(production: any): void {
    this.isEditing = true;
    this.editingId = production.id;

    this.productionForm.patchValue({
      productionDate: production.productionDate,
      assignedToId: production.assignedTo?.id,
      status: production.status
    });

    this.details.clear();
    production.details.forEach((d: any) => {
      this.details.push(this.fb.group({
        productId: d.product.id,
        requestedQuantity: d.requestedQuantity,
        comments: d.comments
      }));
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

  resetForm(): void {
    this.productionForm.reset({
      productionDate: '',
      assignedToId: '',
      status: 'PENDIENTE',
      details: []
    });

    // Asegura al menos un producto vacío tras limpiar
    this.details.clear();
    this.details.push(this.createDetail());

    this.isEditing = false;
    this.editingId = null;
  }
}
