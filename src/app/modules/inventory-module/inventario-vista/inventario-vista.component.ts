import { Component } from '@angular/core';
import { InventarioServiceService } from '../services/inventario-service.service';
import { CategoriaService } from '../services/categoria.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RealtimeService } from 'src/app/services/realtime.service';

interface Producto {
  id: number;
  name: string;
  category: { name: string };
  image: string;
  stock: number;
  unidadMedida: string;
  price: number;
  active: boolean; 
}

@Component({
  selector: 'app-inventario-vista',
  templateUrl: './inventario-vista.component.html',
  styleUrls: ['./inventario-vista.component.css']
})
export class InventarioVistaComponent {



  searchTerm: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  categorias: any[] = [];
  intentoGuardar: boolean = false;
  selectedFile: File | null = null;

  productoActual: any = {
    id: null,
    name: '',
    price: 0,
    stock: 0,
    image: '',
    active: true,
    categoryId: null
  };

  productos: Producto[] = [];

  constructor(
    private serviceProducto: InventarioServiceService,
    private serviceCategory: CategoriaService,
    private snackBar: MatSnackBar,
      private realtimeService: RealtimeService

  ) {}

  mostrarAlerta(texto: string) {
    this.snackBar.open(texto, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
      this.iniciarEscuchaEventosSSE();
  }

  get filteredProducts(): Producto[] {
    if (!this.searchTerm) return this.productos;
    const term = this.searchTerm.toLowerCase();
    return this.productos.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category?.name.toLowerCase().includes(term) ||
      p.id.toString().includes(term)
    );
  }

  iniciarEscuchaEventosSSE(): void {
  const url = 'https://velazco-realtime-service-develop.up.railway.app/sse/events';

  this.realtimeService.listenToEvent('product.created', url).subscribe({
    next: (event) => {
      this.productos.push(this.mapProducto(event.data));
      this.mostrarAlerta('🆕 Producto creado en tiempo real');
    }
  });

  this.realtimeService.listenToEvent('product.updated', url).subscribe({
    next: (event) => {
      const i = this.productos.findIndex(p => p.id === event.data.id);
      if (i !== -1) this.productos[i] = this.mapProducto(event.data);
      this.mostrarAlerta('✏️ Producto actualizado en tiempo real');
    }
  });

  this.realtimeService.listenToEvent('product.deleted', url).subscribe({
    next: (event) => {
      this.productos = this.productos.filter(p => p.id !== event.data.id);
      this.mostrarAlerta('🗑️ Producto eliminado en tiempo real');
    }
  });

  this.realtimeService.listenToEvent('product.stock.changed', url).subscribe({
    next: (event) => {
      const idx = this.productos.findIndex(p => p.id === event.data.productId);
      if (idx !== -1) {
        this.productos[idx].stock = event.data.newStock;
        this.mostrarAlerta('📦 Stock actualizado en tiempo real');
      }
    }
  });

  this.realtimeService.listenToEvent('category.created', url).subscribe({
    next: (event) => {
      this.categorias.push(event.data);
      this.mostrarAlerta('📁 Categoría creada');
    }
  });

  this.realtimeService.listenToEvent('category.updated', url).subscribe({
    next: (event) => {
      const i = this.categorias.findIndex(c => c.id === event.data.id);
      if (i !== -1) this.categorias[i] = event.data;
      this.mostrarAlerta('📁 Categoría actualizada');
    }
  });

  this.realtimeService.listenToEvent('category.deleted', url).subscribe({
    next: (event) => {
      this.categorias = this.categorias.filter(c => c.id !== event.data.id);
      this.mostrarAlerta('📁 Categoría eliminada');
    }
  });
}



  abrirModalEdicion(producto: Producto): void {
    this.isEditing = true;
    this.productoActual = {
      id: producto.id,
      name: producto.name,
      price: producto.price,
      stock: producto.stock,
      image: producto.image,
      active: producto.active,
      categoryId: this.categorias.find(cat => cat.name === producto.category.name)?.id || null
    };
    this.selectedFile = null;
    this.showModal = true;
  }

  abrirModalCreacion(): void {
    this.isEditing = false;
    this.productoActual = this.crearProductoVacio();
    this.selectedFile = null;
    this.showModal = true;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

guardarProducto(): void {
  if (this.isEditing) {
    this.actualizarProducto();
  } else {
    const formData = new FormData();

    formData.append('name', this.productoActual.name);
    formData.append('price', this.productoActual.price.toString());
    formData.append('stock', this.productoActual.stock.toString());
    formData.append('active', this.productoActual.active ? 'true' : 'false');
    formData.append('categoryId', this.productoActual.categoryId.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.serviceProducto.agregarProducto(formData).subscribe({
      next: (res) => {
        const nuevoProducto: Producto = this.mapProducto(res);
        this.productos.push(nuevoProducto);
        this.mostrarAlerta("Producto agregado correctamente");
        this.selectedFile = null;
        this.cerrarModal();
      },
      error: (err: any) => {
        console.error('Error al agregar producto con imagen:', err);
      }
    });
  }
}


actualizarProducto(): void {
  if (!this.productoActual.id) {
    console.error('No hay ID para actualizar el producto');
    return;
  }

  // Si seleccionaste nueva imagen, usar FormData
  if (this.selectedFile) {
    const formData = new FormData();

    formData.append('name', this.productoActual.name);
    formData.append('price', this.productoActual.price.toString());
    formData.append('stock', this.productoActual.stock.toString());
    formData.append('active', this.productoActual.active ? 'true' : 'false');
    formData.append('categoryId', this.productoActual.categoryId.toString());
    formData.append('image', this.selectedFile);

    this.serviceProducto.actualizarProducto(this.productoActual.id, formData).subscribe({
      next: (res) => {
        const actualizado = this.mapProducto(res);
        const index = this.productos.findIndex(p => p.id === actualizado.id);
        if (index !== -1) {
          this.productos[index] = actualizado;
        }
        this.mostrarAlerta('✅ Producto actualizado correctamente');
        this.cerrarModal();
      },
      error: (err: any) => console.error('Error al actualizar producto:', err)
    });
  } else {
    // Sin nueva imagen, envía objeto normal
    this.serviceProducto.actualizarProducto(this.productoActual.id, this.productoActual).subscribe({
      next: (res) => {
        const actualizado = this.mapProducto(res);
        const index = this.productos.findIndex(p => p.id === actualizado.id);
        if (index !== -1) {
          this.productos[index] = actualizado;
        }
        this.mostrarAlerta('✅ Producto actualizado correctamente');
        this.cerrarModal();
      },
      error: (err: any) => console.error('Error al actualizar producto:', err)
    });
  }
}

  eliminarProducto(id: number): void {
  if (confirm('¿Está seguro de eliminar este producto?')) {
    this.serviceProducto.eliminarProducto(id).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.id !== id);
        this.mostrarAlerta('Producto eliminado correctamente');
      },
      error: (err: any) => {
        console.error('Error al eliminar producto', err);
        alert('No se puede eliminar un producto que tiene órdenes o detalles de producción asociados');
      }
    });
  }
}



  toggleEstado(producto: Producto): void {
    const nuevoEstado = !producto.active;
    this.serviceProducto.actualizarEstadoActivo(producto.id, nuevoEstado).subscribe({
      next: () => {
        producto.active = nuevoEstado;
      },
      error: (err: any) => console.error('Error al actualizar estado', err)
    });
  }

  cargarProductos(): void {
    this.serviceProducto.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data.map((p: any) => this.mapProducto(p));
      },
      error: (err: any) => console.error('Error al obtener productos:', err)
    });
  }

  cargarCategorias(): void {
    this.serviceCategory.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err: any) => console.error('Error al obtener categorias:', err)
    });
  }

  agregarNuevaCategoria(): void {
    const nombre = this.nuevaCategoria.trim();
    if (!nombre) return;

    const categoriaObj = { name: nombre };

    this.serviceCategory.agregarCategoria(categoriaObj).subscribe({
      next: () => {
        this.categorias.push(categoriaObj);
        this.nuevaCategoria = '';
      },
      error: (error: any) => console.error('Error al agregar categoría:', error)
    });
  }

  editarCategoria(index: number): void {
    this.categoriaEnEdicion = index;
    this.nuevaCategoria = this.categorias[index].name;
    this.mostrarModalCategoria = true;
    this.isEditing = true;
  }

  actualizarCategoria(): void {
    const editada = this.nuevaCategoria.trim();

    if (editada && this.categoriaEnEdicion !== null) {
      const categoria = this.categorias[this.categoriaEnEdicion!];

      this.serviceCategory.actualizarCategoria(categoria.id, { name: editada }).subscribe({
        next: () => {
          this.categorias[this.categoriaEnEdicion!].name = editada;
          this.cancelarEdicion();
          this.mostrarAlerta("Categoría actualizada correctamente");
        },
        error: (err: any) => console.error('Error al actualizar categoría', err)
      });
    }
  }

  eliminarCategoria(categoria: any): void {
    this.serviceCategory.eliminarCategoria(categoria.id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter(c => c.id !== categoria.id);
        this.cancelarEdicion();
        this.mostrarAlerta('🗑️ Categoría eliminada correctamente');
      },
      error: (err: any) => console.error('Error al eliminar categoría', err)
    });
  }

  cancelarEdicion(): void {
    this.categoriaEnEdicion = null;
    this.nuevaCategoria = '';
    this.mostrarModalCategoria = false;
  }

  private crearProductoVacio(): Producto {
    return {
      id: 0,
      name: '',
      category: { name: '' },
      stock: 0,
      unidadMedida: 'unidades',
      price: 0,
      active: true,
      image: ''
    };
  }

  cerrarModal(): void {
    this.showModal = false;
    this.isEditing = false;
    this.productoActual = this.crearProductoVacio();
    this.selectedFile = null;
    this.intentoGuardar = false;
  }

validarYGuardar(): void {
  this.intentoGuardar = true;

  if (
    !this.productoActual.name ||
    !this.productoActual.categoryId ||
    this.productoActual.stock === null ||
    this.productoActual.stock === undefined ||
    this.productoActual.stock < 0 ||
    this.productoActual.price === null ||
    this.productoActual.price === undefined ||
    this.productoActual.price <= 0 ||
    this.productoActual.active === null ||
    (!this.selectedFile && !this.isEditing)
  ) {
    console.log('Validación falló:', {
      name: this.productoActual.name,
      categoryId: this.productoActual.categoryId,
      stock: this.productoActual.stock,
      price: this.productoActual.price,
      active: this.productoActual.active,
      selectedFile: this.selectedFile,
      isEditing: this.isEditing,
    });
    return;
  }

  this.guardarProducto();
}
  // Mapea el producto recibido para asegurar estructura correcta
private backendBaseUrl = 'https://velazco-backend-develop.up.railway.app';

private mapProducto(p: any): Producto {
  return {
    id: p.id,
    name: p.name || p.nombre || '',
    category: { name: p.category?.name || p.categoria?.name || '' },
    image: p.image ? this.backendBaseUrl + p.image : '',
    stock: p.stock || 0,
    unidadMedida: p.unidadMedida || 'unidades',
    price: p.price || p.precio || 0,
    active: p.active ?? true
  };
}

  abrirModalCategoria() {
  this.mostrarModalCategoria = true;
}

cerrarModalCategoria() {
  this.mostrarModalCategoria = false;
  this.cancelarEdicion();
}


  // Variables para modal categorías
  mostrarModalCategoria: boolean = false;
  nuevaCategoria: string = '';
  categoriaEnEdicion: number | null = null;
}
