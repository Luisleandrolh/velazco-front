import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

interface ProductoOrden {
  nombre: string;
  cantidad: number;
}

interface OrdenProduccion {
  id: string;
  fechaCreacion: Date;
  fechaRequerida: Date | string;
  responsable?: string;
  productos: ProductoOrden[];
  estado?: string;
}

@Component({
  selector: 'app-ordenesproduccion',
  templateUrl: './ordenesproduccion.component.html',
  styleUrls: ['./ordenesproduccion.component.css'],
  providers: [MessageService]
})
export class OrdenesproduccionComponent {
  modalAbierto = false;
  modalEdicionAbierto = false;

  responsables = ['Laura', 'Carlos', 'Pedro'];
  productosDisponibles = ['Cheesecake', 'Brownies', 'Cupcakes', 'Torta de Chocolate', 'Galletas', 'Alfajores'];

  nuevaOrden = {
    fechaRequerida: '',
    responsable: '',
    productos: [{ nombre: 'Cheesecake', cantidad: 1 }]
  };

  ordenEditada: OrdenProduccion = {
    id: '',
    fechaCreacion: new Date(),
    fechaRequerida: '',
    responsable: '',
    productos: []
  };

  ordenes: OrdenProduccion[] = [
    {
      id: 'OP-2023-045',
      fechaCreacion: new Date('2023-04-24'),
      fechaRequerida: new Date('2023-04-25'),
      responsable: 'Laura',
      productos: [
        { nombre: 'Torta de Chocolate', cantidad: 5 },
        { nombre: 'Cupcakes', cantidad: 24 }
      ],
      estado: 'Pendiente'
    },
    {
      id: 'OP-2023-046',
      fechaCreacion: new Date('2023-04-24'),
      fechaRequerida: new Date('2023-04-26'),
      responsable: 'Carlos',
      productos: [
        { nombre: 'Cheesecake', cantidad: 8 },
        { nombre: 'Galletas', cantidad: 100 }
      ],
      estado: 'En proceso'
    },
    {
      id: 'OP-2023-047',
      fechaCreacion: new Date('2023-04-24'),
      fechaRequerida: new Date('2023-04-27'),
      responsable: 'Pedro',
      productos: [
        { nombre: 'Brownies', cantidad: 30 },
        { nombre: 'Alfajores', cantidad: 50 }
      ],
      estado: 'Completada'
    }
  ];

minDate = new Date();
  searchTerm: string = '';
  filterDate: Date | null = null;

  constructor(private messageService: MessageService) {}

  showModal() {
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
    if (this.nuevaOrden.productos.length > 1) {
    this.nuevaOrden.productos.splice(index, 1);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe haber al menos un producto'
      });
    }
  }

  crearOrden() {
    // Generar nuevo ID
    const newId = 'OP-' + new Date().getFullYear() + '-' + (this.ordenes.length + 100).toString().padStart(3, '0');
    
    const nuevaOrdenCompleta: OrdenProduccion = {
      id: newId,
      fechaCreacion: new Date(),
      fechaRequerida: this.nuevaOrden.fechaRequerida,
      responsable: this.nuevaOrden.responsable,
      productos: [...this.nuevaOrden.productos],
      estado: 'Pendiente'
    };

    this.ordenes.unshift(nuevaOrdenCompleta);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `Orden ${newId} creada correctamente`
    });
    
    this.cerrarModal();
  }

  resetNuevaOrden() {
    this.nuevaOrden = {
      fechaRequerida: '',
      responsable: '',
      productos: [{ nombre: 'Cheesecake', cantidad: 1 }]
    };
  }

  verDetalles(orden: OrdenProduccion) {
    console.log('Detalles de orden:', orden);
    // Aquí podrías implementar un modal de detalles si lo deseas
    this.messageService.add({
      severity: 'info',
      summary: 'Detalles de orden',
      detail: `Mostrando detalles de ${orden.id}`,
      life: 3000
    });
  }

  editarOrden(orden: OrdenProduccion) {
    this.ordenEditada = {
      id: orden.id,
      fechaCreacion: orden.fechaCreacion,
      fechaRequerida: orden.fechaRequerida,
      responsable: orden.responsable || '',
      productos: [...orden.productos],
      estado: orden.estado || 'Pendiente'
    };
    this.modalEdicionAbierto = true;
  }

  cerrarModalEdicion() {
    this.modalEdicionAbierto = false;
  }

  agregarProductoEdicion() {
    this.ordenEditada.productos.push({ nombre: this.productosDisponibles[0], cantidad: 1 });
  }

  eliminarProductoEdicion(index: number) {
    if (this.ordenEditada.productos.length > 1) {
      this.ordenEditada.productos.splice(index, 1);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe haber al menos un producto'
      });
    }
  }

  guardarCambios() {
    const index = this.ordenes.findIndex(o => o.id === this.ordenEditada.id);
    if (index !== -1) {
      this.ordenes[index] = { ...this.ordenEditada };
      
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: `Orden ${this.ordenEditada.id} actualizada correctamente`
      });
      
      this.cerrarModalEdicion();
    }
  }

  eliminarOrden(id: string) {
    if (confirm('¿Estás seguro de eliminar esta orden?')) {
      this.ordenes = this.ordenes.filter(o => o.id !== id);
      this.messageService.add({
        severity: 'info',
        summary: 'Confirmado',
        detail: 'Orden eliminada'
      });
    }
  }

  getOrdenesFiltradas() {
    return this.ordenes.filter(o => {
      const matchText = this.searchTerm
        ? o.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          o.productos.some(p => p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
          (o.responsable && o.responsable.toLowerCase().includes(this.searchTerm.toLowerCase()))
        : true;
      
      const matchDate = this.filterDate
        ? new Date(o.fechaCreacion).toDateString() === new Date(this.filterDate).toDateString()
        : true;
      
      return matchText && matchDate;
    });
  }

  esFormularioValido(): boolean {
  return !!this.nuevaOrden.fechaRequerida && 
         !!this.nuevaOrden.responsable && 
         this.nuevaOrden.productos.length > 0 &&
         this.nuevaOrden.productos.every(p => !!p.nombre && p.cantidad > 0);
}

  esFormularioEdicionValido(): boolean {
    return !!this.ordenEditada.fechaRequerida && 
           !!this.ordenEditada.responsable && 
           this.ordenEditada.productos.length > 0 &&
           this.ordenEditada.productos.every(p => !!p.nombre && p.cantidad > 0);
  }
}