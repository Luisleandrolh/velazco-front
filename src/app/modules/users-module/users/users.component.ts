import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../models/user.interface';
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

  newUser: User = {
    name: '', // Nombre vacío por defecto
    email: '', // Email vacío por defecto
    password: '', // Contraseña vacía por defecto
    active: true, // Activo por defecto
    roleId: '1', // ID de rol por defecto (Administrador)
    role: '', // Nombre de rol vacío por defecto
  };

  selectedUser: User | null = null;
  users: User[] = [];
  loading = true;
  error: string | null = null;
  roleMap: Record<string, string> = {
    '1': 'Administrador',
  };
  constructor(private usersService: UsersService) {}
  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers(): void {
    this.loading = true; // Activa el estado de carga
    this.error = null; // Limpia cualquier error previo

    // Llama al servicio para obtener usuarios
    this.usersService.getUsers().subscribe({
      // Callback para manejar la respuesta exitosa
      next: (data) => {
        this.users = data; // Almacena los usuarios recibidos
        console.log('Usuarios cargados:', this.users); // Log para depuración
        this.loading = false; // Desactiva el estado de carga
      },
      // Callback para manejar errores
      error: (error) => {
        console.error('Error al cargar usuarios:', error); // Log del error
      },
    });
  }

  get filteredUsers(): User[] {
    if (!this.searchQuery) return this.users;
    const query = this.searchQuery.toLowerCase();
    return this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }

  // Método para obtener las iniciales de un nombre (2 primeras letras)
  getInitials(name: string): string {
    return name
      .split(' ') // Divide el nombre por espacios
      .map((n) => n[0]) // Toma la primera letra de cada parte
      .join('') // Une las letras
      .substring(0, 2); // Toma máximo 2 caracteres
  }

  // Método para mostrar la vista de creación de usuario
  showCreateView(): void {
    this.currentView = 'create'; // Cambia a vista de creación
    this.showModal = true; // Muestra el modal
  }

  // Método para mostrar detalles de un usuario específico
  showUserDetails(user: User): void {
    this.currentView = 'details'; // Cambia a vista de detalles
    this.showModal = true; // Muestra el modal
    this.selectedUser = { ...user }; // Copia el usuario (para no modificar el original)
  }

  // Método para cerrar el modal y volver a la vista de lista
  closeModal(): void {
    this.showModal = false; // Oculta el modal
    this.currentView = 'list'; // Vuelve a la vista de lista
  }

  // Método para crear un nuevo usuario
  createUser(): void {
    // Validación: campos requeridos
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.error = 'Todos los campos son requeridos';
      return;
    }

    // Validación: formato de email
    if (!this.validateEmail(this.newUser.email)) {
      this.error = 'El correo electrónico no es válido';
      return;
    }

    // Validación: longitud mínima de contraseña
    if (this.newUser.password.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    this.loading = true; // Activa el estado de carga

    // Prepara el objeto usuario para enviar al servidor
    const userToCreate: User = {
      name: this.newUser.name,
      email: this.newUser.email,
      password: this.newUser.password,
      active: this.newUser.active ?? true, // Valor por defecto true si es null/undefined
      roleId: this.newUser.roleId,
    };

    // Llama al servicio para crear el usuario
    this.usersService.createUser(userToCreate).subscribe({
      // Manejo de respuesta exitosa
      next: (createdUser) => {
        this.closeModal(); // Cierra el modal
        this.newUser = {
          name: '',
          email: '',
          password: '',
          active: true,
          roleId: '1',
          role: '',
        };
        this.loading = false; // Desactiva carga
        this.loadUsers(); // Recarga la lista de usuarios
      },
      // Manejo de errores
      error: (err) => {
        console.error('Error creating user:', err); // Log del error
        this.error = this.parseServerError(err); // Parsea el error para mostrar al usuario
        this.loading = false; // Desactiva carga
      },
    });
  }

  // Método privado para parsear errores del servidor a mensajes legibles
  private parseServerError(err: HttpErrorResponse): string {
    // Error de conexión
    if (err.status === 0) {
      return 'No se pudo conectar al servidor';
    }
    // Si el servidor devuelve un mensaje de error
    if (err.error?.message) {
      return err.error.message;
    }
    // Mensaje genérico con código de estado HTTP
    return `Error del servidor (${err.status}): ${err.statusText}`;
  }

  // Método para actualizar un usuario (actualmente comentado/incompleto)
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
    console.log('Actualizando usuario con ID:', userId);

    // 2. Creación del objeto con ID garantizado
    const userToUpdate: User = {
      name: this.selectedUser.name,
      email: this.selectedUser.email,
      password: this.selectedUser.password,
      active: this.selectedUser.active,
      roleId: this.selectedUser.roleId,
    };

    // 3. Llamada al servicio con tipos

    this.loading = true;
    this.usersService.updateUser(userId, userToUpdate).subscribe({
      next: (updatedUser) => {
        this.loadUsers();
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

  // Método para eliminar un usuario por ID
  deleteUser(id: string): void {
    // Validación: ID requerido
    if (!id) {
      console.error('Intento de eliminar usuario sin ID');
      return;
    }

    // Confirmación antes de eliminar
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      this.loading = true; // Activa estado de carga

      // Llama al servicio para eliminar
      this.usersService.deleteUser(id).subscribe({
        // Manejo de eliminación exitosa
        next: () => {
          // Filtra el usuario eliminado de la lista local
          this.users = this.users.filter((user) => user.id !== id);
          this.loading = false; // Desactiva carga
        },
        // Manejo de errores
        error: (err) => {
          console.error('Error deleting user:', err); // Log del error
          this.error = 'Error al eliminar el usuario'; // Mensaje al usuario
          this.loading = false; // Desactiva carga
        },
      });
    }
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword; // Invierte el estado actual
  }
}
