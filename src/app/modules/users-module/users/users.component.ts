import { Component, OnInit } from '@angular/core';

// Importa el servicio UsersService que contiene los métodos para interactuar con la API de usuarios
import { UsersService } from '../services/users.service';

// Importa la interfaz User que define la estructura de datos de un usuario
import { User } from '../models/user.interface';

// Importa HttpErrorResponse para manejar errores de las peticiones HTTP
import { HttpErrorResponse } from '@angular/common/http';

// Decorador @Component que define los metadatos del componente
@Component({
  // Selector CSS que se usará en las plantillas para instanciar este componente
  selector: 'app-users',

  // Ruta al archivo HTML que contiene la plantilla del componente
  templateUrl: './users.component.html',

  // Array de rutas a archivos CSS con estilos específicos para este componente
  styleUrls: ['./users.component.css'],
})

// Definición de la clase del componente que implementa OnInit
export class UsersComponent implements OnInit {
  // Propiedad para controlar qué vista mostrar actualmente
  // Puede ser 'list' (lista), 'create' (creación) o 'details' (detalles)
  currentView: 'list' | 'create' | 'details' = 'list';

  // Bandera booleana para controlar si el modal/diálogo está visible
  showModal = false;

  // Almacena el texto de búsqueda para filtrar usuarios
  searchQuery = '';

  // Controla si las contraseñas se muestran en texto plano (true) o ocultas (false)
  showPassword = false;

  // Método para validar el formato de un email usando una expresión regular
  validateEmail(email: string): boolean {
    // Expresión regular para validar el formato de email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Retorna true si el email cumple con el patrón
    return re.test(email);
  }

  // Objeto que representa un nuevo usuario con valores por defecto
  newUser: User = {
    name: '', // Nombre vacío por defecto
    email: '', // Email vacío por defecto
    password: '', // Contraseña vacía por defecto
    active: true, // Activo por defecto
    roleId: '1', // ID de rol por defecto (Administrador)
    role: '', // Nombre de rol vacío por defecto
  };

  // Almacena el usuario seleccionado para ver detalles o editar (puede ser null)
  selectedUser: User | null = null;

  // Array que almacena la lista de usuarios obtenidos del servidor
  users: User[] = [];

  // Bandera para indicar si se está cargando datos (muestra spinner/loader)
  loading = true;

  // Almacena mensajes de error para mostrar al usuario
  error: string | null = null;

  // Mapeo de IDs de rol a nombres legibles (actualmente solo '1': 'Administrador')
  roleMap: Record<string, string> = {
    '1': 'Administrador',
  };

  // Constructor que inyecta el servicio UsersService como dependencia
  constructor(private usersService: UsersService) {}

  // Hook del ciclo de vida que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Llama al método para cargar los usuarios al iniciar
    this.loadUsers();
  }

  // Método para cargar la lista de usuarios desde el servidor
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

  // Getter que filtra usuarios basado en searchQuery
  get filteredUsers(): User[] {
    // Si no hay texto de búsqueda, retorna todos los usuarios
    if (!this.searchQuery) return this.users;

    // Convierte el texto de búsqueda a minúsculas para comparación insensible
    const query = this.searchQuery.toLowerCase();

    // Filtra usuarios cuyo nombre o email contengan el texto de búsqueda
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
    /*
    this.newUser = {
      name: '',
      email: '',
      password: '',
      active: true,
      roleId: '8007JF9Z5AZM8091',
    };
    this.showPassword = false;
    */
  }

  // Método para mostrar detalles de un usuario específico
  showUserDetails(user: User): void {
    this.currentView = 'details'; // Cambia a vista de detalles
    this.showModal = true; // Muestra el modal
    this.selectedUser = { ...user }; // Copia el usuario (para no modificar el original)
    this.showPassword = false; // Oculta la contraseña por defecto
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
