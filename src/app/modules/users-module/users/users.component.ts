import { Component } from '@angular/core';

interface User {
  initials: string;
  name: string;
  email: string;
  role: string;
  password: string;
  position?: string;
  phone?: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  currentView: 'list' | 'create' | 'details' = 'list';
  showModal = false;
  searchQuery = '';
  showPassword = false;
  
  newUser: Partial<User> = {
    name: '',
    email: '',
    role: 'Producción',
    phone: '',
    password: ''
  };
  
  selectedUser: User | null = null;
  
  users: User[] = [
    {
      initials: 'AV',
      name: 'Ana Velazco Propietaria',
      email: 'ana@velazcopasteleria.com',
      role: 'Administrador',
      password: '••••••••',
      position: 'Propietaria',
      phone: '555-123-4567'
    },
    {
      initials: 'ML',
      name: 'María López Cajera',
      email: 'maria@velazcopasteleria.com',
      role: 'Cajero',
      password: '••••••••',
      position: 'Cajera',
      phone: '555-987-6543'
    },
    {
      initials: 'CG',
      name: 'Carlos Gómez Jefe de Producción',
      email: 'carlos@velazcopasteleria.com',
      role: 'Producción',
      password: '••••••••',
      position: 'Jefe de Producción',
      phone: '555-456-7890'
    },
    {
      initials: 'RM',
      name: 'Roberto Martinez Encargado de Entregas',
      email: 'roberto@velazcopasteleria.com',
      role: 'Entregas',
      password: '••••••••',
      position: 'Encargado de Entregas',
      phone: '555-789-0123'
    }
  ];

  get filteredUsers(): User[] {
    if (!this.searchQuery) return this.users;
    const query = this.searchQuery.toLowerCase();
    return this.users.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  }

  showCreateView(): void {
    this.currentView = 'create';
    this.showModal = true;
    this.newUser = {
      name: '',
      email: '',
      role: 'Producción',
      phone: '',
      password: ''
    };
    this.showPassword = false;
  }

  showUserDetails(user: User): void {
    this.currentView = 'details';
    this.showModal = true;
    this.selectedUser = { ...user };
    this.showPassword = false;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentView = 'list';
  }

  createUser(): void {
    // Validación básica
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    // Extraer iniciales del nombre
    const initials = this.getInitials(this.newUser.name);
    
    // Crear nuevo usuario
    const newUser: User = {
      initials,
      name: this.newUser.name || '',
      email: this.newUser.email || '',
      role: this.newUser.role || 'Producción',
      password: '••••••••', // En una aplicación real, esto sería un hash
      phone: this.newUser.phone || '',
      position: this.newUser.role || ''
    };
    
    // Agregar a la lista
    this.users.push(newUser);
    
    // Cerrar modal y limpiar formulario
    this.closeModal();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}