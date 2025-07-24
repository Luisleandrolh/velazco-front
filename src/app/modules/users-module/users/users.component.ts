import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../models/user.interface';
import { Role } from '../models/role.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { RealtimeService } from 'src/app/services/realtime.service'; // Ajusta la ruta si es diferente
import { MatSnackBar } from '@angular/material/snack-bar';

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
  roles: Role[] = [];

  newUser: User = {
    name: '',
    email: '',
    password: '',
    active: true,
    roleId: '1',
    role: '',
  };

  selectedUser: User | null = null;
  users: User[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private usersService: UsersService,
    private realtimeService: RealtimeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.escucharEventosUsuariosTiempoReal();
  }

  escucharEventosUsuariosTiempoReal(): void {
    const url =
      'https://velazco-realtime-service-develop.up.railway.app/sse/events';

    // Usuario creado
    this.realtimeService.listenToEvent('user.created', url).subscribe({
      next: ({ data }) => {
        console.log('🟢 Usuario creado:', data);
        this.snackBar.open(
          '✅ Nuevo usuario creado: ' + data.username,
          'Cerrar',
          {
            duration: 3000,
            panelClass: ['snackbar-success'],
          }
        );
        this.loadUsers();
      },
      error: (err) => console.error('❌ SSE user.created:', err),
    });

    // Usuario actualizado
    this.realtimeService.listenToEvent('user.updated', url).subscribe({
      next: ({ data }) => {
        console.log('🟡 Usuario actualizado:', data);
        this.snackBar.open(
          '✏️ Usuario actualizado: ' + data.username,
          'Cerrar',
          {
            duration: 3000,
            panelClass: ['snackbar-info'],
          }
        );
        this.loadUsers();
      },
      error: (err) => console.error('❌ SSE user.updated:', err),
    });

    // Usuario eliminado
    this.realtimeService.listenToEvent('user.deleted', url).subscribe({
      next: ({ data }) => {
        console.log('🔴 Usuario eliminado:', data);
        this.snackBar.open('🗑️ Usuario eliminado: ' + data.username, 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-warn'],
        });
        this.loadUsers();
      },
      error: (err) => console.error('❌ SSE user.deleted:', err),
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Usuarios cargados:', this.users);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
        this.error = 'Error al cargar usuarios';
      },
    });
  }

  loadRoles(): void {
    this.usersService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        console.log('Roles cargados:', this.roles);
      },
      error: (err) => {
        console.error('Error al cargar roles:', err);
        this.error = 'No se pudieron cargar los roles';
      },
    });
  }

  getRoleName(roleId: string | number | undefined): string {
    if (!roleId) return 'Sin rol';

    const roleIdStr = roleId.toString();
    const role = this.roles.find((r) => r.id.toString() === roleIdStr);
    return role ? role.name : 'Rol no encontrado';
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
  }

  showUserDetails(user: User): void {
    this.currentView = 'details';
    this.showModal = true;
    this.selectedUser = { ...user };
    this.showPassword = false;

    // Asegurarnos de que selectedUser no sea null y roleId esté definido
    if (
      this.selectedUser &&
      this.selectedUser.roleId !== undefined &&
      this.selectedUser.roleId !== null
    ) {
      this.selectedUser.roleId = this.selectedUser.roleId.toString();
    } else {
      // Asignar un valor por defecto si roleId es null/undefined
      this.selectedUser.roleId = '1'; // O el valor por defecto que prefieras
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.currentView = 'list';
    this.selectedUser = null;
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  createUser(): void {
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

    const userToCreate: User = {
      name: this.newUser.name,
      email: this.newUser.email,
      password: this.newUser.password,
      active: this.newUser.active ?? true,
      roleId: this.newUser.roleId,
    };

    this.usersService.createUser(userToCreate).subscribe({
      next: () => {
        this.closeModal();
        this.loading = false;
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error creating user:', err);
        this.error = this.parseServerError(err);
        this.loading = false;
      },
    });
  }

  updateUser(): void {
    if (!this.selectedUser) {
      this.error = 'No hay usuario seleccionado para actualizar';
      return;
    }

    const userId = this.selectedUser.id;
    if (!userId) {
      this.error = 'El usuario no tiene un ID válido';
      return;
    }

    const userToUpdate: User = {
      name: this.selectedUser.name,
      email: this.selectedUser.email,
      password: this.selectedUser.password,
      active: this.selectedUser.active,
      roleId: this.selectedUser.roleId,
    };

    this.loading = true;
    this.usersService.updateUser(userId, userToUpdate).subscribe({
      next: () => {
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
          this.error = null;

          this.snackBar.open('🗑️ Usuario eliminado exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-warn'],
          });
        },
        error: (err) => {
          console.error('Error deleting user:', err);

          // ✅ Mostrar mensaje real del backend
          this.error = this.parseServerError(err);

          this.loading = false;

          this.snackBar.open(`⚠️ ${this.error}`, 'Cerrar', {
            duration: 4000,
            panelClass: ['snackbar-error'],
          });
        },
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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
}
