import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  unidadMedida: string;
  precio: number;
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-inventario-vista',
  templateUrl: './inventario-vista.component.html',
  styleUrls: ['./inventario-vista.component.css']
})
export class InventarioVistaComponent {
  // Variables de estado
  searchTerm: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  categorias: string[] = ['Tortas', 'Pasteles', 'Galletas', 'Cupcakes', 'Panes'];
  unidadesMedida: string[] = ['unidades', 'kilogramos', 'gramos', 'litros'];
  
  // Modelo para nuevo producto/edición
  productoActual: Producto = this.crearProductoVacio();

  // "Base de datos" en memoria
  private _productos: Producto[] = [
    { id: 1, nombre: 'Torta de Chocolate', categoria: 'Tortas', stock: 15, unidadMedida: 'unidades', precio: 25.99, estado: 'Activo' },
    { id: 2, nombre: 'Cheesecake', categoria: 'Pasteles', stock: 8, unidadMedida: 'unidades', precio: 28.50, estado: 'Activo' },
    { id: 3, nombre: 'Galletas de Avena', categoria: 'Galletas', stock: 45, unidadMedida: 'unidades', precio: 1.50, estado: 'Activo' },
    { id: 4, nombre: 'Cupcakes de Vainilla', categoria: 'Cupcakes', stock: 20, unidadMedida: 'unidades', precio: 3.25, estado: 'Activo' },
    { id: 5, nombre: 'Pan de Banana', categoria: 'Panes', stock: 5, unidadMedida: 'unidades', precio: 12.99, estado: 'Inactivo' }
  ];

  // Getter para productos filtrados
  get filteredProducts(): Producto[] {
    if (!this.searchTerm) return this._productos;
    const term = this.searchTerm.toLowerCase();
    return this._productos.filter(p => 
      p.nombre.toLowerCase().includes(term) || 
      p.categoria.toLowerCase().includes(term)
    );
  }

  // Métodos públicos
  abrirModalEdicion(producto: Producto): void {
    this.isEditing = true;
    this.productoActual = {...producto};
    this.showModal = true;
  }

  abrirModalCreacion(): void {
    this.isEditing = false;
    this.productoActual = this.crearProductoVacio();
    this.showModal = true;
  }

  guardarProducto(): void {
    if (this.isEditing) {
      this.actualizarProducto();
    } else {
      this.agregarProducto();
    }
    this.cerrarModal();
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this._productos = this._productos.filter(p => p.id !== id);
    }
  }

  toggleEstado(producto: Producto): void {
    producto.estado = producto.estado === 'Activo' ? 'Inactivo' : 'Activo';
  }

  // Métodos privados
  private agregarProducto(): void {
    const nuevoId = this._productos.length > 0 
      ? Math.max(...this._productos.map(p => p.id)) + 1 
      : 1;
    
    this._productos.push({
      ...this.productoActual,
      id: nuevoId
    });
  }

  private actualizarProducto(): void {
    const index = this._productos.findIndex(p => p.id === this.productoActual.id);
    if (index !== -1) {
      this._productos[index] = {...this.productoActual};
    }
  }

  private crearProductoVacio(): Producto {
    return {
      id: 0,
      nombre: '',
      categoria: '',
      stock: 0,
      unidadMedida: 'unidades',
      precio: 0,
      estado: 'Activo'
    };
  }

  cerrarModal(): void {
    try {
      this.showModal = false;
      this.isEditing = false;
      this.productoActual = {
        id: 0,
        nombre: '',
        categoria: '',
        unidadMedida: '',

        stock: 0,
        
        precio: 0,
        estado: 'Activo'
      };
      console.log('Modal cerrado correctamente'); // Para depuración
    } catch (error) {
      console.error('Error al cerrar el modal:', error);
      // Fallback seguro
      this.showModal = false;
    }
} 
}