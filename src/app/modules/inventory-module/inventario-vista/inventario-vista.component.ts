import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-inventario-vista',
  templateUrl: './inventario-vista.component.html',
  styleUrls: ['./inventario-vista.component.css']
})
export class InventarioVistaComponent {
  searchTerm: string = '';
  showModal: boolean = false;
  categorias: string[] = ['Tortas', 'Pasteles', 'Galletas', 'Cupcakes', 'Panes'];
  
  nuevoProducto: Producto = {
    id: 0,
    nombre: '',
    categoria: '',
    stock: 0,
    precio: 0,
    estado: 'Activo'
  };

  productos: Producto[] = [
    { id: 1, nombre: 'Torta de Chocolate', categoria: 'Tortas', stock: 15, precio: 25.99, estado: 'Activo' },
    { id: 2, nombre: 'Cheesecake', categoria: 'Pasteles', stock: 8, precio: 28.50, estado: 'Activo' },
    { id: 3, nombre: 'Galletas de Avena', categoria: 'Galletas', stock: 45, precio: 1.50, estado: 'Activo' },
    { id: 4, nombre: 'Cupcakes de Vainilla', categoria: 'Cupcakes', stock: 20, precio: 3.25, estado: 'Activo' },
    { id: 5, nombre: 'Pan de Banana', categoria: 'Panes', stock: 5, precio: 12.99, estado: 'Inactivo' }
  ];

  get filteredProducts(): Producto[] {
    if (!this.searchTerm) return this.productos;
    return this.productos.filter(producto => 
      producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetNuevoProducto();
  }

  agregarProducto(): void {
    this.nuevoProducto.id = this.productos.length > 0 
      ? Math.max(...this.productos.map(p => p.id)) + 1 
      : 1;
    this.productos.push({...this.nuevoProducto});
    this.closeModal();
  }

  editarProducto(producto: Producto): void {
    // Implementar lógica de edición
    console.log('Editar producto:', producto);
  }

  eliminarProducto(id: number): void {
    this.productos = this.productos.filter(p => p.id !== id);
  }

  toggleEstado(producto: Producto): void {
    producto.estado = producto.estado === 'Activo' ? 'Inactivo' : 'Activo';
  }

  private resetNuevoProducto(): void {
    this.nuevoProducto = {
      id: 0,
      nombre: '',
      categoria: '',
      stock: 0,
      precio: 0,
      estado: 'Activo'
    };
  }
}