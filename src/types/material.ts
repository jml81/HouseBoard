export type MaterialCategory = 'saannot' | 'kokoukset' | 'talous' | 'kunnossapito' | 'muut';

export type FileType = 'pdf' | 'xlsx' | 'docx';

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  fileType: FileType;
  fileSize: string; // e.g. "1.2 MB"
  updatedAt: string; // ISO date string
  description: string;
  createdBy: string | null;
  fileUrl: string | null;
}
