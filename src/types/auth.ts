export type UserRole = 'resident' | 'manager';

export interface User {
  id: string;
  name: string;
  apartment: string;
  role: UserRole;
}
