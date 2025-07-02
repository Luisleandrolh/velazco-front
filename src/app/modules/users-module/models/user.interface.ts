export interface User {
  id?: string; // ID opcional (puede no estar presente al crear un nuevo usuario)
  active: boolean; // Estado del usuario (activo/inactivo)
  name: string; // Nombre completo del usuario
  email: string; // Email del usuario
  password: string; // Contraseña (normalmente no debería exponerse así en frontend)
  roleId: string; // ID del rol del usuario
  role?: string; // Nombre del rol (opcional, puede venir del backend)
}
