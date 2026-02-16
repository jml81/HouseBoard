import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import type { Announcement } from '@/types';
import { formatDate } from '@/lib/date-utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnnouncementCategoryBadge } from './category-badge';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Link
            to="/tiedotteet/$id"
            params={{ id: announcement.id }}
            className="hover:text-hb-accent"
          >
            {announcement.title}
          </Link>
          {announcement.isNew && (
            <Badge variant="default" className="bg-hb-accent text-xs">
              {t('common.new')}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AnnouncementCategoryBadge category={announcement.category} />
          <span>{formatDate(announcement.publishedAt)}</span>
        </div>
        <p className="text-sm text-muted-foreground">{announcement.summary}</p>
        <Button variant="link" size="sm" className="h-auto p-0" asChild>
          <Link to="/tiedotteet/$id" params={{ id: announcement.id }}>
            {t('announcements.readMore')}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
