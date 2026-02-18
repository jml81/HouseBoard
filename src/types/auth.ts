export type UserRole = 'resident' | 'manager';
export type UserStatus = 'active' | 'locked';

export interface User {
  id: string;
  name: string;
  email: string;
  apartment: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  apartment: string;
  role: UserRole;
}

export interface UpdateUserInput {
  id: string;
  name?: string;
  apartment?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateProfileInput {
  name?: string;
  apartment?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
