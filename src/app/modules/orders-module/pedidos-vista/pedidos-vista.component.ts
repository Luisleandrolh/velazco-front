import { Component, OnInit } from '@angular/core';
import { InventarioServiceService } from '../../inventory-module/services/inventario-service.service';
import { CategoriaService } from '../../inventory-module/services/categoria.service';
import { OrdersModuleService } from '../services/orders-module.service';

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
  selector: 'app-pedidos-vista',
  templateUrl: './pedidos-vista.component.html',
  styleUrls: ['./pedidos-vista.component.css']
})
export class PedidosVistaComponent implements OnInit {

  productos: Producto[] = [];
  categorias: string[] = [];

  textoBusqueda: string = '';
  categoriaSeleccionada: string = 'Todos';
  mostrarModal: boolean = false;

  carrito: { producto: Producto; cantidad: number }[] = [];
  nombreCliente: string = '';

  private backendBaseUrl = 'https://velazco-backend-develop.up.railway.app';

  constructor(
    private inventarioService: InventarioServiceService,
    private categoriaService: CategoriaService,
    private pedidosService: OrdersModuleService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

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

  cargarProductos() {
    this.inventarioService.obtenerProductosActivos().subscribe({
      next: (data) => {
        this.productos = data.map((p: any) => this.mapProducto(p));
      },
      error: (err) => console.error('Error al obtener productos:', err)
    });
  }

  cargarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = ['Todos', ...data.map((cat: { name: any }) => cat.name)];
      },
      error: (err) => console.error('Error al obtener categorías:', err)
    });
  }

  get productosFiltrados(): Producto[] {
    return this.productos.filter((producto) => {
      const coincideTexto = producto.name.toLowerCase().includes(this.textoBusqueda.toLowerCase());
      const coincideCategoria =
        this.categoriaSeleccionada === 'Todos' ||
        producto.category.name === this.categoriaSeleccionada;
      return coincideTexto && coincideCategoria;
    });
  }

  cambiarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
  }

  agregarAlCarrito(producto: Producto) {
    const itemExistente = this.carrito.find(item => item.producto.id === producto.id);
    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      this.carrito.push({ producto, cantidad: 1 });
    }
  }

  cambiarCantidad(item: { producto: Producto; cantidad: number }, delta: number) {
    item.cantidad += delta;
    if (item.cantidad <= 0) {
      this.quitarDelCarrito(item);
    }
  }

  quitarDelCarrito(item: { producto: Producto; cantidad: number }) {
    const index = this.carrito.indexOf(item);
    if (index > -1) {
      this.carrito.splice(index, 1);
    }
  }

  vaciarCarrito() {
    this.carrito = [];
  }

  subtotalCarrito(): number {
    return this.carrito.reduce(
      (total, item) => total + item.producto.price * item.cantidad,
      0
    );
  }

  impuestosCarrito(): number {
    const tasaImpuestos = 0; // Puedes cambiarla si es necesario
    return this.subtotalCarrito() * tasaImpuestos;
  }

  totalCarrito(): number {
    return this.subtotalCarrito() + this.impuestosCarrito();
  }

  obtenerCantidadTotal(): number {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  finalizarCompra() {
    if (!this.nombreCliente.trim()) {
      alert('Por favor, ingrese el nombre del cliente.');
      return;
    }

    const payload = {
      clientName: this.nombreCliente.trim(),
      details: this.carrito.map(item => ({
        productId: item.producto.id,
        quantity: item.cantidad
      }))
    };

    this.pedidosService.crearPedido(payload).subscribe({
      next: () => {
        alert(`¡Pedido confirmado, ${this.nombreCliente}!`);
        this.vaciarCarrito();
        this.nombreCliente = '';
        this.mostrarModal = false;
      },
      error: (err) => {
        console.error('Error al crear el pedido:', err);
        alert('Ocurrió un error al confirmar el pedido. Intenta de nuevo más tarde.');
      }
    });
  }
}
