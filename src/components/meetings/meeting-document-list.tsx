import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import type { MeetingDocument } from '@/types';
import { Button } from '@/components/ui/button';
import { FileTypeIcon } from '@/components/materials/file-type-icon';

interface MeetingDocumentListProps {
  documents: MeetingDocument[];
}

export function MeetingDocumentList({ documents }: MeetingDocumentListProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center gap-3 rounded-md border p-2">
          <FileTypeIcon fileType={doc.fileType} className="size-5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{doc.name}</p>
            <p className="text-xs text-muted-foreground">
              {doc.fileType.toUpperCase()} &middot; {doc.fileSize}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="size-8" title={t('common.download')}>
            <Download className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
