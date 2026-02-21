import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Material } from '@/types';
import { formatDate } from '@/lib/date-utils';
import { useAuthStore } from '@/stores/auth-store';
import { useDeleteMaterial } from '@/hooks/use-materials';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { FileTypeIcon } from './file-type-icon';
import { MaterialFormDialog } from './material-form-dialog';

interface MaterialItemProps {
  material: Material;
}

export function MaterialItem({ material }: MaterialItemProps): React.JSX.Element {
  const { t } = useTranslation();
  const isManager = useAuthStore((s) => s.isManager);
  const deleteMaterial = useDeleteMaterial();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleDelete(): Promise<void> {
    try {
      await deleteMaterial.mutateAsync(material.id);
      toast.success(t('materials.deleteSuccess'));
    } catch {
      toast.error(t('materials.deleteError'));
    }
    setDeleteOpen(false);
  }

  return (
    <>
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <FileTypeIcon fileType={material.fileType} className="size-8 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{material.name}</p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <Badge variant="outline" className="text-xs">
              {t(`categories.${material.category}`)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {material.fileType.toUpperCase()} &middot; {material.fileSize}
            </span>
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">
            {t('materials.updated')}: {formatDate(material.updatedAt)}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {isManager && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setEditOpen(true)}
                aria-label={t('materials.editMaterial')}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive"
                onClick={() => setDeleteOpen(true)}
                aria-label={t('materials.deleteMaterial')}
              >
                <Trash2 className="size-4" />
              </Button>
            </>
          )}
          {material.fileUrl ? (
            <Button variant="ghost" size="icon" className="size-8" asChild>
              <a href={material.fileUrl} download title={t('materials.download')}>
                <Download className="size-5" />
              </a>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              disabled
              title={t('materials.download')}
            >
              <Download className="size-5" />
            </Button>
          )}
        </div>
      </div>

      <MaterialFormDialog open={editOpen} onOpenChange={setEditOpen} material={material} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('materials.deleteMaterial')}</AlertDialogTitle>
            <AlertDialogDescription>{t('materials.deleteConfirm')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                void handleDelete();
              }}
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
