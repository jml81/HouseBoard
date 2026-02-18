import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApartments, useApartmentPayments } from '@/hooks/use-apartments';
import { useAuthStore } from '@/stores/auth-store';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ApartmentTable } from './apartment-table';
import { ApartmentPaymentRow } from './apartment-payment-row';
import { PaymentSummaryBar } from './payment-summary-bar';
import { PaymentFormDialog } from './payment-form-dialog';

const staircases = ['A', 'B', 'C'] as const;

export function ApartmentsPage(): React.JSX.Element {
  const { t } = useTranslation();
  const isManager = useAuthStore((s) => s.isManager);
  const [search, setSearch] = useState('');
  const [selectedStaircase, setSelectedStaircase] = useState<string | null>(null);
  const [createPaymentOpen, setCreatePaymentOpen] = useState(false);
  const { data: apartments = [], isLoading: loadingApts } = useApartments();
  const { data: allPayments = [], isLoading: loadingPay } = useApartmentPayments();
  const isLoading = loadingApts || loadingPay;

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
  }, [apartments, search, selectedStaircase]);

  const filteredPayments = useMemo(() => {
    const filteredIds = new Set(filtered.map((a) => a.id));
    return allPayments.filter((p) => filteredIds.has(p.apartmentId));
  }, [filtered, allPayments]);

  const existingPaymentIds = useMemo(
    () => new Set(allPayments.map((p) => p.apartmentId)),
    [allPayments],
  );

  if (isLoading) {
    return (
      <div>
        <PageHeader titleKey="apartments.title" descriptionKey="apartments.description" />
        <div className="p-6" />
      </div>
    );
  }

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

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">{t('apartments.listView')}</TabsTrigger>
            <TabsTrigger value="payments">{t('apartments.paymentsView')}</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {filtered.length === 0 ? (
              <EmptyState title={t('apartments.noResults')} />
            ) : (
              <ApartmentTable apartments={filtered} />
            )}
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-4">
              {isManager && (
                <Button
                  className="bg-hbplus-accent hover:bg-hbplus-accent/90"
                  onClick={() => setCreatePaymentOpen(true)}
                >
                  {t('apartments.payments.createPayment')}
                </Button>
              )}
              <PaymentSummaryBar payments={filteredPayments} />
              {filtered.length === 0 ? (
                <EmptyState title={t('apartments.noResults')} />
              ) : (
                <div className="space-y-2">
                  {filtered.map((apartment) => {
                    const payment = allPayments.find((p) => p.apartmentId === apartment.id);
                    if (!payment) return null;
                    return (
                      <ApartmentPaymentRow
                        key={apartment.id}
                        apartment={apartment}
                        payment={payment}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <PaymentFormDialog
        open={createPaymentOpen}
        onOpenChange={setCreatePaymentOpen}
        apartments={apartments}
        existingPaymentIds={existingPaymentIds}
      />
    </div>
  );
}
