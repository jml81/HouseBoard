import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { MeetingDocument } from '@/types';
import { useAuthStore } from '@/stores/auth-store';
import { useUploadMeetingDocument, useDeleteMeetingDocument } from '@/hooks/use-meetings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FileTypeIcon } from '@/components/materials/file-type-icon';

interface MeetingDocumentListProps {
  meetingId: string;
  documents: MeetingDocument[];
}

export function MeetingDocumentList({
  meetingId,
  documents,
}: MeetingDocumentListProps): React.JSX.Element {
  const { t } = useTranslation();
  const isManager = useAuthStore((s) => s.isManager);
  const uploadDocument = useUploadMeetingDocument();
  const deleteDocument = useDeleteMeetingDocument();
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadDocument.mutate(
      { meetingId, file },
      {
        onSuccess: () => {
          toast.success(t('meetings.documentUploadSuccess'));
        },
        onError: () => {
          toast.error(t('meetings.documentUploadError'));
        },
      },
    );
    e.target.value = '';
  }

  function handleDelete(docId: string): void {
    deleteDocument.mutate(
      { meetingId, docId },
      {
        onSuccess: () => {
          toast.success(t('meetings.documentDeleteSuccess'));
          setDeleteDocId(null);
        },
        onError: () => {
          toast.error(t('meetings.documentDeleteError'));
          setDeleteDocId(null);
        },
      },
    );
  }

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
          <div className="flex shrink-0 gap-1">
            {doc.fileUrl ? (
              <Button variant="ghost" size="icon" className="size-8" asChild>
                <a href={doc.fileUrl} download title={t('common.download')}>
                  <Download className="size-4" />
                </a>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                disabled
                title={t('common.download')}
              >
                <Download className="size-4" />
              </Button>
            )}
            {isManager && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive"
                onClick={() => setDeleteDocId(doc.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </div>
      ))}

      {isManager && (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept=".pdf,.docx,.xlsx"
            onChange={handleFileSelect}
            className="max-w-xs text-sm"
            disabled={uploadDocument.isPending}
          />
          {uploadDocument.isPending && (
            <span className="text-xs text-muted-foreground">
              <Upload className="mr-1 inline size-3" />
              {t('meetings.uploadDocument')}
            </span>
          )}
        </div>
      )}

      <AlertDialog open={deleteDocId !== null} onOpenChange={() => setDeleteDocId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('meetings.documentDeleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('meetings.documentDeleteConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteDocId) handleDelete(deleteDocId);
              }}
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
