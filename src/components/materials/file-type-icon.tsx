import { FileText, FileSpreadsheet, FileType2 } from 'lucide-react';
import type { FileType } from '@/types';
import { cn } from '@/lib/utils';

const FILE_TYPE_CONFIG: Record<FileType, { icon: React.ElementType; color: string }> = {
  pdf: { icon: FileText, color: 'text-red-500' },
  xlsx: { icon: FileSpreadsheet, color: 'text-green-600' },
  docx: { icon: FileType2, color: 'text-blue-500' },
};

interface FileTypeIconProps {
  fileType: FileType;
  className?: string;
}

export function FileTypeIcon({ fileType, className }: FileTypeIconProps): React.JSX.Element {
  const config = FILE_TYPE_CONFIG[fileType];
  const Icon = config.icon;

  return <Icon className={cn('size-5', config.color, className)} />;
}
