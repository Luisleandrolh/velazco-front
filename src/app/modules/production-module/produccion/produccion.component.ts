import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.css'],
})
export class ProduccionComponent {
  pestanaActiva: 'elaboracion' | 'terminados' = 'elaboracion';
  terminoBusqueda: string = '';
  empleadoSeleccionado: string = '';
  
  // Variables para controlar los modales
  mostrarModalDetalles = false;
  mostrarModalEstado = false;
  productoSeleccionado: any = null;
  nuevoEstado: string = '';
  
  empleados: string[] = [
    'Juan Pérez',
    'María López',
    'Carlos Gómez',
    'Ana Rodríguez'
  ];
  
  productosProduccion: any[] = [
    {
      id: 1,
      nombre: 'Torta de Chocolate',
      cantidad: '10 unidades',
      responsable: 'Juan Pérez',
      fechaInicio: '23/04/2023',
      estado: 'En Producción',
    },
    {
      id: 2,
      nombre: 'Galletas de Avena',
      cantidad: '120 unidades',
      responsable: 'María López',
      fechaInicio: '23/04/2023',
      estado: 'En Producción',
    },
    {
      id: 3,
      nombre: 'Cheesecake',
      cantidad: '8 unidades',
      responsable: 'Carlos Gómez',
      fechaInicio: '23/04/2023',
      estado: 'En Producción',
    },
    {
      id: 4,
      nombre: 'Cupcakes de Vainilla',
      cantidad: '48 unidades',
      responsable: 'Ana Rodríguez',
      fechaInicio: '23/04/2023',
      estado: 'En Producción',
    }
  ];

  productosTerminados: any[] = [
    {
      id: 1,
      nombre: 'Brownies',
      cantidad: '24 unidades',
      responsable: 'Juan Pérez',
      fechaTermino: '22/04/2023',
      estado: 'Terminado',
    },
    {
      id: 2,
      nombre: 'Alfajores',
      cantidad: '60 unidades',
      responsable: 'María López',
      fechaTermino: '22/04/2023',
      estado: 'Terminado',
    },
    {
      id: 3,
      nombre: 'Pan Frances',
      cantidad: '12 unidades',
      responsable: 'Carlos Gómez',
      fechaTermino: '22/04/2023',
      estado: 'Terminado',
    }
  ];

  productosProduccionFiltrados: any[] = [...this.productosProduccion];
  productosTerminadosFiltrados: any[] = [...this.productosTerminados];

  aplicarFiltros() {
    const termino = this.terminoBusqueda.toLowerCase();
    
    this.productosProduccionFiltrados = this.productosProduccion.filter(producto => {
      const coincideBusqueda = 
        producto.id.toString().includes(termino) ||
        producto.nombre.toLowerCase().includes(termino) ||
        producto.responsable.toLowerCase().includes(termino);
      const coincideEmpleado = this.empleadoSeleccionado === '' || 
                             producto.responsable === this.empleadoSeleccionado;
      return coincideBusqueda && coincideEmpleado;
    });

    this.productosTerminadosFiltrados = this.productosTerminados.filter(producto => {
      const coincideBusqueda = 
        producto.id.toString().includes(termino) ||
        producto.nombre.toLowerCase().includes(termino) ||
        producto.responsable.toLowerCase().includes(termino);
      const coincideEmpleado = this.empleadoSeleccionado === '' || 
                             producto.responsable === this.empleadoSeleccionado;
      return coincideBusqueda && coincideEmpleado;
    });
  }

  verDetalles(producto: any) {
    this.productoSeleccionado = producto;
    this.mostrarModalDetalles = true;
  }

  cerrarModalDetalles() {
    this.mostrarModalDetalles = false;
  }

  actualizarEstado(producto: any) {
    this.productoSeleccionado = producto;
    this.nuevoEstado = producto.estado;
    this.mostrarModalEstado = true;
  }

  cerrarModalEstado() {
    this.mostrarModalEstado = false;
  }

  guardarEstado() {
    // Actualizar el estado del producto
    this.productoSeleccionado.estado = this.nuevoEstado;
    
    // Si el estado es "Terminado", mover a productos terminados
    if (this.nuevoEstado === 'Terminado') {
      this.productoSeleccionado.fechaTermino = new Date().toLocaleDateString();
      
      // Mover de producción a terminados
      this.productosProduccion = this.productosProduccion.filter(
        p => p.id !== this.productoSeleccionado.id
      );
      this.productosTerminados.push(this.productoSeleccionado);
    }
    
    // Actualizar las listas filtradas
    this.aplicarFiltros();
    this.cerrarModalEstado();
  }

  calcularFechaTermino(): string {
    const fecha = new Date();
    fecha.setHours(fecha.getHours() + 4); // Ejemplo: 4 horas después
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }
}