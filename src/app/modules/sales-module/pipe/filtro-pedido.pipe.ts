import { Pipe, PipeTransform } from '@angular/core';
import { Pedido } from '../caja-vista/caja-vista.component';

@Pipe({
  name: 'filtroPedido'
})
export class FiltroPedidoPipe implements PipeTransform {
  transform(pedidos: Pedido[], texto: string): Pedido[] {
    if (!pedidos || !texto) return pedidos;
    texto = texto.toLowerCase();
    return pedidos.filter(p =>
      p.codigo.toLowerCase().includes(texto) || 
      p.cliente.toLowerCase().includes(texto)
    );
  }
}
