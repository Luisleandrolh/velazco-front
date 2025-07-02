export interface User {
  id?: string; 
  active: boolean;
  name: string;
  email: string;
  password: string;
  roleId: string;
  role?: string;
}
