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
intentoGuardar: boolean = false;


  // Modelo para nuevo producto/edición
  productoActual: any = {
    id: null,
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
    this.nuevaCategoria = this.categorias[index].cat.name;
    this.mostrarModalCategoria = true; // si usas un modal para editar
    this.isEditing = true; // opcional, si controlas con esto

  }

actualizarCategoria() {
  const editada = this.nuevaCategoria.trim();
  
  if (
    editada &&
    this.categoriaEnEdicion !== null
  ) {
    const categoria = this.categorias[this.categoriaEnEdicion!];

    this.serviceCategory.actualizarCategoria(categoria.id, { name: editada }).subscribe({ //llama al servicio para actualiar la cat
      next: (res) => { //si la api se ejecuta correctamente se ejecuta el bloque 
        this.categorias[this.categoriaEnEdicion!].name = editada; //se actualiza el name
        this.cancelarEdicion();
        alert('✅ Categoría actualizada correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar categoría', err);
      }
    });
  }
}



    eliminarCategoria(categoria: any) {
  this.serviceCategory.eliminarCategoria(categoria.id).subscribe({
    next: () => {
      this.categorias = this.categorias.filter(c => c.id !== categoria.id);
      this.cancelarEdicion();
      alert('🗑️ Categoría eliminada correctamente');
    },
    error: (err) => {
      console.error('Error al eliminar categoría', err);
    }
  });
}


  cancelarEdicion() {
    this.categoriaEnEdicion = null;
    this.nuevaCategoria = '';
  }


 toggleEstado(producto: any) {
  const nuevoEstado = !producto.active;  // Invertir el estado actual

  this.serviceProducto.actualizarEstadoActivo(producto.id, nuevoEstado).subscribe({ //llama al servicio para actualizar en el back
    next: (res) => {
      producto.active = nuevoEstado;  // Actualizar localmente en la interfaz solo si la petición fue exitosa
      console.log('Estado actualizado correctamente', res);
    },
    error: (err) => {
      console.error('Error al actualizar estado', err);
      // Opcional: revertir el toggle si hubo error
    }
  });
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

  //CRUD DE PRODUCTOS

  // post
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

  // put
actualizarProducto() {
  if (!this.productoActual.id) {
    console.error('No hay ID para actualizar el producto');
    return;
  }

  this.serviceProducto.actualizarProducto(this.productoActual.id, this.productoActual).subscribe({
    next: (res) => {
      console.log('Producto actualizado:', res);
      alert('✅ Producto actualizado correctamente');
      this.cargarProductos();
    },
    error: (err) => console.error('Error al actualizar producto:', err)
  });
  
}


  //delete
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
  validarYGuardar() {
  this.intentoGuardar = true;
  
  // Validar campos obligatorios
  if (!this.productoActual.name || 
      !this.productoActual.categoryId || 
      this.productoActual.stock === null || 
      this.productoActual.stock === undefined ||
      this.productoActual.stock < 0 ||
      this.productoActual.price === null || 
      this.productoActual.price === undefined ||
      this.productoActual.price <= 0 ||
      this.productoActual.active === null) {
    return; // No guardar si hay errores
  }
  
  // Si pasa la validación, guardar el producto
  this.guardarProducto();
  this.intentoGuardar = false;
}
}