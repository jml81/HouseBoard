import { useTranslation } from 'react-i18next';
import { useAnnouncements } from '@/hooks/use-announcements';
import { formatDate } from '@/lib/date-utils';

export function DisplayAnnouncementsSlide(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: announcements } = useAnnouncements();
  const latest = announcements?.slice(0, 3) ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <h2 className="text-3xl font-bold text-white">{t('display.announcementsTitle')}</h2>
      {latest.length === 0 ? (
        <p className="text-2xl text-white/60">{t('display.noAnnouncements')}</p>
      ) : (
        <div className="space-y-4">
          {latest.map((announcement) => (
            <div key={announcement.id} className="rounded-lg bg-white/10 p-4">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-2xl font-semibold text-white">{announcement.title}</h3>
                <span className="shrink-0 text-lg text-white/50">
                  {formatDate(announcement.publishedAt)}
                </span>
              </div>
              <p className="mt-2 text-xl text-white/70">{announcement.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
