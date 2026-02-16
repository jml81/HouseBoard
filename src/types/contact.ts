export type ContactRole = 'isannoitsija' | 'huolto' | 'hallitus' | 'siivous' | 'muu';

export interface Contact {
  id: string;
  name: string;
  role: ContactRole;
  company?: string;
  phone: string;
  email: string;
  description?: string;
}
