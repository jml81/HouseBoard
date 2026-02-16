import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { apartments } from '@/data';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ApartmentTable } from './apartment-table';

const staircases = ['A', 'B', 'C'] as const;

export function ApartmentsPage(): React.JSX.Element {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedStaircase, setSelectedStaircase] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = apartments;

    if (selectedStaircase) {
      result = result.filter((a) => a.staircase === selectedStaircase);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.number.toLowerCase().includes(query) ||
          a.resident.toLowerCase().includes(query) ||
          a.type.toLowerCase().includes(query),
      );
    }

    return result;
  }, [search, selectedStaircase]);

  return (
    <div>
      <PageHeader titleKey="apartments.title" descriptionKey="apartments.description" />

      <div className="space-y-4 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder={t('apartments.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Button
              variant={selectedStaircase === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStaircase(null)}
              className={cn(
                selectedStaircase === null && 'bg-hbplus-accent hover:bg-hbplus-accent/90',
              )}
            >
              {t('apartments.allStaircases')}
            </Button>
            {staircases.map((s) => (
              <Button
                key={s}
                variant={selectedStaircase === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStaircase(selectedStaircase === s ? null : s)}
                className={cn(
                  selectedStaircase === s && 'bg-hbplus-accent hover:bg-hbplus-accent/90',
                )}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {filtered.length} {t('apartments.total')}
        </p>

        {filtered.length === 0 ? (
          <EmptyState title={t('apartments.noResults')} />
        ) : (
          <ApartmentTable apartments={filtered} />
        )}
      </div>
    </div>
  );
}
