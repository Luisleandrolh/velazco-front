// src/app/modules/users-module/users/users.component.ts
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User, UserWithUI } from '../models/user.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  currentView: 'list' | 'create' | 'details' = 'list';
  showModal = false;
  searchQuery = '';
  showPassword = false;

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  newUser: Partial<User> = {
    name: '',
    email: '',
    password: '',
    active: true,
    roleId: '8007JF9Z5AZM8091', // Valor por defecto
  };

  selectedUser: UserWithUI | null = null;
  users: UserWithUI[] = [];
  loading = true;
  error: string | null = null;

  roleMap: Record<string, string> = {
    '8007JF9Z5AZM8091': 'Producción',
    '7007JF9Z5AZM8091': 'Administrador',
    '6007JF9Z5AZM8091': 'Cajero',
    '5007JF9Z5AZM8091': 'Entregas',
  };

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private enhanceUser(user: User): UserWithUI {
    return {
      ...user,
      ui: {
        initials: this.getInitials(user.name),
        displayRole: this.roleMap[user.roleId] || user.roleId,
      },
    };
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.usersService.getUsers().subscribe({
      next: (users) => {
        // Filtra usuarios sin ID (por si acaso)
        this.users = users
          .filter((user) => !!user.id)
          .map((user) => this.enhanceUser(user));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = this.parseServerError(err);
        this.loading = false;
      },
    });
  }

  get filteredUsers(): UserWithUI[] {
    if (!this.searchQuery) return this.users;
    const query = this.searchQuery.toLowerCase();
    return this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.ui.displayRole.toLowerCase().includes(query)
    );
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2);
  }

  showCreateView(): void {
    this.currentView = 'create';
    this.showModal = true;
    this.newUser = {
      name: '',
      email: '',
      password: '',
      active: true,
      roleId: '8007JF9Z5AZM8091',
    };
    this.showPassword = false;
  }

  showUserDetails(user: UserWithUI): void {
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
    // Validación mejorada
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.error = 'Todos los campos son requeridos';
      return;
    }

    if (!this.validateEmail(this.newUser.email)) {
      this.error = 'El correo electrónico no es válido';
      return;
    }

    if (this.newUser.password.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    this.loading = true;
    const userToCreate: Omit<User, 'id'> = {
      name: this.newUser.name!,
      email: this.newUser.email!,
      password: this.newUser.password!,
      active: this.newUser.active ?? true,
      roleId: this.newUser.roleId!,
      phone: this.newUser.phone || '',
    };

    this.usersService.createUser(userToCreate).subscribe({
      next: (createdUser) => {
        this.users.push(this.enhanceUser(createdUser));
        this.closeModal();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.error = this.parseServerError(err);
        this.loading = false;
      },
    });
  }

  private parseServerError(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'No se pudo conectar al servidor';
    }
    if (err.error?.message) {
      return err.error.message;
    }
    return `Error del servidor (${err.status}): ${err.statusText}`;
  }

  updateUser(): void {
    // 1. Verificación explícita del usuario seleccionado y su ID
    if (!this.selectedUser) {
      this.error = 'No hay usuario seleccionado para actualizar';
      return;
    }

    const userId = this.selectedUser.id;
    if (!userId) {
      this.error = 'El usuario no tiene un ID válido';
      return;
    }

    // 2. Creación del objeto con ID garantizado
    const userToUpdate: User = {
      id: userId, // Aquí TypeScript sabe que userId es string
      name: this.selectedUser.name,
      email: this.selectedUser.email,
      password: this.selectedUser.password,
      active: this.selectedUser.active,
      roleId: this.selectedUser.roleId,
      phone: this.selectedUser.phone || '',
    };

    // 3. Llamada al servicio con tipos seguros
    this.loading = true;
    this.usersService.updateUser(userId, userToUpdate).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = this.enhanceUser(updatedUser);
        }
        this.closeModal();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.error = this.parseServerError(err);
        this.loading = false;
      },
    });
  }

  deleteUser(id: string): void {
    if (!id) {
      console.error('Intento de eliminar usuario sin ID');
      return;
    }

    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      this.loading = true;
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== id);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.error = 'Error al eliminar el usuario';
          this.loading = false;
        },
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
