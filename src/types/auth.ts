export type UserRole = 'resident' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  apartment: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
