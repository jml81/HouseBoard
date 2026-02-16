import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, User, CalendarDays } from 'lucide-react';
import type { Announcement } from '@/types';
import { formatDate } from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AnnouncementCategoryBadge } from './category-badge';

interface AnnouncementDetailProps {
  announcement: Announcement;
}

export function AnnouncementDetail({ announcement }: AnnouncementDetailProps): React.JSX.Element {
  const { t } = useTranslation();

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
      </div>
    </div>
  );
}
