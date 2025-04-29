import { Component } from '@angular/core';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-caja-vista',
  templateUrl: './caja-vista.component.html',
  styleUrls: ['./caja-vista.component.css']
})
export class CajaVistaComponent {
  pedidos = [
    {
      codigo: 'PED-1023',
      cliente: 'María González',
      total: 49.49,
      fecha: '23/04/2023',
      hora: '14:30'
    },
    {
      codigo: 'PED-1022',
      cliente: 'Carlos Rodríguez',
      total: 35.75,
      fecha: '23/04/2023',
      hora: '12:15'
    },
    {
      codigo: 'PED-1023',
      cliente: 'María González',
      total: 49.49,
      fecha: '23/04/2023',
      hora: '14:30'
    },
    {
      codigo: 'PED-1022',
      cliente: 'Carlos Rodríguez',
      total: 35.75,
      fecha: '23/04/2023',
      hora: '12:15'
    }
  ];
}
