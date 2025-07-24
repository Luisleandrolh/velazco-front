export interface User {
  id?: string;
  active: boolean;
  name: string;
  email: string;
  password: string;
  roleId: string | number; // Asegúrate de que no sea opcional
  role?: string;
}
