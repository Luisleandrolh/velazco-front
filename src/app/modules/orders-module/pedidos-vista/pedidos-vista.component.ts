  import { Component } from '@angular/core';
import { InventarioServiceService } from '../../inventory-module/services/inventario-service.service';

  @Component({
    selector: 'app-pedidos-vista',
    templateUrl: './pedidos-vista.component.html',
    styleUrls: ['./pedidos-vista.component.css']
  })
  export class PedidosVistaComponent {

    /* =======================
      Productos disponibles
      ======================= */

      productos_xd : any = [];

    productos = [
      {
        nombre: 'Torta de Chocolate',
        descripcion: 'Torta de chocolate con ganache',
        categoria: 'Tortas',
        precio: 25.99,
        imagen: 'https://st4.depositphotos.com/10614052/25239/i/450/depositphotos_252391082-stock-photo-sweet-chocolate-cake-on-wooden.jpg'
      },
      {
        nombre: 'Cheesecake',
        descripcion: 'Cheesecake con frutos rojos',
        categoria: 'Pasteles',
        precio: 28.50,
        imagen: 'https://media.istockphoto.com/id/1167344045/photo/cheesecake-slice-new-york-style-classical-cheese-cake.jpg?s=612x612&w=0&k=20&c=y3eh7cFEefAYxB_5Ow2n1OJZML_PqFOdnB5Z9nvXdgw='
      },
      {
        nombre: 'Galletas de Avena',
        descripcion: 'Galletas de avena con pasas',
        categoria: 'Galletas',
        precio: 1.50,
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTciUHUk40ozv914817AVy9jO23fyTXGLnshg&s'
      },
      {
        nombre: 'Cupcakes de Vainilla',
        descripcion: 'Cupcakes de vainilla con frosting',
        categoria: 'Cupcakes',
        precio: 3.25,
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDUlo9wibjLp10nBwM2EiJGfiKTdItEamrAQ&s'
      }
    ]; 

  /* =======================
     Estado de la vista
     ======================= */
  textoBusqueda: string = '';
  categoriaSeleccionada: string = 'Todos';
  mostrarModal: boolean = false;

  /* =======================
     Carrito y cliente
     ======================= */
  carrito: { producto: any; cantidad: number }[] = [];
  nombreCliente: string = '';


  constructor ( private serviceProducto: InventarioServiceService) {

  
  }


  getProductos() {
    
  }


  /* =======================
     Filtros de productos
     ======================= */
  get productosFiltrados() {
    return this.productos.filter(producto => {
      const coincideTexto =
        producto.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(this.textoBusqueda.toLowerCase());

      const coincideCategoria =
        this.categoriaSeleccionada === 'Todos' ||
        producto.categoria === this.categoriaSeleccionada;

      return coincideTexto && coincideCategoria;
    });
  }

  cambiarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
  }

  /* =======================
     Carrito: operaciones
     ======================= */
  agregarAlCarrito(producto: any) {
    const itemExistente = this.carrito.find(item => item.producto.nombre === producto.nombre);
    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      this.carrito.push({ producto, cantidad: 1 });
    }
  }

  cambiarCantidad(item: any, delta: number) {
    item.cantidad += delta;
    if (item.cantidad <= 0) {
      this.quitarDelCarrito(item);
    }
  }

  quitarDelCarrito(item: any) {
    const index = this.carrito.indexOf(item);
    if (index > -1) {
      this.carrito.splice(index, 1);
    }
  }

  vaciarCarrito() {
    this.carrito = [];
  }

  /* =======================
     Cálculos monetarios
     ======================= */
  subtotalCarrito(): number {
    return this.carrito.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
  }

  impuestosCarrito(): number {
    const tasaImpuestos = 0.10; // 10 %
    return this.subtotalCarrito() * tasaImpuestos;
  }

  totalCarrito(): number {
    return this.subtotalCarrito() + this.impuestosCarrito();
  }

  /* =======================
     Utilidades
     ======================= */
  obtenerCantidadTotal(): number {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  /* =======================
     Finalizar compra
     ======================= */
  finalizarCompra() {
    if (!this.nombreCliente.trim()) {
      alert('Por favor, ingrese el nombre del cliente.');
      return;
    }

    alert(`¡Gracias por tu compra, ${this.nombreCliente}!`);
    this.vaciarCarrito();
    this.nombreCliente = '';
    this.mostrarModal = false;
  }
}
