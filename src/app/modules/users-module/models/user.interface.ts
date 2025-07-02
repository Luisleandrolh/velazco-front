export interface User {
  id?: string; // Hacer id opcional con ?
  name: string;
  email: string;
  password: string;
  active: boolean;
  roleId: string;
  phone?: string;
}

export interface UserWithUI extends User {
  ui: {
    initials: string;
    displayRole: string;
  };
}
