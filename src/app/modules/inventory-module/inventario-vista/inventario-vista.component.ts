import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventarioServiceService } from '../services/inventario-service.service';
import { CategoriaService } from '../services/categoria.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  categorias: any[] = [];


  // Modelo para nuevo producto/edición
  productoActual: any = {
    name: '',
    price: 0,
    stock: 0,
    active: true,
    categoryId: null
  };

  // "Base de datos" en memoria
  private _productos: Producto[] = [
    { id: 1, nombre: 'Torta de Chocolate', categoria: 'Tortas', stock: 15, unidadMedida: 'unidades', precio: 25.99, estado: 'Activo' },

  ];


  productos: any[] = [];
  constructor(private serviceProducto: InventarioServiceService, private serviceCategory: CategoriaService, private snackBar: MatSnackBar) {

  }


  mostrarAlerta(texto: string) {
    this.snackBar.open(texto, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }



  ngOnInit(): void {
    this.cargarProductos();
    console.log(this.productos);
    this.cargarCategorias();
    console.log(this.categorias)
  }

  get filteredProducts(): any[] {
    if (!this.searchTerm) return this.productos;
    const term = this.searchTerm.toLowerCase();
    return this.productos.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category?.name.toLowerCase().includes(term)
    );
  }


  // Métodos públicos
  abrirModalEdicion(producto: Producto): void {
    this.isEditing = true;
    this.productoActual = { ...producto };
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

      this.serviceProducto.eliminarProducto(id).subscribe({
        next: () => {
          console.log("producto eliminado");
          this.cargarProductos();
        },
        error: (err) => console.error('Error al eliminar producto')

      })
    }
  }

  mostrarModalCategoria = false;
  nuevaCategoria = '';
  categoriaEnEdicion: number | null = null;

  abrirModalCategoria() {
    this.mostrarModalCategoria = true;
  }

  cerrarModalCategoria() {
    this.mostrarModalCategoria = false;
    this.cancelarEdicion();
  }


  editarCategoria(index: number) {
    this.categoriaEnEdicion = index;
    this.nuevaCategoria = this.categorias[index];
  }

  actualizarCategoria() {
    const editada = this.nuevaCategoria.trim();
    if (
      editada &&
      !this.categorias.includes(editada) &&
      this.categoriaEnEdicion !== null
    ) {
      this.categorias[this.categoriaEnEdicion] = editada;
      this.cancelarEdicion();
    }
  }

  cancelarEdicion() {
    this.categoriaEnEdicion = null;
    this.nuevaCategoria = '';
  }

  eliminarCategoria(cat: string) {
    this.categorias = this.categorias.filter(c => c !== cat);
    this.cancelarEdicion();
  }

  toggleEstado(producto: any) {
    producto.active = !producto.active;
  }

  // Métodos de los servicios



  cargarProductos() {
    this.serviceProducto.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => console.error('Error al obtener productos:', err)
    });
  }

  cargarCategorias() {
    this.serviceCategory.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => console.error('Error al obtener productos:', err)
    });
  }

  agregarNuevaCategoria() {
    const nombre = this.nuevaCategoria.trim(); // Limpia espacios en blanco al inicio y final
    if (!nombre) return;

    const categoriaObj = { name: nombre };

    this.serviceCategory.agregarCategoria(categoriaObj).subscribe({
      next: () => {
        this.categorias.push(categoriaObj); // Solo si el backend responde exitosamente
        this.nuevaCategoria = '';
      },
      error: (error) => {
        console.error('Error al agregar categoría:', error);
      }
    });
  }

  agregarProducto() {
    this.serviceProducto.agregarProducto(this.productoActual).subscribe({
      next: (res) => {
        console.log('Producto agregado:', res);
        this.mostrarAlerta("Producto agregado correctamente");
        this.cargarProductos();

      },
      error: (err) => console.error('Error al agregar producto:', err)
    });
  }

  actualizarProducto() {
    if (!this.productoActual.id) {
      console.error('No hay ID para actualizar el producto');
      return;
    }

    this.serviceProducto.actualizarProducto(this.productoActual.id, this.productoActual).subscribe({
      next: (res) => {
        console.log('Producto actualizado:', res);
        // Actualiza lista o notifica al usuario
      },
      error: (err) => console.error('Error al actualizar producto:', err)
    });
  }

  actualizarEstado(){

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