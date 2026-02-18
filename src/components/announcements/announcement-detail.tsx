import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Announcement } from '@/types';
import { formatDate } from '@/lib/date-utils';
import { useAuthStore } from '@/stores/auth-store';
import { useDeleteAnnouncement } from '@/hooks/use-announcements';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnnouncementCategoryBadge } from './category-badge';
import { AnnouncementFormDialog } from './announcement-form-dialog';

interface AnnouncementDetailProps {
  announcement: Announcement;
}

export function AnnouncementDetail({ announcement }: AnnouncementDetailProps): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isManager = useAuthStore((s) => s.isManager);
  const deleteAnnouncement = useDeleteAnnouncement();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  async function handleDelete(): Promise<void> {
    try {
      await deleteAnnouncement.mutateAsync(announcement.id);
      toast.success(t('announcements.deleteSuccess'));
      setDeleteDialogOpen(false);
      void navigate({ to: '/tiedotteet' });
    } catch {
      toast.error(t('announcements.deleteError'));
    }
  }

  return (
    <div className="p-6">
      <Button variant="ghost" size="sm" className="mb-4 gap-1" asChild>
        <Link to="/tiedotteet">
          <ArrowLeft className="size-4" />
          {t('announcements.backToList')}
        </Link>
      </Button>

      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-hb-primary">
          {announcement.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <AnnouncementCategoryBadge category={announcement.category} />
          <span className="flex items-center gap-1">
            <CalendarDays className="size-4" />
            {t('announcements.publishedAt')}: {formatDate(announcement.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <User className="size-4" />
            {t('announcements.author')}: {announcement.author}
          </span>
        </div>

        <Separator />

        <div className="whitespace-pre-line text-sm leading-relaxed">{announcement.content}</div>

        {isManager && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => setEditDialogOpen(true)}
            >
              <Pencil className="size-4" />
              {t('announcements.editAnnouncement')}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="gap-1"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="size-4" />
              {t('announcements.deleteAnnouncement')}
            </Button>
          </div>
        )}
      </div>

      <AnnouncementFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        announcement={announcement}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('announcements.deleteAnnouncement')}</DialogTitle>
            <DialogDescription>{t('announcements.deleteConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteAnnouncement.isPending}
              onClick={() => {
                void handleDelete();
              }}
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
