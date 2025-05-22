import { Component } from '@angular/core';
@Component({
  selector: 'app-ordenesproduccion',
  templateUrl: './ordenesproduccion.component.html',
  styleUrls: ['./ordenesproduccion.component.css']
})
export class OrdenesproduccionComponent {
  
  modalAbierto = false;

  responsables = ['Laura', 'Carlos', 'Pedro'];
  productosDisponibles = ['Cheesecake', 'Brownies', 'Cupcakes'];

  nuevaOrden = {
    fechaRequerida: '',
    responsable: '',
    productos: [{ nombre: 'Cheesecake', cantidad: 1 }]
  };

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.resetNuevaOrden();
  }

  agregarProducto() {
    this.nuevaOrden.productos.push({ nombre: this.productosDisponibles[0], cantidad: 1 });
  }

  eliminarProducto(index: number) {
    this.nuevaOrden.productos.splice(index, 1);
  }

  crearOrden() {
    console.log('Orden creada:', this.nuevaOrden);
    // Aquí agregar lógica para guardar
    this.cerrarModal();
  }

  resetNuevaOrden() {
    this.nuevaOrden = {
      fechaRequerida: '',
      responsable: '',
      productos: [{ nombre: 'Cheesecake', cantidad: 1 }]
    };
  }
  
  ordenes = [
    {
      id: 'OP-2023-045',
      fechaCreacion: new Date('2023-04-24'),
      fechaRequerida: new Date('2023-04-25'),
      productos: [
        { nombre: 'Torta de Chocolate', cantidad: 5 },
        { nombre: 'Cupcakes', cantidad: 24 }
      ]
    },
    {
      id: 'OP-2023-046',
      fechaCreacion: new Date('2023-04-24'),
      fechaRequerida: new Date('2023-04-26'),
      productos: [
        { nombre: 'Cheesecake', cantidad: 8 },
        { nombre: 'Galletas', cantidad: 100 }
      ]
    },
    {
      id: 'OP-2023-047',
      fechaCreacion: new Date('2023-04-24'),
      fechaRequerida: new Date('2023-04-27'),
      productos: [
        { nombre: 'Brownies', cantidad: 30 },
        { nombre: 'Alfajores', cantidad: 50 }
      ]
    }
  ];

  // Variables para búsqueda y filtro
  searchTerm: string = '';
  filterDate: string = '';

  // Acciones
  verDetalles(orden: any) {
    // Aquí puedes abrir un modal o navegar a otra vista
    console.log('Detalles de orden:', orden);
    alert(`Detalles de orden ${orden.id}`);
  }

  editarOrden(orden: any) {
    // Lógica para editar
    console.log('Editar orden:', orden);
  }

  eliminarOrden(id: string) {
    if (confirm('¿Estás seguro de eliminar esta orden?')) {
      this.ordenes = this.ordenes.filter(o => o.id !== id);
    }
  }

  getOrdenesFiltradas() {
  return this.ordenes.filter(o => {
    const matchText = this.searchTerm
      ? o.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        o.productos.some(p => p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()))
      : true;
    const matchDate = this.filterDate
      ? new Date(o.fechaCreacion).toISOString().split('T')[0] === this.filterDate
      : true;
    return matchText && matchDate;
  });
}


}
