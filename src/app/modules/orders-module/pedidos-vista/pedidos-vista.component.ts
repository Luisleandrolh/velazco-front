import { Component } from '@angular/core';

@Component({
  selector: 'app-pedidos-vista',
  templateUrl: './pedidos-vista.component.html',
  styleUrls: ['./pedidos-vista.component.css']
})
export class PedidosVistaComponent {
  searchText: string = '';
  selectedCategory: string = 'Todos';
  isCartOpen: boolean = false;

  cart: { product: any, quantity: number }[] = [];

  products = [
    {
      name: 'Torta de Chocolate',
      description: 'Torta de chocolate con ganache',
      price: 25.99,
      category: 'Tortas',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWdg0g8LLBW7KmPSeOqgxktDuU5J-RvEwKfw&s'
    },
    {
      name: 'Cheesecake',
      description: 'Cheesecake con frutos rojos',
      price: 28.50,
      category: 'Pasteles',
      image: 'https://images.immediate.co.uk/production/volatile/sites/30/2022/10/No-bake-raspberry-cheesecake-cc1ee62.jpg?quality=90&resize=556,505'
    },
    {
      name: 'Galletas de Avena',
      description: 'Galletas de avena con pasas',
      price: 1.50,
      category: 'Galletas',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXpwaQVLWtmY-SxO00IxJYV9y0JPrQs4jSRw&s'
    },
    {
      name: 'Cupcakes de Vainilla',
      description: 'Cupcakes de vainilla con frosting',
      price: 3.25,
      category: 'Cupcakes',
      image: 'https://www.clarin.com/2021/04/29/9lAb2baoa_1200x0__1.jpg'
    },
  ];

  addToCart(product: any) {
    const found = this.cart.find(item => item.product.name === product.name);
    if (found) {
      found.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
  }

  filterCategory(category: string) {
    this.selectedCategory = category;
  }

  filteredProducts() {
    return this.products.filter(product => {
      const matchesCategory = this.selectedCategory === 'Todos' || product.category === this.selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  increaseQuantity(index: number) {
    this.cart[index].quantity++;
  }

  decreaseQuantity(index: number) {
    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity--;
    } else {
      this.cart.splice(index, 1);
    }
  }

  removeItem(index: number) {
    this.cart.splice(index, 1);
  }

  clearCart() {
    this.cart = [];
  }

  getTotal() {
    return this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  getTotalItems() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  openCart() {
    this.isCartOpen = true;
  }

  closeCart() {
    this.isCartOpen = false;
  }
}
