import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { Announcement, AnnouncementCategory } from '@/types';
import { useAuthStore } from '@/stores/auth-store';
import { useCreateAnnouncement, useUpdateAnnouncement } from '@/hooks/use-announcements';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ANNOUNCEMENT_CATEGORIES: AnnouncementCategory[] = [
  'yleinen',
  'huolto',
  'remontti',
  'vesi-sahko',
];

interface AnnouncementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: Announcement;
}

export function AnnouncementFormDialog({
  open,
  onOpenChange,
  announcement,
}: AnnouncementFormDialogProps): React.JSX.Element {
  const { t } = useTranslation();
  const isEdit = Boolean(announcement);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('announcements.editTitle') : t('announcements.createTitle')}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? t('announcements.editDescription') : t('announcements.createDescription')}
          </DialogDescription>
        </DialogHeader>
        {open && <AnnouncementFormBody announcement={announcement} onOpenChange={onOpenChange} />}
      </DialogContent>
    </Dialog>
  );
}

interface FormErrors {
  title?: string;
  summary?: string;
  content?: string;
}

interface AnnouncementFormBodyProps {
  announcement?: Announcement;
  onOpenChange: (open: boolean) => void;
}

function AnnouncementFormBody({
  announcement,
  onOpenChange,
}: AnnouncementFormBodyProps): React.JSX.Element {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const isEdit = Boolean(announcement);

  const [title, setTitle] = useState(announcement?.title ?? '');
  const [summary, setSummary] = useState(announcement?.summary ?? '');
  const [content, setContent] = useState(announcement?.content ?? '');
  const [category, setCategory] = useState<AnnouncementCategory>(
    announcement?.category ?? 'yleinen',
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  function validateForm(): FormErrors {
    const errors: FormErrors = {};
    if (!title.trim()) {
      errors.title = t('announcements.validationTitleRequired');
    }
    if (!summary.trim()) {
      errors.summary = t('announcements.validationSummaryRequired');
    }
    if (!content.trim()) {
      errors.content = t('announcements.validationContentRequired');
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (isEdit && announcement) {
        await updateAnnouncement.mutateAsync({
          id: announcement.id,
          title: title.trim(),
          summary: summary.trim(),
          content: content.trim(),
          category,
        });
        toast.success(t('announcements.updateSuccess'));
      } else {
        await createAnnouncement.mutateAsync({
          title: title.trim(),
          summary: summary.trim(),
          content: content.trim(),
          category,
          author: user?.name ?? '',
        });
        toast.success(t('announcements.createSuccess'));
      }
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? t('announcements.updateError') : t('announcements.createError'));
    }
  }

  const isPending = createAnnouncement.isPending || updateAnnouncement.isPending;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="announcement-title">{t('announcements.formTitle')}</Label>
          <Input id="announcement-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          {formErrors.title && <p className="text-sm text-destructive">{formErrors.title}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t('announcements.formCategory')}</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as AnnouncementCategory)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ANNOUNCEMENT_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {t(`categories.${c}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="announcement-summary">{t('announcements.formSummary')}</Label>
          <Textarea
            id="announcement-summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
          />
          {formErrors.summary && <p className="text-sm text-destructive">{formErrors.summary}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="announcement-content">{t('announcements.formContent')}</Label>
          <Textarea
            id="announcement-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
          {formErrors.content && <p className="text-sm text-destructive">{formErrors.content}</p>}
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button type="submit" className="bg-hb-accent hover:bg-hb-accent/90" disabled={isPending}>
          {isEdit ? t('announcements.update') : t('announcements.submit')}
        </Button>
      </DialogFooter>
    </form>
  );
}
