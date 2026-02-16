export type BoardRole = 'puheenjohtaja' | 'varapuheenjohtaja' | 'jasen' | 'varajasen';

export interface BoardMember {
  id: string;
  name: string;
  role: BoardRole;
  apartment: string;
  email: string;
  phone: string;
  termStart: string; // ISO date string
  termEnd: string; // ISO date string
}
